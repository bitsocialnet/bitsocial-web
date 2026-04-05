import type { NavigateFunction } from "react-router-dom";

function scrollHomeInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

/** Navigate to a route and scroll the document to the top (also when already on that route). */
export function goRouteScrollTop(pathname: string, targetPath: string, navigate: NavigateFunction) {
  const isCurrentRoute = pathname === targetPath || (targetPath === "/" && pathname === "");
  if (isCurrentRoute) {
    if (window.location.hash) {
      navigate({ pathname: targetPath, hash: "" }, { replace: true });
    }
    scrollHomeInstant();
    return;
  }

  navigate(targetPath);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollHomeInstant();
    });
  });
}

/** Navigate to `/` and scroll the document to the top (also when already on the home route). */
export function goHomeScrollTop(pathname: string, navigate: NavigateFunction) {
  goRouteScrollTop(pathname, "/", navigate);
}
