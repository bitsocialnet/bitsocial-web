// Above-the-fold copy is server-rendered in its final state so it paints before the bundle
// loads; markup that waits at opacity 0 for hydration delays Largest Contentful Paint by the
// whole script download. The first client render has to match that markup, so entrance
// animations only play on mounts that follow it, such as a client-side navigation home.
let initialRenderCommitted = false;

export function markInitialRenderCommitted() {
  initialRenderCommitted = true;
}

export function hasInitialRenderCommitted() {
  return initialRenderCommitted;
}
