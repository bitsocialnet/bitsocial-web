import { build, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "tailwindcss";
import { renderRobotsTxt, renderSitemapXml, getStaticSeoRoutes } from "./src/lib/seo";

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

function statsDevProxyTarget() {
  if (process.env.STATS_DEV_PROXY_TARGET) {
    return process.env.STATS_DEV_PROXY_TARGET;
  }

  try {
    const vercelConfig = JSON.parse(
      readFileSync(path.resolve(__dirname, "vercel.json"), "utf8"),
    ) as {
      routes?: Array<{ src?: string; dest?: string }>;
    };
    const statsRoute = vercelConfig.routes?.find((route) => route.src === "^/stats/?$");

    if (!statsRoute?.dest) {
      return undefined;
    }

    return new URL(statsRoute.dest).origin;
  } catch {
    return undefined;
  }
}

function staticMetadataPlugin() {
  let outDir = path.resolve(__dirname, "../dist");

  return {
    name: "bitsocial-static-metadata",
    apply: "build" as const,
    configResolved(config) {
      outDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const routes = getStaticSeoRoutes();

      await fs.writeFile(path.join(outDir, "robots.txt"), renderRobotsTxt());
      await fs.writeFile(path.join(outDir, "sitemap.xml"), renderSitemapXml(routes));
    },
  };
}

function ssrServerBuildPlugin() {
  let configRoot = __dirname;

  return {
    name: "bitsocial-ssr-server-build",
    apply: "build" as const,
    configResolved(config) {
      configRoot = config.root;
    },
    async closeBundle() {
      if (process.env.BITSOCIAL_SSR_SERVER_BUILD === "1") {
        return;
      }

      await build({
        configFile: false,
        root: configRoot,
        plugins: [react()],
        build: {
          ssr: path.resolve(configRoot, "src/entry-server.tsx"),
          outDir: path.resolve(configRoot, "../dist/server"),
          emptyOutDir: false,
          rollupOptions: {
            output: {
              entryFileNames: "entry-server.js",
              format: "es",
            },
          },
        },
        css: {
          postcss: {
            plugins: [
              tailwindcss({
                config: path.resolve(configRoot, "tailwind.config.ts"),
              }),
              autoprefixer(),
            ],
          },
        },
        resolve: {
          alias: {
            "@": path.resolve(configRoot, "./src"),
          },
        },
        define: {
          "process.env.BITSOCIAL_SSR_SERVER_BUILD": JSON.stringify("1"),
        },
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const statsProxyTarget = statsDevProxyTarget();

  return {
    root: __dirname,
    plugins: [react(), staticMetadataPlugin(), ssrServerBuildPlugin()],
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
              ...(statsProxyTarget
                ? {
                    "^/stats(?:/.*)?$": {
                      target: statsProxyTarget,
                      changeOrigin: true,
                      ws: true,
                    },
                  }
                : {}),
            }
          : undefined,
    },
    preview: {
      open: process.env.PORTLESS === "0" ? true : previewOpenUrl,
    },
    build: {
      outDir: path.resolve(__dirname, "../dist"),
      emptyOutDir: true,
      ssrManifest: true,
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
  };
});
