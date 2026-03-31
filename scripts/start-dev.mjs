#!/usr/bin/env node

import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const aboutViteConfig = path.join("about", "vite.config.ts");
const isWindows = process.platform === "win32";
const usePortless = process.env.PORTLESS !== "0" && !isWindows;
const binDir = path.join(repoRoot, "node_modules", ".bin");
const executableSuffix = isWindows ? ".cmd" : "";
const portlessBin = path.join(binDir, `portless${executableSuffix}`);
const viteBin = path.join(binDir, `vite${executableSuffix}`);

function sanitizeLabel(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function getCurrentBranch() {
  const result = spawnSync("git", ["branch", "--show-current"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    return null;
  }

  return result.stdout.trim() || null;
}

function isCanonicalRouteBusy() {
  const result = spawnSync(portlessBin, ["list"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
  });

  if (result.status !== 0) {
    return false;
  }

  return result.stdout.includes("http://bitsocial.localhost:1355");
}

function getPortlessAppName() {
  const branch = getCurrentBranch();
  const branchLabel = sanitizeLabel(branch || "current");

  if (branch && branch !== "master" && branch !== "main") {
    return `${branchLabel}.bitsocial`;
  }

  if (isCanonicalRouteBusy()) {
    return `${branchLabel}.bitsocial`;
  }

  return "bitsocial";
}

const command = usePortless && existsSync(portlessBin) ? portlessBin : viteBin;
let args = [];

if (command === portlessBin) {
  const appName = getPortlessAppName();
  const publicUrl = `http://${appName}.localhost:1355`;

  args = [appName, "vite", "--config", aboutViteConfig];

  if (appName !== "bitsocial") {
    console.log(`Starting Portless dev server at ${publicUrl}`);
  }
} else if (process.env.PORTLESS !== "0") {
  console.warn("portless unavailable on this platform, using vite directly");
  args = ["--config", aboutViteConfig];
} else {
  args = ["--config", aboutViteConfig];
}

const child = spawn(command, args, {
  cwd: repoRoot,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
