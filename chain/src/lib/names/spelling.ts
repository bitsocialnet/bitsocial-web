import { normalize } from "viem/ens";

export type SpellingProblem =
  | "dot"
  | "space"
  | "underscore"
  | "hyphenEdge"
  | "labelExtension"
  | "tooShort"
  | "tooLong"
  | "lookalike"
  | "character";

export type Spelling =
  | { ok: true; label: string; bytes: number }
  | { ok: false; problem: SpellingProblem; character?: string; suggestion: string | null };

const MAX_BYTES = 255;
// BSIP-13 change 5: a top-level label needs 3 Unicode code points. Subname labels need only 1 byte.
const MIN_TOP_LEVEL_CODE_POINTS = 3;

const byteLength = (value: string) => new TextEncoder().encode(value).length;

/**
 * Checks a label the way BSIP-13 asks a front-end to: ENS-normalize it (ENSIP-15), refuse what
 * normalization rejects, then apply the registry's own rules on top. Returns null for empty input.
 * A trailing `.bso` is accepted and dropped, since people paste whole names. Pass
 * `topLevel: false` for a subname label, which has no minimum length.
 */
export function checkSpelling(input: string, { topLevel = true } = {}): Spelling | null {
  const raw = input.trim().replace(/\.bso$/i, "");
  if (!raw) return null;

  const rejected = (problem: SpellingProblem, character?: string): Spelling => ({
    ok: false,
    problem,
    character,
    suggestion: suggest(raw, topLevel),
  });

  if (raw.includes(".")) return rejected("dot");
  if (/\s/.test(raw)) return rejected("space");

  let label: string;
  try {
    label = normalize(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/underscore/i.test(message)) return rejected("underscore");
    if (/label extension/i.test(message)) return rejected("labelExtension");
    if (/confusable|mixture/i.test(message)) return rejected("lookalike");
    // ens-normalize quotes the character and wraps it in a bidi mark: `disallowed character: "!"`.
    const character = /disallowed character: (.+)$/i
      .exec(message)?.[1]
      ?.replace(/ \{[0-9a-f]+\}$/i, "")
      .replace(/[\u200e\u200f"]/g, "");
    return rejected("character", character || undefined);
  }

  // The registry rejects these even though ENSIP-15 allows them.
  if (label.startsWith("-") || label.endsWith("-")) return rejected("hyphenEdge");
  const bytes = byteLength(label);
  if (bytes > MAX_BYTES) return rejected("tooLong");
  // The string iterator yields code points, which is what the registry counts.
  if (topLevel && [...label].length < MIN_TOP_LEVEL_CODE_POINTS) return rejected("tooShort");
  return { ok: true, label, bytes };
}

/**
 * The nearest valid label, with separators turned into hyphens and other ASCII punctuation
 * dropped, or null if there is none.
 */
function suggest(raw: string, topLevel: boolean): string | null {
  const candidate = raw
    .toLowerCase()
    .replace(/[!-,/:-@[-^`{-~]/g, "")
    .replace(/[\s._]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!candidate || candidate === raw) return null;
  try {
    const label = normalize(candidate);
    if (label.startsWith("-") || label.endsWith("-") || byteLength(label) > MAX_BYTES) return null;
    if (topLevel && [...label].length < MIN_TOP_LEVEL_CODE_POINTS) return null;
    return label;
  } catch {
    return null;
  }
}
