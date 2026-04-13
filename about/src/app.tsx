import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "@/pages/home";
import Apps from "@/pages/apps";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import Privacy from "@/pages/privacy";
import AppDetail from "@/pages/app-detail";
import PolygonMeshBackground from "@/components/polygon-mesh-background";
import SeoHead from "@/components/seo-head";
import { isRouteAccessible } from "@/lib/dev-only-routes";
import { normalizeInitialHomeScrollPosition } from "@/lib/initial-scroll";

function InitialHomeScrollGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasNormalizedInitialLoad = useRef(false);

  useLayoutEffect(() => {
    if (location.hash === "#hero-tagline") {
      navigate({ pathname: location.pathname, search: location.search }, { replace: true });
      return;
    }
    if (hasNormalizedInitialLoad.current) return;
    hasNormalizedInitialLoad.current = true;
    if (location.pathname !== "/" || location.hash) return;
    return normalizeInitialHomeScrollPosition();
  }, [location.pathname, location.hash, location.search, navigate]);

  return null;
}

function RouteScrollReset() {
  const location = useLocation();
  const previousPathnameRef = useRef(location.pathname);

  useLayoutEffect(() => {
    if (previousPathnameRef.current !== location.pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    previousPathnameRef.current = location.pathname;
  }, [location.pathname]);

  return null;
}

function DevelopmentOnlyRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (isRouteAccessible(location.pathname)) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace state={{ unavailablePath: location.pathname }} />;
}

function AppFrame({
  enableClientEffects,
  includeAnalytics,
}: {
  enableClientEffects: boolean;
  includeAnalytics: boolean;
}) {
  return (
    <>
      {enableClientEffects ? <SeoHead /> : null}
      {enableClientEffects ? <InitialHomeScrollGuard /> : null}
      {enableClientEffects ? <RouteScrollReset /> : null}
      <div className="relative min-h-screen overflow-x-hidden">
        <PolygonMeshBackground />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/apps/:slug" element={<AppDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/blog"
              element={
                <DevelopmentOnlyRoute>
                  <Blog />
                </DevelopmentOnlyRoute>
              }
            />
          </Routes>
        </div>
      </div>
      {includeAnalytics ? <Analytics /> : null}
      {includeAnalytics ? <SpeedInsights /> : null}
    </>
  );
}

export function AppShell({
  enableClientEffects,
  includeAnalytics,
}: {
  enableClientEffects: boolean;
  includeAnalytics: boolean;
}) {
  return <AppFrame enableClientEffects={enableClientEffects} includeAnalytics={includeAnalytics} />;
}

function App() {
  return (
    <BrowserRouter>
      <AppShell enableClientEffects includeAnalytics />
    </BrowserRouter>
  );
}

export default App;
