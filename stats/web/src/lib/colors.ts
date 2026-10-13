/** Adds an alpha channel to an `rgb(var(--token))` color. */
export const withAlpha = (color: string, alpha: number) => color.replace(/\)$/, ` / ${alpha})`);

// Secondary series that should recede behind the highlighted one.
export const NEUTRAL = "rgb(var(--ink-3))";
export const NEUTRAL_DIM = "rgb(var(--ink-2) / 0.55)";
