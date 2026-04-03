#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(__dirname, "..");
export const isWindows = process.platform === "win32";
const yarnBin = isWindows ? "yarn.cmd" : "yarn";
const binDir = path.join(repoRoot, "node_modules", ".bin");
const executableSuffix = isWindows ? ".cmd" : "";
export const portlessBin = path.join(binDir, `portless${executableSuffix}`);
const canonicalBranches = new Set(["main", "master"]);
const nvmNodeReexecGuard = "BITSOCIAL_PINNED_NODE_REEXEC";

function getPinnedNodeVersion() {
  const nvmrcPath = path.join(repoRoot, ".nvmrc");

  if (!existsSync(nvmrcPath)) {
    return null;
  }

  const version = readFileSync(nvmrcPath, "utf8").trim().replace(/^v/, "");
  return version || null;
}

function getPinnedNodeBinary(version) {
  const homeDir = process.env.HOME;

  if (!homeDir) {
    return null;
  }

  return path.join(homeDir, ".nvm", "versions", "node", `v${version}`, "bin", "node");
}

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

function listPortlessRoutes() {
  if (!existsSync(portlessBin)) {
    return "";
  }

  const result = spawnSync(portlessBin, ["list"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
  });

  if (result.status !== 0) {
    return "";
  }

  return result.stdout;
}

export function getPortlessPublicUrl(appName) {
  return `http://${appName}.localhost:1355`;
}

export function getPortlessAppName(baseName) {
  const branch = getCurrentBranch();
  const scopedLabel = sanitizeLabel(branch || path.basename(repoRoot) || "current");

  if (branch && !canonicalBranches.has(branch)) {
    return `${scopedLabel}.${baseName}`;
  }

  if (listPortlessRoutes().includes(getPortlessPublicUrl(baseName))) {
    return `${scopedLabel}.${baseName}`;
  }

  return baseName;
}

export async function ensurePinnedNodeVersion(scriptUrl) {
  if (isWindows || process.env[nvmNodeReexecGuard] === "1") {
    return;
  }

  const pinnedVersion = getPinnedNodeVersion();

  if (!pinnedVersion || process.versions.node === pinnedVersion) {
    return;
  }

  const pinnedNodeBinary = getPinnedNodeBinary(pinnedVersion);

  if (!pinnedNodeBinary || !existsSync(pinnedNodeBinary)) {
    console.warn(
      `Pinned Node v${pinnedVersion} was not found under ~/.nvm; continuing with ${process.version} at ${process.execPath}.`,
    );
    return;
  }

  const scriptPath = fileURLToPath(scriptUrl);
  const scriptName = path.basename(scriptPath);

  console.warn(
    `Re-running ${scriptName} with pinned Node v${pinnedVersion} (current ${process.version}).`,
  );

  const child = spawn(pinnedNodeBinary, [scriptPath, ...process.argv.slice(2)], {
    cwd: repoRoot,
    env: {
      ...process.env,
      [nvmNodeReexecGuard]: "1",
    },
    stdio: "inherit",
  });

  const forwardSignal = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  const onSigint = () => forwardSignal("SIGINT");
  const onSigterm = () => forwardSignal("SIGTERM");

  process.on("SIGINT", onSigint);
  process.on("SIGTERM", onSigterm);

  await new Promise((resolve) => {
    child.on("exit", (code, signal) => {
      process.off("SIGINT", onSigint);
      process.off("SIGTERM", onSigterm);

      if (signal) {
        process.kill(process.pid, signal);
        return;
      }

      process.exit(code ?? 0);
      resolve();
    });
  });
}

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}

export async function resolvePort(requestedPort) {
  let port = requestedPort;

  while (!(await checkPort(port))) {
    port += 1;
  }

  return port;
}

export async function waitForPort(host, port, timeoutMs = 30_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const ready = await new Promise((resolve) => {
      const socket = net.connect({ host, port });

      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.once("error", () => resolve(false));
    });

    if (ready) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Timed out waiting for dev server on http://${host}:${port}`);
}

export function startVite(host, port) {
  const child = spawn(
    yarnBin,
    [
      "exec",
      "vite",
      "--config",
      "about/vite.config.ts",
      "--host",
      host,
      "--port",
      String(port),
      "--strictPort",
    ],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        PORTLESS: "0",
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

  return child;
}
