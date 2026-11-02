import { BSO_TOKEN_ADDRESS } from "@/lib/site";
import { COMMITTED_SNAPSHOT, type Holder, type Snapshot } from "./holders";

// Blockscout's public API needs no key and allows cross-origin reads. Etherscan's holder list is a
// paid endpoint. scripts/generate-bso-holders.mjs makes the same calls for the committed snapshot.
export const BLOCKSCOUT_API = "https://eth.blockscout.com/api/v2";
const DECIMALS = 18n;

type TokenResponse = { exchange_rate: string | null; total_supply: string };

type HoldersResponse = {
  items: {
    address: { hash: string; is_contract?: boolean; proxy_type?: string | null };
    value: string;
  }[];
  next_page_params: Record<string, string | number> | null;
};

const MAX_ATTEMPTS = 4;

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

// Blockscout fails single requests with a 500 now and then, and a full refresh takes about 13
// pages, so one unretried failure throws the whole refresh away. Its 500s carry no CORS header,
// which the browser reports as a network error rather than a response, so those are retried too.
export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(url, { signal, headers: { accept: "application/json" } });
    } catch (error) {
      if (signal?.aborted || attempt >= MAX_ATTEMPTS) throw error;
      await wait(attempt * 500, signal);
      continue;
    }
    if (response.ok) {
      return response.json() as Promise<T>;
    }
    if ((response.status !== 429 && response.status < 500) || attempt >= MAX_ATTEMPTS) {
      throw new Error(`Blockscout returned ${response.status} for ${url}`);
    }
    await wait(attempt * 500, signal);
  }
}

// Four decimals are plenty for display, and they keep Number precision safe for any balance.
export function toBso(rawValue: string) {
  const raw = BigInt(rawValue);
  const unit = 10n ** DECIMALS;
  const fraction = (raw % unit) / 10n ** (DECIMALS - 4n);
  return Number(`${raw / unit}.${fraction.toString().padStart(4, "0")}`);
}

type PageParams = NonNullable<HoldersResponse["next_page_params"]>;

const HOLDERS_URL = `${BLOCKSCOUT_API}/tokens/${BSO_TOKEN_ADDRESS}/holders`;
const PAGE_SIZE = 50;
// Runs start 40 holders apart in the snapshot and read 50 a page, so ten holders can join a stretch
// before its run needs a second page.
const SEEK_STRIDE = 40;

/**
 * Where each run starts, as Blockscout's keyset cursor: the balance and address of a holder in the
 * committed snapshot, largest first. The balance is rounded up past the snapshot's 4 decimals, so
 * the run includes that holder and the run before it can stop as soon as it reaches them.
 */
const SEEKS = (() => {
  const seeks: { params: PageParams; value: bigint }[] = [];
  const holders = COMMITTED_SNAPSHOT.holders;
  for (let index = SEEK_STRIDE - 1; index < holders.length - 1; index += SEEK_STRIDE) {
    const holder = holders[index];
    const value = BigInt(Math.round(holder.balance * 1e4) + 1) * 10n ** (DECIMALS - 4n);
    const previous = seeks[seeks.length - 1]?.value;
    if (previous === undefined || value < previous) {
      const params = { value: String(value), address_hash: holder.address.toLowerCase() };
      seeks.push({ params: { ...params, items_count: PAGE_SIZE }, value });
    }
  }
  return seeks;
})();

/**
 * Holders from `start` on, page by page, until they fall below `stopBelow`. Balances that moved
 * since the snapshot shift where a page ends, so each run reads past the next run's start instead of
 * stopping after a fixed number of pages; the overlap is deduplicated by address.
 */
async function fetchHolderRun(
  start: PageParams | null,
  stopBelow: bigint | null,
  signal: AbortSignal,
) {
  const items: HoldersResponse["items"] = [];
  let params = start;
  do {
    const query = params
      ? `?${new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]))}`
      : "";
    const page = await getJson<HoldersResponse>(`${HOLDERS_URL}${query}`, signal);
    items.push(...page.items);
    const last = page.items[page.items.length - 1];
    if (stopBelow !== null && last && BigInt(last.value) < stopBelow) {
      break;
    }
    params = page.next_page_params;
  } while (params);
  return items;
}

/** Every BSO holder and the current price, straight from Blockscout. */
export async function fetchLiveSnapshot(signal: AbortSignal): Promise<Snapshot> {
  // Paging one cursor after another took about ten seconds; seeking to points spread through the
  // snapshot loads the pages side by side, well inside Blockscout's 180 requests a minute.
  const [token, ...runs] = await Promise.all([
    getJson<TokenResponse>(`${BLOCKSCOUT_API}/tokens/${BSO_TOKEN_ADDRESS}`, signal),
    ...[null, ...SEEKS].map((seek, index) =>
      fetchHolderRun(seek?.params ?? null, SEEKS[index]?.value ?? null, signal),
    ),
  ]);

  // Keyed by address: runs overlap, and balances can move while the pages load, so keyset paging
  // may return the same holder twice.
  const holders = new Map<string, Holder>();
  for (const item of runs.flat()) {
    holders.set(item.address.hash.toLowerCase(), {
      address: item.address.hash,
      balance: toBso(item.value),
      // Blockscout marks EIP-7702 delegated EOAs as contracts, but they are holder wallets.
      isContract: Boolean(item.address.is_contract) && item.address.proxy_type !== "eip7702",
    });
  }

  const sortedHolders = [...holders.values()].sort((a, b) => b.balance - a.balance);

  return {
    generatedAt: new Date().toISOString(),
    priceUsd: token.exchange_rate ? Number(token.exchange_rate) : null,
    totalSupply: toBso(token.total_supply),
    holderCount: sortedHolders.length,
    holders: sortedHolders,
  };
}
