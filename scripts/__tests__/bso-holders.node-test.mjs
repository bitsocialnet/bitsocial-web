import assert from "node:assert/strict";
import { execFile, spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { build } from "esbuild";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const reportedAddress = "0xe2Eea174e91611Ee38705365C2Fa11f9C31029b1";
const token = { exchange_rate: "0.01", total_supply: "210000000000000000000000000" };
const items = [
  {
    address: { hash: reportedAddress, is_contract: true, proxy_type: "eip7702" },
    value: "4000000000000000000",
  },
  {
    address: { hash: "0x0000000000000000000000000000000000000002", is_contract: true },
    value: "3000000000000000000",
  },
  {
    address: {
      hash: "0x0000000000000000000000000000000000000003",
      is_contract: true,
      proxy_type: "master_copy",
    },
    value: "2000000000000000000",
  },
  {
    address: { hash: "0x0000000000000000000000000000000000000004", is_contract: false },
    value: "1000000000000000000",
  },
  {
    address: { hash: "0x0000000000000000000000000000000000000005", proxy_type: null },
    value: "500000000000000000",
  },
];
const expectedHolders = items.map((item, index) => ({
  address: item.address.hash,
  balance: [4, 3, 2, 1, 0.5][index],
  isContract: [false, true, true, false, false][index],
}));

/** Blockscout's holder order: balance, then address, both descending. */
function compareHolders(a, b) {
  const [valueA, valueB] = [BigInt(a.value), BigInt(b.value)];
  if (valueA !== valueB) {
    return valueA > valueB ? -1 : 1;
  }
  const [hashA, hashB] = [a.address.hash.toLowerCase(), b.address.hash.toLowerCase()];
  return hashA === hashB ? 0 : hashA > hashB ? -1 : 1;
}

/**
 * Blockscout's keyset paging over `holders`, `pageSize` a page, each page continuing after the
 * `value` and `address_hash` cursor. `issued` collects the cursors it hands out, so a test can tell
 * a run's next page from a seek.
 */
function blockscout(holders, pageSize, issued = new Set()) {
  const sorted = [...holders].sort(compareHolders);
  return (url) => {
    const { pathname, searchParams } = new URL(url);
    if (!pathname.endsWith("/holders")) {
      return token;
    }
    const value = searchParams.get("value");
    const cursor = value && {
      value,
      address: { hash: searchParams.get("address_hash") ?? "" },
    };
    const start = cursor ? sorted.findIndex((item) => compareHolders(item, cursor) > 0) : 0;
    const page = start === -1 ? [] : sorted.slice(start, start + pageSize);
    if (start === -1 || start + pageSize >= sorted.length) {
      return { items: page, next_page_params: null };
    }
    const last = page[page.length - 1];
    const next = { value: last.value, address_hash: last.address.hash.toLowerCase() };
    issued.add(`${next.value}:${next.address_hash}`);
    return { items: page, next_page_params: { ...next, items_count: pageSize } };
  };
}

/** Fetches a live snapshot from `respond`, counting holder requests that continue a run. */
async function fetchFrom(t, respond, issued = new Set()) {
  const { outputFiles } = await build({
    entryPoints: [path.join(repoRoot, "chain/src/lib/rich-list/live.ts")],
    alias: { "@": path.join(repoRoot, "chain/src") },
    bundle: true,
    write: false,
    platform: "node",
    format: "esm",
  });
  const { fetchLiveSnapshot } = await import(
    `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString("base64")}`
  );
  const controller = new AbortController();
  let continued = 0;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(options.signal, controller.signal);
    const { searchParams } = new URL(url);
    if (issued.has(`${searchParams.get("value")}:${searchParams.get("address_hash")}`)) {
      continued += 1;
    }
    return new Response(JSON.stringify(respond(url)));
  });
  return { snapshot: await fetchLiveSnapshot(controller.signal), continued };
}

/** The committed snapshot as Blockscout serves it, with digits past the 4 decimals restored. */
async function committedItems() {
  const { holders } = JSON.parse(
    await readFile(path.join(repoRoot, "chain/src/data/bso-holders.json"), "utf8"),
  );
  return holders.map((holder, index) => ({
    address: { hash: holder.address, is_contract: holder.isContract },
    value: String(BigInt(Math.round(holder.balance * 1e4)) * 10n ** 14n + BigInt(index + 1)),
  }));
}

const toHolder = (item) => ({
  address: item.address.hash,
  balance: Number(BigInt(item.value) / 10n ** 14n) / 1e4,
  isContract: item.address.is_contract,
});

const byAddress = (holders) =>
  holders.toSorted((a, b) => a.address.toLowerCase().localeCompare(b.address.toLowerCase()));

test("live holders treat EIP-7702 delegated wallets as holders and keep contracts tagged", async (t) => {
  const { snapshot } = await fetchFrom(t, blockscout(items, 50));
  assert.deepEqual(snapshot.holders, expectedHolders);
  assert.equal(snapshot.holderCount, items.length);
  assert.equal(snapshot.priceUsd, 0.01);
  assert.equal(snapshot.totalSupply, 210000000);
});

test("live holders take one page a run while the list still matches the committed snapshot", async (t) => {
  const committed = await committedItems();
  const issued = new Set();
  const { snapshot, continued } = await fetchFrom(t, blockscout(committed, 50, issued), issued);
  assert.deepEqual(byAddress(snapshot.holders), byAddress(committed.map(toHolder)));
  // Dust has no seek of its own, so only its run reads more than one page.
  const dust = committed.filter((item) => BigInt(item.value) < 10n ** 14n).length;
  assert.equal(continued, Math.max(0, Math.ceil(dust / 50) - 1));
});

test("live holders leave no gaps after holders joined, left and moved since the snapshot", async (t) => {
  const committed = await committedItems();
  // Drop every seventh holder, triple every eleventh, and add a holder after every ninth, so the
  // stretches between seeks both shrink and grow; 25 new holders after the 100th outgrow one page.
  const live = committed
    .filter((_, index) => index % 7 !== 3)
    .map((item, index) =>
      index % 11 === 5 ? { ...item, value: String(BigInt(item.value) * 3n + 7n) } : item,
    );
  for (let index = 0; index < committed.length; index += 9) {
    live.push({
      address: { hash: `0x${(index + 1).toString(16).padStart(40, "a")}`, is_contract: false },
      value: String(BigInt(committed[index].value) - 1n),
    });
  }
  for (let offset = 1; offset <= 25; offset += 1) {
    live.push({
      address: { hash: `0x${offset.toString(16).padStart(40, "b")}`, is_contract: false },
      value: String(BigInt(committed[100].value) - BigInt(offset)),
    });
  }

  const { snapshot } = await fetchFrom(t, blockscout(live, 50));
  assert.deepEqual(byAddress(snapshot.holders), byAddress(live.map(toHolder)));
});

test("snapshot generation uses the same delegated-wallet classification across pages", async (t) => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "bitsocial-holders-"));
  t.after(() => rm(fixture, { recursive: true, force: true }));
  await mkdir(path.join(fixture, "scripts"), { recursive: true });
  await mkdir(path.join(fixture, "chain/src/lib"), { recursive: true });
  await cp(
    path.join(repoRoot, "scripts/generate-bso-holders.mjs"),
    path.join(fixture, "scripts/generate-bso-holders.mjs"),
  );
  await cp(
    path.join(repoRoot, "chain/src/lib/site.ts"),
    path.join(fixture, "chain/src/lib/site.ts"),
  );

  // Two a page, so the classification holds across pages.
  const respond = blockscout(items, 2);
  const server = createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify(respond(`http://localhost${request.url}`)));
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  await promisify(execFile)(
    process.execPath,
    [path.join(fixture, "scripts/generate-bso-holders.mjs")],
    {
      env: { ...process.env, BLOCKSCOUT_API: `http://127.0.0.1:${server.address().port}/api/v2` },
      timeout: 10000,
    },
  );

  const snapshot = JSON.parse(
    await readFile(path.join(fixture, "chain/src/data/bso-holders.json"), "utf8"),
  );
  assert.deepEqual(snapshot.holders, expectedHolders);
  assert.equal(snapshot.holderCount, items.length);
  assert.equal(snapshot.priceUsd, 0.01);
  assert.equal(snapshot.totalSupply, 210000000);
});

test("the committed fallback snapshot does not tag the reported delegated wallet as a contract", async () => {
  const snapshot = JSON.parse(
    await readFile(path.join(repoRoot, "chain/src/data/bso-holders.json"), "utf8"),
  );
  const holder = snapshot.holders.find((entry) => entry.address === reportedAddress);
  assert.ok(holder, "the reported holder must be present in the fallback snapshot");
  assert.equal(holder.isContract, false);
});

// Answers the history generator's explorer requests offline: a tracked wallet got 100 BSO worth of
// the first contract, then 100 of the second and sent 50 on. SHORT_LISTING drops that receipt, as
// an explorer gap would, and EMPTY_GEN1 lists the first contract as Etherscan's "No records found".
const offlineHistoryApis = `
const wallet = "0x00000000000000000000000000000000000000aa";
const zero = "0x" + "0".repeat(40);
const topic = (address) => "0x" + address.slice(2).padStart(64, "0");
const transfer = (block, from, to, value) => ({
  block_number: block,
  log_index: 0,
  timestamp: new Date(1735689600000 + (block - 24000000) * 12000).toISOString(),
  from: { hash: from },
  to: { hash: to },
  total: { value: String(BigInt(value) * 10n ** 18n) },
});
const gen1 = {
  blockNumber: "1000",
  timeStamp: "1654041600",
  topics: ["0xddf252ad", topic(zero), topic(wallet)],
  data: "0x" + (711459600n * 10n ** 15n).toString(16),
};
globalThis.fetch = async (input) => {
  const url = new URL(input);
  let body;
  if (url.pathname.endsWith("/blocks")) body = { items: [{ height: 30000000 }] };
  else if (url.searchParams.get("action") === "getLogs")
    body = process.env.EMPTY_GEN1
      ? { status: "0", message: "No records found", result: [] }
      : { status: "1", message: "OK", result: [gen1] };
  else if (url.pathname.includes("/0x00000000000000000000000000000000000000b2/")) {
    const sent = transfer(24000002, wallet, "0x00000000000000000000000000000000000000bb", 50);
    body = {
      items: process.env.SHORT_LISTING ? [sent] : [sent, transfer(24000001, zero, wallet, 100)],
      next_page_params: null,
    };
  } else body = { items: [transfer(26000000, zero, wallet, 100)], next_page_params: null };
  return new Response(JSON.stringify(body));
};
`;

for (const [gap, env] of [
  ["a retired listing that fails the gap check", { SHORT_LISTING: "1" }],
  ["an empty retired listing", { EMPTY_GEN1: "1" }],
]) {
  test(`holder history does not cache ${gap}`, async (t) => {
    const fixture = await mkdtemp(path.join(os.tmpdir(), "bitsocial-holder-history-"));
    t.after(() => rm(fixture, { recursive: true, force: true }));
    await mkdir(path.join(fixture, "scripts"), { recursive: true });
    await mkdir(path.join(fixture, "chain/src/lib/rich-list"), { recursive: true });
    await mkdir(path.join(fixture, "chain/src/data"), { recursive: true });
    await cp(
      path.join(repoRoot, "scripts/generate-bso-holder-history.mjs"),
      path.join(fixture, "scripts/generate-bso-holder-history.mjs"),
    );
    await writeFile(
      path.join(fixture, "chain/src/lib/rich-list/data.ts"),
      'export const WALLET = "0x00000000000000000000000000000000000000aa";\n',
    );
    await writeFile(
      path.join(fixture, "chain/src/lib/site.ts"),
      `export const DEXSCREENER_PAIR_ADDRESS = "0x${"c".repeat(40)}";\n`,
    );
    await writeFile(
      path.join(fixture, "chain/src/data/bso-price-history.json"),
      JSON.stringify({
        eras: [
          { id: "gen1", chain: "avalanche", token: `0x${"0".repeat(38)}b1`, start: 1654041600 },
          { id: "gen2", chain: "ethereum", token: `0x${"0".repeat(38)}b2`, start: 1735689600 },
          { id: "gen3", chain: "ethereum", token: `0x${"0".repeat(38)}b3`, start: 1760000000 },
        ],
      }),
    );
    await writeFile(path.join(fixture, "offline-apis.mjs"), offlineHistoryApis);
    const run = (gapEnv) =>
      spawnSync(
        process.execPath,
        [
          "--import",
          path.join(fixture, "offline-apis.mjs"),
          path.join(fixture, "scripts/generate-bso-holder-history.mjs"),
        ],
        { encoding: "utf8", env: { ...process.env, ...gapEnv }, timeout: 30_000 },
      );

    // A brief upstream gap fails the run...
    assert.equal(run(env).status, 1);
    // ...and once the explorer lists everything, the next run replays the full history.
    const recovered = run({});
    assert.equal(recovered.status, 0, recovered.stderr);
    const { wallets } = JSON.parse(
      await readFile(path.join(fixture, "chain/src/data/bso-holder-history.json"), "utf8"),
    );
    // The line starts with the first contract's 100 BSO.
    assert.deepEqual(wallets["0x00000000000000000000000000000000000000aa"][0], [19144, 100]);
  });
}
