import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

export function ThemeToggle({ mobile }: { mobile?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    requestAnimationFrame(() => {
      buttonRef.current?.blur();
    });
  };

  if (mobile) {
    return (
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleTheme}
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
      className="h-9 w-9 focus:bg-transparent active:bg-transparent hover:bg-border/70 focus-visible:bg-border/70"
      onClick={toggleTheme}
    >
      <Sun className="h-4 w-4 text-muted-foreground rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 text-muted-foreground rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
