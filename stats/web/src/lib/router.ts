import { useSyncExternalStore, type MouseEvent } from "react";
import type { RangeKey } from "@/lib/types";

// Three fixed routes and a range query parameter: history.pushState plus popstate is all the
// routing this dashboard needs.

const NAVIGATE_EVENT = "stats:navigate";

export const RANGE_KEYS: RangeKey[] = ["6h", "24h", "7d", "14d"];
export const DEFAULT_RANGE: RangeKey = "24h";

const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  window.addEventListener(NAVIGATE_EVENT, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(NAVIGATE_EVENT, listener);
  };
};

const getLocation = () => `${window.location.pathname}${window.location.search}`;

export function useLocation() {
  const location = useSyncExternalStore(subscribe, getLocation);
  const url = new URL(location, window.location.origin);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const rangeParam = url.searchParams.get("range");
  const range = RANGE_KEYS.includes(rangeParam as RangeKey)
    ? (rangeParam as RangeKey)
    : DEFAULT_RANGE;
  return { pathname, range };
}

export const hrefFor = (pathname: string, range: RangeKey) =>
  range === DEFAULT_RANGE ? pathname : `${pathname}?range=${range}`;

export function navigate(href: string, { replace = false, scroll = true } = {}) {
  if (href === getLocation()) {
    return;
  }
  if (replace) {
    window.history.replaceState(null, "", href);
  } else {
    window.history.pushState(null, "", href);
  }
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
  if (scroll) {
    window.scrollTo({ top: 0 });
  }
}

/** Click handler for in-app links that keeps modifier-clicks opening new tabs. */
export const onLinkClick = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  navigate(href);
};
