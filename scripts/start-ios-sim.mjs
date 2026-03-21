#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { repoRoot, resolvePort, startVite, waitForPort } from "./dev-server-utils.mjs";

const host = "127.0.0.1";
const requestedPort = Number(process.env.IOS_SIM_PORT || 1355);
const defaultXcodeDeveloperDir = "/Applications/Xcode.app/Contents/Developer";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function runXcrun(args) {
  return spawnSync("xcrun", args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: developerDir
      ? {
          ...process.env,
          DEVELOPER_DIR: developerDir,
        }
      : process.env,
  });
}

function resolveDeveloperDir() {
  if (process.env.DEVELOPER_DIR) {
    return process.env.DEVELOPER_DIR;
  }

  const selected = spawnSync("xcode-select", ["-p"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (selected.status === 0) {
    const activeDir = selected.stdout.trim();

    if (existsSync(path.join(activeDir, "usr/bin/simctl"))) {
      return activeDir;
    }
  }

  if (existsSync(path.join(defaultXcodeDeveloperDir, "usr/bin/simctl"))) {
    return defaultXcodeDeveloperDir;
  }

  return null;
}

function ensureSimctl() {
  const result = runXcrun(["--find", "simctl"]);

  if (result.error || result.status !== 0) {
    fail(
      "`simctl` is unavailable on this Mac. Install Xcode and its Simulator runtime, then run `yarn start:ios-sim` again.",
    );
  }
}

function pickSimulator() {
  const list = runXcrun(["simctl", "list", "devices", "available", "-j"]);

  if (list.status !== 0) {
    fail(
      `Unable to list iOS simulators: ${list.stderr.trim() || list.stdout.trim() || "unknown error"}`,
    );
  }

  const parsed = JSON.parse(list.stdout);
  const devices = Object.values(parsed.devices)
    .flat()
    .filter((device) => device.isAvailable && device.name.includes("iPhone"));

  if (devices.length === 0) {
    fail(
      "No available iPhone simulator was found. Open Xcode and install at least one iPhone Simulator runtime.",
    );
  }

  return devices.find((device) => device.state === "Booted") || devices[0];
}

function openSimulatorApp() {
  const openResult = spawnSync("open", ["-a", "Simulator"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (openResult.status !== 0) {
    fail(
      `Unable to open Simulator.app: ${openResult.stderr.trim() || openResult.stdout.trim() || "unknown error"}`,
    );
  }
}

function bootSimulator(device) {
  if (device.state === "Booted") {
    return;
  }

  const boot = runXcrun(["simctl", "boot", device.udid]);

  if (boot.status !== 0) {
    fail(
      `Unable to boot ${device.name}: ${boot.stderr.trim() || boot.stdout.trim() || "unknown error"}`,
    );
  }
}

function waitForBoot(device) {
  const status = runXcrun(["simctl", "bootstatus", device.udid, "-b"]);

  if (status.status !== 0) {
    fail(
      `Simulator boot did not complete for ${device.name}: ${status.stderr.trim() || status.stdout.trim() || "unknown error"}`,
    );
  }
}

function openUrl(simulator, port) {
  const result = runXcrun(["simctl", "openurl", simulator.udid, `http://localhost:${port}`]);

  if (result.status !== 0) {
    fail(
      `Unable to open the site in Simulator: ${result.stderr.trim() || result.stdout.trim() || "unknown error"}`,
    );
  }
}

const developerDir = resolveDeveloperDir();

ensureSimctl();
openSimulatorApp();

const simulator = pickSimulator();
bootSimulator(simulator);
waitForBoot(simulator);

const port = await resolvePort(requestedPort);

console.log("");
console.log(`Starting iOS Simulator preview from ${repoRoot}`);
if (developerDir && developerDir !== process.env.DEVELOPER_DIR) {
  console.log(`Using Xcode developer directory: ${developerDir}`);
}
console.log(`Simulator: ${simulator.name}`);
console.log(`Host URL: http://${host}:${port}`);
if (port !== requestedPort) {
  console.log(`Preferred port ${requestedPort} is busy, so this run will use ${port}.`);
}
console.log("Opening the site in the booted iPhone simulator.");
console.log("");

const child = startVite(host, port);

try {
  await waitForPort(host, port);
  openUrl(simulator, port);
} catch (error) {
  child.kill("SIGTERM");
  fail(error instanceof Error ? error.message : String(error));
}
