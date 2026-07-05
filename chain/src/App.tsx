import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ChainStatusCta from "@/components/chain-status-cta";
import heroImage from "./assets/hero-l2-slot.webp";
import heroImage800 from "./assets/hero-l2-slot-800.webp";
import BackToTop from "@/components/back-to-top";
import Footer from "@/components/footer";
import MailingList from "@/components/mailing-list";
import Topbar, { TopbarSpacer } from "@/components/topbar";
import PolygonMeshBackground from "./PolygonMeshBackground";
import Sections from "./sections";

export default function App() {
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
                The missing <span className="mark">social layer</span> of crypto
              </h1>
              <p className="sub">
                Crypto became a casino because Web2, TradFi, and centralized infrastructure own the
                distribution rails and bend the incentives. Bitsocial Chain fixes this: an
                unstoppable, fully decentralized{" "}
                <a
                  className="sub-link"
                  href="https://ethereum.org/layer-2/learn/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ethereum L2
                </a>{" "}
                <a
                  className="sub-link"
                  href="https://l2beat.com/glossary#application-specific-rollup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  appchain
                </a>{" "}
                where communities own their networks, their tokens and their revenue.
              </p>
            </div>
            <div className="stage">
              <div className="stage-frame">
                <img
                  className="stage-image"
                  src={heroImage}
                  srcSet={`${heroImage800} 800w, ${heroImage} 1600w`}
                  sizes="(max-width: 860px) 100vw, min(64rem, 100vw)"
                  width={1600}
                  height={900}
                  alt="Cross-section of a layered protocol stack: the social layer on top, Ethereum at the base, and the missing Bitsocial Chain layer sliding into place, lit in blue"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
          <div className="hero-bottom-fade" aria-hidden="true" />
        </div>

        <div className="content-panel">
          <div className="content-panel-fade" aria-hidden="true" />
          <div className="sections">
            <Sections />
          </div>
          <MailingList />
          <BackToTop />
          <Footer />
        </div>
      </main>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
