#!/usr/bin/env node

// Local stand-in for the production Caddy site: forwards every request to the stats dashboard
// container, which serves the pages, the /api/v1/ stats API and the legacy Grafana link redirects.

import http from "node:http";
import process from "node:process";
import { resolvePort } from "./dev-server-utils.mjs";

// Published by stats/compose.yaml.
const webHost = "127.0.0.1";
const webPort = 3302;
const host = process.env.HOST || "127.0.0.1";
const usingPortless = Boolean(process.env.PORTLESS_URL);
const requestedPort = Number(process.env.PORT || process.env.STATS_PORT || 3303);
const port = usingPortless ? requestedPort : await resolvePort(requestedPort);

const server = http.createServer((request, response) => {
  const upstreamRequest = http.request(
    {
      host: webHost,
      port: webPort,
      method: request.method,
      path: request.url,
      headers: request.headers,
    },
    (upstreamResponse) => {
      response.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
      upstreamResponse.pipe(response);
    },
  );
  upstreamRequest.on("error", (error) => {
    response.writeHead(502, { "Content-Type": "text/plain" });
    response.end(
      `The stats dashboard is not reachable on ${webHost}:${webPort}: ${error.message}\n`,
    );
  });
  request.pipe(upstreamRequest);
});

server.listen(port, host, () => {
  console.log("");
  if (usingPortless) {
    console.log(`Public URL: ${process.env.PORTLESS_URL}`);
  }
  console.log(`Host URL: http://${host}:${port}`);
  console.log(`Grafana (admin login): http://127.0.0.1:3300/login`);
  console.log("");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    server.closeAllConnections();
  });
}
