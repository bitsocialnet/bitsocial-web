// The deep comparison overlay mirrors its open state in the URL hash, so Back closes it and a shared
// link opens it. It owns at most one history entry, tagged with this key in `history.state`.
const DEEP_COMPARISON_ENTRY_KEY = "deepComparisonOverlay";

function isDeepComparisonEntry(state: unknown) {
  return typeof state === "object" && state !== null && DEEP_COMPARISON_ENTRY_KEY in state;
}

/**
 * Shows a comparison hash for an opening overlay. The first open pushes the overlay's entry; a
 * reopen after a close reuses it, so open/close cycles never stack entries behind the page.
 */
export function openDeepComparisonHash(hash: string) {
  if (typeof window === "undefined" || window.location.hash === hash) {
    return;
  }

  if (isDeepComparisonEntry(window.history.state)) {
    window.history.replaceState(window.history.state, "", hash);
    return;
  }

  window.history.pushState({ [DEEP_COMPARISON_ENTRY_KEY]: true }, "", hash);
}

/** Moves the current entry to `hash` on close, keeping its state (the overlay's tag or the router's). */
export function closeDeepComparisonHash(hash: string) {
  if (typeof window === "undefined" || window.location.hash === hash) {
    return;
  }

  window.history.replaceState(window.history.state, "", hash);
}
