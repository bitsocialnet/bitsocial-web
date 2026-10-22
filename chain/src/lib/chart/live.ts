import { BSO_TOKEN_ADDRESS, DEXSCREENER_PAIR_ADDRESS } from "@/lib/site";
import {
  COMMITTED_CANDLES,
  DAY_SECONDS,
  ERAS,
  HISTORY_GENERATED_AT,
  type Candle,
  mergeLiveCandles,
} from "./history";

// GeckoTerminal's public API allows cross-origin reads and needs no key, but only serves a pool's
// last 180 days; the committed history covers everything before that.
const GECKOTERMINAL_API = "https://api.geckoterminal.com/api/v2";
const MAX_CANDLES = 1000;

/** [day start in Unix seconds, open, high, low, close, volume in USD], newest first. */
type OhlcvResponse = { data: { attributes: { ohlcv_list: number[][] } } };

export type PriceHistory = {
  candles: Candle[];
  /** When the newest candle was read: the snapshot's time, or the last live refresh. */
  updatedAt: string;
};

export const COMMITTED_PRICE_HISTORY: PriceHistory = {
  candles: COMMITTED_CANDLES,
  updatedAt: HISTORY_GENERATED_AT,
};

/** The committed history topped up with the current pool's daily candles since the snapshot. */
export async function fetchLivePriceHistory(signal: AbortSignal): Promise<PriceHistory> {
  const now = Date.now();
  const today = Math.floor(now / 1000 / DAY_SECONDS) * DAY_SECONDS;
  const since = COMMITTED_CANDLES[COMMITTED_CANDLES.length - 1]?.time ?? today;
  const limit = Math.min(MAX_CANDLES, Math.ceil((today - since) / DAY_SECONDS) + 2);
  const query = new URLSearchParams({
    aggregate: "1",
    limit: String(limit),
    currency: "usd",
    token: BSO_TOKEN_ADDRESS,
  });
  const url = `${GECKOTERMINAL_API}/networks/eth/pools/${DEXSCREENER_PAIR_ADDRESS}/ohlcv/day?${query}`;
  const response = await fetch(url, { signal, headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`GeckoTerminal returned ${response.status} for ${url}`);
  }
  const body = (await response.json()) as OhlcvResponse;
  const eraIndex = ERAS.length - 1;
  // BSO is immutable, so the supply never changes after the snapshot.
  const supply = COMMITTED_CANDLES[COMMITTED_CANDLES.length - 1]?.supply ?? 0;
  const live = body.data.attributes.ohlcv_list
    .map(([time, open, high, low, close, volumeUsd]) => ({
      time,
      open,
      high,
      low,
      close,
      volumeUsd,
      eraIndex,
      supply,
    }))
    .sort((a, b) => a.time - b.time);

  return {
    candles: mergeLiveCandles(COMMITTED_CANDLES, live, today),
    updatedAt: new Date(now).toISOString(),
  };
}
