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
const aboutViteConfig = path.join("about", "vite.config.ts");
const usePortless = process.env.PORTLESS !== "0" && !isWindows;
const binDir = path.join(repoRoot, "node_modules", ".bin");
const executableSuffix = isWindows ? ".cmd" : "";
const viteBin = path.join(binDir, `vite${executableSuffix}`);
const command = usePortless && existsSync(portlessBin) ? portlessBin : viteBin;
const childEnv = {
  ...process.env,
};
let args = [];

if (command === portlessBin) {
  const appName = getPortlessAppName("bitsocial");
  const publicUrl = getPortlessPublicUrl(appName);
  const docsAppName = getPortlessAppName("docs.bitsocial");

  args = [appName, "vite", "--config", aboutViteConfig];
  childEnv.DOCS_DEV_PROXY_TARGET = getPortlessPublicUrl(docsAppName);

  if (appName !== "bitsocial") {
    console.log(`Starting Portless dev server at ${publicUrl}`);
  }
} else if (process.env.PORTLESS !== "0") {
  console.warn("portless unavailable on this platform, using vite directly");
  childEnv.PORTLESS = "0";
  args = ["--config", aboutViteConfig];
} else {
  args = ["--config", aboutViteConfig];
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
