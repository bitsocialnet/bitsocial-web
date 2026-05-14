import { useEffect, useLayoutEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import ArbitraryChallenges from "@/components/arbitrary-challenges";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import MailingList from "@/components/mailing-list";
import MasterPlan from "@/components/master-plan";
import SanctuaryCommunication from "@/components/sanctuary-communication";
import Topbar from "@/components/topbar";
import Features from "@/components/features";
import { MAILING_LIST_HASH, scheduleMailingListHashScroll } from "@/lib/mailing-list-nav";
import { getScrollBehavior } from "@/lib/utils";

const HOME_SECTION_HASHES = new Set([
  "#sanctuary-communication",
  "#arbitrary-challenges",
  "#master-plan",
]);
const HOME_SECTION_LAYOUT_DELTA_PX = 1;
const HOME_SECTION_LAYOUT_STABLE_FRAMES = 2;
const HOME_SECTION_SCROLL_MAX_WAIT_MS = 1400;

function scrollToHomeSectionHash(hash: string) {
  const sectionId = hash.slice(1);
  if (!sectionId) return;

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: getScrollBehavior(),
    block: "start",
  });
}

function getHomeSectionScrollSample(hash: string) {
  const sectionId = hash.slice(1);
  if (!sectionId) return null;

  const target = document.getElementById(sectionId);
  if (!target) return null;

  return {
    navBottom: document.querySelector<HTMLElement>("nav")?.getBoundingClientRect().bottom ?? 0,
    scrollHeight: document.documentElement.scrollHeight,
    targetTop: target.getBoundingClientRect().top + window.scrollY,
  };
}

function getUnavailablePath(state: unknown) {
  if (!state || typeof state !== "object" || !("unavailablePath" in state)) {
    return null;
  }

  const unavailablePath = state.unavailablePath;
  return typeof unavailablePath === "string" ? unavailablePath : null;
}

export default function Home() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [unavailablePath, setUnavailablePath] = useState<string | null>(() =>
    getUnavailablePath(location.state),
  );

  // Hash scroll after route paint, with late correction passes for tall sections above the target.
  useLayoutEffect(() => {
    if (location.hash !== MAILING_LIST_HASH) return;
    return scheduleMailingListHashScroll();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!HOME_SECTION_HASHES.has(location.hash)) return;

    let cancelled = false;
    let frameId: number | null = null;
    let lastSample: ReturnType<typeof getHomeSectionScrollSample> = null;
    let stableFrameCount = 0;
    let pageLoaded = document.readyState === "complete";
    let fontsReady = !("fonts" in document) || document.fonts.status === "loaded";
    const startedAt = performance.now();

    const scheduleTick = () => {
      if (frameId !== null || cancelled) return;
      frameId = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      frameId = null;
      if (cancelled) return;

      const sample = getHomeSectionScrollSample(location.hash);
      if (!sample) {
        scheduleTick();
        return;
      }

      if (
        lastSample &&
        Math.abs(sample.targetTop - lastSample.targetTop) <= HOME_SECTION_LAYOUT_DELTA_PX &&
        Math.abs(sample.navBottom - lastSample.navBottom) <= HOME_SECTION_LAYOUT_DELTA_PX &&
        Math.abs(sample.scrollHeight - lastSample.scrollHeight) <= HOME_SECTION_LAYOUT_DELTA_PX
      ) {
        stableFrameCount += 1;
      } else {
        stableFrameCount = 0;
      }

      lastSample = sample;

      const layoutReady = pageLoaded && fontsReady;
      const exceededWait = performance.now() - startedAt >= HOME_SECTION_SCROLL_MAX_WAIT_MS;
      if ((layoutReady && stableFrameCount >= HOME_SECTION_LAYOUT_STABLE_FRAMES) || exceededWait) {
        scrollToHomeSectionHash(location.hash);
        return;
      }

      scheduleTick();
    };

    const handleLoad = () => {
      pageLoaded = true;
      scheduleTick();
    };

    if (!pageLoaded) {
      window.addEventListener("load", handleLoad, { once: true });
    }

    if (!fontsReady && "fonts" in document) {
      void document.fonts.ready.then(() => {
        fontsReady = true;
        scheduleTick();
      });
    }

    scheduleTick();

    return () => {
      cancelled = true;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("load", handleLoad);
    };
  }, [location.hash]);

  useEffect(() => {
    const redirectedPath = getUnavailablePath(location.state);
    if (!redirectedPath) return;

    setUnavailablePath(redirectedPath);
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      {
        replace: true,
      },
    );
  }, [location.pathname, location.search, location.hash, location.state, navigate]);

  return (
    <div className="min-h-screen">
      <Topbar />
      <main>
        <div className="bg-background">
          {unavailablePath ? (
            <div className="px-6 pt-28 md:pt-32">
              <div className="mx-auto flex max-w-4xl items-start justify-between gap-4 rounded-3xl border border-border/60 bg-background/85 px-5 py-4 text-sm text-muted-foreground shadow-lg backdrop-blur">
                <p className="leading-relaxed">
                  {t("home.devOnlyRouteNotice", { path: unavailablePath })}
                </p>
                <button
                  type="button"
                  onClick={() => setUnavailablePath(null)}
                  className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={t("home.dismissDevOnlyRouteNotice")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
          <Hero />
        </div>
        <div className="relative">
          <div className="absolute inset-x-0 top-0 hidden md:block h-[clamp(8rem,calc(11rem-2vw),10rem)] pointer-events-none z-[1]">
            <div className="absolute inset-x-6 md:inset-x-16 -top-10 md:-top-12 h-20 md:h-24 rounded-[999px] bg-background/85 blur-3xl" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.9) 24%, hsl(var(--background) / 0.52) 58%, hsl(var(--background) / 0.14) 82%, transparent 100%)",
              }}
            />
          </div>
          <div className="relative z-10">
            <Features />
            <SanctuaryCommunication />
            <ArbitraryChallenges />
            <MasterPlan />
            <MailingList />
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
