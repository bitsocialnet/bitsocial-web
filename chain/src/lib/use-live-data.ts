import { useEffect, useState } from "react";

/** How often an open page refreshes its live data. */
const REFRESH_MS = 5 * 60 * 1000;

export type LiveStatus = "loading" | "live" | "unavailable";

/**
 * Renders from committed data at once, then keeps the page on live data: refreshed five minutes
 * after the previous refresh while the tab is visible, and as soon as it becomes visible again
 * after going stale. A failed refresh keeps the last good data; before any live data has arrived,
 * it reports the page as unavailable. `fetchLive` must be a stable, module-level function.
 */
export function useLiveData<T>(
  committed: T,
  fetchLive: (signal: AbortSignal) => Promise<T>,
  sourceName: string,
) {
  const [data, setData] = useState<T>(committed);
  const [status, setStatus] = useState<LiveStatus>("loading");

  useEffect(() => {
    let controller: AbortController | null = null;
    let timer: number | undefined;
    let lastFetch = 0;

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - lastFetch >= REFRESH_MS) {
        void refresh();
      }
    };

    // A hidden tab lets the timer lapse; visibilitychange refreshes it when it comes back.
    const refresh = async () => {
      controller?.abort();
      const current = new AbortController();
      controller = current;
      lastFetch = Date.now();
      window.clearTimeout(timer);
      timer = window.setTimeout(refreshIfVisible, REFRESH_MS);
      try {
        const next = await fetchLive(current.signal);
        setData(next);
        setStatus("live");
      } catch (error) {
        if (!current.signal.aborted) {
          console.warn(`Could not refresh live data from ${sourceName}.`, error);
          setStatus((previous) => (previous === "live" ? "live" : "unavailable"));
        }
      }
    };

    void refresh();
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", refreshIfVisible);
      controller?.abort();
    };
  }, [fetchLive, sourceName]);

  return { data, status };
}
