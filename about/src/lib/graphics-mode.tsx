import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getClientBootstrapPayload } from "@/lib/bootstrap";
import {
  computeGraphicsMode,
  getConnection,
  getReducedMotionQuery,
  type GraphicsMode,
} from "@/lib/graphics-device";

const GRAPHICS_FALLBACK_EVENT = "bitsocial:graphics-fallback";

const GraphicsModeContext = createContext<GraphicsMode | null>(null);

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

export function requestGraphicsFallback() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(GRAPHICS_FALLBACK_EVENT));
}
