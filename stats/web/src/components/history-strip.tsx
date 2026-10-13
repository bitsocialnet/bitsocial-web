import { formatMoment, formatPercent } from "@/lib/format";
import type { RangeInfo, Series } from "@/lib/types";

type State = "up" | "partial" | "down" | "none";

const stateOf = (share: number | null): State => {
  if (share === null) {
    return "none";
  }
  if (share >= 0.999) {
    return "up";
  }
  return share <= 0.001 ? "down" : "partial";
};

const fills: Record<State, string> = {
  up: "rgb(var(--up))",
  partial: "rgb(var(--partial))",
  down: "rgb(var(--down))",
  none: "rgb(var(--unknown))",
};

const titles: Record<State, string> = {
  up: "Up",
  partial: "Partly down",
  down: "Down",
  none: "No data",
};

interface HistoryStripProps {
  history: Series;
  range: RangeInfo;
  label: string;
  className?: string;
}

/**
 * Availability over the range: one column per step (each value covers the step that ends at its
 * timestamp), merged into runs of the same state so a healthy history is a single green bar and
 * every outage stands out.
 */
export function HistoryStrip({ history, range, label, className = "h-2.5" }: HistoryStripProps) {
  const runs: { state: State; from: number; to: number; worst: number | null }[] = [];
  history.forEach((share, index) => {
    const state = stateOf(share);
    const run = runs.at(-1);
    if (run && run.state === state) {
      run.to = index;
      if (share !== null && (run.worst === null || share < run.worst)) {
        run.worst = share;
      }
    } else {
      runs.push({ state, from: index, to: index, worst: share });
    }
  });
  const downRuns = runs.filter((run) => run.state === "down" || run.state === "partial").length;

  return (
    <svg
      viewBox={`0 0 ${history.length} 1`}
      preserveAspectRatio="none"
      className={`block w-full overflow-hidden rounded-[3px] ${className}`}
      role="img"
      aria-label={`${label}: ${downRuns === 0 ? "no outages" : `${downRuns} outage${downRuns === 1 ? "" : "s"}`} in this range`}
    >
      {runs.map((run) => (
        <rect
          key={run.from}
          x={run.from}
          y={0}
          width={run.to - run.from + 1}
          height={1}
          style={{ fill: fills[run.state] }}
          shapeRendering="crispEdges"
        >
          <title>
            {`${titles[run.state]}${run.state === "partial" ? ` (${formatPercent(run.worst)} up at worst)` : ""} · ${formatMoment(range.start + (run.from - 1) * range.step)} – ${formatMoment(range.start + run.to * range.step)}`}
          </title>
        </rect>
      ))}
    </svg>
  );
}
