import { hasWebGLSupport } from "@/lib/webgl-support";

// Device and connection checks behind the hero graphics mode. This module stays free of React
// so the client entry can run it before the application bundle has downloaded.
export type GraphicsMode = "pending" | "full" | "fallback";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

const MOBILE_VIEWPORT_MAX_WIDTH = 767;
const MIN_APPLE_TOUCH_CORES_FOR_FULL_GRAPHICS = 4;
const MIN_NON_APPLE_MOBILE_CORES_FOR_FULL_GRAPHICS = 6;
const MIN_NON_APPLE_MOBILE_MEMORY_GB_FOR_FULL_GRAPHICS = 6;
const SLOW_EFFECTIVE_CONNECTION_TYPES = new Set(["slow-2g", "2g", "3g"]);
const MOBILE_USER_AGENT_PATTERN = /\b(Android|iPhone|iPad|iPod|Mobile|mobi)\b/i;
const CONSTRAINED_USER_AGENT_PATTERN =
  /\b(LibreWolf|moto g power|moto g play|moto g pure|moto e)\b/i;

export function getReducedMotionQuery() {
  if (typeof window === "undefined") return null;
  return window.matchMedia("(prefers-reduced-motion: reduce)");
}

export function getConnection() {
  const nav = navigator as Navigator & {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  };

  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

function getDeviceMemory() {
  if (!("deviceMemory" in navigator)) return null;

  return (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null;
}

function getHardwareConcurrency() {
  return navigator.hardwareConcurrency || 0;
}

function getViewportWidth() {
  return window.visualViewport?.width ?? window.innerWidth;
}

function isAppleTouchDevice() {
  const userAgent = navigator.userAgent ?? "";
  if (/\b(iPhone|iPad|iPod)\b/i.test(userAgent)) return true;

  return navigator.platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1;
}

function isMobileLikeDevice() {
  const userAgent = navigator.userAgent ?? "";
  const isMobileUserAgent =
    MOBILE_USER_AGENT_PATTERN.test(userAgent) ||
    Boolean(
      (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile,
    );
  const isCoarsePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const isNarrowTouchViewport =
    getViewportWidth() <= MOBILE_VIEWPORT_MAX_WIDTH && (navigator.maxTouchPoints ?? 0) > 0;

  return isAppleTouchDevice() || isMobileUserAgent || isCoarsePointer || isNarrowTouchViewport;
}

function isKnownConstrainedBrowserOrDevice() {
  const userAgent = navigator.userAgent ?? "";

  return CONSTRAINED_USER_AGENT_PATTERN.test(userAgent) || isPrivacyHardenedFirefox();
}

function isPrivacyHardenedFirefox() {
  const userAgent = navigator.userAgent ?? "";
  if (!/\bFirefox\//i.test(userAgent)) return false;

  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true;
}

function hasConstrainedConnection(connection = getConnection()) {
  if (!connection) return false;
  if (connection.saveData) return true;

  const effectiveType = connection.effectiveType?.toLowerCase();
  if (effectiveType && SLOW_EFFECTIVE_CONNECTION_TYPES.has(effectiveType)) return true;

  return false;
}

function hasCapableMobileHardware() {
  const hardwareConcurrency = getHardwareConcurrency();
  const deviceMemory = getDeviceMemory();

  if (isAppleTouchDevice()) {
    return hardwareConcurrency >= MIN_APPLE_TOUCH_CORES_FOR_FULL_GRAPHICS;
  }

  return (
    hardwareConcurrency >= MIN_NON_APPLE_MOBILE_CORES_FOR_FULL_GRAPHICS &&
    deviceMemory != null &&
    deviceMemory >= MIN_NON_APPLE_MOBILE_MEMORY_GB_FOR_FULL_GRAPHICS
  );
}

function shouldUseStaticFallbackForDevice() {
  const isMobileLike = isMobileLikeDevice();

  if (isKnownConstrainedBrowserOrDevice()) return true;
  if (!isMobileLike) return false;
  if (hasConstrainedConnection()) return true;

  return !hasCapableMobileHardware();
}

export function computeGraphicsMode(reducedMotionQuery = getReducedMotionQuery()): GraphicsMode {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof navigator === "undefined"
  ) {
    return "pending";
  }

  if (!hasWebGLSupport()) return "fallback";
  if (shouldUseStaticFallbackForDevice()) return "fallback";
  return reducedMotionQuery?.matches ? "fallback" : "full";
}

export function shouldPreferPngGraphicsFallback() {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof navigator === "undefined"
  ) {
    return false;
  }

  return isPrivacyHardenedFirefox();
}

/**
 * The part of `computeGraphicsMode` the server can answer from request headers. When it says
 * "fallback" the static hero image is in the HTML itself, so it paints without waiting for the
 * bundle; every other device stays "pending" until the browser has checked its hardware.
 * Firefox is left out because its fallback image format depends on a browser-only signal.
 */
export function getRequestGraphicsMode(request: {
  userAgent: string | undefined;
  saveData: string | undefined;
}): "pending" | "fallback" {
  const userAgent = request.userAgent ?? "";
  if (/\bFirefox\//i.test(userAgent)) return "pending";
  if (CONSTRAINED_USER_AGENT_PATTERN.test(userAgent)) return "fallback";
  if (request.saveData?.toLowerCase() === "on" && MOBILE_USER_AGENT_PATTERN.test(userAgent)) {
    return "fallback";
  }

  return "pending";
}
