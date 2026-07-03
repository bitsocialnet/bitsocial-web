import { build, defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "tailwindcss";
import { renderRobotsTxt, renderSitemapXml, getStaticSeoRoutes } from "./src/lib/seo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const previewOpenUrl = "https://bitsocial.localhost/";
const isPreviewCommand = process.argv.includes("preview");
const statsDevRedirectOrigin = "https://stats.bitsocial.net";

/** Docusaurus dev server when `yarn start:docs` runs under Portless (`docs.bitsocial.localhost`). */
const docsDevProxyDefaultPortless = "https://docs.bitsocial.localhost";
/**
 * When Portless is off, `start-docs.mjs` binds Docusaurus to localhost (default 3001).
 * When Portless is on, the real port is random (4000–4999); proxy via the public URL instead.
 * Override for worktrees where the docs host is prefixed (see Portless git worktree behavior).
 */
function docsDevRedirectOrigin() {
  if (process.env.DOCS_DEV_PROXY_TARGET) {
    return process.env.DOCS_DEV_PROXY_TARGET.replace(/\/$/, "");
  }
  if (process.env.PORTLESS === "0") {
    const port = process.env.DOCS_PORT ?? "3001";
    return `http://127.0.0.1:${port}`;
  }
  return docsDevProxyDefaultPortless;
}

function redirectToSubdomain(origin: string, subpath: string) {
  if (!subpath || subpath === "/") {
    return `${origin}/`;
  }

  return `${origin}${subpath.startsWith("/") ? subpath : `/${subpath}`}`;
}

function subdomainRedirectPlugin(): Plugin {
  return {
    name: "bitsocial-subdomain-redirects",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
          next();
          return;
        }

        const requestUrl = req.url ?? "/";
        const pathname = requestUrl.split(/[?#]/, 1)[0] ?? "/";

        const docsMatch = pathname.match(/^\/docs(\/.*)?$/);
        if (docsMatch) {
          const location = redirectToSubdomain(docsDevRedirectOrigin(), docsMatch[1] ?? "/");
          res.writeHead(308, { Location: location });
          res.end();
          return;
        }

        const statsMatch = pathname.match(/^\/stats(\/.*)?$/);
        if (statsMatch) {
          const location = redirectToSubdomain(statsDevRedirectOrigin, statsMatch[1] ?? "/");
          res.writeHead(308, { Location: location });
          res.end();
          return;
        }

        next();
      });
    },
  };
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
  let clientOutDir = path.resolve(__dirname, "../dist");

  return {
    name: "bitsocial-ssr-server-build",
    apply: "build" as const,
    configResolved(config) {
      configRoot = config.root;
      clientOutDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      if (process.env.BITSOCIAL_SSR_SERVER_BUILD === "1") {
        return;
      }

      const builtClientTemplateHtml = await fs.readFile(
        path.join(clientOutDir, "index.html"),
        "utf8",
      );

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
          "import.meta.env.BITSOCIAL_SSR_CLIENT_TEMPLATE": JSON.stringify(builtClientTemplateHtml),
        },
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    root: __dirname,
    plugins: [
      react(),
      staticMetadataPlugin(),
      ssrServerBuildPlugin(),
      ...(command === "serve" && !isPreviewCommand ? [subdomainRedirectPlugin()] : []),
    ],
    server: {
      // Portless serves the app at a stable hostname; open that URL, not the internal Vite port.
      open: process.env.PORTLESS_URL || (process.env.PORTLESS === "0" ? true : previewOpenUrl),
    },
    preview: {
      open: process.env.PORTLESS_URL || (process.env.PORTLESS === "0" ? true : previewOpenUrl),
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
        // Node-builtin polyfills required by @pkcprotocol/pkc-js and its libp2p
        // transitive deps when running pure-P2P in the browser. Matches 5chan's
        // browser-libp2p setup (vite.config.js in bitsocialnet/5chan).
        "node-fetch": "isomorphic-fetch",
        assert: "assert",
        stream: "stream-browserify",
        crypto: "crypto-browserify",
        buffer: "buffer",
        events: "events",
        process: "process",
        "node:buffer": "buffer",
        "node:crypto": "crypto-browserify",
        "node:events": "events",
        "node:process": "process",
        "node:stream": "stream-browserify",
        "node:util": "util/",
        "util/": "util/",
        util: "util/",
      },
    },
    optimizeDeps: {
      include: [
        "three",
        "assert",
        "buffer",
        "process",
        "util",
        "stream-browserify",
        "isomorphic-fetch",
      ],
    },
    define: {
      "process.version": JSON.stringify(""),
      global: "globalThis",
      __dirname: '""',
    },
  };
});
