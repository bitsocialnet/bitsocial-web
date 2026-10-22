import { useTranslation } from "react-i18next";
import type { PriceHistory } from "@/lib/chart/live";
import type { LiveStatus } from "@/lib/use-live-data";
import { useNow } from "@/lib/use-now";
import { useFormatters } from "@/rich-list/format";
import { useChartFormatters } from "./format";

/** Where the newest candle comes from right now, and how fresh it is. */
export default function ChartStatus({
  history,
  status,
}: {
  history: PriceHistory;
  status: LiveStatus;
}) {
  const { t } = useTranslation();
  const format = useChartFormatters();
  const { ago } = useFormatters();
  const now = useNow(30_000);
  const last = history.candles[history.candles.length - 1];
  const values = {
    price: last ? format.price(last.close) : "—",
    date: last ? format.day(last.time) : "—",
    ago: ago(history.updatedAt, now),
  };

  return (
    <p className="rl-snapshot">
      {status === "live" ? <span className="rl-live-dot" aria-hidden /> : null}
      {t(`chart.hero.status.${status}`, values)}
    </p>
  );
}
