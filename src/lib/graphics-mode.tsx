import { createContext, useContext, useEffect, useRef, useState } from "react";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

export type GraphicsMode = "full" | "fallback";

const GraphicsModeContext = createContext<GraphicsMode | null>(null);

export function GraphicsModeProvider({ children }: { children: React.ReactNode }) {
  const [graphicsMode, setGraphicsMode] = useState<GraphicsMode>("fallback");
  const lastModeRef = useRef<GraphicsMode>("fallback");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getConnection = () => {
      const nav = navigator as Navigator & {
        connection?: NetworkInformation;
        mozConnection?: NetworkInformation;
        webkitConnection?: NetworkInformation;
      };
      return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
    };

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const computeGraphicsMode = () => {
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
        reducedMotionQuery.matches ||
        memoryBudget <= 4 ||
        hardwareConcurrency <= 4 ||
        saveData ||
        isSlowConnection;

      return isLowEnd ? "fallback" : "full";
    };

    const updateMode = () => {
      const nextMode = computeGraphicsMode();
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

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      document.documentElement.dataset.reducedMotion = reducedMotionQuery.matches
        ? "true"
        : "false";
    };

    updateReducedMotion();

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", updateReducedMotion);
    } else {
      reducedMotionQuery.addListener(updateReducedMotion);
    }

    return () => {
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", updateReducedMotion);
      } else {
        reducedMotionQuery.removeListener(updateReducedMotion);
      }
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
