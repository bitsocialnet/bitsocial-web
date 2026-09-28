#!/usr/bin/env node

// Runs the local stats stack like `yarn start` runs the about site: starts Docker if needed,
// brings up stats/compose.yaml, waits for the shared Grafana dashboards, then serves them on a
// Portless URL with the production short paths (/, /5chan, /seedit) and opens the browser.
// Ctrl+C stops the containers; their data stays in the Docker volumes.

import { spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { get as httpGet } from "node:http";
import { get as httpsGet } from "node:https";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  ensurePinnedNodeVersion,
  ensurePortlessProxy,
  getPortlessAppName,
  getPortlessPublicUrl,
  isWindows,
  portlessBin,
  portlessEnv,
  readStatsRedirects,
  repoRoot,
} from "./dev-server-utils.mjs";

await ensurePinnedNodeVersion(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const proxyScript = path.join(__dirname, "start-stats-proxy.mjs");
const statsDir = path.join(repoRoot, "stats");
const composeArgs = ["compose", "-f", path.join(statsDir, "compose.yaml")];
const grafanaUrl = "http://127.0.0.1:3300";
const dockerStartTimeoutMs = 3 * 60_000;
const grafanaStartTimeoutMs = 5 * 60_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isDockerRunning = () => spawnSync("docker", ["info"], { stdio: "ignore" }).status === 0;

async function ensureDocker() {
  if (spawnSync("docker", ["--version"], { stdio: "ignore" }).error) {
    console.error("Docker is required for the stats stack: https://docs.docker.com/get-docker/");
    process.exit(1);
  }
  if (isDockerRunning()) {
    return;
  }
  if (process.platform !== "darwin") {
    console.error("The Docker daemon is not running. Start Docker and run this command again.");
    process.exit(1);
  }

  console.log("Starting Docker Desktop...");
  spawnSync("open", ["-a", "Docker"], { stdio: "inherit" });
  const startedAt = Date.now();
  while (!isDockerRunning()) {
    if (Date.now() - startedAt > dockerStartTimeoutMs) {
      console.error("Docker Desktop did not start in time. Start it manually and run this again.");
      process.exit(1);
    }
    await sleep(2_000);
  }
}

function ensureEnvFile() {
  const envPath = path.join(statsDir, ".env");
  if (!existsSync(envPath)) {
    copyFileSync(path.join(statsDir, ".env.example"), envPath);
    console.log(`Created ${path.relative(repoRoot, envPath)} with the local defaults.`);
  }
}

function runCompose(args) {
  console.log(`$ docker ${[...composeArgs, ...args].join(" ")}`);
  return spawnSync("docker", [...composeArgs, ...args], { cwd: repoRoot, stdio: "inherit" }).status;
}

function isUrlOk(url) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const onResponse = (response) => {
      response.resume();
      const statusCode = response.statusCode ?? 500;
      resolve(statusCode >= 200 && statusCode < 400);
    };
    const request =
      parsedUrl.protocol === "https:"
        ? httpsGet(parsedUrl, { rejectUnauthorized: false }, onResponse)
        : httpGet(parsedUrl, onResponse);

    request.on("error", () => resolve(false));
    request.setTimeout(2_000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForUrl(url, timeoutMs) {
  const startedAt = Date.now();
  while (!(await isUrlOk(url))) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(`Timed out waiting for ${url}`);
    }
    await sleep(1_000);
  }
}

function openInBrowser(url) {
  const opener =
    process.platform === "darwin"
      ? { cmd: "open", args: [url] }
      : process.platform === "win32"
        ? { cmd: "cmd", args: ["/c", "start", '""', url] }
        : { cmd: "xdg-open", args: [url] };

  spawn(opener.cmd, opener.args, { stdio: "ignore", detached: true }).unref();
}

await ensureDocker();
ensureEnvFile();
if (runCompose(["up", "--build", "--detach"]) !== 0) {
  process.exit(1);
}

console.log("Waiting for Grafana and the shared dashboards...");
try {
  await waitForUrl(`${grafanaUrl}/api/health`, grafanaStartTimeoutMs);
  // The grafana-bootstrap job creates the shared dashboards after Grafana starts.
  for (const target of readStatsRedirects().values()) {
    const accessToken = target.split("/").pop();
    await waitForUrl(`${grafanaUrl}/api/public/dashboards/${accessToken}`, grafanaStartTimeoutMs);
  }
} catch (error) {
  console.error(`${error.message}. Check the containers with: yarn stats:logs`);
  process.exit(1);
}

const usePortless = process.env.PORTLESS !== "0" && !isWindows && existsSync(portlessBin);
let command = process.execPath;
let args = [proxyScript];
let browserOpenUrl = null;

if (usePortless) {
  ensurePortlessProxy();
  const appName = getPortlessAppName("stats.bitsocial");
  command = portlessBin;
  args = [appName, process.execPath, proxyScript];
  browserOpenUrl = getPortlessPublicUrl(appName);
} else if (process.env.PORTLESS !== "0") {
  console.warn("portless unavailable on this platform, serving the stats proxy directly");
}

const child = spawn(command, args, {
  cwd: repoRoot,
  env: usePortless ? { ...portlessEnv, ...process.env } : { ...process.env, PORTLESS: "0" },
  stdio: "inherit",
});

console.log("");
console.log("Monitor data fills in over the first minutes; pick a short time range at first.");
console.log("Press Ctrl+C to stop the stats stack (its data is kept in Docker volumes).");

if (browserOpenUrl && process.env.BROWSER !== "none") {
  waitForUrl(browserOpenUrl, 60_000)
    .then(() => {
      console.log(`Opening ${browserOpenUrl} in browser...`);
      openInBrowser(browserOpenUrl);
    })
    .catch((error) => {
      console.warn(`Could not auto-open ${browserOpenUrl}: ${error.message}`);
    });
}

// Stop the containers only after the proxy has exited.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code) => {
  console.log("");
  runCompose(["stop"]);
  process.exit(code ?? 0);
});
