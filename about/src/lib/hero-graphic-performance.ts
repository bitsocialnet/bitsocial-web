const MOBILE_BREAKPOINT = 768;
const LOW_END_CONCURRENCY = 4;
const HIGH_END_MOBILE_CONCURRENCY = 6;
const HIGH_END_MOBILE_MEMORY_GB = 4;
const MOBILE_DEFAULT_MAX_DPR = 1.25;
const MOBILE_HIGH_END_MAX_DPR = 1.5;
const DESKTOP_MAX_DPR = 2;
const PLANET_APPLE_MOBILE_MAX_DPR = 3;

function getHardwareConcurrency() {
  if (typeof navigator === "undefined") return LOW_END_CONCURRENCY;

  return navigator.hardwareConcurrency || LOW_END_CONCURRENCY;
}

function getDeviceMemory() {
  if (typeof navigator === "undefined" || !("deviceMemory" in navigator)) return null;

  return navigator.deviceMemory as number;
}

function getIsAppleTouchDevice() {
  if (typeof navigator === "undefined") return false;

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function getIsMobileHeroGraphicLayout(width: number) {
  return width < MOBILE_BREAKPOINT || getHardwareConcurrency() < LOW_END_CONCURRENCY;
}

function getUsesEnhancedMobileQuality() {
  const hardwareConcurrency = getHardwareConcurrency();
  const deviceMemory = getDeviceMemory();
  const isHighEndMobile =
    hardwareConcurrency >= HIGH_END_MOBILE_CONCURRENCY &&
    (deviceMemory == null || deviceMemory >= HIGH_END_MOBILE_MEMORY_GB);

  return isHighEndMobile || (hardwareConcurrency >= LOW_END_CONCURRENCY && getIsAppleTouchDevice());
}

export function getHeroGraphicMaxPixelRatio(isMobileLayout: boolean) {
  if (!isMobileLayout) return DESKTOP_MAX_DPR;

  return getUsesEnhancedMobileQuality() ? MOBILE_HIGH_END_MAX_DPR : MOBILE_DEFAULT_MAX_DPR;
}

export function getHeroGraphicShouldAntialias(isMobileLayout: boolean) {
  return !isMobileLayout;
}

// The planet hero is a tiny scene (one sphere + two rings) already throttled to
// ~30fps on mobile, so recent Apple touch devices can afford native-DPR MSAA
// rendering; the shared caps above stay low for the CPU-simulated mesh graphic
// and for PageSpeed's emulated mid-tier Android (Android UA never matches here).
export function getIsHighFidelityMobilePlanetDevice() {
  return getHardwareConcurrency() >= LOW_END_CONCURRENCY && getIsAppleTouchDevice();
}

export function getPlanetGraphicMaxPixelRatio(isMobileLayout: boolean) {
  if (isMobileLayout && getIsHighFidelityMobilePlanetDevice()) {
    return PLANET_APPLE_MOBILE_MAX_DPR;
  }

  return getHeroGraphicMaxPixelRatio(isMobileLayout);
}

export function getPlanetGraphicShouldAntialias(isMobileLayout: boolean) {
  return !isMobileLayout || getIsHighFidelityMobilePlanetDevice();
}
