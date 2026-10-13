import type { ReactNode } from "react";
import { HistoryStrip } from "@/components/history-strip";
import { Lamp } from "@/components/primitives";
import { healthOf } from "@/lib/health";
import { formatLatency, formatPercent } from "@/lib/format";
import type { RangeInfo, StatusRow } from "@/lib/types";

export interface StatusGroup {
  label?: string;
  rows: StatusRow[];
  note?: (row: StatusRow) => ReactNode;
}

const stateLabel = { up: "Up", down: "Down", unknown: "No data" };

/**
 * Dense service rows: state, availability over the range, uptime and the latest response time.
 * Narrow panels move the history strip under the name.
 */
export function StatusList({
  groups,
  range,
  className = "space-y-4",
}: {
  groups: StatusGroup[];
  range: RangeInfo;
  className?: string;
}) {
  return (
    <div className={className}>
      {groups.map(({ label, rows, note }) => (
        <div key={label ?? "rows"} className="status-list min-w-0">
          <div className="status-head mb-1 text-[11px] font-medium text-ink-3">
            <span className="truncate">{label}</span>
            <span className="status-wide">History</span>
            <span className="text-right">Uptime</span>
            <span className="status-wide text-right">Latency</span>
          </div>
          <ul className="divide-y divide-line">
            {rows.map((row) => {
              const health = healthOf(row.up);
              return (
                <li key={row.id} className="status-row py-2">
                  <div className="flex min-w-0 items-center gap-2 [grid-area:name]">
                    <Lamp health={health} />
                    <span className="truncate text-[13px] text-ink" title={row.url}>
                      {row.label}
                    </span>
                    {health !== "up" && (
                      <span
                        className={`shrink-0 text-xs ${health === "down" ? "text-down" : "text-ink-3"}`}
                      >
                        {stateLabel[health]}
                      </span>
                    )}
                    {health === "up" && <span className="sr-only">{stateLabel.up}</span>}
                    {note?.(row)}
                  </div>
                  <div className="[grid-area:strip]">
                    <HistoryStrip
                      history={row.history}
                      range={range}
                      label={`${row.label} availability`}
                      className="h-2"
                    />
                  </div>
                  <span className="tabular text-right text-[13px] text-ink-2 [grid-area:uptime]">
                    {formatPercent(row.uptime)}
                  </span>
                  <span className="status-wide tabular text-right text-[13px] text-ink-3 [grid-area:latency]">
                    {formatLatency(row.latency)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
