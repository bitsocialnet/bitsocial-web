import { expect, test } from "@playwright/test";

type TestWindow = Window & {
  __PROFILING__?: boolean;
  __REACT_GRAB_DISABLED__?: boolean;
};

const TRANSPARENT = "rgba(0, 0, 0, 0)";
// The hidden measuring copy of the desktop nav renders its own trigger, so scope to the visible row.
const LANGUAGE_TRIGGER_SELECTOR =
  'nav.topbar-position div:not([aria-hidden="true"]) > .topbar-desktop-nav button[aria-haspopup="dialog"]';

test("language trigger keeps its hover background after the sheet returns focus to it", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const testWindow = window as TestWindow;
    testWindow.__PROFILING__ = true;
    testWindow.__REACT_GRAB_DISABLED__ = true;
  });
  await page.goto("/");
  // Wait for the hydrated entry animation so the trigger stops moving under the pointer.
  await page.waitForFunction(() => {
    const nav = document.querySelector("nav.topbar-position");
    return nav instanceof HTMLElement && getComputedStyle(nav).transform === "none";
  });

  // Compare settled colours instead of values sampled mid-transition.
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" });

  const trigger = page.locator(LANGUAGE_TRIGGER_SELECTOR);
  await expect(trigger).toBeVisible();
  const box = await trigger.boundingBox();
  if (!box) throw new Error("Language trigger has no bounding box.");
  const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const background = () => trigger.evaluate((el) => getComputedStyle(el).backgroundColor);

  await page.mouse.move(center.x, center.y);
  await expect.poll(background).not.toBe(TRANSPARENT);
  const hoverBackground = await background();

  await page.mouse.click(center.x, center.y);
  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  // Close with the pointer: a keyboard close makes the returned focus :focus-visible, which
  // shows the same background and would hide the regression.
  await page.mouse.click(100, 500);
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.mouse.move(5, 500);
  await page.mouse.move(center.x, center.y);
  await expect.poll(background).toBe(hoverBackground);
});
