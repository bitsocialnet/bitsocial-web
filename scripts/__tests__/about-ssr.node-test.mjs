import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { transform } from "esbuild";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

test("Vercel's client output override keeps the SSR handler runnable", async (t) => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "bitsocial-ssr-"));
  t.after(() => rm(fixture, { recursive: true, force: true }));
  await mkdir(path.join(fixture, "about/api"), { recursive: true });
  await cp(path.join(repoRoot, "package.json"), path.join(fixture, "package.json"));
  await cp(path.join(repoRoot, "scripts/react-perf"), path.join(fixture, "scripts/react-perf"), {
    recursive: true,
  });
  await symlink(path.join(repoRoot, "node_modules"), path.join(fixture, "node_modules"));
  for (const entry of [
    "src",
    "public",
    "index.html",
    "tailwind.config.ts",
    "vite.config.ts",
    "package.json",
  ]) {
    await cp(path.join(repoRoot, "about", entry), path.join(fixture, "about", entry), {
      recursive: true,
    });
  }

  // Match the Vercel project: client files go to about/dist, while the API
  // handler resolves its server bundle relative to about/api/ssr.js.
  execFileSync(
    process.execPath,
    [
      path.join(repoRoot, "node_modules/vite/bin/vite.js"),
      "build",
      "--config",
      "about/vite.config.ts",
      "--outDir",
      "dist",
    ],
    { cwd: fixture, stdio: "pipe", env: { ...process.env, NODE_ENV: "production" } },
  );

  const handlerSource = await readFile(path.join(repoRoot, "about/api/ssr.ts"), "utf8");
  const { code } = await transform(handlerSource, { loader: "ts", format: "esm" });
  const handlerPath = path.join(fixture, "about/api/ssr.js");
  await writeFile(handlerPath, code);
  const { default: handler } = await import(pathToFileURL(handlerPath).href);

  for (const [url, expectedStatus, locale] of [
    ["/", 200, "en"],
    ["/projects?lang=it", 200, "it"],
    ["/missing-page", 404, "en"],
  ]) {
    const result = { headers: {} };
    await handler(
      { url, headers: {} },
      {
        status(status) {
          result.status = status;
          return this;
        },
        setHeader(name, value) {
          result.headers[name] = value;
        },
        send(body) {
          result.body = body;
        },
      },
    );
    assert.equal(result.status, expectedStatus, url);
    assert.equal(result.headers["X-Bitsocial-Locale"], locale, url);
    if (expectedStatus === 200) {
      assert.ok(/<h1\b/.test(result.body), `${url} must contain rendered page content`);
    }
    assert.ok(!result.body.includes("<!--app-html-->"), `${url} must render the app shell`);
    const script = result.body.match(/<script[^>]+src="(\/assets\/[^" ]+)"/);
    assert.ok(script, "SSR must reference the built client script");
    await readFile(path.join(fixture, "about/dist", script[1]));
  }

  const productionServer = path.join(fixture, "dist/server/entry-server.js");
  const productionMtime = (await stat(productionServer)).mtimeMs;
  execFileSync(
    process.execPath,
    [
      path.join(repoRoot, "node_modules/vite/bin/vite.js"),
      "build",
      "--config",
      "about/vite.config.ts",
      "--mode",
      "profiling",
    ],
    { cwd: fixture, stdio: "pipe", env: { ...process.env, NODE_ENV: "production" } },
  );
  await readFile(path.join(fixture, "dist-profile/about/server/entry-server.js"));
  assert.equal(
    (await stat(productionServer)).mtimeMs,
    productionMtime,
    "profiling must not overwrite the production server bundle",
  );
});
