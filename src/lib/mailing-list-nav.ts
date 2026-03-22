import type { NavigateFunction } from "react-router-dom";

export const MAILING_LIST_SECTION_ID = "mailing-list";
export const MAILING_LIST_HASH = "#mailing-list";

export function scrollToMailingListSection() {
  const el = document.getElementById(MAILING_LIST_SECTION_ID);
  if (!el) return;
  const behavior = document.documentElement.dataset.reducedMotion === "true" ? "auto" : "smooth";
  el.scrollIntoView({ behavior, block: "start" });
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
    scrollToMailingListSection();
    return;
  }
  if (isHome) {
    navigate({ pathname: "/", hash: "mailing-list" }, { replace: true });
    return;
  }
  navigate({ pathname: "/", hash: "mailing-list" });
}
