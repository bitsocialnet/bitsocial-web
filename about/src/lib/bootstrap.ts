import {
  DEFAULT_LANGUAGE_CODE,
  isRtlLanguage,
  normalizeLanguageCode,
  type SupportedLanguageCode,
} from "@/lib/locales";
import type { SupportedThemeMode } from "@/lib/theme";

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
    graphicsMode: "pending" | "fallback";
    /** The theme the server rendered with, when a cookie or the query named one. */
    theme: SupportedThemeMode | null;
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
  graphicsMode?: "pending" | "fallback";
  theme?: SupportedThemeMode | null;
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
      graphicsMode: input.graphicsMode ?? "pending",
      theme: input.theme ?? null,
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
  // The parser puts a <template>'s children in its content fragment, so the element itself has
  // no text of its own.
  const rawPayload = (
    template instanceof HTMLTemplateElement ? template.content : template
  )?.textContent?.trim();
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

let serverRenderPayload: BootstrapPayload | null = null;

/** Set around the synchronous server render so components can read the request's payload. */
export function setServerRenderBootstrapPayload(payload: BootstrapPayload | null) {
  serverRenderPayload = payload;
}

/** The payload of the render in progress: the request's on the server, the page's in the browser. */
export function getRenderBootstrapPayload(): BootstrapPayload | null {
  return serverRenderPayload ?? getClientBootstrapPayload();
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
