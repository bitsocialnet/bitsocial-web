import { defineConfig, type HtmlTagDescriptor, type Plugin } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * These pages render entirely in the browser, and each HTML entry reaches its page through a
 * chain of dynamic imports (entry, bootstrap, page chunk, then the translations), so nothing
 * paints until four requests have run one after another. Listing the page's chunks, its
 * stylesheets and the English translations (always fetched: the language itself or its
 * fallback) in the HTML lets them all download with the document.
 */
function pagePreloadPlugin(): Plugin {
  return {
    name: "bitsocial-chain-page-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, { bundle, chunk, path: htmlPath }) {
        if (!bundle || !chunk) return;

        const chunks = new Map(
          Object.values(bundle).flatMap((output) =>
            output.type === "chunk" ? [[output.fileName, output] as const] : [],
          ),
        );
        const scripts = new Set<string>();
        const styles = new Set<string>();
        const collect = (fileName: string) => {
          const current = chunks.get(fileName);
          if (!current || scripts.has(fileName)) return;
          scripts.add(fileName);
          current.viteMetadata?.importedCss.forEach((css) => styles.add(css));
          current.imports.forEach(collect);
        };
        // Only the entry's own dynamic imports: deeper ones are optional, such as the charts.
        chunk.dynamicImports.forEach(collect);
        // Vite already preloads the entry's static imports.
        chunk.imports.forEach((fileName) => scripts.delete(fileName));

        // `base` is "./", so asset URLs are relative to the HTML file's own directory.
        const toRoot = "../".repeat(htmlPath.split("/").length - 2) || "./";
        const tags: HtmlTagDescriptor[] = [
          ...[...styles].map((fileName) => ({
            tag: "link",
            attrs: { rel: "stylesheet", crossorigin: true, href: `${toRoot}${fileName}` },
            injectTo: "head" as const,
          })),
          ...[...scripts].map((fileName) => ({
            tag: "link",
            attrs: { rel: "modulepreload", crossorigin: true, href: `${toRoot}${fileName}` },
            injectTo: "head" as const,
          })),
          {
            tag: "link",
            attrs: {
              rel: "preload",
              as: "fetch",
              crossorigin: true,
              href: "/translations/en/default.json",
            },
            injectTo: "head" as const,
          },
        ];

        return tags;
      },
    },
  };
}

// Static marketing SPA for Bitsocial Chain. Mirrors the about/ app's build wiring
// (root + config-relative Tailwind) but without SSR, proxies, or P2P polyfills.
export default defineConfig(({ mode }) => ({
  root: __dirname,
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      ...(mode === "profiling" ? { "react-dom/client": "react-dom/profiling" } : {}),
    },
  },
  plugins: [react(), pagePreloadPlugin()],
  build: {
    outDir: path.resolve(
      __dirname,
      mode === "profiling" ? "../dist-profile/chain" : "../dist-chain",
    ),
    minify: mode === "profiling" ? false : undefined,
    sourcemap: mode === "profiling",
    emptyOutDir: true,
    // Three static pages: the landing page, the rich list at /rich-list/ and the chart at /chart/.
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        richList: path.resolve(__dirname, "rich-list/index.html"),
        chart: path.resolve(__dirname, "chart/index.html"),
      },
    },
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
}));
