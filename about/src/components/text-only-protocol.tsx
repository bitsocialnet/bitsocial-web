import { m, useReducedMotion } from "framer-motion";
import {
  AppWindow,
  Ban,
  BadgeCheck,
  Eye,
  FileText,
  Globe,
  Network,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type ConcernId = "communities" | "apps" | "media";

type Concern = {
  id: ConcernId;
  icon: LucideIcon;
  mythKey: string;
  realityKey: string;
  points: Array<{ icon: LucideIcon; key: string }>;
};

const CONCERNS: Concern[] = [
  {
    id: "communities",
    icon: Users,
    mythKey: "textOnlyProtocol.communities.myth",
    realityKey: "textOnlyProtocol.communities.reality",
    points: [
      { icon: ShieldCheck, key: "textOnlyProtocol.communities.rules" },
      { icon: Globe, key: "textOnlyProtocol.communities.noGlobalAdmin" },
    ],
  },
  {
    id: "apps",
    icon: AppWindow,
    mythKey: "textOnlyProtocol.apps.myth",
    realityKey: "textOnlyProtocol.apps.reality",
    points: [
      { icon: Ban, key: "textOnlyProtocol.apps.blacklist" },
      { icon: BadgeCheck, key: "textOnlyProtocol.apps.reputation" },
    ],
  },
  {
    id: "media",
    icon: Eye,
    mythKey: "textOnlyProtocol.media.myth",
    realityKey: "textOnlyProtocol.media.reality",
    points: [
      { icon: Network, key: "textOnlyProtocol.media.notPrivate" },
      { icon: FileText, key: "textOnlyProtocol.media.textOnly" },
    ],
  },
];

function ConcernCard({ concern }: { concern: Concern }) {
  const { t } = useTranslation();
  const Icon = concern.icon;

  return (
    <article className="glass-card flex h-full flex-col p-6 md:p-7">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-core/40 bg-blue-core/[0.08] text-blue-glow dark:border-blue-core/55 dark:bg-blue-core/[0.16]"
        aria-hidden
      >
        <Icon className="h-4 w-4" />
      </span>

      <p className="mt-4 text-sm italic text-muted-foreground/55">
        &ldquo;{t(concern.mythKey)}&rdquo;
      </p>

      <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug text-foreground/90 md:text-2xl">
        {t(concern.realityKey)}
      </h3>

      <ul className="mt-5 space-y-3 border-t border-[var(--glass-border-subtle)] pt-5">
        {concern.points.map((point) => {
          const PointIcon = point.icon;

          return (
            <li key={point.key} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--glass-border-subtle)] bg-background/55 text-blue-glow dark:bg-background/25"
                aria-hidden
              >
                <PointIcon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 text-sm leading-relaxed text-muted-foreground/85">
                {t(point.key)}
              </span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

// Subtle scale (not opacity) de-emphasizes inactive panels. The cards paint
// their background with a backdrop-filter, which the browser suppresses while an
// ancestor is at opacity < 1 — so fading a panel would drop its glass surface.
const CARD_FOCUS_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.9,
};

function MobileConcernCarousel({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getPanels = () =>
    carouselRef.current
      ? Array.from(carouselRef.current.querySelectorAll<HTMLElement>("[data-concern-panel]"))
      : [];

  const scrollToIndex = (index: number) => {
    const carousel = carouselRef.current;
    const panel = getPanels()[index];
    if (!carousel || !panel) return;

    const left = panel.offsetLeft - (carousel.clientWidth - panel.offsetWidth) / 2;
    carousel.scrollTo({
      left: Math.max(0, left),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let nearest = 0;
    let smallest = Number.POSITIVE_INFINITY;
    getPanels().forEach((panel, index) => {
      const distance = Math.abs(panel.offsetLeft + panel.offsetWidth / 2 - center);
      if (distance < smallest) {
        smallest = distance;
        nearest = index;
      }
    });

    setActiveIndex((current) => (current === nearest ? current : nearest));
  };

  return (
    <div role="group" aria-label={t("textOnlyProtocol.carouselLabel")}>
      <div className="-mx-6 overflow-visible">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex items-stretch gap-3">
            <div aria-hidden className="w-9 shrink-0" />
            {CONCERNS.map((concern, index) => (
              <m.div
                key={concern.id}
                data-concern-panel
                animate={{ scale: activeIndex === index ? 1 : 0.985 }}
                transition={prefersReducedMotion ? { duration: 0 } : CARD_FOCUS_TRANSITION}
                className="w-[calc(100vw-4.5rem)] shrink-0 snap-center px-2 transform-gpu"
              >
                <ConcernCard concern={concern} />
              </m.div>
            ))}
            <div aria-hidden className="w-9 shrink-0" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {CONCERNS.map((concern, index) => (
          <button
            key={concern.id}
            type="button"
            aria-label={t(concern.realityKey)}
            aria-current={activeIndex === index}
            onClick={() => scrollToIndex(index)}
            className={`h-1.5 w-6 origin-center transform-gpu rounded-full transition-[transform,background-color] duration-200 motion-reduce:transition-none ${
              activeIndex === index
                ? "scale-x-100 bg-blue-glow"
                : "scale-x-[0.25] bg-muted-foreground/20 hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function TextOnlyProtocol() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const reveal = (y: number, delay = 0, duration = 0.6) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration, delay },
        };
  // Cards reveal with translateY only. A backdrop-filter is suppressed while an
  // ancestor animates opacity, which would blank the glass surface mid-reveal.
  const revealCard = (y: number, delay = 0, duration = 0.6) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { y },
          whileInView: { y: 0 },
          viewport: { once: true },
          transition: { duration, delay },
        };

  return (
    <section className="px-6 py-24" aria-labelledby="text-only-protocol-title">
      <div className="mx-auto max-w-6xl">
        <div
          id="text-only-protocol"
          data-home-section-label
          className="scroll-mt-[99px] md:scroll-mt-[103px]"
        >
          <m.div
            {...reveal(14, 0, 0.5)}
            className="mb-6 block text-center text-xs font-display uppercase tracking-[0.2em] text-muted-foreground/75 dark:text-muted-foreground/70 md:text-sm"
          >
            <a
              href="#text-only-protocol"
              className="rounded-md transition-[color,box-shadow] duration-300 dark:hover:text-muted-foreground/82"
            >
              {t("textOnlyProtocol.sectionLabel")}
            </a>
          </m.div>
        </div>

        <m.h2
          id="text-only-protocol-title"
          {...reveal(20, 0.1)}
          className="mb-6 text-center text-4xl font-display font-semibold leading-[1.1] text-balance text-muted-foreground md:text-6xl lg:text-7xl"
        >
          {t("textOnlyProtocol.title")}
        </m.h2>

        <m.p
          {...reveal(20, 0.2)}
          className="mx-auto mb-12 max-w-xl text-center text-base leading-relaxed text-balance text-muted-foreground md:text-lg"
        >
          {t("textOnlyProtocol.supporting")}
        </m.p>

        {/* Mobile: swipeable carousel (JS only) */}
        <m.div {...revealCard(20, 0.25)} className="js-only md:hidden">
          <MobileConcernCarousel prefersReducedMotion={prefersReducedMotion} />
        </m.div>

        {/* Mobile fallback: stacked cards when JS is unavailable */}
        <noscript>
          <div className="space-y-4 md:hidden">
            {CONCERNS.map((concern) => (
              <ConcernCard key={concern.id} concern={concern} />
            ))}
          </div>
        </noscript>

        {/* Desktop: three-column grid */}
        <div className="hidden gap-4 md:grid md:grid-cols-3 lg:gap-5">
          {CONCERNS.map((concern, index) => (
            <m.div key={concern.id} {...revealCard(20, 0.3 + index * 0.08)}>
              <ConcernCard concern={concern} />
            </m.div>
          ))}
        </div>

        <m.blockquote
          {...reveal(0, 0.5, 0.8)}
          className="mx-auto mt-14 block max-w-lg text-center text-xs italic text-muted-foreground/75 dark:text-muted-foreground/70 md:text-sm"
        >
          &ldquo;{t("textOnlyProtocol.quote")}&rdquo;
          <span className="mt-1 block not-italic">{t("textOnlyProtocol.quoteAttribution")}</span>
        </m.blockquote>
      </div>
    </section>
  );
}
