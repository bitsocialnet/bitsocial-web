import assert from "node:assert/strict";
import fs from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { gunzipSync } from "node:zlib";
import { documentKey } from "./dashboard.mjs";
import { FIVE_CHAN_BOARDS_SECONDS, createFiveChanBoardsSource } from "./five-chan-boards.mjs";
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

const startServer = async ({ build = true, fiveChanBoards } = {}) => {
  const dashboard = fakeDashboard();
  const snapshots = createSnapshots({ dashboard, firstPassWaitSeconds: 0.05 });
  if (build) {
    await snapshots.refresh();
  }
  const server = createStatsServer({
    dashboard,
    snapshots,
    fiveChanBoards,
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

// A boards file as the monitor writes it: one fetched board with a thread, one never fetched.
const boardsFile = {
  version: 1,
  generatedAt: 1792500000,
  boards: [
    {
      address: "anime-and-manga.bso",
      publicKey: "12D3KooWMDt3RMVMHrm2pEEyfraBtHP86dmkim7EVAapDj3Mchdy",
      directoryCode: "a",
      updatedAt: 1792499000,
      stats: { statsCid: "QmStats", allPostCount: 123, allReplyCount: 456, weekActiveUserCount: 7 },
      threads: [
        {
          cid: "QmThread",
          raw: {
            comment: { title: "ünïcödé", link: "https://example.com/a.png", timestamp: 1 },
            commentUpdate: { cid: "QmThread", replyCount: 2, signature: { signature: "x" } },
          },
        },
      ],
    },
    {
      address: "biz.bso",
      publicKey: null,
      directoryCode: "biz",
      updatedAt: null,
      stats: null,
      threads: [],
    },
  ],
};

const startBoardsServer = async (t, { file = boardsFile } = {}) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "stats-5chan-boards-"));
  const filePath = path.join(directory, "5chan-boards.json");
  const writeFile = (document) => fs.writeFile(filePath, JSON.stringify(document));
  if (file) {
    await writeFile(file);
  }
  const fiveChanBoards = createSnapshots({
    dashboard: createFiveChanBoardsSource({ filePath }),
    windowSeconds: FIVE_CHAN_BOARDS_SECONDS,
    firstPassWaitSeconds: 0.05,
  });
  const server = await startServer({ fiveChanBoards });
  t.after(async () => {
    fiveChanBoards.stop();
    await server.close();
    await fs.rm(directory, { recursive: true, force: true });
  });
  return { ...server, fiveChanBoards, writeFile };
};

test("serves the 5chan boards snapshot to any origin and ignores query parameters", async (t) => {
  const server = await startBoardsServer(t);
  await server.fiveChanBoards.refresh();

  const response = await server.get("/api/v1/5chan/boards?range=30d&unknown=1");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "*");
  assert.equal(response.headers.get("cache-control"), "public, max-age=60");
  assert.equal(
    response.headers.get("cloudflare-cdn-cache-control"),
    "max-age=60, stale-while-revalidate=600",
  );
  assert.match(response.headers.get("content-type"), /^application\/json/);
  const text = await response.text();
  assert.deepEqual(JSON.parse(text), boardsFile);
  const [{ raw }] = boardsFile.boards[0].threads;
  assert.ok(text.includes(JSON.stringify(raw.comment)));
  assert.ok(text.includes(JSON.stringify(raw.commentUpdate)));

  const etag = response.headers.get("etag");
  const cached = await server.get("/api/v1/5chan/boards", { headers: { "If-None-Match": etag } });
  assert.equal(cached.status, 304);
  assert.equal(cached.headers.get("access-control-allow-origin"), "*");
  assert.equal(
    cached.headers.get("cloudflare-cdn-cache-control"),
    "max-age=60, stale-while-revalidate=600",
  );
  const head = await server.get("/api/v1/5chan/boards", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("access-control-allow-origin"), "*");
  assert.equal(await head.text(), "");

  // The Prometheus views keep their own caching and send no CORS header.
  const overview = await server.get("/api/v1/overview");
  assert.equal(overview.headers.get("access-control-allow-origin"), null);
  assert.match(overview.headers.get("cache-control"), /max-age=30/);
  assert.equal(overview.headers.get("cloudflare-cdn-cache-control"), null);
  assert.equal((await server.get("/api/v1/5chan/boards/extra")).status, 404);
  assert.equal((await server.get("/api/v1/5chan")).status, 404);
});

test("reads the boards file only on the snapshot schedule", async (t) => {
  const server = await startBoardsServer(t);
  await server.fiveChanBoards.refresh();

  const newer = { ...boardsFile, generatedAt: boardsFile.generatedAt + 60 };
  await server.writeFile(newer);
  const beforeRefresh = await server.get("/api/v1/5chan/boards");
  assert.equal((await beforeRefresh.json()).generatedAt, boardsFile.generatedAt);

  await server.fiveChanBoards.refresh();
  const afterRefresh = await server.get("/api/v1/5chan/boards");
  assert.equal((await afterRefresh.json()).generatedAt, newer.generatedAt);

  // A broken file keeps the last good snapshot.
  await server.writeFile({ version: 2 });
  await server.fiveChanBoards.refresh();
  const kept = await server.get("/api/v1/5chan/boards");
  assert.equal((await kept.json()).generatedAt, newer.generatedAt);
});

test("answers 502, readable from any origin, until the monitor writes the boards file", async (t) => {
  const server = await startBoardsServer(t, { file: null });
  server.fiveChanBoards.start();

  const response = await server.get("/api/v1/5chan/boards");
  assert.equal(response.status, 502);
  assert.equal(response.headers.get("access-control-allow-origin"), "*");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { error: "Stats data is temporarily unavailable." });
});
