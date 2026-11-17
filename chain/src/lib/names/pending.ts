import type { Address, Hex } from "viem";
import { MAX_COMMITMENT_AGE, REGISTRY } from "./registry";

/**
 * A commitment waiting to be revealed. The secret only exists here, so the page keeps it in
 * localStorage: a reload or a closed tab must not cost the visitor their reservation.
 */
export type PendingClaim = {
  registry: Address;
  label: string;
  owner: Address;
  secret: Hex;
  committedAt: number;
  commitTx: Hex;
};

const STORAGE_KEY = "bso-names-pending";

function readAll(): PendingClaim[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as PendingClaim[]) : [];
  } catch {
    return [];
  }
}

function writeAll(claims: PendingClaim[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
  } catch {
    // Storage can be blocked; the claim still works as long as this tab stays open.
  }
}

const sameClaim = (a: Pick<PendingClaim, "registry" | "label" | "owner">, b: PendingClaim) =>
  a.registry.toLowerCase() === b.registry.toLowerCase() &&
  a.label === b.label &&
  a.owner.toLowerCase() === b.owner.toLowerCase();

export function findPendingClaim(label: string, owner: Address): PendingClaim | null {
  if (!REGISTRY) return null;
  const now = Date.now() / 1000;
  const key = { registry: REGISTRY.address, label, owner };
  return (
    readAll().find(
      (claim) => sameClaim(key, claim) && now < claim.committedAt + MAX_COMMITMENT_AGE,
    ) ?? null
  );
}

export function savePendingClaim(claim: PendingClaim) {
  const now = Date.now() / 1000;
  writeAll([
    ...readAll().filter(
      (other) => !sameClaim(claim, other) && now < other.committedAt + MAX_COMMITMENT_AGE,
    ),
    claim,
  ]);
}

export function removePendingClaim(claim: PendingClaim) {
  writeAll(readAll().filter((other) => !sameClaim(claim, other)));
}
