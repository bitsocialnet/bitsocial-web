import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["three"],
  },
}));
