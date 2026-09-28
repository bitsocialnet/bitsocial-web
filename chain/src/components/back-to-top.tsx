import { ArrowUp } from "lucide-react";
import { type MouseEvent, useSyncExternalStore } from "react";
import { getScrollBehavior } from "@/lib/utils";

/** Past this share of the scrollable range the arrow flips to "up" so the next click returns to the top. */
const UPWARD_THRESHOLD = 0.5;

const listeners = new Set<() => void>();
let pointsUp = false;
let frameId = 0;

function readPointsUp() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return maxScroll > 0 && window.scrollY > maxScroll * UPWARD_THRESHOLD;
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
    const next = readPointsUp();
    if (next === pointsUp) return;
    pointsUp = next;
    listeners.forEach((listener) => listener());
  });
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    pointsUp = readPointsUp();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    window.removeEventListener("scroll", scheduleSync);
    window.removeEventListener("resize", scheduleSync);
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };
}

function getSnapshot() {
  return pointsUp;
}

function getServerSnapshot() {
  return false;
}

const buttonClassName =
  "js-only fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-blue-core/30 bg-blue-core/[0.08] backdrop-blur-[10px] text-foreground/90 shadow-[0_8px_24px_rgba(15,23,42,0.1)] ring-glow cta-glow hover:border-blue-glow hover:bg-blue-core/[0.14] hover:text-foreground dark:border-blue-core/45 dark:bg-blue-core/[0.18] dark:shadow-[0_10px_28px_rgba(2,6,23,0.34)] dark:hover:border-blue-glow dark:hover:bg-blue-core/[0.24]";

export default function BackToTop() {
  const showsUpArrow = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    window.scrollTo({
      top: showsUpArrow ? 0 : document.documentElement.scrollHeight,
      left: 0,
      behavior: getScrollBehavior(),
    });
    if (event.detail > 0) {
      event.currentTarget.blur();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={showsUpArrow ? "Back to top" : "Go to bottom"}
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
