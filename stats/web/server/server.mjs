import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import monitorConfig from "../../monitor/config.js";
import { statsClients } from "../../shared/stats-queries.mjs";
import { loadCommunityLists } from "./communities.mjs";
import { createDashboard, documentKey } from "./dashboard.mjs";
import {
  FIVE_CHAN_BOARDS_KEY,
  FIVE_CHAN_BOARDS_SECONDS,
  FIVE_CHAN_STATS_KEY,
  createFiveChanBoardsSource,
} from "./five-chan-boards.mjs";
import { createPrometheusClient } from "./prometheus.mjs";
import { DEFAULT_RANGE, RANGES, SNAPSHOT_SECONDS } from "./ranges.mjs";
import { createSnapshots } from "./snapshots.mjs";
import { loadStaticFiles } from "./static-files.mjs";

// Serves stats.bitsocial.net: the built dashboard plus a read-only JSON API. The server builds
// every API document from Prometheus on its own schedule and answers from those snapshots, so the
// number of visitors never changes the load on Prometheus.

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

const acceptsGzip = (header = "") =>
  header.split(",").some((part) => {
    const [coding, ...params] = part.split(";").map((value) => value.trim());
    const quality = params.find((param) => param.startsWith("q="));
    return coding.toLowerCase() === "gzip" && (!quality || Number(quality.slice(2)) > 0);
  });

// Public, read-only data that the 5chan app reads from any origin (web forks, Android, Electron).
const publicReadHeaders = { "Access-Control-Allow-Origin": "*" };

// Lets Cloudflare keep serving an expired 5chan document for up to 10 minutes while it refetches
// in the background, so the first visitor after each expiry does not wait for this server. Only
// Cloudflare reads this header and it does not forward it, so browsers still follow Cache-Control.
// 5chan discards snapshots older than an hour.
const fiveChanEdgeHeaders = {
  "Cloudflare-CDN-Cache-Control": `max-age=${FIVE_CHAN_BOARDS_SECONDS}, stale-while-revalidate=600`,
};

// The home page's Popular Threads box reads the boards, its Stats box the much smaller stats.
const fiveChanDocumentKeys = {
  "/api/v1/5chan/boards": FIVE_CHAN_BOARDS_KEY,
  "/api/v1/5chan/stats": FIVE_CHAN_STATS_KEY,
};

const sendSnapshot = (
  request,
  response,
  snapshot,
  { maxAge = SNAPSHOT_SECONDS, headers: extraHeaders = {} } = {},
) => {
  const headers = {
    ...securityHeaders,
    ...extraHeaders,
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": `public, max-age=${maxAge}`,
    ETag: snapshot.etag,
    Vary: "Accept-Encoding",
  };
  const cachedTags = request.headers["if-none-match"]?.split(",").map((tag) => tag.trim()) || [];
  if (cachedTags.includes(snapshot.etag)) {
    response.writeHead(304, headers);
    response.end();
    return;
  }
  // Compressed once per snapshot, so Caddy passes it through instead of encoding every response.
  const gzip = acceptsGzip(request.headers["accept-encoding"]);
  const body = gzip ? snapshot.gzip : snapshot.json;
  response.writeHead(200, {
    ...headers,
    ...(gzip && { "Content-Encoding": "gzip" }),
    "Content-Length": body.length,
  });
  response.end(request.method === "HEAD" ? undefined : body);
};

const sendUnavailable = (response, headers = {}) =>
  sendJson(
    response,
    502,
    { error: "Stats data is temporarily unavailable." },
    { ...headers, "Cache-Control": "no-store" },
  );

export const createStatsServer = ({
  dashboard,
  snapshots,
  fiveChanBoards,
  staticFiles,
  pageRoutes,
}) => {
  // Takes no parameters: any query string is ignored.
  const handleFiveChanDocument = async (request, response, key) => {
    const snapshot = await fiveChanBoards.get(key);
    if (!snapshot) {
      sendUnavailable(response, publicReadHeaders);
      return;
    }
    sendSnapshot(request, response, snapshot, {
      maxAge: FIVE_CHAN_BOARDS_SECONDS,
      headers: { ...publicReadHeaders, ...fiveChanEdgeHeaders },
    });
  };

  const handleApi = async (request, pathname, searchParams, response) => {
    if (Object.hasOwn(fiveChanDocumentKeys, pathname) && fiveChanBoards) {
      await handleFiveChanDocument(request, response, fiveChanDocumentKeys[pathname]);
      return;
    }

    const rangeKey = searchParams.get("range") || DEFAULT_RANGE;
    if (!Object.hasOwn(RANGES, rangeKey)) {
      sendJson(response, 400, {
        error: `range must be one of ${Object.keys(RANGES).join(", ")}`,
      });
      return;
    }

    const [, , , view, clientId, child, encodedAddress, ...rest] = pathname.split("/");
    let key;
    if (view === "overview" && clientId === undefined) {
      key = documentKey.overview(rangeKey);
    } else if (view === "clients" && dashboard.hasClient(clientId) && child === undefined) {
      key = documentKey.client(clientId, rangeKey);
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
      key = documentKey.community(clientId, address, rangeKey);
    } else {
      sendJson(response, 404, { error: "not found" });
      return;
    }

    const snapshot = await snapshots.get(key);
    if (!snapshot) {
      sendUnavailable(response);
      return;
    }
    sendSnapshot(request, response, snapshot);
  };

  const handleRequest = async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { ...securityHeaders, Allow: "GET, HEAD" });
      response.end();
      return;
    }

    let url;
    try {
      url = new URL(request.url, "http://localhost");
    } catch {
      response.writeHead(400, securityHeaders);
      response.end();
      return;
    }
    const { pathname, searchParams } = url;

    if (pathname === "/healthz") {
      response.writeHead(200, { ...securityHeaders, "Content-Type": "text/plain" });
      response.end("ok\n");
      return;
    }

    if (pathname.startsWith("/api/v1/")) {
      await handleApi(request, pathname, searchParams, response);
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

  const snapshots = createSnapshots({ dashboard });
  const startedAt = Date.now();
  snapshots
    .start()
    .then(() =>
      console.log(
        `stats snapshots: first pass built ${snapshots.size} documents in ${Date.now() - startedAt}ms`,
      ),
    );
  // A separate store, so a missing boards file never delays or masks the Prometheus views. Reading
  // a local file takes milliseconds, so while there is none a request answers 502 within a second
  // rather than waiting out the store's retry interval.
  const fiveChanBoards = createSnapshots({
    dashboard: createFiveChanBoardsSource({ filePath: monitorConfig.fiveChanBoardsPath }),
    windowSeconds: FIVE_CHAN_BOARDS_SECONDS,
    firstPassWaitSeconds: 1,
  });
  fiveChanBoards.start();

  const server = createStatsServer({
    dashboard,
    snapshots,
    fiveChanBoards,
    staticFiles,
    pageRoutes: new Set(["/", ...clients.map(({ id }) => `/${id}`)]),
  });
  server.listen(port, host, () => {
    console.log(`stats web listening on http://${host}:${port} (Prometheus: ${prometheusUrl})`);
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      snapshots.stop();
      fiveChanBoards.stop();
      server.close(() => process.exit(0));
      server.closeAllConnections();
    });
  }
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
