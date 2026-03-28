import type { NavigateFunction } from "react-router-dom";
import { triggerFeatureGlow } from "@/lib/utils";

const MAILING_LIST_SECTION_ID = "mailing-list";
export const MAILING_LIST_HASH = "#mailing-list";

/** Scrolls to the mailing list and applies the same temporary border glow as core feature cards. */
export function scrollToMailingListSection() {
  triggerFeatureGlow(MAILING_LIST_SECTION_ID);
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
