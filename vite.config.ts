import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const previewOpenUrl = "http://bitsocial.localhost:1355/";
const isPreviewCommand = process.argv.includes("preview");

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
              target: "http://127.0.0.1:3001",
              changeOrigin: true,
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
