const ANALYTICS_HOSTNAMES = new Set(["bitsocial.net", "www.bitsocial.net"]);

/**
 * Only the production build served over https from bitsocial.net reports to Vercel. Development
 * servers, previews, localhost, profiling builds and server rendering send nothing.
 */
export function isAnalyticsEnabled(): boolean {
  return (
    import.meta.env.PROD &&
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    ANALYTICS_HOSTNAMES.has(window.location.hostname)
  );
}

export type NewsletterSignupOutcome = "success" | "failure";
