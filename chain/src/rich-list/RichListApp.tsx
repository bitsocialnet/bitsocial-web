import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
            <h1 className="rl-title">{t("richList.hero.title")}</h1>
            <p className="rl-lead">{t("richList.hero.lead")}</p>
            <LiveStatus />
            <SupplyStrip />
            <nav className="rl-jump" aria-label={t("richList.hero.jumpLabel")}>
              {JUMP_LINKS.map((id) => (
                <a key={id} href={`#${id}`}>
                  {t(`richList.jump.${id}`)}
                </a>
              ))}
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
