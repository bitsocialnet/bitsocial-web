import { m, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { loadGsap, type TweenLike } from "@/lib/motion-runtime";

type ApproachId = "federated" | "blockchain" | "bitsocial";

type RowKey =
  | "selfHostingCost"
  | "whoKeepsOnline"
  | "scalingModel"
  | "customAntiSpam"
  | "takedownChokePoints";

const ROW_KEYS: RowKey[] = [
  "selfHostingCost",
  "whoKeepsOnline",
  "scalingModel",
  "customAntiSpam",
  "takedownChokePoints",
];

/** Static row keys (avoid dynamic template keys for tooling). */
const SANCTUARY_ROW_I18N: Record<
  RowKey,
  { label: string; federated: string; blockchain: string; bitsocial: string }
> = {
  selfHostingCost: {
    label: "sanctuary.rows.selfHostingCost.label",
    federated: "sanctuary.rows.selfHostingCost.federated",
    blockchain: "sanctuary.rows.selfHostingCost.blockchain",
    bitsocial: "sanctuary.rows.selfHostingCost.bitsocial",
  },
  whoKeepsOnline: {
    label: "sanctuary.rows.whoKeepsOnline.label",
    federated: "sanctuary.rows.whoKeepsOnline.federated",
    blockchain: "sanctuary.rows.whoKeepsOnline.blockchain",
    bitsocial: "sanctuary.rows.whoKeepsOnline.bitsocial",
  },
  scalingModel: {
    label: "sanctuary.rows.scalingModel.label",
    federated: "sanctuary.rows.scalingModel.federated",
    blockchain: "sanctuary.rows.scalingModel.blockchain",
    bitsocial: "sanctuary.rows.scalingModel.bitsocial",
  },
  customAntiSpam: {
    label: "sanctuary.rows.customAntiSpam.label",
    federated: "sanctuary.rows.customAntiSpam.federated",
    blockchain: "sanctuary.rows.customAntiSpam.blockchain",
    bitsocial: "sanctuary.rows.customAntiSpam.bitsocial",
  },
  takedownChokePoints: {
    label: "sanctuary.rows.takedownChokePoints.label",
    federated: "sanctuary.rows.takedownChokePoints.federated",
    blockchain: "sanctuary.rows.takedownChokePoints.blockchain",
    bitsocial: "sanctuary.rows.takedownChokePoints.bitsocial",
  },
};

type Approach = { id: ApproachId; label: string; subtitle: string };
type ComparisonRow = { label: string; values: Record<ApproachId, string> };

function useSanctuaryComparisonData(t: TFunction) {
  return useMemo(() => {
    const approaches: Approach[] = [
      {
        id: "federated",
        label: t("sanctuary.approaches.federated.label"),
        subtitle: t("sanctuary.approaches.federated.subtitle"),
      },
      {
        id: "blockchain",
        label: t("sanctuary.approaches.blockchain.label"),
        subtitle: t("sanctuary.approaches.blockchain.subtitle"),
      },
      {
        id: "bitsocial",
        label: t("sanctuary.approaches.bitsocial.label"),
        subtitle: t("sanctuary.approaches.bitsocial.subtitle"),
      },
    ];
    const rows: ComparisonRow[] = ROW_KEYS.map((rk) => {
      const keys = SANCTUARY_ROW_I18N[rk];
      return {
        label: t(keys.label),
        values: {
          federated: t(keys.federated),
          blockchain: t(keys.blockchain),
          bitsocial: t(keys.bitsocial),
        },
      };
    });
    return { approaches, rows };
  }, [t]);
}

function useDefaultApproachIndex(approaches: Approach[]) {
  return useMemo(
    () =>
      Math.max(
        0,
        approaches.findIndex(({ id }) => id === "bitsocial"),
      ),
    [approaches],
  );
}
const MOBILE_CARD_SIDE_PEEK_CLASS = "w-9";
const MOBILE_CARD_FOCUS_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.9,
};
const MOBILE_SCROLL_SETTLE_DELAY_MS = 96;
const MOBILE_TAB_SCROLL_BASE_DURATION_S = 0.2;
const MOBILE_TAB_SCROLL_MAX_DURATION_S = 0.44;
const MOBILE_TAB_SCROLL_DISTANCE_FACTOR = 2600;

const ComparisonCardContent = memo(function ComparisonCardContent({
  approach,
  rows,
  isBitsocial,
}: {
  approach: Approach;
  rows: ComparisonRow[];
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
  rows,
  isBitsocial,
}: {
  approach: Approach;
  rows: ComparisonRow[];
  isBitsocial: boolean;
}) {
  return (
    <div
      className={`glass-card p-5 md:p-7 h-full ${
        isBitsocial ? "border !border-blue-glow shadow-[0_0_28px_rgba(37,99,235,0.28)]" : ""
      }`}
    >
      <ComparisonCardContent approach={approach} rows={rows} isBitsocial={isBitsocial} />
    </div>
  );
});

const NoJsMobileComparisonList = memo(function NoJsMobileComparisonList({
  approaches,
  rows,
}: {
  approaches: Approach[];
  rows: ComparisonRow[];
}) {
  return (
    <div className="space-y-3 md:hidden">
      {approaches.map((approach, index) => {
        const isBitsocial = approach.id === "bitsocial";

        return (
          <details
            key={approach.id}
            className={`glass-card overflow-hidden ${isBitsocial ? "border !border-blue-glow" : ""}`}
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {isBitsocial ? (
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  ) : (
                    <X className="h-4 w-4 shrink-0 text-red-500" aria-hidden />
                  )}
                  <h3 className="text-base font-display font-semibold text-foreground">
                    {approach.label}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground/70">{approach.subtitle}</p>
              </div>
              <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" />
            </summary>

            <div className="border-t border-[var(--glass-border-subtle)] px-5 pb-5 pt-4">
              <div className="space-y-3.5">
                {rows.map((row) => (
                  <div key={row.label}>
                    <p className="mb-0.5 text-xs uppercase tracking-wider text-muted-foreground/50">
                      {row.label}
                    </p>
                    <div className="flex items-start gap-2">
                      {isBitsocial ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                      )}
                      <p
                        className={`min-w-0 text-sm font-medium ${
                          isBitsocial ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {row.values[approach.id]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
});

const MobileComparisonCarousel = memo(function MobileComparisonCarousel({
  approaches,
  rows,
  defaultApproachIndex,
}: {
  approaches: Approach[];
  rows: ComparisonRow[];
  defaultApproachIndex: number;
}) {
  const [activeIndex, setActiveIndex] = useState(defaultApproachIndex);
  const [highlightedIndex, setHighlightedIndex] = useState(defaultApproachIndex);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollSettleTimeoutRef = useRef<number | null>(null);
  const scrollTweenRef = useRef<TweenLike | null>(null);
  const scrollAnimationRequestRef = useRef(0);
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
    [approaches.length],
  );

  const getClosestIndex = useCallback(
    (scrollLeft: number) => {
      const carousel = carouselRef.current;
      if (!carousel || carousel.clientWidth === 0) {
        return 0;
      }

      const panelOffsets = getPanels().map((panel) =>
        Math.max(0, panel.offsetLeft - (carousel.clientWidth - panel.offsetWidth) / 2),
      );
      if (panelOffsets.length === 0) {
        return 0;
      }

      return clampIndex(
        panelOffsets.reduce((closestIndex, panelOffset, index) => {
          const closestOffset = panelOffsets[closestIndex] ?? Number.POSITIVE_INFINITY;

          return Math.abs(panelOffset - scrollLeft) < Math.abs(closestOffset - scrollLeft)
            ? index
            : closestIndex;
        }, 0),
      );
    },
    [clampIndex, getPanels],
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
    scrollAnimationRequestRef.current += 1;
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
        setHighlightedIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        setActiveIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        return;
      }

      const distance = Math.abs(targetScrollLeft - carousel.scrollLeft);
      const duration = Math.min(
        MOBILE_TAB_SCROLL_MAX_DURATION_S,
        MOBILE_TAB_SCROLL_BASE_DURATION_S + distance / MOBILE_TAB_SCROLL_DISTANCE_FACTOR,
      );

      setPendingIndex((currentIndex) =>
        currentIndex === boundedIndex ? currentIndex : boundedIndex,
      );
      clearScrollSettleTimeout();
      cancelScrollAnimation();
      carousel.style.scrollSnapType = "none";
      const animationRequest = scrollAnimationRequestRef.current;

      void loadGsap()
        .then((gsap) => {
          if (!gsap || scrollAnimationRequestRef.current !== animationRequest) {
            carousel.style.scrollSnapType = "";
            setPendingIndex(null);
            return;
          }

          scrollTweenRef.current = gsap.to(carousel, {
            scrollLeft: targetScrollLeft,
            duration,
            ease: "power2.out",
            overwrite: true,
            onComplete: () => {
              if (scrollAnimationRequestRef.current !== animationRequest) {
                return;
              }

              carousel.style.scrollSnapType = "";
              scrollTweenRef.current = null;
              setPendingIndex(null);
              setHighlightedIndex((currentIndex) =>
                currentIndex === boundedIndex ? currentIndex : boundedIndex,
              );
              setActiveIndex((currentIndex) =>
                currentIndex === boundedIndex ? currentIndex : boundedIndex,
              );
            },
          });
        })
        .catch(() => {
          if (scrollAnimationRequestRef.current !== animationRequest) {
            return;
          }

          carousel.style.scrollSnapType = "";
          scrollTweenRef.current = null;
          setPendingIndex(null);
          scrollToIndex(boundedIndex, "smooth");
          setHighlightedIndex((currentIndex) =>
            currentIndex === boundedIndex ? currentIndex : boundedIndex,
          );
          setActiveIndex((currentIndex) =>
            currentIndex === boundedIndex ? currentIndex : boundedIndex,
          );
        });
    },
    [
      cancelScrollAnimation,
      clampIndex,
      clearScrollSettleTimeout,
      getPanelScrollLeft,
      scrollToIndex,
    ],
  );

  const setPage = useCallback(
    (nextIndex: number, behavior?: ScrollBehavior) => {
      const boundedIndex = clampIndex(nextIndex);

      if (behavior === "auto" || prefersReducedMotion) {
        setPendingIndex(null);
        setHighlightedIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
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

    const nextIndex = getClosestIndex(carousel.scrollLeft);

    startTransition(() => {
      setPendingIndex(null);
      setHighlightedIndex((currentIndex) =>
        currentIndex === nextIndex ? currentIndex : nextIndex,
      );
      setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
    });
  }, [getClosestIndex]);

  const handleScroll = useCallback(() => {
    if (scrollTweenRef.current) {
      return;
    }

    const carousel = carouselRef.current;
    if (carousel) {
      const nextIndex = getClosestIndex(carousel.scrollLeft);

      startTransition(() => {
        setHighlightedIndex((currentIndex) =>
          currentIndex === nextIndex ? currentIndex : nextIndex,
        );
      });
    }

    clearScrollSettleTimeout();
    scrollSettleTimeoutRef.current = window.setTimeout(
      syncActiveIndex,
      MOBILE_SCROLL_SETTLE_DELAY_MS,
    );
  }, [clearScrollSettleTimeout, getClosestIndex, syncActiveIndex]);

  const handlePointerDownCapture = useCallback(() => {
    setPendingIndex(null);
    clearScrollSettleTimeout();
    cancelScrollAnimation();
  }, [cancelScrollAnimation, clearScrollSettleTimeout]);

  useLayoutEffect(() => {
    scrollToIndex(defaultApproachIndex, "auto");
  }, [scrollToIndex, defaultApproachIndex]);

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
            aria-selected={highlightedIndex === index}
            aria-controls={`panel-${approach.id}`}
            id={`tab-${approach.id}`}
            onClick={() => setPage(index)}
            className={`px-4 py-2 rounded-full border border-transparent text-xs font-display font-medium transition-colors duration-200 motion-reduce:transition-none ${
              (pendingIndex ?? highlightedIndex) === index
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
          className="overflow-x-auto overscroll-x-contain snap-x snap-mandatory py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  <ComparisonCard
                    approach={approach}
                    rows={rows}
                    isBitsocial={approach.id === "bitsocial"}
                  />
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
            className={`h-1.5 w-6 origin-center rounded-full transform-gpu transition-[transform,background-color,opacity] duration-200 motion-reduce:transition-none ${
              index === highlightedIndex
                ? "scale-x-100 bg-blue-glow"
                : "scale-x-[0.25] bg-muted-foreground/20 hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </m.div>
  );
});

export default function SanctuaryCommunication() {
  const { t } = useTranslation();
  const { approaches, rows } = useSanctuaryComparisonData(t);
  const defaultApproachIndex = useDefaultApproachIndex(approaches);
  const noJsMobileApproaches = useMemo(() => {
    const bitsocialApproach = approaches.find(({ id }) => id === "bitsocial");
    const otherApproaches = approaches.filter(({ id }) => id !== "bitsocial");

    return bitsocialApproach ? [bitsocialApproach, ...otherApproaches] : approaches;
  }, [approaches]);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section label — reads last (smallest, muted) per visual hierarchy principle */}
        <div
          id="sanctuary-communication"
          data-home-section-label
          className="scroll-mt-[99px] md:scroll-mt-[103px]"
        >
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="block text-xs md:text-sm font-display tracking-[0.2em] uppercase text-center mb-6 text-muted-foreground/50"
          >
            <a
              data-sanctuary-label
              href="#sanctuary-communication"
              className="rounded-md transition-[color,box-shadow] duration-300 hover:text-muted-foreground/70"
            >
              {t("sanctuary.sectionLabel")}
            </a>
          </m.div>
        </div>

        {/* Hero statement — reads first (biggest, boldest) */}
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-center mb-6 text-balance leading-[1.1] text-muted-foreground"
        >
          {t("sanctuary.headline")}
        </m.h2>

        {/* Supporting text — reads second */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-16 text-balance leading-relaxed"
        >
          {t("sanctuary.supporting")}
        </m.p>

        <div className="js-only md:hidden">
          <MobileComparisonCarousel
            approaches={approaches}
            rows={rows}
            defaultApproachIndex={defaultApproachIndex}
          />
        </div>
        <noscript>
          <NoJsMobileComparisonList approaches={noJsMobileApproaches} rows={rows} />
        </noscript>

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
              <ComparisonCard approach={a} rows={rows} isBitsocial={a.id === "bitsocial"} />
            </m.div>
          ))}
        </div>

        {/* Founder attribution */}
        <m.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="block text-center text-xs md:text-sm text-muted-foreground/40 mt-14 italic max-w-lg mx-auto"
        >
          &ldquo;{t("sanctuary.quote")}&rdquo;
          <span className="not-italic block mt-1">{t("sanctuary.quoteAttribution")}</span>
        </m.blockquote>
      </div>
    </section>
  );
}
