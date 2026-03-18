import { createContext, lazy, Suspense, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useGraphicsMode } from "@/lib/graphics-mode";
import { cn, triggerFeatureGlow } from "@/lib/utils";

const PlanetGraphic = lazy(() => import("./planet-graphic"));
const MeshGraphic = lazy(() => import("./mesh-graphic"));

const HighlightIndexCtx = createContext(-1);

const TAGLINE_LINK_COUNT = 6;
const INTRO_START_DELAY = 1800;
const INTRO_STEP_MS = 1000;

function handleTaglineClick(hash: string) {
  window.history.replaceState(null, "", `#${hash}`);
  triggerFeatureGlow(hash);
}

function TaglineLink({
  hash,
  index,
  children,
}: {
  hash: string;
  index?: number;
  children?: React.ReactNode;
}) {
  const highlightedIndex = useContext(HighlightIndexCtx);
  const isIntroActive = typeof index === "number" && highlightedIndex === index;

  return (
    <span
      data-tagline-link={hash}
      role="button"
      tabIndex={0}
      onClick={() => handleTaglineClick(hash)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTaglineClick(hash);
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
  const isDark =
    resolvedTheme === "dark" ||
    (!resolvedTheme &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const desktopSrc = isDark
    ? "/hero-fallback-desktop-dark.png"
    : "/hero-fallback-desktop-light.png";
  const mobileSrc = isDark ? "/hero-fallback-mobile-dark.png" : "/hero-fallback-mobile-light.png";

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      <img
        src={desktopSrc}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-contain md:object-cover object-bottom"
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}

function useTaglineIntro() {
  const [index, setIndex] = useState(-1);
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = setTimeout(() => {
      for (let i = 0; i < TAGLINE_LINK_COUNT; i++) {
        timers.push(setTimeout(() => setIndex(i), i * INTRO_STEP_MS));
      }
      timers.push(setTimeout(() => setIndex(-1), TAGLINE_LINK_COUNT * INTRO_STEP_MS));
    }, INTRO_START_DELAY);
    timers.push(start);
    return () => timers.forEach(clearTimeout);
  }, []);
  return index;
}

export default function Hero() {
  const { t, i18n } = useTranslation();
  const graphicsMode = useGraphicsMode();
  const showGraphics = graphicsMode === "full";
  const highlightedIndex = useTaglineIntro();
  const activeLanguage = i18n.resolvedLanguage ?? i18n.language ?? i18n.languages[0] ?? "";
  const isEnglishTagline = activeLanguage.toLowerCase().startsWith("en");

  const staticFallback = (
    <div className="absolute bottom-8 md:bottom-12 left-0 right-0 w-full h-[60vh] md:h-[48vh] pointer-events-none overflow-visible md:overflow-hidden overscroll-none">
      <HeroFallbackImage />
      <div
        className="absolute bottom-0 left-0 right-0 h-28 md:h-44 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background)) 25%, hsl(var(--background) / 0.9) 40%, hsl(var(--background) / 0.6) 60%, hsl(var(--background) / 0.2) 80%, transparent 100%)",
        }}
      />
    </div>
  );

  return (
    <section className="min-h-[100svh] md:min-h-screen flex flex-col items-center justify-start pt-28 md:pt-40 px-6 relative overflow-x-hidden overflow-y-visible">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: -20 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-3xl text-center mb-12 px-4 relative z-10"
      >
        <p
          id="hero-tagline"
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed font-display font-normal"
        >
          <HighlightIndexCtx.Provider value={highlightedIndex}>
            {isEnglishTagline ? (
              <>
                <TaglineLink hash="open-source" index={0}>
                  Bitsocial is an open-source
                </TaglineLink>{" "}
                <TaglineLink hash="peer-to-peer" index={1}>
                  peer-to-peer network
                </TaglineLink>{" "}
                <TaglineLink hash="social-apps" index={2}>
                  for social apps
                </TaglineLink>
                ,{" "}
                <TaglineLink hash="no-servers" index={3}>
                  with no servers
                </TaglineLink>
                ,{" "}
                <TaglineLink hash="no-global-bans" index={4}>
                  no global bans
                </TaglineLink>
                ,{" "}
                <TaglineLink hash="cryptographic-property" index={5}>
                  where users and communities are cryptographic property.
                </TaglineLink>
              </>
            ) : (
              <Trans
                i18nKey="hero.tagline"
                components={{
                  openSource: <TaglineLink hash="open-source" index={0} />,
                  p2p: <TaglineLink hash="peer-to-peer" index={1} />,
                  socialApps: <TaglineLink hash="social-apps" index={2} />,
                  noServers: <TaglineLink hash="no-servers" index={3} />,
                  noBans: <TaglineLink hash="no-global-bans" index={4} />,
                  crypto: <TaglineLink hash="cryptographic-property" index={5} />,
                }}
              />
            )}
          </HighlightIndexCtx.Provider>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: -20 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 relative z-0"
      >
        <Link
          to="/docs"
          className="px-8 py-3 rounded-full glass-card text-muted-foreground hover:text-foreground font-display font-semibold hover:border-blue-glow ring-glow transition-all duration-300 text-center md:text-left"
        >
          {t("hero.readDocs")}
        </Link>
        <Link
          to="/apps"
          className="px-8 py-3 rounded-full border border-blue-core/30 bg-blue-core/10 backdrop-blur-[10px] text-muted-foreground hover:text-foreground font-display font-semibold hover:bg-blue-core/20 hover:border-blue-glow ring-glow transition-all duration-300 text-center md:text-left"
        >
          {t("hero.exploreApps")}
        </Link>
      </motion.div>

      {/* Planet and Mesh graphics */}
      {showGraphics ? (
        <div className="mt-4 md:mt-6 relative -mx-6 w-[calc(100%+3rem)] pointer-events-none overscroll-none touch-pan-y">
          {/* P2P Mesh Network - behind the planet */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="absolute inset-0 z-0"
          >
            <Suspense fallback={staticFallback}>
              <MeshGraphic />
            </Suspense>
          </motion.div>

          {/* Planet animation with parallax scroll */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="relative z-30 pt-24 -mt-24 pointer-events-none"
          >
            <Suspense fallback={staticFallback}>
              <PlanetGraphic />
            </Suspense>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {staticFallback}
        </motion.div>
      )}

      {/* Bottom fade gradient - seamless transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 md:h-96 pointer-events-none z-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.3) 30%, hsl(var(--background) / 0.7) 60%, hsl(var(--background)) 85%, hsl(var(--background)) 100%)",
        }}
      />
    </section>
  );
}
