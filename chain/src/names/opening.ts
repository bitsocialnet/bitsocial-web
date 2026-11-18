import { MAX_COMMITMENT_AGE } from "@/lib/names/registry";

/**
 * When public registration opens, as far as the page knows. Until the registry answers, nothing
 * that depends on the opening is offered: a reservation made too early lapses before it can be
 * revealed.
 */
export type Opening =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "known"; at: number };

/**
 * How long before the opening a name can be reserved. A commitment lasts 24 hours; five minutes
 * less leaves a reservation made at the earliest moment time to be revealed at the opening.
 */
export const RESERVE_WINDOW = MAX_COMMITMENT_AGE - 300;
