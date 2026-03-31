import React from "react";
import ReactDOM from "react-dom/client";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import App from "./app.tsx";
import { ThemeProvider } from "./components/theme-provider";
import { GraphicsModeProvider } from "@/lib/graphics-mode";
import "@/lib/i18n";
import "@/lib/react-scan";
import "./index.css";

function AnimationGate({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
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
