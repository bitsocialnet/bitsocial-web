import { m, useReducedMotion } from "framer-motion";
import { DollarSign, Server, ShieldCheck, type LucideIcon } from "lucide-react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

type Pillar = {
  icon: LucideIcon;
  label: string;
  description: string;
};

type Cohort = {
  id: "innovators" | "earlyAdopters" | "earlyMajority" | "lateMajority" | "laggards";
  labelKey: string;
  reasonKey: string;
  x0: number;
  x1: number;
  center: number;
  color: string;
  pct: string;
};

// Bell-curve geometry, in viewBox units. Boundaries follow the familiar
// technology-adoption split: 2.5 / 13.5 / 34 / 34 / 16.
const PLOT_LEFT = 28;
const PLOT_RIGHT = 692;
const BASELINE = 232;
const PEAK = 44;
const AMP = BASELINE - PEAK;
const MEAN = 360;
const SIGMA = 84;
const CHASM_X = MEAN - SIGMA;

function curveY(x: number) {
  return BASELINE - Math.exp(-((x - MEAN) ** 2) / (2 * SIGMA * SIGMA)) * AMP;
}

function bandPath(start: number, end: number): string {
  let d = `M${start},${BASELINE} L${start},${curveY(start).toFixed(1)}`;
  for (let x = start; x <= end; x += 4) {
    d += ` L${x},${curveY(x).toFixed(1)}`;
  }
  return `${d} L${end},${curveY(end).toFixed(1)} L${end},${BASELINE} Z`;
}

const CURVE_PATH = (() => {
  let d = `M${PLOT_LEFT},${curveY(PLOT_LEFT).toFixed(1)}`;
  for (let x = PLOT_LEFT; x <= PLOT_RIGHT; x += 3) {
    d += ` L${x},${curveY(x).toFixed(1)}`;
  }
  return d;
})();

const COHORTS: Cohort[] = [
  {
    id: "innovators",
    labelKey: "adoptionThesis.cohorts.innovators.label",
    reasonKey: "adoptionThesis.cohorts.innovators.reason",
    x0: PLOT_LEFT,
    x1: 192,
    center: 110,
    color: "#6cb0fb",
    pct: "2.5%",
  },
  {
    id: "earlyAdopters",
    labelKey: "adoptionThesis.cohorts.earlyAdopters.label",
    reasonKey: "adoptionThesis.cohorts.earlyAdopters.reason",
    x0: 192,
    x1: CHASM_X,
    center: 234,
    color: "#3b82f6",
    pct: "13.5%",
  },
  {
    id: "earlyMajority",
    labelKey: "adoptionThesis.cohorts.earlyMajority.label",
    reasonKey: "adoptionThesis.cohorts.earlyMajority.reason",
    x0: CHASM_X,
    x1: MEAN,
    center: 318,
    color: "#2563eb",
    pct: "34%",
  },
  {
    id: "lateMajority",
    labelKey: "adoptionThesis.cohorts.lateMajority.label",
    reasonKey: "adoptionThesis.cohorts.lateMajority.reason",
    x0: MEAN,
    x1: 444,
    center: 402,
    color: "#2f55b8",
    pct: "34%",
  },
  {
    id: "laggards",
    labelKey: "adoptionThesis.cohorts.laggards.label",
    reasonKey: "adoptionThesis.cohorts.laggards.reason",
    x0: 444,
    x1: PLOT_RIGHT,
    center: 568,
    color: "#64748b",
    pct: "16%",
  },
];
const DIVIDERS = [192, CHASM_X, MEAN, 444];

function getSvgLabelLines(label: string) {
  const words = label.split(" ");
  if (words.length <= 1) return [label];

  return [words[0], words.slice(1).join(" ")];
}

function getPillars(t: TFunction): Pillar[] {
  return [
    {
      icon: ShieldCheck,
      label: t("adoptionThesis.pillars.adminless.label"),
      description: t("adoptionThesis.pillars.adminless.description"),
    },
    {
      icon: Server,
      label: t("adoptionThesis.pillars.serverless.label"),
      description: t("adoptionThesis.pillars.serverless.description"),
    },
    {
      icon: DollarSign,
      label: t("adoptionThesis.pillars.economics.label"),
      description: t("adoptionThesis.pillars.economics.description"),
    },
  ];
}

function PillarStrip({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="grid gap-2.5 md:grid-cols-3">
      {pillars.map((pillar) => {
        const Icon = pillar.icon;

        return (
          <div
            key={pillar.label}
            className="rounded-xl border border-[var(--glass-border-subtle)] bg-background/50 px-3 py-2.5 dark:bg-background/20"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-core/35 bg-blue-core/[0.08] text-blue-glow dark:border-blue-core/50 dark:bg-blue-core/[0.16]"
                aria-hidden
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[13px] font-semibold leading-tight text-foreground/88">
                  {pillar.label}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground/78">
                  {pillar.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AdoptionCurve({
  diagramLabel,
  prefersReducedMotion,
  t,
}: {
  diagramLabel: string;
  prefersReducedMotion: boolean;
  t: TFunction;
}) {
  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true },
        transition: { duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="mx-auto mt-5 max-w-3xl">
      <svg
        viewBox="0 0 720 300"
        className="mx-auto w-full select-none"
        role="img"
        aria-label={diagramLabel}
      >
        <defs>
          <linearGradient id="adoption-curve-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1a4fd0" />
            <stop offset="0.55" stopColor="#2563eb" />
            <stop offset="1" stopColor="#7cb2ff" />
          </linearGradient>
        </defs>

        <line
          x1={PLOT_LEFT}
          y1={BASELINE}
          x2={PLOT_RIGHT}
          y2={BASELINE}
          stroke="currentColor"
          className="text-muted-foreground/25"
          strokeWidth={1}
        />

        {COHORTS.map((cohort) => (
          <path
            key={cohort.id}
            d={bandPath(cohort.x0, cohort.x1)}
            fill={cohort.color}
            fillOpacity={0.38}
          />
        ))}

        {DIVIDERS.map((x) => (
          <line
            key={x}
            x1={x}
            y1={curveY(x).toFixed(1)}
            x2={x}
            y2={BASELINE}
            stroke="currentColor"
            className="text-muted-foreground/20"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
        ))}

        <m.path
          d={CURVE_PATH}
          fill="none"
          stroke="url(#adoption-curve-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.4}
          {...motionProps}
        />

        <g className="hidden sm:block">
          <line
            x1={CHASM_X}
            y1={curveY(CHASM_X).toFixed(1)}
            x2={CHASM_X}
            y2={BASELINE}
            stroke="currentColor"
            className="text-blue-glow"
            strokeWidth={1.4}
            strokeDasharray="2 5"
          />
          <rect
            x={CHASM_X - 39}
            y={28}
            width={78}
            height={20}
            rx={10}
            fill="currentColor"
            className="text-blue-core/10"
            stroke="currentColor"
            strokeWidth={0.5}
          />
          <text
            x={CHASM_X}
            y={42}
            textAnchor="middle"
            fontSize={12}
            fill="currentColor"
            className="text-blue-glow"
          >
            {t("adoptionThesis.curve.chasm")}
          </text>
        </g>

        <g className="hidden sm:block">
          {COHORTS.map((cohort) => {
            const labelLines = getSvgLabelLines(t(cohort.labelKey));
            const labelY = labelLines.length > 1 ? 245 : 256;

            return (
              <g key={cohort.id}>
                <text
                  x={cohort.center}
                  y={labelY}
                  textAnchor="middle"
                  fontSize={12}
                  fill="currentColor"
                  className="text-muted-foreground"
                >
                  {labelLines.map((line, index) => (
                    <tspan key={line} x={cohort.center} dy={index === 0 ? 0 : 14}>
                      {line}
                    </tspan>
                  ))}
                </text>
                <text
                  x={cohort.center}
                  y={286}
                  textAnchor="middle"
                  fontSize={12}
                  fill="currentColor"
                  className="text-muted-foreground/55"
                >
                  {cohort.pct}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <ul className="mx-auto mt-3.5 grid max-w-2xl gap-2">
        {COHORTS.map((cohort) => (
          <li
            key={cohort.id}
            className="grid grid-cols-[auto_1fr] items-baseline gap-2 text-xs leading-snug text-muted-foreground/80"
          >
            <span
              className="h-2 w-2 rounded-[3px]"
              style={{ backgroundColor: cohort.color }}
              aria-hidden
            />
            <span className="min-w-0">
              <span className="whitespace-nowrap font-medium text-foreground/80">
                {t(cohort.labelKey)}:
              </span>{" "}
              <span>{t(cohort.reasonKey)}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-4 max-w-lg text-center text-xs italic leading-relaxed text-muted-foreground/55">
        {t("adoptionThesis.curve.caption")}
      </p>
    </div>
  );
}

export default function AdoptionThesis() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const pillars = getPillars(t);
  const reveal = (y: number, delay = 0, duration = 0.6) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { y },
          whileInView: { y: 0 },
          viewport: { once: true },
          transition: { duration, delay },
        };

  return (
    <section className="px-6 py-24" aria-labelledby="adoption-thesis-title">
      <div className="mx-auto max-w-7xl">
        <div
          id="adoption-thesis"
          data-home-section-label
          className="scroll-mt-[99px] md:scroll-mt-[103px]"
        >
          <m.div
            {...reveal(14, 0, 0.5)}
            className="mb-6 block text-center text-xs font-display uppercase tracking-[0.2em] text-muted-foreground/75 dark:text-muted-foreground/70 md:text-sm"
          >
            <a
              href="#adoption-thesis"
              className="rounded-md transition-[color,box-shadow] duration-300 dark:hover:text-muted-foreground/82"
            >
              {t("adoptionThesis.sectionLabel")}
            </a>
          </m.div>
        </div>

        <m.h2
          id="adoption-thesis-title"
          {...reveal(20, 0.1)}
          className="mb-6 text-center text-4xl font-display font-semibold leading-[1.1] text-balance text-muted-foreground md:text-6xl lg:text-7xl"
        >
          {t("adoptionThesis.title")}
        </m.h2>

        <m.p
          {...reveal(20, 0.2)}
          className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed text-balance text-muted-foreground md:text-lg"
        >
          {t("adoptionThesis.supporting")}
        </m.p>

        <m.div {...reveal(20, 0.3)} className="glass-card mx-auto max-w-4xl p-4 md:p-5 lg:p-6">
          <PillarStrip pillars={pillars} />
          <AdoptionCurve
            diagramLabel={t("adoptionThesis.diagramLabel")}
            prefersReducedMotion={prefersReducedMotion}
            t={t}
          />
        </m.div>

        <m.blockquote
          {...reveal(0, 0.6, 0.8)}
          className="mx-auto mt-14 block max-w-lg text-center text-xs italic text-muted-foreground/75 dark:text-muted-foreground/70 md:text-sm"
        >
          &ldquo;{t("adoptionThesis.quote")}&rdquo;
          <span className="mt-1 block not-italic">{t("adoptionThesis.quoteAttribution")}</span>
        </m.blockquote>
      </div>
    </section>
  );
}
