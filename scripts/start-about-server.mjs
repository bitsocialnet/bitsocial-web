#!/usr/bin/env node

import { createServer as createHttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createServer as createViteServer } from "vite";
import { repoRoot, resolvePort } from "./dev-server-utils.mjs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

const fallbackPort = Number(process.env.ABOUT_PORT || 3000);
const requestedPort = Number(process.env.PORT || fallbackPort);
const host = process.env.HOST || "127.0.0.1";
const usingPortless = Boolean(process.env.PORTLESS_URL);

if (!Number.isInteger(requestedPort) || requestedPort <= 0) {
  fail(`Invalid about port: ${process.env.PORT || process.env.ABOUT_PORT || "undefined"}`);
}

const port = usingPortless ? requestedPort : await resolvePort(requestedPort);
const aboutRoot = path.join(repoRoot, "about");
const templatePath = path.join(aboutRoot, "index.html");
const hmrServer = createHttpServer();

const vite = await createViteServer({
  configFile: path.join(aboutRoot, "vite.config.ts"),
  appType: "custom",
  server: {
    middlewareMode: true,
    hmr: {
      server: hmrServer,
    },
  },
});

hmrServer.on("request", (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);

  if (
    requestUrl.pathname === "/_vercel/insights/script.js" ||
    requestUrl.pathname === "/_vercel/speed-insights/script.js"
  ) {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/javascript; charset=utf-8");
    response.end("");
    return;
  }

  vite.middlewares(request, response, async () => {
    try {
      const template = await readFile(templatePath, "utf8");
      const transformedTemplate = await vite.transformIndexHtml(requestUrl.pathname, template);
      const serverEntry = await vite.ssrLoadModule("/src/server/render-about.tsx");
      const rendered = await serverEntry.renderAboutRequest({
        url: request.url ?? "/",
        headers: request.headers,
        templateHtml: transformedTemplate,
      });

      response.statusCode = rendered.status;
      for (const [headerName, headerValue] of Object.entries(rendered.headers)) {
        response.setHeader(headerName, headerValue);
      }
      response.end(rendered.body);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.end(String(error?.stack ?? error));
    }
  });
});

const forwardSignal = (signal) => {
  hmrServer.close(() => {
    vite.close().finally(() => {
      process.kill(process.pid, signal);
    });
  });
};

const onSigint = () => forwardSignal("SIGINT");
const onSigterm = () => forwardSignal("SIGTERM");

process.on("SIGINT", onSigint);
process.on("SIGTERM", onSigterm);

hmrServer.listen(port, host, () => {
  console.log("");
  console.log(`Starting about SSR dev server from ${repoRoot}`);
  if (usingPortless) {
    console.log(`Public URL: ${process.env.PORTLESS_URL}`);
  }
  console.log(`Host URL: http://${host}:${port}`);
  if (!usingPortless && port !== requestedPort) {
    console.log(`Preferred port ${requestedPort} is busy, so this run will use ${port}.`);
  }
  console.log("");
});
