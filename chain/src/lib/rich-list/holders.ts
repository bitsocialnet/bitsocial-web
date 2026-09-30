import snapshot from "@/data/bso-holders.json";
import { BSO_TOKEN_ADDRESS } from "@/lib/site";
import { ENTITIES, PLEB_PER_BSO, type Chain, type Entity } from "./data";

export type Holder = { address: string; balance: number; isContract: boolean };

export type EntityRow = {
  entity: Entity;
  /** Every wallet of the entity, with its snapshot balance (0 when it no longer holds BSO). */
  wallets: { address: string; balance: number; role?: string; patternOnly?: boolean }[];
  balance: number;
};

/** A row of the rich list: a known entity, or a wallet nobody has linked to anything. */
export type RichListRow =
  | { type: "entity"; row: EntityRow; rank: number }
  | { type: "wallet"; holder: Holder; rank: number };

export const SNAPSHOT = snapshot as {
  generatedAt: string;
  priceUsd: number | null;
  totalSupply: number;
  holderCount: number;
  holders: Holder[];
};

const holderByAddress = new Map(
  SNAPSHOT.holders.map((holder) => [holder.address.toLowerCase(), holder]),
);

function toEntityRow(entity: Entity): EntityRow {
  const wallets = entity.wallets.map((wallet) => {
    const holder = holderByAddress.get(wallet.address);
    return { ...wallet, address: holder?.address ?? wallet.address, balance: holder?.balance ?? 0 };
  });
  return { entity, wallets, balance: wallets.reduce((sum, wallet) => sum + wallet.balance, 0) };
}

export const ENTITY_ROWS: EntityRow[] = ENTITIES.map(toEntityRow);

export const ENTITY_ROW_BY_ID = new Map(ENTITY_ROWS.map((row) => [row.entity.id, row]));

const entityIdByAddress = new Map(
  ENTITIES.flatMap((entity) =>
    entity.wallets.map((wallet) => [wallet.address, entity.id] as const),
  ),
);

export function getEntityIdForAddress(address: string): string | undefined {
  return entityIdByAddress.get(address.toLowerCase());
}

/** Holders with linked wallets merged into one row per entity, largest first. */
export const GROUPED_ROWS: RichListRow[] = (() => {
  const entries: ({ type: "entity"; row: EntityRow } | { type: "wallet"; holder: Holder })[] = [
    ...ENTITY_ROWS.filter((row) => row.balance > 0).map((row) => ({
      type: "entity" as const,
      row,
    })),
    ...SNAPSHOT.holders
      .filter((holder) => !entityIdByAddress.has(holder.address.toLowerCase()))
      .map((holder) => ({ type: "wallet" as const, holder })),
  ];
  const balanceOf = (entry: (typeof entries)[number]) =>
    entry.type === "entity" ? entry.row.balance : entry.holder.balance;

  return entries
    .sort((a, b) => balanceOf(b) - balanceOf(a))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
})();

/** Every wallet on its own, as a block explorer lists them. */
export const WALLET_ROWS: RichListRow[] = SNAPSHOT.holders.map((holder, index) => ({
  type: "wallet",
  holder,
  rank: index + 1,
}));

export function shareOfSupply(balance: number) {
  return balance / SNAPSHOT.totalSupply;
}

export function plebToBso(pleb: number) {
  return pleb / PLEB_PER_BSO;
}

export function usdValue(bso: number) {
  return SNAPSHOT.priceUsd === null ? null : bso * SNAPSHOT.priceUsd;
}

export function explorerAddressUrl(chain: Chain, address: string) {
  return chain === "avalanche"
    ? `https://snowscan.xyz/address/${address}`
    : `https://etherscan.io/address/${address}`;
}

export function explorerTxUrl(chain: Chain, hash: string) {
  return chain === "avalanche"
    ? `https://snowscan.xyz/tx/${hash}`
    : `https://etherscan.io/tx/${hash}`;
}

/** Etherscan's view of one wallet's BSO transfers. */
export function bsoHolderUrl(address: string) {
  return `https://etherscan.io/token/${BSO_TOKEN_ADDRESS}?a=${address}`;
}

export function telegramMessageUrl(messageId: number) {
  return `https://t.me/bitsocialnet/${messageId}`;
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
