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

/** Session history for one tab: `pushState`/`replaceState` and the URL they leave behind. */
function fakeBrowser(t, url) {
  const entries = [{ state: null, url: new URL(url, "https://bitsocial.test") }];
  let index = 0;
  const current = () => entries[index];
  const win = {
    location: {
      get hash() {
        return current().url.hash;
      },
      get pathname() {
        return current().url.pathname;
      },
      get search() {
        return current().url.search;
      },
    },
    history: {
      get length() {
        return entries.length;
      },
      get state() {
        return current().state;
      },
      pushState(state, _unused, nextUrl) {
        entries.splice(index + 1);
        entries.push({ state, url: new URL(nextUrl, current().url) });
        index += 1;
      },
      replaceState(state, _unused, nextUrl) {
        entries[index] = { state, url: new URL(nextUrl, current().url) };
      },
      back() {
        index = Math.max(0, index - 1);
      },
    },
    get url() {
      const { pathname, search, hash } = current().url;
      return `${pathname}${search}${hash}`;
    },
  };
  const scrolledTo = [];
  replaceGlobal(t, "window", win);
  replaceGlobal(t, "document", {
    documentElement: { dataset: {} },
    getElementById: (id) => ({ scrollIntoView: () => scrolledTo.push(id) }),
  });
  return { scrolledTo, win };
}

/** React Router's `navigate`: it writes the URL and becomes the router's `location`. */
function fakeNavigate(win) {
  const calls = [];
  const navigate = (to, options) => {
    calls.push([to, options]);
    const hash = to.hash ? `#${to.hash.replace(/^#/, "")}` : "";
    const url = `${to.pathname}${to.search ?? ""}${hash}`;
    if (options?.replace) {
      win.history.replaceState({ idx: 0 }, "", url);
    } else {
      win.history.pushState({ idx: 1 }, "", url);
    }
  };
  return { calls, navigate };
}

// Stands in for `@/lib/utils`, whose glow helper only needs to report its target here.
const utilsStub = {
  name: "about-utils-stub",
  setup(builder) {
    builder.onResolve({ filter: /^@\/lib\/utils$/ }, () => ({
      path: "utils",
      namespace: "utils-stub",
    }));
    builder.onLoad({ filter: /.*/, namespace: "utils-stub" }, () => ({
      contents: `
        export const getScrollBehavior = () => "auto";
        export const triggerFeatureGlow = (id) => document.getElementById(id)?.scrollIntoView();
      `,
      loader: "js",
    }));
  },
};

test("topbar FAQ rewrites a URL hash an in-page link moved away from the router's", async (t) => {
  // The topbar FAQ jump left the router on '#faq', then an FAQ row pushed '#problem' directly.
  const { scrolledTo, win } = fakeBrowser(t, "/?lang=it#problem");
  const { goToHomeSectionHash } = await load("lib/home-section-nav.ts", [utilsStub]);
  const { calls, navigate } = fakeNavigate(win);
  const lengthBefore = win.history.length;

  goToHomeSectionHash("/", "#faq", "#faq", navigate);

  assert.deepEqual(scrolledTo, ["faq"]);
  assert.equal(win.url, "/?lang=it#faq");
  assert.equal(win.history.length, lengthBefore);
  assert.deepEqual(calls, []);
});

test("topbar FAQ in sync with the router only scrolls", async (t) => {
  const { scrolledTo, win } = fakeBrowser(t, "/#faq");
  win.history.replaceState({ idx: 0 }, "", "/#faq");
  const { goToHomeSectionHash } = await load("lib/home-section-nav.ts", [utilsStub]);
  const { calls, navigate } = fakeNavigate(win);

  goToHomeSectionHash("/", "#faq", "#faq", navigate);

  assert.deepEqual(scrolledTo, ["faq"]);
  assert.equal(win.url, "/#faq");
  assert.deepEqual(win.history.state, { idx: 0 });
  assert.deepEqual(calls, []);
});

test("newsletter links rewrite a URL hash an in-page link moved away from the router's", async (t) => {
  const { scrolledTo, win } = fakeBrowser(t, "/#problem");
  const { goToMailingListSection } = await load("lib/mailing-list-nav.ts", [utilsStub]);
  const { calls, navigate } = fakeNavigate(win);

  goToMailingListSection("/", "#mailing-list", navigate);

  assert.deepEqual(scrolledTo, ["mailing-list"]);
  assert.equal(win.url, "/#mailing-list");
  assert.deepEqual(calls, []);
});
