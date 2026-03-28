import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Topbar from "../components/topbar";
import Hero from "../components/hero";
import Features from "../components/features";
import SanctuaryCommunication from "../components/sanctuary-communication";
import MasterPlan from "../components/master-plan";
import MailingList from "../components/mailing-list";
import Footer from "../components/footer";
import PolygonMeshBackground from "../components/polygon-mesh-background";
import { MAILING_LIST_HASH, scrollToMailingListSection } from "@/lib/mailing-list-nav";

export default function Home() {
  const location = useLocation();

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

  return (
    <div className="min-h-screen">
      <Topbar />
      <Hero />
      <div className="relative">
        <PolygonMeshBackground />
        <div className="absolute inset-x-0 top-0 h-28 md:h-[clamp(8rem,calc(11rem-2vw),10rem)] pointer-events-none z-[1]">
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
