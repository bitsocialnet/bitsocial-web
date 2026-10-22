import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const DAY = 86_400;

async function importChainModule(file) {
  const { outputFiles } = await build({
    entryPoints: [path.join(repoRoot, file)],
    alias: { "@": path.join(repoRoot, "chain/src") },
    bundle: true,
    write: false,
    platform: "node",
    format: "esm",
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString("base64")}`
  );
}

const { COMMITTED_CANDLES, ERAS, mergeLiveCandles } = await importChainModule(
  "chain/src/lib/chart/history.ts",
);

function candle(time, close, extra = {}) {
  return {
    time,
    open: close,
    high: close,
    low: close,
    close,
    volumeUsd: 10,
    eraIndex: 2,
    supply: 210_000_000,
    ...extra,
  };
}

test("live candles replace the partial last day, and quiet days repeat the last close", () => {
  const start = 1_800_000_000 - (1_800_000_000 % DAY);
  const committed = [candle(start, 1), candle(start + DAY, 2, { volumeUsd: 3 })];
  const live = [
    candle(start + DAY, 2.5, { high: 3, volumeUsd: 40 }),
    candle(start + 3 * DAY, 4, { volumeUsd: 50 }),
  ];

  const merged = mergeLiveCandles(committed, live, start + 4 * DAY);

  assert.deepEqual(
    merged.map(({ time }) => (time - start) / DAY),
    [0, 1, 2, 3, 4],
  );
  assert.equal(merged[1].close, 2.5);
  assert.equal(merged[1].high, 3);
  assert.deepEqual(merged[2], { ...candle(start + 2 * DAY, 2.5), volumeUsd: 0 });
  assert.equal(merged[3].close, 4);
  assert.deepEqual(merged[4], { ...candle(start + 4 * DAY, 4), volumeUsd: 0 });
  assert.equal(mergeLiveCandles(committed, [], start + 4 * DAY), committed);
});

test("the live refresh tops up the committed history from the current pool", async (t) => {
  const { fetchLivePriceHistory } = await importChainModule("chain/src/lib/chart/live.ts");
  const last = COMMITTED_CANDLES[COMMITTED_CANDLES.length - 1];
  t.mock.method(Date, "now", () => (last.time + 2 * DAY + 3600) * 1000);
  let requestedUrl = "";
  t.mock.method(globalThis, "fetch", async (url) => {
    requestedUrl = String(url);
    // GeckoTerminal lists days with trades only, newest first.
    const ohlcv = [
      [last.time + 2 * DAY, 0.02, 0.03, 0.02, 0.025, 99],
      [last.time, 0.01, 0.012, 0.009, 0.011, 77],
    ];
    return new Response(JSON.stringify({ data: { attributes: { ohlcv_list: ohlcv } } }));
  });

  const history = await fetchLivePriceHistory(new AbortController().signal);
  const tail = history.candles.slice(-3);

  assert.match(requestedUrl, /\/pools\/0xae8d1a28c8fa6b71c4099ede2d7924672dc51e32\/ohlcv\/day\?/);
  assert.match(requestedUrl, /token=0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A/);
  assert.equal(history.candles.length, COMMITTED_CANDLES.length + 2);
  assert.deepEqual(
    tail.map(({ close, volumeUsd }) => [close, volumeUsd]),
    [
      [0.011, 77],
      [0.011, 0],
      [0.025, 99],
    ],
  );
  for (const entry of tail) {
    assert.equal(entry.eraIndex, ERAS.length - 1);
    assert.equal(entry.supply, last.supply);
  }
});

test("the committed history is one evenly spaced daily series across all three contracts", () => {
  assert.deepEqual(
    ERAS.map((era) => era.id),
    ["gen1", "gen2", "gen3"],
  );
  COMMITTED_CANDLES.forEach((entry, index) => {
    if (index > 0) {
      assert.equal(entry.time - COMMITTED_CANDLES[index - 1].time, DAY);
      assert.ok(entry.eraIndex >= COMMITTED_CANDLES[index - 1].eraIndex);
    }
    assert.ok(entry.low > 0 && entry.low <= entry.open && entry.open <= entry.high);
    assert.ok(entry.low <= entry.close && entry.close <= entry.high);
    assert.ok(entry.supply > 0);
  });
  assert.equal(COMMITTED_CANDLES[COMMITTED_CANDLES.length - 1].supply, 210_000_000);
});
