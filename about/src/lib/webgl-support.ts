let cachedWebGLSupport = false;

export function hasWebGLSupport() {
  if (cachedWebGLSupport) return true;
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (!("WebGLRenderingContext" in window)) return false;

  const canvas = document.createElement("canvas");

  try {
    // Only a successful probe is cached: a context request can fail while the
    // GPU process is still coming back after a purge or a resumed tab, and
    // caching that would strand the page on the static fallback for good.
    cachedWebGLSupport = canvas.getContext("webgl") !== null;
  } catch {
    return false;
  }

  return cachedWebGLSupport;
}
