import type { NavigateFunction } from "react-router-dom";

function scrollHomeInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

/** Navigate to `/` and scroll the document to the top (also when already on the home route). */
export function goHomeScrollTop(pathname: string, navigate: NavigateFunction) {
  const isHome = pathname === "/" || pathname === "";
  if (isHome) {
    if (window.location.hash) {
      navigate({ pathname: "/", hash: "" }, { replace: true });
    }
    scrollHomeInstant();
    return;
  }
  navigate("/");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollHomeInstant();
    });
  });
}
