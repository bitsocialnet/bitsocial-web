#!/usr/bin/env node

// Local stand-in for the production Caddy site: applies the same short-path redirects
// from stats/deploy/Caddyfile and proxies everything else to the local Grafana container.

import http from "node:http";
import net from "node:net";
import process from "node:process";
import { readStatsRedirects, resolvePort } from "./dev-server-utils.mjs";

// Published by stats/compose.yaml.
const grafanaHost = "127.0.0.1";
const grafanaPort = 3300;
const host = process.env.HOST || "127.0.0.1";
const usingPortless = Boolean(process.env.PORTLESS_URL);
const requestedPort = Number(process.env.PORT || process.env.STATS_PORT || 3302);
const port = usingPortless ? requestedPort : await resolvePort(requestedPort);

const redirects = readStatsRedirects();

const server = http.createServer((request, response) => {
  const { pathname } = new URL(request.url, "http://localhost");
  const redirectTarget = redirects.get(pathname);
  if (redirectTarget) {
    response.writeHead(302, { Location: redirectTarget });
    response.end();
    return;
  }

  const upstreamRequest = http.request(
    {
      host: grafanaHost,
      port: grafanaPort,
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
    response.end(`Grafana is not reachable on ${grafanaHost}:${grafanaPort}: ${error.message}\n`);
  });
  request.pipe(upstreamRequest);
});

// Grafana Live uses WebSockets; pass upgrade requests through untouched.
server.on("upgrade", (request, socket, head) => {
  const upstream = net.connect(grafanaPort, grafanaHost, () => {
    const headerLines = [];
    for (let index = 0; index < request.rawHeaders.length; index += 2) {
      headerLines.push(`${request.rawHeaders[index]}: ${request.rawHeaders[index + 1]}`);
    }
    upstream.write(
      `${request.method} ${request.url} HTTP/${request.httpVersion}\r\n${headerLines.join("\r\n")}\r\n\r\n`,
    );
    upstream.write(head);
    socket.pipe(upstream).pipe(socket);
  });
  upstream.on("error", () => socket.destroy());
  socket.on("error", () => upstream.destroy());
});

server.listen(port, host, () => {
  console.log("");
  if (usingPortless) {
    console.log(`Public URL: ${process.env.PORTLESS_URL}`);
  }
  console.log(`Host URL: http://${host}:${port}`);
  for (const [redirectPath, target] of redirects) {
    console.log(`  ${redirectPath} -> ${target}`);
  }
  console.log("");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    server.closeAllConnections();
  });
}
