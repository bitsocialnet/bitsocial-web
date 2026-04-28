import { expect, test, type Browser, type Page, type TestInfo } from "@playwright/test";

const HERO_URL = "/";
const VIEWPORT = { height: 900, width: 1440 };
const PLANET_SETTLE_MS = 1_200;
const THEME_SETTLE_MS = PLANET_SETTLE_MS;

type RingComparison = {
  darkerPixelShare: number;
  delta: number;
  freshAverageLuminance: number;
  maskCount: number;
  ratio: number;
  toggledAverageLuminance: number;
};

type RingPose = {
  ring1: [number, number, number, number];
  ring1Base: [number, number, number, number];
  ring2: [number, number, number, number];
  ring2Base: [number, number, number, number];
};

type TestWindow = Window & {
  __PLANET_GRAPHIC_DEBUG__?: boolean;
  __PLANET_GRAPHIC_STATE__?: {
    getPose: () => RingPose;
  };
  __PROFILING__?: boolean;
  __REACT_GRAB_DISABLED__?: boolean;
  __VISUAL_TESTING__?: boolean;
};

function getHomeUrl(baseURL: string | undefined) {
  if (!baseURL) {
    throw new Error("Playwright baseURL is required for planet theme tests.");
  }

  return new URL(HERO_URL, baseURL).toString();
}

async function prepareTestWindow(
  page: Page,
  options: { debugPlanet?: boolean; visualTesting?: boolean } = {},
) {
  await page.addInitScript(() => {
    const testWindow = window as TestWindow;
    testWindow.__PROFILING__ = true;
    testWindow.__REACT_GRAB_DISABLED__ = true;
  });

  if (options.visualTesting) {
    await page.addInitScript(() => {
      (window as TestWindow).__VISUAL_TESTING__ = true;
    });
  }

  if (options.debugPlanet) {
    await page.addInitScript(() => {
      (window as TestWindow).__PLANET_GRAPHIC_DEBUG__ = true;
    });
  }
}

async function openWithSystemDark(page: Page, baseURL: string | undefined) {
  await prepareTestWindow(page, { visualTesting: true });
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto(getHomeUrl(baseURL), { waitUntil: "networkidle" });
  await waitForPlanetGraphic(page);
}

async function openFreshLightPage(browser: Browser, baseURL: string | undefined) {
  const context = await browser.newContext({
    colorScheme: "dark",
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
    viewport: VIEWPORT,
  });
  const page = await context.newPage();

  await prepareTestWindow(page, { visualTesting: true });
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
  });
  await page.goto(getHomeUrl(baseURL), { waitUntil: "networkidle" });
  await waitForPlanetGraphic(page);

  return { context, page };
}

async function waitForPlanetGraphic(page: Page) {
  await page.waitForFunction(() => {
    const canvas = document.querySelector(
      "div.relative.pointer-events-none.w-full.overflow-hidden.overscroll-none canvas",
    );
    const rect = canvas?.getBoundingClientRect();

    return (
      document.querySelectorAll("canvas").length >= 3 &&
      rect &&
      rect.width > 100 &&
      rect.height > 100
    );
  });
  await page.waitForTimeout(PLANET_SETTLE_MS);
}

async function captureViewport(page: Page) {
  return page.screenshot({
    animations: "allow",
    scale: "css",
    type: "png",
  });
}

async function compareRingBrightness(
  page: Page,
  toggledScreenshot: Buffer,
  freshLightScreenshot: Buffer,
): Promise<RingComparison> {
  return page.evaluate(
    async ({ freshLightPng, toggledPng }) => {
      const decodeScreenshot = async (pngBase64: string) => {
        const image = new Image();
        image.src = `data:image/png;base64,${pngBase64}`;
        await image.decode();

        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) {
          throw new Error("Could not create screenshot analysis canvas.");
        }

        context.drawImage(image, 0, 0);

        return {
          data: context.getImageData(0, 0, canvas.width, canvas.height).data,
          height: canvas.height,
          width: canvas.width,
        };
      };

      const luminance = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const fresh = await decodeScreenshot(freshLightPng);
      const toggled = await decodeScreenshot(toggledPng);

      if (fresh.width !== toggled.width || fresh.height !== toggled.height) {
        throw new Error("Screenshots must have matching dimensions.");
      }

      let darkerPixels = 0;
      let freshLuminance = 0;
      let maskCount = 0;
      let toggledLuminance = 0;

      for (let y = Math.floor(fresh.height * 0.42); y < fresh.height; y += 2) {
        for (let x = Math.floor(fresh.width * 0.16); x < Math.floor(fresh.width * 0.84); x += 2) {
          const index = (y * fresh.width + x) * 4;
          const freshR = fresh.data[index] ?? 0;
          const freshG = fresh.data[index + 1] ?? 0;
          const freshB = fresh.data[index + 2] ?? 0;
          const freshMax = Math.max(freshR, freshG, freshB);
          const freshMin = Math.min(freshR, freshG, freshB);
          const freshLum = luminance(freshR, freshG, freshB);

          // The rings are neutral/silver. Use the fresh light screenshot as the mask so the
          // test checks the same rendered ring pixels after a dark-to-light theme switch.
          if (freshMax - freshMin > 42 || freshLum <= 70 || freshLum >= 246) {
            continue;
          }

          const toggledLum = luminance(
            toggled.data[index] ?? 0,
            toggled.data[index + 1] ?? 0,
            toggled.data[index + 2] ?? 0,
          );

          if (freshLum - toggledLum > 25) {
            darkerPixels += 1;
          }

          freshLuminance += freshLum;
          toggledLuminance += toggledLum;
          maskCount += 1;
        }
      }

      const freshAverageLuminance = freshLuminance / maskCount;
      const toggledAverageLuminance = toggledLuminance / maskCount;

      return {
        darkerPixelShare: darkerPixels / maskCount,
        delta: freshAverageLuminance - toggledAverageLuminance,
        freshAverageLuminance,
        maskCount,
        ratio: toggledAverageLuminance / freshAverageLuminance,
        toggledAverageLuminance,
      };
    },
    {
      freshLightPng: freshLightScreenshot.toString("base64"),
      toggledPng: toggledScreenshot.toString("base64"),
    },
  );
}

async function attachScreenshots(
  testInfo: TestInfo,
  toggledScreenshot: Buffer,
  freshLightScreenshot: Buffer,
) {
  await testInfo.attach("dark-to-light-toggle.png", {
    body: toggledScreenshot,
    contentType: "image/png",
  });
  await testInfo.attach("fresh-light-load.png", {
    body: freshLightScreenshot,
    contentType: "image/png",
  });
}

test.use({
  colorScheme: "dark",
  deviceScaleFactor: 1,
  viewport: VIEWPORT,
});

test("planet rings stay as bright after switching from system dark to light as on a fresh light load", async ({
  baseURL,
  browser,
  page,
}, testInfo) => {
  await openWithSystemDark(page, baseURL);
  await page.getByRole("button", { name: "Toggle theme" }).first().click();
  await expect(page.locator("html")).toHaveClass(/(?:^|\s)light(?:\s|$)/);
  await page.waitForTimeout(THEME_SETTLE_MS);
  const toggledScreenshot = await captureViewport(page);

  const { context, page: freshLightPage } = await openFreshLightPage(browser, baseURL);
  const freshLightScreenshot = await captureViewport(freshLightPage);

  await attachScreenshots(testInfo, toggledScreenshot, freshLightScreenshot);

  const comparison = await compareRingBrightness(page, toggledScreenshot, freshLightScreenshot);

  await context.close();

  expect(comparison.maskCount).toBeGreaterThan(5_000);
  expect(comparison.ratio).toBeGreaterThanOrEqual(0.94);
  expect(comparison.delta).toBeLessThanOrEqual(12);
  expect(comparison.darkerPixelShare).toBeLessThanOrEqual(0.35);
});

function quaternionAngle(
  first: [number, number, number, number],
  second: [number, number, number, number],
) {
  const dot = Math.abs(
    first[0] * second[0] + first[1] * second[1] + first[2] * second[2] + first[3] * second[3],
  );

  return 2 * Math.acos(Math.min(1, dot));
}

async function getRingPose(page: Page) {
  await page.waitForFunction(() => Boolean((window as TestWindow).__PLANET_GRAPHIC_STATE__));

  return page.evaluate(() => {
    const state = (window as TestWindow).__PLANET_GRAPHIC_STATE__;
    if (!state) {
      throw new Error("Planet graphic debug state was not installed.");
    }

    return state.getPose();
  });
}

test("switching theme updates ring color without resetting ring rotation", async ({
  baseURL,
  page,
}) => {
  await prepareTestWindow(page, { debugPlanet: true });
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto(getHomeUrl(baseURL), { waitUntil: "networkidle" });
  await waitForPlanetGraphic(page);

  await expect
    .poll(async () => {
      const pose = await getRingPose(page);
      return quaternionAngle(pose.ring1, pose.ring1Base);
    })
    .toBeGreaterThan(0.08);

  const beforeThemeSwitch = await getRingPose(page);
  await page.getByRole("button", { name: "Toggle theme" }).first().click();
  await expect(page.locator("html")).toHaveClass(/(?:^|\s)light(?:\s|$)/);
  await page.waitForTimeout(200);
  const afterThemeSwitch = await getRingPose(page);

  expect(quaternionAngle(afterThemeSwitch.ring1, afterThemeSwitch.ring1Base)).toBeGreaterThan(0.08);
  expect(quaternionAngle(afterThemeSwitch.ring2, afterThemeSwitch.ring2Base)).toBeGreaterThan(0.08);
  expect(quaternionAngle(afterThemeSwitch.ring1, beforeThemeSwitch.ring1)).toBeLessThan(0.75);
  expect(quaternionAngle(afterThemeSwitch.ring2, beforeThemeSwitch.ring2)).toBeLessThan(0.75);
});
