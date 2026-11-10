import type { NavigateFunction } from "react-router-dom";
import { replaceUrlHash } from "@/lib/home-section-nav";
import { triggerFeatureGlow } from "@/lib/utils";

const MAILING_LIST_SECTION_ID = "mailing-list";
export const MAILING_LIST_HASH = "#mailing-list";
const MAILING_LIST_LAYOUT_STABLE_FRAMES = 6;
const MAILING_LIST_LAYOUT_DELTA_PX = 1;
const MAILING_LIST_SCROLL_MAX_WAIT_MS = 1400;

/** Scrolls to the mailing list and applies the same temporary border glow as core feature cards. */
export function scrollToMailingListSection() {
  triggerFeatureGlow(MAILING_LIST_SECTION_ID);
}

function getMailingListScrollSample() {
  const section = document.getElementById(MAILING_LIST_SECTION_ID);
  if (!section) return null;

  const card = section.querySelector(".glass-card");
  const scrollTarget = card instanceof HTMLElement ? card : section;
  const rect = scrollTarget.getBoundingClientRect();

  return {
    height: rect.height,
    scrollHeight: document.documentElement.scrollHeight,
    top: rect.top + window.scrollY,
  };
}

/**
 * Deep-link loads can land before the full home layout settles, so wait for the
 * newsletter target to stop shifting before triggering the single smooth scroll.
 */
export function scheduleMailingListHashScroll() {
  let frameId: number | null = null;
  let cancelled = false;
  let lastSample: ReturnType<typeof getMailingListScrollSample> = null;
  let stableFrameCount = 0;
  let pageLoaded = document.readyState === "complete";
  let fontsReady = !("fonts" in document) || document.fonts.status === "loaded";
  const startedAt = performance.now();

  const scheduleTick = () => {
    if (frameId !== null || cancelled) return;
    frameId = window.requestAnimationFrame(tick);
  };

  const tick = () => {
    frameId = null;
    if (cancelled) return;

    const sample = getMailingListScrollSample();
    if (!sample) {
      scheduleTick();
      return;
    }

    if (
      lastSample &&
      Math.abs(sample.top - lastSample.top) <= MAILING_LIST_LAYOUT_DELTA_PX &&
      Math.abs(sample.height - lastSample.height) <= MAILING_LIST_LAYOUT_DELTA_PX &&
      Math.abs(sample.scrollHeight - lastSample.scrollHeight) <= MAILING_LIST_LAYOUT_DELTA_PX
    ) {
      stableFrameCount += 1;
    } else {
      stableFrameCount = 0;
    }

    lastSample = sample;

    const layoutReady = pageLoaded && fontsReady;
    const exceededWait = performance.now() - startedAt >= MAILING_LIST_SCROLL_MAX_WAIT_MS;

    if ((layoutReady && stableFrameCount >= MAILING_LIST_LAYOUT_STABLE_FRAMES) || exceededWait) {
      scrollToMailingListSection();
      return;
    }

    scheduleTick();
  };

  const handleLoad = () => {
    pageLoaded = true;
    scheduleTick();
  };
  const handlePageShow = () => {
    lastSample = null;
    stableFrameCount = 0;
    scheduleTick();
  };

  if (!pageLoaded) {
    window.addEventListener("load", handleLoad, { once: true });
  }

  if (!fontsReady && "fonts" in document) {
    void document.fonts.ready.then(() => {
      fontsReady = true;
      scheduleTick();
    });
  }

  window.addEventListener("pageshow", handlePageShow);
  scheduleTick();

  return () => {
    cancelled = true;
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
    }
    window.removeEventListener("load", handleLoad);
    window.removeEventListener("pageshow", handlePageShow);
  };
}

/**
 * Go to the home mailing list section. Uses React Router hash navigation so
 * `useLocation().hash` stays in sync (plain `<Link to="/#id">` does not scroll on the home route).
 */
export function goToMailingListSection(
  pathname: string,
  hash: string,
  navigate: NavigateFunction,
  onNavigate?: () => void,
) {
  onNavigate?.();
  const isHome = pathname === "/" || pathname === "";
  if (isHome && hash === MAILING_LIST_HASH) {
    replaceUrlHash(MAILING_LIST_HASH);
    scrollToMailingListSection();
    return;
  }
  if (isHome) {
    navigate({ pathname: "/", hash: "mailing-list" }, { replace: true });
    return;
  }
  navigate({ pathname: "/", hash: "mailing-list" });
}
