import {
  DEFAULT_LANGUAGE_CODE,
  getSupportedLanguage,
  LANGUAGE_QUERY_PARAM,
  LANGUAGE_STORAGE_KEY,
  resolveAutomaticLanguage,
  resolveSupportedLanguageCode,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  type SupportedLanguageCode,
} from "./locales";

export { SUPPORTED_LANGUAGES, type SupportedLanguage, type SupportedLanguageCode };
export { LANGUAGE_QUERY_PARAM };

const DOCS_BASE_PATH = "/docs";

function canUseDom() {
  return typeof window !== "undefined";
}

function getResolvedBrowserLocale(): string | null {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale || null;
  } catch {
    return null;
  }
}

function getBrowserLocaleCandidates(): string[] {
  if (!canUseDom()) {
    return [];
  }

  const candidates = [
    window.navigator.language,
    getResolvedBrowserLocale(),
    ...(window.navigator.languages ?? []),
  ];
  const seen = new Set<string>();

  return candidates.filter((locale): locale is string => {
    if (!locale || seen.has(locale)) {
      return false;
    }

    seen.add(locale);
    return true;
  });
}

function readStoredLanguage(): string | null {
  if (!canUseDom()) {
    return null;
  }

  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredLanguage(language: SupportedLanguageCode) {
  if (!canUseDom()) {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore environments where storage is unavailable.
  }
}

export function getQueryLanguage(search: string): SupportedLanguageCode | null {
  const queryLanguage = new URLSearchParams(search).get(LANGUAGE_QUERY_PARAM);
  return resolveSupportedLanguageCode(queryLanguage);
}

export function resolveDocsLanguage(search: string): SupportedLanguageCode {
  const queryLanguage = getQueryLanguage(search);
  if (queryLanguage) {
    return queryLanguage;
  }

  const storedLanguage = readStoredLanguage();
  if (storedLanguage) {
    return getSupportedLanguage(storedLanguage).code;
  }

  const localeCandidates = getBrowserLocaleCandidates();
  const primaryRegionLocale = canUseDom()
    ? window.navigator.language || getResolvedBrowserLocale()
    : null;

  return resolveAutomaticLanguage(localeCandidates, primaryRegionLocale);
}

export function persistDocsLanguage(language: string | null | undefined) {
  const supportedLanguage = resolveSupportedLanguageCode(language);
  if (!supportedLanguage) {
    return;
  }

  writeStoredLanguage(supportedLanguage);
}

export function persistDocsLanguageFromSearch(search: string) {
  persistDocsLanguage(getQueryLanguage(search));
}

export function getSupportedLanguageEntry(language: string | null | undefined): SupportedLanguage {
  return getSupportedLanguage(language);
}

export function getDefaultDocsLanguage(): SupportedLanguageCode {
  return DEFAULT_LANGUAGE_CODE;
}

export function stripLanguageQueryParam(search: string): string {
  const searchParams = new URLSearchParams(search);
  searchParams.delete(LANGUAGE_QUERY_PARAM);
  const nextSearch = searchParams.toString();

  return nextSearch ? `?${nextSearch}` : "";
}

export function isDocsNotFoundPath(pathname: string): boolean {
  return /^\/docs(?:\/[a-z]{2,3})?\/404(?:\.html|\/)?$/.test(pathname);
}

export function getDocsBasePath(pathname: string): string {
  if (pathname === DOCS_BASE_PATH || pathname === `${DOCS_BASE_PATH}/`) {
    return `${DOCS_BASE_PATH}/`;
  }

  if (!pathname.startsWith(`${DOCS_BASE_PATH}/`)) {
    return pathname;
  }

  const hasTrailingSlash = pathname.endsWith("/");
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
  const maybeLocale = segments[1];
  const restSegments =
    maybeLocale && resolveSupportedLanguageCode(maybeLocale)
      ? segments.slice(2)
      : segments.slice(1);
  const rebuiltPath = `/${["docs", ...restSegments].join("/")}`;

  if (rebuiltPath === DOCS_BASE_PATH) {
    return `${DOCS_BASE_PATH}/`;
  }

  return hasTrailingSlash ? `${rebuiltPath}/` : rebuiltPath;
}

export function getLocalizedDocsPath(pathname: string, language: SupportedLanguageCode): string {
  const docsBasePath = getDocsBasePath(pathname);

  if (isDocsNotFoundPath(pathname)) {
    return language === DEFAULT_LANGUAGE_CODE
      ? `${DOCS_BASE_PATH}/`
      : `${DOCS_BASE_PATH}/${language}/`;
  }

  if (!docsBasePath.startsWith(DOCS_BASE_PATH)) {
    return docsBasePath;
  }

  if (language === DEFAULT_LANGUAGE_CODE) {
    return docsBasePath;
  }

  const pathSuffix = docsBasePath.slice(DOCS_BASE_PATH.length);
  return `${DOCS_BASE_PATH}/${language}${pathSuffix.startsWith("/") ? "" : "/"}${pathSuffix}`;
}
