import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getClientBootstrapPayload } from "@/lib/bootstrap";
import { hasWebGLSupport } from "@/lib/webgl-support";

type GraphicsMode = "pending" | "full" | "fallback";

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
const GRAPHICS_FALLBACK_EVENT = "bitsocial:graphics-fallback";

const GraphicsModeContext = createContext<GraphicsMode | null>(null);

function getReducedMotionQuery() {
  if (typeof window === "undefined") return null;
  return window.matchMedia("(prefers-reduced-motion: reduce)");
}

function getConnection() {
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
    /\b(Android|iPhone|iPad|iPod|Mobile|mobi)\b/i.test(userAgent) ||
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

  return (
    /\b(LibreWolf|moto g power|moto g play|moto g pure|moto e)\b/i.test(userAgent) ||
    isPrivacyHardenedFirefox()
  );
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

function computeGraphicsMode(reducedMotionQuery = getReducedMotionQuery()): GraphicsMode {
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

function syncReducedMotionDataset(isReducedMotion: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.reducedMotion = isReducedMotion ? "true" : "false";
}

export function GraphicsModeProvider({ children }: { children: React.ReactNode }) {
  const [graphicsMode, setGraphicsMode] = useState<GraphicsMode>(() => {
    const bootstrapPayload = getClientBootstrapPayload();
    return bootstrapPayload?.clientDefaults.graphicsMode ?? computeGraphicsMode();
  });
  const lastModeRef = useRef<GraphicsMode>(graphicsMode);
  const forcedFallbackRef = useRef(false);

  useEffect(() => {
    const reducedMotionQuery = getReducedMotionQuery();

    const updateMode = () => {
      syncReducedMotionDataset(Boolean(reducedMotionQuery?.matches));

      const nextMode = forcedFallbackRef.current
        ? "fallback"
        : computeGraphicsMode(reducedMotionQuery);
      if (lastModeRef.current === nextMode) return;
      lastModeRef.current = nextMode;
      setGraphicsMode(nextMode);
    };
    const connection = getConnection();

    updateMode();

    const handleReducedMotionChange = () => updateMode();
    const handleEnvironmentChange = () => updateMode();
    const handleFallbackRequest = () => {
      forcedFallbackRef.current = true;
      updateMode();
    };
    if (reducedMotionQuery?.addEventListener) {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    } else if (reducedMotionQuery) {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }
    connection?.addEventListener?.("change", handleEnvironmentChange);
    window.addEventListener("resize", handleEnvironmentChange);
    window.addEventListener(GRAPHICS_FALLBACK_EVENT, handleFallbackRequest);
    window.visualViewport?.addEventListener("resize", handleEnvironmentChange);

    return () => {
      if (reducedMotionQuery?.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      } else if (reducedMotionQuery) {
        reducedMotionQuery.removeListener(handleReducedMotionChange);
      }
      connection?.removeEventListener?.("change", handleEnvironmentChange);
      window.removeEventListener("resize", handleEnvironmentChange);
      window.removeEventListener(GRAPHICS_FALLBACK_EVENT, handleFallbackRequest);
      window.visualViewport?.removeEventListener("resize", handleEnvironmentChange);
    };
  }, []);

  return (
    <GraphicsModeContext.Provider value={graphicsMode}>{children}</GraphicsModeContext.Provider>
  );
}

export function useGraphicsMode() {
  const graphicsMode = useContext(GraphicsModeContext);
  return graphicsMode ?? "pending";
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

export function requestGraphicsFallback() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(GRAPHICS_FALLBACK_EVENT));
}
