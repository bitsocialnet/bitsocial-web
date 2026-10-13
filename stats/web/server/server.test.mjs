import assert from "node:assert/strict";
import test from "node:test";
import { createStatsServer } from "./server.mjs";

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

const startServer = async (dashboardOverrides = {}) => {
  const builds = [];
  const dashboard = {
    hasClient: (clientId) => clientId === "5chan",
    hasCommunity: (clientId, address) => clientId === "5chan" && address === "biz.bso",
    overview: async (timeline) => {
      builds.push(["overview", timeline.key]);
      return { view: "overview", range: timeline.key };
    },
    clientView: async (clientId, timeline) => {
      builds.push(["client", clientId, timeline.key]);
      return { view: "client", clientId };
    },
    communityView: async (clientId, address, timeline) => {
      builds.push(["community", clientId, address, timeline.key]);
      return { view: "community", address };
    },
    ...dashboardOverrides,
  };
  const server = createStatsServer({
    dashboard,
    staticFiles,
    pageRoutes: new Set(["/", "/5chan", "/seedit"]),
    now: () => 1_800_000_000,
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    builds,
    get: (path, options) => fetch(`${base}${path}`, { redirect: "manual", ...options }),
    close: () => new Promise((resolve) => server.close(resolve)),
  };
};

test("serves the API and shares one build per view and range", async (t) => {
  const server = await startServer();
  t.after(server.close);

  const first = await server.get("/api/v1/overview");
  assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), { view: "overview", range: "24h" });
  assert.match(first.headers.get("cache-control"), /max-age=30/);
  await server.get("/api/v1/overview?range=24h");
  await server.get("/api/v1/overview?range=7d");
  assert.deepEqual(server.builds, [
    ["overview", "24h"],
    ["overview", "7d"],
  ]);

  const client = await server.get("/api/v1/clients/5chan?range=6h");
  assert.deepEqual(await client.json(), { view: "client", clientId: "5chan" });
  const community = await server.get("/api/v1/clients/5chan/communities/biz.bso");
  assert.deepEqual(await community.json(), { view: "community", address: "biz.bso" });
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
  assert.deepEqual(server.builds, []);
});

test("answers 502 without caching a failed build", async (t) => {
  let attempts = 0;
  const server = await startServer({
    overview: async () => {
      attempts += 1;
      throw new Error("Prometheus is down");
    },
  });
  t.after(server.close);

  const response = await server.get("/api/v1/overview");
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: "Stats data is temporarily unavailable." });
  await server.get("/api/v1/overview");
  assert.equal(attempts, 2);
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
