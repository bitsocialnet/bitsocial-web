import { m, useInView } from "framer-motion";
import type { TFunction } from "i18next";
import { type ReactNode, type RefObject, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import CardInlineCta, { prominentCtaClassName } from "@/components/card-inline-cta";
import EasterEggOverlay from "@/components/easter-egg-overlay";
import { DOCS_LINKS } from "@/lib/docs-links";

const EASTER_EGG_GIF = "/spongebob-easter-egg.gif";
const masterPlanLogoSrcSet = "/logo-small.png 64w, /apple-touch-icon.png 180w, /logo.png 640w";
const masterPlanLogoClassName =
  "h-10 w-10 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.8)]";
const phaseCtaButtonClassName = "w-full max-w-full !rounded-3xl !py-2 text-sm sm:w-auto";
const richTextComponents = {
  forgeLink: (
    <a
      href="https://bitsocialforge.com"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium underline decoration-current/35 underline-offset-4 transition-colors hover:text-blue-glow hover:decoration-blue-glow"
    />
  ),
  rpcLink: (
    <a
      href={DOCS_LINKS.permissionlessPublicRpc}
      className="font-medium underline decoration-current/35 underline-offset-4 transition-colors hover:text-blue-glow hover:decoration-blue-glow"
    />
  ),
  strong: <strong className="font-semibold" />,
};

type PhaseCta = {
  href: string;
  label: string;
  context?: string;
};

type PhaseDescription = {
  id: string;
  content: ReactNode;
};

type PhaseItem = {
  ctas: PhaseCta[];
  id: string;
  phase: string;
  status?: string;
  title: string;
  description: PhaseDescription;
  extraDescriptions?: PhaseDescription[];
};

function MasterPlanLogoImage({ alt }: { alt: string }) {
  return (
    <img
      src="/logo.png"
      srcSet={masterPlanLogoSrcSet}
      sizes="40px"
      width={40}
      height={40}
      alt={alt}
      className={masterPlanLogoClassName}
    />
  );
}

function PhaseCtas({ ctas }: { ctas: PhaseCta[] }) {
  return (
    <div className="mt-auto flex flex-col items-stretch justify-end gap-2 pt-5 -mb-3 -mr-3 rtl:-ml-3 rtl:mr-0 sm:flex-row sm:flex-wrap sm:items-center md:-mb-4 md:-mr-4 md:rtl:-ml-4">
      {ctas.map((cta) => (
        <CardInlineCta
          key={`${cta.href}-${cta.label}`}
          href={cta.href}
          className={`${prominentCtaClassName} ${phaseCtaButtonClassName}`}
        >
          {cta.label}
          {cta.context ? <span className="sr-only">: {cta.context}</span> : null}
        </CardInlineCta>
      ))}
    </div>
  );
}

function getPhases(t: TFunction): PhaseItem[] {
  return [
    {
      ctas: [
        {
          href: "https://5chan.app",
          label: t("masterPlan.cta.try5chan"),
        },
        {
          href: "https://seedit.app",
          label: t("masterPlan.cta.trySeedit"),
        },
        {
          href: DOCS_LINKS.buildYourOwnClient,
          label: t("masterPlan.cta.buildYourOwn"),
        },
      ],
      id: "master-plan-phase-1",
      phase: t("masterPlan.phases.phase1.phase"),
      status: t("masterPlan.phases.phase1.status"),
      title: t("masterPlan.phases.phase1.title"),
      description: {
        id: "phase1-description",
        content: (
          <Trans i18nKey="masterPlan.phases.phase1.description" components={richTextComponents} />
        ),
      },
      extraDescriptions: [
        {
          id: "phase1-rpc-description",
          content: (
            <Trans
              i18nKey="masterPlan.phases.phase1.rpcDescription"
              components={richTextComponents}
            />
          ),
        },
        {
          id: "phase1-forums-description",
          content: (
            <Trans
              i18nKey="masterPlan.phases.phase1.forumsDescription"
              components={richTextComponents}
            />
          ),
        },
      ],
    },
    {
      ctas: [
        {
          href: DOCS_LINKS.bitsocialNetwork,
          label: t("masterPlan.cta.learnMore"),
          context: t("masterPlan.phases.phase2.title"),
        },
      ],
      id: "master-plan-phase-2",
      phase: t("masterPlan.phases.phase2.phase"),
      title: t("masterPlan.phases.phase2.title"),
      description: {
        id: "phase2-description",
        content: (
          <Trans i18nKey="masterPlan.phases.phase2.description" components={richTextComponents} />
        ),
      },
    },
    {
      ctas: [
        {
          href: DOCS_LINKS.flagshipBitsocialApp,
          label: t("masterPlan.cta.learnMore"),
          context: t("masterPlan.phases.phase3.title"),
        },
      ],
      id: "master-plan-phase-3",
      phase: t("masterPlan.phases.phase3.phase"),
      title: t("masterPlan.phases.phase3.title"),
      description: {
        id: "phase3-description",
        content: (
          <Trans i18nKey="masterPlan.phases.phase3.description" components={richTextComponents} />
        ),
      },
      extraDescriptions: [
        {
          id: "phase3-rpc-nodes",
          content: (
            <Trans i18nKey="masterPlan.phases.phase3.rpcNodes" components={richTextComponents} />
          ),
        },
        {
          id: "phase3-everything-app",
          content: (
            <Trans
              i18nKey="masterPlan.phases.phase3.everythingApp"
              components={richTextComponents}
            />
          ),
        },
      ],
    },
    {
      ctas: [
        {
          href: DOCS_LINKS.scaleBitsocialEconomies,
          label: t("masterPlan.cta.learnMore"),
          context: t("masterPlan.phases.phase4.title"),
        },
      ],
      id: "master-plan-phase-4",
      phase: t("masterPlan.phases.phase4.phase"),
      title: t("masterPlan.phases.phase4.title"),
      description: {
        id: "phase4-description",
        content: (
          <Trans i18nKey="masterPlan.phases.phase4.description" components={richTextComponents} />
        ),
      },
    },
    {
      ctas: [
        {
          href: DOCS_LINKS.decentralizeAllSocialMedia,
          label: t("masterPlan.cta.learnMore"),
          context: t("masterPlan.phases.phase5.title"),
        },
      ],
      id: "master-plan-phase-5",
      phase: t("masterPlan.phases.phase5.phase"),
      title: t("masterPlan.phases.phase5.title"),
      description: {
        id: "phase5-description",
        content: (
          <Trans i18nKey="masterPlan.phases.phase5.description" components={richTextComponents} />
        ),
      },
    },
  ];
}

function MasterPlanIntro({ subtitle, t }: { subtitle: string; t: TFunction }) {
  return (
    <>
      <div
        id="master-plan"
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
            href="#master-plan"
            className="rounded-md transition-[color,box-shadow] duration-300 hover:text-muted-foreground/70"
          >
            {t("masterPlan.sectionLabel")}
          </a>
        </m.div>
      </div>
      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-center mb-6 text-balance leading-[1.1] text-muted-foreground"
      >
        {t("masterPlan.title")}
      </m.h2>
      <m.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base md:text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-16 text-balance leading-relaxed"
      >
        {subtitle}
      </m.p>
    </>
  );
}

function TimelineLine({ showTimeline }: { showTimeline: boolean }) {
  return (
    <m.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={showTimeline ? { scaleY: 1, opacity: 1 } : undefined}
      transition={{ delay: 0.5, duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ transformOrigin: "top" }}
      className="pointer-events-none absolute left-1/2 top-0 z-0 flex h-full w-0.5 -translate-x-1/2 flex-col"
      aria-hidden
    >
      <div className="min-h-0 flex-1 bg-gradient-to-b from-blue-core via-blue-glow to-blue-core" />
      <div className="h-16 shrink-0 bg-blue-glow" />
      <svg width="2" height="64" className="block shrink-0 text-blue-glow">
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="64"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      </svg>
      <svg width="2" height="56" className="block shrink-0 text-blue-glow">
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="56"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 4"
        />
      </svg>
    </m.div>
  );
}

function PhaseLabel({ item }: { item: PhaseItem }) {
  return (
    <div className="text-xs text-blue-glow/80 font-display font-medium uppercase tracking-widest mb-3">
      <a
        id={item.id}
        href={`#${item.id}`}
        className="scroll-mt-[99px] rounded-md transition-[color,box-shadow] duration-300 hover:text-blue-glow md:scroll-mt-[103px]"
      >
        {item.phase}
      </a>
      {item.status ? (
        <span className="ml-2 text-blue-glow [text-shadow:0_0_12px_rgba(37,99,235,0.8),0_0_24px_rgba(37,99,235,0.4)]">
          {" — "}
          {item.status}
        </span>
      ) : null}
    </div>
  );
}

function PhaseCardBody({ item }: { item: PhaseItem }) {
  const descriptions = [item.description, ...(item.extraDescriptions ?? [])];

  return (
    <div className="flex h-full flex-col">
      <PhaseLabel item={item} />
      <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 text-foreground/85">
        {item.title}
      </h3>
      {descriptions.map((description, index) => (
        <p
          key={`${item.id}-${description.id}`}
          className={`text-muted-foreground text-sm leading-relaxed ${index > 0 ? "mt-4" : ""}`}
        >
          {description.content}
        </p>
      ))}
      <PhaseCtas ctas={item.ctas} />
    </div>
  );
}

function PhaseStep({
  epilogue,
  epilogueFinal,
  index,
  isLast,
  item,
}: {
  epilogue: string;
  epilogueFinal: string;
  index: number;
  isLast: boolean;
  item: PhaseItem;
}) {
  const phaseCardBody = <PhaseCardBody item={item} />;

  return (
    <m.div
      initial={{ x: index % 2 === 0 ? -40 : 40 }}
      whileInView={{ x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`flex flex-col md:flex-row items-center gap-8 ${
        index % 2 === 0 ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="relative z-10 flex-shrink-0">
        <div className="size-10 rounded-full bg-background border border-border flex items-center justify-center">
          <span className="text-sm font-display font-semibold text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div
        className={isLast ? "flex flex-1 min-w-0 max-w-lg flex-col gap-[10px]" : "flex-1 max-w-lg"}
      >
        {isLast ? (
          <>
            <div className="glass-card p-7 md:p-8">{phaseCardBody}</div>
            <div className="glass-card p-7 md:p-8">
              <p className="text-muted-foreground text-sm leading-relaxed">{epilogue}</p>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                <strong className="font-semibold text-foreground/90">{epilogueFinal}</strong>
              </p>
            </div>
          </>
        ) : (
          <div className="glass-card p-7 md:p-8">{phaseCardBody}</div>
        )}
      </div>

      <div className="hidden md:block flex-1" />
    </m.div>
  );
}

function EndLogo({
  logoAlt,
  onClick,
  showTimeline,
}: {
  logoAlt: string;
  onClick: () => void;
  showTimeline: boolean;
}) {
  return (
    <div className="flex justify-center mt-2">
      <m.button
        initial={{ opacity: 0, scale: 0.85 }}
        animate={showTimeline ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{
          delay: showTimeline ? 0.5 + 1.5 : 0,
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        onClick={onClick}
        className="js-only relative z-10 flex-shrink-0 cursor-pointer transition-all duration-300"
        whileHover={{ scale: 1.1 }}
      >
        <MasterPlanLogoImage alt={logoAlt} />
      </m.button>
      <noscript>
        <a
          href={EASTER_EGG_GIF}
          target="_blank"
          rel="noopener noreferrer"
          className="nojs-inline-flex relative z-10 flex-shrink-0 cursor-pointer transition-all duration-300"
        >
          <MasterPlanLogoImage alt={logoAlt} />
        </a>
      </noscript>
    </div>
  );
}

function PhaseTimeline({
  epilogue,
  epilogueFinal,
  logoAlt,
  onEndLogoClick,
  phases,
  showTimeline,
  timelineRef,
}: {
  epilogue: string;
  epilogueFinal: string;
  logoAlt: string;
  onEndLogoClick: () => void;
  phases: PhaseItem[];
  showTimeline: boolean;
  timelineRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={timelineRef} className="relative w-full">
      <div className="relative w-full">
        <TimelineLine showTimeline={showTimeline} />

        <div className="space-y-16 md:space-y-20">
          {phases.map((item, index) => (
            <PhaseStep
              key={item.phase}
              epilogue={epilogue}
              epilogueFinal={epilogueFinal}
              index={index}
              isLast={index === phases.length - 1}
              item={item}
            />
          ))}
        </div>

        <div aria-hidden className="h-[184px]" />
      </div>

      <EndLogo logoAlt={logoAlt} onClick={onEndLogoClick} showTimeline={showTimeline} />
    </div>
  );
}

export default function MasterPlan() {
  const { t } = useTranslation();
  const [showGif, setShowGif] = useState(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const showTimeline = useInView(timelineRef, {
    once: true,
    amount: 0.1,
  });

  const phases = getPhases(t);
  const masterPlanSubtitle = t("masterPlan.subtitle");
  const masterPlanEpilogue = t("masterPlan.epilogue");
  const masterPlanEpilogueFinal = t("masterPlan.epilogueFinal");
  const easterEggAlt = t("masterPlan.easterEggAlt");
  const logoAlt = t("masterPlan.logoAlt");

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <MasterPlanIntro subtitle={masterPlanSubtitle} t={t} />
        <PhaseTimeline
          epilogue={masterPlanEpilogue}
          epilogueFinal={masterPlanEpilogueFinal}
          logoAlt={logoAlt}
          onEndLogoClick={() => setShowGif(true)}
          phases={phases}
          showTimeline={showTimeline}
          timelineRef={timelineRef}
        />
      </div>

      <EasterEggOverlay
        imageSrc={EASTER_EGG_GIF}
        alt={easterEggAlt}
        open={showGif}
        onOpenChange={setShowGif}
      />
    </section>
  );
}
