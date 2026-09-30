import React, { type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { GraphicsModeProvider } from "./lib/graphics-mode";
import { i18nReady } from "./lib/i18n";
import { ThemeProvider } from "./lib/useTheme";
import "./index.css";
import "./theme-bridge.css";
import "./app.css";
import "./sections.css";

function AnimationGate({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}

/** Mounts one HTML entry's page component with the providers every chain page shares. */
export async function renderPage(Page: ComponentType, profilerId: string) {
  const root = document.getElementById("root");

  if (!root) {
    throw new Error("Missing #root element for bso-site bootstrap.");
  }

  await i18nReady;

  const app = (
    <React.StrictMode>
      <ThemeProvider>
        <GraphicsModeProvider>
          <AnimationGate>
            <Page />
          </AnimationGate>
        </GraphicsModeProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
  const profiler =
    import.meta.env.DEV || import.meta.env.MODE === "profiling" ? window.__REACT_PERF__ : undefined;
  createRoot(root).render(
    profiler ? (
      <React.Profiler id={profilerId} onRender={profiler.onProfilerRender}>
        {app}
      </React.Profiler>
    ) : (
      app
    ),
  );
}
