import { expect, test, type Page } from "@playwright/test";

type HydrationTestWindow = Window & {
  __BITSOCIAL_BOOTSTRAP__?: { locale: string };
  __serverAppNode?: Element | null;
};

const FIREFOX_USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0";

// Remember the server-rendered app node before any module script runs, so the test can tell a
// hydrated page (same node) from a client render that replaced the server markup.
async function rememberServerAppNode(page: Page) {
  await page.addInitScript(() => {
    document.addEventListener("readystatechange", () => {
      if (document.readyState !== "interactive") return;
      (window as HydrationTestWindow).__serverAppNode = document.querySelector("#root > div");
    });
  });
}

// React client-renders text and structure mismatches with a recoverable error, but keeps the
// server value of a mismatched attribute and only warns about it in dev ("didn't match").
// Production builds report hydration failures only as minified React errors 418-425.
function collectHydrationErrors(page: Page) {
  const messages: string[] = [];
  page.on("pageerror", (error) => messages.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") messages.push(message.text());
  });
  return () =>
    messages.filter((message) =>
      /hydrat|didn't match|Minified React error #4(18|19|2[0-5])\b/i.test(message),
    );
}

async function expectHydratedFromPayload(page: Page, locale: string) {
  await expect
    .poll(() =>
      page.evaluate(() => (window as HydrationTestWindow).__BITSOCIAL_BOOTSTRAP__?.locale),
    )
    .toBe(locale);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const appNode = document.querySelector("#root > div");
        return Boolean(appNode && Object.keys(appNode).some((key) => key.startsWith("__react")));
      }),
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () =>
        document.querySelector("#root > div") === (window as HydrationTestWindow).__serverAppNode,
    ),
    "React must hydrate the server markup instead of replacing it",
  ).toBe(true);
}

// The server cannot see the viewport, so components must render the same first frame at every
// width; a phone-width first render that differs from the server markup fails hydration.
for (const { name, viewport } of [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "phone", viewport: { width: 390, height: 844 } },
]) {
  test.describe(`SSR bootstrap (${name})`, () => {
    test.use({ viewport });

    for (const { path, locale } of [
      { path: "/privacy", locale: "en" },
      { path: "/privacy?lang=it", locale: "it" },
    ]) {
      test(`hydrates the server render of ${path} from the bootstrap payload`, async ({
        browserName,
        page,
      }) => {
        test.skip(browserName !== "chromium", "one project is enough for this hydration test");

        const hydrationErrors = collectHydrationErrors(page);
        const localeBundleRequests: string[] = [];
        page.on("request", (request) => {
          if (new URL(request.url()).pathname === `/translations/${locale}/default.json`) {
            localeBundleRequests.push(request.url());
          }
        });
        await rememberServerAppNode(page);

        await page.goto(path);

        await expectHydratedFromPayload(page, locale);
        expect(hydrationErrors()).toEqual([]);
        expect(localeBundleRequests, "the payload already carries this locale").toEqual([]);
        // Keys the locale has not translated render English, as in the server render.
        await expect(page.locator("body")).not.toContainText("nav.blog");
      });
    }
  });
}

// The server cannot see the browser either, so the projects directory renders its default
// surfaces. React keeps that server attribute when a Firefox first render asks for simplified
// surfaces, so Firefox must switch only after hydration.
test.describe("SSR bootstrap (Firefox user agent)", () => {
  test.use({ userAgent: FIREFOX_USER_AGENT });

  test("hydrates /projects and then simplifies its surfaces", async ({ browserName, page }) => {
    test.skip(browserName !== "chromium", "one project is enough for this hydration test");

    const hydrationErrors = collectHydrationErrors(page);
    await rememberServerAppNode(page);
    await page.addInitScript(() => {
      document.addEventListener("readystatechange", () => {
        if (document.readyState !== "interactive") return;
        document.documentElement.dataset.serverSurfaceMode =
          document.querySelector(".apps-page")?.getAttribute("data-surface-mode") ?? "";
      });
    });

    await page.goto("/projects");

    expect(await page.evaluate(() => navigator.userAgent)).toBe(FIREFOX_USER_AGENT);
    await expect(page.locator("html"), "the server renders the default surfaces").toHaveAttribute(
      "data-server-surface-mode",
      "default",
    );
    await expectHydratedFromPayload(page, "en");
    await expect(page.locator(".apps-page")).toHaveAttribute("data-surface-mode", "simplified");
    expect(hydrationErrors()).toEqual([]);
  });
});

// The server cannot see prefers-reduced-motion either, so it renders the full-motion reveal
// styles. React does not patch attribute mismatches while hydrating, so a reduced-motion first
// render that drops those styles would leave the server's opacity:0 and undrawn paths in place.
test.describe("SSR bootstrap (reduced motion)", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("hydrates the home page without leaving reveal styles hidden", async ({
    browserName,
    page,
  }) => {
    test.skip(browserName !== "chromium", "one project is enough for this hydration test");

    const hydrationErrors = collectHydrationErrors(page);
    await rememberServerAppNode(page);

    await page.goto("/");

    expect(
      await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    ).toBe(true);
    await expectHydratedFromPayload(page, "en");

    // Scroll through the page so every whileInView reveal gets its chance to run.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    });

    const findHiddenContent = () =>
      page.evaluate(() => {
        const hidden: string[] = [];
        for (const element of document.querySelectorAll("#root *")) {
          if (!element.getClientRects().length) continue;
          if (element instanceof SVGPathElement) {
            // Reduced-motion paths are static; a pathLength reveal left over from hydration keeps
            // a zero-length dash.
            if (element.hasAttribute("pathLength")) {
              hidden.push(`path d="${element.getAttribute("d")?.slice(0, 40)}"`);
            }
            continue;
          }
          const text = element.textContent?.trim() ?? "";
          if (text && getComputedStyle(element).opacity === "0") {
            hidden.push(`${element.tagName.toLowerCase()} "${text.slice(0, 40)}"`);
          }
        }
        return hidden;
      });
    await expect
      .poll(findHiddenContent, {
        message: "reduced motion must not leave the server's reveal styles in place",
      })
      .toEqual([]);
    await expect(page.locator("#problem-title")).toHaveCSS("opacity", "1");
    expect(hydrationErrors()).toEqual([]);
  });
});
