const HERO_GRAPHIC_MIN_VIEWPORT_WIDTH = 390;
const HERO_GRAPHIC_MAX_VIEWPORT_WIDTH = 1440;

export function getHeroGraphicViewportProgress(width: number) {
  const progress =
    (width - HERO_GRAPHIC_MIN_VIEWPORT_WIDTH) /
    (HERO_GRAPHIC_MAX_VIEWPORT_WIDTH - HERO_GRAPHIC_MIN_VIEWPORT_WIDTH);

  return Math.min(Math.max(progress, 0), 1);
}
