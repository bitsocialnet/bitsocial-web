import "./lib/react-scan";
import React from "react";
import { createRoot } from "react-dom/client";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import App from "./App";
import { GraphicsModeProvider } from "./lib/graphics-mode";
import { i18nReady } from "./lib/i18n";
import { ThemeProvider } from "./lib/useTheme";
import "./index.css";
import "./theme-bridge.css";
import "./app.css";
import "./sections.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element for bso-site bootstrap.");
}

function AnimationGate({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}

async function bootstrap() {
  await i18nReady;

  createRoot(root!).render(
    <React.StrictMode>
      <ThemeProvider>
        <GraphicsModeProvider>
          <AnimationGate>
            <App />
          </AnimationGate>
        </GraphicsModeProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}

void bootstrap();
