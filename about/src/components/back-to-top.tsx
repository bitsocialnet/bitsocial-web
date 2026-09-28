import { ArrowUp } from "lucide-react";
import { type MouseEvent, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { getScrollReturnY, scrollToReturnOrigin, subscribeScrollReturn } from "@/lib/scroll-return";
import { getScrollBehavior } from "@/lib/utils";

/** Past this share of the scrollable range the arrow flips to "up" so the next click returns to the top. */
const UPWARD_THRESHOLD = 0.5;

type ArrowState = {
  /** The next click goes back to where an in-page jump started instead of to a page end. */
  isReturn: boolean;
  pointsUp: boolean;
};

const IDLE_STATE: ArrowState = { isReturn: false, pointsUp: false };

const listeners = new Set<() => void>();
let state = IDLE_STATE;
let unsubscribeReturn: (() => void) | null = null;
let frameId = 0;

function readState(): ArrowState {
  const returnY = getScrollReturnY();
  if (returnY !== null) {
    return { isReturn: true, pointsUp: returnY < window.scrollY };
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return {
    isReturn: false,
    pointsUp: maxScroll > 0 && window.scrollY > maxScroll * UPWARD_THRESHOLD,
  };
}

/**
 * Scroll and resize fire far more often than the arrow can flip, and the sections behind this
 * button mutate layout while scrolling, so the `scrollHeight` read is coalesced into a single
 * animation frame instead of forcing a reflow per event.
 */
function scheduleSync() {
  if (frameId) return;
  frameId = requestAnimationFrame(() => {
    frameId = 0;
    const next = readState();
    if (next.isReturn === state.isReturn && next.pointsUp === state.pointsUp) return;
    state = next;
    listeners.forEach((listener) => listener());
  });
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    state = readState();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
    // A jump can be registered without moving the page far enough to fire a scroll event, so the
    // memory reports its own changes instead of being polled off scroll alone.
    unsubscribeReturn = subscribeScrollReturn(scheduleSync);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    window.removeEventListener("scroll", scheduleSync);
    window.removeEventListener("resize", scheduleSync);
    unsubscribeReturn?.();
    unsubscribeReturn = null;
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return IDLE_STATE;
}

const buttonClassName =
  "js-only fixed bottom-5 right-[calc(1.25rem+var(--removed-body-scroll-bar-size,0px))] sm:bottom-6 sm:right-[calc(1.5rem+var(--removed-body-scroll-bar-size,0px))] z-40 flex h-12 w-12 items-center justify-center rounded-full border border-blue-core/30 bg-blue-core/[0.08] backdrop-blur-[10px] text-foreground/90 shadow-[0_8px_24px_rgba(15,23,42,0.1)] ring-glow cta-glow hover:border-blue-glow hover:bg-blue-core/[0.14] hover:text-foreground dark:border-blue-core/45 dark:bg-blue-core/[0.18] dark:shadow-[0_10px_28px_rgba(2,6,23,0.34)] dark:hover:border-blue-glow dark:hover:bg-blue-core/[0.24]";

export default function BackToTop() {
  const { t } = useTranslation();
  const { isReturn, pointsUp: showsUpArrow } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!scrollToReturnOrigin()) {
      window.scrollTo({
        top: showsUpArrow ? 0 : document.documentElement.scrollHeight,
        left: 0,
        behavior: getScrollBehavior(),
      });
    }
    // A pointer click (event.detail > 0) leaves focus on the button, which some
    // browsers keep rendering as a lingering "selected" focus ring once it
    // scrolls back into view. Drop focus for pointer activation, but keep it for
    // keyboard users (event.detail === 0) so their focus ring and tab position
    // are preserved.
    if (event.detail > 0) {
      event.currentTarget.blur();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        isReturn ? t("nav.backToPrevious") : showsUpArrow ? t("nav.backToTop") : t("nav.goToBottom")
      }
      className={buttonClassName}
    >
      <ArrowUp
        aria-hidden="true"
        className={`h-5 w-5 transition-transform duration-300 motion-reduce:transition-none ${
          showsUpArrow ? "" : "rotate-180"
        }`}
      />
    </button>
  );
}
