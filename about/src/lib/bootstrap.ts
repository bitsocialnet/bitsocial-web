import {
  DEFAULT_LANGUAGE_CODE,
  isRtlLanguage,
  normalizeLanguageCode,
  type SupportedLanguageCode,
} from "@/lib/locales";

const BOOTSTRAP_TEMPLATE_ID = "bitsocial-bootstrap";

export interface BootstrapUrlState {
  pathname: string;
  search: string;
  hash: string;
}

export interface BootstrapPayload {
  locale: SupportedLanguageCode;
  dir: "ltr" | "rtl";
  url: BootstrapUrlState;
  i18n: {
    resources: Record<string, unknown>;
  };
  newsletter: {
    isConfigured: boolean;
    requiresConfirmation: boolean;
  };
  clientDefaults: {
    graphicsMode: "pending";
  };
}

declare global {
  interface Window {
    __BITSOCIAL_BOOTSTRAP__?: BootstrapPayload;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getDirectionForLanguage(language: string | null | undefined): "ltr" | "rtl" {
  return isRtlLanguage(language) ? "rtl" : "ltr";
}

export function createBootstrapPayload(input: {
  locale?: string | null;
  pathname: string;
  search?: string;
  hash?: string;
  resources?: Record<string, unknown>;
  newsletter?: {
    isConfigured?: boolean;
    requiresConfirmation?: boolean;
  };
}): BootstrapPayload {
  const locale = normalizeLanguageCode(input.locale ?? DEFAULT_LANGUAGE_CODE);

  return {
    locale,
    dir: getDirectionForLanguage(locale),
    url: {
      pathname: input.pathname,
      search: input.search ?? "",
      hash: input.hash ?? "",
    },
    i18n: {
      resources: input.resources ?? {},
    },
    newsletter: {
      isConfigured: input.newsletter?.isConfigured ?? false,
      requiresConfirmation: input.newsletter?.requiresConfirmation ?? false,
    },
    clientDefaults: {
      graphicsMode: "pending",
    },
  };
}

export function renderBootstrapPayload(payload: BootstrapPayload) {
  return escapeHtml(JSON.stringify(payload));
}

export function getClientBootstrapPayload(): BootstrapPayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.__BITSOCIAL_BOOTSTRAP__) {
    return window.__BITSOCIAL_BOOTSTRAP__;
  }

  const template = document.getElementById(BOOTSTRAP_TEMPLATE_ID);
  const rawPayload = template?.textContent?.trim();
  if (!rawPayload) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(rawPayload) as BootstrapPayload;
    window.__BITSOCIAL_BOOTSTRAP__ = parsedPayload;
    return parsedPayload;
  } catch {
    return null;
  }
}

export function getDocumentLanguageAttributes(payload: Pick<BootstrapPayload, "locale" | "dir">) {
  return `lang="${payload.locale}" dir="${payload.dir}"`;
}

export function getNewsletterBootstrapFlags(environment: Record<string, string | undefined>) {
  const subscribeUrl = environment.VITE_NEWSLETTER_SUBSCRIBE_URL?.trim() ?? "";
  const listUuids =
    environment.VITE_NEWSLETTER_LIST_UUIDS?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  return {
    isConfigured: subscribeUrl.length > 0 && listUuids.length > 0,
    requiresConfirmation: environment.VITE_NEWSLETTER_CONFIRMATION_REQUIRED === "true",
  };
}
