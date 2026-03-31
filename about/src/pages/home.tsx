import { useEffect, useLayoutEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import MailingList from "@/components/mailing-list";
import MasterPlan from "@/components/master-plan";
import PolygonMeshBackground from "@/components/polygon-mesh-background";
import SanctuaryCommunication from "@/components/sanctuary-communication";
import Topbar from "@/components/topbar";
import Features from "@/components/features";
import { MAILING_LIST_HASH, scrollToMailingListSection } from "@/lib/mailing-list-nav";

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

  // Hash scroll after route paint: layout effect + rAF so #mailing-list target exists (SPA + deep links).
  useLayoutEffect(() => {
    if (location.hash !== MAILING_LIST_HASH) return;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (!cancelled) scrollToMailingListSection();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [location.pathname, location.hash]);

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
      <div className="relative">
        <PolygonMeshBackground />
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
          <MasterPlan />
          <MailingList />
          <Footer />
        </div>
      </div>
    </div>
  );
}
