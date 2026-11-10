import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
let instances = 0;

/** Bundles one `about/src` module and imports a fresh instance of it. */
async function load(modulePath, plugins = []) {
  const { outputFiles } = await build({
    entryPoints: [path.join(repoRoot, "about/src", modulePath)],
    alias: { "@": path.join(repoRoot, "about/src") },
    bundle: true,
    format: "esm",
    platform: "neutral",
    plugins,
    write: false,
  });
  instances += 1;
  const source = `${outputFiles[0].text}\n// instance ${instances}\n`;
  return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
}

function replaceGlobal(t, name, value) {
  const original = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, value, writable: true });
  t.after(() => {
    if (original) {
      Object.defineProperty(globalThis, name, original);
    } else {
      delete globalThis[name];
    }
  });
}

/** A window whose timers and frames run on node:test's mocked `setTimeout`. */
function fakeWindow() {
  const listeners = new Map();
  const win = {
    scrollY: 0,
    scrollCalls: 0,
    history: { scrollRestoration: "auto" },
    scrollTo({ top }) {
      win.scrollCalls += 1;
      win.scrollY = top;
    },
    setTimeout: (callback, delay) => globalThis.setTimeout(callback, delay),
    clearTimeout: (id) => globalThis.clearTimeout(id),
    requestAnimationFrame: (callback) => globalThis.setTimeout(callback, 16),
    cancelAnimationFrame: (id) => globalThis.clearTimeout(id),
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) {
      listeners.get(type)?.delete(listener);
    },
    dispatch(type) {
      for (const listener of listeners.get(type) ?? []) listener(new Event(type));
    },
    listenerCount: (type) => listeners.get(type)?.size ?? 0,
  };
  return win;
}

function fakeScrollDocument() {
  let resolveFonts;
  const fontsReady = new Promise((resolve) => {
    resolveFonts = resolve;
  });
  return {
    document: {
      documentElement: { style: { overflowAnchor: "" } },
      body: { style: { overflowAnchor: "" } },
      fonts: { ready: fontsReady },
    },
    resolveFonts,
  };
}

test("initial home scroll guard holds the top only during its settle window", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const win = fakeWindow();
  const { document, resolveFonts } = fakeScrollDocument();
  replaceGlobal(t, "window", win);
  replaceGlobal(t, "document", document);
  const { normalizeInitialHomeScrollPosition } = await load("lib/initial-scroll.ts");

  const cleanup = normalizeInitialHomeScrollPosition();
  assert.equal(win.history.scrollRestoration, "manual");

  // A `pageshow` inside the window is still corrected.
  t.mock.timers.tick(100);
  win.scrollY = 40;
  win.dispatch("pageshow");
  assert.equal(win.scrollY, 0);

  t.mock.timers.tick(300);
  assert.equal(win.history.scrollRestoration, "auto");
  assert.equal(document.documentElement.style.overflowAnchor, "");

  // The reader scrolls, then a slow `load` (its `pageshow`) and the font swap land.
  win.scrollY = 1200;
  const scrollCallsAfterSettle = win.scrollCalls;
  win.dispatch("pageshow");
  t.mock.timers.tick(100);
  resolveFonts();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(win.scrollY, 1200, "a settled guard must not pull the reader back to the top");
  assert.equal(win.scrollCalls, scrollCallsAfterSettle);
  assert.equal(win.listenerCount("pageshow"), 0);
  cleanup();
});
