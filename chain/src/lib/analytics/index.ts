import { isAnalyticsEnabled, type NewsletterSignupOutcome } from "./shared";

type AnalyticsClient = typeof import("./client");

let clientPromise: Promise<AnalyticsClient> | undefined;

// The SDK loads only when there is something to send, outside the startup graph. A failed
// download or a throwing SDK is swallowed so analytics never breaks a page.
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

export function trackNewsletterSignup(outcome: NewsletterSignupOutcome) {
  withClient((client) => client.trackNewsletterSignup(outcome));
}
