import committedSnapshot from "@/data/bso-holders.json";
import { BSO_TOKEN_ADDRESS } from "@/lib/site";
import { ENTITIES, PLEB_PER_BSO, type Chain, type Entity } from "./data";

export type Holder = { address: string; balance: number; isContract: boolean };

export type Snapshot = {
  generatedAt: string;
  priceUsd: number | null;
  totalSupply: number;
  holderCount: number;
  holders: Holder[];
};

export type EntityRow = {
  entity: Entity;
  /** Every wallet of the entity, with its balance (0 when it no longer holds BSO). */
  wallets: { address: string; balance: number; role?: string; patternOnly?: boolean }[];
  balance: number;
};

/** A row of the rich list: a known entity, or a wallet nobody has linked to anything. */
export type RichListRow =
  | { type: "entity"; row: EntityRow; rank: number }
  | { type: "wallet"; holder: Holder; rank: number };

export type RichListData = {
  snapshot: Snapshot;
  entityRows: EntityRow[];
  entityRowById: Map<string, EntityRow>;
  /** Holders with linked wallets merged into one row per entity, largest first. */
  groupedRows: RichListRow[];
  /** Every wallet on its own, as a block explorer lists them. */
  walletRows: RichListRow[];
  shareOfSupply: (balance: number) => number;
  usdValue: (bso: number) => number | null;
};

/** The snapshot committed with the site (`yarn rich-list:snapshot`): first paint and fallback. */
export const COMMITTED_SNAPSHOT = committedSnapshot as Snapshot;

const entityIdByAddress = new Map(
  ENTITIES.flatMap((entity) =>
    entity.wallets.map((wallet) => [wallet.address, entity.id] as const),
  ),
);

export function getEntityIdForAddress(address: string): string | undefined {
  return entityIdByAddress.get(address.toLowerCase());
}

export function buildRichListData(snapshot: Snapshot): RichListData {
  const holderByAddress = new Map(
    snapshot.holders.map((holder) => [holder.address.toLowerCase(), holder]),
  );

  const entityRows = ENTITIES.map((entity): EntityRow => {
    const wallets = entity.wallets.map((wallet) => {
      const holder = holderByAddress.get(wallet.address);
      return {
        ...wallet,
        address: holder?.address ?? wallet.address,
        balance: holder?.balance ?? 0,
      };
    });
    return { entity, wallets, balance: wallets.reduce((sum, wallet) => sum + wallet.balance, 0) };
  });

  const entries: ({ type: "entity"; row: EntityRow } | { type: "wallet"; holder: Holder })[] = [
    ...entityRows.filter((row) => row.balance > 0).map((row) => ({ type: "entity" as const, row })),
    ...snapshot.holders
      .filter((holder) => !entityIdByAddress.has(holder.address.toLowerCase()))
      .map((holder) => ({ type: "wallet" as const, holder })),
  ];
  const balanceOf = (entry: (typeof entries)[number]) =>
    entry.type === "entity" ? entry.row.balance : entry.holder.balance;

  return {
    snapshot,
    entityRows,
    entityRowById: new Map(entityRows.map((row) => [row.entity.id, row])),
    groupedRows: entries
      .sort((a, b) => balanceOf(b) - balanceOf(a))
      .map((entry, index) => ({ ...entry, rank: index + 1 })),
    walletRows: snapshot.holders.map((holder, index) => ({
      type: "wallet",
      holder,
      rank: index + 1,
    })),
    shareOfSupply: (balance) => balance / snapshot.totalSupply,
    usdValue: (bso) => (snapshot.priceUsd === null ? null : bso * snapshot.priceUsd),
  };
}

export function plebToBso(pleb: number) {
  return pleb / PLEB_PER_BSO;
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
