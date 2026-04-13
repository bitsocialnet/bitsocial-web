export const SUPPORTED_LANGUAGE_CODES = [
  "ar",
  "bn",
  "ca",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "es",
  "fa",
  "fi",
  "fil",
  "fr",
  "he",
  "hi",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "mr",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sq",
  "sv",
  "te",
  "th",
  "tr",
  "uk",
  "ur",
  "vi",
  "zh",
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGE_CODES)[number];
export interface SupportedLanguage {
  code: SupportedLanguageCode;
  label: string;
  dir?: "rtl";
}

export const DEFAULT_LANGUAGE_CODE: SupportedLanguageCode = "en";
export const LANGUAGE_QUERY_PARAM = "lang";
export const LANGUAGE_STORAGE_KEY = "i18nextLng";
export const LANGUAGE_COOKIE_NAME = LANGUAGE_STORAGE_KEY;
export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "bn", label: "বাংলা" },
  { code: "ca", label: "Català" },
  { code: "cs", label: "Čeština" },
  { code: "da", label: "Dansk" },
  { code: "de", label: "Deutsch" },
  { code: "el", label: "Ελληνικά" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fa", label: "فارسی", dir: "rtl" },
  { code: "fi", label: "Suomi" },
  { code: "fil", label: "Filipino" },
  { code: "fr", label: "Français" },
  { code: "he", label: "עברית", dir: "rtl" },
  { code: "hi", label: "हिन्दी" },
  { code: "hu", label: "Magyar" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "it", label: "Italiano" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "mr", label: "मराठी" },
  { code: "nl", label: "Nederlands" },
  { code: "no", label: "Norsk" },
  { code: "pl", label: "Polski" },
  { code: "pt", label: "Português" },
  { code: "ro", label: "Română" },
  { code: "ru", label: "Русский" },
  { code: "sq", label: "Shqip" },
  { code: "sv", label: "Svenska" },
  { code: "te", label: "తెలుగు" },
  { code: "th", label: "ไทย" },
  { code: "tr", label: "Türkçe" },
  { code: "uk", label: "Українська" },
  { code: "ur", label: "اردو", dir: "rtl" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "zh", label: "中文" },
];

const SUPPORTED_LANGUAGE_CODE_SET = new Set<string>(SUPPORTED_LANGUAGE_CODES);
const RTL_LANGUAGE_CODES = new Set<SupportedLanguageCode>(["ar", "fa", "he", "ur"]);
const SUPPORTED_LANGUAGE_BY_CODE = new Map<string, SupportedLanguage>(
  SUPPORTED_LANGUAGES.map((language) => [language.code, language]),
);
const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGE_BY_CODE.get(DEFAULT_LANGUAGE_CODE)!;
const ENGLISH_DEFAULT_REGION_CODES = new Set([
  // EF EPI 2025 High/Very high proficiency markets relevant to supported locales.
  "AT",
  "BE",
  "CH",
  "CZ",
  "DE",
  "DK",
  "FI",
  "GR",
  "HU",
  "MY",
  "NL",
  "NO",
  "PH",
  "PL",
  "PT",
  "RO",
  "SE",
  // Singapore Census 2020: English is the most frequently spoken home language.
  "SG",
]);

function getNormalizedLocaleTag(language: string): string {
  return language.trim().replace(/_/g, "-");
}

export function resolveSupportedLanguageCode(
  language: string | null | undefined,
): SupportedLanguageCode | null {
  if (!language) {
    return null;
  }

  const normalizedLanguage = getNormalizedLocaleTag(language).toLowerCase();

  if (SUPPORTED_LANGUAGE_CODE_SET.has(normalizedLanguage)) {
    return normalizedLanguage as SupportedLanguageCode;
  }

  const [baseLanguage] = normalizedLanguage.split("-");
  if (baseLanguage && SUPPORTED_LANGUAGE_CODE_SET.has(baseLanguage)) {
    return baseLanguage as SupportedLanguageCode;
  }

  return null;
}

export function normalizeLanguageCode(language: string | null | undefined): SupportedLanguageCode {
  return resolveSupportedLanguageCode(language) ?? DEFAULT_LANGUAGE_CODE;
}

export function getSupportedLanguage(language: string | null | undefined): SupportedLanguage {
  return SUPPORTED_LANGUAGE_BY_CODE.get(normalizeLanguageCode(language)) ?? DEFAULT_LANGUAGE;
}

export function extractRegionCode(locale: string | null | undefined): string | null {
  if (!locale) {
    return null;
  }

  const normalizedLocale = getNormalizedLocaleTag(locale);
  if (normalizedLocale === "") {
    return null;
  }

  if (typeof Intl !== "undefined" && typeof Intl.Locale === "function") {
    try {
      const parsedLocale = new Intl.Locale(normalizedLocale);
      if (parsedLocale.region) {
        return parsedLocale.region.toUpperCase();
      }
    } catch {
      // Fall through to the lightweight parser for malformed or unsupported locale tags.
    }
  }

  const parts = normalizedLocale.split("-");
  for (const part of parts.slice(1)) {
    if (/^[A-Za-z]{4}$/.test(part)) {
      continue;
    }
    if (/^[A-Za-z]{2}$/.test(part)) {
      return part.toUpperCase();
    }
    break;
  }

  return null;
}

export function shouldDefaultToEnglishByRegion(regionCode: string | null | undefined): boolean {
  if (!regionCode) {
    return false;
  }

  return ENGLISH_DEFAULT_REGION_CODES.has(regionCode.trim().toUpperCase());
}

export function resolveAutomaticLanguage(
  languageLocales: readonly string[],
  primaryRegionLocale?: string | null,
): SupportedLanguageCode {
  const regionCode = extractRegionCode(primaryRegionLocale ?? languageLocales[0] ?? null);

  if (regionCode && shouldDefaultToEnglishByRegion(regionCode)) {
    return DEFAULT_LANGUAGE_CODE;
  }

  for (const locale of languageLocales) {
    const supportedLanguage = resolveSupportedLanguageCode(locale);
    if (supportedLanguage) {
      return supportedLanguage;
    }
  }

  return DEFAULT_LANGUAGE_CODE;
}

export function isRtlLanguage(language: string | null | undefined): boolean {
  return RTL_LANGUAGE_CODES.has(normalizeLanguageCode(language));
}

function parseAcceptLanguageHeader(acceptLanguageHeader: string | null | undefined): string[] {
  if (!acceptLanguageHeader) {
    return [];
  }

  return acceptLanguageHeader
    .split(",")
    .map((part) => {
      const [localePart, ...parameterParts] = part.trim().split(";");
      const qualityPart = parameterParts.find((parameter) => parameter.trim().startsWith("q="));
      const quality = qualityPart ? Number.parseFloat(qualityPart.trim().slice(2)) : 1;

      return {
        locale: localePart?.trim() ?? "",
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((candidate) => candidate.locale && candidate.quality > 0)
    .sort((left, right) => right.quality - left.quality)
    .map((candidate) => candidate.locale);
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

export function getLanguageFromCookieHeader(
  cookieHeader: string | null | undefined,
): SupportedLanguageCode | null {
  const cookies = parseCookieHeader(cookieHeader);
  return resolveSupportedLanguageCode(cookies[LANGUAGE_COOKIE_NAME]);
}

export function createLanguageCookieValue(language: string | null | undefined): string | null {
  const normalizedLanguage = resolveSupportedLanguageCode(language);
  if (!normalizedLanguage) {
    return null;
  }

  return `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(normalizedLanguage)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function resolveRequestLanguage(input: {
  queryLanguage?: string | null | undefined;
  cookieHeader?: string | null | undefined;
  acceptLanguageHeader?: string | null | undefined;
}): SupportedLanguageCode {
  const queryLanguage = resolveSupportedLanguageCode(input.queryLanguage);
  if (queryLanguage) {
    return queryLanguage;
  }

  const cookieLanguage = getLanguageFromCookieHeader(input.cookieHeader);
  if (cookieLanguage) {
    return cookieLanguage;
  }

  const acceptLanguageCandidates = parseAcceptLanguageHeader(input.acceptLanguageHeader);
  return resolveAutomaticLanguage(acceptLanguageCandidates, acceptLanguageCandidates[0] ?? null);
}
