import type { AppReleaseIntegrityProbe } from "@/lib/apps-data";

const RELEASE_MANIFEST_SCHEMA = "bitsocial.release-manifest.v1";
const RELEASE_SIGNATURE_SCHEMA = "bitsocial.release-manifest-signature.v1";
const TARGET_MEASUREMENTS_SCHEMA = "bitsocial.release-integrity-target-measurements.v1";
const RELEASE_SIGNATURE_ALGORITHM = "ECDSA-P256-SHA256";
const RELEASE_INTEGRITY_FETCH_TIMEOUT_MS = 30_000;
const RUNTIME_INTEGRITY_FILE_PATTERN = /\.(?:css|html|js|json|mjs|txt|webmanifest|wasm)$/;
const textEncoder = new TextEncoder();

interface ReleaseManifestFile {
  bytes: number;
  path: string;
  sha256: string;
}

interface ReleaseManifest {
  appName: string;
  files: ReleaseManifestFile[];
  generatedAt: string;
  releaseTag: string;
  schema: typeof RELEASE_MANIFEST_SCHEMA;
  sourceCommit?: string;
  verificationScope: "web-release-all-files";
  version: string;
}

interface ReleaseManifestSignature {
  algorithm: typeof RELEASE_SIGNATURE_ALGORITHM;
  keyId: string;
  manifestSha256: string;
  schema: typeof RELEASE_SIGNATURE_SCHEMA;
  signature: string;
}

interface TargetMeasurements {
  appName: string;
  files: ReleaseManifestFile[];
  manifestSha256: string;
  measuredAt: string;
  schema: typeof TARGET_MEASUREMENTS_SCHEMA;
  targetUrl: string;
}

export interface ReleaseIntegrityResult {
  appName: string;
  checkedAt: string;
  filesVerified: number;
  keyId: string;
  manifestSha256: string;
  releaseTag: string;
  version: string;
}

export async function verifySignedReleaseIntegrity(
  targetUrl: string,
  probe: AppReleaseIntegrityProbe,
): Promise<ReleaseIntegrityResult> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("WebCrypto is required for release integrity verification");
  }

  const manifestResponse = await fetchText(probe.manifestUrl);
  const signature = parseSignature(await fetchJson(probe.signatureUrl));
  const manifestBytes = textToArrayBuffer(manifestResponse.text);
  const manifestSha256 = await sha256Hex(manifestBytes);

  if (signature.keyId !== probe.keyId) {
    throw new Error(`Unexpected release signing key: ${signature.keyId}`);
  }

  if (signature.manifestSha256.toLowerCase() !== manifestSha256) {
    throw new Error("Release manifest hash does not match the signed payload");
  }

  const signatureMatches = await verifyManifestSignature(
    manifestBytes,
    signature.signature,
    probe.publicKeyJwk,
  );

  if (!signatureMatches) {
    throw new Error("Release manifest signature is invalid");
  }

  const manifest = parseManifest(JSON.parse(manifestResponse.text));

  if (manifest.appName !== probe.appName) {
    throw new Error(`Unexpected release manifest app: ${manifest.appName}`);
  }

  const filesVerified = await verifyTargetMeasurements(targetUrl, probe, manifest, manifestSha256);

  return {
    appName: manifest.appName,
    checkedAt: manifest.generatedAt,
    filesVerified,
    keyId: signature.keyId,
    manifestSha256,
    releaseTag: manifest.releaseTag,
    version: manifest.version,
  };
}

async function fetchText(url: string) {
  const response = await fetchWithTimeout(url, {
    cache: "no-store",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return {
    text: await response.text(),
    url: response.url || url,
  };
}

async function fetchJson(url: string) {
  const response = await fetchWithTimeout(url, {
    cache: "no-store",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, RELEASE_INTEGRITY_FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      signal: abortController.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function parseManifest(value: unknown): ReleaseManifest {
  if (!isRecord(value)) {
    throw new Error("Release manifest must be an object");
  }

  const files = value.files;
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Release manifest must list files");
  }

  const manifest: ReleaseManifest = {
    appName: requireString(value.appName, "appName"),
    files: files.map(parseManifestFile),
    generatedAt: requireString(value.generatedAt, "generatedAt"),
    releaseTag: requireString(value.releaseTag, "releaseTag"),
    schema: requireString(value.schema, "schema") as typeof RELEASE_MANIFEST_SCHEMA,
    sourceCommit:
      typeof value.sourceCommit === "string" && value.sourceCommit ? value.sourceCommit : undefined,
    verificationScope: requireString(
      value.verificationScope,
      "verificationScope",
    ) as ReleaseManifest["verificationScope"],
    version: requireString(value.version, "version"),
  };

  if (manifest.schema !== RELEASE_MANIFEST_SCHEMA) {
    throw new Error(`Unsupported release manifest schema: ${manifest.schema}`);
  }

  if (manifest.verificationScope !== "web-release-all-files") {
    throw new Error(`Unsupported release manifest scope: ${manifest.verificationScope}`);
  }

  return manifest;
}

function parseManifestFile(value: unknown): ReleaseManifestFile {
  if (!isRecord(value)) {
    throw new Error("Release manifest file entry must be an object");
  }

  const file = {
    bytes: requireNumber(value.bytes, "bytes"),
    path: requireString(value.path, "path"),
    sha256: requireString(value.sha256, "sha256").toLowerCase(),
  };

  if (file.path.startsWith("/") || file.path.includes("..")) {
    throw new Error(`Unsafe release manifest path: ${file.path}`);
  }

  if (!/^[a-f0-9]{64}$/.test(file.sha256)) {
    throw new Error(`Invalid SHA-256 for ${file.path}`);
  }

  return file;
}

function parseSignature(value: unknown): ReleaseManifestSignature {
  if (!isRecord(value)) {
    throw new Error("Release manifest signature must be an object");
  }

  const signature: ReleaseManifestSignature = {
    algorithm: requireString(value.algorithm, "algorithm") as typeof RELEASE_SIGNATURE_ALGORITHM,
    keyId: requireString(value.keyId, "keyId"),
    manifestSha256: requireString(value.manifestSha256, "manifestSha256").toLowerCase(),
    schema: requireString(value.schema, "schema") as typeof RELEASE_SIGNATURE_SCHEMA,
    signature: requireString(value.signature, "signature"),
  };

  if (signature.schema !== RELEASE_SIGNATURE_SCHEMA) {
    throw new Error(`Unsupported release signature schema: ${signature.schema}`);
  }

  if (signature.algorithm !== RELEASE_SIGNATURE_ALGORITHM) {
    throw new Error(`Unsupported release signature algorithm: ${signature.algorithm}`);
  }

  if (!/^[a-f0-9]{64}$/.test(signature.manifestSha256)) {
    throw new Error("Invalid release manifest SHA-256");
  }

  return signature;
}

async function verifyManifestSignature(
  manifestBytes: ArrayBuffer,
  encodedSignature: string,
  publicKeyJwk: JsonWebKey,
) {
  const publicKey = await globalThis.crypto.subtle.importKey(
    "jwk",
    publicKeyJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"],
  );

  return globalThis.crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    publicKey,
    base64UrlToArrayBuffer(encodedSignature),
    manifestBytes,
  );
}

async function verifyTargetMeasurements(
  targetUrl: string,
  probe: AppReleaseIntegrityProbe,
  manifest: ReleaseManifest,
  manifestSha256: string,
) {
  const runtimeFiles = getRuntimeFiles(manifest.files);
  const measurements = parseTargetMeasurements(
    await fetchJson(getTargetMeasurementsUrl(probe.targetMeasurementsUrl, targetUrl)),
  );

  if (measurements.appName !== manifest.appName) {
    throw new Error(`Unexpected release target measurements app: ${measurements.appName}`);
  }

  if (measurements.manifestSha256 !== manifestSha256) {
    throw new Error("Release target measurements were produced for a different manifest");
  }

  const measurementsByPath = new Map<string, ReleaseManifestFile>();
  for (const file of measurements.files) {
    if (measurementsByPath.has(file.path)) {
      throw new Error(`Duplicate target measurement for ${file.path}`);
    }
    measurementsByPath.set(file.path, file);
  }

  for (const file of runtimeFiles) {
    const measuredFile = measurementsByPath.get(file.path);
    if (!measuredFile) {
      throw new Error(`Missing target measurement for ${file.path}`);
    }

    if (measuredFile.bytes !== file.bytes) {
      throw new Error(`Size mismatch for ${file.path}`);
    }

    if (measuredFile.sha256 !== file.sha256) {
      throw new Error(`SHA-256 mismatch for ${file.path}`);
    }
  }

  return runtimeFiles.length;
}

function getRuntimeFiles(files: ReleaseManifestFile[]) {
  const runtimeFiles = files.filter((file) => RUNTIME_INTEGRITY_FILE_PATTERN.test(file.path));

  if (runtimeFiles.length === 0) {
    throw new Error("Release manifest does not list runtime files");
  }

  return runtimeFiles;
}

function getTargetMeasurementsUrl(endpointUrl: string, targetUrl: string) {
  const requestUrl = new URL(endpointUrl, globalThis.location?.href ?? "https://bitsocial.net/");
  requestUrl.searchParams.set("targetUrl", targetUrl);
  return requestUrl.href;
}

function parseTargetMeasurements(value: unknown): TargetMeasurements {
  if (!isRecord(value)) {
    throw new Error("Release target measurements must be an object");
  }

  const files = value.files;
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Release target measurements must list files");
  }

  const measurements: TargetMeasurements = {
    appName: requireString(value.appName, "appName"),
    files: files.map(parseManifestFile),
    manifestSha256: requireString(value.manifestSha256, "manifestSha256").toLowerCase(),
    measuredAt: requireString(value.measuredAt, "measuredAt"),
    schema: requireString(value.schema, "schema") as typeof TARGET_MEASUREMENTS_SCHEMA,
    targetUrl: requireString(value.targetUrl, "targetUrl"),
  };

  if (measurements.schema !== TARGET_MEASUREMENTS_SCHEMA) {
    throw new Error(`Unsupported target measurements schema: ${measurements.schema}`);
  }

  if (!/^[a-f0-9]{64}$/.test(measurements.manifestSha256)) {
    throw new Error("Invalid target measurements manifest SHA-256");
  }

  return measurements;
}

async function sha256Hex(bytes: ArrayBuffer) {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function textToArrayBuffer(value: string) {
  const bytes = textEncoder.encode(value);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function base64UrlToArrayBuffer(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = globalThis.atob(paddedBase64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return buffer;
}

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || !value) {
    throw new Error(`Release manifest field must be a string: ${field}`);
  }

  return value;
}

function requireNumber(value: unknown, field: string) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Release manifest field must be a non-negative integer: ${field}`);
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
