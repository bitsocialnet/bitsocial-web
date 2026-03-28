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

export const DEFAULT_LANGUAGE_CODE: SupportedLanguageCode = "en";

const SUPPORTED_LANGUAGE_CODE_SET = new Set<string>(SUPPORTED_LANGUAGE_CODES);
const RTL_LANGUAGE_CODES = new Set<SupportedLanguageCode>(["ar", "fa", "he", "ur"]);

export function normalizeLanguageCode(language: string | null | undefined): SupportedLanguageCode {
  if (!language) {
    return DEFAULT_LANGUAGE_CODE;
  }

  const normalizedLanguage = language.trim().toLowerCase().replace(/_/g, "-");

  if (SUPPORTED_LANGUAGE_CODE_SET.has(normalizedLanguage)) {
    return normalizedLanguage as SupportedLanguageCode;
  }

  const [baseLanguage] = normalizedLanguage.split("-");
  if (baseLanguage && SUPPORTED_LANGUAGE_CODE_SET.has(baseLanguage)) {
    return baseLanguage as SupportedLanguageCode;
  }

  return DEFAULT_LANGUAGE_CODE;
}

export function isRtlLanguage(language: string | null | undefined): boolean {
  return RTL_LANGUAGE_CODES.has(normalizeLanguageCode(language));
}
