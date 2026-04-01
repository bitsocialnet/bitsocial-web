/**
 * Keeps the hero tagline intro (first link highlight) aligned with the planet ring
 * rotation start. Hero registers mount time; PlanetGraphic reads delay so both fire at
 * heroMount + TAGLINE_INTRO_START_MS.
 */
export const TAGLINE_INTRO_START_MS = 1800;

let heroMountPerformanceNowMs: number | null = null;

export function registerHeroMountForIntroSync(): void {
  if (heroMountPerformanceNowMs != null) return;
  heroMountPerformanceNowMs = performance.now();
}

export function resetHeroMountForIntroSync(): void {
  heroMountPerformanceNowMs = null;
}

/**
 * Seconds to delay GSAP ring rotation so it begins when the tagline intro highlights
 * the first link. Falls back if Hero never registered (e.g. isolated mount).
 */
export function getPlanetRingRotationDelaySeconds(): number {
  const targetMs =
    heroMountPerformanceNowMs != null
      ? heroMountPerformanceNowMs + TAGLINE_INTRO_START_MS
      : performance.now() + TAGLINE_INTRO_START_MS;
  return Math.max(0, (targetMs - performance.now()) / 1000);
}
