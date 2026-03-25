import { m, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type ApproachId = "federated" | "blockchain" | "bitsocial";

const approaches: { id: ApproachId; label: string; subtitle: string }[] = [
  { id: "federated", label: "Federated", subtitle: "Bluesky, Mastodon, Lemmy, Nostr" },
  { id: "blockchain", label: "Blockchain", subtitle: "DeSo, Lens, Farcaster, Minds, Steemit" },
  { id: "bitsocial", label: "Bitsocial", subtitle: "The only peer-to-peer social network" },
];

const rows: { label: string; values: Record<ApproachId, string> }[] = [
  {
    label: "Node requirements",
    values: {
      federated: "Server + domain + SSL",
      blockchain: "Datacenter hardware",
      bitsocial: "Very low (e.g., Raspberry Pi)",
    },
  },
  {
    label: "Data hosting",
    values: {
      federated: "Instance operator's server",
      blockchain: "Entire chain on every node",
      bitsocial: "Community/profile owners, via full nodes",
    },
  },
  {
    label: "Scalability",
    values: {
      federated: "Bottleneck per instance",
      blockchain: "Chain grows, costs rise",
      bitsocial: "More users = faster",
    },
  },
  {
    label: "Resilience",
    values: {
      federated: "DDoS, SSL revoked, domain seized",
      blockchain: "Validator censorship",
      bitsocial: "No single point of failure",
    },
  },
  {
    label: "Getting started",
    values: {
      federated: "Sign up on someone's instance",
      blockchain: "Buy tokens, create wallet",
      bitsocial: "Open a Bitsocial app",
    },
  },
];

const DEFAULT_APPROACH_INDEX = Math.max(
  0,
  approaches.findIndex(({ id }) => id === "bitsocial"),
);

const ComparisonCardContent = memo(function ComparisonCardContent({
  approach,
  isBitsocial,
}: {
  approach: (typeof approaches)[number];
  isBitsocial: boolean;
}) {
  return (
    <>
      <div className="mb-4 pb-3 border-b border-[var(--glass-border-subtle)]">
        <h3 className="text-base md:text-lg font-display font-semibold">{approach.label}</h3>
        <p className="text-xs text-muted-foreground/60">{approach.subtitle}</p>
      </div>
      <div className="space-y-3.5">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/50 mb-0.5">
              {row.label}
            </p>
            <div className="flex gap-2 items-start">
              {isBitsocial ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" aria-hidden />
              ) : (
                <X className="h-4 w-4 shrink-0 text-red-500 mt-0.5" aria-hidden />
              )}
              <p
                className={`text-sm font-medium min-w-0 ${
                  isBitsocial ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {row.values[approach.id]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
});

const ComparisonCard = memo(function ComparisonCard({
  approach,
  isBitsocial,
}: {
  approach: (typeof approaches)[number];
  isBitsocial: boolean;
}) {
  return (
    <div
      className={`glass-card p-5 md:p-7 h-full ${
        isBitsocial ? "border !border-blue-glow shadow-[0_0_20px_rgba(37,99,235,0.35)]" : ""
      }`}
    >
      <ComparisonCardContent approach={approach} isBitsocial={isBitsocial} />
    </div>
  );
});

const MobileComparisonCarousel = memo(function MobileComparisonCarousel() {
  const [activeIndex, setActiveIndex] = useState(DEFAULT_APPROACH_INDEX);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const clampIndex = useCallback(
    (nextIndex: number) => Math.max(0, Math.min(approaches.length - 1, nextIndex)),
    [],
  );

  const scrollToIndex = useCallback(
    (nextIndex: number, behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth") => {
      const carousel = carouselRef.current;
      if (!carousel) {
        return;
      }

      const boundedIndex = clampIndex(nextIndex);

      carousel.scrollTo({
        left: boundedIndex * carousel.clientWidth,
        behavior,
      });
    },
    [clampIndex, prefersReducedMotion],
  );

  const cancelScrollAnimation = useCallback(() => {
    if (animationFrameRef.current === null) {
      return;
    }

    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.style.scrollSnapType = "";
    }
  }, []);

  const animateToIndex = useCallback(
    (nextIndex: number) => {
      const carousel = carouselRef.current;
      if (!carousel) {
        return;
      }

      const boundedIndex = clampIndex(nextIndex);
      const startScrollLeft = carousel.scrollLeft;
      const targetScrollLeft = boundedIndex * carousel.clientWidth;

      if (Math.abs(targetScrollLeft - startScrollLeft) < 1) {
        setActiveIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        return;
      }

      cancelScrollAnimation();

      const duration = 360;
      let startTime: number | null = null;
      carousel.style.scrollSnapType = "none";

      const step = (timestamp: number) => {
        if (startTime === null) {
          startTime = timestamp;
        }

        const progress = Math.min(1, (timestamp - startTime) / duration);
        const easedProgress = 1 - (1 - progress) ** 3;
        carousel.scrollLeft =
          startScrollLeft + (targetScrollLeft - startScrollLeft) * easedProgress;

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(step);
          return;
        }

        carousel.scrollLeft = targetScrollLeft;
        carousel.style.scrollSnapType = "";
        animationFrameRef.current = null;
        setActiveIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
      };

      animationFrameRef.current = window.requestAnimationFrame(step);
    },
    [cancelScrollAnimation, clampIndex],
  );

  const setPage = useCallback(
    (nextIndex: number, behavior?: ScrollBehavior) => {
      const boundedIndex = clampIndex(nextIndex);

      if (behavior === "auto" || prefersReducedMotion) {
        setActiveIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        cancelScrollAnimation();
        scrollToIndex(boundedIndex, "auto");
        return;
      }

      animateToIndex(boundedIndex);
    },
    [animateToIndex, cancelScrollAnimation, clampIndex, prefersReducedMotion, scrollToIndex],
  );

  const syncActiveIndex = useCallback(() => {
    scrollFrameRef.current = null;

    const carousel = carouselRef.current;
    if (!carousel || carousel.clientWidth === 0) {
      return;
    }

    const nextIndex = clampIndex(Math.round(carousel.scrollLeft / carousel.clientWidth));

    startTransition(() => {
      setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
    });
  }, [clampIndex]);

  const handleScroll = useCallback(() => {
    if (scrollFrameRef.current !== null) {
      return;
    }

    scrollFrameRef.current = window.requestAnimationFrame(syncActiveIndex);
  }, [syncActiveIndex]);

  useLayoutEffect(() => {
    scrollToIndex(DEFAULT_APPROACH_INDEX, "auto");
  }, [scrollToIndex]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const observer = new ResizeObserver(() => {
      scrollToIndex(activeIndex, "auto");
    });

    observer.observe(carousel);

    return () => {
      observer.disconnect();
    };
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <m.div
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="md:hidden"
    >
      <div className="flex gap-1.5 justify-center mb-5" role="tablist">
        {approaches.map((approach, index) => (
          <button
            key={approach.id}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`panel-${approach.id}`}
            id={`tab-${approach.id}`}
            onClick={() => setPage(index)}
            className={`px-4 py-2 rounded-full border border-transparent text-xs font-display font-medium transition-colors duration-200 motion-reduce:transition-none ${
              activeIndex === index
                ? approach.id === "bitsocial"
                  ? "bg-blue-core text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                  : "glass-card text-foreground"
                : approach.id === "bitsocial"
                  ? "border-blue-core/30 bg-blue-core/10 text-blue-glow hover:bg-blue-core/15 hover:border-blue-glow"
                  : "text-muted-foreground/60 hover:text-muted-foreground"
            }`}
          >
            {approach.label}
          </button>
        ))}
      </div>

      <div
        ref={carouselRef}
        onScroll={handleScroll}
        onPointerDownCapture={cancelScrollAnimation}
        className="overflow-x-auto overflow-y-visible overscroll-x-contain touch-pan-x snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex">
          {approaches.map((approach, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={approach.id}
                id={`panel-${approach.id}`}
                role="tabpanel"
                aria-hidden={!isActive}
                aria-labelledby={`tab-${approach.id}`}
                className="min-w-full snap-center snap-always px-1"
              >
                <ComparisonCard approach={approach} isBitsocial={approach.id === "bitsocial"} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-4" aria-hidden>
        {approaches.map((approach, index) => (
          <button
            key={approach.id}
            tabIndex={-1}
            aria-label={approach.label}
            onClick={() => setPage(index)}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-200 motion-reduce:transition-none ${
              index === activeIndex
                ? "w-6 bg-blue-glow"
                : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </m.div>
  );
});

export default function SanctuaryCommunication() {
  return (
    <section id="sanctuary-communication" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section label — reads last (smallest, muted) per visual hierarchy principle */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs md:text-sm font-display tracking-[0.2em] uppercase text-center mb-6 text-muted-foreground/50"
        >
          Sanctuary Communication
        </m.p>

        {/* Hero statement — reads first (biggest, boldest) */}
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-center mb-6 text-balance leading-[1.1] text-muted-foreground"
        >
          It just works.
        </m.h2>

        {/* Supporting text — reads second */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-16 text-balance leading-relaxed"
        >
          No servers to rent. No domains to buy. No chains to sync. A Bitsocial node runs on a
          Raspberry Pi — and like BitTorrent, the more people join, the faster and more resilient it
          gets.
        </m.p>

        <MobileComparisonCarousel />

        {/* ---- Desktop: three-column grid ---- */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {approaches.map((a, i) => (
            <m.div
              key={a.id}
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              <ComparisonCard approach={a} isBitsocial={a.id === "bitsocial"} />
            </m.div>
          ))}
        </div>

        {/* Founder attribution — links to whitepaper discussion */}
        <m.a
          href="https://github.com/plebbit/whitepaper/discussions/2#:~:text=your%20community%20literally,solve%20that%20problem."
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="block text-center text-xs md:text-sm text-muted-foreground/40 mt-14 italic max-w-lg mx-auto rounded-md hover:text-muted-foreground/55 transition-[color,box-shadow] duration-300"
        >
          &ldquo;Your community literally cannot be banned or blocked by anyone, even a government.
          We solve that problem.&rdquo;
          <span className="not-italic block mt-1">— Esteban Abaroa, Bitsocial founder</span>
        </m.a>
      </div>
    </section>
  );
}
