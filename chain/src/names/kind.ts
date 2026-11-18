/** What a .bso name is for. Both use the same `bitsocial` record (BSIP-10); only the wording differs. */
export type Kind = "community" | "profile";

/** `?name=` and `?for=profile` let apps and posts link straight to a name. */
export function readQuery(): { name: string; kind: Kind } {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      name: params.get("name") ?? "",
      kind: params.get("for") === "profile" ? "profile" : "community",
    };
  } catch {
    return { name: "", kind: "community" };
  }
}

// Typing writes the address bar once it pauses: browsers limit how often a page may call
// replaceState (Safari throws past its quota), and a refused write is retried rather than lost.
const WRITE_DELAY_MS = 300;
const RETRY_MS = 2_000;
let queued: { name: string; kind: Kind } | null = null;
let timer: number | undefined;

export function writeQuery(name: string, kind: Kind) {
  queued = { name, kind };
  window.clearTimeout(timer);
  timer = window.setTimeout(flushQuery, WRITE_DELAY_MS);
}

/** Drops a write not made yet, so it cannot overwrite the entry Back or Forward restored. */
export function cancelQueryWrite() {
  queued = null;
  window.clearTimeout(timer);
}

function flushQuery() {
  if (!queued) return;
  const url = new URL(window.location.href);
  if (queued.name) url.searchParams.set("name", queued.name);
  else url.searchParams.delete("name");
  if (queued.kind === "profile") url.searchParams.set("for", "profile");
  else url.searchParams.delete("for");
  try {
    window.history.replaceState(window.history.state, "", url);
    queued = null;
  } catch (error) {
    console.warn("Could not update the address bar; retrying.", error);
    timer = window.setTimeout(flushQuery, RETRY_MS);
  }
}
