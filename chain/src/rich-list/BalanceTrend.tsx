import { type PointerEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type BalancePoint,
  type HolderHistoryState,
  balanceOn,
  combinedSeries,
} from "@/lib/rich-list/history";
import type { Formatters } from "./format";

// The line is drawn in these units and stretched to the cell; strokes keep their width.
const WIDTH = 120;
const HEIGHT = 32;
const PAD = 2;

function dayIso(day: number) {
  return new Date(day * 86_400_000).toISOString();
}

/**
 * The combined BSO balance of `addresses` over time, on the same time axis in every row so lines
 * compare. Rows without a line, below the major-holder cutoff, stay empty.
 */
export default function BalanceTrend({
  format,
  state,
  addresses,
}: {
  format: Formatters;
  state: HolderHistoryState;
  addresses: readonly string[];
}) {
  if (state.status === "loading") {
    return <span className="rl-trend is-loading" aria-hidden />;
  }
  if (state.status === "unavailable") {
    return null;
  }
  const series = combinedSeries(state.history, addresses);
  if (!series || series.length === 0) {
    return null;
  }
  return (
    <TrendLine
      format={format}
      series={series}
      firstDay={state.history.firstDay}
      lastDay={state.history.lastDay}
    />
  );
}

function TrendLine({
  format,
  series,
  firstDay,
  lastDay,
}: {
  format: Formatters;
  series: BalancePoint[];
  firstDay: number;
  lastDay: number;
}) {
  const { t } = useTranslation();
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  const span = Math.max(1, lastDay - firstDay);
  const first = series[0] as BalancePoint;
  const peak = series.reduce((best, point) => (point[1] > best[1] ? point : best), first);
  const current = series[series.length - 1]?.[1] ?? 0;
  const x = (day: number) => (((Math.min(day, lastDay) - firstDay) / span) * WIDTH).toFixed(2);
  const y = (balance: number) =>
    (HEIGHT - PAD - (balance / (peak[1] || 1)) * (HEIGHT - 2 * PAD)).toFixed(2);

  // Balances change in steps, so the line runs flat until the next change.
  let line = `M${x(first[0])},${y(first[1])}`;
  for (const [day, balance] of series.slice(1)) {
    line += `H${x(day)}V${y(balance)}`;
  }
  line += `H${WIDTH}`;

  const scrub = (event: PointerEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    setHoverDay(Math.round(firstDay + fraction * span));
  };

  return (
    <span
      className="rl-trend"
      role="img"
      aria-label={t("richList.table.historySummary", {
        start: format.month(dayIso(first[0])),
        high: format.integer(peak[1]),
        highDate: format.month(dayIso(peak[0])),
        current: format.integer(current),
      })}
      onPointerDown={scrub}
      onPointerMove={scrub}
      onPointerLeave={() => setHoverDay(null)}
      onPointerCancel={() => setHoverDay(null)}
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden>
        <line
          className="rl-trend-base"
          x1={0}
          x2={WIDTH}
          y1={HEIGHT - PAD}
          y2={HEIGHT - PAD}
          vectorEffect="non-scaling-stroke"
        />
        <path className="rl-trend-area" d={`${line}V${HEIGHT - PAD}H${x(first[0])}Z`} />
        <path className="rl-trend-line" d={line} vectorEffect="non-scaling-stroke" />
        {hoverDay === null ? null : (
          <line
            className="rl-trend-cursor"
            x1={x(hoverDay)}
            x2={x(hoverDay)}
            y1={0}
            y2={HEIGHT}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {hoverDay === null ? null : (
        <span className="rl-trend-readout" aria-hidden>
          {format.day(dayIso(hoverDay))} · {format.integer(balanceOn(series, hoverDay))}
        </span>
      )}
    </span>
  );
}
