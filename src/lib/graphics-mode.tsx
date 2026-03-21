import { createContext, useContext, useEffect, useRef, useState } from "react";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

export type GraphicsMode = "full" | "fallback";

const GraphicsModeContext = createContext<GraphicsMode | null>(null);

function getConnection() {
  if (typeof navigator === "undefined") return undefined;

  const nav = navigator as Navigator & {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  };

  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

function getReducedMotionQuery() {
  if (typeof window === "undefined") return null;
  return window.matchMedia("(prefers-reduced-motion: reduce)");
}

function computeGraphicsMode(reducedMotionQuery = getReducedMotionQuery()): GraphicsMode {
  if (typeof navigator === "undefined") return "fallback";

  const { deviceMemory } = navigator as Navigator & {
    deviceMemory?: number;
  };
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
  const memoryBudget = deviceMemory ?? 8;
  const connection = getConnection();
  const saveData = Boolean(connection?.saveData);
  const effectiveType = connection?.effectiveType ?? "";
  const isSlowConnection = effectiveType === "slow-2g" || effectiveType === "2g";
  const isLowEnd =
    Boolean(reducedMotionQuery?.matches) ||
    memoryBudget <= 4 ||
    hardwareConcurrency <= 4 ||
    saveData ||
    isSlowConnection;

  return isLowEnd ? "fallback" : "full";
}

function syncReducedMotionDataset(isReducedMotion: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.reducedMotion = isReducedMotion ? "true" : "false";
}

export function GraphicsModeProvider({ children }: { children: React.ReactNode }) {
  const [graphicsMode, setGraphicsMode] = useState<GraphicsMode>(() => computeGraphicsMode());
  const lastModeRef = useRef<GraphicsMode>(graphicsMode);

  useEffect(() => {
    const reducedMotionQuery = getReducedMotionQuery();
    if (!reducedMotionQuery) return;

    const updateMode = () => {
      syncReducedMotionDataset(reducedMotionQuery.matches);

      const nextMode = computeGraphicsMode(reducedMotionQuery);
      if (lastModeRef.current === nextMode) return;
      lastModeRef.current = nextMode;
      setGraphicsMode(nextMode);
    };

    updateMode();

    const handleReducedMotionChange = () => updateMode();
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    } else {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    const connection = getConnection();
    connection?.addEventListener?.("change", updateMode);

    return () => {
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      } else {
        reducedMotionQuery.removeListener(handleReducedMotionChange);
      }
      connection?.removeEventListener?.("change", updateMode);
    };
  }, []);

  return (
    <GraphicsModeContext.Provider value={graphicsMode}>{children}</GraphicsModeContext.Provider>
  );
}

export function useGraphicsMode() {
  const graphicsMode = useContext(GraphicsModeContext);
  return graphicsMode ?? "fallback";
}
