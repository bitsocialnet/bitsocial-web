import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { gunzipSync } from "node:zlib";
import { documentKey } from "./dashboard.mjs";
import { RANGES } from "./ranges.mjs";
import { createStatsServer } from "./server.mjs";
import { createSnapshots } from "./snapshots.mjs";

const file = (body, contentType, cacheControl = "public, max-age=300") => ({
  body: Buffer.from(body),
  contentType,
  cacheControl,
});

const staticFiles = new Map([
  ["/index.html", file("<title>Bitsocial Stats</title>", "text/html; charset=utf-8")],
  [
    "/assets/index-abc.js",
    file("console.log(1)", "text/javascript; charset=utf-8", "public, max-age=31536000, immutable"),
  ],
]);

// A dashboard whose passes count themselves; documents name their key and pass number.
const fakeDashboard = () => {
  const dashboard = {
    passes: 0,
    failing: false,
    hasClient: (clientId) => clientId === "5chan",
    hasCommunity: (clientId, address) => clientId === "5chan" && address === "biz.bso",
    documents: async () => {
      dashboard.passes += 1;
      if (dashboard.failing) {
        return { documents: new Map(), errors: ["overview 24h: Prometheus is down"] };
      }
      const keys = Object.keys(RANGES).flatMap((rangeKey) => [
        documentKey.overview(rangeKey),
        documentKey.client("5chan", rangeKey),
        documentKey.community("5chan", "biz.bso", rangeKey),
      ]);
      return {
        documents: new Map(keys.map((key) => [key, { key, pass: dashboard.passes }])),
        errors: [],
      };
    },
  };
  return dashboard;
};

const startServer = async ({ build = true } = {}) => {
  const dashboard = fakeDashboard();
  const snapshots = createSnapshots({ dashboard, firstPassWaitSeconds: 0.05 });
  if (build) {
    await snapshots.refresh();
  }
  const server = createStatsServer({
    dashboard,
    snapshots,
    staticFiles,
    pageRoutes: new Set(["/", "/5chan", "/seedit"]),
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    dashboard,
    snapshots,
    url: base,
    get: (path, options) => fetch(`${base}${path}`, { redirect: "manual", ...options }),
    close: () => new Promise((resolve) => server.close(resolve)),
  };
};

test("answers every view from the snapshot without querying per request", async (t) => {
  const server = await startServer();
  t.after(server.close);

  const first = await server.get("/api/v1/overview");
  assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), { key: "overview:24h", pass: 1 });
  assert.match(first.headers.get("cache-control"), /max-age=30/);
  for (const range of Object.keys(RANGES)) {
    assert.equal((await server.get(`/api/v1/overview?range=${range}`)).status, 200);
  }

  const client = await server.get("/api/v1/clients/5chan?range=6h");
  assert.deepEqual(await client.json(), { key: "client:5chan:6h", pass: 1 });
  const community = await server.get("/api/v1/clients/5chan/communities/biz.bso");
  assert.deepEqual(await community.json(), { key: "community:5chan:biz.bso:24h", pass: 1 });
  assert.equal(server.dashboard.passes, 1);
});

test("sends a pre-compressed body and revalidates by ETag", async (t) => {
  const server = await startServer();
  t.after(server.close);

  const raw = await new Promise((resolve, reject) => {
    const socket = net.connect(Number(new URL(server.url).port), "127.0.0.1", () => {
      socket.end(
        "GET /api/v1/overview HTTP/1.1\r\nHost: localhost\r\nAccept-Encoding: br, gzip\r\nConnection: close\r\n\r\n",
      );
    });
    const chunks = [];
    socket.on("data", (chunk) => chunks.push(chunk));
    socket.on("end", () => resolve(Buffer.concat(chunks)));
    socket.on("error", reject);
  });
  const split = raw.indexOf("\r\n\r\n");
  const head = raw.subarray(0, split).toString();
  assert.match(head, /^HTTP\/1\.1 200 /);
  assert.match(head, /content-encoding: gzip/i);
  assert.match(head, /vary: Accept-Encoding/i);
  assert.deepEqual(JSON.parse(gunzipSync(raw.subarray(split + 4))), {
    key: "overview:24h",
    pass: 1,
  });

  const plain = await server.get("/api/v1/overview", {
    headers: { "Accept-Encoding": "gzip;q=0, identity" },
  });
  assert.equal(plain.headers.get("content-encoding"), null);
  const body = Buffer.from(await plain.arrayBuffer());
  assert.equal(Number(plain.headers.get("content-length")), body.length);
  const headOnly = await server.get("/api/v1/overview", {
    method: "HEAD",
    headers: { "Accept-Encoding": "identity" },
  });
  assert.equal(headOnly.status, 200);
  assert.equal(Number(headOnly.headers.get("content-length")), body.length);
  assert.equal((await headOnly.arrayBuffer()).byteLength, 0);
  const etag = plain.headers.get("etag");
  assert.match(etag, /^W\/"/);
  assert.equal(
    (await server.get("/api/v1/overview", { headers: { "If-None-Match": etag } })).status,
    304,
  );

  await server.snapshots.refresh();
  const changed = await server.get("/api/v1/overview", { headers: { "If-None-Match": etag } });
  assert.equal(changed.status, 200);
  assert.notEqual(changed.headers.get("etag"), etag);
});

test("keeps serving the last snapshot while a refresh fails", async (t) => {
  const server = await startServer();
  t.after(server.close);

  server.dashboard.failing = true;
  await server.snapshots.refresh();
  const response = await server.get("/api/v1/overview");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { key: "overview:24h", pass: 1 });
});

test("waits for the first pass and answers 502 when it built nothing", async (t) => {
  const server = await startServer({ build: false });
  t.after(() => {
    server.snapshots.stop();
    return server.close();
  });

  server.dashboard.failing = true;
  server.snapshots.start();
  const response = await server.get("/api/v1/overview");
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: "Stats data is temporarily unavailable." });
  assert.equal(response.headers.get("cache-control"), "no-store");
  await server.get("/api/v1/overview");
  assert.equal(server.dashboard.passes, 1);
});

test("rejects unknown ranges, clients, communities and paths", async (t) => {
  const server = await startServer();
  t.after(server.close);

  assert.equal((await server.get("/api/v1/overview?range=30d")).status, 400);
  assert.equal((await server.get("/api/v1/clients/lainchan")).status, 404);
  assert.equal((await server.get("/api/v1/clients/5chan/communities/other.bso")).status, 404);
  assert.equal((await server.get("/api/v1/clients/5chan/communities/%E0%A4%A")).status, 404);
  assert.equal((await server.get("/api/v1/clients/5chan/communities/biz.bso/x")).status, 404);
  assert.equal((await server.get("/api/v1/overview/extra")).status, 404);
  assert.equal((await server.get("/api/v1/overview", { method: "POST" })).status, 405);
  assert.equal(server.dashboard.passes, 1);
});

test("serves the dashboard routes, assets and legacy Grafana links", async (t) => {
  const server = await startServer();
  t.after(server.close);

  for (const path of ["/", "/5chan", "/seedit/"]) {
    const page = await server.get(path);
    assert.equal(page.status, 200, path);
    assert.equal(await page.text(), "<title>Bitsocial Stats</title>");
    assert.equal(page.headers.get("cache-control"), "no-cache");
    assert.match(page.headers.get("content-security-policy"), /frame-ancestors 'none'/);
  }

  const asset = await server.get("/assets/index-abc.js");
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get("cache-control"), /immutable/);

  const head = await server.get("/5chan", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");

  const legacy = await server.get("/public-dashboards/fa6f2225e0ea98e116fb6f85d84e0186");
  assert.equal(legacy.status, 301);
  assert.equal(legacy.headers.get("location"), "/5chan");

  assert.equal((await server.get("/public-dashboards/unknown")).status, 404);
  assert.equal((await server.get("/index.html/../../etc/passwd")).status, 404);
  assert.equal((await server.get("/healthz")).status, 200);
});

test("answers an unparseable request target with 400", async (t) => {
  const server = await startServer();
  t.after(server.close);

  const { port } = new URL(server.url);
  const raw = await new Promise((resolve, reject) => {
    const socket = net.connect(Number(port), "127.0.0.1", () => {
      socket.end("GET // HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n");
    });
    let received = "";
    socket.on("data", (chunk) => (received += chunk));
    socket.on("end", () => resolve(received));
    socket.on("error", reject);
  });
  assert.match(raw, /^HTTP\/1\.1 400 /);
});
