import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useTranslation } from "react-i18next";
import BackToTop from "@/components/back-to-top";
import Footer from "@/components/footer";
import Topbar, { TopbarSpacer } from "@/components/topbar";
import { SNAPSHOT } from "@/lib/rich-list/holders";
import { useHashScroll } from "@/lib/use-hash-scroll";
import Airdrops from "./Airdrops";
import HoldersTable from "./HoldersTable";
import History from "./History";
import LinkedWallets from "./LinkedWallets";
import Method from "./Method";
import SupplyStrip from "./SupplyStrip";
import TeamAllocation from "./TeamAllocation";
import { useFormatters } from "./format";
import { RichSection } from "./primitives";

const JUMP_LINKS = ["holders", "linked-wallets", "team", "airdrops", "history", "method"] as const;

export default function RichListApp() {
  useHashScroll();
  const { t } = useTranslation();
  const format = useFormatters();

  return (
    <div className="shell rl-page">
      <Topbar page="rich-list" />
      <TopbarSpacer />

      <main className="shell-main">
        <div className="content-panel">
          <header className="rl-hero">
            <h1 className="rl-title">{t("richList.hero.title")}</h1>
            <p className="rl-lead">{t("richList.hero.lead")}</p>
            <p className="rl-snapshot">
              {t("richList.hero.snapshot", {
                date: format.day(SNAPSHOT.generatedAt),
                count: SNAPSHOT.holderCount,
                price: format.price(SNAPSHOT.priceUsd),
              })}
            </p>
            <SupplyStrip />
            <nav className="rl-jump" aria-label={t("richList.hero.jumpLabel")}>
              {JUMP_LINKS.map((id) => (
                <a key={id} href={`#${id}`}>
                  {t(`richList.jump.${id}`)}
                </a>
              ))}
            </nav>
          </header>

          <RichSection id="holders" title={t("richList.table.title")} lead={t("richList.table.lead")}>
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
