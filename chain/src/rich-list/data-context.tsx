import { type ReactNode, createContext, useContext, useMemo } from "react";
import { COMMITTED_SNAPSHOT, type RichListData, buildRichListData } from "@/lib/rich-list/holders";
import { fetchLiveSnapshot } from "@/lib/rich-list/live";
import { type LiveStatus, useLiveData } from "@/lib/use-live-data";

type RichListContextValue = RichListData & { status: LiveStatus };

const RichListContext = createContext<RichListContextValue | null>(null);

/** Renders from the committed snapshot at once, then keeps balances and the price on Blockscout. */
export function RichListDataProvider({ children }: { children: ReactNode }) {
  const { data: snapshot, status } = useLiveData(
    COMMITTED_SNAPSHOT,
    fetchLiveSnapshot,
    "Blockscout",
  );

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
