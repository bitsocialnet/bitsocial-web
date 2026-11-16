import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const wrapper = fileURLToPath(new URL("../pw-session.sh", import.meta.url));

// Lists every session with a file in $FAKE_DIR/open. `open` blocks while hold-<session> exists,
// like a browser that is still launching, and `list` runs $FAKE_DIR/on-list once if present.
const fakeCli = `#!/bin/sh
case "$1" in
  list)
    if [ -f "$FAKE_DIR/on-list" ]; then
      mv "$FAKE_DIR/on-list" "$FAKE_DIR/on-list.running"
      sh "$FAKE_DIR/on-list.running"
    fi
    for file in "$FAKE_DIR"/open/*; do
      [ -e "$file" ] && printf -- '- %s:\\n  - status: open\\n' "$(basename "$file")"
    done
    exit 0
    ;;
esac
session="\${1#-s=}"
case "$2" in
  open)
    while [ -e "$FAKE_DIR/hold-$session" ]; do sleep 0.05; done
    touch "$FAKE_DIR/open/$session"
    ;;
  close) rm -f "$FAKE_DIR/open/$session" ;;
esac
exit 0
`;

function fixture(t) {
  const dir = mkdtempSync(path.join(tmpdir(), "pw-session-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(path.join(dir, "open"));
  const cli = path.join(dir, "playwright-cli");
  writeFileSync(cli, fakeCli);
  chmodSync(cli, 0o755);
  const lock = path.join(dir, "lock");
  const env = {
    ...process.env,
    FAKE_DIR: dir,
    PLAYWRIGHT_CLI_BIN: cli,
    PLAYWRIGHT_RESOURCE_LOCK_DIR: lock,
    PW_SESSION_POLL_SECONDS: "1",
  };
  return {
    dir,
    lock,
    run: (...args) => spawnSync("bash", [wrapper, ...args], { env, encoding: "utf8" }),
    start: (...args) => {
      const child = spawn("bash", [wrapper, ...args], { env, stdio: "ignore" });
      t.after(() => child.kill("SIGKILL"));
      return new Promise((resolve) => child.once("exit", (code) => resolve(code)));
    },
    owner: () => (existsSync(lock) ? readFileSync(path.join(lock, "owner"), "utf8").trim() : null),
  };
}

async function waitUntil(predicate, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return true;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  return false;
}

function writeLock(lock, owner, openerPid) {
  mkdirSync(lock);
  writeFileSync(path.join(lock, "owner"), `${owner}\n`);
  writeFileSync(path.join(lock, "started-at"), "2026-01-01T00:00:00Z\n");
  if (openerPid) writeFileSync(path.join(lock, "opener-pid"), `${openerPid}\n`);
}

function exitedPid() {
  return spawnSync("true").pid;
}

test("a browser that is still launching keeps the slot", async (t) => {
  const slot = fixture(t);
  writeFileSync(path.join(slot.dir, "hold-first"), "");
  const opened = slot.start("open", "first");
  assert.ok(await waitUntil(() => existsSync(path.join(slot.lock, "owner"))));

  const contender = slot.run("open", "second");

  assert.equal(contender.status, 75, contender.stderr);
  assert.equal(slot.owner(), "first");
  rmSync(path.join(slot.dir, "hold-first"));
  assert.equal(await opened, 0);
  assert.equal(slot.run("close", "first").status, 0);
  assert.equal(existsSync(slot.lock), false);
});

test("a lock whose opener exited without a browser is reclaimed", (t) => {
  const slot = fixture(t);
  writeLock(slot.lock, "first", exitedPid());

  const contender = slot.run("open", "second");

  assert.equal(contender.status, 0, contender.stderr);
  assert.equal(slot.owner(), "second");
});

test("a lock directory without an owner yet is held until it goes stale", (t) => {
  const slot = fixture(t);
  mkdirSync(slot.lock);

  assert.equal(slot.run("open", "second").status, 75);

  const minuteAgo = new Date(Date.now() - 60_000);
  utimesSync(slot.lock, minuteAgo, minuteAgo);
  const contender = slot.run("open", "second");
  assert.equal(contender.status, 0, contender.stderr);
  assert.equal(slot.owner(), "second");
});

test("reclaiming never deletes a lock that changed hands after it was judged stale", (t) => {
  const slot = fixture(t);
  const launching = spawn("bash", ["-c", "exec -a pw-session-launching sleep 30"]);
  t.after(() => launching.kill("SIGKILL"));
  writeLock(slot.lock, "stale", exitedPid());
  // Between the contender's verdict and its rename, another reclaimer replaces the stale lock
  // with its own and starts launching a browser.
  writeFileSync(
    path.join(slot.dir, "on-list"),
    `rm -rf "${slot.lock}"
mkdir "${slot.lock}"
echo fresh > "${slot.lock}/owner"
echo ${launching.pid} > "${slot.lock}/opener-pid"
`,
  );

  const contender = slot.run("open", "second");

  assert.equal(contender.status, 75, contender.stderr);
  assert.equal(slot.owner(), "fresh");
});
