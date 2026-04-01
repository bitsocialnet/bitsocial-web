import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import {
  DEFAULT_LANGUAGE_CODE,
  LANGUAGE_QUERY_PARAM,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGE_CODES,
  isRtlLanguage,
  normalizeLanguageCode,
  resolveAutomaticLanguage,
} from "@/lib/locales";

const REGION_AWARE_NAVIGATOR_DETECTOR_NAME = "bitsocialRegionAwareNavigator";

function getResolvedBrowserLocale(): string | null {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale || null;
  } catch {
    return null;
  }
}

function getBrowserLocaleCandidates(): string[] {
  const candidates = [
    navigator.language,
    getResolvedBrowserLocale(),
    ...(navigator.languages ?? []),
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

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: REGION_AWARE_NAVIGATOR_DETECTOR_NAME,
  lookup() {
    const localeCandidates = getBrowserLocaleCandidates();
    const primaryRegionLocale = navigator.language || getResolvedBrowserLocale();

    return resolveAutomaticLanguage(localeCandidates, primaryRegionLocale);
  },
});

function updateDocumentDirection(language: string | null | undefined) {
  const normalizedLanguage = normalizeLanguageCode(language);
  const dir = isRtlLanguage(normalizedLanguage) ? "rtl" : "ltr";

  document.documentElement.dir = dir;
  document.documentElement.lang = normalizedLanguage;
}

void i18n
  .use(HttpBackend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE_CODE,
    debug: import.meta.env.DEV,
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
    cleanCode: true,
    load: "languageOnly",
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: false,
    },

    backend: {
      loadPath: "/translations/{{lng}}/default.json",
    },

    detection: {
      order: ["querystring", "localStorage", REGION_AWARE_NAVIGATOR_DETECTOR_NAME],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      lookupQuerystring: LANGUAGE_QUERY_PARAM,
      convertDetectedLanguage: normalizeLanguageCode,
    },
  })
  .then(() => {
    updateDocumentDirection(i18n.resolvedLanguage ?? i18n.language);
  });

i18n.on("languageChanged", updateDocumentDirection);
