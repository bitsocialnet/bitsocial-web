import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  COMMITTED_SNAPSHOT,
  type RichListData,
  type Snapshot,
  buildRichListData,
} from "@/lib/rich-list/holders";
import { fetchLiveSnapshot } from "@/lib/rich-list/live";

/** How often an open page refreshes balances and the price. */
const REFRESH_MS = 5 * 60 * 1000;

export type LiveStatus = "loading" | "live" | "unavailable";

type RichListContextValue = RichListData & { status: LiveStatus };

const RichListContext = createContext<RichListContextValue | null>(null);

/**
 * Renders from the committed snapshot at once, then keeps the page on live Blockscout data:
 * refreshed every five minutes while the tab is visible, and again when it becomes visible after
 * going stale. A failed refresh keeps the last good data and reports the page as unavailable.
 */
export function RichListDataProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<Snapshot>(COMMITTED_SNAPSHOT);
  const [status, setStatus] = useState<LiveStatus>("loading");

  useEffect(() => {
    let controller: AbortController | null = null;
    let lastFetch = 0;

    const refresh = async () => {
      controller?.abort();
      const current = new AbortController();
      controller = current;
      lastFetch = Date.now();
      try {
        const next = await fetchLiveSnapshot(current.signal);
        setSnapshot(next);
        setStatus("live");
      } catch (error) {
        if (!current.signal.aborted) {
          console.warn("Could not refresh BSO holders from Blockscout.", error);
          setStatus((previous) => (previous === "live" ? "live" : "unavailable"));
        }
      }
    };

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - lastFetch >= REFRESH_MS) {
        void refresh();
      }
    };

    void refresh();
    const interval = window.setInterval(refreshIfVisible, REFRESH_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfVisible);
      controller?.abort();
    };
  }, []);

  const data = useMemo(() => buildRichListData(snapshot), [snapshot]);
  const value = useMemo(() => ({ ...data, status }), [data, status]);

  return <RichListContext.Provider value={value}>{children}</RichListContext.Provider>;
}

export function useRichList() {
  const value = useContext(RichListContext);
  if (!value) {
    throw new Error("useRichList must be used inside RichListDataProvider.");
  }
  return value;
}
