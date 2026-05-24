import { expect, test, type Page } from "@playwright/test";

type TestWindow = Window & {
  __PROFILING__?: boolean;
  __REACT_GRAB_DISABLED__?: boolean;
};

const DELAYED_PLANET_MODULE_MS = 2_800;
const APPS_CARD_SELECTOR = ".apps-js-results .glass-card";
const PLANET_CANVAS_SELECTOR =
  "div.relative.pointer-events-none.w-full.overflow-hidden.overscroll-none canvas";

function getAppsUrl(baseURL: string | undefined) {
  if (!baseURL) {
    throw new Error("Playwright baseURL is required for apps graphics tests.");
  }

  return new URL("/apps", baseURL).toString();
}

function getHomeUrl(baseURL: string | undefined) {
  if (!baseURL) {
    throw new Error("Playwright baseURL is required for hero graphics tests.");
  }

  return new URL("/", baseURL).toString();
}

async function prepareGraphicsTestWindow(page: Page) {
  await page.addInitScript(() => {
    const testWindow = window as TestWindow;
    testWindow.__PROFILING__ = true;
    testWindow.__REACT_GRAB_DISABLED__ = true;
  });
}

async function delayPlanetGraphicModule(page: Page) {
  let delayedModuleRequest = false;

  await page.route(/\/src\/components\/planet-graphic\/index\.tsx(?:\?|$)/, async (route) => {
    delayedModuleRequest = true;
    await new Promise((resolve) => setTimeout(resolve, DELAYED_PLANET_MODULE_MS));
    await route.continue();
  });

  return () => delayedModuleRequest;
}

test("apps cards do not use fallback surfaces while graphics mode is pending", async ({
  baseURL,
  page,
}) => {
  await prepareGraphicsTestWindow(page);
  await page.route(/\/src\/entry-client\.tsx(?:\?|$)/, (route) => route.abort());
  await page.goto(getAppsUrl(baseURL), { waitUntil: "domcontentloaded" });
  await page.waitForSelector(APPS_CARD_SELECTOR);

  await expect(page.locator(".apps-page")).toHaveAttribute("data-surface-mode", "default");
  await expect
    .poll(() =>
      page
        .locator(APPS_CARD_SELECTOR)
        .first()
        .evaluate((element) => {
          return getComputedStyle(element).background;
        }),
    )
    .toContain("linear-gradient");
});

test("slow first-load hero graphics chunks do not force the static fallback on capable desktops", async ({
  baseURL,
  page,
}) => {
  await prepareGraphicsTestWindow(page);
  const didDelayPlanetGraphicModule = await delayPlanetGraphicModule(page);
  await page.goto(getHomeUrl(baseURL), { waitUntil: "domcontentloaded" });

  await expect.poll(didDelayPlanetGraphicModule, { timeout: 5_000 }).toBe(true);
  await page.waitForFunction(
    (selector) => {
      const canvas = document.querySelector(selector);
      const rect = canvas?.getBoundingClientRect();

      return rect && rect.width > 100 && rect.height > 100;
    },
    PLANET_CANVAS_SELECTOR,
    { timeout: 15_000 },
  );
  await expect(page.locator('img[src*="/hero-fallback"]')).toHaveCount(0);
});
