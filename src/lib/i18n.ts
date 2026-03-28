import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import {
  DEFAULT_LANGUAGE_CODE,
  SUPPORTED_LANGUAGE_CODES,
  isRtlLanguage,
  normalizeLanguageCode,
} from "@/lib/locales";

function updateDocumentDirection(language: string | null | undefined) {
  const normalizedLanguage = normalizeLanguageCode(language);
  const dir = isRtlLanguage(normalizedLanguage) ? "rtl" : "ltr";

  document.documentElement.dir = dir;
  document.documentElement.lang = normalizedLanguage;
}

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
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
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
      lookupQuerystring: "lang",
      convertDetectedLanguage: normalizeLanguageCode,
    },
  })
  .then(() => {
    updateDocumentDirection(i18n.resolvedLanguage ?? i18n.language);
  });

i18n.on("languageChanged", updateDocumentDirection);
