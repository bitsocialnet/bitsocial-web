import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRichList } from "./data-context";
import { useFormatters } from "./format";

/** Re-renders often enough for "updated 3 minutes ago" to stay true. */
function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(interval);
  }, [intervalMs]);

  return now;
}

/** Where the numbers on the page come from right now, and how fresh they are. */
export default function LiveStatus() {
  const { t } = useTranslation();
  const format = useFormatters();
  const { snapshot, status } = useRichList();
  const now = useNow(30_000);
  const values = {
    count: snapshot.holderCount,
    price: format.price(snapshot.priceUsd),
    date: format.day(snapshot.generatedAt),
    ago: format.ago(snapshot.generatedAt, now),
  };

  return (
    <p className="rl-snapshot">
      {status === "live" ? <span className="rl-live-dot" aria-hidden /> : null}
      {t(`richList.hero.status.${status}`, values)}
    </p>
  );
}
