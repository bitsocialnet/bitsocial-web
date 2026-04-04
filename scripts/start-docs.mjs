#!/usr/bin/env node

import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  ensurePinnedNodeVersion,
  getPortlessAppName,
  getPortlessPublicUrl,
  isWindows,
  portlessBin,
  repoRoot,
} from "./dev-server-utils.mjs";

await ensurePinnedNodeVersion(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usePortless = process.env.PORTLESS !== "0" && !isWindows;
const docsServerScript = path.join(__dirname, "start-docs-server.mjs");
const modeArg = process.argv.find((arg) => arg.startsWith("--mode="));
const docsStartMode = modeArg ? modeArg.slice("--mode=".length) : undefined;
const command = usePortless && existsSync(portlessBin) ? portlessBin : process.execPath;
const childEnv = {
  ...process.env,
};
let args = [];

if (docsStartMode && docsStartMode !== "live" && docsStartMode !== "multilocale") {
  console.error(`Invalid docs start mode: ${docsStartMode}`);
  process.exit(1);
}

if (docsStartMode) {
  childEnv.DOCS_START_MODE = docsStartMode;
}

if (command === portlessBin) {
  const appName = getPortlessAppName("docs.bitsocial");
  const publicUrl = getPortlessPublicUrl(appName);

  args = [appName, process.execPath, docsServerScript];

  if (appName !== "docs.bitsocial") {
    console.log(`Starting Portless docs server at ${publicUrl}`);
  }
} else if (process.env.PORTLESS !== "0") {
  console.warn("portless unavailable on this platform, using docs directly");
  childEnv.PORTLESS = "0";
  args = [docsServerScript];
} else {
  args = [docsServerScript];
}

const child = spawn(command, args, {
  cwd: repoRoot,
  env: childEnv,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
