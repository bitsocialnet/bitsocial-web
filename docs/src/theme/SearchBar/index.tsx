import React, { useEffect, useMemo, useRef } from "react";
import { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { usePagefindPaths } from "../../lib/pagefindPaths";
import { usePagefindUi } from "../../lib/usePagefindUi";
import styles from "./styles.module.css";

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function SearchBar() {
  const { bundlePath, scriptUrl, styleUrl } = usePagefindPaths();
  const searchPageHref = useBaseUrl("/search/");
  const containerRef = useRef<HTMLDivElement>(null);
  const shortcutLabel =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
      ? "Cmd K"
      : "Ctrl K";
  const uiOptions = useMemo(
    () => ({
      showImages: false,
      showSubResults: true,
      pageSize: 5,
      translations: {
        placeholder: translate({
          id: "docs.navbarSearch.placeholder",
          message: "Search docs",
          description: "Placeholder shown inside the navbar docs search input.",
        }),
        zero_results: translate({
          id: "docs.navbarSearch.zeroResults",
          message: "No matching docs yet.",
          description: "Message shown when the navbar docs search has no matches.",
        }),
        load_more: translate({
          id: "docs.navbarSearch.loadMore",
          message: "More results",
          description: "Button label to load more results in the navbar docs search drawer.",
        }),
      },
    }),
    [],
  );
  const { isClient, status } = usePagefindUi({
    bundlePath,
    scriptUrl,
    styleUrl,
    containerRef,
    uiOptions,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const focusSearchInput = () => {
      const input = containerRef.current?.querySelector<HTMLInputElement>(
        ".pagefind-ui__search-input",
      );
      if (!input) {
        return false;
      }

      input.focus();
      input.select();
      return true;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isShortcut) {
        return;
      }

      event.preventDefault();
      if (!focusSearchInput()) {
        window.location.assign(searchPageHref);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchPageHref]);

  return (
    <div className={styles.searchShell} data-status={status}>
      <span className={styles.icon}>
        <SearchGlyph />
      </span>
      <div className={styles.mount}>{isClient ? <div ref={containerRef} /> : null}</div>
      {status !== "ready" ? (
        <a
          href={searchPageHref}
          className={styles.placeholder}
          aria-label={translate({
            id: "docs.navbarSearch.linkAriaLabel",
            message: "Search docs",
            description: "ARIA label for the fallback navbar docs search link.",
          })}
        >
          {translate({
            id: "docs.navbarSearch.linkLabel",
            message: "Search docs",
            description: "Label for the fallback navbar docs search link.",
          })}
        </a>
      ) : null}
      <a
        href={searchPageHref}
        className={styles.mobileLink}
        aria-label={translate({
          id: "docs.navbarSearch.mobileLinkAriaLabel",
          message: "Open docs search",
          description: "ARIA label for the compact mobile docs search trigger.",
        })}
      >
        <SearchGlyph />
      </a>
      <kbd className={styles.shortcut}>{shortcutLabel}</kbd>
    </div>
  );
}
