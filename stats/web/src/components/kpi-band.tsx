import type { CSSProperties, ReactNode } from "react";
import { formatPercent } from "@/lib/format";

export interface Kpi {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  /** Full-width visual under the figure, such as community ticks. */
  footer?: ReactNode;
  /** Columns this cell spans from the `lg` breakpoint. */
  wide?: boolean;
}

// The last figure stretches over whatever its row leaves empty: two columns on phones, three on
// tablets. Full class names keep them visible to Tailwind.
const phoneFill = ["", "col-span-2"];
const tabletFill = ["", "sm:col-span-3", "sm:col-span-2"];

/** The view's headline figures in one hairline-divided band. */
export function KpiBand({ items }: { items: Kpi[] }) {
  const columns = items.reduce((total, item) => total + (item.wide ? 2 : 1), 0);
  const singles = items.filter((item) => !item.wide).length;
  const lastFill = `${phoneFill[singles % 2]} ${tabletFill[singles % 3]} lg:col-span-1`;
  return (
    <dl
      className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3 lg:[grid-template-columns:repeat(var(--kpi-columns),minmax(0,1fr))]"
      style={{ "--kpi-columns": columns } as CSSProperties}
    >
      {items.map(({ label, value, detail, footer, wide }, index) => (
        <div
          key={label}
          className={`flex min-w-0 flex-col bg-panel px-4 py-3.5 ${
            wide
              ? "col-span-2 sm:col-span-3 lg:col-span-2"
              : index === items.length - 1
                ? lastFill
                : ""
          }`}
        >
          <dt className="text-[13px] font-medium text-ink-2">{label}</dt>
          <dd className="figure mt-1 text-[1.625rem] font-semibold leading-tight tracking-[-0.01em] text-ink lg:text-[1.75rem]">
            {value}
          </dd>
          {detail && <dd className="mt-0.5 text-xs text-ink-3">{detail}</dd>}
          {footer && <dd className="mt-auto pt-3">{footer}</dd>}
        </div>
      ))}
    </dl>
  );
}

/** Signed change since the start of the range; green when the move is good news. */
export function Delta({ change, rangeLabel }: { change: number | null; rangeLabel: string }) {
  if (change === null) {
    return <span>No earlier data in the last {rangeLabel}</span>;
  }
  const flat = Math.abs(change) < 0.0005;
  const up = change > 0;
  return (
    <span>
      <span className={flat ? "text-ink-2" : up ? "text-up" : "text-down"}>
        {flat ? "±0%" : `${up ? "▲" : "▼"} ${formatPercent(Math.abs(change))}`}
      </span>{" "}
      vs {rangeLabel} ago
    </span>
  );
}
