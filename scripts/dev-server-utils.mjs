#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
export const portlessProxyPort = process.env.PORTLESS_PORT || "443";
export const portlessEnv = {
  ...process.env,
  PORTLESS_PORT: portlessProxyPort,
  PORTLESS_HTTPS: process.env.PORTLESS_HTTPS ?? "1",
  PORTLESS_LAN: process.env.PORTLESS_LAN ?? "0",
};
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

function listPortlessRouteHosts() {
  if (!existsSync(portlessBin)) {
    return new Set();
  }

  const result = spawnSync(portlessBin, ["list"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
  });

  if (result.status !== 0) {
    return new Set();
  }

  const matches = result.stdout.match(/https?:\/\/[a-z0-9.-]+\.localhost(?::\d+)?/g) || [];

  return new Set(matches.map((url) => new URL(url).hostname));
}

function isRouteBusy(activeRouteHosts, appName) {
  return activeRouteHosts.has(`${appName}.localhost`);
}

function getPreferredPortlessAppName(baseName, activeRouteHosts) {
  const branch = getCurrentBranch();
  const scopedLabel = sanitizeLabel(branch || path.basename(repoRoot) || "current");

  if (branch && !canonicalBranches.has(branch)) {
    return `${scopedLabel}.${baseName}`;
  }

  if (isRouteBusy(activeRouteHosts, baseName)) {
    return `${scopedLabel}.${baseName}`;
  }

  return baseName;
}

export function getPortlessPublicUrl(appName) {
  return `https://${appName}.localhost`;
}

// A Portless name depends on which routes were taken when its launcher ran, so no other process
// can re-derive it. Launchers record the URL they claimed here, per checkout (gitignored).
export function devServerUrlFile(name) {
  return path.join(repoRoot, ".dev-servers", `${name}-url`);
}

// Returns a function that removes the record once the server stops, since its host is then free for
// another checkout to claim. A record a later launcher overwrote is left alone.
export function recordDevServerUrl(name, url) {
  const file = devServerUrlFile(name);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${url}\n`);

  return () => {
    try {
      if (readFileSync(file, "utf8").trim() === url) {
        rmSync(file, { force: true });
      }
    } catch {
      // Already removed.
    }
  };
}

export function ensurePortlessProxy() {
  const result = spawnSync(
    portlessBin,
    ["proxy", "start", "--port", portlessProxyPort, "--https"],
    {
      cwd: repoRoot,
      env: portlessEnv,
      stdio: "inherit",
    },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

export function getPortlessAppName(baseName) {
  const activeRouteHosts = listPortlessRouteHosts();
  const preferredAppName = getPreferredPortlessAppName(baseName, activeRouteHosts);

  if (!isRouteBusy(activeRouteHosts, preferredAppName)) {
    return preferredAppName;
  }

  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const candidate = `${preferredAppName}-${suffix}`;

    if (!isRouteBusy(activeRouteHosts, candidate)) {
      return candidate;
    }
  }

  return `${preferredAppName}-${Date.now()}`;
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

// Ties a server's lifetime to the launcher that spawned it: SIGINT or SIGTERM sent to the launcher
// alone is forwarded, and the launcher exits with the server's code or signal after running onExit.
// SIGHUP (its terminal closed) is forwarded as SIGTERM, since Portless only removes its route and
// stops its detached server on SIGINT or SIGTERM.
export function spawnDevServer(command, args, options, onExit) {
  const child = spawn(command, args, options);

  const forwardSignal = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  const onSigint = () => forwardSignal("SIGINT");
  const onSigterm = () => forwardSignal("SIGTERM");

  process.on("SIGINT", onSigint);
  process.on("SIGTERM", onSigterm);
  process.on("SIGHUP", onSigterm);

  child.on("exit", (code, signal) => {
    process.off("SIGINT", onSigint);
    process.off("SIGTERM", onSigterm);
    process.off("SIGHUP", onSigterm);
    onExit?.();

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });

  return child;
}

export function startVite(host, port) {
  return spawnDevServer(
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
}
