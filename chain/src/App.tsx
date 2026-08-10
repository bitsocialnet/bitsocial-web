import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ChainStatusCta from "@/components/chain-status-cta";
import BackToTop from "@/components/back-to-top";
import Footer from "@/components/footer";
import MailingList from "@/components/mailing-list";
import Topbar, { TopbarSpacer } from "@/components/topbar";
import { useHashScroll } from "@/lib/use-hash-scroll";
import MissingLayer from "./MissingLayer";
import PolygonMeshBackground from "./PolygonMeshBackground";
import Sections from "./sections";

export default function App() {
  useHashScroll();

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
                BSO is the money of Bitsocial, the peer-to-peer social network that no company owns.
                The token is live on Ethereum in a contract nobody can change. Bitsocial Chain, the
                Ethereum layer that would put it to work, is a proposal — not live yet.
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
