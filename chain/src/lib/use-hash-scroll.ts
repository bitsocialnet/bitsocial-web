import { useEffect } from "react";
import { getScrollBehavior } from "@/lib/utils";

const LAYOUT_DELTA_PX = 1;
const LAYOUT_STABLE_FRAMES = 2;
const SCROLL_MAX_WAIT_MS = 1400;

type LayoutSample = {
  scrollHeight: number;
  targetTop: number;
};

function getHashTarget() {
  const sectionId = window.location.hash.slice(1);
  return sectionId ? document.getElementById(sectionId) : null;
}

function getLayoutSample(target: HTMLElement): LayoutSample {
  return {
    scrollHeight: document.documentElement.scrollHeight,
    targetTop: target.getBoundingClientRect().top + window.scrollY,
  };
}

function layoutIsStable(current: LayoutSample, previous: LayoutSample) {
  return (
    Math.abs(current.targetTop - previous.targetTop) <= LAYOUT_DELTA_PX &&
    Math.abs(current.scrollHeight - previous.scrollHeight) <= LAYOUT_DELTA_PX
  );
}

export function useHashScroll() {
  useEffect(() => {
    let frameId: number | null = null;
    let runId = 0;

    const scheduleScroll = () => {
      runId += 1;
      const activeRunId = runId;
      const startedAt = performance.now();
      let lastSample: LayoutSample | null = null;
      let stableFrameCount = 0;

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      const tick = () => {
        frameId = null;
        if (activeRunId !== runId) return;

        const exceededWait = performance.now() - startedAt >= SCROLL_MAX_WAIT_MS;
        const target = getHashTarget();
        if (!target) {
          if (!exceededWait) {
            frameId = window.requestAnimationFrame(tick);
          }
          return;
        }

        const sample = getLayoutSample(target);
        stableFrameCount =
          lastSample && layoutIsStable(sample, lastSample) ? stableFrameCount + 1 : 0;
        lastSample = sample;

        const pageLoaded = document.readyState === "complete";
        const fontsLoaded = !("fonts" in document) || document.fonts.status === "loaded";
        if (
          (pageLoaded && fontsLoaded && stableFrameCount >= LAYOUT_STABLE_FRAMES) ||
          exceededWait
        ) {
          target.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
          return;
        }

        frameId = window.requestAnimationFrame(tick);
      };

      frameId = window.requestAnimationFrame(tick);
    };

    scheduleScroll();
    window.addEventListener("hashchange", scheduleScroll);

    return () => {
      runId += 1;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("hashchange", scheduleScroll);
    };
  }, []);
}
