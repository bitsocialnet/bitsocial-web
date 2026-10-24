import { useEffect, useState } from "react";
import { BSO_TOKEN_ADDRESS } from "@/lib/site";
import { BLOCKSCOUT_API, getJson, toBso } from "./live";

// Blockscout lists the token's transfers newest first, 50 a page. A few months of transfers fit in
// these pages; past them the committed lines are shown as they are.
const MAX_PAGES = 20;
// The lines wait for the top-up, so a slow explorer only delays them this long.
const TOP_UP_TIMEOUT_MS = 10_000;
const DAY_MS = 86_400_000;

/** [UTC day number (Unix seconds / 86,400), balance in BSO]: the balance from that day on. */
export type BalancePoint = [day: number, balance: number];

type CommittedHolderHistory = {
  generatedAt: string;
  block: number;
  wallets: Record<string, BalancePoint[]>;
};

export type HolderHistory = {
  /** By lowercase address; only major holders and the wallets of known holders have a line. */
  wallets: Map<string, BalancePoint[]>;
  /** The first and last day of every line's time axis, so lines compare across rows. */
  firstDay: number;
  lastDay: number;
};

type TransfersResponse = {
  items: {
    block_number: number;
    timestamp: string;
    from: { hash: string };
    to: { hash: string };
    total: { value: string };
  }[];
  next_page_params: Record<string, string | number> | null;
};

type Transfer = { day: number; from: string; to: string; amount: number };

/** Every BSO transfer after `block`, oldest first. */
async function fetchTransfersAfter(block: number): Promise<Transfer[]> {
  const signal = AbortSignal.timeout(TOP_UP_TIMEOUT_MS);
  const transfers: Transfer[] = [];
  let nextPageParams: TransfersResponse["next_page_params"] = null;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const query = nextPageParams
      ? `?${new URLSearchParams(Object.entries(nextPageParams).map(([key, value]) => [key, String(value)]))}`
      : "";
    const body: TransfersResponse = await getJson<TransfersResponse>(
      `${BLOCKSCOUT_API}/tokens/${BSO_TOKEN_ADDRESS}/transfers${query}`,
      signal,
    );
    for (const item of body.items) {
      if (item.block_number <= block) {
        return transfers.reverse();
      }
      transfers.push({
        day: Math.floor(Date.parse(item.timestamp) / DAY_MS),
        from: item.from.hash.toLowerCase(),
        to: item.to.hash.toLowerCase(),
        amount: toBso(item.total.value),
      });
    }
    nextPageParams = body.next_page_params;
    if (!nextPageParams) {
      return transfers.reverse();
    }
  }
  throw new Error(`More than ${MAX_PAGES} pages of BSO transfers since block ${block}`);
}

function applyTransfers(wallets: Map<string, BalancePoint[]>, transfers: Transfer[]) {
  const move = (address: string, day: number, amount: number) => {
    const series = wallets.get(address);
    const last = series?.[series.length - 1];
    if (!series || !last) {
      return;
    }
    const balance = Math.max(0, last[1] + amount);
    if (last[0] === day) {
      last[1] = balance;
    } else {
      series.push([day, balance]);
    }
  };
  for (const transfer of transfers) {
    move(transfer.from, transfer.day, -transfer.amount);
    move(transfer.to, transfer.day, transfer.amount);
  }
}

let pending: Promise<HolderHistory> | null = null;

/**
 * The committed lines (`yarn rich-list:history`), topped up from Blockscout with every BSO transfer
 * after their snapshot block. The file is its own chunk, fetched once, the first time a line is needed.
 */
function loadHolderHistory(): Promise<HolderHistory> {
  pending ??= (async () => {
    const committed = (await import("@/data/bso-holder-history.json"))
      .default as unknown as CommittedHolderHistory;
    const wallets = new Map(
      Object.entries(committed.wallets).map(([address, series]) => [
        address,
        series.map(([day, balance]): BalancePoint => [day, balance]),
      ]),
    );
    let lastDay = Math.floor(Date.now() / DAY_MS);
    try {
      applyTransfers(wallets, await fetchTransfersAfter(committed.block));
    } catch (error) {
      console.warn("Could not top up holder history from Blockscout.", error);
      // Without the top-up the lines end at the snapshot instead of claiming today's balance.
      lastDay = Math.floor(Date.parse(committed.generatedAt) / DAY_MS);
    }
    let firstDay = Number.POSITIVE_INFINITY;
    for (const series of wallets.values()) {
      firstDay = Math.min(firstDay, series[0]?.[0] ?? firstDay);
    }
    return { wallets, firstDay: Math.min(firstDay, lastDay), lastDay };
  })();
  pending.catch(() => {
    pending = null;
  });
  return pending;
}

export type HolderHistoryState =
  | { status: "loading"; history: null }
  | { status: "ready"; history: HolderHistory }
  | { status: "unavailable"; history: null };

/** Loads the balance history once `enabled` turns true, as when the table scrolls into view. */
export function useHolderHistory(enabled: boolean): HolderHistoryState {
  const [state, setState] = useState<HolderHistoryState>({ status: "loading", history: null });

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let active = true;
    loadHolderHistory().then(
      (history) => {
        if (active) {
          setState({ status: "ready", history });
        }
      },
      (error: unknown) => {
        console.warn("Could not load holder history.", error);
        if (active) {
          setState({ status: "unavailable", history: null });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [enabled]);

  return state;
}

/**
 * The combined line of several wallets, as for a holder with linked wallets, or `undefined` when
 * none of them has one.
 */
export function combinedSeries(
  history: HolderHistory,
  addresses: readonly string[],
): BalancePoint[] | undefined {
  const lines = addresses
    .map((address) => history.wallets.get(address.toLowerCase()))
    .filter((series) => series !== undefined);
  if (lines.length <= 1) {
    return lines[0];
  }

  const changes = new Map<number, number>();
  for (const series of lines) {
    let previous = 0;
    for (const [day, balance] of series) {
      changes.set(day, (changes.get(day) ?? 0) + balance - previous);
      previous = balance;
    }
  }
  let total = 0;
  return [...changes.keys()]
    .sort((a, b) => a - b)
    .map((day): BalancePoint => {
      total += changes.get(day) ?? 0;
      return [day, Math.max(0, total)];
    });
}

/** The balance on `day`: the last point at or before it, and 0 before the first. */
export function balanceOn(series: readonly BalancePoint[], day: number) {
  let balance = 0;
  for (const [pointDay, pointBalance] of series) {
    if (pointDay > day) {
      break;
    }
    balance = pointBalance;
  }
  return balance;
}
