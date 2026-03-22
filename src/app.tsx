import { useLayoutEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "@/pages/home";
import Docs from "@/pages/docs";
import Apps from "@/pages/apps";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import Status from "@/pages/status";
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

function App() {
  return (
    <Router>
      <InitialHomeScrollGuard />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </Router>
  );
}

export default App;
