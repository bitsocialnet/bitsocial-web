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

export type DocsPreviewMode = "live" | "multilocale";

function canUseDom() {
  return typeof window !== "undefined";
}

export function resolveDocsPreviewMode(value: unknown): DocsPreviewMode {
  return value === "live" ? "live" : "multilocale";
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
    ...(window.navigator.languages ?? []),
    getResolvedBrowserLocale(),
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

// The last language storage refused, so in-app navigation on this page still honours it.
let unsavedLanguage: SupportedLanguageCode | null = null;

function readStoredLanguage(): string | null {
  if (!canUseDom()) {
    return null;
  }

  if (unsavedLanguage) {
    return unsavedLanguage;
  }

  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredLanguage(language: SupportedLanguageCode): boolean {
  if (!canUseDom()) {
    return false;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    unsavedLanguage = null;
    return true;
  } catch {
    // Storage is blocked or full.
    unsavedLanguage = language;
    return false;
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

  return resolveAutomaticLanguage(localeCandidates);
}

/** Stores the language for later visits; false when it is unsupported or storage refused it. */
export function persistDocsLanguage(language: string | null | undefined): boolean {
  const supportedLanguage = resolveSupportedLanguageCode(language);
  if (!supportedLanguage) {
    return false;
  }

  return writeStoredLanguage(supportedLanguage);
}

/**
 * Stores an explicit language choice and returns the URL to load for it. When storage refuses the
 * choice it rides along as `?lang=`, or the default-locale build would send the reader straight
 * back to the language detected from the browser.
 */
export function persistDocsLanguageChoice(language: string, href: string): string {
  const supportedLanguage = resolveSupportedLanguageCode(language);
  if (!supportedLanguage || !canUseDom() || persistDocsLanguage(supportedLanguage)) {
    return href;
  }

  const url = new URL(href, window.location.href);
  url.searchParams.set(LANGUAGE_QUERY_PARAM, supportedLanguage);
  return `${url.pathname}${url.search}${url.hash}`;
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

/** The locale a docs URL is under: its first path segment when that is a language code. */
export function getDocsPathLanguage(pathname: string): SupportedLanguageCode {
  const [firstSegment] = pathname.replace(/^\/+/, "").split("/");
  return (
    SUPPORTED_LANGUAGES.find((language) => language.code === firstSegment)?.code ??
    DEFAULT_LANGUAGE_CODE
  );
}

export function isDocsNotFoundPath(pathname: string): boolean {
  return /^\/(?:[a-z]{2,3}\/)?404(?:\.html|\/)?$/.test(pathname);
}

export function getDocsBasePath(pathname: string): string {
  if (pathname === "/" || pathname === "") {
    return "/";
  }

  const hasTrailingSlash = pathname.endsWith("/");
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
  const maybeLocale = segments[0];
  const restSegments =
    maybeLocale && resolveSupportedLanguageCode(maybeLocale) ? segments.slice(1) : segments;

  if (restSegments.length === 0) {
    return "/";
  }

  const rebuiltPath = `/${restSegments.join("/")}`;

  return hasTrailingSlash ? `${rebuiltPath}/` : rebuiltPath;
}

export function getLocalizedDocsPath(pathname: string, language: SupportedLanguageCode): string {
  const docsBasePath = getDocsBasePath(pathname);

  if (isDocsNotFoundPath(pathname)) {
    return language === DEFAULT_LANGUAGE_CODE ? "/" : `/${language}/`;
  }

  if (language === DEFAULT_LANGUAGE_CODE) {
    return docsBasePath;
  }

  if (docsBasePath === "/") {
    return `/${language}/`;
  }

  const pathSuffix = docsBasePath.startsWith("/") ? docsBasePath : `/${docsBasePath}`;
  return `/${language}${pathSuffix}`;
}
