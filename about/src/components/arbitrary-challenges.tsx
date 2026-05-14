import { m, useReducedMotion } from "framer-motion";
import {
  Bot,
  Code2,
  MessageSquare,
  Puzzle,
  Server,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type OptionId = "code" | "service" | "proof" | "next";

const OPTIONS: Array<{ id: OptionId; icon: LucideIcon }> = [
  { id: "code", icon: Code2 },
  { id: "service", icon: Bot },
  { id: "proof", icon: MessageSquare },
  { id: "next", icon: Sparkles },
];

const OPTION_I18N: Record<OptionId, string> = {
  code: "arbitraryChallenges.options.code",
  service: "arbitraryChallenges.options.service",
  proof: "arbitraryChallenges.options.proof",
  next: "arbitraryChallenges.options.next",
};

function PeerNode({
  label,
  hint,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  hint: string;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3 ${
        highlight
          ? "border-blue-core/40 bg-blue-core/[0.04] shadow-[0_0_24px_rgba(37,99,235,0.14)] dark:border-blue-core/55 dark:bg-blue-core/[0.12]"
          : "border-[var(--glass-border-subtle)] bg-background/55 dark:bg-background/25"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
          highlight
            ? "border-blue-core/45 bg-blue-core/[0.12] text-blue-glow dark:bg-blue-core/[0.22]"
            : "border-[var(--glass-border-subtle)] bg-background/60 text-foreground/70 dark:bg-background/30"
        }`}
        aria-hidden
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold leading-tight text-foreground/88">
          {label}
        </p>
        <p className="text-xs leading-tight text-muted-foreground/70">{hint}</p>
      </div>
    </div>
  );
}

function ExchangeConnector({
  t,
  prefersReducedMotion,
}: {
  t: (key: string) => string;
  prefersReducedMotion: boolean;
}) {
  const requestLabel = t("arbitraryChallenges.diagram.request");
  const challengeLabel = t("arbitraryChallenges.diagram.challenge");

  return (
    <div className="relative flex w-full items-center justify-center md:w-auto">
      {/* Mobile vertical */}
      <div className="flex w-full flex-col items-center gap-1.5 md:hidden">
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
          {requestLabel}
        </span>
        <svg
          aria-hidden
          className="text-blue-glow/60 dark:text-blue-glow/75"
          width="40"
          height="64"
          viewBox="0 0 40 64"
          fill="none"
        >
          <m.path
            d="M14 6 L14 58"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="3 4"
            strokeLinecap="round"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { pathLength: 0 },
                  whileInView: { pathLength: 1 },
                  viewport: { once: true },
                  transition: { duration: 0.9, delay: 0.2 },
                })}
          />
          <path d="M8 50 L14 58 L20 50" stroke="currentColor" strokeWidth="1.4" fill="none" />
          <m.path
            d="M26 58 L26 6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="3 4"
            strokeLinecap="round"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { pathLength: 0 },
                  whileInView: { pathLength: 1 },
                  viewport: { once: true },
                  transition: { duration: 0.9, delay: 0.35 },
                })}
          />
          <path d="M20 14 L26 6 L32 14" stroke="currentColor" strokeWidth="1.4" fill="none" />
        </svg>
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
          {challengeLabel}
        </span>
      </div>

      {/* Desktop horizontal */}
      <div className="hidden flex-col items-center md:flex">
        <span className="mb-1 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
          {requestLabel}
        </span>
        <svg
          aria-hidden
          className="text-blue-glow/60 dark:text-blue-glow/75"
          width="180"
          height="44"
          viewBox="0 0 180 44"
          fill="none"
        >
          <m.path
            d="M8 14 L172 14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="3 4"
            strokeLinecap="round"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { pathLength: 0 },
                  whileInView: { pathLength: 1 },
                  viewport: { once: true },
                  transition: { duration: 0.9, delay: 0.2 },
                })}
          />
          <path d="M164 8 L172 14 L164 20" stroke="currentColor" strokeWidth="1.4" fill="none" />
          <m.path
            d="M172 30 L8 30"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="3 4"
            strokeLinecap="round"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { pathLength: 0 },
                  whileInView: { pathLength: 1 },
                  viewport: { once: true },
                  transition: { duration: 0.9, delay: 0.35 },
                })}
          />
          <path d="M16 24 L8 30 L16 36" stroke="currentColor" strokeWidth="1.4" fill="none" />
        </svg>
        <span className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
          {challengeLabel}
        </span>
      </div>
    </div>
  );
}

function NodeModuleConnector({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const dashAnim = prefersReducedMotion
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true },
        transition: { duration: 0.5, delay: 0.45 },
      };

  return (
    <span
      aria-hidden
      className="absolute left-1/2 top-full -translate-x-1/2 text-blue-core/50 dark:text-blue-core/65"
    >
      {/* Mobile bridge: node bottom → challenge module (32px gap) */}
      <svg className="block md:hidden" width="16" height="32" viewBox="0 0 16 32" fill="none">
        <m.path
          d="M8 0 L8 32"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="3 4"
          strokeLinecap="round"
          {...dashAnim}
        />
      </svg>
      {/* Desktop bridge: node sits 8px above the grid baseline, so the run is 40px */}
      <svg className="hidden md:block" width="16" height="40" viewBox="0 0 16 40" fill="none">
        <m.path
          d="M8 0 L8 40"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="3 4"
          strokeLinecap="round"
          {...dashAnim}
        />
      </svg>
    </span>
  );
}

function ProtocolDiagram({
  t,
  prefersReducedMotion,
}: {
  t: (key: string) => string;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-2">
      <div className="flex justify-center md:justify-end">
        <PeerNode
          label={t("arbitraryChallenges.diagram.user")}
          hint={t("arbitraryChallenges.diagram.userHint")}
          icon={User}
        />
      </div>

      <ExchangeConnector t={t} prefersReducedMotion={prefersReducedMotion} />

      <div className="flex justify-center md:justify-start">
        <div className="relative">
          <PeerNode
            label={t("arbitraryChallenges.diagram.node")}
            hint={t("arbitraryChallenges.diagram.nodeHint")}
            icon={Server}
            highlight
          />
          <NodeModuleConnector prefersReducedMotion={prefersReducedMotion} />
        </div>
      </div>
    </div>
  );
}

function ChallengeModule({ t }: { t: (key: string) => string }) {
  return (
    <div className="rounded-2xl border border-blue-core/30 bg-blue-core/[0.05] p-5 dark:border-blue-core/45 dark:bg-blue-core/[0.1] md:p-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-core/45 bg-blue-core/[0.12] text-blue-glow dark:bg-blue-core/[0.24]"
          aria-hidden
        >
          <Puzzle className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold leading-tight text-foreground/88">
            {t("arbitraryChallenges.diagram.module")}
          </p>
          <p className="text-xs leading-tight text-muted-foreground/70">
            {t("arbitraryChallenges.diagram.moduleHint")}
          </p>
        </div>
      </div>

      <p className="mb-2.5 mt-5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
        {t("arbitraryChallenges.optionsLabel")}
      </p>
      <ul className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <li
              key={option.id}
              className="flex items-center gap-1.5 rounded-full border border-[var(--glass-border-subtle)] bg-background/55 px-3 py-1.5 text-xs font-medium text-foreground/82 dark:bg-background/22 md:text-sm"
            >
              <Icon className="h-3 w-3 text-blue-glow md:h-3.5 md:w-3.5" aria-hidden />
              <span className="leading-tight">{t(OPTION_I18N[option.id])}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ArbitraryChallenges() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section className="py-24 px-6" aria-labelledby="arbitrary-challenges-title">
      <div className="max-w-7xl mx-auto">
        <div
          id="arbitrary-challenges"
          data-home-section-label
          className="scroll-mt-[99px] md:scroll-mt-[103px]"
        >
          <m.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="block text-xs md:text-sm font-display tracking-[0.2em] uppercase text-center mb-6 text-muted-foreground/50"
          >
            <a
              href="#arbitrary-challenges"
              className="rounded-md transition-[color,box-shadow] duration-300 hover:text-muted-foreground/70"
            >
              {t("arbitraryChallenges.sectionLabel")}
            </a>
          </m.div>
        </div>

        <m.h2
          id="arbitrary-challenges-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-center mb-6 text-balance leading-[1.1] text-muted-foreground"
        >
          {t("arbitraryChallenges.title")}
        </m.h2>

        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-center text-muted-foreground max-w-xl mx-auto mb-12 text-balance leading-relaxed"
        >
          {t("arbitraryChallenges.supporting")}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card mx-auto max-w-3xl p-6 md:p-8"
        >
          <ProtocolDiagram t={t} prefersReducedMotion={prefersReducedMotion} />

          <div className="mt-8">
            <ChallengeModule t={t} />
          </div>
        </m.div>

        <m.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-14 block max-w-lg text-center text-xs italic text-muted-foreground/40 md:text-sm"
        >
          &ldquo;{t("arbitraryChallenges.quote")}&rdquo;
          <span className="mt-1 block not-italic">{t("arbitraryChallenges.quoteAttribution")}</span>
        </m.blockquote>
      </div>
    </section>
  );
}
