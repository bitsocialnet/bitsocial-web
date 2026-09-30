import { BSO_TOKEN_ADDRESS } from "@/lib/site";
import type { Holder, Snapshot } from "./holders";

// Blockscout's public API needs no key and allows cross-origin reads. Etherscan's holder list is a
// paid endpoint. scripts/generate-bso-holders.mjs makes the same calls for the committed snapshot.
const BLOCKSCOUT_API = "https://eth.blockscout.com/api/v2";
const DECIMALS = 18n;

type TokenResponse = { exchange_rate: string | null; total_supply: string };

type HoldersResponse = {
  items: { address: { hash: string; is_contract?: boolean }; value: string }[];
  next_page_params: Record<string, string | number> | null;
};

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Blockscout returned ${response.status} for ${url}`);
  }
  return response.json() as Promise<T>;
}

// Four decimals are plenty for display, and they keep Number precision safe for any balance.
function toBso(rawValue: string) {
  const raw = BigInt(rawValue);
  const unit = 10n ** DECIMALS;
  const fraction = (raw % unit) / 10n ** (DECIMALS - 4n);
  return Number(`${raw / unit}.${fraction.toString().padStart(4, "0")}`);
}

/** Every BSO holder and the current price, straight from Blockscout. */
export async function fetchLiveSnapshot(signal: AbortSignal): Promise<Snapshot> {
  const tokenUrl = `${BLOCKSCOUT_API}/tokens/${BSO_TOKEN_ADDRESS}`;
  const token = await getJson<TokenResponse>(tokenUrl, signal);

  // Keyed by address: balances can move while the pages load, and keyset paging may then return
  // the same holder twice.
  const holders = new Map<string, Holder>();
  let nextPageParams: HoldersResponse["next_page_params"] = null;
  do {
    const query = nextPageParams
      ? `?${new URLSearchParams(Object.entries(nextPageParams).map(([key, value]) => [key, String(value)]))}`
      : "";
    const page: HoldersResponse = await getJson<HoldersResponse>(
      `${tokenUrl}/holders${query}`,
      signal,
    );
    for (const item of page.items) {
      holders.set(item.address.hash.toLowerCase(), {
        address: item.address.hash,
        balance: toBso(item.value),
        isContract: Boolean(item.address.is_contract),
      });
    }
    nextPageParams = page.next_page_params;
  } while (nextPageParams);

  const sortedHolders = [...holders.values()].sort((a, b) => b.balance - a.balance);

  return {
    generatedAt: new Date().toISOString(),
    priceUsd: token.exchange_rate ? Number(token.exchange_rate) : null,
    totalSupply: toBso(token.total_supply),
    holderCount: sortedHolders.length,
    holders: sortedHolders,
  };
}
