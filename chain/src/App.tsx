import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Trans, useTranslation } from "react-i18next";
import ChainStatusCta from "@/components/chain-status-cta";
import HeroContractAddress from "@/components/hero-contract-address";
import BackToTop from "@/components/back-to-top";
import Faq from "@/components/faq";
import Footer from "@/components/footer";
import MailingList from "@/components/mailing-list";
import Topbar, { TopbarSpacer } from "@/components/topbar";
import { useHashScroll } from "@/lib/use-hash-scroll";
import MissingLayer from "./MissingLayer";
import PolygonMeshBackground from "./PolygonMeshBackground";
import Sections from "./sections";

export default function App() {
  useHashScroll();
  // Trans does not subscribe to language changes, so App re-renders the hero copy itself.
  useTranslation();

  return (
    <div className="shell">
      <PolygonMeshBackground />
      <Topbar />
      <TopbarSpacer />

      <main className="shell-main">
        <div className="hero-panel">
          <div className="hero">
            <ChainStatusCta />
            <div className="copy">
              <h1 className="title">
                <Trans i18nKey="hero.title" components={{ mark: <span className="mark" /> }} />
              </h1>
              <p className="sub">
                <Trans
                  i18nKey="hero.supporting"
                  components={{
                    l2Link: (
                      <a
                        className="sub-link"
                        href="https://ethereum.org/layer-2/learn/"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                    appchainLink: (
                      <a
                        className="sub-link"
                        href="https://l2beat.com/glossary#application-specific-rollup"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                />
              </p>
              <HeroContractAddress />
            </div>
            <div className="stage">
              <MissingLayer />
            </div>
          </div>
        </div>

        <div className="content-panel">
          <div className="sections">
            <Sections />
          </div>
          <MailingList />
          <Faq />
          <Footer />
        </div>
      </main>
      <BackToTop />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
