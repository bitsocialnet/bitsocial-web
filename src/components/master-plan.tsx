import { m, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CardInlineCta, { prominentCtaClassName } from "@/components/card-inline-cta";
import EasterEggOverlay from "@/components/easter-egg-overlay";
import { DOCS_LINKS } from "@/lib/docs-links";

const EASTER_EGG_GIF = "/spongebob-easter-egg.gif";

type PhaseItem = {
  ctaHref: string;
  ctaLabel: string;
  phase: string;
  status?: string;
  title: string;
  description: string;
};

export default function MasterPlan() {
  const { t } = useTranslation();
  const [showGif, setShowGif] = useState(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const showTimeline = useInView(timelineRef, {
    once: true,
    amount: 0.1,
  });

  const phases: PhaseItem[] = useMemo(
    () => [
      {
        ctaHref: "https://5chan.app",
        ctaLabel: t("masterPlan.cta.try5chan"),
        phase: t("masterPlan.phases.phase1.phase"),
        status: t("masterPlan.phases.phase1.status"),
        title: t("masterPlan.phases.phase1.title"),
        description: t("masterPlan.phases.phase1.description"),
      },
      {
        ctaHref: DOCS_LINKS.permissionlessPublicRpc,
        ctaLabel: t("masterPlan.cta.readTechnicalSpec"),
        phase: t("masterPlan.phases.phase2.phase"),
        title: t("masterPlan.phases.phase2.title"),
        description: t("masterPlan.phases.phase2.description"),
      },
      {
        ctaHref: "https://seedit.app",
        ctaLabel: t("masterPlan.cta.trySeedit"),
        phase: t("masterPlan.phases.phase3.phase"),
        title: t("masterPlan.phases.phase3.title"),
        description: t("masterPlan.phases.phase3.description"),
      },
      {
        ctaHref: DOCS_LINKS.bitsocialNetwork,
        ctaLabel: t("masterPlan.cta.learnMore"),
        phase: t("masterPlan.phases.phase4.phase"),
        title: t("masterPlan.phases.phase4.title"),
        description: t("masterPlan.phases.phase4.description"),
      },
      {
        ctaHref: DOCS_LINKS.decentralizeAllSocialMedia,
        ctaLabel: t("masterPlan.cta.learnMore"),
        phase: t("masterPlan.phases.phase5.phase"),
        title: t("masterPlan.phases.phase5.title"),
        description: t("masterPlan.phases.phase5.description"),
      },
    ],
    [t],
  );

  const masterPlanEpilogue = t("masterPlan.epilogue");
  const easterEggAlt = t("masterPlan.easterEggAlt");
  const logoAlt = t("masterPlan.logoAlt");

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-normal text-center mb-20 text-muted-foreground text-balance"
        >
          {t("masterPlan.title")}
        </m.h2>

        <div ref={timelineRef} className="relative w-full">
          <div className="relative w-full">
            {/* One centered timeline element so the solid and dashed tail stay perfectly aligned and animate together. */}
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

            <div className="space-y-16 md:space-y-20">
              {phases.map((item, index) => {
                const isPhase5 = index === phases.length - 1;
                const phaseCardBody = (
                  <>
                    <div className="text-xs text-blue-glow/80 font-display font-medium uppercase tracking-widest mb-3">
                      {item.phase}
                      {item.status ? (
                        <span className="ml-2 text-amber-400/90">— {item.status}</span>
                      ) : null}
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 text-foreground/85">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-5 flex justify-end -mb-3 -mr-3 rtl:-ml-3 rtl:mr-0 md:-mb-4 md:-mr-4 md:rtl:-ml-4">
                      <CardInlineCta
                        href={item.ctaHref}
                        className={`${prominentCtaClassName} w-auto max-w-full !rounded-3xl !py-2 text-sm`}
                      >
                        {item.ctaLabel}
                      </CardInlineCta>
                    </div>
                  </>
                );
                return (
                  <m.div
                    key={item.phase}
                    initial={{ x: index % 2 === 0 ? -40 : 40 }}
                    whileInView={{ x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className={`flex flex-col md:flex-row items-center gap-8 ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Phase indicator */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                        <span className="text-sm font-display font-semibold text-muted-foreground tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Content card(s) — Phase 5 stacks a second frosted card below with 10px gap */}
                    <div
                      className={
                        isPhase5
                          ? "flex flex-1 flex-col gap-[10px] max-w-lg min-w-0"
                          : "flex-1 glass-card p-7 md:p-8 max-w-lg"
                      }
                    >
                      {isPhase5 ? (
                        <>
                          <div className="glass-card p-7 md:p-8">{phaseCardBody}</div>
                          <m.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.06, duration: 0.45 }}
                            className="glass-card p-7 md:p-8"
                          >
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              <strong className="font-semibold text-foreground/90">
                                {masterPlanEpilogue}
                              </strong>
                            </p>
                          </m.div>
                        </>
                      ) : (
                        phaseCardBody
                      )}
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </m.div>
                );
              })}
            </div>

            {/* Reserve space for the solid and dashed tail that the absolute timeline renders. */}
            <div aria-hidden className="h-[184px]" />
          </div>

          {/* End logo — fades in when the vertical line finishes drawing (matches timeline delay + duration). */}
          <div className="flex justify-center mt-2">
            <m.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={showTimeline ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{
                delay: showTimeline ? 0.5 + 1.5 : 0,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              onClick={() => setShowGif(true)}
              className="relative z-10 flex-shrink-0 cursor-pointer transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <img
                src="/logo.png"
                width={40}
                height={40}
                alt={logoAlt}
                className="h-10 w-10 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.8)]"
              />
            </m.button>
          </div>
        </div>
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
