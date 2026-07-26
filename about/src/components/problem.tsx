import { m, useReducedMotion } from "framer-motion";
import { KeyRound, Scale, ServerCrash } from "lucide-react";
import { type ComponentType, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CardInlineCta from "@/components/card-inline-cta";
import { triggerFeatureGlow } from "@/lib/utils";

type ProblemId = "rented-identity" | "single-owner" | "one-rulebook";

interface Problem {
  /** Feature card id this consequence is answered by, mirrored 1:1 in the Core Features order. */
  answeredBy: string;
  icon: ComponentType<{ className?: string }>;
  id: ProblemId;
}

/** Static i18n keys (avoid dynamic `t(\`...\${id}\`)` for tooling). */
const PROBLEM_I18N: Record<ProblemId, { answer: string; description: string; title: string }> = {
  "rented-identity": {
    answer: "problem.items.rented-identity.answer",
    description: "problem.items.rented-identity.description",
    title: "problem.items.rented-identity.title",
  },
  "single-owner": {
    answer: "problem.items.single-owner.answer",
    description: "problem.items.single-owner.description",
    title: "problem.items.single-owner.title",
  },
  "one-rulebook": {
    answer: "problem.items.one-rulebook.answer",
    description: "problem.items.one-rulebook.description",
    title: "problem.items.one-rulebook.title",
  },
};

const PROBLEMS: Problem[] = [
  { id: "rented-identity", icon: KeyRound, answeredBy: "cryptographic-property" },
  { id: "single-owner", icon: ServerCrash, answeredBy: "no-servers" },
  { id: "one-rulebook", icon: Scale, answeredBy: "no-global-bans" },
];

const CARD_FOCUS_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.9,
};

interface ProblemCardProps {
  onAnswerClick: (event: React.MouseEvent<HTMLAnchorElement>, answeredBy: string) => void;
  problem: Problem;
}

function ProblemCard({ onAnswerClick, problem }: ProblemCardProps) {
  const { t } = useTranslation();
  const Icon = problem.icon;
  const keys = PROBLEM_I18N[problem.id];

  return (
    <article className="glass-card flex h-full flex-col p-6 md:p-7">
      <span
        aria-hidden="true"
        className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/40 text-muted-foreground"
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mb-3 font-display text-xl font-semibold text-balance text-foreground/85 md:text-2xl">
        {t(keys.title)}
      </h3>
      <p className="mb-8 text-sm leading-relaxed text-muted-foreground md:text-base">
        {t(keys.description)}
      </p>
      {/* Gap lives on the paragraph so the tallest card keeps it; mt-auto only bottom-aligns. */}
      <div className="mt-auto flex flex-col gap-2 border-t border-border/50 pt-5">
        <span className="pb-[10px] font-display text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground/70">
          {t("problem.answerLabel")}
        </span>
        <CardInlineCta
          href={`#${problem.answeredBy}`}
          onClick={(event) => onAnswerClick(event, problem.answeredBy)}
        >
          {t(keys.answer)}
        </CardInlineCta>
      </div>
    </article>
  );
}

interface MobileProblemCarouselProps {
  onAnswerClick: (event: React.MouseEvent<HTMLAnchorElement>, answeredBy: string) => void;
  prefersReducedMotion: boolean;
}

function MobileProblemCarousel({
  onAnswerClick,
  prefersReducedMotion,
}: MobileProblemCarouselProps) {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getPanels = () =>
    carouselRef.current
      ? Array.from(carouselRef.current.querySelectorAll<HTMLElement>("[data-problem-panel]"))
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
    <div role="group" aria-label={t("problem.carouselLabel")}>
      <div className="-mx-6 overflow-visible">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex items-stretch gap-3">
            <div aria-hidden className="w-9 shrink-0" />
            {PROBLEMS.map((problem, index) => (
              <m.div
                key={problem.id}
                data-problem-panel
                animate={{ scale: activeIndex === index ? 1 : 0.985 }}
                transition={prefersReducedMotion ? { duration: 0 } : CARD_FOCUS_TRANSITION}
                className="w-[calc(100vw-4.5rem)] shrink-0 snap-center px-2 transform-gpu"
              >
                <ProblemCard problem={problem} onAnswerClick={onAnswerClick} />
              </m.div>
            ))}
            <div aria-hidden className="w-9 shrink-0" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {PROBLEMS.map((problem, index) => (
          <button
            key={problem.id}
            type="button"
            aria-label={t(PROBLEM_I18N[problem.id].title)}
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

export default function ProblemSection() {
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

  const handleAnswerClick = (event: React.MouseEvent<HTMLAnchorElement>, answeredBy: string) => {
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${answeredBy}`,
    );
    triggerFeatureGlow(answeredBy);
  };

  return (
    <section
      className="px-6 py-24 -mt-[clamp(2.5rem,5vh,4rem)] pt-[clamp(2.5rem,5vh,4rem)] md:-mt-[clamp(3rem,5vh,4.5rem)] md:pt-[clamp(6rem,9vh,7.5rem)]"
      aria-labelledby="problem-title"
    >
      <div className="mx-auto max-w-6xl">
        <div id="problem" data-home-section-label className="scroll-mt-[99px] md:scroll-mt-[103px]">
          <m.div
            {...reveal(14, 0, 0.5)}
            className="mb-6 block text-center text-xs font-display uppercase tracking-[0.2em] text-muted-foreground/75 dark:text-muted-foreground/70 md:text-sm"
          >
            <a
              href="#problem"
              className="rounded-md transition-[color,box-shadow] duration-300 dark:hover:text-muted-foreground/82"
            >
              {t("problem.sectionLabel")}
            </a>
          </m.div>
        </div>

        <m.h2
          id="problem-title"
          {...reveal(20, 0.1)}
          className="mb-6 text-center text-4xl font-display font-semibold leading-[1.1] text-balance text-muted-foreground md:text-6xl lg:text-7xl"
        >
          {t("problem.title")}
        </m.h2>

        <m.p
          {...reveal(20, 0.2)}
          className="mx-auto mb-12 max-w-2xl text-center text-base leading-relaxed text-balance text-muted-foreground md:text-lg"
        >
          {t("problem.supporting")}
        </m.p>

        {/* Mobile: swipeable carousel (JS only) */}
        <m.div {...revealCard(20, 0.25)} className="js-only md:hidden">
          <MobileProblemCarousel
            onAnswerClick={handleAnswerClick}
            prefersReducedMotion={prefersReducedMotion}
          />
        </m.div>

        {/* Mobile fallback: stacked cards when JS is unavailable */}
        <noscript>
          <div className="space-y-4 md:hidden">
            {PROBLEMS.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} onAnswerClick={handleAnswerClick} />
            ))}
          </div>
        </noscript>

        {/* Desktop: three-column grid */}
        <div className="hidden gap-4 md:grid md:grid-cols-3 lg:gap-5">
          {PROBLEMS.map((problem, index) => (
            <m.div key={problem.id} {...revealCard(20, 0.3 + index * 0.08)}>
              <ProblemCard problem={problem} onAnswerClick={handleAnswerClick} />
            </m.div>
          ))}
        </div>

        <m.blockquote
          {...reveal(0, 0.55, 0.8)}
          className="mx-auto mt-14 block max-w-lg text-center text-xs italic text-muted-foreground/75 dark:text-muted-foreground/70 md:text-sm"
        >
          &ldquo;{t("problem.quote")}&rdquo;
          <span className="mt-1 block not-italic">{t("problem.quoteAttribution")}</span>
        </m.blockquote>
      </div>
    </section>
  );
}
