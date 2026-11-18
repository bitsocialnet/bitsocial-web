import { useEffect, useSyncExternalStore } from "react";
import { getRenderBootstrapPayload } from "@/lib/bootstrap";
import {
  computeGraphicsMode,
  getConnection,
  getReducedMotionQuery,
  type GraphicsMode,
} from "@/lib/graphics-device";

// The mode lives in a module-level store rather than React context. It always changes right
// after hydration (the server renders "pending"), and a context change above a Suspense
// boundary that has not hydrated yet makes React throw away that boundary's server markup.
// A store only re-renders the components that read it.
let currentMode: GraphicsMode | null = null;
let forcedFallback = false;
let detachEnvironmentListeners: (() => void) | null = null;
const listeners = new Set<() => void>();

function syncReducedMotionDataset(isReducedMotion: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.reducedMotion = isReducedMotion ? "true" : "false";
}

function refreshGraphicsMode() {
  const reducedMotionQuery = getReducedMotionQuery();
  syncReducedMotionDataset(Boolean(reducedMotionQuery?.matches));

  const nextMode = forcedFallback ? "fallback" : computeGraphicsMode(reducedMotionQuery);
  if (currentMode === nextMode) return;
  currentMode = nextMode;
  for (const listener of listeners) listener();
}

function attachEnvironmentListeners() {
  const reducedMotionQuery = getReducedMotionQuery();
  const connection = getConnection();

  if (reducedMotionQuery?.addEventListener) {
    reducedMotionQuery.addEventListener("change", refreshGraphicsMode);
  } else if (reducedMotionQuery) {
    reducedMotionQuery.addListener(refreshGraphicsMode);
  }
  connection?.addEventListener?.("change", refreshGraphicsMode);
  window.addEventListener("resize", refreshGraphicsMode);
  window.visualViewport?.addEventListener("resize", refreshGraphicsMode);

  return () => {
    if (reducedMotionQuery?.removeEventListener) {
      reducedMotionQuery.removeEventListener("change", refreshGraphicsMode);
    } else if (reducedMotionQuery) {
      reducedMotionQuery.removeListener(refreshGraphicsMode);
    }
    connection?.removeEventListener?.("change", refreshGraphicsMode);
    window.removeEventListener("resize", refreshGraphicsMode);
    window.visualViewport?.removeEventListener("resize", refreshGraphicsMode);
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!detachEnvironmentListeners) {
    detachEnvironmentListeners = attachEnvironmentListeners();
    refreshGraphicsMode();
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      detachEnvironmentListeners?.();
      detachEnvironmentListeners = null;
    }
  };
}

function getGraphicsModeSnapshot(): GraphicsMode {
  if (currentMode === null) {
    currentMode = forcedFallback ? "fallback" : computeGraphicsMode();
  }
  return currentMode;
}

// Also what the browser renders with while hydrating, so it matches the server markup.
function getServerGraphicsModeSnapshot(): GraphicsMode {
  return getRenderBootstrapPayload()?.clientDefaults.graphicsMode ?? "pending";
}

function noop() {}

/** Keeps the store's environment listeners and the reduced-motion dataset alive app-wide. */
export function GraphicsModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => subscribe(noop), []);

  return children;
}

export function useGraphicsMode() {
  return useSyncExternalStore(subscribe, getGraphicsModeSnapshot, getServerGraphicsModeSnapshot);
}

export function requestGraphicsFallback() {
  if (typeof window === "undefined") return;

  forcedFallback = true;
  refreshGraphicsMode();
}
