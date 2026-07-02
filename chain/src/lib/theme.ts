export type SupportedThemeMode = "light" | "dark";

export const THEME_QUERY_PARAM = "theme";

function normalizeThemeMode(value: string | null | undefined): SupportedThemeMode | null {
  return value === "light" || value === "dark" ? value : null;
}

export function resolveRequestTheme(input: {
  queryTheme?: string | null | undefined;
}): SupportedThemeMode | null {
  return normalizeThemeMode(input.queryTheme);
}

export function buildNoJsThemeHref(input: {
  hash: string;
  pathname: string;
  search: string;
  theme: SupportedThemeMode;
}) {
  const searchParams = new URLSearchParams(input.search);
  searchParams.set(THEME_QUERY_PARAM, input.theme);
  const query = searchParams.toString();

  return `${input.pathname}${query ? `?${query}` : ""}${input.hash}`;
}
