import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { formatCompact, formatMoment, formatTick, lastKnown } from "@/lib/format";
import type { RangeInfo, Series } from "@/lib/types";

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  values: Series;
}

interface TimeChartProps {
  /** Accessible name, e.g. "Posts in the last 24 hours". */
  label: string;
  range: RangeInfo;
  series: ChartSeries[];
  /** Stack series bottom-up so the top edge is their total. */
  stacked?: boolean;
  height?: number;
  format?: (value: number) => string;
  /** Integer-only data never gets fractional axis ticks. */
  integer?: boolean;
  /** Draw value and time axes. Trend lines beside a headline figure leave them out. */
  axes?: boolean;
}

// The SVG stretches horizontally (viewBox width 1000, preserveAspectRatio none) and keeps its
// height in pixels, so lines stay 2px with non-scaling strokes and no resize observer is needed.
const VIEW_WIDTH = 1000;
const TOP_PAD = 8;
const AXIS_BAND = 22;

const niceMax = (max: number, integer: boolean) => {
  if (max <= 0) {
    return integer ? 2 : 1;
  }
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 4, 6, 8, 10].find((candidate) => candidate * magnitude >= max) ?? 10;
  const value = step * magnitude;
  return integer ? Math.max(2, Math.ceil(value)) : value;
};

const TICK_INTERVALS: Record<RangeInfo["key"], { hours?: number; days?: number }> = {
  "6h": { hours: 1 },
  "24h": { hours: 6 },
  "7d": { days: 2 },
  "14d": { days: 3 },
};

// Tick times aligned to local clock boundaries (every 6 hours, every other midnight, ...).
const timeTicks = (range: RangeInfo) => {
  const { hours, days } = TICK_INTERVALS[range.key];
  const cursor = new Date(range.start * 1000);
  cursor.setMinutes(0, 0, 0);
  if (days) {
    cursor.setHours(0);
  }
  const ticks: number[] = [];
  while (cursor.getTime() / 1000 <= range.end) {
    const seconds = cursor.getTime() / 1000;
    const matches = days
      ? Math.round(seconds / 86_400) % days === 0
      : cursor.getHours() % (hours ?? 1) === 0;
    if (seconds >= range.start && matches) {
      ticks.push(seconds);
    }
    if (days) {
      cursor.setDate(cursor.getDate() + 1);
    } else {
      cursor.setHours(cursor.getHours() + 1);
    }
  }
  return ticks;
};

const segments = (defined: boolean[]) => {
  const runs: [number, number][] = [];
  let start = -1;
  defined.forEach((isDefined, index) => {
    if (isDefined && start === -1) {
      start = index;
    }
    if (!isDefined && start !== -1) {
      runs.push([start, index - 1]);
      start = -1;
    }
  });
  if (start !== -1) {
    runs.push([start, defined.length - 1]);
  }
  return runs;
};

interface Scale {
  xAt: (index: number) => number;
  yAt: (value: number) => number;
}

/**
 * The bottom and top of every series at every index. Stacked series sit on the ones before them;
 * an index where no series has a value stays a gap in all of them.
 */
const stackSeries = (series: ChartSeries[], stacked: boolean) => {
  const points = series[0]?.values.length ?? 0;
  const defined = Array.from({ length: points }, (_, index) =>
    series.some(({ values }) => values[index] !== null),
  );
  const tops: Series[] = [];
  const bottoms: Series[] = [];
  series.forEach(({ values }, seriesIndex) => {
    const below = stacked && seriesIndex > 0 ? tops[seriesIndex - 1] : null;
    bottoms.push(values.map((_, index) => (defined[index] ? (below?.[index] ?? 0) : null)));
    tops.push(
      values.map((value, index) => {
        if (!defined[index]) {
          return null;
        }
        return stacked ? (below?.[index] ?? 0) + (value ?? 0) : value;
      }),
    );
  });
  return { defined, tops, bottoms };
};

const point = (command: string, x: number, y: number) =>
  `${command}${x.toFixed(1)} ${y.toFixed(1)}`;

const linePath = (values: Series, { xAt, yAt }: Scale) =>
  segments(values.map((value) => value !== null))
    .map(([from, to]) => {
      const commands: string[] = [];
      for (let index = from; index <= to; index += 1) {
        commands.push(point(index === from ? "M" : "L", xAt(index), yAt(values[index] as number)));
      }
      return commands.join("");
    })
    .join("");

const areaPath = (top: Series, bottom: Series, { xAt, yAt }: Scale) =>
  segments(top.map((value) => value !== null))
    .map(([from, to]) => {
      const commands: string[] = [];
      for (let index = from; index <= to; index += 1) {
        commands.push(point(index === from ? "M" : "L", xAt(index), yAt(top[index] as number)));
      }
      for (let index = to; index >= from; index -= 1) {
        commands.push(point("L", xAt(index), yAt(bottom[index] as number)));
      }
      return `${commands.join("")}Z`;
    })
    .join("");

/** The index an arrow, Home or End key moves to; null clears the readout (Escape). */
const keyboardIndex = (key: string, current: number, last: number) => {
  const moves: Record<string, number | null> = {
    ArrowLeft: Math.max(0, current - 1),
    ArrowRight: Math.min(last, current + 1),
    Home: 0,
    End: last,
    Escape: null,
  };
  return key in moves ? moves[key] : undefined;
};

function Readout({
  id,
  series,
  index,
  fraction,
  time,
  format,
}: {
  id: string;
  series: ChartSeries[];
  index: number;
  fraction: number;
  time: number;
  format: (value: number) => string;
}) {
  return (
    <div
      id={id}
      className="pointer-events-none absolute top-1 z-10 min-w-36 rounded-lg border border-line bg-raised px-3 py-2 text-xs shadow-[0_8px_24px_rgb(0_0_0/0.28)]"
      style={{
        left: `${fraction * 100}%`,
        transform: fraction > 0.55 ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
      }}
    >
      <p className="mb-1.5 text-ink-3">{formatMoment(time)}</p>
      <ul className="space-y-1">
        {[...series].reverse().map(({ key, label, color, values }) => (
          <li key={key} className="flex items-center gap-2">
            <span className="h-0.5 w-3 rounded-full" style={{ background: color }} />
            <span className="tabular font-semibold text-ink">
              {values[index] === null ? "–" : format(values[index] as number)}
            </span>
            <span className="text-ink-2">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimeAxis({ range }: { range: RangeInfo }) {
  const span = range.end - range.start;
  const ticks = timeTicks(range).filter((seconds) => {
    const fraction = (seconds - range.start) / span;
    return fraction > 0.04 && fraction < 0.96;
  });
  return (
    <div className="absolute inset-x-0 bottom-0 h-4" aria-hidden="true">
      {ticks.map((seconds) => (
        <span
          key={seconds}
          className="tabular absolute -translate-x-1/2 whitespace-nowrap text-[11px] leading-none text-ink-3"
          style={{ left: `${((seconds - range.start) / span) * 100}%` }}
        >
          {formatTick(seconds, range.key)}
        </span>
      ))}
    </div>
  );
}

export function TimeChart({
  label,
  range,
  series,
  stacked = false,
  height = 148,
  format = formatCompact,
  integer = true,
  axes = true,
}: TimeChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const readoutId = useId();
  const points = series[0]?.values.length ?? 0;
  const last = points - 1;
  const { defined, tops, bottoms } = stackSeries(series, stacked);
  const maxValue = Math.max(0, ...tops.flat().filter((value): value is number => value !== null));
  // A little headroom keeps a flat series off the top gridline.
  const yMax = niceMax(maxValue * 1.08, integer);
  const scale: Scale = {
    xAt: (index) => (last > 0 ? (index / last) * VIEW_WIDTH : 0),
    yAt: (value) => TOP_PAD + (1 - value / yMax) * (height - TOP_PAD),
  };
  const hasData = defined.some(Boolean);
  const hover =
    hoverIndex !== null && last > 0
      ? {
          index: hoverIndex,
          fraction: hoverIndex / last,
          time: range.start + hoverIndex * range.step,
        }
      : null;

  const updateHover = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    setHoverIndex(Math.round(fraction * last));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = keyboardIndex(event.key, hoverIndex ?? last, last);
    if (next !== undefined) {
      event.preventDefault();
      setHoverIndex(next);
    }
  };

  const describe = (index: number) =>
    series
      .map(
        ({ label: seriesLabel, values }) =>
          `${seriesLabel} ${values[index] === null ? "no data" : format(values[index] as number)}`,
      )
      .join(", ");
  const latestIndex = series[0] ? series[0].values.length - 1 : 0;
  const latest = series.map(({ label: seriesLabel, values }) => {
    const value = lastKnown(values);
    return `${seriesLabel} ${value === null ? "no data" : format(value)}`;
  });

  return (
    <div className="relative select-none" style={{ height: height + (axes ? AXIS_BAND : 0) }}>
      <div className="absolute inset-x-0 top-0" style={{ height }}>
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          {(axes ? [0, yMax / 2, yMax] : [0]).map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={VIEW_WIDTH}
              y1={scale.yAt(tick)}
              y2={scale.yAt(tick)}
              style={{ stroke: "rgb(var(--line))" }}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {series.map(({ key, color }, index) => (
            <path
              key={`area-${key}`}
              d={areaPath(tops[index], bottoms[index], scale)}
              style={{ fill: color, fillOpacity: stacked ? 0.3 : series.length === 1 ? 0.12 : 0 }}
            />
          ))}
          {series.map(({ key, color }, index) => (
            <path
              key={`line-${key}`}
              d={linePath(tops[index], scale)}
              fill="none"
              style={{ stroke: color }}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {hover && (
            <line
              x1={scale.xAt(hover.index)}
              x2={scale.xAt(hover.index)}
              y1={0}
              y2={height}
              style={{ stroke: "rgb(var(--ink-3))" }}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {(axes ? [yMax / 2, yMax] : []).map((tick) => (
          <span
            key={tick}
            aria-hidden="true"
            className="tabular pointer-events-none absolute left-0 -translate-y-full pb-0.5 text-[11px] leading-none text-ink-3"
            style={{ top: scale.yAt(tick) }}
          >
            {format(tick)}
          </span>
        ))}

        {!hasData && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-ink-3">
            No data in this range
          </p>
        )}

        {hover &&
          series.map(({ key, color }, index) => {
            const value = tops[index][hover.index];
            return value === null ? null : (
              <span
                key={`dot-${key}`}
                className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-panel"
                style={{
                  left: `${hover.fraction * 100}%`,
                  top: scale.yAt(value),
                  background: color,
                }}
              />
            );
          })}

        {hover && (
          <Readout
            id={readoutId}
            series={series}
            index={hover.index}
            fraction={hover.fraction}
            time={hover.time}
            format={format}
          />
        )}

        {/* A slider over the plot: pointer or arrow keys pick the moment the readout shows. */}
        <div
          role="slider"
          tabIndex={hasData ? 0 : -1}
          aria-label={label}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={Math.max(0, last)}
          aria-valuenow={hover?.index ?? latestIndex}
          aria-valuetext={
            hover
              ? `${formatMoment(hover.time)}: ${describe(hover.index)}`
              : `Latest: ${latest.join(", ")}`
          }
          className="absolute inset-0 cursor-crosshair touch-pan-y rounded-md"
          onPointerMove={updateHover}
          onPointerDown={updateHover}
          // A lifted finger leaves the readout up; tapping elsewhere blurs the slider and clears it.
          onPointerLeave={(event) => event.pointerType !== "touch" && setHoverIndex(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setHoverIndex(null)}
        />
      </div>

      {axes && <TimeAxis range={range} />}
    </div>
  );
}
