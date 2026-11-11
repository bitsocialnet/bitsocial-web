import React, { useEffect, type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  getDocsPathLanguage,
  getLocalizedDocsPath,
  getQueryLanguage,
  getSupportedLanguageEntry,
  resolveDocsPreviewMode,
  isDocsNotFoundPath,
  persistDocsLanguage,
  persistDocsLanguageChoice,
  resolveDocsLanguage,
  stripLanguageQueryParam,
} from "../lib/docsLanguage";

function DocsLanguageSync() {
  const location = useLocation();
  const {
    i18n: { currentLocale, defaultLocale },
    siteConfig,
  } = useDocusaurusContext();
  const previewMode = resolveDocsPreviewMode(siteConfig.customFields?.docsPreviewMode);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const currentLanguage = getSupportedLanguageEntry(currentLocale).code;
    const nextSearch = stripLanguageQueryParam(location.search);

    if (previewMode === "live") {
      const targetPathname = getLocalizedDocsPath(location.pathname, currentLanguage);
      const targetUrl = `${targetPathname}${nextSearch}${location.hash}`;
      const currentUrl = `${location.pathname}${location.search}${location.hash}`;

      if (targetUrl !== currentUrl) {
        persistDocsLanguage(currentLanguage);
        window.location.replace(targetUrl);
        return;
      }

      const language = getSupportedLanguageEntry(currentLanguage);
      persistDocsLanguage(language.code);
      document.documentElement.lang = language.code;
      document.documentElement.dir = language.dir === "rtl" ? "rtl" : "ltr";
      return;
    }

    const queryLanguage = getQueryLanguage(location.search);
    const fallbackLanguage = resolveDocsLanguage(nextSearch);
    const targetLanguage =
      queryLanguage ?? (currentLanguage !== defaultLocale ? currentLanguage : fallbackLanguage);
    const targetPathname = isDocsNotFoundPath(location.pathname)
      ? getLocalizedDocsPath("/404/", targetLanguage)
      : getLocalizedDocsPath(location.pathname, targetLanguage);
    const targetUrl = `${targetPathname}${nextSearch}${location.hash}`;
    const currentUrl = `${location.pathname}${location.search}${location.hash}`;
    const shouldRedirect =
      targetUrl !== currentUrl &&
      (queryLanguage !== null ||
        (currentLanguage === defaultLocale && targetLanguage !== currentLanguage));

    if (shouldRedirect) {
      let redirectUrl = targetUrl;
      if (queryLanguage === null) {
        persistDocsLanguage(targetLanguage);
      } else {
        redirectUrl = persistDocsLanguageChoice(queryLanguage, targetUrl);
      }

      // The router decodes location.pathname, while a URL with ?lang= added comes back
      // percent-encoded, so compare what the browser would load.
      if (new URL(redirectUrl, window.location.href).href !== window.location.href) {
        window.location.replace(redirectUrl);
        return;
      }
    }

    const language = getSupportedLanguageEntry(currentLanguage);
    // A host can answer a dead localized link with the default-locale 404 page; that page must not
    // replace the reader's stored language.
    if (getDocsPathLanguage(location.pathname) === language.code) {
      persistDocsLanguage(language.code);
    }
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir === "rtl" ? "rtl" : "ltr";
  }, [
    currentLocale,
    defaultLocale,
    location.hash,
    location.pathname,
    location.search,
    previewMode,
  ]);

  return null;
}

export default function Root({ children }: { children: ReactNode }): ReactNode {
  const content = (
    <>
      <DocsLanguageSync />
      {children}
    </>
  );
  const profiler =
    __REACT_PERF_ENABLED__ && typeof window !== "undefined" ? window.__REACT_PERF__ : undefined;
  return profiler ? (
    <React.Profiler id="docs" onRender={profiler.onProfilerRender}>
      {content}
    </React.Profiler>
  ) : (
    content
  );
}
