import { inject, pageview, track, type BeforeSendEvent } from "@vercel/analytics";
import { getAppBySlug, type AppLink } from "@/lib/apps-data";
import { isAnalyticsEnabled, type NewsletterSignupOutcome } from "./shared";

export const NOT_FOUND_PATH = "/not-found";

const STATIC_ROUTES = new Set(["/", "/projects", "/privacy", "/about", "/blog"]);
const PROJECT_PATH = /^\/projects\/([^/]+)$/;
// Only the five standard campaign tags are kept: any other utm_ name could itself carry an identifier.
const UTM_KEYS = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]);
// A utm_ value carrying an email address or a wallet address identifies someone, so it stays local.
const IDENTIFYING_VALUE = /@|0x[0-9a-f]{40}/i;

export interface AnalyticsPage {
  /** The page as sent: the route with a known project slug filled in. */
  path: string;
  /** The route template from app.tsx, so the dashboard groups every project page together. */
  route: string;
}

function decodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return undefined;
  }
}

/** Maps a pathname onto app.tsx's routes. Anything else, including unknown projects, is not found. */
export function getAnalyticsPage(pathname: string): AnalyticsPage {
  const path = pathname.split(/[?#]/, 1)[0] || "/";
  const normalizedPath = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  if (STATIC_ROUTES.has(normalizedPath)) {
    return { path: normalizedPath, route: normalizedPath };
  }

  const projectSegment = PROJECT_PATH.exec(normalizedPath)?.[1];
  const app = projectSegment ? getAppBySlug(decodeSegment(projectSegment) ?? "") : undefined;
  if (app) {
    return { path: `/projects/${app.slug}`, route: "/projects/[slug]" };
  }

  return { path: NOT_FOUND_PATH, route: NOT_FOUND_PATH };
}

/**
 * Rebuilds a page URL from its mapped path, keeping only non-identifying utm_ parameters. The SDK
 * clears the query whenever the sent path differs from the live pathname (a trailing slash, an
 * unknown page), so the tags come from `liveUrl` when it is the same mapped page.
 */
export function getAnalyticsUrl(url: string, liveUrl?: string): string {
  const source = new URL(url);
  const path = getAnalyticsPage(source.pathname).path;
  const live = liveUrl ? new URL(liveUrl) : undefined;
  const query =
    live && getAnalyticsPage(live.pathname).path === path ? live.searchParams : source.searchParams;
  const sanitized = new URL(path, source.origin);
  for (const [key, value] of query) {
    if (UTM_KEYS.has(key) && !IDENTIFYING_VALUE.test(value)) {
      sanitized.searchParams.append(key, value);
    }
  }
  return sanitized.href;
}

// The address of each requested page view, by sent path: a view queued before Vercel's script loads
// is sanitized later, when the visitor may already be on another page.
const requestedPageUrls = new Map<string, string>();

/**
 * Every page view and custom event passes through here before it leaves the browser. The SDK hands
 * over the live location for the current page, query and fragment included.
 */
export function sanitizeAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  if (!isAnalyticsEnabled() || globalThis.navigator?.webdriver === true) {
    return null;
  }
  try {
    const source = new URL(event.url);
    const path = getAnalyticsPage(source.pathname).path;
    // Custom events keep only the page: campaign tags are free text, and event records promise none.
    if (event.type === "event") {
      return { ...event, url: new URL(path, source.origin).href };
    }
    const requestedUrl = requestedPageUrls.get(path);
    requestedPageUrls.delete(path);
    return { ...event, url: getAnalyticsUrl(event.url, requestedUrl ?? window.location.href) };
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
  const page = getAnalyticsPage(pathname);
  requestedPageUrls.set(page.path, window.location.href);
  pageview(page);
}

export type AppLinkEvent = "app_open" | "app_download";

/** Launch and mirror links open a web app; download and package links install one. */
export function getAppLinkEvent(link: Pick<AppLink, "kind">): AppLinkEvent {
  return link.kind === "launch" || link.kind === "mirror" ? "app_open" : "app_download";
}

export function trackAppLinkClick(appSlug: string, link: Pick<AppLink, "kind" | "platform">) {
  if (!isAnalyticsEnabled()) return;
  initialize();
  track(getAppLinkEvent(link), {
    app: getAppBySlug(appSlug)?.slug ?? "other",
    // Package links (npm, container images) have no platform.
    platform: link.platform ?? "package",
  });
}

export function trackNewsletterSignup(outcome: NewsletterSignupOutcome) {
  if (!isAnalyticsEnabled()) return;
  initialize();
  track("newsletter_signup", { outcome });
}
