import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const wallet = "0xe2Eea174e91611Ee38705365C2Fa11f9C31029b1";

// Stands in for @vercel/analytics and forwards every call to the current test's mocks.
const sdkStub = {
  name: "vercel-analytics-stub",
  setup(builder) {
    builder.onResolve({ filter: /^@vercel\/analytics$/ }, () => ({
      path: "vercel-analytics",
      namespace: "sdk-stub",
    }));
    builder.onLoad({ filter: /.*/, namespace: "sdk-stub" }, () => ({
      contents: `
        export const inject = (...args) => globalThis.__analyticsSdk.inject(...args);
        export const pageview = (...args) => globalThis.__analyticsSdk.pageview(...args);
        export const track = (...args) => globalThis.__analyticsSdk.track(...args);
      `,
      loader: "js",
    }));
  },
};

const bundles = new Map();
let instances = 0;

/**
 * Bundles an app's analytics module with `import.meta.env.PROD` fixed as a production or
 * development build would have it. The lazy `import("./client")` lands in the same bundle, so the
 * lazy wrapper and the client share one module instance, as they do in the browser.
 */
async function bundle(app, production) {
  const key = `${app}:${production}`;
  if (!bundles.has(key)) {
    const exports = [
      'export * as lazy from "./index.ts";',
      'export * as client from "./client.ts";',
      app === "about" ? 'export { APPS } from "@/lib/apps-data";' : "",
    ].join("\n");
    const { outputFiles } = await build({
      stdin: {
        contents: exports,
        loader: "ts",
        resolveDir: path.join(repoRoot, app, "src/lib/analytics"),
      },
      alias: { "@": path.join(repoRoot, app, "src") },
      bundle: true,
      define: { "import.meta.env.PROD": String(production) },
      format: "esm",
      platform: "neutral",
      plugins: [sdkStub],
      write: false,
    });
    bundles.set(key, outputFiles[0].text);
  }
  return bundles.get(key);
}

/** A fresh module instance per call, so `initialized` and the lazy client start over. */
async function load(app, { production = true } = {}) {
  instances += 1;
  const source = `${await bundle(app, production)}\n// instance ${instances}\n`;
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

/** Puts the test in a browser at `url` (or on a server when `url` is null) with fresh SDK mocks. */
function browserAt(t, url, { webdriver = false } = {}) {
  const sdk = { inject: t.mock.fn(), pageview: t.mock.fn(), track: t.mock.fn() };
  replaceGlobal(t, "__analyticsSdk", sdk);
  replaceGlobal(t, "window", url === null ? undefined : { location: new URL(url) });
  replaceGlobal(t, "navigator", { webdriver });
  return sdk;
}

const settle = () => new Promise((resolve) => setImmediate(resolve));
const calls = (mockFn) => mockFn.mock.calls.map((call) => call.arguments);

test("about maps every route in app.tsx to a fixed path and route template", async (t) => {
  browserAt(t, "https://bitsocial.net/");
  const { client, APPS } = await load("about");
  const cases = [
    ["/", "/", "/"],
    ["/projects", "/projects", "/projects"],
    ["/projects/", "/projects", "/projects"],
    ["/projects/5chan", "/projects/5chan", "/projects/[slug]"],
    ["/projects/seedit/", "/projects/seedit", "/projects/[slug]"],
    ["/projects/%35chan", "/projects/5chan", "/projects/[slug]"],
    ["/privacy", "/privacy", "/privacy"],
    ["/about", "/about", "/about"],
    ["/blog", "/blog", "/blog"],
    ["/blog?draft=1#top", "/blog", "/blog"],
    ["/projects/not-a-project", "/not-found", "/not-found"],
    ["/projects/5chan/extra", "/not-found", "/not-found"],
    ["/projects/%E0%A4%A", "/not-found", "/not-found"],
    [`/projects/${wallet}`, "/not-found", "/not-found"],
    ["/PROJECTS", "/not-found", "/not-found"],
    ["/apps", "/not-found", "/not-found"],
    ["/wp-login.php", "/not-found", "/not-found"],
    [`/${wallet}`, "/not-found", "/not-found"],
  ];
  for (const [pathname, sentPath, route] of cases) {
    assert.deepEqual(client.getAnalyticsPage(pathname), { path: sentPath, route }, pathname);
    assert.deepEqual(client.getAnalyticsPage(sentPath), { path: sentPath, route }, sentPath);
  }
  for (const app of APPS) {
    assert.deepEqual(client.getAnalyticsPage(`/projects/${app.slug}`), {
      path: `/projects/${app.slug}`,
      route: "/projects/[slug]",
    });
  }
});

test("chain maps its three pages and nothing else", async (t) => {
  browserAt(t, "https://chain.bitsocial.net/");
  const { client } = await load("chain");
  const cases = [
    ["/", "/"],
    ["/index.html", "/"],
    ["/chart", "/chart"],
    ["/chart/", "/chart"],
    ["/chart/index.html", "/chart"],
    ["/rich-list", "/rich-list"],
    ["/rich-list/", "/rich-list"],
    ["/rich-list/index.html", "/rich-list"],
    [`/rich-list/?address=${wallet}#holders`, "/rich-list"],
    [`/rich-list/${wallet}`, "/not-found"],
    [`/chart/${wallet}`, "/not-found"],
    ["/projects", "/not-found"],
  ];
  for (const [pathname, sentPath] of cases) {
    assert.equal(client.getAnalyticsPath(pathname), sentPath, pathname);
    assert.equal(client.getAnalyticsPath(sentPath), sentPath, sentPath);
  }
});

test("sent URLs drop the fragment and every query parameter but non-identifying utm_ tags", async (t) => {
  browserAt(t, "https://bitsocial.net/");
  const about = await load("about");
  const chain = await load("chain");
  const query = `utm_source=newsletter&ref=x&lang=it&utm_campaign=launch&address=${wallet}`;
  assert.equal(
    about.client.getAnalyticsUrl(`https://bitsocial.net/projects/5chan/?${query}#mirrors`),
    "https://bitsocial.net/projects/5chan?utm_source=newsletter&utm_campaign=launch",
  );
  assert.equal(
    about.client.getAnalyticsUrl("https://bitsocial.net/secret/page?utm_medium=social#x"),
    "https://bitsocial.net/not-found?utm_medium=social",
  );
  assert.equal(
    about.client.getAnalyticsUrl(
      `https://bitsocial.net/?utm_source=someone%40example.com&utm_content=${wallet}&utm_term=bso`,
    ),
    "https://bitsocial.net/?utm_term=bso",
  );
  assert.equal(
    chain.client.getAnalyticsUrl(
      `https://chain.bitsocial.net/rich-list/?wallet=${wallet}&utm_source=x#history`,
    ),
    "https://chain.bitsocial.net/rich-list?utm_source=x",
  );
  assert.equal(
    chain.client.getAnalyticsUrl("https://chain.bitsocial.net/chart/?theme=dark&lang=de"),
    "https://chain.bitsocial.net/chart",
  );
  assert.equal(
    chain.client.getAnalyticsUrl(
      `https://chain.bitsocial.net/?utm_source=${wallet}&utm_medium=a%40b.co&utm_campaign=bso`,
    ),
    "https://chain.bitsocial.net/?utm_campaign=bso",
  );
  // An identifier can sit in the parameter name, so only the standard campaign tag names are kept.
  const identifyingKeys = `utm_alice%40example.com=campaign&utm_${wallet}=x&utm_id=1&utm_source=x`;
  assert.equal(
    about.client.getAnalyticsUrl(`https://bitsocial.net/?${identifyingKeys}`),
    "https://bitsocial.net/?utm_source=x",
  );
  assert.equal(
    chain.client.getAnalyticsUrl(`https://chain.bitsocial.net/?${identifyingKeys}`),
    "https://chain.bitsocial.net/?utm_source=x",
  );
});

test("beforeSend sanitizes page views and custom events and keeps their payload", async (t) => {
  browserAt(t, "https://bitsocial.net/projects/5chan?ref=private&utm_source=x#mirrors");
  const { client } = await load("about");
  assert.deepEqual(
    client.sanitizeAnalyticsEvent({
      type: "pageview",
      url: "https://bitsocial.net/projects/5chan?ref=private&utm_source=x#mirrors",
    }),
    { type: "pageview", url: "https://bitsocial.net/projects/5chan?utm_source=x" },
  );
  assert.deepEqual(
    client.sanitizeAnalyticsEvent({
      type: "event",
      url: "https://bitsocial.net/projects/unknown?ref=private",
      payload: { name: "app_open", data: { app: "5chan", platform: "web" } },
    }),
    {
      type: "event",
      url: "https://bitsocial.net/not-found",
      payload: { name: "app_open", data: { app: "5chan", platform: "web" } },
    },
  );
  assert.equal(client.sanitizeAnalyticsEvent({ type: "pageview", url: "not a url" }), null);
});

// The SDK clears the query when the sent path differs from location.pathname, so utm_ tags on a
// trailing-slash URL would be lost without reading them from the live location.
test("utm_ tags survive the SDK's query reset when the live location is the same page", async (t) => {
  await t.test("about /projects/", async (t) => {
    browserAt(t, "https://bitsocial.net/projects/?utm_source=x&ref=private#top");
    const { client } = await load("about");
    assert.deepEqual(
      client.sanitizeAnalyticsEvent({ type: "pageview", url: "https://bitsocial.net/projects" }),
      { type: "pageview", url: "https://bitsocial.net/projects?utm_source=x" },
    );
  });
  await t.test("chain /rich-list/", async (t) => {
    browserAt(t, `https://chain.bitsocial.net/rich-list/?address=${wallet}&utm_source=x#history`);
    const { client } = await load("chain");
    assert.deepEqual(
      client.sanitizeAnalyticsEvent({
        type: "pageview",
        url: "https://chain.bitsocial.net/rich-list",
      }),
      { type: "pageview", url: "https://chain.bitsocial.net/rich-list?utm_source=x" },
    );
  });
  await t.test("a different live page lends nothing", async (t) => {
    browserAt(t, "https://bitsocial.net/privacy?utm_source=live");
    const { client } = await load("about");
    assert.deepEqual(
      client.sanitizeAnalyticsEvent({
        type: "pageview",
        url: "https://bitsocial.net/projects/5chan?utm_source=queued",
      }),
      { type: "pageview", url: "https://bitsocial.net/projects/5chan?utm_source=queued" },
    );
  });
});

for (const app of ["about", "chain"]) {
  const origin = app === "about" ? "https://bitsocial.net" : "https://chain.bitsocial.net";

  test(`${app}: beforeSend drops everything from a browser driven by automation`, async (t) => {
    browserAt(t, `${origin}/`, { webdriver: true });
    const { client } = await load(app);
    assert.equal(client.sanitizeAnalyticsEvent({ type: "pageview", url: `${origin}/` }), null);
    assert.equal(client.sanitizeAnalyticsEvent({ type: "event", url: `${origin}/` }), null);
  });

  test(`${app}: beforeSend lets an ordinary browser through`, async (t) => {
    browserAt(t, `${origin}/`, { webdriver: false });
    const { client } = await load(app);
    assert.deepEqual(client.sanitizeAnalyticsEvent({ type: "pageview", url: `${origin}/` }), {
      type: "pageview",
      url: `${origin}/`,
    });
  });
}

const excludedEnvironments = {
  about: [
    ["http://localhost:5173/", true],
    ["http://127.0.0.1:3107/", true],
    ["https://bitsocial.localhost/", true],
    ["https://bitsocial-web-git-feature-bitsocial.vercel.app/", true],
    ["https://chain.bitsocial.net/", true],
    ["http://bitsocial.net/", true],
    ["https://bitsocial.net/", false],
    [null, true],
  ],
  chain: [
    ["http://localhost:5173/", true],
    ["https://chain.bitsocial.localhost/", true],
    ["https://bitsocial-chain.vercel.app/", true],
    ["https://bitsocial.net/", true],
    ["https://www.chain.bitsocial.net/", true],
    ["http://chain.bitsocial.net/", true],
    ["https://chain.bitsocial.net/", false],
    [null, true],
  ],
};

for (const [app, environments] of Object.entries(excludedEnvironments)) {
  for (const [url, production] of environments) {
    const label = url === null ? "server rendering" : `${url} (production build: ${production})`;

    test(`${app}: sends nothing from ${label}`, async (t) => {
      const sdk = browserAt(t, url);
      const { lazy, client } = await load(app, { production });
      lazy.trackPageView("/");
      lazy.trackNewsletterSignup("success");
      if (app === "about") {
        lazy.trackAppLinkClick("5chan", { kind: "launch", platform: "web" });
      }
      await settle();
      assert.equal(sdk.inject.mock.callCount(), 0);
      assert.equal(sdk.pageview.mock.callCount(), 0);
      assert.equal(sdk.track.mock.callCount(), 0);
      if (url !== null) {
        assert.equal(client.sanitizeAnalyticsEvent({ type: "pageview", url }), null);
      }
    });
  }
}

test("about: production hosts initialize once and send page views with route templates", async (t) => {
  for (const host of ["https://bitsocial.net", "https://www.bitsocial.net"]) {
    await t.test(host, async (t) => {
      const sdk = browserAt(t, `${host}/projects/5chan`);
      const { lazy, client } = await load("about");
      lazy.trackPageView("/projects/5chan");
      lazy.trackPageView("/projects/not-a-project");
      lazy.trackPageView("/privacy");
      await settle();
      assert.deepEqual(calls(sdk.inject), [
        [{ disableAutoTrack: true, beforeSend: client.sanitizeAnalyticsEvent, mode: "production" }],
      ]);
      assert.deepEqual(calls(sdk.pageview), [
        [{ path: "/projects/5chan", route: "/projects/[slug]" }],
        [{ path: "/not-found", route: "/not-found" }],
        [{ path: "/privacy", route: "/privacy" }],
      ]);
    });
  }
});

test("chain: one page view per page with the page as its route", async (t) => {
  const sdk = browserAt(t, "https://chain.bitsocial.net/rich-list/");
  const { lazy, client } = await load("chain");
  lazy.trackPageView("/rich-list/");
  await settle();
  assert.deepEqual(calls(sdk.inject), [
    [{ disableAutoTrack: true, beforeSend: client.sanitizeAnalyticsEvent, mode: "production" }],
  ]);
  assert.deepEqual(calls(sdk.pageview), [[{ path: "/rich-list", route: "/rich-list" }]]);
});

test("about: project link events carry only the project slug and platform", async (t) => {
  const sdk = browserAt(t, "https://bitsocial.net/projects/5chan");
  const { lazy } = await load("about");
  lazy.trackAppLinkClick("5chan", { kind: "launch", platform: "web", url: "https://5chan.app" });
  lazy.trackAppLinkClick("5chan", { kind: "mirror", platform: "web" });
  lazy.trackAppLinkClick("5chan", { kind: "download", platform: "android" });
  lazy.trackAppLinkClick("seedit", { kind: "download", platform: "desktop", variant: "linux" });
  lazy.trackAppLinkClick("r9k-challenge", { kind: "package" });
  lazy.trackAppLinkClick("not-a-project", { kind: "launch", platform: "web" });
  await settle();
  assert.deepEqual(calls(sdk.track), [
    ["app_open", { app: "5chan", platform: "web" }],
    ["app_open", { app: "5chan", platform: "web" }],
    ["app_download", { app: "5chan", platform: "android" }],
    ["app_download", { app: "seedit", platform: "desktop" }],
    ["app_download", { app: "r9k-challenge", platform: "package" }],
    ["app_open", { app: "other", platform: "web" }],
  ]);
});

for (const app of ["about", "chain"]) {
  const origin = app === "about" ? "https://bitsocial.net" : "https://chain.bitsocial.net";

  test(`${app}: newsletter events carry only the outcome`, async (t) => {
    const sdk = browserAt(t, `${origin}/`);
    const { lazy } = await load(app);
    lazy.trackNewsletterSignup("success");
    lazy.trackNewsletterSignup("failure");
    await settle();
    assert.deepEqual(calls(sdk.track), [
      ["newsletter_signup", { outcome: "success" }],
      ["newsletter_signup", { outcome: "failure" }],
    ]);
  });

  test(`${app}: a failing SDK never throws or rejects into the page`, async (t) => {
    const sdk = browserAt(t, `${origin}/`);
    sdk.inject.mock.mockImplementation(() => {
      throw new Error("blocked");
    });
    const first = await load(app);
    assert.doesNotThrow(() => first.lazy.trackPageView("/"));
    assert.doesNotThrow(() => first.lazy.trackNewsletterSignup("failure"));
    await settle();
    assert.equal(sdk.pageview.mock.callCount(), 0);
    assert.equal(sdk.track.mock.callCount(), 0);

    sdk.inject.mock.mockImplementation(() => {});
    sdk.pageview.mock.mockImplementation(() => {
      throw new Error("blocked");
    });
    sdk.track.mock.mockImplementation(() => {
      throw new Error("blocked");
    });
    const second = await load(app);
    assert.doesNotThrow(() => second.lazy.trackPageView("/"));
    assert.doesNotThrow(() => second.lazy.trackNewsletterSignup("success"));
    await settle();
    assert.equal(sdk.pageview.mock.callCount(), 1);
    assert.equal(sdk.track.mock.callCount(), 1);
  });
}
