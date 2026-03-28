const MOBILE_BREAKPOINT = 768;
const LOW_END_CONCURRENCY = 4;
const HIGH_END_MOBILE_CONCURRENCY = 6;
const HIGH_END_MOBILE_MEMORY_GB = 4;
const MOBILE_DEFAULT_MAX_DPR = 1.5;
const MOBILE_HIGH_END_MAX_DPR = 1.8;
const DESKTOP_MAX_DPR = 2;

function getHardwareConcurrency() {
  if (typeof navigator === "undefined") return LOW_END_CONCURRENCY;

  return navigator.hardwareConcurrency || LOW_END_CONCURRENCY;
}

function getDeviceMemory() {
  if (typeof navigator === "undefined" || !("deviceMemory" in navigator)) return null;

  return navigator.deviceMemory as number;
}

export function getIsMobileHeroGraphicLayout(width: number) {
  return width < MOBILE_BREAKPOINT || getHardwareConcurrency() < LOW_END_CONCURRENCY;
}

export function getHeroGraphicMaxPixelRatio(isMobileLayout: boolean) {
  if (!isMobileLayout) return DESKTOP_MAX_DPR;

  const hardwareConcurrency = getHardwareConcurrency();
  const deviceMemory = getDeviceMemory();
  const isHighEndMobile =
    hardwareConcurrency >= HIGH_END_MOBILE_CONCURRENCY &&
    (deviceMemory == null || deviceMemory >= HIGH_END_MOBILE_MEMORY_GB);

  return isHighEndMobile ? MOBILE_HIGH_END_MAX_DPR : MOBILE_DEFAULT_MAX_DPR;
}
