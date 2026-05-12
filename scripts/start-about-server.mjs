#!/usr/bin/env node

import { createServer as createHttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createServer as createViteServer } from "vite";
import { repoRoot, resolvePort } from "./dev-server-utils.mjs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

const fallbackPort = Number(process.env.ABOUT_PORT || 3000);
const requestedPort = Number(process.env.PORT || fallbackPort);
const host = process.env.HOST || "127.0.0.1";
const usingPortless = Boolean(process.env.PORTLESS_URL);

if (!Number.isInteger(requestedPort) || requestedPort <= 0) {
  fail(`Invalid about port: ${process.env.PORT || process.env.ABOUT_PORT || "undefined"}`);
}

const port = usingPortless ? requestedPort : await resolvePort(requestedPort);
const aboutRoot = path.join(repoRoot, "about");
const templatePath = path.join(aboutRoot, "index.html");
const hmrServer = createHttpServer();
const releaseManifestSchema = "bitsocial.release-manifest.v1";
const releaseVerificationScope = "web-release-all-files";
const targetMeasurementsSchema = "bitsocial.release-integrity-target-measurements.v1";
const targetMeasurementsAsset = "target-measurements";
const latestDownloadAsset = "download";
const targetCheckConcurrency = 24;
const targetFetchTimeoutMs = 15_000;
const runtimeIntegrityFilePattern = /\.(?:css|html|js|json|mjs|txt|webmanifest|wasm)$/;
const releaseTextEncoder = new TextEncoder();
const releaseIntegrityAssets = new Map([
  [
    "5chan:manifest",
    {
      contentType: "application/json; charset=utf-8",
      url: "https://github.com/bitsocialnet/5chan/releases/latest/download/5chan-release-manifest.json",
    },
  ],
  [
    "5chan:signature",
    {
      contentType: "application/json; charset=utf-8",
      url: "https://github.com/bitsocialnet/5chan/releases/latest/download/5chan-release-manifest.sig.json",
    },
  ],
  [
    "seedit:manifest",
    {
      contentType: "application/json; charset=utf-8",
      url: "https://github.com/bitsocialnet/seedit/releases/latest/download/seedit-release-manifest.json",
    },
  ],
  [
    "seedit:signature",
    {
      contentType: "application/json; charset=utf-8",
      url: "https://github.com/bitsocialnet/seedit/releases/latest/download/seedit-release-manifest.sig.json",
    },
  ],
]);
const releaseDownloadAssets = new Map([
  [
    "5chan:android",
    {
      assetNamePattern: /^5chan-\d+\.\d+\.\d+\.apk$/,
      repository: "bitsocialnet/5chan",
    },
  ],
  [
    "5chan:linux-arm64",
    {
      assetNamePattern: /^5chan-\d+\.\d+\.\d+-arm64\.AppImage$/,
      repository: "bitsocialnet/5chan",
    },
  ],
  [
    "5chan:linux-x64",
    {
      assetNamePattern: /^5chan-\d+\.\d+\.\d+-x64\.AppImage$/,
      repository: "bitsocialnet/5chan",
    },
  ],
  [
    "5chan:macos-arm64",
    {
      assetNamePattern: /^5chan-\d+\.\d+\.\d+-arm64\.dmg$/,
      repository: "bitsocialnet/5chan",
    },
  ],
  [
    "5chan:macos-x64",
    {
      assetNamePattern: /^5chan-\d+\.\d+\.\d+-x64\.dmg$/,
      repository: "bitsocialnet/5chan",
    },
  ],
  [
    "5chan:windows",
    {
      assetNamePattern: /^5chan-\d+\.\d+\.\d+-x64\.Setup\.exe$/,
      repository: "bitsocialnet/5chan",
    },
  ],
  [
    "seedit:android",
    {
      assetNamePattern: /^seedit-\d+\.\d+\.\d+\.apk$/,
      repository: "bitsocialnet/seedit",
    },
  ],
  [
    "seedit:linux-arm64",
    {
      assetNamePattern: /^seedit-\d+\.\d+\.\d+-arm64\.AppImage$/,
      repository: "bitsocialnet/seedit",
    },
  ],
  [
    "seedit:linux-x64",
    {
      assetNamePattern: /^seedit-\d+\.\d+\.\d+\.AppImage$/,
      repository: "bitsocialnet/seedit",
    },
  ],
  [
    "seedit:macos-arm64",
    {
      assetNamePattern: /^seedit-\d+\.\d+\.\d+-arm64\.dmg$/,
      repository: "bitsocialnet/seedit",
    },
  ],
  [
    "seedit:macos-x64",
    {
      assetNamePattern: /^seedit-\d+\.\d+\.\d+\.dmg$/,
      repository: "bitsocialnet/seedit",
    },
  ],
  [
    "seedit:windows",
    {
      assetNamePattern: /^seedit\.Setup\.\d+\.\d+\.\d+\.exe$/,
      repository: "bitsocialnet/seedit",
    },
  ],
  [
    "seedit:windows-portable",
    {
      assetNamePattern: /^seedit\.Portable\.\d+\.\d+\.\d+\.exe$/,
      repository: "bitsocialnet/seedit",
    },
  ],
]);
const allowedReleaseTargetOrigins = new Map([
  [
    "5chan",
    new Set([
      "https://5chan.app",
      "https://5chan.cc",
      "https://5channel.org",
      "https://5chan.eth.limo",
    ]),
  ],
  [
    "seedit",
    new Set([
      "https://seedit.app",
      "https://www.seedit.app",
      "https://p2p.seedit.app",
      "https://seedit.eth.limo",
      "https://seedit.online",
      "https://seedit.today",
    ]),
  ],
]);

const vite = await createViteServer({
  configFile: path.join(aboutRoot, "vite.config.ts"),
  appType: "custom",
  server: {
    middlewareMode: true,
    hmr: {
      server: hmrServer,
    },
  },
});

hmrServer.on("request", (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);

  if (requestUrl.pathname === "/api/release-integrity") {
    handleReleaseIntegrityRequest(requestUrl, response);
    return;
  }

  if (
    requestUrl.pathname === "/_vercel/insights/script.js" ||
    requestUrl.pathname === "/_vercel/speed-insights/script.js"
  ) {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/javascript; charset=utf-8");
    response.end("");
    return;
  }

  vite.middlewares(request, response, async () => {
    try {
      const template = await readFile(templatePath, "utf8");
      const transformedTemplate = await vite.transformIndexHtml(requestUrl.pathname, template);
      const serverEntry = await vite.ssrLoadModule("/src/server/render-about.tsx");
      const rendered = await serverEntry.renderAboutRequest({
        url: request.url ?? "/",
        headers: request.headers,
        templateHtml: transformedTemplate,
      });

      response.statusCode = rendered.status;
      for (const [headerName, headerValue] of Object.entries(rendered.headers)) {
        response.setHeader(headerName, headerValue);
      }
      response.end(rendered.body);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.end(String(error?.stack ?? error));
    }
  });
});

async function handleReleaseIntegrityRequest(requestUrl, response) {
  const app = requestUrl.searchParams.get("app");
  const asset = requestUrl.searchParams.get("asset");

  if (asset === targetMeasurementsAsset) {
    await handleTargetMeasurementsRequest(app, requestUrl, response);
    return;
  }

  if (asset === latestDownloadAsset) {
    await handleLatestDownloadRequest(app, requestUrl, response);
    return;
  }

  const releaseAsset = releaseIntegrityAssets.get(`${app}:${asset}`);

  response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");

  if (!releaseAsset) {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("Unknown release integrity asset");
    return;
  }

  try {
    const releaseResponse = await fetch(releaseAsset.url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "bitsocial-web-release-integrity-proxy",
      },
      redirect: "follow",
    });

    if (releaseResponse.status === 404) {
      response.statusCode = 204;
      response.end("");
      return;
    }

    if (!releaseResponse.ok) {
      response.statusCode = releaseResponse.status;
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.end("Release integrity asset is unavailable");
      return;
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", releaseAsset.contentType);
    response.end(await releaseResponse.text());
  } catch {
    response.statusCode = 502;
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("Release integrity asset fetch failed");
  }
}

async function handleLatestDownloadRequest(app, requestUrl, response) {
  response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");

  try {
    const variant = requestUrl.searchParams.get("variant");
    const downloadAsset = releaseDownloadAssets.get(`${app}:${variant}`);

    if (!downloadAsset) {
      throw new ReleaseIntegrityHttpError(404, "Unknown release download asset");
    }

    const downloadUrl = await resolveLatestDownloadUrl(downloadAsset);
    response.statusCode = 307;
    response.setHeader("Location", downloadUrl);
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("Redirecting to latest release asset");
  } catch (error) {
    response.statusCode = error instanceof ReleaseIntegrityHttpError ? error.statusCode : 502;
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end(error instanceof Error ? error.message : "Release download lookup failed");
  }
}

async function handleTargetMeasurementsRequest(app, requestUrl, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    const targetUrl = normalizeAllowedTargetUrl(app, requestUrl.searchParams.get("targetUrl"));
    const manifestAsset = releaseIntegrityAssets.get(`${app}:manifest`);

    if (!manifestAsset) {
      throw new ReleaseIntegrityHttpError(404, "Unknown release integrity app");
    }

    const releaseResponse = await fetchReleaseAsset(manifestAsset);
    if (!releaseResponse.ok) {
      throw new ReleaseIntegrityHttpError(
        releaseResponse.status === 404 ? 503 : releaseResponse.status,
        "Release manifest is unavailable",
      );
    }

    const manifestText = await releaseResponse.text();
    const manifest = parseReleaseManifest(JSON.parse(manifestText));
    const runtimeFiles = getRuntimeFiles(manifest.files);
    const files = await measureTargetFiles(targetUrl, runtimeFiles);

    response.statusCode = 200;
    response.end(
      JSON.stringify({
        schema: targetMeasurementsSchema,
        appName: manifest.appName,
        manifestSha256: await sha256Hex(textToArrayBuffer(manifestText)),
        targetUrl: targetUrl.href,
        measuredAt: new Date().toISOString(),
        files,
      }),
    );
  } catch (error) {
    response.statusCode = error instanceof ReleaseIntegrityHttpError ? error.statusCode : 502;
    response.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Release target measurement failed",
      }),
    );
  }
}

async function resolveLatestDownloadUrl(downloadAsset) {
  const releaseResponse = await fetch(
    `https://api.github.com/repos/${downloadAsset.repository}/releases/latest`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "bitsocial-web-latest-release-download",
      },
      redirect: "follow",
    },
  );

  if (!releaseResponse.ok) {
    throw new ReleaseIntegrityHttpError(
      releaseResponse.status,
      "Latest release metadata is unavailable",
    );
  }

  const release = await releaseResponse.json();
  if (!isRecord(release) || !Array.isArray(release.assets)) {
    throw new ReleaseIntegrityHttpError(502, "Latest release metadata is invalid");
  }

  for (const asset of release.assets) {
    if (!isRecord(asset)) {
      continue;
    }

    const name = asset.name;
    const downloadUrl = asset.browser_download_url;
    if (
      typeof name === "string" &&
      typeof downloadUrl === "string" &&
      downloadAsset.assetNamePattern.test(name)
    ) {
      return downloadUrl;
    }
  }

  throw new ReleaseIntegrityHttpError(404, "Latest release download asset was not found");
}

async function fetchReleaseAsset(releaseAsset) {
  return fetch(releaseAsset.url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "bitsocial-web-release-integrity-proxy",
    },
    redirect: "follow",
  });
}

function normalizeAllowedTargetUrl(app, targetUrlValue) {
  if (!app) {
    throw new ReleaseIntegrityHttpError(400, "Missing release integrity app");
  }

  if (!targetUrlValue) {
    throw new ReleaseIntegrityHttpError(400, "Missing release integrity target URL");
  }

  let targetUrl;
  try {
    targetUrl = new URL(targetUrlValue);
  } catch {
    throw new ReleaseIntegrityHttpError(400, "Invalid release integrity target URL");
  }

  const allowedOrigins = allowedReleaseTargetOrigins.get(app);
  if (!allowedOrigins?.has(targetUrl.origin)) {
    throw new ReleaseIntegrityHttpError(400, "Unsupported release integrity target URL");
  }

  if (targetUrl.protocol !== "https:") {
    throw new ReleaseIntegrityHttpError(400, "Release integrity targets must use HTTPS");
  }

  if (targetUrl.username || targetUrl.password || targetUrl.search || targetUrl.hash) {
    throw new ReleaseIntegrityHttpError(400, "Release integrity target URL is too broad");
  }

  if (targetUrl.pathname !== "" && targetUrl.pathname !== "/") {
    throw new ReleaseIntegrityHttpError(400, "Release integrity target path is unsupported");
  }

  targetUrl.pathname = "/";
  return targetUrl;
}

function parseReleaseManifest(value) {
  if (!isRecord(value)) {
    throw new ReleaseIntegrityHttpError(502, "Release manifest must be an object");
  }

  const files = value.files;
  if (!Array.isArray(files) || files.length === 0) {
    throw new ReleaseIntegrityHttpError(502, "Release manifest must list files");
  }

  const manifest = {
    appName: requireString(value.appName, "appName"),
    files: files.map(parseReleaseManifestFile),
    schema: requireString(value.schema, "schema"),
    verificationScope: requireString(value.verificationScope, "verificationScope"),
  };

  if (manifest.schema !== releaseManifestSchema) {
    throw new ReleaseIntegrityHttpError(502, "Unsupported release manifest schema");
  }

  if (manifest.verificationScope !== releaseVerificationScope) {
    throw new ReleaseIntegrityHttpError(502, "Unsupported release manifest scope");
  }

  return manifest;
}

function parseReleaseManifestFile(value) {
  if (!isRecord(value)) {
    throw new ReleaseIntegrityHttpError(502, "Release manifest file entry must be an object");
  }

  const file = {
    bytes: requireNumber(value.bytes, "bytes"),
    path: requireString(value.path, "path"),
    sha256: requireString(value.sha256, "sha256").toLowerCase(),
  };

  if (file.path.startsWith("/") || file.path.includes("..")) {
    throw new ReleaseIntegrityHttpError(502, "Unsafe release manifest path");
  }

  if (!/^[a-f0-9]{64}$/.test(file.sha256)) {
    throw new ReleaseIntegrityHttpError(502, "Invalid release manifest SHA-256");
  }

  return file;
}

function getRuntimeFiles(files) {
  const runtimeFiles = files.filter((file) => runtimeIntegrityFilePattern.test(file.path));

  if (runtimeFiles.length === 0) {
    throw new ReleaseIntegrityHttpError(502, "Release manifest does not list runtime files");
  }

  return runtimeFiles;
}

async function measureTargetFiles(targetUrl, files) {
  const measuredFiles = new Array(files.length);
  const baseUrl = getDirectoryBaseUrl(targetUrl);
  let nextIndex = 0;
  let firstError;

  async function worker() {
    while (!firstError) {
      const fileIndex = nextIndex;
      nextIndex += 1;

      if (fileIndex >= files.length) {
        return;
      }

      try {
        measuredFiles[fileIndex] = await measureTargetFile(targetUrl, baseUrl, files[fileIndex]);
      } catch (error) {
        firstError = error;
        return;
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(targetCheckConcurrency, files.length) }, () => worker()),
  );

  if (firstError) {
    throw firstError;
  }

  return measuredFiles;
}

async function measureTargetFile(targetUrl, baseUrl, file) {
  const fileUrl =
    file.path === "index.html" ? new URL(targetUrl.href) : new URL(file.path, baseUrl);
  const response = await fetchWithTimeout(fileUrl.href);

  if (!response.ok) {
    throw new ReleaseIntegrityHttpError(409, `Release target file is unavailable: ${file.path}`);
  }

  const bytes = await response.arrayBuffer();
  return {
    bytes: bytes.byteLength,
    path: file.path,
    sha256: await sha256Hex(bytes),
  };
}

async function fetchWithTimeout(url) {
  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, targetFetchTimeoutMs);

  try {
    return await fetch(url, {
      headers: {
        "User-Agent": "bitsocial-web-release-integrity-target-check",
      },
      redirect: "follow",
      signal: abortController.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function getDirectoryBaseUrl(value) {
  const url = new URL(value.href);
  if (!url.pathname.endsWith("/")) {
    url.pathname = `${url.pathname}/`;
  }
  return url;
}

async function sha256Hex(bytes) {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function textToArrayBuffer(value) {
  const bytes = releaseTextEncoder.encode(value);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function requireString(value, field) {
  if (typeof value !== "string" || !value) {
    throw new ReleaseIntegrityHttpError(502, `Release manifest field must be a string: ${field}`);
  }

  return value;
}

function requireNumber(value, field) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new ReleaseIntegrityHttpError(
      502,
      `Release manifest field must be a non-negative integer: ${field}`,
    );
  }

  return value;
}

function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

class ReleaseIntegrityHttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const forwardSignal = (signal) => {
  hmrServer.close(() => {
    vite.close().finally(() => {
      process.kill(process.pid, signal);
    });
  });
};

const onSigint = () => forwardSignal("SIGINT");
const onSigterm = () => forwardSignal("SIGTERM");

process.on("SIGINT", onSigint);
process.on("SIGTERM", onSigterm);

hmrServer.listen(port, host, () => {
  console.log("");
  console.log(`Starting about SSR dev server from ${repoRoot}`);
  if (usingPortless) {
    console.log(`Public URL: ${process.env.PORTLESS_URL}`);
  }
  console.log(`Host URL: http://${host}:${port}`);
  if (!usingPortless && port !== requestedPort) {
    console.log(`Preferred port ${requestedPort} is busy, so this run will use ${port}.`);
  }
  console.log("");
});
