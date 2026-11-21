import { useCallback, useEffect, useState } from "react";
import { lookupName, type NameState, REGISTRY } from "@/lib/names/registry";

export type Lookup =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; state: NameState };

const DEBOUNCE_MS = 250;

/**
 * Reads a label's registry state, a moment after typing stops. Every new label and every refresh
 * starts a new request, and only the current request's answer shows: a stale answer never shows
 * for a newer label, and a refresh after a transaction hides the old answer until the new one
 * arrives.
 */
export function useNameLookup(label: string | null) {
  const [request, setRequest] = useState({ label, id: 0 });
  const [result, setResult] = useState<{ id: number; state?: NameState } | null>(null);

  // A changed label is a new request, so even a label searched before waits for a fresh answer.
  if (request.label !== label) setRequest({ label, id: request.id + 1 });

  useEffect(() => {
    const { label: current, id } = request;
    if (!current || !REGISTRY) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const state = await lookupName(current);
        if (!cancelled) setResult({ id, state });
      } catch (error) {
        console.warn(`Could not look up ${current}.bso.`, error);
        if (!cancelled) setResult({ id });
      }
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [request]);

  const refresh = useCallback(
    () => setRequest((current) => ({ ...current, id: current.id + 1 })),
    [],
  );

  let lookup: Lookup;
  if (!label || !REGISTRY) lookup = { status: "idle" };
  else if (request.label !== label || result?.id !== request.id) lookup = { status: "loading" };
  else if (!result.state) lookup = { status: "error" };
  else lookup = { status: "ready", state: result.state };

  return { lookup, refresh };
}
