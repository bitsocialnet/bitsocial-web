import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/** Sends one page view per pathname. Query, fragment and theme or language changes are not new pages. */
export default function PageViewTracker() {
  const { pathname } = useLocation();
  // Also absorbs StrictMode's development-only second effect run for the same pathname.
  const trackedPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (trackedPathnameRef.current === pathname) return;
    trackedPathnameRef.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
