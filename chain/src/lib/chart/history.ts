import committedHistory from "@/data/bso-price-history.json";
import { REBRAND_DATE, type Chain } from "@/lib/rich-list/data";

export const DAY_SECONDS = 86_400;

/** The three contracts, oldest first. Their order is the era index each candle carries. */
export type EraId = "gen1" | "gen2" | "gen3";

export type Era = {
  id: EraId;
  chain: Chain;
  token: string;
  /** Unix seconds of the era's first trade. */
  start: number;
  pools: { dex: string; kind: "v2" | "v3" | "v4"; address: string }[];
};

/** One UTC day, in USD per BSO. Earlier eras are already converted at PLEB_PER_BSO. */
export type Candle = {
  /** Unix seconds at 00:00 UTC. */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumeUsd: number;
  eraIndex: number;
  /** The era token's total supply in BSO at the end of the day; price times this is market cap. */
  supply: number;
};

type CommittedHistory = {
  generatedAt: string;
  plebPerBso: number;
  rebase: { block: number; tx: string };
  eras: Era[];
  tradeCount: number;
  candles: [number, number, number, number, number, number, number, number][];
};

// JSON imports type arrays loosely; the generator writes exactly this shape.
const history = committedHistory as unknown as CommittedHistory;

export const ERAS = history.eras;

/**
 * The day plebbit became Bitsocial. The second contract kept trading as PLEB until the upgrade that
 * rebased it on May 2, 2026, so the chart marks the rebrand inside that contract's era.
 */
export const REBRAND_DAY = Date.parse(`${REBRAND_DATE}T00:00:00Z`) / 1000;
export const REBASE_TX = history.rebase.tx;
export const HISTORY_GENERATED_AT = history.generatedAt;
export const HISTORY_TRADE_COUNT = history.tradeCount;

/** The daily candles committed with the site (`yarn chart:snapshot`): first paint and fallback. */
export const COMMITTED_CANDLES: Candle[] = history.candles.map(
  ([time, open, high, low, close, volumeUsd, eraIndex, supply]) => ({
    time,
    open,
    high,
    low,
    close,
    volumeUsd,
    eraIndex,
    supply,
  }),
);

function flatCandle(previous: Candle, time: number): Candle {
  const { close, eraIndex, supply } = previous;
  return { time, open: close, high: close, low: close, close, volumeUsd: 0, eraIndex, supply };
}

/**
 * Appends live daily candles of the current pool to the committed history. The committed last day
 * is usually partial, so a live candle for it wins; days without trades repeat the last close, as
 * in the committed file, and the series runs to `today`.
 */
export function mergeLiveCandles(committed: Candle[], live: Candle[], today: number): Candle[] {
  const last = committed[committed.length - 1];
  if (!last || live.length === 0) {
    return committed;
  }

  const liveByTime = new Map(
    live.filter((candle) => candle.time >= last.time).map((candle) => [candle.time, candle]),
  );
  const end = Math.max(today, ...liveByTime.keys(), last.time);
  const merged = committed.slice(0, -1);
  let previous = last;
  for (let time = last.time; time <= end; time += DAY_SECONDS) {
    const candle = liveByTime.get(time) ?? (time === last.time ? last : flatCandle(previous, time));
    merged.push(candle);
    previous = candle;
  }
  return merged;
}
