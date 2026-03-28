let cachedWebGLSupport: boolean | null = null;

export function hasWebGLSupport() {
  if (cachedWebGLSupport != null) return cachedWebGLSupport;
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (!("WebGLRenderingContext" in window)) return false;

  const canvas = document.createElement("canvas");

  try {
    cachedWebGLSupport = canvas.getContext("webgl") !== null;
  } catch {
    cachedWebGLSupport = false;
  }

  return cachedWebGLSupport;
}
