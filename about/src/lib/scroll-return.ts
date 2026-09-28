import { getScrollBehavior } from "@/lib/utils";

/**
 * In-page cross links (an FAQ row, a tagline word, a feature title) throw the reader across the
 * page, so the fixed scroll button remembers where the jump started and offers that back as its
 * next destination instead of the absolute top or bottom.
 *
 * The memory is deliberately short lived. It is dropped once the reader either scrolls back past
 * the origin under their own steam or keeps reading well beyond where the jump landed, because at
 * that point "go back" no longer describes where they want to go.
 */

/** The landing spot must hold still for this many frames before the memory becomes usable. */
const SETTLE_STABLE_FRAMES = 4;
const SETTLE_MAX_WAIT_MS = 1600;
const SETTLE_DELTA_PX = 1;
/** A jump shorter than this leaves the origin on screen, so offering it back adds nothing. */
const MIN_JUMP_PX = 120;
/** Reading this many viewports past the landing spot means the reader has moved on. */
const DRIFT_VIEWPORTS = 1.5;
const CROSSED_ORIGIN_SLACK_PX = 4;

type ScrollReturn = {
  /** Settled scroll position the jump ended at; `null` while the scroll is still in flight. */
  landingY: number | null;
  originY: number;
  pathname: string;
};

const listeners = new Set<() => void>();
let scrollReturn: ScrollReturn | null = null;
let settleFrameId = 0;

function notify() {
  listeners.forEach((listener) => listener());
}

function stopSettleWatch() {
  if (!settleFrameId) return;
  cancelAnimationFrame(settleFrameId);
  settleFrameId = 0;
}

export function clearScrollReturn() {
  stopSettleWatch();
  if (!scrollReturn) return;

  scrollReturn = null;
  window.removeEventListener("scroll", handleScroll);
  notify();
}

function handleScroll() {
  const current = scrollReturn;
  if (!current) return;
  if (current.pathname !== window.location.pathname) {
    clearScrollReturn();
    return;
  }
  if (current.landingY === null) return;

  const y = window.scrollY;
  const originIsAbove = current.originY < current.landingY;
  const crossedOrigin = originIsAbove
    ? y <= current.originY + CROSSED_ORIGIN_SLACK_PX
    : y >= current.originY - CROSSED_ORIGIN_SLACK_PX;
  const driftLimit = window.innerHeight * DRIFT_VIEWPORTS;
  const driftedAway = originIsAbove
    ? y - current.landingY > driftLimit
    : current.landingY - y > driftLimit;

  if (crossedOrigin || driftedAway) {
    clearScrollReturn();
  }
}

/**
 * A smooth scroll runs for an unknown number of frames, and the home page keeps correcting deep
 * link targets while sections above them settle, so the landing spot is sampled once the scroll
 * position stops moving rather than assumed at click time.
 */
function watchForLanding() {
  let lastY = window.scrollY;
  let stableFrames = 0;
  const startedAt = performance.now();

  const tick = () => {
    settleFrameId = 0;
    const current = scrollReturn;
    if (!current) return;
    if (current.pathname !== window.location.pathname) {
      clearScrollReturn();
      return;
    }

    const y = window.scrollY;
    const jumped = Math.abs(y - current.originY) >= MIN_JUMP_PX;
    stableFrames = Math.abs(y - lastY) <= SETTLE_DELTA_PX ? stableFrames + 1 : 0;
    lastY = y;

    // A smooth scroll eases in over sub-pixel frames that look exactly like stalled ones, so the
    // jump has to have covered real ground before a run of still frames counts as the landing.
    const settled = jumped && stableFrames >= SETTLE_STABLE_FRAMES;
    if (!settled && performance.now() - startedAt < SETTLE_MAX_WAIT_MS) {
      settleFrameId = requestAnimationFrame(tick);
      return;
    }

    if (!jumped) {
      clearScrollReturn();
      return;
    }

    current.landingY = y;
    notify();
  };

  stopSettleWatch();
  settleFrameId = requestAnimationFrame(tick);
}

/** Records the current scroll position as the place an in-page jump is about to leave behind. */
export function rememberScrollReturn() {
  if (!scrollReturn) {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  scrollReturn = { landingY: null, originY: window.scrollY, pathname: window.location.pathname };
  watchForLanding();
  notify();
}

/** Scroll position to return to, or `null` when there is no usable memory. Safe to call in render. */
export function getScrollReturnY() {
  if (!scrollReturn || scrollReturn.landingY === null) return null;
  if (scrollReturn.pathname !== window.location.pathname) return null;

  return scrollReturn.originY;
}

/** Scrolls back to the remembered origin and forgets it. Returns `false` if there was none. */
export function scrollToReturnOrigin() {
  const originY = getScrollReturnY();
  if (originY === null) return false;

  clearScrollReturn();
  window.scrollTo({ top: originY, left: 0, behavior: getScrollBehavior() });
  return true;
}

export function subscribeScrollReturn(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    // The only subscriber is the scroll button, which lives on the home route: losing it means the
    // page the origin belongs to is gone.
    if (listeners.size === 0) {
      clearScrollReturn();
    }
  };
}
