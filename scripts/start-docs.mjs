#!/usr/bin/env node

import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  ensurePortlessProxy,
  ensurePinnedNodeVersion,
  getPortlessAppName,
  getPortlessPublicUrl,
  isWindows,
  portlessEnv,
  portlessBin,
  recordDevServerUrl,
  repoRoot,
  spawnDevServer,
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
let releaseUrlRecord;

if (docsStartMode && docsStartMode !== "live" && docsStartMode !== "multilocale") {
  console.error(`Invalid docs start mode: ${docsStartMode}`);
  process.exit(1);
}

if (docsStartMode) {
  childEnv.DOCS_START_MODE = docsStartMode;
}

if (command === portlessBin) {
  ensurePortlessProxy();
  const appName = getPortlessAppName("docs.bitsocial");
  const publicUrl = getPortlessPublicUrl(appName);

  args = [appName, process.execPath, docsServerScript];
  releaseUrlRecord = recordDevServerUrl("docs", publicUrl);

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

spawnDevServer(
  command,
  args,
  {
    cwd: repoRoot,
    env: command === portlessBin ? { ...portlessEnv, ...childEnv } : childEnv,
    stdio: "inherit",
  },
  releaseUrlRecord,
);
