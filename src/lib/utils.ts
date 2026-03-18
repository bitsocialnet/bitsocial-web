import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const highlightTimeouts = new WeakMap<Element, ReturnType<typeof setTimeout>>();
const TEMPORARY_HIGHLIGHT_DURATION_MS = 5000;
const HERO_TAGLINE_ID = "hero-tagline";
const TAGLINE_HIGHLIGHT_COLOR = "#2563eb";
const TAGLINE_HIGHLIGHT_FILTER = "drop-shadow(0 0 12px rgba(37, 99, 235, 0.8))";

function getScrollBehavior(): ScrollBehavior {
  return document.documentElement.dataset.reducedMotion === "true" ? "auto" : "smooth";
}

function applyTemporaryHighlight(
  element: HTMLElement,
  className: string,
  durationMs = TEMPORARY_HIGHLIGHT_DURATION_MS,
) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);

  const existingTimeout = highlightTimeouts.get(element);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  const timeoutId = setTimeout(() => {
    element.classList.remove(className);
  }, durationMs);

  highlightTimeouts.set(element, timeoutId);
}

function applyTemporaryTextHighlight(
  element: HTMLElement,
  durationMs = TEMPORARY_HIGHLIGHT_DURATION_MS,
) {
  element.style.color = TAGLINE_HIGHLIGHT_COLOR;
  element.style.filter = TAGLINE_HIGHLIGHT_FILTER;

  const existingTimeout = highlightTimeouts.get(element);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  const timeoutId = setTimeout(() => {
    element.style.color = "";
    element.style.filter = "";
  }, durationMs);

  highlightTimeouts.set(element, timeoutId);
}

/**
 * Triggers a glow effect on the feature card corresponding to the hash.
 * Scrolls to the element and adds a temporary glow that eases in and out smoothly.
 */
export function triggerFeatureGlow(hash: string) {
  const element = document.getElementById(hash);
  if (element) {
    element.scrollIntoView({ behavior: getScrollBehavior(), block: "center" });

    const card = element.querySelector(".glass-card");
    if (card && card instanceof HTMLElement) {
      applyTemporaryHighlight(card, "highlight-glow");
    }
  }
}

export function triggerTaglineGlow(hash: string) {
  const tagline = document.getElementById(HERO_TAGLINE_ID);
  const link = document.querySelector<HTMLElement>(`[data-tagline-link="${hash}"]`);
  tagline?.scrollIntoView({ behavior: getScrollBehavior(), block: "center" });

  if (link) {
    applyTemporaryTextHighlight(link);
  }
}
