import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"

export function ThemeToggle({ mobile }: { mobile?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    // Blur on mobile to remove persistent focus outline
    requestAnimationFrame(() => {
      buttonRef.current?.blur()
    })
  }

  if (!mounted) {
    if (mobile) {
      return (
        <button className="flex items-center justify-center w-full rounded-full glass-card px-3 py-3 text-muted-foreground font-display text-sm">
          <span className="flex items-center gap-2">
            <Sun className="h-4 w-4 shrink-0" />
            <span>{t("nav.theme")}</span>
          </span>
        </button>
      )
    }
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 focus:bg-transparent active:bg-transparent hover:bg-border/70 focus-visible:bg-border/70"
      >
        <Sun className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  if (mobile) {
    return (
      <button
        ref={buttonRef}
        onClick={toggleTheme}
        className="flex items-center justify-center w-full rounded-full glass-card px-3 py-3 text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all font-display text-sm"
      >
        <span className="flex items-center gap-2">
          {resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4 shrink-0" />
          ) : (
            <Sun className="h-4 w-4 shrink-0" />
          )}
          <span>{t("nav.theme")}</span>
        </span>
      </button>
    )
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
  )
}
