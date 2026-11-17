import { useCallback, useEffect, useState } from "react";
import { lookupName, type NameState, REGISTRY } from "@/lib/names/registry";

export type Lookup =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; state: NameState };

const DEBOUNCE_MS = 250;

/**
 * Reads a label's registry state, a moment after typing stops. Loading is derived from which
 * label the stored result belongs to, so a stale answer never shows for a newer label.
 */
export function useNameLookup(label: string | null) {
  const [result, setResult] = useState<{ label: string; state?: NameState } | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!label || !REGISTRY) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const state = await lookupName(label);
        if (!cancelled) setResult({ label, state });
      } catch (error) {
        console.warn(`Could not look up ${label}.bso.`, error);
        if (!cancelled) setResult({ label });
      }
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [label, nonce]);

  const refresh = useCallback(() => setNonce((value) => value + 1), []);

  let lookup: Lookup;
  if (!label || !REGISTRY) lookup = { status: "idle" };
  else if (result?.label !== label) lookup = { status: "loading" };
  else if (!result.state) lookup = { status: "error" };
  else lookup = { status: "ready", state: result.state };

  return { lookup, refresh };
}
