import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  plugins: [react()],
  build: {
    outDir: path.resolve(
      __dirname,
      mode === "profiling" ? "../dist-profile/chain" : "../dist-chain",
    ),
    minify: mode === "profiling" ? false : undefined,
    sourcemap: mode === "profiling",
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
}));
