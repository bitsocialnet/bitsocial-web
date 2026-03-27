import { m, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
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
  { id: "federated", label: "Federated", subtitle: "Bluesky, Mastodon, Lemmy" },
  { id: "blockchain", label: "Chain / Hub", subtitle: "Farcaster, Lens, DeSo, Steemit" },
  {
    id: "bitsocial",
    label: "Bitsocial",
    subtitle: "Pure P2P with arbitrary anti-spam challenges",
  },
];

const rows: { label: string; values: Record<ApproachId, string> }[] = [
  {
    label: "Self-hosting cost",
    values: {
      federated: "Server + domain + SSL",
      blockchain: "Expensive node, hub, or RPC",
      bitsocial: "Extremely cheap, runs on Raspberry Pi",
    },
  },
  {
    label: "Who keeps it online",
    values: {
      federated: "Service / instance operator",
      blockchain: "Chain, hub, or RPC infrastructure",
      bitsocial: "Community owners + helper seeders",
    },
  },
  {
    label: "Scaling model",
    values: {
      federated: "Bigger instances, higher bills",
      blockchain: "More state, heavier infra",
      bitsocial: "More peers, more bandwidth",
    },
  },
  {
    label: "Custom anti-spam logic",
    values: {
      federated: "Not built into the protocol",
      blockchain: "Tied to chains, hubs, or fees",
      bitsocial: "Built in: challenge can be anything",
    },
  },
  {
    label: "Takedown choke points",
    values: {
      federated: "Host, registrar, SSL, DDoS provider",
      blockchain: "Validators, hubs, RPCs",
      bitsocial: "No single choke point",
    },
  },
];

const DEFAULT_APPROACH_INDEX = Math.max(
  0,
  approaches.findIndex(({ id }) => id === "bitsocial"),
);
const MOBILE_CARD_SIDE_PEEK_CLASS = "w-9";
const MOBILE_CARD_FOCUS_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.9,
};
const MOBILE_SCROLL_SETTLE_DELAY_MS = 96;

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
        isBitsocial ? "border !border-blue-glow shadow-[0_0_28px_rgba(37,99,235,0.28)]" : ""
      }`}
    >
      <ComparisonCardContent approach={approach} isBitsocial={isBitsocial} />
    </div>
  );
});

const MobileComparisonCarousel = memo(function MobileComparisonCarousel() {
  const [activeIndex, setActiveIndex] = useState(DEFAULT_APPROACH_INDEX);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollSettleTimeoutRef = useRef<number | null>(null);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const getPanels = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return [];
    }

    return Array.from(carousel.querySelectorAll<HTMLDivElement>("[role='tabpanel']"));
  }, []);

  const getPanelScrollLeft = useCallback(
    (nextIndex: number) => {
      const carousel = carouselRef.current;
      if (!carousel) {
        return 0;
      }

      const panel = getPanels()[nextIndex];
      if (!panel) {
        return 0;
      }

      return Math.max(0, panel.offsetLeft - (carousel.clientWidth - panel.offsetWidth) / 2);
    },
    [getPanels],
  );

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
        left: getPanelScrollLeft(boundedIndex),
        behavior,
      });
    },
    [clampIndex, getPanelScrollLeft, prefersReducedMotion],
  );

  const clearScrollSettleTimeout = useCallback(() => {
    if (scrollSettleTimeoutRef.current !== null) {
      window.clearTimeout(scrollSettleTimeoutRef.current);
      scrollSettleTimeoutRef.current = null;
    }
  }, []);

  const cancelScrollAnimation = useCallback(() => {
    scrollTweenRef.current?.kill();
    scrollTweenRef.current = null;

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
      const targetScrollLeft = getPanelScrollLeft(boundedIndex);

      if (Math.abs(targetScrollLeft - carousel.scrollLeft) < 1) {
        setActiveIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        return;
      }

      const distance = Math.abs(targetScrollLeft - carousel.scrollLeft);
      const duration = Math.min(0.8, Math.max(0.56, 0.46 + distance / 1600));

      setPendingIndex((currentIndex) =>
        currentIndex === boundedIndex ? currentIndex : boundedIndex,
      );
      clearScrollSettleTimeout();
      cancelScrollAnimation();
      carousel.style.scrollSnapType = "none";

      scrollTweenRef.current = gsap.to(carousel, {
        scrollLeft: targetScrollLeft,
        duration,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          carousel.style.scrollSnapType = "";
          scrollTweenRef.current = null;
          setPendingIndex(null);
          setActiveIndex((currentIndex) =>
            currentIndex === boundedIndex ? currentIndex : boundedIndex,
          );
        },
      });
    },
    [cancelScrollAnimation, clampIndex, clearScrollSettleTimeout, getPanelScrollLeft],
  );

  const setPage = useCallback(
    (nextIndex: number, behavior?: ScrollBehavior) => {
      const boundedIndex = clampIndex(nextIndex);

      if (behavior === "auto" || prefersReducedMotion) {
        setPendingIndex(null);
        setActiveIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        clearScrollSettleTimeout();
        cancelScrollAnimation();
        scrollToIndex(boundedIndex, "auto");
        return;
      }

      animateToIndex(boundedIndex);
    },
    [
      animateToIndex,
      cancelScrollAnimation,
      clampIndex,
      clearScrollSettleTimeout,
      prefersReducedMotion,
      scrollToIndex,
    ],
  );

  const syncActiveIndex = useCallback(() => {
    scrollSettleTimeoutRef.current = null;

    const carousel = carouselRef.current;
    if (!carousel || carousel.clientWidth === 0 || scrollTweenRef.current) {
      return;
    }

    const panelOffsets = getPanels().map((panel) =>
      Math.max(0, panel.offsetLeft - (carousel.clientWidth - panel.offsetWidth) / 2),
    );
    if (panelOffsets.length === 0) {
      return;
    }

    const nextIndex = clampIndex(
      panelOffsets.reduce((closestIndex, panelOffset, index) => {
        const closestOffset = panelOffsets[closestIndex] ?? Number.POSITIVE_INFINITY;

        return Math.abs(panelOffset - carousel.scrollLeft) <
          Math.abs(closestOffset - carousel.scrollLeft)
          ? index
          : closestIndex;
      }, 0),
    );

    startTransition(() => {
      setPendingIndex(null);
      setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
    });
  }, [clampIndex, getPanels]);

  const handleScroll = useCallback(() => {
    if (scrollTweenRef.current) {
      return;
    }

    clearScrollSettleTimeout();
    scrollSettleTimeoutRef.current = window.setTimeout(
      syncActiveIndex,
      MOBILE_SCROLL_SETTLE_DELAY_MS,
    );
  }, [clearScrollSettleTimeout, syncActiveIndex]);

  const handlePointerDownCapture = useCallback(() => {
    setPendingIndex(null);
    clearScrollSettleTimeout();
    cancelScrollAnimation();
  }, [cancelScrollAnimation, clearScrollSettleTimeout]);

  useLayoutEffect(() => {
    scrollToIndex(DEFAULT_APPROACH_INDEX, "auto");
  }, [scrollToIndex]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setPage(activeIndex, "auto");
    });

    observer.observe(carousel);

    return () => {
      observer.disconnect();
    };
  }, [activeIndex, setPage]);

  useEffect(() => {
    return () => {
      clearScrollSettleTimeout();
      cancelScrollAnimation();
    };
  }, [cancelScrollAnimation, clearScrollSettleTimeout]);

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
              (pendingIndex ?? activeIndex) === index
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

      <div className="-mx-6 overflow-visible">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          onPointerDownCapture={handlePointerDownCapture}
          className="overflow-x-auto overscroll-x-contain touch-pan-x snap-x snap-mandatory py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex items-stretch gap-3">
            <div aria-hidden className={`${MOBILE_CARD_SIDE_PEEK_CLASS} shrink-0`} />
            {approaches.map((approach, index) => {
              const isActive = activeIndex === index;

              return (
                <m.div
                  key={approach.id}
                  id={`panel-${approach.id}`}
                  role="tabpanel"
                  aria-hidden={!isActive}
                  aria-labelledby={`tab-${approach.id}`}
                  animate={{ scale: isActive ? 1 : 0.985 }}
                  transition={prefersReducedMotion ? { duration: 0 } : MOBILE_CARD_FOCUS_TRANSITION}
                  className="w-[calc(100vw-4.5rem)] shrink-0 snap-center px-2 transform-gpu"
                >
                  <ComparisonCard approach={approach} isBitsocial={approach.id === "bitsocial"} />
                </m.div>
              );
            })}
            <div aria-hidden className={`${MOBILE_CARD_SIDE_PEEK_CLASS} shrink-0`} />
          </div>
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
    <section id="sanctuary-communication" className="scroll-mt-24 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section label — reads last (smallest, muted) per visual hierarchy principle */}
        <m.a
          data-sanctuary-label
          href="https://x.com/VitalikButerin/status/2030781981706051769#:~:text=Some%20%22sanctuary%20technology%22%20is%20sanctuary%20money.%20Other%20times%2C%20it%27s%20sanctuary%20communication.%20But%20we%20need%20sanctuary%20tools%20for%20collective%20voice%20too."
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="block text-xs md:text-sm font-display tracking-[0.2em] uppercase text-center mb-6 text-muted-foreground/50 rounded-md hover:text-muted-foreground/70 transition-[color,box-shadow] duration-300"
        >
          Sanctuary Communication
        </m.a>

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
          Raspberry Pi. And each community can enforce its own anti-spam challenge: captchas,
          reputation, SMS, payments, tokens, IP checks, or anything else that can be coded.
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
