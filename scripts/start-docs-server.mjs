#!/usr/bin/env node

import { spawn } from "node:child_process";
import process from "node:process";
import { isWindows, repoRoot, resolvePort } from "./dev-server-utils.mjs";

const yarnBin = isWindows ? "yarn.cmd" : "yarn";
const fallbackPort = Number(process.env.DOCS_PORT || 3001);
const requestedPort = Number(process.env.PORT || fallbackPort);
const host = process.env.HOST || "127.0.0.1";
const usingPortless = Boolean(process.env.PORTLESS_URL);
const docsStartMode = process.env.DOCS_START_MODE === "live" ? "live" : "multilocale";
let activeChild = null;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!Number.isInteger(requestedPort) || requestedPort <= 0) {
  fail(`Invalid docs port: ${process.env.PORT || process.env.DOCS_PORT || "undefined"}`);
}

const port = usingPortless ? requestedPort : await resolvePort(requestedPort);

function spawnChild(args) {
  return spawn(yarnBin, args, {
    cwd: repoRoot,
    env: {
      ...process.env,
      HOST: host,
      PORT: String(port),
    },
    stdio: "inherit",
  });
}

function runStep(args) {
  console.log(`Running: ${yarnBin} ${args.join(" ")}`);

  return new Promise((resolve, reject) => {
    const child = spawnChild(args);
    activeChild = child;

    child.on("exit", (code, signal) => {
      if (activeChild === child) {
        activeChild = null;
      }

      if (signal) {
        reject(new Error(`Command exited with signal ${signal}: ${yarnBin} ${args.join(" ")}`));
        return;
      }

      if ((code ?? 0) !== 0) {
        reject(new Error(`Command exited with code ${code ?? 0}: ${yarnBin} ${args.join(" ")}`));
        return;
      }

      resolve();
    });
  });
}
console.log("");
console.log(`Starting docs preview from ${repoRoot}`);
if (usingPortless) {
  console.log(`Public URL: ${process.env.PORTLESS_URL}`);
}
console.log(`Host URL: http://${host}:${port}`);
if (!usingPortless && port !== requestedPort) {
  console.log(`Preferred port ${requestedPort} is busy, so this run will use ${port}.`);
}
if (docsStartMode === "live") {
  console.log(
    "Using Docusaurus live dev server (single-locale preview). Use `yarn start:docs` for the built multi-locale Pagefind preview.",
  );
} else {
  console.log(
    "Using built multi-locale preview so localized docs routes and Pagefind resolve locally. Run `yarn start:docs:live` for faster single-locale HMR.",
  );
}
console.log("");

if (docsStartMode === "multilocale") {
  await runStep(["docs:build"]);
}

const childArgs =
  docsStartMode === "live"
    ? ["--cwd", "docs", "start", "--host", host, "--port", String(port)]
    : [
        "--cwd",
        "docs",
        "serve",
        "--dir",
        "../dist/docs",
        "--no-open",
        "--host",
        host,
        "--port",
        String(port),
      ];

console.log(`Running: ${yarnBin} ${childArgs.join(" ")}`);

const child = spawnChild(childArgs);
activeChild = child;

const forwardSignal = (signal) => {
  if (activeChild && !activeChild.killed) {
    activeChild.kill(signal);
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
