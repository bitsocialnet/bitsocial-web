import type { Theme } from "@/lib/useTheme";

/**
 * Colours drawn on the canvas, mirroring the page tokens. Older contracts fade from silver to the
 * brand blue, which is kept for BSO today, and the era names on the bands carry the same meaning
 * without colour.
 */
export function chartPalette(theme: Theme) {
  const dark = theme === "dark";
  return {
    text: dark ? "rgba(237, 237, 237, 0.64)" : "rgba(26, 26, 26, 0.68)",
    grid: dark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
    crosshair: dark ? "rgba(237, 237, 237, 0.32)" : "rgba(26, 26, 26, 0.3)",
    crosshairLabel: "#1a4fd0",
    eras: dark ? ["#9ca3af", "#8ea6dc", "#3b7bff"] : ["#6b7280", "#5f7fbf", "#2563eb"],
    areaFillAlpha: dark ? 0.26 : 0.18,
    up: dark ? "#199e70" : "#1baf7a",
    down: dark ? "#e66767" : "#e34948",
    volume: dark ? "rgba(237, 237, 237, 0.24)" : "rgba(26, 26, 26, 0.2)",
    background: dark ? "#08080b" : "#ffffff",
    bands: {
      fill: dark ? "rgba(255, 255, 255, 0.028)" : "rgba(0, 0, 0, 0.028)",
      line: dark ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.14)",
      label: dark ? "rgba(237, 237, 237, 0.56)" : "rgba(26, 26, 26, 0.66)",
    },
  };
}

export function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${value >> 16}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}
