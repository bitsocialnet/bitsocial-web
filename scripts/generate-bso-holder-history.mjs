#!/usr/bin/env node
// Rebuilds the daily BSO balance of every major holder, from the first PLEB on Avalanche in 2022 to
// today, into chain/src/data/bso-holder-history.json for the trend lines of the rich list at
// chain.bitsocial.net/rich-list/. Every balance is replayed from the Transfer events of the token's
// three contracts. Each migration re-issued every balance to the same address, so a holder's line
// follows one contract until the next one starts trading, and amounts before the May 2026 rebase are
// converted from PLEB. The page loads this file only when the table comes into view, then tops it
// up with the current contract's transfers since the snapshot block.
//
// Logs of the two retired contracts never change, so they are cached under node_modules/.cache and
// later runs only refetch the current contract.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "chain/src/data/bso-holder-history.json");
const priceHistoryPath = path.join(repoRoot, "chain/src/data/bso-price-history.json");
const cacheDir = path.join(repoRoot, "node_modules/.cache/bso-holder-history");

// Avalanche logs come from Routescan's Etherscan-style API. Ethereum transfers come from
// Blockscout's v2 API, the page's own live source: Routescan's Ethereum index misses more of the
// second contract's transfers than Blockscout's does, and Blockscout's getLogs allows only ten calls
// an hour.
const ROUTESCAN_API = "https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api";
const BLOCKSCOUT_API = "https://eth.blockscout.com/api/v2";

const TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const DAY = 86_400;
const HEAD_MARGIN_BLOCKS = 100;

// The block where the second contract's rebase logged a burn of old minus new balance for every
// holder (Transfer to the zero address), after the upgrade at the price history's rebase block.
const REBASE_BURN_BLOCK = 25_006_752;

/** Both migrations kept this ratio: 7,114.596 PLEB became 1 BSO. Mirrors PLEB_PER_BSO. */
const PLEB_PER_BSO = 7114.596;

// A wallet holding at least this much at the snapshot gets a line; every wallet of a known holder
// gets one too, so a group's line adds up all of its wallets. 0.01% of the 210M supply.
const MIN_BALANCE = 21_000;

async function readAddresses(file, pattern) {
  const source = await readFile(path.join(repoRoot, file), "utf8");
  return [...source.matchAll(pattern)].map((match) => match[1].toLowerCase());
}

// Blockscout's 429 says in x-ratelimit-reset how many milliseconds remain, which can be many
// minutes after a burst of requests; waiting it out beats failing a long run.
const MAX_RATE_LIMIT_WAIT_MS = 30 * 60 * 1000;

async function getJson(url) {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "bitsocial-web holder history" },
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

// getLogs returns at most 1,000 logs per call, and Routescan leaves logIndex empty, so logs cannot
// be told apart by position: the next page restarts at the last block seen and replaces every log
// already collected from that block. A single block never holds 1,000 transfers of this token.
async function fetchAvalancheTransfers(token, label) {
  const transfers = [];
  let fromBlock = 0;
  for (;;) {
    const query = new URLSearchParams({
      module: "logs",
      action: "getLogs",
      address: token,
      topic0: TRANSFER,
      fromBlock: String(fromBlock),
      toBlock: "999999999",
      page: "1",
      offset: "1000",
    });
    const response = await getJson(`${ROUTESCAN_API}?${query}`);
    const page = Array.isArray(response.result) ? response.result : [];
    if (response.status !== "1" && page.length === 0 && response.message !== "No records found") {
      throw new Error(`getLogs for ${label} failed: ${response.message}`);
    }

    while (transfers.length > 0 && transfers.at(-1).block >= fromBlock) {
      transfers.pop();
    }
    for (const log of page) {
      transfers.push({
        block: Number(log.blockNumber),
        time: Number(log.timeStamp),
        from: `0x${log.topics[1].slice(26)}`,
        to: `0x${log.topics[2].slice(26)}`,
        value: log.data === "0x" ? "0" : BigInt(log.data).toString(),
      });
    }
    console.log(`${label}: ${transfers.length}`);
    if (page.length < 1000) {
      break;
    }
    const lastBlock = Number(page.at(-1).blockNumber);
    if (lastBlock === fromBlock) {
      throw new Error(`getLogs for ${label} stopped advancing at block ${fromBlock}`);
    }
    fromBlock = lastBlock;
    await sleep(400);
  }
  return transfers;
}

// Blockscout lists a token's transfers newest first, 50 a page, so they are reversed into chain
// order. Transfers after `toBlock` are left for the page's top-up.
async function fetchEthereumTransfers(token, toBlock, label) {
  const transfers = [];
  let nextPageParams = null;
  do {
    const query = nextPageParams ? `?${new URLSearchParams(nextPageParams)}` : "";
    const page = await getJson(`${BLOCKSCOUT_API}/tokens/${token}/transfers${query}`);
    for (const item of page.items) {
      if (item.block_number <= toBlock) {
        transfers.push({
          block: item.block_number,
          logIndex: item.log_index,
          time: Date.parse(item.timestamp) / 1000,
          from: item.from.hash.toLowerCase(),
          to: item.to.hash.toLowerCase(),
          value: item.total.value,
        });
      }
    }
    nextPageParams = page.next_page_params;
    if (transfers.length % 1000 < 50) {
      console.log(`${label}: ${transfers.length}`);
    }
    await sleep(250);
  } while (nextPageParams);
  console.log(`${label}: ${transfers.length}`);
  return transfers.sort((a, b) => a.block - b.block || a.logIndex - b.logIndex);
}

/**
 * Replays an era's transfers into each address's balance at the end of every day it changed, in
 * BSO. Balances before `oldUnitsBeforeBlock` are PLEB: all of Gen 1, and Gen 2 until its rebase.
 * Transfers replay in raw units because the rebase logged each holder's cut as a burn of old minus
 * new balance, which leaves every replayed balance in BSO from that block on.
 */
function replay(transfers, oldUnitsBeforeBlock) {
  const raw = new Map();
  const balances = new Map();
  const closes = new Map();
  const negative = new Set();
  const move = (address, block, day, amount) => {
    const next = (raw.get(address) ?? 0) + amount;
    raw.set(address, next);
    if (next < -1 && BigInt(address) !== 0n) {
      negative.add(address);
    }
    const balance = next / (block < oldUnitsBeforeBlock ? PLEB_PER_BSO : 1);
    balances.set(address, balance);
    if (!closes.has(address)) {
      closes.set(address, new Map());
    }
    closes.get(address).set(day, balance);
  };
  for (const transfer of transfers) {
    const amount = Number(BigInt(transfer.value)) / 1e18;
    const day = Math.floor(transfer.time / DAY);
    move(transfer.from, transfer.block, day, -amount);
    move(transfer.to, transfer.block, day, amount);
  }
  return { balances, closes, negative };
}

/**
 * One wallet's line: [UTC day number, whole BSO] on the first day it held any and on every day its
 * balance changed after that. Each era's balances take over on the day its contract first traded;
 * the re-issue before that day is folded into it, so no line drops to zero between two contracts.
 */
function walletSeries(address, eras) {
  const points = [];
  for (const [index, era] of eras.entries()) {
    const endDay = eras[index + 1]?.startDay ?? Number.POSITIVE_INFINITY;
    let carried = 0;
    const changes = [];
    for (const [day, balance] of era.replay.closes.get(address) ?? []) {
      if (day <= era.startDay) {
        carried = balance;
      } else if (day < endDay) {
        changes.push([day, balance]);
      }
    }
    points.push([era.startDay, carried], ...changes);
  }

  const series = [];
  for (const [day, balance] of points) {
    const rounded = Math.max(0, Math.round(balance));
    const last = series.at(-1);
    if (last ? last[1] !== rounded : rounded > 0) {
      series.push([day, rounded]);
    }
  }
  return series;
}

// The repo formatter's layout: objects expanded, one point per line, and a single point inline.
function formatHistory(history) {
  const { wallets, ...rest } = history;
  const head = JSON.stringify({ ...rest, wallets: {} }, null, 2);
  const rows = Object.entries(wallets).map(([address, series]) => {
    const points = series.map((point) => JSON.stringify(point).replace(",", ", "));
    const value =
      points.length === 1 ? `[${points[0]}]` : `[\n      ${points.join(",\n      ")}\n    ]`;
    return `    ${JSON.stringify(address)}: ${value}`;
  });
  return `${head.replace('"wallets": {}', `"wallets": {\n${rows.join(",\n")}\n  }`)}\n`;
}

async function main() {
  const generatedAt = new Date();
  const priceHistory = JSON.parse(await readFile(priceHistoryPath, "utf8"));
  const entityAddresses = await readAddresses(
    "chain/src/lib/rich-list/data.ts",
    /address: "(0x[0-9a-fA-F]{40})"/g,
  );
  const [poolAddress] = await readAddresses(
    "chain/src/lib/site.ts",
    /DEXSCREENER_PAIR_ADDRESS = "(0x[0-9a-fA-F]{40})"/g,
  );

  // A margin behind the head, so every block up to the snapshot block is surely indexed and the
  // page's top-up after it misses nothing.
  const latest = await getJson(`${BLOCKSCOUT_API}/blocks?type=block`);
  const block = latest.items[0].height - HEAD_MARGIN_BLOCKS;
  console.log(`Replaying Ethereum up to block ${block}`);

  const eras = [];
  for (const [index, era] of priceHistory.eras.entries()) {
    const retired = index < priceHistory.eras.length - 1;
    const label = `${era.id} transfers`;
    const transfers = await cached(`transfers-${era.token}`, retired, () =>
      era.chain === "avalanche"
        ? fetchAvalancheTransfers(era.token, label)
        : fetchEthereumTransfers(era.token, retired ? Number.POSITIVE_INFINITY : block, label),
    );
    const oldUnitsBeforeBlock =
      era.id === "gen1" ? Number.POSITIVE_INFINITY : era.id === "gen2" ? REBASE_BURN_BLOCK : 0;
    eras.push({
      id: era.id,
      startDay: Math.floor(era.start / DAY),
      replay: replay(transfers, oldUnitsBeforeBlock),
    });
  }

  const current = eras.at(-1).replay.balances;
  const selected = new Set([...entityAddresses, poolAddress]);
  for (const [address, balance] of current) {
    if (balance >= MIN_BALANCE && BigInt(address) !== 0n) {
      selected.add(address);
    }
  }

  // A transfer the explorer never indexed shows up as a wallet spending tokens it never received.
  // Both explorers miss a few, so this only stops the run when a drawn line would be wrong.
  const gaps = eras.flatMap((era) => [...era.replay.negative].map((address) => [era.id, address]));
  if (gaps.length > 0) {
    console.warn(`Balances below zero, from transfers missing upstream: ${gaps.join("; ")}`);
  }
  const drawnGaps = gaps.filter(([, address]) => selected.has(address));
  if (drawnGaps.length > 0) {
    throw new Error(`Missing transfers would distort these lines: ${drawnGaps.join("; ")}`);
  }

  const wallets = {};
  for (const address of [...selected].sort(
    (a, b) => (current.get(b) ?? 0) - (current.get(a) ?? 0),
  )) {
    const series = walletSeries(address, eras);
    if (series.length > 0) {
      wallets[address] = series;
    }
  }

  const history = {
    generatedAt: generatedAt.toISOString(),
    sources: { avalanche: ROUTESCAN_API, ethereum: BLOCKSCOUT_API },
    // The last Ethereum block replayed; the page tops the lines up from the next one.
    block,
    minBalance: MIN_BALANCE,
    // Each wallet: [UTC day number (Unix seconds / 86,400), balance in whole BSO] on the first day
    // it held BSO or PLEB and on every day its balance changed after that.
    wallets,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, formatHistory(history));
  const points = Object.values(wallets).reduce((sum, series) => sum + series.length, 0);
  console.log(
    `Wrote ${Object.keys(wallets).length} wallets, ${points} points, to ${path.relative(repoRoot, outputPath)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
