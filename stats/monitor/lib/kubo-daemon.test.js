import assert from "node:assert/strict";
import { once } from "node:events";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnAsync, startIpfsDaemon } from "./kubo-daemon.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const settlesWithin = async (promise, ms, message) => {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(Error(message)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
};

const waitFor = async (condition, message, timeoutMs = 5000) => {
  const start = Date.now();
  while (!condition()) {
    if (Date.now() - start > timeoutMs) {
      throw Error(message);
    }
    await sleep(10);
  }
};

const missingIpfsPath = path.join(os.tmpdir(), "bitsocial-stats-missing-kubo", "ipfs");

// a stand-in for the kubo binary: prints the ready line kubo prints, then runs `then`
const createFakeIpfs = async (t, then) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "bitsocial-stats-fake-kubo-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const ipfsPath = path.join(dir, "ipfs");
  await fs.writeFile(ipfsPath, `#!/bin/sh\necho "Daemon is ready"\n${then}\n`, { mode: 0o755 });
  return ipfsPath;
};

// fake kubo rpc answering the supervisor's healthcheck with `server.body`
const healthyBody = { Identity: { ID: "peer" } };
const startHealthcheck = async (t) => {
  const server = http.createServer((req, res) => {
    server.requests++;
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(server.body));
  });
  server.body = healthyBody;
  server.requests = 0;
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  return server;
};

test("spawnAsync rejects when the command can't be spawned", async () => {
  await assert.rejects(
    settlesWithin(spawnAsync(missingIpfsPath, ["init"]), 2000, "spawnAsync never settled"),
    { code: "ENOENT" },
  );
});

test("startIpfsDaemon rejects when the daemon can't be spawned and leaves nothing running", async () => {
  const exitListeners = process.listenerCount("exit");
  const kills = [];
  await assert.rejects(
    settlesWithin(
      startIpfsDaemon({
        ipfsPath: missingIpfsPath,
        env: {},
        ipfsApiPort: 1,
        healthcheckIntervalMs: 20,
        kill: (pid) => kills.push(pid),
      }),
      2000,
      "startIpfsDaemon never settled",
    ),
    { code: "ENOENT" },
  );
  await sleep(100);
  assert.deepEqual(kills, [], "a healthcheck kept running for the failed spawn");
  assert.equal(process.listenerCount("exit"), exitListeners);
});

test("startIpfsDaemon stops its healthcheck and exit listener once the daemon exits", async (t) => {
  const healthcheck = await startHealthcheck(t);
  const ipfsPath = await createFakeIpfs(t, "sleep 0.2");
  const exitListeners = process.listenerCount("exit");
  const kills = [];

  await startIpfsDaemon({
    ipfsPath,
    env: { PATH: process.env.PATH },
    ipfsApiPort: healthcheck.address().port,
    healthcheckIntervalMs: 20,
    kill: (pid) => kills.push(pid),
  });
  await waitFor(() => healthcheck.requests > 0, "the healthcheck never ran");
  await sleep(500);
  const requestsAfterExit = healthcheck.requests;
  await sleep(200);

  assert.equal(healthcheck.requests, requestsAfterExit, "the healthcheck outlived the daemon");
  assert.equal(process.listenerCount("exit"), exitListeners);
  assert.deepEqual(kills, []);
});

test("startIpfsDaemon kills a daemon whose rpc healthcheck fails", async (t) => {
  const healthcheck = await startHealthcheck(t);
  const ipfsPath = await createFakeIpfs(t, "exec sleep 5");
  const exitListeners = process.listenerCount("exit");
  const kills = [];

  await startIpfsDaemon({
    ipfsPath,
    env: { PATH: process.env.PATH },
    ipfsApiPort: healthcheck.address().port,
    healthcheckIntervalMs: 20,
    kill: (pid) => {
      kills.push(pid);
      // only signal the fake daemon itself, never its pid + 1
      if (kills.length === 1) {
        process.kill(pid);
      }
    },
  });
  healthcheck.body = {};
  await waitFor(() => kills.length > 0, "the failing healthcheck never killed the daemon");
  await sleep(200);
  const killsAfterExit = kills.length;
  await sleep(200);

  assert.equal(kills[1], kills[0] + 1);
  assert.equal(
    kills.length,
    killsAfterExit,
    "the healthcheck kept killing after the daemon exited",
  );
  assert.equal(process.listenerCount("exit"), exitListeners);
});
