import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import monitorConfig from "../../monitor/config.js";
import { statsClients } from "../../shared/stats-queries.mjs";
import { loadCommunityLists } from "./communities.mjs";
import { createDashboard } from "./dashboard.mjs";
import { createPrometheusClient } from "./prometheus.mjs";
import { DEFAULT_RANGE, RANGES, getTimeline } from "./ranges.mjs";
import { loadStaticFiles } from "./static-files.mjs";

// Serves stats.bitsocial.net: the built dashboard plus a read-only JSON API that runs a fixed set
// of Prometheus queries per view. Responses are cached briefly, so traffic never multiplies load
// on Prometheus.

const CACHE_SECONDS = 30;

// Grafana shared-dashboard links from before this dashboard replaced them.
const legacyDashboardPaths = new Map([
  ["e9277bcc0c421ddcacd29f591466678c", "/"],
  ["fa6f2225e0ea98e116fb6f85d84e0186", "/5chan"],
  ["c770d7565c18df52dd26461c9191e05d", "/seedit"],
]);

const securityHeaders = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
};

const pageHeaders = {
  ...securityHeaders,
  "Cache-Control": "no-cache",
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' https://fonts.gstatic.com; form-action 'none'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
};

const sendJson = (response, status, body, headers = {}) => {
  response.writeHead(status, {
    ...securityHeaders,
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });
  response.end(JSON.stringify(body));
};

export const createStatsServer = ({
  dashboard,
  staticFiles,
  pageRoutes,
  now = () => Date.now() / 1000,
}) => {
  const cache = new Map();

  // Shares one in-flight or recent result per view and range between all visitors.
  const cached = (key, build) => {
    const time = now();
    for (const [entryKey, entry] of cache) {
      if (entry.expiresAt <= time) {
        cache.delete(entryKey);
      }
    }
    let entry = cache.get(key);
    if (!entry) {
      entry = { expiresAt: time + CACHE_SECONDS, promise: build() };
      cache.set(key, entry);
      entry.promise.catch(() => cache.delete(key));
    }
    return entry.promise;
  };

  const handleApi = async (pathname, searchParams, response) => {
    const rangeKey = searchParams.get("range") || DEFAULT_RANGE;
    if (!Object.hasOwn(RANGES, rangeKey)) {
      sendJson(response, 400, {
        error: `range must be one of ${Object.keys(RANGES).join(", ")}`,
      });
      return;
    }

    const [, , , view, clientId, child, encodedAddress, ...rest] = pathname.split("/");
    let key;
    let build;
    if (view === "overview" && clientId === undefined) {
      key = `overview:${rangeKey}`;
      build = () => dashboard.overview(getTimeline(rangeKey, now()));
    } else if (view === "clients" && dashboard.hasClient(clientId) && child === undefined) {
      key = `client:${clientId}:${rangeKey}`;
      build = () => dashboard.clientView(clientId, getTimeline(rangeKey, now()));
    } else if (
      view === "clients" &&
      dashboard.hasClient(clientId) &&
      child === "communities" &&
      encodedAddress &&
      rest.length === 0
    ) {
      let address;
      try {
        address = decodeURIComponent(encodedAddress);
      } catch {
        address = undefined;
      }
      if (!address || !dashboard.hasCommunity(clientId, address)) {
        sendJson(response, 404, { error: "unknown community" });
        return;
      }
      key = `community:${clientId}:${address}:${rangeKey}`;
      build = () => dashboard.communityView(clientId, address, getTimeline(rangeKey, now()));
    } else {
      sendJson(response, 404, { error: "not found" });
      return;
    }

    try {
      const body = await cached(key, build);
      sendJson(response, 200, body, { "Cache-Control": `public, max-age=${CACHE_SECONDS}` });
    } catch (error) {
      console.error(`stats api ${key} failed: ${error.message}`);
      sendJson(
        response,
        502,
        { error: "Stats data is temporarily unavailable." },
        { "Cache-Control": "no-store" },
      );
    }
  };

  const handleRequest = async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { ...securityHeaders, Allow: "GET, HEAD" });
      response.end();
      return;
    }

    const { pathname, searchParams } = new URL(request.url, "http://localhost");

    if (pathname === "/healthz") {
      response.writeHead(200, { ...securityHeaders, "Content-Type": "text/plain" });
      response.end("ok\n");
      return;
    }

    if (pathname.startsWith("/api/v1/")) {
      await handleApi(pathname, searchParams, response);
      return;
    }

    const legacyMatch = pathname.match(/^\/public-dashboards\/([0-9a-f]+)\/?$/);
    if (legacyMatch && legacyDashboardPaths.has(legacyMatch[1])) {
      response.writeHead(301, {
        ...securityHeaders,
        Location: legacyDashboardPaths.get(legacyMatch[1]),
      });
      response.end();
      return;
    }

    const routePath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const file = pageRoutes.has(routePath)
      ? staticFiles.get("/index.html")
      : staticFiles.get(pathname);
    if (!file) {
      response.writeHead(404, { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found\n");
      return;
    }

    const isPage = file.contentType.startsWith("text/html");
    response.writeHead(200, {
      ...(isPage ? pageHeaders : { ...securityHeaders, "Cache-Control": file.cacheControl }),
      "Content-Type": file.contentType,
      "Content-Length": file.body.length,
    });
    response.end(request.method === "HEAD" ? undefined : file.body);
  };

  return http.createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      console.error(error);
      if (!response.headersSent) {
        response.writeHead(500, securityHeaders);
      }
      response.end();
    });
  });
};

const main = () => {
  const serverDir = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.resolve(
    process.env.BITSOCIAL_STATS_WEB_DIST || path.join(serverDir, "..", "dist"),
  );
  const prometheusUrl = process.env.BITSOCIAL_STATS_PROMETHEUS_URL || "http://127.0.0.1:9091";
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "127.0.0.1";

  const { monitoring } = monitorConfig;
  const clientIds = new Set(monitoring.clients.map(({ id }) => id));
  const clients = statsClients.filter(({ id }) => clientIds.has(id));
  const dashboard = createDashboard({
    prometheus: createPrometheusClient({ baseUrl: prometheusUrl }),
    monitoring,
    clients,
    communityLists: loadCommunityLists(monitoring.clients),
  });

  // The API also runs without a built UI, behind the Vite dev server.
  const staticFiles = fs.existsSync(path.join(distDir, "index.html"))
    ? loadStaticFiles(distDir)
    : new Map();
  if (staticFiles.size === 0) {
    console.warn(`no built dashboard in ${distDir}; serving the API only`);
  }

  const server = createStatsServer({
    dashboard,
    staticFiles,
    pageRoutes: new Set(["/", ...clients.map(({ id }) => `/${id}`)]),
  });
  server.listen(port, host, () => {
    console.log(`stats web listening on http://${host}:${port} (Prometheus: ${prometheusUrl})`);
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      server.close(() => process.exit(0));
      server.closeAllConnections();
    });
  }
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
