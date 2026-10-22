interface RequestLike {
  url?: string;
  query?: Record<string, string | string[] | undefined>;
}

interface ResponseLike {
  status(statusCode: number): ResponseLike;
  setHeader(name: string, value: string): void;
  send(body: string): void;
}

interface ReleaseIntegrityAsset {
  contentType: string;
  url: string;
}

interface ReleaseDownloadAsset {
  assetNamePattern: RegExp;
  repository: string;
}

interface ReleaseManifestFile {
  bytes: number;
  path: string;
  sha256: string;
}

interface ReleaseManifest {
  appName: string;
  files: ReleaseManifestFile[];
  schema: string;
  verificationScope: string;
}

interface TargetMeasurement {
  bytes: number;
  path: string;
  sha256: string;
}

export const config = {
  maxDuration: 60,
};

const RELEASE_MANIFEST_SCHEMA = "bitsocial.release-manifest.v1";
const RELEASE_VERIFICATION_SCOPE = "web-release-all-files";
const TARGET_MEASUREMENTS_SCHEMA = "bitsocial.release-integrity-target-measurements.v1";
const TARGET_MEASUREMENTS_ASSET = "target-measurements";
const LATEST_DOWNLOAD_ASSET = "download";
const TARGET_CHECK_CONCURRENCY = 24;
const RELEASE_FETCH_TIMEOUT_MS = 15_000;
const TARGET_FETCH_TIMEOUT_MS = 15_000;
const RUNTIME_INTEGRITY_FILE_PATTERN = /\.(?:css|html|js|json|mjs|txt|webmanifest|wasm)$/;
const URL_SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const releaseTextEncoder = new TextEncoder();
const SUCCESS_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";
// Errors must never be cached by the CDN: a single upstream hiccup (e.g. GitHub API rate
// limiting) would otherwise be served to every visitor for the whole s-maxage window.
const ERROR_CACHE_CONTROL = "no-store";
// Last successfully resolved download URL per app/variant, reused by warm function instances
// when GitHub release metadata is temporarily unavailable.
const lastKnownDownloadUrls = new Map<string, string>();
// Last successfully fetched manifest/signature body per app/asset. GitHub's
// releases/latest/download redirect intermittently answers 404 for releases that exist, so a
// warm instance serves the last good body instead of reporting the asset as missing.
const lastKnownIntegrityAssets = new Map<string, string>();
const LATEST_RELEASE_404_RETRY_DELAY_MS = 500;
// Only retry a fast 404: a slow first answer plus a full second fetch could outlast the browser's
// 30 s proxy timeout (worst case here: 5 s + 0.5 s + 15 s).
const LATEST_RELEASE_404_RETRY_MAX_FIRST_RESPONSE_MS = 5_000;

const RELEASE_INTEGRITY_ASSETS: Record<string, ReleaseIntegrityAsset> = {
  "5chan:manifest": {
    contentType: "application/json; charset=utf-8",
    url: "https://github.com/bitsocialnet/5chan/releases/latest/download/5chan-release-manifest.json",
  },
  "5chan:signature": {
    contentType: "application/json; charset=utf-8",
    url: "https://github.com/bitsocialnet/5chan/releases/latest/download/5chan-release-manifest.sig.json",
  },
  "seedit:manifest": {
    contentType: "application/json; charset=utf-8",
    url: "https://github.com/bitsocialnet/seedit/releases/latest/download/seedit-release-manifest.json",
  },
  "seedit:signature": {
    contentType: "application/json; charset=utf-8",
    url: "https://github.com/bitsocialnet/seedit/releases/latest/download/seedit-release-manifest.sig.json",
  },
};

const RELEASE_DOWNLOAD_ASSETS: Record<string, ReleaseDownloadAsset> = {
  "5chan:android": {
    assetNamePattern: /^5chan-\d+\.\d+\.\d+\.apk$/,
    repository: "bitsocialnet/5chan",
  },
  "5chan:linux-arm64": {
    assetNamePattern: /^5chan-\d+\.\d+\.\d+-arm64\.AppImage$/,
    repository: "bitsocialnet/5chan",
  },
  "5chan:linux-x64": {
    assetNamePattern: /^5chan-\d+\.\d+\.\d+-x64\.AppImage$/,
    repository: "bitsocialnet/5chan",
  },
  "5chan:macos-arm64": {
    assetNamePattern: /^5chan-\d+\.\d+\.\d+-arm64\.dmg$/,
    repository: "bitsocialnet/5chan",
  },
  "5chan:macos-x64": {
    assetNamePattern: /^5chan-\d+\.\d+\.\d+-x64\.dmg$/,
    repository: "bitsocialnet/5chan",
  },
  "5chan:windows": {
    assetNamePattern: /^5chan-\d+\.\d+\.\d+-x64\.Setup\.exe$/,
    repository: "bitsocialnet/5chan",
  },
  "seedit:android": {
    assetNamePattern: /^seedit-\d+\.\d+\.\d+\.apk$/,
    repository: "bitsocialnet/seedit",
  },
  "seedit:linux-arm64": {
    assetNamePattern: /^seedit-\d+\.\d+\.\d+-arm64\.AppImage$/,
    repository: "bitsocialnet/seedit",
  },
  "seedit:linux-x64": {
    assetNamePattern: /^seedit-\d+\.\d+\.\d+\.AppImage$/,
    repository: "bitsocialnet/seedit",
  },
  "seedit:macos-arm64": {
    assetNamePattern: /^seedit-\d+\.\d+\.\d+-arm64\.dmg$/,
    repository: "bitsocialnet/seedit",
  },
  "seedit:macos-x64": {
    assetNamePattern: /^seedit-\d+\.\d+\.\d+\.dmg$/,
    repository: "bitsocialnet/seedit",
  },
  "seedit:windows": {
    assetNamePattern: /^seedit\.Setup\.\d+\.\d+\.\d+\.exe$/,
    repository: "bitsocialnet/seedit",
  },
  "seedit:windows-portable": {
    assetNamePattern: /^seedit\.Portable\.\d+\.\d+\.\d+\.exe$/,
    repository: "bitsocialnet/seedit",
  },
};

const ALLOWED_RELEASE_TARGET_ORIGINS: Record<string, ReadonlySet<string>> = {
  "5chan": new Set([
    "https://5chan.app",
    "https://5chan.cc",
    "https://5channel.org",
    "https://5chan.eth.limo",
  ]),
  seedit: new Set([
    "https://seedit.app",
    "https://www.seedit.app",
    "https://p2p.seedit.app",
    "https://seedit.eth.limo",
    "https://seedit.online",
    "https://seedit.today",
  ]),
};

export default async function handler(request: RequestLike, response: ResponseLike) {
  const requestUrl = new URL(request.url ?? "/", "https://bitsocial.net");
  const app = getSingleQueryValue(request.query?.app) ?? requestUrl.searchParams.get("app");
  const asset = getSingleQueryValue(request.query?.asset) ?? requestUrl.searchParams.get("asset");

  if (asset === TARGET_MEASUREMENTS_ASSET) {
    await handleTargetMeasurementsRequest(app, request, requestUrl, response);
    return;
  }

  if (asset === LATEST_DOWNLOAD_ASSET) {
    await handleLatestDownloadRequest(app, request, requestUrl, response);
    return;
  }

  const releaseAsset = RELEASE_INTEGRITY_ASSETS[`${app}:${asset}`];

  if (!releaseAsset) {
    response.setHeader("Cache-Control", SUCCESS_CACHE_CONTROL);
    response.status(404).send("Unknown release integrity asset");
    return;
  }

  const assetKey = `${app}:${asset}`;

  try {
    const firstAttemptStartedAt = Date.now();
    let releaseResponse = await fetchReleaseAsset(releaseAsset);

    if (
      releaseResponse.status === 404 &&
      Date.now() - firstAttemptStartedAt < LATEST_RELEASE_404_RETRY_MAX_FIRST_RESPONSE_MS
    ) {
      // GitHub's "latest" redirect flaps between the real release and 404; retry once.
      discardResponseBody(releaseResponse);
      await delay(LATEST_RELEASE_404_RETRY_DELAY_MS);
      releaseResponse = await fetchReleaseAsset(releaseAsset);
    }

    if (releaseResponse.ok) {
      const body = await releaseResponse.text();
      lastKnownIntegrityAssets.set(assetKey, body);
      response.setHeader("Cache-Control", SUCCESS_CACHE_CONTROL);
      response.status(200);
      response.setHeader("Content-Type", releaseAsset.contentType);
      response.send(body);
      return;
    }

    discardResponseBody(releaseResponse);
    if (sendLastKnownIntegrityAsset(assetKey, releaseAsset, response)) {
      return;
    }

    // Never let the CDN cache a missing or failed lookup: a transient GitHub 404 would
    // otherwise be served to every visitor for the whole s-maxage window.
    response.setHeader("Cache-Control", ERROR_CACHE_CONTROL);
    if (releaseResponse.status === 404) {
      response.status(204).send("");
      return;
    }
    response.status(releaseResponse.status).send("Release integrity asset is unavailable");
  } catch {
    if (sendLastKnownIntegrityAsset(assetKey, releaseAsset, response)) {
      return;
    }
    response.setHeader("Cache-Control", ERROR_CACHE_CONTROL);
    response.status(502).send("Release integrity asset fetch failed");
  }
}

function sendLastKnownIntegrityAsset(
  assetKey: string,
  releaseAsset: ReleaseIntegrityAsset,
  response: ResponseLike,
) {
  const lastKnownBody = lastKnownIntegrityAssets.get(assetKey);
  if (lastKnownBody === undefined) {
    return false;
  }

  // Serve the last good body, but don't let the CDN pin it while upstream is degraded.
  response.setHeader("Cache-Control", ERROR_CACHE_CONTROL);
  response.status(200);
  response.setHeader("Content-Type", releaseAsset.contentType);
  response.send(lastKnownBody);
  return true;
}

// An unread fetch body keeps its connection open until garbage collection.
function discardResponseBody(releaseResponse: Response) {
  void releaseResponse.body?.cancel().catch(() => {});
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function handleLatestDownloadRequest(
  app: string | null | undefined,
  request: RequestLike,
  requestUrl: URL,
  response: ResponseLike,
) {
  const variant =
    getSingleQueryValue(request.query?.variant) ?? requestUrl.searchParams.get("variant");
  const downloadKey = `${app}:${variant}`;

  try {
    const downloadAsset = RELEASE_DOWNLOAD_ASSETS[downloadKey];

    if (!downloadAsset) {
      throw new ReleaseIntegrityHttpError(404, "Unknown release download asset");
    }

    let downloadUrl: string;
    try {
      downloadUrl = await resolveLatestDownloadUrl(downloadAsset);
      lastKnownDownloadUrls.set(downloadKey, downloadUrl);
      response.setHeader("Cache-Control", SUCCESS_CACHE_CONTROL);
    } catch (error) {
      const fallbackUrl = lastKnownDownloadUrls.get(downloadKey);
      if (!fallbackUrl) {
        throw error;
      }
      // Serve the last good redirect, but don't let the CDN pin it while upstream is degraded.
      downloadUrl = fallbackUrl;
      response.setHeader("Cache-Control", ERROR_CACHE_CONTROL);
    }

    response.status(307);
    response.setHeader("Location", downloadUrl);
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.send("Redirecting to latest release asset");
  } catch (error) {
    const statusCode = error instanceof ReleaseIntegrityHttpError ? error.statusCode : 502;
    const message = error instanceof Error ? error.message : "Release download lookup failed";

    response.setHeader("Cache-Control", ERROR_CACHE_CONTROL);
    response.status(statusCode).send(message);
  }
}

async function handleTargetMeasurementsRequest(
  app: string | null | undefined,
  request: RequestLike,
  requestUrl: URL,
  response: ResponseLike,
) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    const targetUrlValue =
      getSingleQueryValue(request.query?.targetUrl) ?? requestUrl.searchParams.get("targetUrl");
    const targetUrl = normalizeAllowedTargetUrl(app, targetUrlValue);
    const manifestAsset = RELEASE_INTEGRITY_ASSETS[`${app}:manifest`];

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

    response.status(200).send(
      JSON.stringify({
        schema: TARGET_MEASUREMENTS_SCHEMA,
        appName: manifest.appName,
        manifestSha256: await sha256Hex(textToArrayBuffer(manifestText)),
        targetUrl: targetUrl.href,
        measuredAt: new Date().toISOString(),
        files,
      }),
    );
  } catch (error) {
    const statusCode = error instanceof ReleaseIntegrityHttpError ? error.statusCode : 502;
    const message = error instanceof Error ? error.message : "Release target measurement failed";

    response.status(statusCode).send(JSON.stringify({ error: message }));
  }
}

async function resolveLatestDownloadUrl(downloadAsset: ReleaseDownloadAsset) {
  const releaseResponse = await fetchReleaseUrlWithTimeout(
    `https://api.github.com/repos/${downloadAsset.repository}/releases/latest`,
    {
      headers: getGitHubApiHeaders(),
      redirect: "follow",
    },
  );

  if (!releaseResponse.ok) {
    // GitHub answers rate limiting with 403/429; surface that as a temporary upstream outage
    // instead of telling clients the download itself is forbidden.
    const statusCode =
      releaseResponse.status === 403 || releaseResponse.status === 429
        ? 503
        : releaseResponse.status;
    throw new ReleaseIntegrityHttpError(statusCode, "Latest release metadata is unavailable");
  }

  const release = (await releaseResponse.json()) as unknown;
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

function getGitHubApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "bitsocial-web-latest-release-download",
  };
  // Optional read-only token: anonymous GitHub API calls share a 60 requests/hour limit per IP.
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function fetchReleaseAsset(releaseAsset: ReleaseIntegrityAsset) {
  return fetchReleaseUrlWithTimeout(releaseAsset.url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "bitsocial-web-release-integrity-proxy",
    },
    redirect: "follow",
  });
}

async function fetchReleaseUrlWithTimeout(url: string, init: RequestInit) {
  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, RELEASE_FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      signal: abortController.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeAllowedTargetUrl(app: string | null | undefined, targetUrlValue: string | null) {
  if (!app) {
    throw new ReleaseIntegrityHttpError(400, "Missing release integrity app");
  }

  if (!targetUrlValue) {
    throw new ReleaseIntegrityHttpError(400, "Missing release integrity target URL");
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(targetUrlValue);
  } catch {
    throw new ReleaseIntegrityHttpError(400, "Invalid release integrity target URL");
  }

  const allowedOrigins = ALLOWED_RELEASE_TARGET_ORIGINS[app];
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

function parseReleaseManifest(value: unknown): ReleaseManifest {
  if (!isRecord(value)) {
    throw new ReleaseIntegrityHttpError(502, "Release manifest must be an object");
  }

  const files = value.files;
  if (!Array.isArray(files) || files.length === 0) {
    throw new ReleaseIntegrityHttpError(502, "Release manifest must list files");
  }

  const manifest: ReleaseManifest = {
    appName: requireString(value.appName, "appName"),
    files: files.map(parseReleaseManifestFile),
    schema: requireString(value.schema, "schema"),
    verificationScope: requireString(value.verificationScope, "verificationScope"),
  };

  if (manifest.schema !== RELEASE_MANIFEST_SCHEMA) {
    throw new ReleaseIntegrityHttpError(502, "Unsupported release manifest schema");
  }

  if (manifest.verificationScope !== RELEASE_VERIFICATION_SCOPE) {
    throw new ReleaseIntegrityHttpError(502, "Unsupported release manifest scope");
  }

  return manifest;
}

function parseReleaseManifestFile(value: unknown): ReleaseManifestFile {
  if (!isRecord(value)) {
    throw new ReleaseIntegrityHttpError(502, "Release manifest file entry must be an object");
  }

  const file = {
    bytes: requireNumber(value.bytes, "bytes"),
    path: requireString(value.path, "path"),
    sha256: requireString(value.sha256, "sha256").toLowerCase(),
  };

  if (file.path.startsWith("/") || file.path.includes("..") || URL_SCHEME_PATTERN.test(file.path)) {
    throw new ReleaseIntegrityHttpError(502, "Unsafe release manifest path");
  }

  if (!/^[a-f0-9]{64}$/.test(file.sha256)) {
    throw new ReleaseIntegrityHttpError(502, "Invalid release manifest SHA-256");
  }

  return file;
}

function getRuntimeFiles(files: ReleaseManifestFile[]) {
  const runtimeFiles = files.filter((file) => RUNTIME_INTEGRITY_FILE_PATTERN.test(file.path));

  if (runtimeFiles.length === 0) {
    throw new ReleaseIntegrityHttpError(502, "Release manifest does not list runtime files");
  }

  return runtimeFiles;
}

async function measureTargetFiles(targetUrl: URL, files: ReleaseManifestFile[]) {
  const measuredFiles = new Array<TargetMeasurement>(files.length);
  const baseUrl = getDirectoryBaseUrl(targetUrl);
  let nextIndex = 0;
  let firstError: unknown;

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
    Array.from({ length: Math.min(TARGET_CHECK_CONCURRENCY, files.length) }, () => worker()),
  );

  if (firstError) {
    throw firstError;
  }

  return measuredFiles;
}

async function measureTargetFile(targetUrl: URL, baseUrl: URL, file: ReleaseManifestFile) {
  const fileUrl =
    file.path === "index.html" ? new URL(targetUrl.href) : new URL(file.path, baseUrl);

  if (
    (fileUrl.protocol !== "http:" && fileUrl.protocol !== "https:") ||
    fileUrl.origin !== targetUrl.origin
  ) {
    throw new ReleaseIntegrityHttpError(502, "Unsafe release manifest path");
  }

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

async function fetchWithTimeout(url: string) {
  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, TARGET_FETCH_TIMEOUT_MS);

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

function getDirectoryBaseUrl(value: URL) {
  const url = new URL(value.href);
  if (!url.pathname.endsWith("/")) {
    url.pathname = `${url.pathname}/`;
  }
  return url;
}

async function sha256Hex(bytes: ArrayBuffer) {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function textToArrayBuffer(value: string) {
  const bytes = releaseTextEncoder.encode(value);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || !value) {
    throw new ReleaseIntegrityHttpError(502, `Release manifest field must be a string: ${field}`);
  }

  return value;
}

function requireNumber(value: unknown, field: string) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new ReleaseIntegrityHttpError(
      502,
      `Release manifest field must be a non-negative integer: ${field}`,
    );
  }

  return value;
}

function getSingleQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

class ReleaseIntegrityHttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
