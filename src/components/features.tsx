import { m, useReducedMotion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getScrollBehavior, triggerFeatureGlow, triggerTaglineGlow } from "@/lib/utils";

type FeatureId =
  | "open-source"
  | "peer-to-peer"
  | "social-apps"
  | "no-servers"
  | "no-global-bans"
  | "cryptographic-property";

interface Feature {
  id: FeatureId;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  external?: boolean;
}

/** Circle quarter fillet via cubic Bézier (avoids elliptical-arc sweep ambiguity in SVG). */
const CONNECTOR_R = 10;

const FEATURE_ORDER: FeatureId[] = [
  "open-source",
  "peer-to-peer",
  "social-apps",
  "no-servers",
  "no-global-bans",
  "cryptographic-property",
];

/** Static i18n keys (avoid dynamic `t(\`...\${id}\`)` for tooling). */
const FEATURE_I18N: Record<FeatureId, { description: string; cta: string }> = {
  "open-source": {
    description: "features.items.open-source.description",
    cta: "features.items.open-source.cta",
  },
  "peer-to-peer": {
    description: "features.items.peer-to-peer.description",
    cta: "features.items.peer-to-peer.cta",
  },
  "social-apps": {
    description: "features.items.social-apps.description",
    cta: "features.items.social-apps.cta",
  },
  "no-servers": {
    description: "features.items.no-servers.description",
    cta: "features.items.no-servers.cta",
  },
  "no-global-bans": {
    description: "features.items.no-global-bans.description",
    cta: "features.items.no-global-bans.cta",
  },
  "cryptographic-property": {
    description: "features.items.cryptographic-property.description",
    cta: "features.items.cryptographic-property.cta",
  },
};

function buildFeatures(t: (key: string) => string): Feature[] {
  const hrefs: Record<FeatureId, { ctaHref: string; external?: boolean }> = {
    "open-source": { ctaHref: "https://github.com/bitsocialnet", external: true },
    "peer-to-peer": { ctaHref: "#sanctuary-communication" },
    "social-apps": { ctaHref: "/apps" },
    "no-servers": { ctaHref: "/status" },
    "no-global-bans": { ctaHref: "/docs#local-moderation" },
    "cryptographic-property": { ctaHref: "/docs#identity-and-ownership" },
  };

  return FEATURE_ORDER.map((id) => ({
    id,
    description: t(FEATURE_I18N[id].description),
    ctaLabel: t(FEATURE_I18N[id].cta),
    ctaHref: hrefs[id].ctaHref,
    external: hrefs[id].external,
  }));
}

const featureCtaClassName =
  "px-8 py-3 rounded-full glass-card text-muted-foreground hover:text-foreground font-display font-semibold hover:border-blue-glow ring-glow transition-all duration-300 w-full md:w-auto text-center";
const mobileFeatureCtaClassName =
  "inline-flex items-center justify-center glass-card !rounded-3xl px-5 py-2 text-sm text-center text-muted-foreground transition-all duration-300 hover:border-blue-glow hover:text-foreground ring-glow font-display font-semibold";

interface FeatureCtaProps {
  className: string;
  feature: Feature;
  onSanctuaryClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/** Matches original feature-card framing: excerpt from the hero line with ellipses and commas. */
function featureTitleFromTaglineSegments(t: (key: string) => string, id: FeatureId): string {
  const e = "\u2026";
  let segment: string;
  switch (id) {
    case "open-source":
      segment = t("hero.taglineSegments.openSource");
      return `${segment}${e}`;
    case "peer-to-peer":
      segment = t("hero.taglineSegments.p2p");
      return `${e}${segment}${e}`;
    case "social-apps":
      segment = t("hero.taglineSegments.socialApps");
      return `${e}${segment},${e}`;
    case "no-servers":
      segment = t("hero.taglineSegments.noServers");
      return `${e}${segment},${e}`;
    case "no-global-bans":
      segment = t("hero.taglineSegments.noBans");
      return `${e}${segment},${e}`;
    case "cryptographic-property":
      segment = t("hero.taglineSegments.crypto");
      return `${e}${segment}`;
  }
}

function featureConnectorPathD(isEven: boolean): string {
  const r = CONNECTOR_R;
  const k = 0.5522847498 * r;
  const yMid = 32;
  const yTop = yMid - r;
  const yBot = yMid + r;
  const xL = 250;
  const xR = 750;

  if (isEven) {
    return `M ${xL},0 L ${xL},${yTop} C ${xL},${yTop + k} ${xL + r - k},${yMid} ${xL + r},${yMid} L ${xR - r},${yMid} C ${xR - r + k},${yMid} ${xR},${yBot - k} ${xR},${yBot} L ${xR},64`;
  }
  return `M ${xR},0 L ${xR},${yTop} C ${xR},${yTop + k} ${xR - r + k},${yMid} ${xR - r},${yMid} L ${xL + r},${yMid} C ${xL + r - k},${yMid} ${xL},${yBot - k} ${xL},${yBot} L ${xL},64`;
}

function FeatureCta({ className, feature, onSanctuaryClick }: FeatureCtaProps) {
  if (feature.external) {
    return (
      <a href={feature.ctaHref} target="_blank" rel="noreferrer" className={className}>
        {feature.ctaLabel}
      </a>
    );
  }

  if (feature.ctaHref.startsWith("#")) {
    return (
      <a href={feature.ctaHref} onClick={onSanctuaryClick} className={className}>
        {feature.ctaLabel}
      </a>
    );
  }

  return (
    <Link to={feature.ctaHref} className={className}>
      {feature.ctaLabel}
    </Link>
  );
}

export default function Features() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const features = useMemo(() => buildFeatures(t), [t]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && features.some((f) => f.id === hash)) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Small delay to ensure DOM is ready
        timeoutId = setTimeout(() => {
          triggerFeatureGlow(hash);
        }, 100);
      }
    };

    // Handle initial hash on mount
    handleHashChange();

    // Listen for hash changes (navigation, back/forward buttons, etc.)
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [features]);

  const handleTitleClick = (id: string) => {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    triggerTaglineGlow(id);
  };

  const handleSanctuaryClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const sanctuarySection = document.getElementById("sanctuary-communication");
    if (!sanctuarySection) return;
    const sanctuaryLabel =
      sanctuarySection.querySelector<HTMLElement>("[data-sanctuary-label]") ?? sanctuarySection;
    const topbar = document.querySelector<HTMLElement>("nav");
    const topbarBottom = topbar?.getBoundingClientRect().bottom ?? 0;
    const targetOffset = topbarBottom + 30;
    const scrollTarget = sanctuaryLabel;
    const rect = scrollTarget.getBoundingClientRect();
    const targetTop = rect.top + window.scrollY - targetOffset;
    const scrollBehavior = getScrollBehavior();
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#sanctuary-communication`,
    );
    window.scrollTo({ top: Math.max(0, targetTop), behavior: scrollBehavior });
  };

  return (
    <section className="px-6 py-24 -mt-[clamp(2.5rem,5vh,4rem)] pt-[clamp(2.5rem,5vh,4rem)] md:-mt-[clamp(8rem,calc(3rem+7vw),11rem)] md:pt-[clamp(8rem,calc(3rem+7vw),11rem)]">
      <div className="max-w-7xl mx-auto">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-normal text-center mb-16 text-muted-foreground text-balance"
        >
          {t("features.title")}
        </m.h2>

        <div>
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={feature.id}
                id={feature.id}
                className={`scroll-mt-24 ${index < features.length - 1 ? "mb-0" : ""}`}
              >
                <m.div
                  initial={{ y: 30 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-2 md:gap-8 items-center`}
                >
                  {/* Card Content */}
                  <div className="flex-1 w-full md:w-1/2">
                    <div className="glass-card flex h-full flex-col p-6 md:p-8">
                      <h3 className="mb-4">
                        <button
                          type="button"
                          onClick={() => handleTitleClick(feature.id)}
                          className="interactive-feature-link w-full text-start text-xl md:text-2xl font-display font-normal italic text-muted-foreground focus-visible:outline-none"
                        >
                          {featureTitleFromTaglineSegments(t, feature.id)}
                        </button>
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex justify-end rtl:justify-start md:hidden -mb-2 -mr-2 rtl:-ml-2 rtl:mr-0">
                        <FeatureCta
                          feature={feature}
                          className={mobileFeatureCtaClassName}
                          onSanctuaryClick={handleSanctuaryClick}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature CTA */}
                  <div className="hidden md:flex flex-1 w-full md:w-1/2 items-center justify-center">
                    <FeatureCta
                      feature={feature}
                      className={featureCtaClassName}
                      onSanctuaryClick={handleSanctuaryClick}
                    />
                  </div>
                </m.div>

                {index < features.length - 1 && (
                  <>
                    <div
                      className="hidden md:block pointer-events-none select-none h-16 w-full shrink-0"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 1000 64"
                        className="h-full w-full rtl:-scale-x-100"
                        fill="none"
                      >
                        <m.path
                          className="feature-connector-path"
                          d={featureConnectorPathD(isEven)}
                          strokeWidth={2}
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                          {...(prefersReducedMotion
                            ? {}
                            : {
                                initial: { pathLength: 0 },
                                whileInView: { pathLength: 1 },
                                viewport: { once: true },
                                transition: {
                                  duration: 1,
                                  ease: "easeInOut",
                                },
                              })}
                        />
                      </svg>
                    </div>
                    <svg
                      viewBox="0 0 1000 64"
                      className="pointer-events-none -mt-px block h-12 w-full shrink-0 select-none md:hidden rtl:-scale-x-100"
                      fill="none"
                      aria-hidden="true"
                    >
                      <m.path
                        className="feature-connector-path"
                        d={featureConnectorPathD(isEven)}
                        strokeWidth={2}
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        {...(prefersReducedMotion
                          ? {}
                          : {
                              initial: { pathLength: 0 },
                              whileInView: { pathLength: 1 },
                              viewport: { once: true },
                              transition: {
                                duration: 1,
                                ease: "easeInOut",
                              },
                            })}
                      />
                    </svg>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
