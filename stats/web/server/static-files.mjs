import fs from "node:fs";
import path from "node:path";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

const listFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });

// Indexes the built site once at startup, so request paths are only ever looked up in this map
// and never joined onto the filesystem.
export const loadStaticFiles = (distDir) => {
  const files = new Map();
  for (const filePath of listFiles(distDir)) {
    const urlPath = `/${path.relative(distDir, filePath).split(path.sep).join("/")}`;
    files.set(urlPath, {
      body: fs.readFileSync(filePath),
      contentType: contentTypes[path.extname(filePath)] || "application/octet-stream",
      // Vite fingerprints everything under /assets/, so those files never change in place.
      cacheControl: urlPath.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=300",
    });
  }
  return files;
};
