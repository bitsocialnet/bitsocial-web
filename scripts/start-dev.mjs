#!/usr/bin/env node

import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { get as httpGet } from "node:http";
import { get as httpsGet } from "node:https";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  devServerUrlFile,
  ensurePortlessProxy,
  ensurePinnedNodeVersion,
  getPortlessAppName,
  getPortlessPublicUrl,
  isWindows,
  portlessEnv,
  portlessBin,
  repoRoot,
  spawnDevServer,
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
let browserOpenUrl = null;

if (command === portlessBin) {
  ensurePortlessProxy();
  const appName = getPortlessAppName("bitsocial");
  const publicUrl = getPortlessPublicUrl(appName);

  args = [appName, process.execPath, aboutServerScript];
  // start-docs records the docs URL it claims; the about server reads it on each /docs request.
  childEnv.DOCS_DEV_URL_FILE = devServerUrlFile("docs");
  browserOpenUrl = publicUrl;

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

spawnDevServer(command, args, {
  cwd: repoRoot,
  stdio: "inherit",
  env: command === portlessBin ? { ...portlessEnv, ...childEnv } : childEnv,
});

if (browserOpenUrl && process.env.BROWSER !== "none") {
  waitForUrlReady(browserOpenUrl, 30_000)
    .then(() => {
      console.log(`Opening ${browserOpenUrl} in browser...`);
      openInBrowser(browserOpenUrl);
    })
    .catch((error) => {
      console.warn(`Could not auto-open ${browserOpenUrl}: ${error.message}`);
    });
}

async function waitForUrlReady(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const ready = await new Promise((resolve) => {
      const parsedUrl = new URL(url);
      const getUrl = parsedUrl.protocol === "https:" ? httpsGet : httpGet;
      const onResponse = (response) => {
        response.resume();
        const statusCode = response.statusCode ?? 500;
        resolve(statusCode >= 200 && statusCode < 400);
      };
      const request =
        parsedUrl.protocol === "https:"
          ? getUrl(parsedUrl, { rejectUnauthorized: false }, onResponse)
          : getUrl(parsedUrl, onResponse);

      request.on("error", () => resolve(false));
      request.setTimeout(2_000, () => {
        request.destroy();
        resolve(false);
      });
    });

    if (ready) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Timed out waiting for ${url}`);
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
