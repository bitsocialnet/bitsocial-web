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
// Only the five standard campaign tags are kept: any other utm_ name could itself carry an identifier.
const UTM_KEYS = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]);
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
    if (UTM_KEYS.has(key) && !IDENTIFYING_VALUE.test(value)) {
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
    // Custom events keep only the page: campaign tags are free text, and event records promise none.
    if (event.type === "event") {
      const source = new URL(event.url);
      return { ...event, url: new URL(getAnalyticsPath(source.pathname), source.origin).href };
    }
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
