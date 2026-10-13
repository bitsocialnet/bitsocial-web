import type { RangeKey, Series } from "@/lib/types";

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const compactPrecise = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export const formatInteger = (value: number | null | undefined) =>
  value === null || value === undefined ? "–" : integer.format(value);

/** 1,284 · 12.9K · 3.32M */
export const formatCompact = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "–";
  }
  if (Math.abs(value) < 10_000) {
    return integer.format(value);
  }
  return (Math.abs(value) < 1_000_000 ? compact : compactPrecise).format(value);
};

export const formatPercent = (share: number | null | undefined, digits = 1) => {
  if (share === null || share === undefined) {
    return "–";
  }
  if (share >= 1) {
    return "100%";
  }
  // Never round a partial outage up to a clean 100%.
  const factor = 10 ** digits;
  return `${(Math.floor(share * 100 * factor) / factor).toFixed(digits)}%`;
};

export const formatLatency = (seconds: number | null | undefined) => {
  if (seconds === null || seconds === undefined) {
    return "–";
  }
  return seconds < 1
    ? `${Math.round(seconds * 1000)} ms`
    : `${seconds.toFixed(seconds < 10 ? 2 : 1)} s`;
};

/** Compact age: 45s, 12m, 3h, 2d. */
export const formatAge = (seconds: number | null | undefined) => {
  if (seconds === null || seconds === undefined) {
    return "–";
  }
  if (seconds < 60) {
    return `${Math.max(0, Math.round(seconds))}s`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m`;
  }
  if (seconds < 86_400 * 2) {
    return `${Math.floor(seconds / 3600)}h`;
  }
  return `${Math.floor(seconds / 86_400)}d`;
};

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
const dayFormat = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
const dayTimeFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Axis tick label for a timestamp in seconds. */
export const formatTick = (seconds: number, range: RangeKey) =>
  (range === "7d" || range === "14d" ? dayFormat : timeFormat).format(new Date(seconds * 1000));

/** Full timestamp for tooltips. */
export const formatMoment = (seconds: number) => dayTimeFormat.format(new Date(seconds * 1000));

export const RANGE_LABELS: Record<RangeKey, string> = {
  "6h": "6 hours",
  "24h": "24 hours",
  "7d": "7 days",
  "14d": "14 days",
};

const regionNames =
  typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : undefined;

export const countryName = (code: string | null) => {
  if (!code) {
    return "Unknown";
  }
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

export const lastKnown = (values: Series) => {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index] !== null) {
      return values[index];
    }
  }
  return null;
};

export const firstKnown = (values: Series) => values.find((value) => value !== null) ?? null;

/** Change from the first to the last known value of a series, as a share of the first. */
export const relativeChange = (values: Series) => {
  const first = firstKnown(values);
  const last = lastKnown(values);
  if (first === null || last === null || first === 0) {
    return null;
  }
  return (last - first) / first;
};
