import { Moon, Sun } from "lucide-react";
import { useRef } from "react";
import { TOPBAR_LINKS } from "@/lib/site";
import { useTheme } from "@/lib/useTheme";
import { cn } from "@/lib/utils";

const navLinkClassName =
  "text-muted-foreground hover:text-foreground transition-colors relative group text-lg md:text-base font-display leading-none py-2 px-2 inline-flex items-center gap-1.5";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = theme === "dark";

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      onClick={() => {
        toggle();
        requestAnimationFrame(() => {
          buttonRef.current?.blur();
        });
      }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-border/70 hover:text-foreground focus-visible:bg-border/70"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default function Topbar() {
  return (
    <nav
      aria-label="Bitsocial Chain site navigation"
      className="fixed top-3 left-4 right-4 z-50 mx-auto max-w-7xl"
    >
      <div className="relative overflow-hidden topbar-frosted rounded-full">
        <div className="relative px-4 md:px-5 py-2">
          <div className="flex items-center justify-between gap-3">
            <a href="/" className="inline-flex items-center gap-1 group transition-colors shrink-0">
              <img
                src="/logo-small.png"
                width={32}
                height={32}
                alt=""
                aria-hidden="true"
                className="h-8 w-8 transition-[filter] group-hover:brightness-110"
              />
              <span className="text-xl font-display font-regular text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline">
                Bitsocial Chain
              </span>
            </a>

            <div className="flex items-center min-w-0">
              <div className="topbar-links flex items-center gap-2 sm:gap-3 lg:gap-5 overflow-x-auto max-w-[calc(100vw-7rem)] sm:max-w-none">
                {TOPBAR_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(navLinkClassName, "text-sm sm:text-base whitespace-nowrap")}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="h-4 w-px bg-border mx-2 sm:mx-3 lg:mx-4 shrink-0" />
              <div className="topbar-controls flex items-center gap-2 shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function TopbarSpacer({ className }: { className?: string }) {
  return <div className={cn("h-[4.25rem] shrink-0", className)} aria-hidden="true" />;
}
