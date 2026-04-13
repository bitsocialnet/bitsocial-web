import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import { createInstance, type i18n as I18nInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { StaticRouter } from "react-router-dom/server";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/app";
import {
  getDirectionForLanguage,
  createBootstrapPayload,
  getDocumentLanguageAttributes,
  getNewsletterBootstrapFlags,
  renderBootstrapPayload,
  type BootstrapPayload,
} from "@/lib/bootstrap";
import { createLanguageCookieValue, resolveRequestLanguage } from "@/lib/locales";
import { getSeoMetadata, injectSeoHead } from "@/lib/seo";
import { resolveRequestTheme } from "@/lib/theme";
import { GraphicsModeProvider } from "@/lib/graphics-mode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveRuntimePaths() {
  const distTemplatePath = path.resolve(__dirname, "../index.html");
  const distTranslationsDirectory = path.resolve(__dirname, "../translations");

  if (existsSync(distTemplatePath) && existsSync(distTranslationsDirectory)) {
    return {
      clientTemplatePath: distTemplatePath,
      translationsDirectory: distTranslationsDirectory,
    };
  }

  return {
    clientTemplatePath: path.resolve(__dirname, "../../index.html"),
    translationsDirectory: path.resolve(__dirname, "../../public/translations"),
  };
}

const { clientTemplatePath: CLIENT_TEMPLATE_PATH, translationsDirectory: TRANSLATIONS_DIRECTORY } =
  resolveRuntimePaths();

interface RenderRequest {
  url: string;
  headers?: Record<string, string | string[] | undefined>;
  templateHtml?: string;
}

function AnimationGate({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}

function getHeaderValue(
  headers: Record<string, string | string[] | undefined> | undefined,
  name: string,
) {
  const headerValue = headers?.[name];
  if (Array.isArray(headerValue)) {
    return headerValue[0];
  }

  return headerValue;
}

async function readLocaleResources(language: string) {
  const translationPath = path.join(TRANSLATIONS_DIRECTORY, language, "default.json");
  const contents = await readFile(translationPath, "utf8");
  return JSON.parse(contents) as Record<string, unknown>;
}

async function createServerI18n(payload: BootstrapPayload) {
  const instance = createInstance();

  await instance.use(initReactI18next).init({
    fallbackLng: payload.locale,
    lng: payload.locale,
    debug: false,
    resources: {
      [payload.locale]: {
        translation: payload.i18n.resources,
      },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return instance;
}

function renderApplication(url: string, i18nInstance: I18nInstance) {
  return renderToString(
    <React.StrictMode>
      <I18nextProvider i18n={i18nInstance}>
        <ThemeProvider>
          <GraphicsModeProvider>
            <AnimationGate>
              <StaticRouter location={url}>
                <AppShell enableClientEffects={false} includeAnalytics={false} />
              </StaticRouter>
            </AnimationGate>
          </GraphicsModeProvider>
        </ThemeProvider>
      </I18nextProvider>
    </React.StrictMode>,
  );
}

function injectHtmlAttributes(
  template: string,
  payload: BootstrapPayload,
  theme: "light" | "dark" | null,
) {
  const attributes = [getDocumentLanguageAttributes(payload)];
  if (theme === "dark") {
    attributes.push('class="dark"');
  }

  return template.replace(/<html\b[^>]*>/, `<html ${attributes.join(" ")}>`);
}

export async function renderAboutRequest(request: RenderRequest) {
  const requestUrl = new URL(request.url, "https://bitsocial.net");
  const queryLanguage = requestUrl.searchParams.get("lang");
  const queryTheme = requestUrl.searchParams.get("theme");
  const locale = resolveRequestLanguage({
    queryLanguage,
    cookieHeader: getHeaderValue(request.headers, "cookie"),
    acceptLanguageHeader: getHeaderValue(request.headers, "accept-language"),
  });
  const theme = resolveRequestTheme({
    queryTheme,
    cookieHeader: getHeaderValue(request.headers, "cookie"),
  });
  const resources = await readLocaleResources(locale);
  const bootstrapPayload = createBootstrapPayload({
    locale,
    pathname: requestUrl.pathname,
    search: requestUrl.search,
    hash: "",
    resources,
    newsletter: getNewsletterBootstrapFlags(process.env),
  });
  const i18nInstance = await createServerI18n(bootstrapPayload);
  const appHtml = renderApplication(`${requestUrl.pathname}${requestUrl.search}`, i18nInstance);
  const seo = getSeoMetadata(requestUrl.pathname, requestUrl.search);
  const template = request.templateHtml ?? (await readFile(CLIENT_TEMPLATE_PATH, "utf8"));
  const htmlWithSeo = injectSeoHead(template, seo);
  const htmlWithAttributes = injectHtmlAttributes(htmlWithSeo, bootstrapPayload, theme);
  const html = htmlWithAttributes
    .replace("<!--app-html-->", appHtml)
    .replace("<!--app-bootstrap-->", renderBootstrapPayload(bootstrapPayload));
  const languageCookie = createLanguageCookieValue(queryLanguage);

  return {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      Vary: "Accept-Language, Cookie",
      ...(languageCookie ? { "Set-Cookie": languageCookie } : {}),
      "X-Bitsocial-Locale": locale,
      "X-Bitsocial-Dir": getDirectionForLanguage(locale),
    },
    body: html,
  };
}
