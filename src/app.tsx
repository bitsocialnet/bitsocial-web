import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "@/pages/home";
import Apps from "@/pages/apps";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import Status from "@/pages/status";
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
      <InitialHomeScrollGuard />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/apps"
          element={
            <DevelopmentOnlyRoute>
              <Apps />
            </DevelopmentOnlyRoute>
          }
        />
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
        <Route
          path="/status"
          element={
            <DevelopmentOnlyRoute>
              <Status />
            </DevelopmentOnlyRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
