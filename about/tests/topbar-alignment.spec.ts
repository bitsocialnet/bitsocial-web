import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";

type TestWindow = Window & {
  __PROFILING__?: boolean;
  __REACT_GRAB_DISABLED__?: boolean;
  __topbarSettledTops?: Record<string, number>;
};

type ControlMetrics = {
  boxCenterDelta: number;
  height: number;
  childCenterDelta: number | null;
  isNavLink: boolean;
  label: string;
  textCenterDelta: number | null;
  textInlineCenterDelta: number | null;
  width: number;
};

type MenuRowMetrics = {
  bottom: number;
  height: number;
  isLink: boolean;
  label: string;
  textCenterDelta: number | null;
  top: number;
};

type TopbarMetrics = {
  barHeight: number;
  compact: boolean;
  controls: ControlMetrics[];
  frameHeight: number;
  menuRows: MenuRowMetrics[];
  pointerCoarse: boolean;
  rowHeight: number;
};

type Scenario = {
  expectCompact: boolean;
  hasTouch: boolean;
  name: string;
  viewport: { height: number; width: number };
};

type LocaleScenario = {
  expectedLabel: string;
  lang: string;
  name: string;
  scenario: Scenario;
};

const TOPBAR_FRAME_HEIGHT = 60;
const CONTROL_SIZE = 44;
const BOX_TOLERANCE = 0.5;
const CONTENT_TOLERANCE = 1;
const TOPBAR_SELECTOR = "nav.topbar-position";
const MENU_BUTTON_NAME = /^(open|close) menu$/i;
const VISIBLE_NAV_LINK_SELECTOR = `${TOPBAR_SELECTOR} div:not([aria-hidden="true"]) > .topbar-desktop-nav .topbar-links a`;

const SCENARIOS: Scenario[] = [
  {
    name: "desktop 1440x900 mouse",
    expectCompact: false,
    hasTouch: false,
    viewport: { height: 900, width: 1440 },
  },
  {
    name: "laptop 1280x720 mouse",
    expectCompact: false,
    hasTouch: false,
    viewport: { height: 720, width: 1280 },
  },
  {
    name: "narrow 720x900 mouse",
    expectCompact: true,
    hasTouch: false,
    viewport: { height: 900, width: 720 },
  },
  {
    name: "iPad Pro landscape touch",
    expectCompact: false,
    hasTouch: true,
    viewport: { height: 834, width: 1194 },
  },
  {
    name: "iPad landscape touch",
    expectCompact: false,
    hasTouch: true,
    viewport: { height: 768, width: 1024 },
  },
  {
    name: "iPad portrait touch",
    expectCompact: true,
    hasTouch: true,
    viewport: { height: 1024, width: 768 },
  },
  {
    name: "phone 390x844 touch",
    expectCompact: true,
    hasTouch: true,
    viewport: { height: 844, width: 390 },
  },
];

const LOCALE_SCENARIOS: LocaleScenario[] = [
  {
    name: "Korean single-character labels on an iPad",
    expectedLabel: "앱",
    lang: "ko",
    scenario: SCENARIOS[4],
  },
  {
    name: "Arabic right-to-left labels on a desktop",
    expectedLabel: "الوثائق",
    lang: "ar",
    scenario: SCENARIOS[0],
  },
];

function getPageUrl(baseURL: string | undefined, search = "") {
  if (!baseURL) {
    throw new Error("Playwright baseURL is required for topbar alignment tests.");
  }

  return new URL(`/${search}`, baseURL).toString();
}

function expectWithin(actual: number, expected: number, tolerance: number, message: string) {
  expect(
    Math.abs(actual - expected),
    `${message} (expected ${expected}, got ${actual})`,
  ).toBeLessThanOrEqual(tolerance);
}

async function waitForSettledLayout(page: Page, selector: string) {
  await page.waitForFunction(
    (targetSelector) => {
      const element = document.querySelector(targetSelector);
      if (!element) {
        return false;
      }

      const testWindow = window as TestWindow;
      const settledTops = (testWindow.__topbarSettledTops ??= {});
      const top = element.getBoundingClientRect().top;
      const settled = settledTops[targetSelector] === top;
      settledTops[targetSelector] = top;
      return settled;
    },
    selector,
    { polling: 150 },
  );
}

async function openTopbarPage(
  browser: Browser,
  browserName: string,
  scenario: Scenario,
  url: string,
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({
    hasTouch: scenario.hasTouch,
    viewport: scenario.viewport,
    // isMobile switches Chromium and WebKit to their touch layout viewport; Firefox rejects it.
    ...(scenario.hasTouch && browserName !== "firefox"
      ? { deviceScaleFactor: 2, isMobile: true }
      : {}),
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    const testWindow = window as TestWindow;
    testWindow.__PROFILING__ = true;
    testWindow.__REACT_GRAB_DISABLED__ = true;
  });
  await page.goto(url);
  await page.locator(TOPBAR_SELECTOR).waitFor({ state: "visible" });
  // Server markup ships the desktop nav plus the pre-animation offset, so wait for the hydrated
  // entry animation to finish: framer-motion writes `transform: none` once it lands.
  await page.waitForFunction((topbarSelector) => {
    const nav = document.querySelector(topbarSelector);
    return nav instanceof HTMLElement && getComputedStyle(nav).transform === "none";
  }, TOPBAR_SELECTOR);
  await waitForSettledLayout(page, TOPBAR_SELECTOR);

  return { context, page };
}

async function readTopbarMetrics(page: Page): Promise<TopbarMetrics> {
  return page.evaluate((topbarSelector) => {
    const round = (value: number) => Math.round(value * 100) / 100;
    const nav = document.querySelector(topbarSelector);
    const frame = nav?.querySelector(".topbar-frosted");
    const bar = frame?.querySelector(":scope > div:first-child");
    const row = bar?.querySelector(':scope > div:not([aria-hidden="true"])');

    if (
      !(frame instanceof HTMLElement) ||
      !(bar instanceof HTMLElement) ||
      !(row instanceof HTMLElement)
    ) {
      throw new Error("Topbar row is missing.");
    }

    const readTextRect = (element: Element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      let node = walker.nextNode();

      while (node) {
        if (node.textContent?.trim() && !node.parentElement?.classList.contains("sr-only")) {
          range.selectNodeContents(node);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return rect;
          }
        }
        node = walker.nextNode();
      }

      return null;
    };
    const readChildRect = (element: Element) => {
      for (const child of element.children) {
        if (child.classList.contains("sr-only")) {
          continue;
        }

        const rect = child.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return rect;
        }
      }

      return null;
    };
    const readLabel = (element: Element) =>
      (element.getAttribute("aria-label") ?? element.textContent ?? "").trim();
    const rowRect = row.getBoundingClientRect();
    const rowCenter = rowRect.top + rowRect.height / 2;
    const controls: ControlMetrics[] = [];

    for (const element of row.querySelectorAll("a, button, summary")) {
      if (element.closest('[aria-hidden="true"]')) {
        continue;
      }

      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") {
        continue;
      }

      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        continue;
      }

      const textRect = readTextRect(element);
      const childRect = readChildRect(element);

      controls.push({
        boxCenterDelta: round(rect.top + rect.height / 2 - rowCenter),
        height: round(rect.height),
        childCenterDelta: childRect
          ? round(childRect.top + childRect.height / 2 - rowCenter)
          : null,
        isNavLink: element.matches(".topbar-links a"),
        label: readLabel(element),
        textCenterDelta: textRect ? round(textRect.top + textRect.height / 2 - rowCenter) : null,
        textInlineCenterDelta: textRect
          ? round(textRect.left + textRect.width / 2 - (rect.left + rect.width / 2))
          : null,
        width: round(rect.width),
      });
    }

    const menuRows: MenuRowMetrics[] = [];

    for (const element of document.querySelectorAll(
      `${topbarSelector} nav a, ${topbarSelector} nav button`,
    )) {
      const rect = element.getBoundingClientRect();
      const textRect = readTextRect(element);

      menuRows.push({
        bottom: round(rect.bottom),
        height: round(rect.height),
        isLink: element.tagName === "A",
        label: readLabel(element),
        textCenterDelta: textRect
          ? round(textRect.top + textRect.height / 2 - (rect.top + rect.height / 2))
          : null,
        top: round(rect.top),
      });
    }

    return {
      barHeight: round(bar.getBoundingClientRect().height),
      compact: row.querySelector('button[aria-label$=" menu"]') !== null,
      controls,
      frameHeight: round(frame.getBoundingClientRect().height),
      menuRows,
      pointerCoarse: window.matchMedia("(pointer: coarse)").matches,
      rowHeight: round(rowRect.height),
    };
  }, TOPBAR_SELECTOR);
}

function expectFixedTopbarGeometry(metrics: TopbarMetrics, label: string) {
  expectWithin(
    metrics.barHeight,
    TOPBAR_FRAME_HEIGHT,
    BOX_TOLERANCE,
    `${label}: topbar bar height`,
  );

  // The frosted frame also wraps the expanded compact menu, so it only equals the bar when closed.
  if (metrics.menuRows.length === 0) {
    expectWithin(
      metrics.frameHeight,
      TOPBAR_FRAME_HEIGHT,
      BOX_TOLERANCE,
      `${label}: topbar frame height`,
    );
  }
  expectWithin(metrics.rowHeight, CONTROL_SIZE, BOX_TOLERANCE, `${label}: topbar row height`);
  expect(metrics.controls.length, `${label}: topbar controls`).toBeGreaterThanOrEqual(2);

  const textCenterDeltas: number[] = [];

  for (const control of metrics.controls) {
    const controlLabel = `${label}: "${control.label}"`;

    expectWithin(control.height, CONTROL_SIZE, BOX_TOLERANCE, `${controlLabel} height`);
    expect(control.width, `${controlLabel} width`).toBeGreaterThanOrEqual(
      CONTROL_SIZE - BOX_TOLERANCE,
    );
    expectWithin(control.boxCenterDelta, 0, BOX_TOLERANCE, `${controlLabel} box centre`);
    expect(
      control.textCenterDelta !== null || control.childCenterDelta !== null,
      `${controlLabel} has visible content`,
    ).toBe(true);

    if (control.textCenterDelta !== null) {
      expectWithin(control.textCenterDelta, 0, CONTENT_TOLERANCE, `${controlLabel} label centre`);
      textCenterDeltas.push(control.textCenterDelta);
    }

    if (control.childCenterDelta !== null) {
      expectWithin(control.childCenterDelta, 0, BOX_TOLERANCE, `${controlLabel} content centre`);
    }

    if (control.isNavLink && control.textInlineCenterDelta !== null) {
      expectWithin(
        control.textInlineCenterDelta,
        0,
        CONTENT_TOLERANCE,
        `${controlLabel} inline centre`,
      );
    }
  }

  const labelSpread = Math.max(...textCenterDeltas) - Math.min(...textCenterDeltas);
  expect(labelSpread, `${label}: label baselines drift apart`).toBeLessThanOrEqual(
    CONTENT_TOLERANCE,
  );
}

async function openCompactMenu(page: Page) {
  // The label flips to "Close menu" once open, so match both states of the same button.
  const menuButton = page.locator(TOPBAR_SELECTOR).getByRole("button", { name: MENU_BUTTON_NAME });

  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(`${TOPBAR_SELECTOR} nav a`).last()).toBeVisible();
  await waitForSettledLayout(page, `${TOPBAR_SELECTOR} nav a:last-of-type`);
}

function expectCenteredMenuRows(rows: MenuRowMetrics[], label: string) {
  expect(rows.length, `${label}: menu rows`).toBeGreaterThanOrEqual(3);

  let previousLinkBottom = Number.NEGATIVE_INFINITY;

  for (const row of rows) {
    const rowLabel = `${label}: menu row "${row.label}"`;

    expect(row.height, `${rowLabel} height`).toBeGreaterThanOrEqual(CONTROL_SIZE - BOX_TOLERANCE);
    expect(row.textCenterDelta, `${rowLabel} has a label`).not.toBeNull();
    expectWithin(row.textCenterDelta ?? 0, 0, CONTENT_TOLERANCE, `${rowLabel} label centre`);

    if (row.isLink) {
      expect(row.top, `${rowLabel} overlaps the previous row`).toBeGreaterThanOrEqual(
        previousLinkBottom - BOX_TOLERANCE,
      );
      previousLinkBottom = row.bottom;
    }
  }
}

test.describe("topbar geometry", () => {
  for (const scenario of SCENARIOS) {
    test(`keeps a fixed bar with centred 44px controls on ${scenario.name}`, async ({
      baseURL,
      browser,
      browserName,
    }) => {
      const { context, page } = await openTopbarPage(
        browser,
        browserName,
        scenario,
        getPageUrl(baseURL),
      );

      try {
        const metrics = await readTopbarMetrics(page);

        expect(metrics.compact, `${scenario.name}: compact navigation`).toBe(
          scenario.expectCompact,
        );
        expectFixedTopbarGeometry(metrics, scenario.name);

        if (metrics.compact) {
          await openCompactMenu(page);
          const openMetrics = await readTopbarMetrics(page);

          expectFixedTopbarGeometry(openMetrics, `${scenario.name} with the menu open`);
          expectCenteredMenuRows(openMetrics.menuRows, scenario.name);
        }
      } finally {
        await context.close();
      }
    });
  }

  test("renders identical control boxes for mouse and touch pointers", async ({
    baseURL,
    browser,
    browserName,
  }) => {
    const viewport = { height: 768, width: 1024 };
    const readControls = async (scenario: Scenario) => {
      const { context, page } = await openTopbarPage(
        browser,
        browserName,
        scenario,
        getPageUrl(baseURL),
      );

      try {
        return await readTopbarMetrics(page);
      } finally {
        await context.close();
      }
    };
    const mouse = await readControls({
      name: "mouse",
      expectCompact: false,
      hasTouch: false,
      viewport,
    });
    const touch = await readControls({
      name: "touch",
      expectCompact: false,
      hasTouch: true,
      viewport,
    });

    expect(touch.frameHeight).toBe(mouse.frameHeight);
    expect(touch.controls.map((control) => control.label)).toEqual(
      mouse.controls.map((control) => control.label),
    );

    for (const [index, mouseControl] of mouse.controls.entries()) {
      const touchControl = touch.controls[index];
      const label = `"${mouseControl.label}" mouse vs touch`;

      expectWithin(touchControl.width, mouseControl.width, BOX_TOLERANCE, `${label} width`);
      expectWithin(touchControl.height, mouseControl.height, BOX_TOLERANCE, `${label} height`);
      expectWithin(
        touchControl.textCenterDelta ?? 0,
        mouseControl.textCenterDelta ?? 0,
        BOX_TOLERANCE,
        `${label} label centre`,
      );
    }
  });

  for (const localeScenario of LOCALE_SCENARIOS) {
    test(`keeps ${localeScenario.name} centred`, async ({ baseURL, browser, browserName }) => {
      const { context, page } = await openTopbarPage(
        browser,
        browserName,
        localeScenario.scenario,
        getPageUrl(baseURL, `?lang=${localeScenario.lang}`),
      );

      try {
        await expect(
          page.locator(VISIBLE_NAV_LINK_SELECTOR, { hasText: localeScenario.expectedLabel }),
        ).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("lang", localeScenario.lang);

        const metrics = await readTopbarMetrics(page);

        expect(metrics.compact, `${localeScenario.name}: compact navigation`).toBe(false);
        expectFixedTopbarGeometry(metrics, localeScenario.name);
      } finally {
        await context.close();
      }
    });
  }
});
