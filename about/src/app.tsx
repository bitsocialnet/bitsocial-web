import { Suspense, lazy, useLayoutEffect, useRef, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "@/pages/home";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import Privacy from "@/pages/privacy";
import SeoHead from "@/components/seo-head";
import { isRouteAccessible } from "@/lib/dev-only-routes";
import { normalizeInitialHomeScrollPosition } from "@/lib/initial-scroll";

const Apps = lazy(() => import("@/pages/apps"));
const AppDetail = lazy(() => import("@/pages/app-detail"));

function RouteLoadingFallback() {
  return <div className="min-h-screen bg-background" aria-hidden />;
}

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

function App() {
  return (
    <Router>
      <SeoHead />
      <InitialHomeScrollGuard />
      <RouteScrollReset />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/apps"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <Apps />
            </Suspense>
          }
        />
        <Route
          path="/apps/:slug"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <AppDetail />
            </Suspense>
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="/about"
          element={
            <DevelopmentOnlyRoute>
              <About />
            </DevelopmentOnlyRoute>
          }
        />
        <Route
          path="/blog"
          element={
            <DevelopmentOnlyRoute>
              <Blog />
            </DevelopmentOnlyRoute>
          }
        />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;
