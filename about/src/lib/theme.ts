export type SupportedThemeMode = "light" | "dark";

export const THEME_QUERY_PARAM = "theme";
export const THEME_COOKIE_NAME = "bitsocialTheme";

function normalizeThemeMode(value: string | null | undefined): SupportedThemeMode | null {
  return value === "light" || value === "dark" ? value : null;
}

function parseCookieHeader(cookieHeader: string | null | undefined): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  const entries = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex < 0) {
        return null;
      }

      const name = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();
      if (!name || !value) {
        return null;
      }

      try {
        return [name, decodeURIComponent(value)] as const;
      } catch {
        return [name, value] as const;
      }
    })
    .filter((entry): entry is readonly [string, string] => entry !== null);

  return Object.fromEntries(entries);
}

export function getThemeFromCookieHeader(
  cookieHeader: string | null | undefined,
): SupportedThemeMode | null {
  const cookies = parseCookieHeader(cookieHeader);
  return normalizeThemeMode(cookies[THEME_COOKIE_NAME]);
}

export function resolveRequestTheme(input: {
  queryTheme?: string | null | undefined;
  cookieHeader?: string | null | undefined;
}): SupportedThemeMode | null {
  return normalizeThemeMode(input.queryTheme) ?? getThemeFromCookieHeader(input.cookieHeader);
}

export function createThemeCookieValue(theme: string | null | undefined): string | null {
  const normalizedTheme = normalizeThemeMode(theme);
  if (!normalizedTheme) {
    return null;
  }

  return `${THEME_COOKIE_NAME}=${encodeURIComponent(normalizedTheme)}; Path=/; Max-Age=31536000; SameSite=Lax`;
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
