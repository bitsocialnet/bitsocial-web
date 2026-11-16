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

/**
 * Hydration-safe replacement for framer-motion's `useReducedMotion`, which reads the preference
 * in the first client render while the server renders the full-motion markup. React does not
 * patch attribute mismatches while hydrating, so this reports reduced motion only after
 * hydration (client-only renders get it at once) and follows later changes of the setting.
 *
 * Hydrated motion elements have already mounted with their full-motion `initial` values when it
 * turns `true`. A reduced-motion branch must therefore move them to their final values (or
 * remount them); dropping the motion props would leave them hidden.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
