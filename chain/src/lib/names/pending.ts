import type { Address, Hex } from "viem";
import { MAX_COMMITMENT_AGE, REGISTRY } from "./registry";

/**
 * A commitment waiting to be revealed. The secret only exists here, so the page keeps it in
 * localStorage: a reload or a closed tab must not cost the visitor their reservation.
 *
 * `committedAt` is the block time of the commit once `confirmed`. Before that it is when the
 * wallet signed, which can be well before the commit is mined, so it must not time the reveal.
 */
export type PendingClaim = {
  registry: Address;
  label: string;
  owner: Address;
  secret: Hex;
  committedAt: number;
  confirmed: boolean;
  commitTx: Hex;
};

const STORAGE_KEY = "bso-names-pending";

// An unconfirmed claim is kept for two days after signing, so a commit mined up to a day late
// still gets its full day to be revealed. Later than that, the commit is treated as dropped.
const UNCONFIRMED_LIMIT = 2 * MAX_COMMITMENT_AGE;

// Set when storage refuses a write: claims then live in this tab's memory until a write succeeds.
let unsaved: PendingClaim[] | null = null;

function readAll(): PendingClaim[] {
  if (unsaved) return unsaved;
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
    unsaved = null;
  } catch {
    unsaved = claims;
  }
}

/** False when storage is blocked or full, so a reservation lasts only as long as this tab. */
export function pendingClaimsSaved(): boolean {
  return unsaved === null;
}

const sameClaim = (a: Pick<PendingClaim, "registry" | "label" | "owner">, b: PendingClaim) =>
  a.registry.toLowerCase() === b.registry.toLowerCase() &&
  a.label === b.label &&
  a.owner.toLowerCase() === b.owner.toLowerCase();

const live = (claim: PendingClaim, now: number) =>
  now < claim.committedAt + (claim.confirmed ? MAX_COMMITMENT_AGE : UNCONFIRMED_LIMIT);

export function findPendingClaim(label: string, owner: Address): PendingClaim | null {
  if (!REGISTRY) return null;
  const now = Date.now() / 1000;
  const key = { registry: REGISTRY.address, label, owner };
  return readAll().find((claim) => sameClaim(key, claim) && live(claim, now)) ?? null;
}

export function savePendingClaim(claim: PendingClaim) {
  const now = Date.now() / 1000;
  writeAll([...readAll().filter((other) => !sameClaim(claim, other) && live(other, now)), claim]);
}

export function removePendingClaim(claim: PendingClaim) {
  writeAll(readAll().filter((other) => !sameClaim(claim, other)));
}
