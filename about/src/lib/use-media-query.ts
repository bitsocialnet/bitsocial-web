import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes a component to a CSS media query and returns whether it currently matches.
 *
 * SSR fallback returns `false` so the server (and the first client render, to avoid a
 * hydration mismatch) sees the "not matching" state. The client then re-renders with the
 * real value once `useSyncExternalStore` reads the live `matchMedia` snapshot.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
