import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Static SPA served by server/server.mjs at stats.bitsocial.net. In development the Vite server
// proxies the JSON API to a locally running server/server.mjs (STATS_API_URL).
export default defineConfig({
  root: __dirname,
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": process.env.STATS_API_URL || "http://127.0.0.1:3302",
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
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
});
