/** What a .bso name is for. Both use the same `bitsocial` record (BSIP-10); only the wording differs. */
export type Kind = "community" | "profile";

/** `?name=` and `?for=profile` let apps and posts link straight to a name. */
export function readInitialQuery(): { name: string; kind: Kind } {
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

export function writeQuery(name: string, kind: Kind) {
  const url = new URL(window.location.href);
  if (name) url.searchParams.set("name", name);
  else url.searchParams.delete("name");
  if (kind === "profile") url.searchParams.set("for", "profile");
  else url.searchParams.delete("for");
  window.history.replaceState(window.history.state, "", url);
}
