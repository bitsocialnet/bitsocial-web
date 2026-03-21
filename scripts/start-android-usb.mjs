#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import process from "node:process";
import { isWindows, repoRoot, resolvePort, startVite } from "./dev-server-utils.mjs";

const adbBin = isWindows ? "adb.exe" : "adb";
const host = "127.0.0.1";
const requestedPort = Number(process.env.ANDROID_USB_PORT || 1355);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function getReadyDevices() {
  const adbDevices = spawnSync(adbBin, ["devices"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (adbDevices.error) {
    fail(
      "ADB not found. Install Android platform-tools, connect the phone over USB, and enable USB debugging.",
    );
  }

  if (adbDevices.status !== 0) {
    fail(
      `ADB check failed: ${adbDevices.stderr.trim() || adbDevices.stdout.trim() || "unknown error"}`,
    );
  }

  const devices = adbDevices.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("List of devices attached"));

  const readyDevices = devices
    .filter((line) => line.endsWith("\tdevice"))
    .map((line) => line.split("\t")[0]);

  if (readyDevices.length === 0) {
    const detail = devices.length > 0 ? ` Detected states: ${devices.join(", ")}` : "";
    fail(
      `No Android device is ready over USB.${detail} Connect the phone, unlock it, trust the computer, and enable USB debugging.`,
    );
  }

  return readyDevices;
}

function reversePorts(devices, port) {
  for (const serial of devices) {
    const adbReverse = spawnSync(adbBin, ["-s", serial, "reverse", `tcp:${port}`, `tcp:${port}`], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    if (adbReverse.status !== 0) {
      fail(
        `ADB reverse failed for ${serial}: ${adbReverse.stderr.trim() || adbReverse.stdout.trim() || "unknown error"}`,
      );
    }
  }
}

const devices = getReadyDevices();
const port = await resolvePort(requestedPort);

reversePorts(devices, port);

console.log("");
console.log(`Starting Android USB preview from ${repoRoot}`);
console.log(`Host URL: http://${host}:${port}`);
if (port !== requestedPort) {
  console.log(`Preferred port ${requestedPort} is busy, so this run will use ${port}.`);
}
console.log(`ADB reverse is active for: ${devices.join(", ")}`);
console.log(`Open http://localhost:${port} in Chrome on the Android device.`);
console.log("");

startVite(host, port);
