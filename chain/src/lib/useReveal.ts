import { useEffect, useRef, useState } from "react";

// Reveals a section once it scrolls into view (IntersectionObserver — a real
// external subscription, not derived state). Falls back to revealed when the
// observer is unavailable so content is never stuck hidden. The defaults wait until a section is
// well inside the viewport; a lazy load can pass a margin to start just before it gets there.
export function useReveal<T extends Element = HTMLElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
}: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed, threshold, rootMargin]);

  return { ref, revealed };
}
