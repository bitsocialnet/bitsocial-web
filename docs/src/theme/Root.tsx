import React, { useEffect, type ReactNode } from "react";
import { useHistory, useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  getLocalizedDocsPath,
  getQueryLanguage,
  getSupportedLanguageEntry,
  isDocsNotFoundPath,
  persistDocsLanguage,
  resolveDocsLanguage,
  stripLanguageQueryParam,
} from "../lib/docsLanguage";

function DocsLanguageSync() {
  const history = useHistory();
  const location = useLocation();
  const {
    i18n: { currentLocale, defaultLocale },
  } = useDocusaurusContext();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const currentLanguage = getSupportedLanguageEntry(currentLocale).code;
    const queryLanguage = getQueryLanguage(location.search);
    const nextSearch = stripLanguageQueryParam(location.search);
    const fallbackLanguage = resolveDocsLanguage(nextSearch);
    const targetLanguage =
      queryLanguage ?? (currentLanguage !== defaultLocale ? currentLanguage : fallbackLanguage);
    const targetPathname = isDocsNotFoundPath(location.pathname)
      ? getLocalizedDocsPath("/docs/404/", targetLanguage)
      : getLocalizedDocsPath(location.pathname, targetLanguage);
    const targetUrl = `${targetPathname}${nextSearch}${location.hash}`;
    const currentUrl = `${location.pathname}${location.search}${location.hash}`;
    const shouldRedirect =
      targetUrl !== currentUrl &&
      (queryLanguage !== null ||
        (currentLanguage === defaultLocale && targetLanguage !== currentLanguage));

    if (shouldRedirect) {
      persistDocsLanguage(targetLanguage);
      history.replace(targetUrl);
      return;
    }

    const language = getSupportedLanguageEntry(currentLanguage);
    persistDocsLanguage(language.code);
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir === "rtl" ? "rtl" : "ltr";
  }, [currentLocale, defaultLocale, history, location.hash, location.pathname, location.search]);

  return null;
}

export default function Root({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      <DocsLanguageSync />
      {children}
    </>
  );
}
