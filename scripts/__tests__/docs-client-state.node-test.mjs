import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { createHookRunner, reactHooksStub } from "./hook-runner.mjs";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

// Stands in for the Docusaurus client modules the docs theme reads its locale and route from.
const docusaurusStub = {
  name: "docusaurus-stub",
  setup(builder) {
    builder.onResolve({ filter: /^@docusaurus\// }, (args) => ({
      path: args.path,
      namespace: "docusaurus-stub",
    }));
    builder.onLoad({ filter: /.*/, namespace: "docusaurus-stub" }, (args) => ({
      contents:
        args.path === "@docusaurus/router"
          ? "export const useLocation = () => globalThis.__docusaurus.location;"
          : "export default () => globalThis.__docusaurus.context;",
      loader: "js",
    }));
  },
};

let bundled = null;
let instances = 0;

/** A fresh module instance per call, as a full page load starts the docs client over. */
async function loadDocsClient() {
  bundled ??= build({
    stdin: {
      contents: [
        'export { default as Root } from "./theme/Root.tsx";',
        'export * as docsLanguage from "./lib/docsLanguage.ts";',
        'export { usePagefindUi } from "./lib/usePagefindUi.ts";',
      ].join("\n"),
      loader: "ts",
      resolveDir: path.join(repoRoot, "docs/src"),
    },
    bundle: true,
    define: { __REACT_PERF_ENABLED__: "false" },
    format: "esm",
    jsx: "automatic",
    platform: "neutral",
    plugins: [reactHooksStub, docusaurusStub],
    write: false,
  }).then(({ outputFiles }) => outputFiles[0].text);
  instances += 1;
  const source = `${await bundled}\n// instance ${instances}\n`;
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

/** A German browser; `storage: null` blocks site data, so every storage access throws. */
function docsBrowser(t, { storage = new Map() } = {}) {
  const loads = [];
  const window = {
    navigator: { language: "de-DE", languages: ["de-DE", "de"] },
    location: {
      href: "https://docs.bitsocial.net/",
      replace: (url) => loads.push(url),
      assign: (url) => loads.push(url),
    },
  };
  Object.defineProperty(window, "localStorage", {
    get() {
      if (!storage) {
        throw new DOMException("The operation is insecure.", "SecurityError");
      }
      return {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, String(value)),
      };
    },
  });
  replaceGlobal(t, "window", window);
  replaceGlobal(t, "document", { documentElement: {} });
  replaceGlobal(t, "__docusaurus", null);
  return { loads, location: window.location, storage };
}

/** The URL the browser shows for `url`. */
function hrefOf(url) {
  return new URL(url, "https://docs.bitsocial.net").href;
}

/** The route Docusaurus's router (history 4) reports: it runs `decodeURI` on the pathname. */
function routeOf(url) {
  const { pathname, search, hash } = new URL(url, "https://docs.bitsocial.net");
  return { pathname: decodeURI(pathname), search, hash };
}

/**
 * Loads `url` in the build of `locale`, as the host serves it, and returns the page with the
 * URL it asked the browser to load next, if any.
 */
async function openPage(browser, locale, url) {
  const client = await loadDocsClient();
  const loadsBefore = browser.loads.length;
  const context = {
    i18n: { currentLocale: locale, defaultLocale: "en" },
    siteConfig: { customFields: { docsPreviewMode: "multilocale" } },
  };
  browser.location.href = hrefOf(url);
  globalThis.__docusaurus = { context, location: routeOf(url) };
  const runner = createHookRunner(() => client.Root({ children: null }));
  runner.render();
  return {
    client,
    redirect: browser.loads[loadsBefore] ?? null,
    /** An in-app link: same page load, new route. */
    navigate(nextUrl) {
      const loadsBeforeNavigation = browser.loads.length;
      browser.location.href = hrefOf(nextUrl);
      globalThis.__docusaurus = { context, location: routeOf(nextUrl) };
      runner.render();
      return browser.loads[loadsBeforeNavigation] ?? null;
    },
  };
}

/** The build a URL is served from: its locale prefix, or the default locale. */
function buildFor(url) {
  const segment = routeOf(url).pathname.split("/")[1];
  return segment && segment.length <= 3 && segment !== "404" ? segment : "en";
}

/** Opens `url` and follows every redirect the docs client makes, returning the page it ends on. */
async function visit(browser, url) {
  for (let hops = 0; hops < 6; hops += 1) {
    const page = await openPage(browser, buildFor(url), url);
    if (!page.redirect) {
      return { ...page, url };
    }
    url = page.redirect;
  }
  throw new Error(`The docs client kept redirecting, last to ${url}`);
}

test("docs follow the browser language on a first visit", async (t) => {
  const browser = docsBrowser(t);
  assert.equal((await visit(browser, "/")).url, "/de/");
});

test("an explicit English choice holds when the browser blocks site data", async (t) => {
  const browser = docsBrowser(t, { storage: null });
  assert.equal((await visit(browser, "/")).url, "/de/");

  const english = await visit(browser, "/?lang=en");
  assert.equal(buildFor(english.url), "en", `ended on ${english.url}`);
  assert.equal(english.navigate("/docs/intro/"), null, "in-app links stay in English");
});

test("the language picker carries the choice in the URL when storage is blocked", async (t) => {
  const browser = docsBrowser(t, { storage: null });
  const { docsLanguage } = await visit(browser, "/de/").then((page) => page.client);
  const href = docsLanguage.persistDocsLanguageChoice("en", "/docs/intro/?q=1#top");
  assert.equal(href, "/docs/intro/?q=1&lang=en#top");

  const english = await visit(browser, href);
  assert.equal(buildFor(english.url), "en", `ended on ${english.url}`);
});

test("a ?lang= link to an encoded path settles when storage is blocked", async (t) => {
  const browser = docsBrowser(t, { storage: null });
  for (const url of ["/caf%C3%A9/?lang=en", "/some%20page/?lang=en"]) {
    const page = await visit(browser, url);
    assert.equal(buildFor(page.url), "en", `ended on ${page.url}`);
  }
});

test("with storage the choice is stored and the URL stays clean", async (t) => {
  const browser = docsBrowser(t);
  const { docsLanguage } = await visit(browser, "/de/").then((page) => page.client);
  assert.equal(docsLanguage.persistDocsLanguageChoice("en", "/docs/intro/"), "/docs/intro/");
  assert.equal(browser.storage.get("i18nextLng"), "en");

  assert.equal((await visit(browser, "/?lang=fr")).url, "/fr/");
  assert.equal(browser.storage.get("i18nextLng"), "fr");
  assert.equal((await visit(browser, "/")).url, "/fr/");
});

test("a default-locale 404 under a localized URL keeps the stored language", async (t) => {
  const browser = docsBrowser(t, { storage: new Map([["i18nextLng", "de"]]) });
  // Hosts that answer every miss with the root 404.html run the English build at a German URL.
  const page = await openPage(browser, "en", "/de/missing-page/");
  assert.equal(page.redirect, null);
  assert.equal(browser.storage.get("i18nextLng"), "de");

  browser.storage.set("i18nextLng", "fr");
  await openPage(browser, "de", "/de");
  assert.equal(browser.storage.get("i18nextLng"), "de", "a page of a locale still stores it");
});

const settle = async () => {
  for (let round = 0; round < 5; round += 1) {
    await new Promise((resolve) => setImmediate(resolve));
  }
};

/** A docs page with just enough DOM for the Pagefind loader, and a server that has the bundle. */
function searchPage(t) {
  const nodes = [];
  const createElement = (tagName) => ({
    tagName,
    listeners: {},
    addEventListener(type, listener) {
      (this.listeners[type] ??= new Set()).add(listener);
    },
    removeEventListener(type, listener) {
      this.listeners[type]?.delete(listener);
    },
    remove() {
      nodes.splice(nodes.indexOf(this), 1);
    },
    fire(type) {
      this[`on${type}`]?.();
      for (const listener of this.listeners[type] ?? []) {
        listener();
      }
    },
  });
  const append = (node) => nodes.push(node);
  replaceGlobal(t, "document", {
    createElement,
    head: { appendChild: append },
    body: { appendChild: append },
    querySelector(selector) {
      const [, tagName, attribute, value] = /^(\w+)\[(\w+)="(.*)"\]$/.exec(selector);
      return nodes.find((node) => node.tagName === tagName && node[attribute] === value) ?? null;
    },
  });
  const window = {};
  replaceGlobal(t, "window", window);
  const probes = [];
  replaceGlobal(t, "fetch", async (url) => {
    probes.push(url);
    return { ok: true, headers: new Headers({ "content-type": "text/javascript" }) };
  });
  const mounted = [];
  return {
    probes,
    mounted,
    scripts: () => nodes.filter((node) => node.tagName === "script"),
    /** Runs pagefind-ui.js: it defines the UI class, then the tag fires load. */
    loadScript(script) {
      window.PagefindUI = class {
        constructor(options) {
          mounted.push(options.element);
        }
      };
      script.fire("load");
    },
  };
}

/** One search box: the navbar's or the search page's, each with its own container. */
function mountSearchBox(client) {
  const options = {
    bundlePath: "/pagefind/",
    scriptUrl: "/pagefind/pagefind-ui.js",
    styleUrl: "/pagefind/pagefind-ui.css",
    containerRef: { current: { replaceChildren() {} } },
    uiOptions: {},
  };
  const runner = createHookRunner(() => client.usePagefindUi(options));
  runner.render();
  return runner;
}

test("a search box mounted after a failed Pagefind load tries again", async (t) => {
  const page = searchPage(t);
  const client = await loadDocsClient();
  const navbar = mountSearchBox(client);
  await settle();
  const [failedScript] = page.scripts();
  failedScript.fire("error");
  await settle();
  assert.equal(navbar.render().status, "error");

  // In-app navigation to /search/ mounts the full-page search box.
  const searchBox = mountSearchBox(client);
  await settle();
  const retry = page.scripts().at(-1);
  assert.notEqual(retry, failedScript, "the failed script tag is not waited on again");
  assert.equal(page.scripts().length, 1);
  page.loadScript(retry);
  await settle();
  assert.equal(searchBox.render().status, "ready");
});

test("search boxes mounted together load pagefind-ui.js once", async (t) => {
  const page = searchPage(t);
  const client = await loadDocsClient();
  const navbar = mountSearchBox(client);
  const homeSearch = mountSearchBox(client);
  await settle();
  assert.equal(page.probes.length, 1);
  assert.equal(page.scripts().length, 1);

  page.loadScript(page.scripts()[0]);
  await settle();
  assert.equal(navbar.render().status, "ready");
  assert.equal(homeSearch.render().status, "ready");
  assert.equal(page.mounted.length, 2);
});
