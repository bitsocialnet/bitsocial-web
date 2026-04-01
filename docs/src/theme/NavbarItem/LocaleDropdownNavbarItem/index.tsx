import React, { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import { useHistory, useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import type { Props } from "@theme/NavbarItem/LocaleDropdownNavbarItem";
import {
  getLocalizedDocsPath,
  getSupportedLanguageEntry,
  isDocsNotFoundPath,
  persistDocsLanguage,
  stripLanguageQueryParam,
  SUPPORTED_LANGUAGES,
} from "../../../lib/docsLanguage";
import styles from "./styles.module.css";

interface LanguageOption {
  code: string;
  dir?: "rtl";
  href: string;
  label: string;
}

function GlobeGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5c2.6 2.5 4 5.6 4 8.5s-1.4 6-4 8.5c-2.6-2.5-4-5.6-4-8.5s1.4-6 4-8.5Z" />
      <path d="M4 9.25h16" />
      <path d="M4 14.75h16" />
    </svg>
  );
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.25 4.25" />
    </svg>
  );
}

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className={className}
    >
      <path d="m5 12.5 4.1 4.1L19 6.8" />
    </svg>
  );
}

function ChevronGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

export default function LocaleDropdownNavbarItem({ mobile, className }: Props): ReactNode {
  const history = useHistory();
  const location = useLocation();
  const {
    i18n: { currentLocale, locales },
  } = useDocusaurusContext();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogTitleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentLanguage = getSupportedLanguageEntry(currentLocale);
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

  const languageOptions = useMemo<LanguageOption[]>(() => {
    const nextSearch = stripLanguageQueryParam(location.search);

    return SUPPORTED_LANGUAGES.filter((language) => locales.includes(language.code)).map(
      (language) => ({
        ...language,
        href: `${getLocalizedDocsPath(
          isDocsNotFoundPath(location.pathname) ? "/docs/404/" : location.pathname,
          language.code,
        )}${nextSearch}${location.hash}`,
      }),
    );
  }, [locales, location.hash, location.pathname, location.search]);

  const filteredLanguages = useMemo(() => {
    if (normalizedQuery === "") {
      return languageOptions;
    }

    return languageOptions.filter((language) => {
      const label = language.label.toLocaleLowerCase();
      const code = language.code.toLocaleLowerCase();
      return label.includes(normalizedQuery) || code.includes(normalizedQuery);
    });
  }, [languageOptions, normalizedQuery]);

  const effectiveActiveIndex =
    filteredLanguages.length === 0 ? -1 : Math.min(activeIndex, filteredLanguages.length - 1);
  const activeLanguage = effectiveActiveIndex >= 0 ? filteredLanguages[effectiveActiveIndex] : null;

  const resetPanelState = () => {
    setSearchQuery("");
    setActiveIndex(0);
  };

  const closePanel = () => {
    setOpen(false);
    resetPanelState();
  };

  const openPanel = () => {
    const selectedIndex = languageOptions.findIndex(
      (language) => language.code === currentLanguage.code,
    );
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const navigateToLanguage = (language: LanguageOption) => {
    persistDocsLanguage(language.code);
    closePanel();
    history.push(language.href);
  };

  useEffect(() => {
    setOpen(false);
    setSearchQuery("");
    setActiveIndex(0);
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open || effectiveActiveIndex < 0) {
      return;
    }

    optionRefs.current[effectiveActiveIndex]?.scrollIntoView({ block: "nearest" });
  }, [effectiveActiveIndex, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      setOpen(false);
      setSearchQuery("");
      setActiveIndex(0);
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [open]);

  const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (filteredLanguages.length === 0) {
      return;
    }

    const isNextKey = event.key === "ArrowDown" || event.key === "ArrowRight";
    const isPreviousKey = event.key === "ArrowUp" || event.key === "ArrowLeft";

    if (isNextKey || isPreviousKey) {
      event.preventDefault();
      const direction = isNextKey ? 1 : -1;
      const length = filteredLanguages.length;
      setActiveIndex((current) => {
        const normalizedIndex = Math.min(Math.max(0, current), length - 1);
        if (direction === 1) {
          return normalizedIndex >= length - 1 ? 0 : normalizedIndex + 1;
        }
        return normalizedIndex <= 0 ? length - 1 : normalizedIndex - 1;
      });
      return;
    }

    if (event.key === "Enter" && event.target === inputRef.current && activeLanguage) {
      event.preventDefault();
      navigateToLanguage(activeLanguage);
    }
  };

  const triggerLabel = mobile
    ? translate({
        id: "docs.languageSelector.mobileLabel",
        message: "Languages",
        description: "Label for the mobile docs language selector trigger.",
      })
    : currentLanguage.label;
  const panelTitle = translate({
    id: "docs.languageSelector.title",
    message: "Choose language",
    description: "Title shown in the docs language selector panel.",
  });
  const searchPlaceholder = translate({
    id: "docs.languageSelector.searchPlaceholder",
    message: "Search languages",
    description: "Placeholder shown in the docs language selector search input.",
  });
  const emptyStateLabel = translate({
    id: "docs.languageSelector.emptyState",
    message: "No languages match your search.",
    description: "Empty state shown when the docs language selector finds no language matches.",
  });

  return (
    <>
      <button
        type="button"
        className={clsx(
          mobile ? "menu__link" : "navbar__link",
          styles.trigger,
          mobile ? styles.triggerMobile : styles.triggerDesktop,
          open && styles.triggerOpen,
          className,
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={dialogTitleId}
        onClick={() => {
          if (open) {
            closePanel();
            return;
          }

          openPanel();
        }}
      >
        <span className={styles.triggerInner}>
          <GlobeGlyph className={styles.triggerIcon} />
          <span className={styles.triggerText}>
            <span className={styles.triggerLabel}>{triggerLabel}</span>
            {mobile ? <span className={styles.triggerCurrent}>{currentLanguage.label}</span> : null}
          </span>
        </span>
        <ChevronGlyph className={clsx(styles.chevron, open && styles.chevronOpen)} />
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div className={styles.overlay} onKeyDownCapture={handlePanelKeyDown}>
              <button
                type="button"
                aria-label={translate({
                  id: "docs.languageSelector.closeBackdrop",
                  message: "Close language selector",
                  description: "Accessible label for the language selector backdrop close button.",
                })}
                className={styles.backdrop}
                onClick={closePanel}
              />
              <div
                id={dialogTitleId}
                className={clsx(styles.panel, mobile && styles.panelMobile)}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${dialogTitleId}-title`}
              >
                <div className={styles.header}>
                  <div>
                    <p className={styles.eyebrow}>
                      {translate({
                        id: "docs.languageSelector.eyebrow",
                        message: "Bitsocial docs",
                        description: "Eyebrow label shown above the docs language selector title.",
                      })}
                    </p>
                    <h2 id={`${dialogTitleId}-title`} className={styles.title}>
                      {panelTitle}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className={styles.closeButton}
                    aria-label={translate({
                      id: "docs.languageSelector.closeButton",
                      message: "Close",
                      description: "Label for the language selector close button.",
                    })}
                    onClick={closePanel}
                  >
                    <CloseGlyph className={styles.closeIcon} />
                  </button>
                </div>
                <label className={styles.searchShell}>
                  <SearchGlyph className={styles.searchIcon} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    autoComplete="off"
                    spellCheck={false}
                    className={styles.searchInput}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setActiveIndex(0);
                    }}
                  />
                </label>
                <div className={styles.list}>
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((language, index) => {
                      const isCurrentLanguage = language.code === currentLanguage.code;
                      const isActiveLanguage = index === effectiveActiveIndex;

                      return (
                        <button
                          key={language.code}
                          ref={(node) => {
                            optionRefs.current[index] = node;
                          }}
                          type="button"
                          dir={language.dir}
                          className={clsx(
                            styles.option,
                            isActiveLanguage && styles.optionActive,
                            isCurrentLanguage && styles.optionCurrent,
                          )}
                          onClick={() => navigateToLanguage(language)}
                          onMouseEnter={() => setActiveIndex(index)}
                        >
                          <span className={styles.optionText}>
                            <span className={styles.optionLabel}>{language.label}</span>
                            <span className={styles.optionMeta}>{language.code.toUpperCase()}</span>
                          </span>
                          {isCurrentLanguage ? <CheckGlyph className={styles.checkIcon} /> : null}
                        </button>
                      );
                    })
                  ) : (
                    <p className={styles.emptyState}>{emptyStateLabel}</p>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
