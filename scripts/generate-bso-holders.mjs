#!/usr/bin/env node
// Snapshots every BSO holder and the current price into chain/src/data/bso-holders.json. The rich
// list at chain.bitsocial.net/rich-list/ paints from this committed snapshot, then refreshes from
// Blockscout in the browser; the snapshot is also what it shows when Blockscout is unreachable.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BLOCKSCOUT_API = process.env.BLOCKSCOUT_API ?? "https://eth.blockscout.com/api/v2";
const DECIMALS = 18n;

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "chain/src/data/bso-holders.json");
const siteConfigPath = path.join(repoRoot, "chain/src/lib/site.ts");

// The official address is defined once, in the chain site's config.
async function readBsoTokenAddress() {
  const source = await readFile(siteConfigPath, "utf8");
  const match = source.match(/BSO_TOKEN_ADDRESS = "(0x[0-9a-fA-F]{40})"/);
  if (!match) {
    throw new Error(`BSO_TOKEN_ADDRESS not found in ${path.relative(repoRoot, siteConfigPath)}`);
  }
  return match[1];
}

async function getJson(url) {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (response.ok) {
      return response.json();
    }
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`GET ${url} failed with ${response.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
  }
  throw new Error(`GET ${url} kept failing after retries`);
}

// Four decimals are enough for display and keep the file small.
function toBso(rawValue) {
  const raw = BigInt(rawValue);
  const unit = 10n ** DECIMALS;
  const whole = raw / unit;
  const fraction = (raw % unit) / 10n ** (DECIMALS - 4n);
  return Number(`${whole}.${fraction.toString().padStart(4, "0")}`);
}

async function main() {
  const bsoTokenAddress = await readBsoTokenAddress();
  const tokenUrl = `${BLOCKSCOUT_API}/tokens/${bsoTokenAddress}`;
  console.log(`Fetching token info: ${tokenUrl}`);
  const token = await getJson(tokenUrl);

  const holders = [];
  let nextPageParams = null;
  do {
    const query = nextPageParams ? `?${new URLSearchParams(nextPageParams)}` : "";
    const url = `${BLOCKSCOUT_API}/tokens/${bsoTokenAddress}/holders${query}`;
    const page = await getJson(url);
    for (const item of page.items) {
      holders.push({
        address: item.address.hash,
        balance: toBso(item.value),
        isContract: Boolean(item.address.is_contract),
      });
    }
    nextPageParams = page.next_page_params;
    console.log(`Fetched ${holders.length} holders`);
    if (nextPageParams) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  } while (nextPageParams);

  holders.sort((a, b) => b.balance - a.balance);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: tokenUrl,
    priceUsd: token.exchange_rate ? Number(token.exchange_rate) : null,
    totalSupply: toBso(token.total_supply),
    holderCount: holders.length,
    holders,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Wrote ${holders.length} holders to ${path.relative(repoRoot, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
