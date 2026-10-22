import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Trans, useTranslation } from "react-i18next";
import BackToTop from "@/components/back-to-top";
import Footer from "@/components/footer";
import Topbar, { TopbarSpacer } from "@/components/topbar";
import { COMMITTED_PRICE_HISTORY, fetchLivePriceHistory } from "@/lib/chart/live";
import { RICH_LIST_PATH } from "@/lib/site";
import { useHashScroll } from "@/lib/use-hash-scroll";
import { useLiveData } from "@/lib/use-live-data";
import PolygonMeshBackground from "@/PolygonMeshBackground";
import ChartMethod from "./ChartMethod";
import ChartStatus from "./ChartStatus";
import PriceChart from "./PriceChart";

export default function ChartApp() {
  useHashScroll();
  const { t } = useTranslation();
  const { data: history, status } = useLiveData(
    COMMITTED_PRICE_HISTORY,
    fetchLivePriceHistory,
    "GeckoTerminal",
  );

  return (
    // Shares the rich list's reading-page system; `ch-page` adds the chart's own surfaces.
    <div className="shell rl-page ch-page">
      <PolygonMeshBackground />
      <Topbar page="chart" />
      <TopbarSpacer />

      <main className="shell-main">
        <div className="content-panel">
          <header className="rl-hero">
            <div className="rl-hero-intro">
              <h1 className="section-title">{t("chart.hero.title")}</h1>
              <p className="rl-lead">
                <Trans
                  i18nKey="chart.hero.lead"
                  components={{
                    historyLink: <a className="rl-link" href={`${RICH_LIST_PATH}#history`} />,
                  }}
                />
              </p>
              <ChartStatus history={history} status={status} />
            </div>
          </header>

          <PriceChart candles={history.candles} />
          <ChartMethod />
          <Footer />
        </div>
      </main>
      <BackToTop />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
