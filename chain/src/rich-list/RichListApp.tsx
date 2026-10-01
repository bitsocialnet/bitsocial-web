import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import BackToTop from "@/components/back-to-top";
import Footer from "@/components/footer";
import Topbar, { TopbarSpacer } from "@/components/topbar";
import { useHashScroll } from "@/lib/use-hash-scroll";
import PolygonMeshBackground from "@/PolygonMeshBackground";
import Airdrops from "./Airdrops";
import HoldersTable from "./HoldersTable";
import History from "./History";
import LinkedWallets from "./LinkedWallets";
import Method from "./Method";
import SupplyStrip from "./SupplyStrip";
import TeamAllocation from "./TeamAllocation";
import { RichListDataProvider } from "./data-context";
import LiveStatus from "./LiveStatus";
import { RichSection } from "./primitives";

const JUMP_LINKS = ["holders", "linked-wallets", "team", "airdrops", "history", "method"] as const;

export default function RichListApp() {
  return (
    <RichListDataProvider>
      <RichListPage />
    </RichListDataProvider>
  );
}

function RichListPage() {
  useHashScroll();
  const { t } = useTranslation();

  return (
    <div className="shell rl-page">
      <PolygonMeshBackground />
      <Topbar page="rich-list" />
      <TopbarSpacer />

      <main className="shell-main">
        <div className="content-panel">
          <header className="rl-hero">
            <div className="rl-hero-panel glass-card">
              <h1 className="section-title">{t("richList.hero.title")}</h1>
              <p className="rl-lead">{t("richList.hero.lead")}</p>
              <LiveStatus />
              <SupplyStrip />
            </div>
            <nav className="rl-chapters glass-card" aria-labelledby="rl-chapters-title">
              <p id="rl-chapters-title" className="rl-chapters-title">
                {t("richList.hero.jumpLabel")}
              </p>
              <ol>
                {JUMP_LINKS.map((id, index) => (
                  <li key={id}>
                    <a href={`#${id}`}>
                      <span className="rl-chapter-number" aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="rl-chapter-name">{t(`richList.jump.${id}`)}</span>
                      <ArrowDown
                        aria-hidden
                        className="rl-chapter-arrow"
                        size={16}
                        strokeWidth={1.8}
                      />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </header>

          <RichSection
            id="holders"
            title={t("richList.table.title")}
            lead={t("richList.table.lead")}
          >
            <HoldersTable />
          </RichSection>

          <LinkedWallets />
          <TeamAllocation />
          <Airdrops />
          <History />
          <Method />
          <Footer />
        </div>
      </main>
      <BackToTop />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
