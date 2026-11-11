import assert from "node:assert/strict";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import http from "node:http";
import net from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const baseEnv = { ...process.env, BITSOCIAL_PINNED_NODE_REEXEC: "1", BROWSER: "none" };
for (const name of [
  "PORTLESS",
  "PORTLESS_URL",
  "PORT",
  "HOST",
  "DOCS_DEV_PROXY_TARGET",
  "DOCS_DEV_URL_FILE",
]) {
  delete baseEnv[name];
}

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
function launch(t, script, env = {}, root = repoRoot) {
  const child = spawn(process.execPath, [path.join(root, "scripts", script)], {
    cwd: root,
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

// Copies the launchers into a scratch checkout whose node_modules/.bin/portless is a stub: `list`
// prints the routes in $FAKE_ROUTES, and running an app logs its name and the docs hand-off env.
// `run` waits for a launcher whose app exits at once; `start` leaves the app running.
function portlessCheckout(t, branch) {
  const root = mkdtempSync(path.join(tmpdir(), "dev-servers-portless-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(path.join(root, "scripts"));
  for (const file of ["dev-server-utils.mjs", "start-dev.mjs", "start-docs.mjs"]) {
    copyFileSync(path.join(repoRoot, "scripts", file), path.join(root, "scripts", file));
  }
  mkdirSync(path.join(root, "node_modules/.bin"), { recursive: true });
  const portless = path.join(root, "node_modules/.bin/portless");
  writeFileSync(
    portless,
    `#!/bin/sh
case "$1" in
  proxy) exit 0 ;;
  list) cat "$FAKE_ROUTES"; exit 0 ;;
esac
printf '%s|%s|%s\\n' "$1" "$DOCS_DEV_PROXY_TARGET" "$DOCS_DEV_URL_FILE" >> "$FAKE_LOG"
[ -n "$FAKE_STAY_UP" ] || exit 0
trap 'echo TERM >> "$FAKE_SIGNALS"; exit 143' TERM
trap 'echo HUP >> "$FAKE_SIGNALS"; exit 129' HUP
while :; do sleep 0.1; done
`,
  );
  chmodSync(portless, 0o755);
  execFileSync("git", ["init", "--quiet", "--initial-branch", branch], { cwd: root });
  const routes = path.join(root, "routes");
  const log = path.join(root, "apps.log");
  const signalLog = path.join(root, "signals.log");
  writeFileSync(routes, "");
  const env = { FAKE_ROUTES: routes, FAKE_LOG: log, FAKE_SIGNALS: signalLog };
  const appLines = () => (existsSync(log) ? readFileSync(log, "utf8").trim().split("\n") : []);
  const lastApp = () => {
    const [name, docsTarget, docsUrlFile] = appLines().at(-1).split("|");
    return { name, docsTarget, docsUrlFile };
  };
  const run = (script) => {
    const result = spawnSync(process.execPath, [path.join(root, "scripts", script)], {
      cwd: root,
      env: { ...baseEnv, ...env },
      encoding: "utf8",
      timeout: 30_000,
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return lastApp();
  };
  const start = async (script) => {
    const before = appLines().length;
    const launcher = launch(t, script, { ...env, FAKE_STAY_UP: "1" }, root);
    const started = await waitUntil(() => appLines().length > before, 10_000);
    assert.ok(started, `${script} never started its app:\n${launcher.output()}`);
    return { ...launcher, ...lastApp() };
  };
  const urlRecord = (name) => path.join(root, ".dev-servers", `${name}-url`);
  const signals = () => (existsSync(signalLog) ? readFileSync(signalLog, "utf8").trim() : "");
  return { routes, run, start, urlRecord, signals };
}

for (const [branch, docsHost] of [
  ["master", "docs.bitsocial.localhost"],
  ["feature/new-page", "feature-new-page.docs.bitsocial.localhost"],
]) {
  test(`about server on ${branch} redirects /docs to the docs host the running docs server claimed`, async (t) => {
    const checkout = portlessCheckout(t, branch);
    const docs = await checkout.start("start-docs.mjs");
    assert.equal(`${docs.name}.localhost`, docsHost);
    writeFileSync(checkout.routes, `https://${docsHost}  ->  localhost:4321  (pid 1)\n`);

    const about = checkout.run("start-dev.mjs");

    // Same precedence as docsDevRedirectOrigin() in about/vite.config.ts.
    const recorded = about.docsUrlFile ? readFileSync(about.docsUrlFile, "utf8").trim() : "";
    assert.equal(about.docsTarget || recorded, `https://${docsHost}`);
  });
}

// Once a server stops, its host can be claimed by another checkout, so a leftover record would
// send /docs (or agent-init) there.
for (const [launcher, record] of [
  ["start-docs.mjs", "docs"],
  ["start-dev.mjs", "about"],
]) {
  test(`${launcher} removes its URL record when its server stops, but not a newer launcher's`, async (t) => {
    const checkout = portlessCheckout(t, "master");
    const file = checkout.urlRecord(record);

    const first = await checkout.start(launcher);
    assert.ok(existsSync(file), `${launcher} recorded no URL:\n${first.output()}`);
    process.kill(first.pid, "SIGTERM");
    assert.ok(await first.waitForExit(10_000), `${launcher} did not exit:\n${first.output()}`);
    assert.equal(existsSync(file), false, `${launcher} left its ${record} URL record behind`);

    const second = await checkout.start(launcher);
    writeFileSync(file, "https://newer.bitsocial.localhost\n");
    process.kill(second.pid, "SIGTERM");
    assert.ok(await second.waitForExit(10_000), `${launcher} did not exit:\n${second.output()}`);
    assert.equal(readFileSync(file, "utf8"), "https://newer.bitsocial.localhost\n");
  });

  // `kill -HUP` reaches the launcher alone; closing its terminal sends SIGHUP to its whole group.
  // Portless only removes its route and stops its detached server on SIGINT or SIGTERM.
  test(`${launcher} stops its server with SIGTERM and removes its URL record on SIGHUP`, async (t) => {
    const checkout = portlessCheckout(t, "master");
    const file = checkout.urlRecord(record);

    const alone = await checkout.start(launcher);
    process.kill(alone.pid, "SIGHUP");
    const stopped = await waitUntil(() => !groupAlive(alone.pid), 10_000);
    assert.ok(stopped, `${launcher} left its server running after SIGHUP:\n${alone.output()}`);
    assert.equal(checkout.signals(), "TERM");
    assert.equal(existsSync(file), false, `${launcher} left its ${record} URL record behind`);

    const group = await checkout.start(launcher);
    process.kill(-group.pid, "SIGHUP");
    assert.ok(await group.waitForExit(10_000), `${launcher} did not exit:\n${group.output()}`);
    assert.equal(
      existsSync(file),
      false,
      `${launcher} left its ${record} URL record behind when its terminal closed`,
    );
  });
}

test("about dev server reads the recorded docs URL on every /docs request", async (t) => {
  const record = path.join(mkdtempSync(path.join(tmpdir(), "dev-servers-docs-url-")), "docs-url");
  t.after(() => rmSync(path.dirname(record), { recursive: true, force: true }));
  const port = await freePort();
  const server = launch(t, "start-about-server.mjs", {
    PORT: String(port),
    HOST: "127.0.0.1",
    DOCS_DEV_URL_FILE: record,
  });
  await server.waitForOutput("Host URL");
  const docsRedirect = () =>
    new Promise((resolve, reject) => {
      http
        .get(`http://127.0.0.1:${port}/docs/getting-started`, (response) => {
          response.resume();
          resolve(`${response.statusCode} ${response.headers.location}`);
        })
        .once("error", reject);
    });

  writeFileSync(record, "https://feature.docs.bitsocial-2.localhost\n");
  assert.equal(
    await docsRedirect(),
    "308 https://feature.docs.bitsocial-2.localhost/getting-started",
  );
  writeFileSync(record, "https://feature.docs.bitsocial.localhost\n");
  assert.equal(
    await docsRedirect(),
    "308 https://feature.docs.bitsocial.localhost/getting-started",
  );
});

// Runs agent-init.sh in a scratch repository with a stub `corepack` standing in for `yarn start`.
function agentInit(t, corepackScript, env = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "dev-servers-agent-init-"));
  execFileSync("git", ["init", "--quiet"], { cwd: root });
  const bin = path.join(root, "bin");
  mkdirSync(bin);
  writeFileSync(path.join(bin, "corepack"), corepackScript);
  chmodSync(path.join(bin, "corepack"), 0o755);
  const pidFile = path.join(root, "server.pid");
  t.after(() => {
    if (existsSync(pidFile)) {
      try {
        process.kill(Number(readFileSync(pidFile, "utf8")), "SIGKILL");
      } catch {
        /* Already gone. */
      }
    }
    rmSync(root, { recursive: true, force: true });
  });
  const child = spawn("bash", [path.join(repoRoot, "scripts/agent-init.sh")], {
    cwd: root,
    env: {
      ...baseEnv,
      ...env,
      PATH: `${bin}${path.delimiter}${process.env.PATH}`,
      AGENT_START_LOG: path.join(root, "start.log"),
      SERVER_PID_FILE: pidFile,
      FAKE_LOG: path.join(root, "server.log"),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));
  const exited = new Promise((resolve) => child.once("exit", (code) => resolve(code)));
  return { root, exited, output: () => output, serverLog: path.join(root, "server.log") };
}

test("agent-init stops the dev server it started when the server never becomes ready", async (t) => {
  const run = agentInit(
    t,
    `#!/bin/sh
echo $$ > "$SERVER_PID_FILE"
trap 'echo stopped >> "$FAKE_LOG"; exit 143' TERM
echo started >> "$FAKE_LOG"
while :; do sleep 0.1; done
`,
    { AGENT_INIT_TIMEOUT_SECONDS: "1" },
  );

  assert.equal(await run.exited, 1, run.output());
  const stopped = await waitUntil(
    () => existsSync(run.serverLog) && readFileSync(run.serverLog, "utf8").includes("stopped"),
    5_000,
  );
  assert.ok(stopped, `agent-init left its dev server running:\n${run.output()}`);
});

test("agent-init waits for the URL the about launcher recorded", async (t) => {
  const server = http.createServer((_request, response) =>
    response.end("<title>Bitsocial</title>"),
  );
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const run = agentInit(
    t,
    `#!/bin/sh
echo $$ > "$SERVER_PID_FILE"
sleep 0.5
mkdir -p .dev-servers
echo "$FAKE_URL" > .dev-servers/about-url
while :; do sleep 0.1; done
`,
    {
      AGENT_INIT_TIMEOUT_SECONDS: "10",
      FAKE_URL: `http://127.0.0.1:${server.address().port}`,
    },
  );

  assert.equal(await run.exited, 0, run.output());
  assert.match(run.output(), /Dev server is ready/);
});
