import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import net from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const baseEnv = { ...process.env, BITSOCIAL_PINNED_NODE_REEXEC: "1", BROWSER: "none" };
for (const name of ["PORTLESS", "PORTLESS_URL", "PORT", "HOST"]) delete baseEnv[name];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitUntil(predicate, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return true;
    await delay(50);
  }
  return false;
}

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

function isListening(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

function groupAlive(pid) {
  try {
    process.kill(-pid, 0);
    return true;
  } catch (error) {
    if (error.code === "ESRCH") return false;
    throw error;
  }
}

// Each script runs in its own process group so a test can signal exactly one PID, and cleanup
// still reaches every descendant it left behind.
function launch(t, script, env = {}) {
  const child = spawn(process.execPath, [path.join(repoRoot, "scripts", script)], {
    cwd: repoRoot,
    env: { ...baseEnv, ...env },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));
  const exited = new Promise((resolve) =>
    child.once("exit", (code, signal) => resolve({ code, signal })),
  );
  t.after(() => {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      /* Already gone. */
    }
  });
  return {
    pid: child.pid,
    output: () => output,
    async waitForOutput(text, timeoutMs = 30_000) {
      const seen = await waitUntil(() => output.includes(text), timeoutMs);
      assert.ok(seen, `${script} never printed "${text}":\n${output}`);
    },
    async waitForExit(timeoutMs) {
      let timer;
      const timeout = new Promise((resolve) => {
        timer = setTimeout(() => resolve(null), timeoutMs);
      });
      try {
        return await Promise.race([exited, timeout]);
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

function fakeBin(t, name, script) {
  const dir = mkdtempSync(path.join(tmpdir(), "dev-servers-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, name);
  writeFileSync(file, script);
  chmodSync(file, 0o755);
  return { dir, log: path.join(dir, `${name}.log`) };
}

function openHmrSocket(port) {
  return new Promise((resolve, reject) => {
    const request = http.request({
      host: "127.0.0.1",
      port,
      path: "/",
      headers: {
        Connection: "Upgrade",
        Upgrade: "websocket",
        "Sec-WebSocket-Key": "dGhlIHNhbXBsZSBub25jZQ==",
        "Sec-WebSocket-Version": "13",
        "Sec-WebSocket-Protocol": "vite-hmr",
      },
    });
    request.once("upgrade", (_response, socket) => resolve(socket));
    request.once("response", (response) =>
      reject(new Error(`HMR upgrade refused with ${response.statusCode}`)),
    );
    request.once("error", reject);
    request.end();
  });
}

test("about dev server stops on SIGINT while a browser tab holds an HMR connection", async (t) => {
  const port = await freePort();
  const server = launch(t, "start-about-server.mjs", { PORT: String(port), HOST: "127.0.0.1" });
  await server.waitForOutput("Host URL");
  const socket = await openHmrSocket(port);
  t.after(() => socket.destroy());

  process.kill(server.pid, "SIGINT");

  // Rolldown's signal-exit hook can turn the re-raised signal into a plain exit, so only
  // assert that the server is gone.
  assert.ok(await server.waitForExit(10_000), `about server ignored SIGINT:\n${server.output()}`);
});

for (const launcher of ["start-dev.mjs", "start-chain.mjs"]) {
  test(`${launcher} stops its dev server when only the launcher is signalled`, async (t) => {
    const port = await freePort();
    const run = launch(t, launcher, { PORTLESS: "0", PORT: String(port), HOST: "127.0.0.1" });
    await run.waitForOutput("Host URL");

    process.kill(run.pid, "SIGTERM");

    const stopped = await waitUntil(() => !groupAlive(run.pid), 10_000);
    assert.ok(stopped, `${launcher} left its server running:\n${run.output()}`);
  });
}

test("start-docs stops the docs build when only the launcher is signalled", async (t) => {
  const yarn = fakeBin(
    t,
    "yarn",
    `#!/bin/sh
trap 'echo "TERM $*" >> "$FAKE_LOG"; exit 143' TERM
echo "run $*" >> "$FAKE_LOG"
while :; do sleep 0.1; done
`,
  );
  const port = await freePort();
  const run = launch(t, "start-docs.mjs", {
    PORTLESS: "0",
    PORT: String(port),
    PATH: `${yarn.dir}${path.delimiter}${process.env.PATH}`,
    FAKE_LOG: yarn.log,
  });
  const building = await waitUntil(
    () => existsSync(yarn.log) && readFileSync(yarn.log, "utf8").includes("run docs:build"),
    10_000,
  );
  assert.ok(building, `start-docs never started the docs build:\n${run.output()}`);

  process.kill(run.pid, "SIGTERM");

  const stopped = await waitUntil(() => !groupAlive(run.pid), 10_000);
  assert.ok(stopped, `start-docs left the docs build running:\n${run.output()}`);
  assert.match(readFileSync(yarn.log, "utf8"), /^TERM docs:build$/m);
});

test("start-stats stops the containers when interrupted while the dashboard warms up", async (t) => {
  if (await isListening(3302)) {
    t.skip("a stats dashboard is already listening on 127.0.0.1:3302");
    return;
  }
  const envFile = path.join(repoRoot, "stats/.env");
  if (!existsSync(envFile)) t.after(() => rmSync(envFile, { force: true }));
  const docker = fakeBin(t, "docker", `#!/bin/sh\necho "$*" >> "$FAKE_LOG"\n`);
  const run = launch(t, "start-stats.mjs", {
    PATH: `${docker.dir}${path.delimiter}${process.env.PATH}`,
    FAKE_LOG: docker.log,
  });
  await run.waitForOutput("Waiting for the stats dashboard");

  process.kill(run.pid, "SIGINT");

  assert.ok(await run.waitForExit(10_000), `start-stats did not exit:\n${run.output()}`);
  assert.match(readFileSync(docker.log, "utf8"), /^compose -f \S+ stop$/m);
});
