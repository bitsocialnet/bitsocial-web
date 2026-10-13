export type Health = "up" | "down" | "unknown";

/** 1 is up, 0 down, anything missing unknown. */
export const healthOf = (value: number | null | undefined): Health =>
  value === null || value === undefined ? "unknown" : value >= 1 ? "up" : "down";
