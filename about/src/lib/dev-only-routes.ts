export const DEV_ONLY_ROUTE_PATHS = ["/about", "/blog"] as const;

const devOnlyRoutePathSet = new Set<string>(DEV_ONLY_ROUTE_PATHS);

export function normalizeInternalPath(pathOrHref: string) {
  if (!pathOrHref.startsWith("/")) {
    return pathOrHref;
  }

  return pathOrHref.split(/[?#]/, 1)[0] || "/";
}

export function isDevOnlyRoute(pathOrHref: string) {
  return devOnlyRoutePathSet.has(normalizeInternalPath(pathOrHref));
}

export function isRouteAccessible(pathOrHref: string) {
  return import.meta.env.DEV || !isDevOnlyRoute(pathOrHref);
}
