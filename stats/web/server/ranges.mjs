// Time ranges the dashboard offers. `step` sets the chart resolution (about 150 to 180 points);
// `resolution` is how finely each step is sampled when a status is averaged into uptime.
// Prometheus keeps 15 days of data by default, so nothing longer is offered.
export const RANGES = {
  "6h": { seconds: 6 * 3600, step: 120, resolution: 30 },
  "24h": { seconds: 24 * 3600, step: 600, resolution: 60 },
  "7d": { seconds: 7 * 86400, step: 3600, resolution: 300 },
  "14d": { seconds: 14 * 86400, step: 7200, resolution: 600 },
};

export const DEFAULT_RANGE = "24h";

// The server rebuilds its snapshots once per window, and every range's timeline ends on the
// window's boundary, so each pass covers new data and all ranges in a pass share one end time.
export const SNAPSHOT_SECONDS = 30;

export const getTimeline = (rangeKey, nowSeconds = Date.now() / 1000) => {
  const range = RANGES[rangeKey];
  const end = Math.floor(nowSeconds / SNAPSHOT_SECONDS) * SNAPSHOT_SECONDS;
  return {
    key: rangeKey,
    start: end - range.seconds,
    end,
    step: range.step,
    resolution: range.resolution,
    points: range.seconds / range.step + 1,
  };
};
