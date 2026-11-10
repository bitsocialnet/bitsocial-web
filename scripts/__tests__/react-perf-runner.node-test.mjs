import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitUntil(predicate, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return true;
    await delay(20);
  }
  return false;
}

test("a repeated interrupt still lets the runner close its browser and write the report", async (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), "react-perf-runner-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const log = path.join(dir, "wrapper.log");
  // Stands in for `bash scripts/pw-session.sh ...`: the browser launch takes a moment, then fails.
  const bash = path.join(dir, "bash");
  writeFileSync(
    bash,
    `#!/bin/sh
echo "$2" >> "$FAKE_LOG"
case "$2" in
  open) sleep 1; exit 1 ;;
esac
exit 0
`,
  );
  chmodSync(bash, 0o755);
  const output = path.join(dir, "out");
  const runner = spawn(
    process.execPath,
    [path.join(repoRoot, "scripts/react-perf/runner.mjs"), "selftest", "--output", output],
    {
      cwd: repoRoot,
      env: { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH}`, FAKE_LOG: log },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  t.after(() => runner.kill("SIGKILL"));
  let stderr = "";
  runner.stderr.on("data", (chunk) => (stderr += chunk));
  const exited = new Promise((resolve) =>
    runner.once("exit", (code, signal) => resolve({ code, signal })),
  );
  assert.ok(await waitUntil(() => existsSync(log), 10_000), "the runner never opened a browser");

  runner.kill("SIGINT");
  await delay(200);
  runner.kill("SIGINT");

  assert.deepEqual(await exited, { code: 1, signal: null }, stderr);
  assert.deepEqual(readFileSync(log, "utf8").trim().split("\n"), ["open", "close"]);
  assert.ok(existsSync(path.join(output, "report.json")), "report.json was not written");
});
