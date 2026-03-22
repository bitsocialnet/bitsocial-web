import { useEffect, useMemo, useRef, useState } from "react";
import { Globe, Check, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const languages = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "bn", name: "বাংলা" },
  { code: "ca", name: "Català" },
  { code: "cs", name: "Čeština" },
  { code: "da", name: "Dansk" },
  { code: "de", name: "Deutsch" },
  { code: "el", name: "Ελληνικά" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fa", name: "فارسی", dir: "rtl" },
  { code: "fi", name: "Suomi" },
  { code: "fil", name: "Filipino" },
  { code: "fr", name: "Français" },
  { code: "he", name: "עברית", dir: "rtl" },
  { code: "hi", name: "हिन्दी" },
  { code: "hu", name: "Magyar" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "mr", name: "मराठी" },
  { code: "nl", name: "Nederlands" },
  { code: "no", name: "Norsk" },
  { code: "pl", name: "Polski" },
  { code: "pt", name: "Português" },
  { code: "ro", name: "Română" },
  { code: "ru", name: "Русский" },
  { code: "sq", name: "Shqip" },
  { code: "sv", name: "Svenska" },
  { code: "te", name: "తెలుగు" },
  { code: "th", name: "ไทย" },
  { code: "tr", name: "Türkçe" },
  { code: "uk", name: "Українська" },
  { code: "ur", name: "اردو", dir: "rtl" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "zh", name: "中文" },
];

type LanguageEntry = (typeof languages)[number];

const LANGUAGE_BY_CODE = new Map<string, LanguageEntry>(
  languages.map((language) => [language.code, language]),
);
const DEFAULT_LANGUAGE = LANGUAGE_BY_CODE.get("en")!;

function getLanguageEntry(code: string): LanguageEntry {
  return LANGUAGE_BY_CODE.get(code) ?? DEFAULT_LANGUAGE;
}

export default function LanguageSelector({ mobile }: { mobile?: boolean }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusSearchAfterOpenTimerRef = useRef<number | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const currentLanguage = getLanguageEntry(i18n.language);

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (query === "") {
      return languages;
    }
    return languages.filter(
      (lang) => lang.name.toLowerCase().includes(query) || lang.code.toLowerCase().includes(query),
    );
  }, [searchQuery]);
  const effectiveActiveIndex =
    filteredLanguages.length === 0 ? -1 : Math.min(activeIndex, filteredLanguages.length - 1);
  const activeLanguage = effectiveActiveIndex >= 0 ? filteredLanguages[effectiveActiveIndex] : null;

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
    setSearchQuery("");
    setActiveIndex(0);
  };

  useEffect(() => {
    return () => {
      if (focusSearchAfterOpenTimerRef.current !== null) {
        window.clearTimeout(focusSearchAfterOpenTimerRef.current);
      }
    };
  }, []);

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
        (language) => language.code === i18n.language,
      );
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      if (!mobile) {
        focusSearchAfterOpenTimerRef.current = window.setTimeout(() => {
          focusSearchAfterOpenTimerRef.current = null;
          inputRef.current?.focus();
        }, 0);
      }
      return;
    }

    setSearchQuery("");
    setActiveIndex(0);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredLanguages.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current >= filteredLanguages.length - 1 ? 0 : current + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? filteredLanguages.length - 1 : current - 1));
      return;
    }

    if (event.key === "Enter") {
      const nextLanguage = filteredLanguages.length === 1 ? filteredLanguages[0] : activeLanguage;

      if (!nextLanguage) return;

      event.preventDefault();
      handleLanguageChange(nextLanguage.code);
    }
  };

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
            <span className="hidden sm:inline">{currentLanguage.name}</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md [&>button]:rounded-full">
        <SheetHeader>
          <SheetTitle className="font-display text-foreground/80">Select Language</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search languages\u2026"
              aria-label="Search languages"
              autoComplete="off"
              spellCheck={false}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              className="w-full rounded-full bg-foreground/[0.04] border border-foreground/[0.08] px-10 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
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
                    i18n.language === language.code &&
                      "border-blue-glow bg-blue-glow/[0.08] hover:bg-blue-glow/[0.12] hover:border-blue-glow",
                  )}
                  dir={language.dir}
                >
                  <span
                    className={cn(
                      "font-medium",
                      i18n.language === language.code ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {language.name}
                  </span>
                  {i18n.language === language.code && <Check className="h-4 w-4 text-blue-glow" />}
                </button>
              ))}
            </div>
            {filteredLanguages.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No languages found
              </div>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
