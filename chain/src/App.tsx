import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ChainStatusCta from "@/components/chain-status-cta";
import MissingLayer from "./MissingLayer";
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
                Crypto became a casino because web2 owns its distribution. Bitsocial Chain fixes
                this: an unstoppable, fully decentralized{" "}
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
              <MissingLayer />
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
