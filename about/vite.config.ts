import { build, defineConfig, type Plugin, type ResolvedConfig } from "vite";
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

/**
 * Project logos that mirror a file in the project's own repository. Every build fetches them from the
 * repository's master branch and overwrites the committed copy in public/assets/apps when it differs, so a
 * logo changed upstream reaches bitsocial.net on its next deploy. The committed copy is the fallback when
 * GitHub cannot be reached. AskWise is not listed: its icon is a rounded-corner edit of the bot's square avatar.
 */
const syncedAppLogos = [
  { file: "modelswarm.svg", source: "bitsocialnet/modelswarm/master/public/logo.svg" },
  { file: "wetube.svg", source: "bitsocialnet/wetube/master/design/logo/wetube-favicon.svg" },
];

// The logos are served from bitsocial.net itself, so accept only a plain SVG document without script hooks.
function isPlainSvg(text: string) {
  const trimmed = text.trim();
  return (
    trimmed.length < 256_000 &&
    /^(<\?xml[^>]*\?>\s*)?<svg[\s>]/.test(trimmed) &&
    trimmed.endsWith("</svg>") &&
    !/<script|<foreignObject|\son[a-z]+\s*=|javascript:/i.test(trimmed)
  );
}

function appLogoSyncPlugin(): Plugin {
  let logger: ResolvedConfig["logger"];

  return {
    name: "bitsocial-app-logo-sync",
    apply: "build",
    configResolved(config) {
      logger = config.logger;
    },
    async buildStart() {
      await Promise.all(
        syncedAppLogos.map(async ({ file, source }) => {
          const url = `https://raw.githubusercontent.com/${source}`;
          const target = path.join(__dirname, "public/assets/apps", file);
          try {
            const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            const svg = await response.text();
            if (!isPlainSvg(svg)) {
              throw new Error("response is not a plain SVG");
            }
            const current = await fs.readFile(target, "utf8").catch(() => "");
            if (current !== svg) {
              await fs.writeFile(target, svg);
              logger.info(`Updated about/public/assets/apps/${file} from ${url}`);
            }
          } catch (error) {
            logger.warn(
              `Kept the committed about/public/assets/apps/${file}: could not sync it from ${url} (${error instanceof Error ? error.message : String(error)})`,
            );
          }
        }),
      );
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

function ssrServerBuildPlugin(profiling: boolean) {
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
          // The production API handler resolves this fixed path even when
          // Vercel overrides the client output directory to about/dist.
          outDir: profiling
            ? path.join(clientOutDir, "server")
            : path.resolve(configRoot, "../dist/server"),
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
        ssr: {
          // react-router's conditional exports (module-sync vs default) can resolve at
          // runtime to files Vercel's function tracing did not ship, so bundle it.
          noExternal: ["react-router", "react-router-dom"],
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
export default defineConfig(({ command, mode }) => {
  const profiling = mode === "profiling";
  return {
    root: __dirname,
    plugins: [
      react(),
      appLogoSyncPlugin(),
      staticMetadataPlugin(),
      ssrServerBuildPlugin(profiling),
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
      outDir: path.resolve(__dirname, profiling ? "../dist-profile/about" : "../dist"),
      minify: profiling ? false : undefined,
      sourcemap: profiling,
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
        ...(profiling ? { "react-dom/client": "react-dom/profiling" } : {}),
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
