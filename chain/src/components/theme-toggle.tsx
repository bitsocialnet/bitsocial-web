import { Moon, Sun } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { buildNoJsThemeHref, resolveRequestTheme, type SupportedThemeMode } from "@/lib/theme";
import { usePageLocation } from "@/lib/use-page-location";
import { useTheme } from "@/lib/useTheme";

function getNoJsTheme(search: string): SupportedThemeMode {
  return (
    resolveRequestTheme({
      queryTheme: new URLSearchParams(search).get("theme"),
    }) ?? "dark"
  );
}

export function NoJsThemeToggle({ mobile }: { mobile?: boolean }) {
  const { t } = useTranslation();
  const location = usePageLocation();
  const currentTheme = getNoJsTheme(location.search);
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  const href = buildNoJsThemeHref({
    hash: location.hash,
    pathname: location.pathname,
    search: location.search,
    theme: nextTheme,
  });

  if (mobile) {
    return (
      <a
        href={href}
        className="flex w-full items-center justify-center rounded-full glass-card px-3 py-3 font-display text-sm text-muted-foreground transition-all hover:border-muted-foreground/40 hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          {currentTheme === "dark" ? (
            <Moon className="h-4 w-4 shrink-0" />
          ) : (
            <Sun className="h-4 w-4 shrink-0" />
          )}
          <span>{t("nav.theme")}</span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={href}
      aria-label={t("nav.theme")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-border/70 hover:text-foreground focus-visible:bg-border/70"
    >
      {currentTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="sr-only">{t("nav.theme")}</span>
    </a>
  );
}

export function ThemeToggle({ mobile }: { mobile?: boolean }) {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = theme === "dark";

  const handleToggle = () => {
    toggle();
    requestAnimationFrame(() => {
      buttonRef.current?.blur();
    });
  };

  if (mobile) {
    return (
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-center rounded-full glass-card px-3 py-3 font-display text-sm text-muted-foreground transition-all hover:border-muted-foreground/40 hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          {isDark ? <Moon className="h-4 w-4 shrink-0" /> : <Sun className="h-4 w-4 shrink-0" />}
          <span>{t("nav.theme")}</span>
        </span>
      </button>
    );
  }

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      className="h-9 w-9 text-muted-foreground hover:bg-border/70 hover:text-foreground focus:bg-transparent focus-visible:bg-border/70 active:bg-transparent"
      onClick={handleToggle}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
