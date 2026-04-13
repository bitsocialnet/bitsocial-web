import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { getClientBootstrapPayload, type BootstrapPayload } from "@/lib/bootstrap";
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

let i18nReadyPromise: Promise<typeof i18n> | null = null;

function createBaseConfig(bootstrapPayload?: BootstrapPayload | null) {
  return {
    fallbackLng: DEFAULT_LANGUAGE_CODE,
    lng: bootstrapPayload?.locale,
    debug: import.meta.env.DEV,
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
    cleanCode: true,
    load: "languageOnly" as const,
    nonExplicitSupportedLngs: true,
    resources: bootstrapPayload
      ? {
          [bootstrapPayload.locale]: {
            translation: bootstrapPayload.i18n.resources,
          },
        }
      : undefined,

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    backend: {
      loadPath: "/translations/{{lng}}/default.json",
    },
  };
}

function initWithBrowserDetection() {
  i18n.use(HttpBackend).use(languageDetector).use(initReactI18next);

  return i18n.init({
    ...createBaseConfig(),
    detection: {
      order: ["querystring", "localStorage", REGION_AWARE_NAVIGATOR_DETECTOR_NAME],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      lookupQuerystring: LANGUAGE_QUERY_PARAM,
      convertDetectedLanguage: normalizeLanguageCode,
    },
  });
}

function initWithBootstrapPayload(bootstrapPayload: BootstrapPayload) {
  i18n.use(HttpBackend).use(initReactI18next);

  return i18n.init(createBaseConfig(bootstrapPayload));
}

export function initializeClientI18n(bootstrapPayload = getClientBootstrapPayload()) {
  if (!i18nReadyPromise) {
    i18nReadyPromise = (
      bootstrapPayload ? initWithBootstrapPayload(bootstrapPayload) : initWithBrowserDetection()
    )
      .then(() => {
        updateDocumentDirection(bootstrapPayload?.locale ?? i18n.resolvedLanguage ?? i18n.language);
        return i18n;
      })
      .catch((error) => {
        console.error("Failed to initialize translations before first render.", error);
        updateDocumentDirection(bootstrapPayload?.locale ?? i18n.resolvedLanguage ?? i18n.language);
        return i18n;
      });
  }

  return i18nReadyPromise;
}

export const i18nReady = initializeClientI18n();

i18n.on("languageChanged", updateDocumentDirection);
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
