import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const successCacheControl = "public, s-maxage=300, stale-while-revalidate=86400";
const latestReleaseUrl = "https://api.github.com/repos/bitsocialnet/5chan/releases/latest";
const download = { app: "5chan", asset: "download", variant: "linux-arm64" };
const handlerSource = await readFile(path.join(repoRoot, "about/api/release-integrity.ts"), "utf8");
const { code: handlerCode } = await transform(handlerSource, { loader: "ts", format: "esm" });
let handlerInstances = 0;

// Every import is a cold function instance: the handler remembers the last resolved download
// URL in module state, so a fresh data: URL gives each test its own copy of that state.
async function loadHandler() {
  handlerInstances += 1;
  const source = `${handlerCode}\n// instance ${handlerInstances}\n`;
  const { default: handler } = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );

  return async (query) => {
    const result = { headers: {} };
    await handler(
      { url: `/api/release-integrity?${new URLSearchParams(query)}`, query },
      {
        status(status) {
          result.status = status;
          return this;
        },
        setHeader(name, value) {
          result.headers[name] = value;
        },
        send(body) {
          result.body = body;
        },
      },
    );
    return result;
  };
}

function assetUrl(version) {
  return `https://github.com/bitsocialnet/5chan/releases/download/v${version}/5chan-${version}-arm64.AppImage`;
}

function latestRelease(version) {
  return Response.json({
    assets: [
      {
        name: `5chan-${version}-x64.AppImage`,
        browser_download_url: "https://example.invalid/x64",
      },
      { name: `5chan-${version}-arm64.AppImage`, browser_download_url: assetUrl(version) },
    ],
  });
}

test("release metadata failures are never cached and rate limits read as an outage", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => new Response("{}"));

  for (const [upstreamStatus, expectedStatus] of [
    [403, 503],
    [429, 503],
    [500, 500],
  ]) {
    const request = await loadHandler();
    fetchMock.mock.mockImplementation(async () => new Response("{}", { status: upstreamStatus }));
    const result = await request(download);
    assert.equal(result.status, expectedStatus, `GitHub ${upstreamStatus}`);
    assert.equal(result.headers["Cache-Control"], "no-store", `GitHub ${upstreamStatus}`);
    assert.equal(result.headers.Location, undefined, `GitHub ${upstreamStatus}`);
  }

  const request = await loadHandler();
  fetchMock.mock.mockImplementation(async () => {
    throw new TypeError("fetch failed");
  });
  const networkFailure = await request(download);
  assert.equal(networkFailure.status, 502);
  assert.equal(networkFailure.headers["Cache-Control"], "no-store");

  const callsBeforeUnknown = fetchMock.mock.callCount();
  const unknownVariant = await request({ ...download, variant: "plan9" });
  assert.equal(unknownVariant.status, 404);
  assert.equal(unknownVariant.headers["Cache-Control"], "no-store");
  assert.equal(fetchMock.mock.callCount(), callsBeforeUnknown);
});

test("resolved downloads are cached and warm instances reuse them while GitHub is degraded", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => latestRelease("1.2.3"));
  const request = await loadHandler();

  const resolved = await request(download);
  assert.equal(resolved.status, 307);
  assert.equal(resolved.headers.Location, assetUrl("1.2.3"));
  assert.equal(resolved.headers["Cache-Control"], successCacheControl);
  assert.equal(fetchMock.mock.calls[0].arguments[0], latestReleaseUrl);

  for (const [label, upstream] of [
    ["rate limited", async () => new Response("{}", { status: 403 })],
    ["server error", async () => new Response("{}", { status: 500 })],
    [
      "network failure",
      async () => {
        throw new TypeError("fetch failed");
      },
    ],
    ["latest release without the asset", async () => Response.json({ assets: [] })],
  ]) {
    fetchMock.mock.mockImplementation(upstream);
    const fallback = await request(download);
    assert.equal(fallback.status, 307, label);
    assert.equal(fallback.headers.Location, assetUrl("1.2.3"), label);
    assert.equal(fallback.headers["Cache-Control"], "no-store", label);
  }

  fetchMock.mock.mockImplementation(async () => new Response("{}", { status: 403 }));
  const otherVariant = await request({ ...download, variant: "linux-x64" });
  assert.equal(otherVariant.status, 503, "the fallback is scoped to the resolved app and variant");
  assert.equal(otherVariant.headers["Cache-Control"], "no-store");

  fetchMock.mock.mockImplementation(async () => latestRelease("1.2.4"));
  const recovered = await request(download);
  assert.equal(recovered.status, 307);
  assert.equal(recovered.headers.Location, assetUrl("1.2.4"));
  assert.equal(recovered.headers["Cache-Control"], successCacheControl);

  fetchMock.mock.mockImplementation(async () => new Response("{}", { status: 403 }));
  const fallbackAfterUpdate = await request(download);
  assert.equal(fallbackAfterUpdate.status, 307);
  assert.equal(
    fallbackAfterUpdate.headers.Location,
    assetUrl("1.2.4"),
    "fallback tracks the newest release",
  );
  assert.equal(fallbackAfterUpdate.headers["Cache-Control"], "no-store");
});

test("release integrity assets never CDN-cache missing or failed lookups", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => new Response("{}"));

  for (const asset of ["manifest", "signature"]) {
    const query = { app: "5chan", asset };

    // Cold instance: GitHub's releases/latest redirect flaps to 404 for releases that exist, so a
    // missing asset must not be pinned by the CDN for the whole s-maxage window.
    const coldRequest = await loadHandler();
    fetchMock.mock.mockImplementation(async () => new Response("", { status: 404 }));
    const missing = await coldRequest(query);
    assert.equal(missing.status, 204, asset);
    assert.equal(missing.headers["Cache-Control"], "no-store", asset);

    fetchMock.mock.mockImplementation(async () => new Response("", { status: 429 }));
    const rateLimited = await coldRequest(query);
    assert.equal(rateLimited.status, 429, asset);
    assert.equal(rateLimited.headers["Cache-Control"], "no-store", asset);

    fetchMock.mock.mockImplementation(async () => {
      throw new TypeError("fetch failed");
    });
    const networkFailure = await coldRequest(query);
    assert.equal(networkFailure.status, 502, asset);
    assert.equal(networkFailure.headers["Cache-Control"], "no-store", asset);

    // A single flaky 404 is retried before giving up.
    const retryRequest = await loadHandler();
    let calls = 0;
    fetchMock.mock.mockImplementation(async () => {
      calls += 1;
      return calls === 1
        ? new Response("", { status: 404 })
        : new Response('{"schema":"test"}');
    });
    const retried = await retryRequest(query);
    assert.equal(retried.status, 200, asset);
    assert.equal(retried.body, '{"schema":"test"}', asset);
    assert.equal(retried.headers["Content-Type"], "application/json; charset=utf-8", asset);
    assert.equal(retried.headers["Cache-Control"], successCacheControl, asset);

    // Warm instance: serve the last good body uncached while upstream is degraded.
    for (const failure of [
      async () => new Response("", { status: 404 }),
      async () => new Response("", { status: 429 }),
      async () => {
        throw new TypeError("fetch failed");
      },
    ]) {
      fetchMock.mock.mockImplementation(failure);
      const fallback = await retryRequest(query);
      assert.equal(fallback.status, 200, asset);
      assert.equal(fallback.body, '{"schema":"test"}', asset);
      assert.equal(fallback.headers["Content-Type"], "application/json; charset=utf-8", asset);
      assert.equal(fallback.headers["Cache-Control"], "no-store", asset);
    }
  }
});

test("GITHUB_TOKEN authenticates only the release metadata lookup", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async (url) =>
    url === latestReleaseUrl ? latestRelease("1.2.3") : new Response("{}"),
  );
  const request = await loadHandler();
  // Normalize so a leak via a Headers instance or a lowercase key is caught too.
  const authorizationFor = (callIndex) =>
    new Headers(fetchMock.mock.calls[callIndex].arguments[1]?.headers).get("authorization");
  const previousToken = process.env.GITHUB_TOKEN;
  t.after(() => {
    if (previousToken === undefined) {
      delete process.env.GITHUB_TOKEN;
    } else {
      process.env.GITHUB_TOKEN = previousToken;
    }
  });

  process.env.GITHUB_TOKEN = "  test-token  ";
  await request(download);
  assert.equal(fetchMock.mock.calls[0].arguments[0], latestReleaseUrl);
  assert.equal(authorizationFor(0), "Bearer test-token");

  await request({ app: "5chan", asset: "manifest" });
  assert.equal(authorizationFor(1), null, "release assets must not receive the token");

  process.env.GITHUB_TOKEN = "   ";
  await request(download);
  assert.equal(authorizationFor(2), null, "a blank token is ignored");

  delete process.env.GITHUB_TOKEN;
  await request(download);
  assert.equal(authorizationFor(3), null);
});
