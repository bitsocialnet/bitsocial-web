import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
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
