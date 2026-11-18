import { computeGraphicsMode, shouldPreferPngGraphicsFallback } from "@/lib/graphics-device";

export const HERO_FALLBACK_MOBILE_QUERY = "(max-width: 767px)";
const HERO_FALLBACK_PRELOAD_ATTR = "data-hero-fallback-preload";
const HERO_FALLBACK_SOURCES = {
  desktop: {
    dark: {
      png: "/hero-fallback-desktop-dark.png",
      webp: "/hero-fallback-desktop-dark.webp",
    },
    light: {
      png: "/hero-fallback-desktop-light.png",
      webp: "/hero-fallback-desktop-light.webp",
    },
  },
  mobile: {
    dark: {
      png: "/hero-fallback-mobile-dark.png",
      webp: "/hero-fallback-mobile-dark.webp",
    },
    light: {
      png: "/hero-fallback-mobile-light.png",
      webp: "/hero-fallback-mobile-light.webp",
    },
  },
} as const;

export type HeroFallbackViewport = keyof typeof HERO_FALLBACK_SOURCES;
export type HeroFallbackTheme = keyof (typeof HERO_FALLBACK_SOURCES)["desktop"];

export function getHeroFallbackSources(isDark: boolean) {
  const theme = isDark ? "dark" : "light";
  const desktop = HERO_FALLBACK_SOURCES.desktop[theme];
  const mobile = HERO_FALLBACK_SOURCES.mobile[theme];

  return {
    desktopPng: desktop.png,
    desktopWebp: desktop.webp,
    mobilePng: mobile.png,
    mobileWebp: mobile.webp,
  };
}

export function ensureHeroFallbackPreload(
  viewport: HeroFallbackViewport,
  theme: HeroFallbackTheme,
  preferPng: boolean,
) {
  if (typeof document === "undefined") return;

  const src = HERO_FALLBACK_SOURCES[viewport][theme][preferPng ? "png" : "webp"];
  if (document.head.querySelector(`link[${HERO_FALLBACK_PRELOAD_ATTR}="${src}"]`)) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  link.type = preferPng ? "image/png" : "image/webp";
  link.fetchPriority = "high";
  link.setAttribute(HERO_FALLBACK_PRELOAD_ATTR, src);
  document.head.appendChild(link);
}

/**
 * On devices that get the static hero image, that image is the largest paint of the home
 * page, and React only renders it after the application bundle has downloaded and hydrated.
 * The client entry calls this first so the image downloads alongside the bundle instead of
 * after it.
 */
export function preloadHeroFallbackForDevice() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
  if (window.location.pathname !== "/") return;
  if (computeGraphicsMode() !== "fallback") return;

  ensureHeroFallbackPreload(
    window.matchMedia(HERO_FALLBACK_MOBILE_QUERY).matches ? "mobile" : "desktop",
    // next-themes' inline script has set the theme class by the time module scripts run.
    document.documentElement.classList.contains("dark") ? "dark" : "light",
    shouldPreferPngGraphicsFallback(),
  );
}
