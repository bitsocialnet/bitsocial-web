import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const stored = window.localStorage.getItem("bso-theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // Storage throws when the browser blocks site data; the system scheme decides then.
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Only the reader's own choice is stored, so without one the theme follows the system each load.
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem("bso-theme", next);
    } catch {
      // Without storage the choice lasts until the page is closed.
    }
    setTheme(next);
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
