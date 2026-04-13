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
const aboutServerScript = path.join(__dirname, "start-about-server.mjs");
const usePortless = process.env.PORTLESS !== "0" && !isWindows;
const command = usePortless && existsSync(portlessBin) ? portlessBin : process.execPath;
const childEnv = {
  ...process.env,
};
let args = [];

if (command === portlessBin) {
  const appName = getPortlessAppName("bitsocial");
  const publicUrl = getPortlessPublicUrl(appName);
  const docsAppName = getPortlessAppName("docs.bitsocial");

  args = [appName, process.execPath, aboutServerScript];
  childEnv.DOCS_DEV_PROXY_TARGET = getPortlessPublicUrl(docsAppName);

  if (appName !== "bitsocial") {
    console.log(`Starting Portless dev server at ${publicUrl}`);
  }
} else if (process.env.PORTLESS !== "0") {
  console.warn("portless unavailable on this platform, using the about SSR dev server directly");
  childEnv.PORTLESS = "0";
  args = [aboutServerScript];
} else {
  args = [aboutServerScript];
}

const child = spawn(command, args, {
  cwd: repoRoot,
  stdio: "inherit",
  env: childEnv,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
