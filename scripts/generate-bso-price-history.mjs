#!/usr/bin/env node
// Rebuilds BSO's daily price history, from its first trade on Avalanche in 2022 to today, into
// chain/src/data/bso-price-history.json for the chart at chain.bitsocial.net/chart/. Every candle
// comes from the swap events of the DEX pools of the token's three contracts, priced in USD with
// Coinbase's hourly AVAX and ETH rates, and carries that day's total supply, rebuilt from the
// contract's mints and burns, for the market cap view. The page paints from this file, then tops
// it up with the current pool's recent candles from GeckoTerminal.
//
// Free price APIs only serve the last 180 days of an old pool, so the logs are the only free source
// for the whole history. Logs of the two retired contracts never change, so they are cached under
// node_modules/.cache and later runs only refetch the current pool.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "chain/src/data/bso-price-history.json");
const cacheDir = path.join(repoRoot, "node_modules/.cache/bso-price-history");

const ROUTESCAN_API = "https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api";
const BLOCKSCOUT_API = "https://eth.blockscout.com/api";
const COINBASE_API = "https://api.exchange.coinbase.com";

const SWAP_V2 = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822";
const SWAP_V3 = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67";
const SWAP_V4 = "0x40e9cecb9f5f1f1c5b9c97dec2917b7ee92e57ba5563708daca94dd84ad7112f";
const TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const ZERO_TOPIC = `0x${"0".repeat(64)}`;
const UNISWAP_V4_POOL_MANAGER = "0x000000000004444c5dc75cb358380d2e3de08a90";
const WAVAX = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

/** Both migrations kept this ratio: 7,114.596 PLEB became 1 BSO. Mirrors PLEB_PER_BSO. */
const PLEB_PER_BSO = 7114.596;

// The second contract's upgrade to TokenV3, which paused transfers while every balance was rebased
// to the 210M supply; trading resumed in new units after the TokenV4 upgrade at block 25006855.
// Swaps before this block are in old units and are converted like PLEB. The rebase rewrote
// balances without mint or burn events, so the supply after it is the fixed 210M.
const REBASE = {
  block: 25006134,
  time: Date.parse("2026-05-02T08:38:11Z") / 1000,
  tx: "0x477db0f371952fd2d33a296d4b3f35ad92a6ed78ae00bfacca2dda612a9cbf78",
};
const FINAL_SUPPLY = 210_000_000;

// Trades worth less than this still count toward volume, but they are too small to set a price.
const DUST_USD = 0.01;
const DAY = 86_400;
const HOUR = 3_600;

async function readAddress(file, name) {
  const source = await readFile(path.join(repoRoot, file), "utf8");
  const match = source.match(new RegExp(`${name} = "(0x[0-9a-fA-F]{40})"`));
  if (!match) {
    throw new Error(`${name} not found in ${file}`);
  }
  return match[1].toLowerCase();
}

// Every token involved has 18 decimals, so a swap's raw amounts divide straight into a price.
// `oldUnitsBeforeBlock` marks swaps whose amounts are in pre-rebase units, converted at
// PLEB_PER_BSO: all of Gen 1, and Gen 2 until the rebase. `fixedSupplyFrom` is the time from which
// the supply is the final 210M.
async function readEras() {
  const gen1 = await readAddress("chain/src/lib/rich-list/data.ts", "GEN1_TOKEN_ADDRESS");
  const gen2 = await readAddress("chain/src/lib/rich-list/data.ts", "GEN2_TOKEN_ADDRESS");
  const bso = await readAddress("chain/src/lib/site.ts", "BSO_TOKEN_ADDRESS");
  const pair = await readAddress("chain/src/lib/site.ts", "DEXSCREENER_PAIR_ADDRESS");

  return [
    {
      id: "gen1",
      chain: "avalanche",
      token: gen1,
      oldUnitsBeforeBlock: Number.POSITIVE_INFINITY,
      fixedSupplyFrom: Number.POSITIVE_INFINITY,
      quote: "AVAX-USD",
      pools: [
        { dex: "Pangolin", kind: "v2", address: "0x0f7a712e9f2d25160a7dc0c24324036c47ea951b" },
        { dex: "Trader Joe", kind: "v2", address: "0xdc63069d6f920c6300065ac28acd05b1f7b3b0c1" },
      ].map((pool) => ({ ...pool, tokenIsToken0: gen1 < WAVAX })),
    },
    {
      id: "gen2",
      chain: "ethereum",
      token: gen2,
      oldUnitsBeforeBlock: REBASE.block,
      fixedSupplyFrom: REBASE.time,
      quote: "ETH-USD",
      pools: [
        { dex: "Uniswap v2", kind: "v2", address: "0xbc628f41b8f791f8527fbc6563fbb0d786b33c84" },
        { dex: "Uniswap v3", kind: "v3", address: "0xc498d51238804126cdb8562d124b86444e97ca27" },
        {
          dex: "Uniswap v4",
          kind: "v4",
          address: "0xfc41bcc8306fc231bc0bddeb70cbe91bc53fe35804a030f2173f6b146ea1b256",
        },
      ].map((pool) => ({
        ...pool,
        // A v4 pool trades native ETH, address zero, which always sorts first.
        tokenIsToken0: pool.kind === "v4" ? false : gen2 < WETH,
      })),
    },
    {
      id: "gen3",
      chain: "ethereum",
      token: bso,
      oldUnitsBeforeBlock: 0,
      fixedSupplyFrom: 0,
      quote: "ETH-USD",
      pools: [{ dex: "Uniswap v2", kind: "v2", address: pair, tokenIsToken0: bso < WETH }],
    },
  ];
}

// Blockscout's 429 says in x-ratelimit-reset how many milliseconds remain, which can be many
// minutes after a burst of requests; waiting it out beats failing a long run.
const MAX_RATE_LIMIT_WAIT_MS = 30 * 60 * 1000;

async function getJson(url) {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "bitsocial-web price history" },
    });
    if (response.ok) {
      return response.json();
    }
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`GET ${url} failed with ${response.status}`);
    }
    const reset = Number(response.headers.get("x-ratelimit-reset"));
    const wait =
      response.status === 429 && reset > 0
        ? Math.min(reset + 1000, MAX_RATE_LIMIT_WAIT_MS)
        : attempt * 2000;
    if (wait > 10_000) {
      console.log(`${new URL(url).host} is rate limiting; retrying in ${Math.round(wait / 1000)}s`);
    }
    await sleep(wait);
  }
  throw new Error(`GET ${url} kept failing after retries`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cached(key, enabled, load) {
  const file = path.join(cacheDir, `${key}.json`);
  if (enabled) {
    try {
      return JSON.parse(await readFile(file, "utf8"));
    } catch {
      // Not cached yet.
    }
  }
  const value = await load();
  if (enabled) {
    await mkdir(cacheDir, { recursive: true });
    await writeFile(file, JSON.stringify(value));
  }
  return value;
}

// Both explorers speak Etherscan's getLogs and return at most 1,000 logs per call, so the next page
// starts at the last block seen, and logs already collected from that block are skipped.
async function fetchLogs(chain, params, label) {
  const api = chain === "avalanche" ? ROUTESCAN_API : BLOCKSCOUT_API;
  const logs = new Map();
  let fromBlock = 0;
  for (;;) {
    const query = new URLSearchParams({
      module: "logs",
      action: "getLogs",
      ...params,
      fromBlock: String(fromBlock),
      toBlock: chain === "avalanche" ? "999999999" : "latest",
      page: "1",
      offset: "1000",
    });
    const response = await getJson(`${api}?${query}`);
    const page = Array.isArray(response.result) ? response.result : [];
    if (response.status !== "1" && page.length === 0 && response.message !== "No records found") {
      throw new Error(`getLogs for ${label} failed: ${response.message}`);
    }

    const before = logs.size;
    for (const log of page) {
      logs.set(`${log.transactionHash}:${Number(log.logIndex)}`, {
        block: Number(log.blockNumber),
        logIndex: Number(log.logIndex),
        time: Number(log.timeStamp),
        data: log.data,
      });
    }
    console.log(`${label}: ${logs.size}`);
    if (page.length < 1000) {
      break;
    }
    if (logs.size === before) {
      throw new Error(`getLogs for ${label} stopped advancing at block ${fromBlock}`);
    }
    fromBlock = Number(page.at(-1).blockNumber);
    await sleep(400);
  }

  return [...logs.values()].sort((a, b) => a.block - b.block || a.logIndex - b.logIndex);
}

function fetchPoolLogs(era, pool) {
  const params =
    pool.kind === "v4"
      ? {
          address: UNISWAP_V4_POOL_MANAGER,
          topic0: SWAP_V4,
          topic1: pool.address,
          topic0_1_opr: "and",
        }
      : { address: pool.address, topic0: pool.kind === "v3" ? SWAP_V3 : SWAP_V2 };
  return fetchLogs(era.chain, params, `${era.id} ${pool.dex} swaps`);
}

// Mints are transfers from the zero address and burns are transfers to it.
async function fetchSupplyChanges(era) {
  const transfer = { address: era.token, topic0: TRANSFER };
  const mints = await fetchLogs(
    era.chain,
    { ...transfer, topic1: ZERO_TOPIC, topic0_1_opr: "and" },
    `${era.id} mints`,
  );
  const burns = await fetchLogs(
    era.chain,
    { ...transfer, topic2: ZERO_TOPIC, topic0_2_opr: "and" },
    `${era.id} burns`,
  );
  return [
    ...mints.map((log) => ({ ...log, sign: 1 })),
    ...burns.map((log) => ({ ...log, sign: -1 })),
  ].sort((a, b) => a.block - b.block || a.logIndex - b.logIndex);
}

/**
 * A function from a Unix time to the era token's total supply in BSO units at that moment. Gen 3
 * minted all 210M at once and Gen 2 was rebased to it; before that, the supply is every mint minus
 * every burn so far, converted from PLEB.
 */
function supplyTimeline(era, changes) {
  if (era.fixedSupplyFrom === 0) {
    return () => FINAL_SUPPLY;
  }
  let total = 0;
  const steps = changes.map((change) => {
    total += (change.sign * Number(BigInt(change.data))) / 1e18 / PLEB_PER_BSO;
    return { time: change.time, total };
  });
  return (time) => {
    if (time >= era.fixedSupplyFrom) {
      return FINAL_SUPPLY;
    }
    let supply = 0;
    for (const step of steps) {
      if (step.time >= time) {
        break;
      }
      supply = step.total;
    }
    return supply;
  };
}

function words(data) {
  const hex = data.slice(2);
  return Array.from({ length: hex.length / 64 }, (_, index) =>
    BigInt(`0x${hex.slice(index * 64, index * 64 + 64)}`),
  );
}

function abs(value) {
  return value < 0n ? -value : value;
}

// The token and quote amounts a swap moved. Signs differ between versions, but a price only needs
// the sizes.
function swapAmounts(pool, log) {
  const values = words(log.data);
  let amount0;
  let amount1;
  if (pool.kind === "v2") {
    const [in0, in1, out0, out1] = values;
    amount0 = abs(in0 - out0);
    amount1 = abs(in1 - out1);
  } else {
    // v3 and v4 log signed amounts, sign-extended to 32 bytes.
    const signed = (value) => BigInt.asIntN(256, value);
    amount0 = abs(signed(values[0]));
    amount1 = abs(signed(values[1]));
  }
  return pool.tokenIsToken0
    ? { token: amount0, quote: amount1 }
    : { token: amount1, quote: amount0 };
}

// Coinbase returns at most 300 candles per call, newest first: [time, low, high, open, close, volume].
async function fetchHourlyRates(product, fromTime, toTime) {
  const rates = new Map();
  const step = 300 * HOUR;
  const start = Math.floor(fromTime / HOUR) * HOUR;
  const now = Math.floor(Date.now() / 1000);
  for (let windowStart = start; windowStart <= toTime; windowStart += step) {
    const windowEnd = Math.min(windowStart + step - HOUR, Math.ceil(toTime / HOUR) * HOUR);
    const settled = windowEnd < now - DAY;
    const candles = await cached(`${product}-${windowStart}-${windowEnd}`, settled, async () => {
      const query = new URLSearchParams({
        granularity: String(HOUR),
        start: new Date(windowStart * 1000).toISOString(),
        end: new Date(windowEnd * 1000).toISOString(),
      });
      const result = await getJson(`${COINBASE_API}/products/${product}/candles?${query}`);
      await sleep(250);
      return result;
    });
    for (const [time, , , , close] of candles) {
      rates.set(time, close);
    }
  }
  console.log(`${product}: ${rates.size} hourly rates`);
  return rates;
}

// A trade uses the close of the hour it happened in, or of the last hour Coinbase traded before it.
function rateAt(rates, time) {
  for (let hour = Math.floor(time / HOUR) * HOUR, tries = 0; tries < 48; hour -= HOUR, tries += 1) {
    const rate = rates.get(hour);
    if (rate !== undefined) {
      return rate;
    }
  }
  throw new Error(`No USD rate within two days before ${new Date(time * 1000).toISOString()}`);
}

function round(value, digits) {
  return Number(value.toPrecision(digits));
}

// The repo formatter's layout: objects expanded and one candle per line, so a refresh diffs by day.
function formatHistory(history) {
  const { candles, ...rest } = history;
  const head = JSON.stringify({ ...rest, candles: [] }, null, 2);
  const rows = candles.map((candle) => `    ${JSON.stringify(candle).replaceAll(",", ", ")}`);
  return `${head.replace('"candles": []', `"candles": [\n${rows.join(",\n")}\n  ]`)}\n`;
}

async function main() {
  const generatedAt = new Date();
  const eras = await readEras();

  const logsByPool = [];
  const supplyAt = [];
  for (const [eraIndex, era] of eras.entries()) {
    const retired = eraIndex < eras.length - 1;
    for (const pool of era.pools) {
      const logs = await cached(`logs-${pool.address}`, retired, () => fetchPoolLogs(era, pool));
      logsByPool.push({ eraIndex, era, pool, logs });
    }
    const changes =
      era.fixedSupplyFrom === 0
        ? []
        : await cached(`supply-${era.token}`, retired, () => fetchSupplyChanges(era));
    supplyAt.push(supplyTimeline(era, changes));
  }

  // Each contract's era starts with its first trade and ends where the next contract's begins, so
  // stray trades in a retired pool after a migration never set the price.
  const eraStarts = eras.map((_, eraIndex) =>
    Math.min(
      ...logsByPool
        .filter((entry) => entry.eraIndex === eraIndex)
        .map((entry) => entry.logs[0].time),
    ),
  );

  const rates = new Map();
  for (const product of new Set(eras.map((era) => era.quote))) {
    const times = logsByPool
      .filter((entry) => entry.era.quote === product)
      .flatMap((entry) => [entry.logs[0].time, entry.logs.at(-1).time]);
    rates.set(product, await fetchHourlyRates(product, Math.min(...times), Math.max(...times)));
  }

  const trades = [];
  for (const { eraIndex, era, pool, logs } of logsByPool) {
    const eraEnd = eraStarts[eraIndex + 1] ?? Number.POSITIVE_INFINITY;
    for (const log of logs) {
      if (log.time >= eraEnd) {
        continue;
      }
      const { token, quote } = swapAmounts(pool, log);
      if (token === 0n || quote === 0n) {
        continue;
      }
      const quoteUsd = rateAt(rates.get(era.quote), log.time);
      const quoteAmount = Number(quote) / 1e18;
      const units = log.block < era.oldUnitsBeforeBlock ? PLEB_PER_BSO : 1;
      const priceUsd = (Number(quote) / Number(token)) * quoteUsd * units;
      trades.push({
        time: log.time,
        block: log.block,
        logIndex: log.logIndex,
        eraIndex,
        pool: pool.address,
        priceUsd,
        volumeUsd: quoteAmount * quoteUsd,
      });
    }
  }
  trades.sort((a, b) => a.time - b.time || a.block - b.block || a.logIndex - b.logIndex);

  const days = new Map();
  for (const trade of trades) {
    const day = Math.floor(trade.time / DAY) * DAY;
    if (!days.has(day)) {
      days.set(day, []);
    }
    days.get(day).push(trade);
  }

  // When several pools traded on the same day, the busiest one sets the candle, so a thin pool's
  // stale quote never draws a wick. Volume counts every pool.
  const candles = [];
  let previous = null;
  const firstDay = Math.min(...days.keys());
  // The history runs to the snapshot's own day, so a quiet stretch before it still reaches it.
  const lastDay = Math.max(...days.keys(), Math.floor(generatedAt.getTime() / 1000 / DAY) * DAY);
  for (let day = firstDay; day <= lastDay; day += DAY) {
    const dayTrades = days.get(day) ?? [];
    const volumeByPool = new Map();
    for (const trade of dayTrades) {
      volumeByPool.set(trade.pool, (volumeByPool.get(trade.pool) ?? 0) + trade.volumeUsd);
    }
    const busiestPool = [...volumeByPool.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const priced = dayTrades.filter(
      (trade) => trade.pool === busiestPool && trade.volumeUsd >= DUST_USD,
    );
    const volume = dayTrades.reduce((sum, trade) => sum + trade.volumeUsd, 0);

    let candle;
    if (priced.length > 0) {
      const prices = priced.map((trade) => trade.priceUsd);
      candle = {
        time: day,
        open: prices[0],
        high: Math.max(...prices),
        low: Math.min(...prices),
        close: prices.at(-1),
        volume,
        eraIndex: priced[0].eraIndex,
      };
    } else if (previous) {
      // Days without a priced trade hold the last close, so the time axis stays evenly spaced.
      candle = {
        ...previous,
        time: day,
        open: previous.close,
        high: previous.close,
        low: previous.close,
        volume,
      };
    } else {
      continue;
    }
    candle.supply = supplyAt[candle.eraIndex](day + DAY);
    candles.push(candle);
    previous = candle;
  }

  const history = {
    generatedAt: generatedAt.toISOString(),
    sources: {
      avalanche: ROUTESCAN_API,
      ethereum: BLOCKSCOUT_API,
      usd: `${COINBASE_API}/products/{AVAX-USD,ETH-USD}/candles`,
    },
    plebPerBso: PLEB_PER_BSO,
    rebase: REBASE,
    eras: eras.map((era, eraIndex) => ({
      id: era.id,
      chain: era.chain,
      token: era.token,
      start: eraStarts[eraIndex],
      pools: era.pools.map(({ dex, kind, address }) => ({ dex, kind, address })),
    })),
    tradeCount: trades.length,
    // [day start (UTC seconds), open, high, low, close, volume in USD, era index, total supply in
    // BSO at the end of the day]
    candles: candles.map((candle) => [
      candle.time,
      round(candle.open, 6),
      round(candle.high, 6),
      round(candle.low, 6),
      round(candle.close, 6),
      Math.round(candle.volume * 100) / 100,
      candle.eraIndex,
      Math.round(candle.supply),
    ]),
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, formatHistory(history));
  console.log(
    `Wrote ${candles.length} daily candles from ${trades.length} trades to ${path.relative(repoRoot, outputPath)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
