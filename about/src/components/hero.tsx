import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { DOCS_LINKS } from "@/lib/docs-links";
import {
  registerHeroMountForIntroSync,
  resetHeroMountForIntroSync,
  TAGLINE_INTRO_START_MS,
} from "@/lib/hero-intro-timing";
import { useGraphicsMode } from "@/lib/graphics-mode";
import { cn, triggerFeatureGlow } from "@/lib/utils";

const PlanetGraphic = lazy(() => import("./planet-graphic"));
const MeshGraphic = lazy(() => import("./mesh-graphic"));

const HighlightIndexCtx = createContext(-1);

const TAGLINE_LINK_COUNT = 6;
const INTRO_START_DELAY = TAGLINE_INTRO_START_MS;
const INTRO_STEP_MS = 1000;
const HERO_FALLBACK_MOBILE_QUERY = "(max-width: 767px)";
const HERO_FALLBACK_PRELOAD_ATTR = "data-hero-fallback-preload";
const HERO_FALLBACK_BOTTOM_MASK =
  "linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.28) 9%, black 22%, black 100%)";
const HERO_FALLBACK_SOURCES = {
  desktop: {
    dark: "/hero-fallback-desktop-dark.png",
    light: "/hero-fallback-desktop-light.png",
  },
  mobile: {
    dark: "/hero-fallback-mobile-dark.png",
    light: "/hero-fallback-mobile-light.png",
  },
} as const;

type HeroFallbackViewport = keyof typeof HERO_FALLBACK_SOURCES;

function resolveIsDarkTheme(resolvedTheme: string | undefined) {
  return (
    resolvedTheme === "dark" ||
    (!resolvedTheme &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

function getHeroFallbackSources(isDark: boolean) {
  return {
    desktopSrc: isDark ? HERO_FALLBACK_SOURCES.desktop.dark : HERO_FALLBACK_SOURCES.desktop.light,
    mobileSrc: isDark ? HERO_FALLBACK_SOURCES.mobile.dark : HERO_FALLBACK_SOURCES.mobile.light,
  };
}

function ensureHeroFallbackPreloads(viewport: HeroFallbackViewport) {
  if (typeof document === "undefined") return;

  for (const src of Object.values(HERO_FALLBACK_SOURCES[viewport])) {
    if (document.head.querySelector(`link[${HERO_FALLBACK_PRELOAD_ATTR}="${src}"]`)) {
      continue;
    }

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    link.setAttribute(HERO_FALLBACK_PRELOAD_ATTR, src);
    document.head.appendChild(link);
  }
}

function useHeroFallbackPreloads() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") {
      ensureHeroFallbackPreloads("desktop");
      ensureHeroFallbackPreloads("mobile");
      return;
    }

    const mobileQuery = window.matchMedia(HERO_FALLBACK_MOBILE_QUERY);
    const syncPreloads = () => {
      ensureHeroFallbackPreloads(mobileQuery.matches ? "mobile" : "desktop");
    };

    syncPreloads();

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", syncPreloads);
    } else {
      mobileQuery.addListener(syncPreloads);
    }

    return () => {
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener("change", syncPreloads);
      } else {
        mobileQuery.removeListener(syncPreloads);
      }
    };
  }, []);
}

function TaglineLink({
  hash,
  index,
  children,
  onNavigateToFeature,
}: {
  hash: string;
  index?: number;
  children?: React.ReactNode;
  onNavigateToFeature: (hash: string) => void;
}) {
  const highlightedIndex = useContext(HighlightIndexCtx);
  const isIntroActive = typeof index === "number" && highlightedIndex === index;

  return (
    <span
      data-tagline-link={hash}
      role="button"
      tabIndex={0}
      onClick={() => onNavigateToFeature(hash)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNavigateToFeature(hash);
        }
      }}
      className={cn(
        "interactive-feature-link relative cursor-pointer focus-visible:outline-none",
        isIntroActive && "highlight-text-glow",
      )}
    >
      {children}
    </span>
  );
}

function HeroFallbackImage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolveIsDarkTheme(resolvedTheme);
  const { desktopSrc, mobileSrc } = getHeroFallbackSources(isDark);

  return (
    <picture className="block h-full w-full">
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      <img
        src={desktopSrc}
        alt=""
        aria-hidden="true"
        className="mx-auto h-auto w-auto max-h-[clamp(19rem,34vh,23rem)] md:max-h-[min(36vh,24rem)] lg:max-h-[min(38vh,28rem)] xl:max-h-[min(42vh,32rem)] max-w-[min(100rem,100%)] object-contain object-bottom"
        loading="eager"
        decoding="async"
        style={{
          maskImage: HERO_FALLBACK_BOTTOM_MASK,
          WebkitMaskImage: HERO_FALLBACK_BOTTOM_MASK,
        }}
      />
    </picture>
  );
}

function HeroFallbackGraphic({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "left-0 right-0 flex w-full justify-center pointer-events-none overscroll-none",
        className,
      )}
    >
      <HeroFallbackImage />
    </div>
  );
}

function useTaglineIntro() {
  const [index, setIndex] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const resetIntro = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setIndex(-1);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timersRef.current = timers;

    const start = setTimeout(() => {
      for (let i = 0; i < TAGLINE_LINK_COUNT; i++) {
        timers.push(setTimeout(() => setIndex(i), i * INTRO_STEP_MS));
      }
      timers.push(setTimeout(() => setIndex(-1), TAGLINE_LINK_COUNT * INTRO_STEP_MS));
    }, INTRO_START_DELAY);
    timers.push(start);

    return () => {
      timers.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  return { highlightedIndex: index, resetIntro };
}

export default function Hero() {
  const { t } = useTranslation();
  const graphicsMode = useGraphicsMode();
  const [graphicsInitFailed, setGraphicsInitFailed] = useState(false);
  const showGraphics = graphicsMode === "full" && !graphicsInitFailed;
  const { highlightedIndex, resetIntro } = useTaglineIntro();

  useHeroFallbackPreloads();

  useLayoutEffect(() => {
    registerHeroMountForIntroSync();
    return () => resetHeroMountForIntroSync();
  }, []);

  const navigateToFeatureFromTagline = useCallback(
    (hash: string) => {
      resetIntro();
      window.history.replaceState(null, "", `#${hash}`);
      triggerFeatureGlow(hash);
    },
    [resetIntro],
  );
  const handleGraphicsInitError = useCallback(() => {
    setGraphicsInitFailed(true);
  }, []);

  const staticFallback = (
    <HeroFallbackGraphic className="absolute bottom-4 md:bottom-8 overflow-visible" />
  );

  return (
    <section className="min-h-[min(100svh,58rem)] md:min-h-[min(100svh,clamp(55rem,calc(64rem-7vw),60rem))] flex flex-col items-center justify-start pt-28 md:pt-40 px-6 relative overflow-x-clip">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: -20 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-3xl text-center mb-12 px-4 relative z-10"
      >
        <p
          data-hero-tagline
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed font-display font-normal text-balance"
        >
          <HighlightIndexCtx.Provider value={highlightedIndex}>
            <Trans
              i18nKey="hero.tagline"
              components={{
                openSource: (
                  <TaglineLink
                    hash="open-source"
                    index={0}
                    onNavigateToFeature={navigateToFeatureFromTagline}
                  />
                ),
                p2p: (
                  <TaglineLink
                    hash="peer-to-peer"
                    index={1}
                    onNavigateToFeature={navigateToFeatureFromTagline}
                  />
                ),
                socialApps: (
                  <TaglineLink
                    hash="social-apps"
                    index={2}
                    onNavigateToFeature={navigateToFeatureFromTagline}
                  />
                ),
                noServers: (
                  <TaglineLink
                    hash="no-servers"
                    index={3}
                    onNavigateToFeature={navigateToFeatureFromTagline}
                  />
                ),
                noBans: (
                  <TaglineLink
                    hash="no-global-bans"
                    index={4}
                    onNavigateToFeature={navigateToFeatureFromTagline}
                  />
                ),
                crypto: (
                  <TaglineLink
                    hash="cryptographic-property"
                    index={5}
                    onNavigateToFeature={navigateToFeatureFromTagline}
                  />
                ),
              }}
            />
          </HighlightIndexCtx.Provider>
        </p>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: -20 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 relative z-40"
      >
        <a
          href={DOCS_LINKS.home}
          className="px-8 py-3 rounded-full glass-card text-muted-foreground hover:text-foreground font-display font-semibold hover:border-blue-glow ring-glow transition-all duration-300 text-center md:text-start"
        >
          {t("hero.readDocs")}
        </a>
        <Link
          to="/apps"
          className="px-8 py-3 rounded-full border border-blue-core/30 bg-blue-core/10 backdrop-blur-[10px] text-muted-foreground hover:text-foreground font-display font-semibold hover:bg-blue-core/20 hover:border-blue-glow ring-glow transition-all duration-300 text-center md:text-start dark:border-blue-core/55 dark:bg-blue-core/28 dark:hover:bg-blue-core/42"
        >
          {t("hero.exploreApps")}
        </Link>
      </m.div>

      {/* Planet and Mesh graphics */}
      {showGraphics ? (
        <div className="mt-10 sm:mt-12 md:mt-6 relative -mx-6 w-[calc(100%+3rem)] pointer-events-none overscroll-none">
          {/* P2P Mesh Network - behind the planet */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="absolute inset-0 z-0"
          >
            <Suspense fallback={staticFallback}>
              <MeshGraphic onInitError={handleGraphicsInitError} />
            </Suspense>
          </m.div>

          {/* Planet animation with parallax scroll */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="relative z-30 pt-24 -mt-24 pointer-events-none"
          >
            <Suspense fallback={staticFallback}>
              <PlanetGraphic onInitError={handleGraphicsInitError} />
            </Suspense>
          </m.div>
        </div>
      ) : (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 sm:mt-12 md:mt-10 relative -mx-6 flex w-[calc(100%+3rem)] justify-center"
        >
          <HeroFallbackGraphic className="relative overflow-visible" />
        </m.div>
      )}

      {/* Bottom fade gradient - seamless transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 md:h-[clamp(12rem,calc(18rem-4vw),16rem)] pointer-events-none z-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.3) 30%, hsl(var(--background) / 0.7) 60%, hsl(var(--background)) 85%, hsl(var(--background)) 100%)",
        }}
      />
    </section>
  );
}
