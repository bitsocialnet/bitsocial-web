import "@/polyfills";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import App from "@/app";
import { ThemeProvider } from "@/components/theme-provider";
import { GraphicsModeProvider } from "@/lib/graphics-mode";
import { getClientBootstrapPayload } from "@/lib/bootstrap";
import { initializeClientI18n } from "@/lib/i18n";
import { configureP2PBrowserPkcOptions } from "@/lib/p2p-browser-config";
import "@/lib/react-scan";

// Configure pkc-js for pure browser-libp2p mode before any hooks lazily
// construct their PKC client. Mirrors 5chan/src/index.tsx.
configureP2PBrowserPkcOptions();

function AnimationGate({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}

async function bootstrap() {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Missing #root element for about-site bootstrap.");
  }
  const bootstrapPayload = getClientBootstrapPayload();
  await initializeClientI18n(bootstrapPayload);

  const app = (
    <React.StrictMode>
      <ThemeProvider>
        <GraphicsModeProvider>
          <AnimationGate>
            <App />
          </AnimationGate>
        </GraphicsModeProvider>
      </ThemeProvider>
    </React.StrictMode>
  );

  if (bootstrapPayload) {
    hydrateRoot(root, app);
    return;
  }

  createRoot(root).render(app);
}

void bootstrap();
