import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Globe, Check, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_LANGUAGE_CODE,
  getSupportedLanguage,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/lib/locales";
import { cn } from "@/lib/utils";

type LanguageEntry = SupportedLanguage;

const DEFAULT_LANGUAGE = getSupportedLanguage(DEFAULT_LANGUAGE_CODE);

function getLanguageEntry(code: string | null | undefined): LanguageEntry {
  return getSupportedLanguage(normalizeLanguageCode(code)) ?? DEFAULT_LANGUAGE;
}

export default function LanguageSelector({ mobile }: { mobile?: boolean }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listScrollRef = useRef<HTMLDivElement>(null);
  const focusSearchAfterOpenTimerRef = useRef<number | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [showListBottomFade, setShowListBottomFade] = useState(false);
  const currentLanguageCode = normalizeLanguageCode(i18n.resolvedLanguage ?? i18n.language);

  const currentLanguage = getLanguageEntry(currentLanguageCode);

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (query === "") {
      return SUPPORTED_LANGUAGES;
    }
    return SUPPORTED_LANGUAGES.filter(
      (lang) => lang.label.toLowerCase().includes(query) || lang.code.toLowerCase().includes(query),
    );
  }, [searchQuery]);
  const effectiveActiveIndex =
    filteredLanguages.length === 0 ? -1 : Math.min(activeIndex, filteredLanguages.length - 1);
  const activeLanguage = effectiveActiveIndex >= 0 ? filteredLanguages[effectiveActiveIndex] : null;

  const handleLanguageChange = useCallback(
    (code: string) => {
      i18n.changeLanguage(code);
      setOpen(false);
      setSearchQuery("");
      setActiveIndex(0);
    },
    [i18n],
  );

  useEffect(() => {
    return () => {
      if (focusSearchAfterOpenTimerRef.current !== null) {
        window.clearTimeout(focusSearchAfterOpenTimerRef.current);
      }
    };
  }, []);

  const updateListOverflow = useCallback(() => {
    const el = listScrollRef.current;
    if (!el) {
      setShowListBottomFade(false);
      return;
    }
    setShowListBottomFade(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setShowListBottomFade(false);
      return;
    }
    updateListOverflow();
  }, [open, filteredLanguages, searchQuery, updateListOverflow]);

  useLayoutEffect(() => {
    const el = listScrollRef.current;
    if (!el || !open) return;
    const ro = new ResizeObserver(() => {
      updateListOverflow();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, updateListOverflow]);

  useEffect(() => {
    if (!open || effectiveActiveIndex < 0) return;
    optionRefs.current[effectiveActiveIndex]?.scrollIntoView({ block: "nearest" });
  }, [effectiveActiveIndex, open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (focusSearchAfterOpenTimerRef.current !== null) {
      window.clearTimeout(focusSearchAfterOpenTimerRef.current);
      focusSearchAfterOpenTimerRef.current = null;
    }

    setOpen(nextOpen);

    if (nextOpen) {
      const selectedIndex = filteredLanguages.findIndex(
        (language) => language.code === currentLanguageCode,
      );
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      return;
    }

    setSearchQuery("");
    setActiveIndex(0);
  };

  const focusSearchInputAfterOpen = useCallback(() => {
    if (mobile) return;
    if (focusSearchAfterOpenTimerRef.current !== null) {
      window.clearTimeout(focusSearchAfterOpenTimerRef.current);
    }
    focusSearchAfterOpenTimerRef.current = window.setTimeout(() => {
      focusSearchAfterOpenTimerRef.current = null;
      inputRef.current?.focus();
    }, 0);
  }, [mobile]);

  const handleSheetKeyDownCapture = useCallback(
    (event: React.KeyboardEvent) => {
      if (!open || filteredLanguages.length === 0) return;

      const target = event.target as Node | null;
      const isSearchInput = target === inputRef.current;

      const isNextKey = event.key === "ArrowDown" || event.key === "ArrowRight";
      const isPrevKey = event.key === "ArrowUp" || event.key === "ArrowLeft";
      if (isNextKey || isPrevKey) {
        event.preventDefault();
        const direction = isNextKey ? 1 : -1;
        const len = filteredLanguages.length;
        setActiveIndex((current) => {
          const at = Math.min(Math.max(0, current), len - 1);
          if (direction === 1) {
            return at >= len - 1 ? 0 : at + 1;
          }
          return at <= 0 ? len - 1 : at - 1;
        });
        return;
      }

      if (event.key === "Enter" && isSearchInput) {
        const nextLanguage = filteredLanguages.length === 1 ? filteredLanguages[0] : activeLanguage;
        if (!nextLanguage) return;
        event.preventDefault();
        handleLanguageChange(nextLanguage.code);
      }
    },
    [open, filteredLanguages, activeLanguage, handleLanguageChange],
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {mobile ? (
          <button className="flex items-center justify-center w-full rounded-full glass-card px-3 py-3 text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all font-display text-sm">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" />
              <span>{t("nav.language")}</span>
            </span>
          </button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 px-3 text-sm text-muted-foreground hover:bg-border/70 hover:text-foreground focus-visible:bg-border/70 font-display"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLanguage.label}</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full min-h-0 flex-col w-full sm:max-w-md [&>button]:rounded-full"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          focusSearchInputAfterOpen();
        }}
        onKeyDownCapture={handleSheetKeyDownCapture}
      >
        <SheetHeader className="shrink-0">
          <SheetTitle className="font-display text-foreground/80">
            {t("languageSelector.title")}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-5">
          {/* z-index + no overflow clip on this row so focus box-shadow isn’t cut off by a parent */}
          <div className="relative z-[100] isolate shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder={t("languageSelector.searchPlaceholder")}
              aria-label={t("languageSelector.searchPlaceholder")}
              autoComplete="off"
              spellCheck={false}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(0);
              }}
              className="w-full rounded-full bg-foreground/[0.04] border border-foreground/[0.08] px-10 py-2.5 text-sm placeholder:text-muted-foreground"
            />
          </div>
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <div
              ref={listScrollRef}
              className={cn(
                "min-h-0 flex-1 overflow-y-auto px-5 pt-3",
                showListBottomFade && "pb-14",
              )}
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filteredLanguages.map((language, index) => (
                  <button
                    key={language.code}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    type="button"
                    onClick={() => handleLanguageChange(language.code)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3 text-left transition-all",
                      "bg-foreground/[0.03] border border-foreground/[0.06] hover:bg-foreground/[0.07] hover:border-foreground/[0.12]",
                      effectiveActiveIndex === index &&
                        "border-foreground/[0.16] bg-foreground/[0.08]",
                      currentLanguageCode === language.code &&
                        "border-blue-glow bg-blue-glow/[0.08] hover:bg-blue-glow/[0.12] hover:border-blue-glow",
                    )}
                    dir={language.dir}
                  >
                    <span
                      className={cn(
                        "font-medium",
                        currentLanguageCode === language.code
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {language.label}
                    </span>
                    {currentLanguageCode === language.code && (
                      <Check className="h-4 w-4 text-blue-glow" />
                    )}
                  </button>
                ))}
              </div>
              {filteredLanguages.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No languages found
                </div>
              ) : null}
            </div>
            {showListBottomFade ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[rgb(242_244_249/0.97)] to-transparent dark:from-[hsl(var(--sheet-surface)/0.97)]"
              />
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
