/**
 * Only the production build served over https from chain.bitsocial.net reports to Vercel.
 * Development servers, previews, localhost and profiling builds send nothing.
 */
export function isAnalyticsEnabled(): boolean {
  return (
    import.meta.env.PROD &&
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    window.location.hostname === "chain.bitsocial.net"
  );
}

export type NewsletterSignupOutcome = "success" | "failure";
