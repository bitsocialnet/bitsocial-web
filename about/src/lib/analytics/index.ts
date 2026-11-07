import type { AppLink } from "@/lib/apps-data";
import { isAnalyticsEnabled, type NewsletterSignupOutcome } from "./shared";

type AnalyticsClient = typeof import("./client");

let clientPromise: Promise<AnalyticsClient> | undefined;

// The SDK and the route mapping load only when there is something to send, outside the startup
// graph. A failed download or a throwing SDK is swallowed so analytics never breaks a page.
function withClient(send: (client: AnalyticsClient) => void) {
  if (!isAnalyticsEnabled()) return;
  if (!clientPromise) {
    clientPromise = import("./client");
  }
  clientPromise.then(send).catch(() => {});
}

export function trackPageView(pathname: string) {
  withClient((client) => client.trackPageView(pathname));
}

export function trackAppLinkClick(appSlug: string, link: Pick<AppLink, "kind" | "platform">) {
  withClient((client) => client.trackAppLinkClick(appSlug, link));
}

export function trackNewsletterSignup(outcome: NewsletterSignupOutcome) {
  withClient((client) => client.trackNewsletterSignup(outcome));
}
