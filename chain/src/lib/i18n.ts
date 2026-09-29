import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import {
  DEFAULT_LANGUAGE_CODE,
  createLanguageCookieValue,
  LANGUAGE_QUERY_PARAM,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGE_CODES,
  isRtlLanguage,
  normalizeLanguageCode,
  resolveAutomaticLanguage,
} from "@/lib/locales";

const BROWSER_LANGUAGE_DETECTOR_NAME = "bitsocialBrowserLanguage";

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
    ...(navigator.languages ?? []),
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

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: BROWSER_LANGUAGE_DETECTOR_NAME,
  lookup() {
    return resolveAutomaticLanguage(getBrowserLocaleCandidates());
  },
});

function updateDocumentDirection(language: string | null | undefined) {
  const normalizedLanguage = normalizeLanguageCode(language);
  const dir = isRtlLanguage(normalizedLanguage) ? "rtl" : "ltr";

  document.documentElement.dir = dir;
  document.documentElement.lang = normalizedLanguage;
}

// Keeps the tab title and search snippet in the active language. The static English values in
// index.html remain the fallback until translations load (or if they fail to load).
function updateDocumentMeta() {
  // `languageChanged` also fires while `init` is still running, before resources are usable.
  if (!i18n.isInitialized || !i18n.exists("meta.title")) {
    return;
  }

  document.title = i18n.t("meta.title");
  document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.setAttribute("content", i18n.t("meta.description"));
}

let i18nReadyPromise: Promise<typeof i18n> | null = null;

export function initializeClientI18n() {
  if (!i18nReadyPromise) {
    i18n.use(HttpBackend).use(languageDetector).use(initReactI18next);

    i18nReadyPromise = i18n
      .init({
        fallbackLng: DEFAULT_LANGUAGE_CODE,
        debug: import.meta.env.DEV,
        showSupportNotice: false,
        supportedLngs: SUPPORTED_LANGUAGE_CODES,
        cleanCode: true,
        load: "languageOnly",
        nonExplicitSupportedLngs: true,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        backend: {
          loadPath: "/translations/{{lng}}/default.json",
        },
        detection: {
          order: ["querystring", "localStorage", BROWSER_LANGUAGE_DETECTOR_NAME],
          caches: ["localStorage"],
          lookupLocalStorage: LANGUAGE_STORAGE_KEY,
          lookupQuerystring: LANGUAGE_QUERY_PARAM,
          convertDetectedLanguage: normalizeLanguageCode,
        },
      })
      .then(() => {
        updateDocumentDirection(i18n.resolvedLanguage ?? i18n.language);
        updateDocumentMeta();
        return i18n;
      })
      .catch((error) => {
        console.error("Failed to initialize translations before first render.", error);
        updateDocumentDirection(i18n.resolvedLanguage ?? i18n.language);
        return i18n;
      });
  }

  return i18nReadyPromise;
}

export const i18nReady = initializeClientI18n();

i18n.on("languageChanged", updateDocumentDirection);
i18n.on("languageChanged", updateDocumentMeta);
i18n.on("languageChanged", (language) => {
  const normalizedLanguage = normalizeLanguageCode(language);

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  } catch {
    // Ignore storage failures in restricted browsing modes.
  }

  const cookieValue = createLanguageCookieValue(normalizedLanguage);
  if (!cookieValue) {
    return;
  }

  try {
    document.cookie = cookieValue;
  } catch {
    // Ignore cookie failures in restricted browsing modes.
  }
});

export default i18n;
