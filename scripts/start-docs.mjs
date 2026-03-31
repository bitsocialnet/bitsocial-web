#!/usr/bin/env node

import { spawn } from "node:child_process";
import process from "node:process";
import { isWindows, repoRoot, resolvePort } from "./dev-server-utils.mjs";

const yarnBin = isWindows ? "yarn.cmd" : "yarn";
const fallbackPort = Number(process.env.DOCS_PORT || 3001);
const requestedPort = Number(process.env.PORT || fallbackPort);
const host = process.env.HOST || "127.0.0.1";
const usingPortless = Boolean(process.env.PORTLESS_URL);

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!Number.isInteger(requestedPort) || requestedPort <= 0) {
  fail(`Invalid docs port: ${process.env.PORT || process.env.DOCS_PORT || "undefined"}`);
}

const port = usingPortless ? requestedPort : await resolvePort(requestedPort);

console.log("");
console.log(`Starting docs preview from ${repoRoot}`);
if (usingPortless) {
  console.log(`Public URL: ${process.env.PORTLESS_URL}`);
}
console.log(`Host URL: http://${host}:${port}`);
if (!usingPortless && port !== requestedPort) {
  console.log(`Preferred port ${requestedPort} is busy, so this run will use ${port}.`);
}
console.log("");

const child = spawn(
  yarnBin,
  ["--cwd", "docs-site", "start", "--host", host, "--port", String(port)],
  {
    cwd: repoRoot,
    env: {
      ...process.env,
      HOST: host,
      PORT: String(port),
    },
    stdio: "inherit",
  },
);

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

const onSigint = () => forwardSignal("SIGINT");
const onSigterm = () => forwardSignal("SIGTERM");

process.on("SIGINT", onSigint);
process.on("SIGTERM", onSigterm);

child.on("exit", (code, signal) => {
  process.off("SIGINT", onSigint);
  process.off("SIGTERM", onSigterm);

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
