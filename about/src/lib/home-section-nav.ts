import type { NavigateFunction } from "react-router-dom";
import { getScrollBehavior } from "@/lib/utils";

export const FAQ_HASH = "#faq";

/**
 * Home sections whose deep links need the layout-settling correction pass in `pages/home.tsx`.
 * `#mailing-list` is deliberately absent: it is routed through `lib/mailing-list-nav.ts`, and
 * registering it here would run two competing scroll loops against the same target.
 */
export const HOME_SECTION_HASHES = new Set([
  "#problem",
  "#core-features",
  "#browser-peer",
  "#decentralized",
  "#arbitrary-challenges",
  "#text-only-protocol",
  "#adoption-thesis",
  "#master-plan",
  FAQ_HASH,
]);

export function scrollToHomeSectionHash(hash: string) {
  const sectionId = hash.slice(1);
  if (!sectionId) return;

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: getScrollBehavior(),
    block: "start",
  });
}

/**
 * Points the address bar at `hash` without a router navigation. In-page links write the hash with
 * raw `history` calls the router never sees, so the router's `location.hash` can still equal a
 * target the URL has already moved away from, and navigating to it again would change nothing.
 */
export function replaceUrlHash(hash: string) {
  if (window.location.hash === hash) return;

  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}${hash}`,
  );
}

/** Navigate to a home-page section, including when the current hash already matches the target. */
export function goToHomeSectionHash(
  pathname: string,
  currentHash: string,
  targetHash: string,
  navigate: NavigateFunction,
  onNavigate?: () => void,
) {
  onNavigate?.();

  const isHome = pathname === "/" || pathname === "";
  if (isHome && currentHash === targetHash) {
    replaceUrlHash(targetHash);
    scrollToHomeSectionHash(targetHash);
    return;
  }

  navigate({ pathname: "/", hash: targetHash.slice(1) }, isHome ? { replace: true } : undefined);
}
