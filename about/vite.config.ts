import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "tailwindcss";
import {
  getStaticSeoRoutes,
  injectSeoHead,
  renderRobotsTxt,
  renderSitemapXml,
} from "./src/lib/seo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const previewOpenUrl = "http://bitsocial.localhost:1355/";
const isPreviewCommand = process.argv.includes("preview");

/** Docusaurus dev server when `yarn start:docs` runs under Portless (`docs.bitsocial.localhost:1355`). */
const docsDevProxyDefaultPortless = "http://docs.bitsocial.localhost:1355";
/**
 * When Portless is off, `start-docs.mjs` binds Docusaurus to localhost (default 3001).
 * When Portless is on, the real port is random (4000–4999); proxy via the public URL instead.
 * Override for worktrees where the docs host is prefixed (see Portless git worktree behavior).
 */
function docsDevProxyTarget() {
  if (process.env.DOCS_DEV_PROXY_TARGET) {
    return process.env.DOCS_DEV_PROXY_TARGET;
  }
  if (process.env.PORTLESS === "0") {
    const port = process.env.DOCS_PORT ?? "3001";
    return `http://127.0.0.1:${port}`;
  }
  return docsDevProxyDefaultPortless;
}

function staticSeoPlugin() {
  let outDir = path.resolve(__dirname, "../dist");

  function routeToOutputPath(pathname: string) {
    if (pathname === "/") {
      return path.join(outDir, "index.html");
    }

    return path.join(outDir, pathname.replace(/^\//, ""), "index.html");
  }

  return {
    name: "bitsocial-static-seo",
    apply: "build" as const,
    configResolved(config) {
      outDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const indexHtmlPath = path.join(outDir, "index.html");
      const baseHtml = await fs.readFile(indexHtmlPath, "utf8");
      const routes = getStaticSeoRoutes();

      await Promise.all(
        routes.map(async (route) => {
          const outputPath = routeToOutputPath(route.pathname);
          const html = injectSeoHead(baseHtml, route.seo);
          await fs.mkdir(path.dirname(outputPath), { recursive: true });
          await fs.writeFile(outputPath, html);
        }),
      );

      await fs.writeFile(path.join(outDir, "robots.txt"), renderRobotsTxt());
      await fs.writeFile(path.join(outDir, "sitemap.xml"), renderSitemapXml(routes));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  root: __dirname,
  plugins: [react(), staticSeoPlugin()],
  server: {
    // Portless serves the app at a stable hostname; open that URL, not the internal Vite port.
    open: process.env.PORTLESS === "0" ? true : previewOpenUrl,
    proxy:
      command === "serve" && !isPreviewCommand
        ? {
            "^/docs(?:/.*)?$": {
              target: docsDevProxyTarget(),
              changeOrigin: true,
              ws: true,
            },
          }
        : undefined,
  },
  preview: {
    open: process.env.PORTLESS === "0" ? true : previewOpenUrl,
  },
  build: {
    outDir: path.resolve(__dirname, "../dist"),
    emptyOutDir: true,
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: path.resolve(__dirname, "tailwind.config.ts"),
        }),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["three"],
  },
}));
