import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getClientBootstrapPayload } from "@/lib/bootstrap";
import { hasWebGLSupport } from "@/lib/webgl-support";

type GraphicsMode = "pending" | "full" | "fallback";

const GraphicsModeContext = createContext<GraphicsMode | null>(null);

function getReducedMotionQuery() {
  if (typeof window === "undefined") return null;
  return window.matchMedia("(prefers-reduced-motion: reduce)");
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

  useEffect(() => {
    const reducedMotionQuery = getReducedMotionQuery();

    const updateMode = () => {
      syncReducedMotionDataset(Boolean(reducedMotionQuery?.matches));

      const nextMode = computeGraphicsMode(reducedMotionQuery);
      if (lastModeRef.current === nextMode) return;
      lastModeRef.current = nextMode;
      setGraphicsMode(nextMode);
    };

    updateMode();
    if (!reducedMotionQuery) return;

    const handleReducedMotionChange = () => updateMode();
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    } else {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    return () => {
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      } else {
        reducedMotionQuery.removeListener(handleReducedMotionChange);
      }
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
