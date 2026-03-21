import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const highlightTimeouts = new WeakMap<Element, ReturnType<typeof setTimeout>>();
const TEMPORARY_HIGHLIGHT_DURATION_MS = 5000;
const HERO_TAGLINE_ID = "hero-tagline";

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

/** Stops in-flight card glow animations and tagline link highlights so a new target can take over. */
function clearInteractiveFeatureHighlights() {
  document.querySelectorAll(".highlight-glow").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const tid = highlightTimeouts.get(node);
    if (tid != null) clearTimeout(tid);
    highlightTimeouts.delete(node);
    node.classList.remove("highlight-glow");
  });

  document.querySelectorAll("[data-tagline-link]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const tid = highlightTimeouts.get(node);
    if (tid != null) clearTimeout(tid);
    highlightTimeouts.delete(node);
    node.classList.remove("highlight-text-glow");
  });
}

/**
 * Triggers a glow effect on the feature card corresponding to the hash.
 * Scrolls to the element and adds a temporary glow that eases in and out smoothly.
 */
export function triggerFeatureGlow(hash: string) {
  clearInteractiveFeatureHighlights();

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
  clearInteractiveFeatureHighlights();

  const tagline = document.getElementById(HERO_TAGLINE_ID);
  const link = document.querySelector<HTMLElement>(`[data-tagline-link="${hash}"]`);
  tagline?.scrollIntoView({ behavior: getScrollBehavior(), block: "center" });

  if (link) {
    applyTemporaryHighlight(link, "highlight-text-glow");
  }
}
