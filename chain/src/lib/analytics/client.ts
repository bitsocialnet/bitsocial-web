import { inject, pageview, track, type BeforeSendEvent } from "@vercel/analytics";
import { isAnalyticsEnabled, type NewsletterSignupOutcome } from "./shared";

export const NOT_FOUND_PATH = "/not-found";

// The site's three HTML entries, each reachable with or without its trailing slash or index.html.
const PAGE_PATHS = new Map([
  ["/", "/"],
  ["/index.html", "/"],
  ["/chart", "/chart"],
  ["/chart/", "/chart"],
  ["/chart/index.html", "/chart"],
  ["/rich-list", "/rich-list"],
  ["/rich-list/", "/rich-list"],
  ["/rich-list/index.html", "/rich-list"],
]);
// A utm_ value carrying an email address or a wallet address identifies someone, so it stays local.
const IDENTIFYING_VALUE = /@|0x[0-9a-f]{40}/i;

/** Every page is static, so the sent path doubles as its route. Anything else is not found. */
export function getAnalyticsPath(pathname: string): string {
  return PAGE_PATHS.get(pathname.split(/[?#]/, 1)[0] || "/") ?? NOT_FOUND_PATH;
}

/**
 * Rebuilds a page URL from its mapped path, keeping only non-identifying utm_ parameters. The SDK
 * clears the query whenever the sent path differs from the live pathname, as it does for
 * `/rich-list/` and `/chart/`, so the tags come from `liveUrl` when it is the same mapped page.
 */
export function getAnalyticsUrl(url: string, liveUrl?: string): string {
  const source = new URL(url);
  const path = getAnalyticsPath(source.pathname);
  const live = liveUrl ? new URL(liveUrl) : undefined;
  const query =
    live && getAnalyticsPath(live.pathname) === path ? live.searchParams : source.searchParams;
  const sanitized = new URL(path, source.origin);
  for (const [key, value] of query) {
    if (key.startsWith("utm_") && !IDENTIFYING_VALUE.test(value)) {
      sanitized.searchParams.append(key, value);
    }
  }
  return sanitized.href;
}

/**
 * Every page view and custom event passes through here before it leaves the browser. The SDK hands
 * over the live location for the current page, query and fragment included.
 */
export function sanitizeAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  if (!isAnalyticsEnabled() || globalThis.navigator?.webdriver === true) {
    return null;
  }
  try {
    return { ...event, url: getAnalyticsUrl(event.url, window.location.href) };
  } catch {
    return null;
  }
}

let initialized = false;

function initialize() {
  if (initialized) return;
  inject({ disableAutoTrack: true, beforeSend: sanitizeAnalyticsEvent, mode: "production" });
  initialized = true;
}

export function trackPageView(pathname: string) {
  if (!isAnalyticsEnabled()) return;
  initialize();
  const path = getAnalyticsPath(pathname);
  pageview({ path, route: path });
}

export function trackNewsletterSignup(outcome: NewsletterSignupOutcome) {
  if (!isAnalyticsEnabled()) return;
  initialize();
  track("newsletter_signup", { outcome });
}
