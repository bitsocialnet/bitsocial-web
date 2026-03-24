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
        <Features />
        <SanctuaryCommunication />
        <MasterPlan />
        <MailingList />
        <Footer />
      </div>
    </div>
  );
}
