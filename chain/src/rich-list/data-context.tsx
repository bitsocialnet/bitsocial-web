import { type ReactNode, createContext, useContext, useMemo } from "react";
import { COMMITTED_SNAPSHOT, type RichListData, buildRichListData } from "@/lib/rich-list/holders";
import { fetchLiveSnapshot } from "@/lib/rich-list/live";
import { type LiveStatus, useAwaitingLive, useLiveData } from "@/lib/use-live-data";

/**
 * The longest the strip and the holders table stay a skeleton while live balances load; then they
 * show the snapshot. Blockscout serves the holders 50 to a page, so a full refresh takes about four
 * seconds.
 */
const LIVE_WAIT_MS = 10_000;

type RichListContextValue = RichListData & {
  status: LiveStatus;
  /** True while the views that live balances change still wait under their skeleton. */
  awaitingLive: boolean;
};

const RichListContext = createContext<RichListContextValue | null>(null);

/** Renders from the committed snapshot at once, then keeps balances and the price on Blockscout. */
export function RichListDataProvider({ children }: { children: ReactNode }) {
  const { data: snapshot, status } = useLiveData(
    COMMITTED_SNAPSHOT,
    fetchLiveSnapshot,
    "Blockscout",
  );
  const awaitingLive = useAwaitingLive(status, LIVE_WAIT_MS);

  const data = useMemo(() => buildRichListData(snapshot), [snapshot]);
  const value = useMemo(() => ({ ...data, status, awaitingLive }), [data, status, awaitingLive]);

  return <RichListContext.Provider value={value}>{children}</RichListContext.Provider>;
}

export function useRichList() {
  const value = useContext(RichListContext);
  if (!value) {
    throw new Error("useRichList must be used inside RichListDataProvider.");
  }
  return value;
}
