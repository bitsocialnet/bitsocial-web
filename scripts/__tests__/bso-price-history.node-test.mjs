import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
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

// Answers the generator's explorer and Coinbase requests offline: every pool traded once in its
// era and every token minted once. SHORT_POOL and the mints of SHORT_MINTS come back as
// Etherscan's empty "No records found" listing, and SHORT_PRODUCT's candles as an empty list.
const offlineApis = `
const word = (value) => BigInt(value).toString(16).padStart(64, "0");
const swap = "0x" + [10n ** 21n, 0n, 0n, 10n ** 18n].map(word).join("");
const transfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const gen1Pools = process.env.GEN1_POOLS.split(",");
globalThis.fetch = async (input) => {
  const url = new URL(input);
  const query = url.searchParams;
  let body;
  if (url.pathname.endsWith("/candles")) {
    const start = Date.parse(query.get("start")) / 1000;
    const end = Date.parse(query.get("end")) / 1000;
    body = [];
    if (!url.pathname.includes("/" + process.env.SHORT_PRODUCT + "/"))
      for (let time = end; time >= start; time -= 3600) body.push([time, 9, 11, 10, 10, 1]);
  } else {
    const pool = (query.get("topic1") ?? query.get("address")).toLowerCase();
    const supply = query.get("topic0") === transfer;
    const time = supply ? 1600000000 : gen1Pools.includes(pool) ? 1654041600 : 1735689600;
    const burns = supply && query.has("topic2");
    const shortMints = supply && !burns && query.get("address").toLowerCase() === process.env.SHORT_MINTS;
    const empty = pool === process.env.SHORT_POOL || burns || shortMints;
    const log = {
      blockNumber: String(time === 1735689600 ? 25000000 : 1000),
      logIndex: "0",
      timeStamp: String(time),
      transactionHash: pool,
      data: supply ? "0x" + word(10n ** 24n) : swap,
    };
    body = empty
      ? { status: "0", message: "No records found", result: [] }
      : { status: "1", message: "OK", result: [log] };
  }
  return new Response(JSON.stringify(body));
};
`;

const GEN1_TOKEN = "0x625fc9bb971bb305a2ad63252665dcfe9098bee9";

for (const [gap, short] of [
  ["a retired pool listed empty", { SHORT_POOL: "0x0f7a712e9f2d25160a7dc0c24324036c47ea951b" }],
  ["a settled rate window returned empty", { SHORT_PRODUCT: "AVAX-USD" }],
  ["a retired mint listing returned empty", { SHORT_MINTS: GEN1_TOKEN }],
]) {
  test(`${gap} is not cached, so the next run recovers`, async (t) => {
    const fixture = await mkdtemp(path.join(os.tmpdir(), "bitsocial-price-history-"));
    t.after(() => rm(fixture, { recursive: true, force: true }));
    await mkdir(path.join(fixture, "scripts"), { recursive: true });
    await mkdir(path.join(fixture, "chain/src/lib/rich-list"), { recursive: true });
    await cp(
      path.join(repoRoot, "scripts/generate-bso-price-history.mjs"),
      path.join(fixture, "scripts/generate-bso-price-history.mjs"),
    );
    for (const file of ["chain/src/lib/site.ts", "chain/src/lib/rich-list/data.ts"]) {
      await cp(path.join(repoRoot, file), path.join(fixture, file));
    }
    await writeFile(path.join(fixture, "offline-apis.mjs"), offlineApis);
    const run = (env) =>
      spawnSync(
        process.execPath,
        [
          "--import",
          path.join(fixture, "offline-apis.mjs"),
          path.join(fixture, "scripts/generate-bso-price-history.mjs"),
        ],
        {
          encoding: "utf8",
          env: {
            ...process.env,
            GEN1_POOLS:
              "0x0f7a712e9f2d25160a7dc0c24324036c47ea951b,0xdc63069d6f920c6300065ac28acd05b1f7b3b0c1",
            ...env,
          },
          timeout: 30_000,
        },
      );

    // A brief upstream gap fails the run...
    assert.equal(run(short).status, 1);
    // ...and once the data is back, the next run builds the history.
    const recovered = run({});
    assert.equal(recovered.status, 0, recovered.stderr);
    const history = JSON.parse(
      await readFile(path.join(fixture, "chain/src/data/bso-price-history.json"), "utf8"),
    );
    assert.equal(history.eras[0].start, 1654041600);
    // Candles are [time, open, high, low, close, volume, era index, supply]; Gen 1 minted.
    const gen1 = history.candles.filter((entry) => entry[6] === 0);
    assert.ok(gen1.length > 0);
    assert.ok(
      gen1.every((entry) => entry[7] > 0),
      "Gen 1 candles lost their supply",
    );
  });
}
