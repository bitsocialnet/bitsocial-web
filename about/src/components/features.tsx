import { m, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CardInlineCta, { prominentCtaClassName } from "@/components/card-inline-cta";
import { DOCS_LINKS, STATS_LINKS, isDocsPath, isStatsPath } from "@/lib/docs-links";
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
const CONNECTOR_CARD_GAP = 1;
const CONNECTOR_MATCH_EPSILON = 1;
const MOBILE_CONNECTOR_START_FRACTION = 0.25;
const MOBILE_CONNECTOR_END_FRACTION = 0.75;

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
    "peer-to-peer": { ctaHref: DOCS_LINKS.peerToPeerProtocol },
    "social-apps": { ctaHref: "/apps" },
    "no-servers": { ctaHref: STATS_LINKS.home },
    "no-global-bans": { ctaHref: DOCS_LINKS.localModeration },
    "cryptographic-property": { ctaHref: DOCS_LINKS.identityAndOwnership },
  };

  return FEATURE_ORDER.map((id) => ({
    id,
    description: t(FEATURE_I18N[id].description),
    ctaLabel: t(FEATURE_I18N[id].cta),
    ctaHref: hrefs[id].ctaHref,
    external: hrefs[id].external,
  }));
}

const featureCtaClassName = `${prominentCtaClassName} w-full md:w-auto`;

interface FeatureCtaProps {
  className: string;
  feature: Feature;
  onSanctuaryClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface MobileFeatureCtaProps {
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

interface FeatureConnectorLayout {
  d: string;
  hasEnteredView: boolean;
  height: number;
  id: string;
  top: number;
  width: number;
}

function approximatelyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= CONNECTOR_MATCH_EPSILON;
}

function getMobileConnectorFraction(index: number, isRtl: boolean): { end: number; start: number } {
  const start = index % 2 === 0 ? MOBILE_CONNECTOR_START_FRACTION : MOBILE_CONNECTOR_END_FRACTION;
  const end = index % 2 === 0 ? MOBILE_CONNECTOR_END_FRACTION : MOBILE_CONNECTOR_START_FRACTION;

  if (!isRtl) {
    return { start, end };
  }

  return {
    start: 1 - start,
    end: 1 - end,
  };
}

function featureConnectorPathD(startX: number, endX: number, height: number): string {
  const r = Math.min(CONNECTOR_R, Math.abs(endX - startX) / 2, height / 2);
  const k = 0.5522847498 * r;
  const yMid = height / 2;
  const yTop = yMid - r;
  const yBot = yMid + r;

  if (startX <= endX) {
    return `M ${startX},0 L ${startX},${yTop} C ${startX},${yTop + k} ${startX + r - k},${yMid} ${startX + r},${yMid} L ${endX - r},${yMid} C ${endX - r + k},${yMid} ${endX},${yBot - k} ${endX},${yBot} L ${endX},${height}`;
  }

  return `M ${startX},0 L ${startX},${yTop} C ${startX},${yTop + k} ${startX - r + k},${yMid} ${startX - r},${yMid} L ${endX + r},${yMid} C ${endX + r - k},${yMid} ${endX},${yBot - k} ${endX},${yBot} L ${endX},${height}`;
}

function areConnectorLayoutsEqual(
  current: FeatureConnectorLayout[],
  next: FeatureConnectorLayout[],
): boolean {
  if (current.length !== next.length) {
    return false;
  }

  return current.every((connector, index) => {
    const nextConnector = next[index];
    return (
      connector.id === nextConnector.id &&
      connector.top === nextConnector.top &&
      connector.hasEnteredView === nextConnector.hasEnteredView &&
      connector.height === nextConnector.height &&
      connector.width === nextConnector.width &&
      connector.d === nextConnector.d
    );
  });
}

function FeatureCta({ className, feature, onSanctuaryClick }: FeatureCtaProps) {
  if (feature.external) {
    return (
      <a href={feature.ctaHref} target="_blank" rel="noreferrer" className={className}>
        {feature.ctaLabel}
      </a>
    );
  }

  if (isDocsPath(feature.ctaHref) || isStatsPath(feature.ctaHref)) {
    return (
      <a href={feature.ctaHref} className={className}>
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

function MobileFeatureCta({ feature, onSanctuaryClick }: MobileFeatureCtaProps) {
  return (
    <CardInlineCta href={feature.ctaHref} onClick={onSanctuaryClick}>
      {feature.ctaLabel}
    </CardInlineCta>
  );
}

export default function Features() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const features = useMemo(() => buildFeatures(t), [t]);
  const [drawnConnectorIds, setDrawnConnectorIds] = useState<Record<string, true>>({});
  const featureListRef = useRef<HTMLDivElement | null>(null);
  const featureCardRefs = useRef<Partial<Record<FeatureId, HTMLDivElement | null>>>({});
  const scheduleConnectorMeasurementRef = useRef<() => void>(() => {});
  const [connectors, setConnectors] = useState<FeatureConnectorLayout[]>([]);

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

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let frameId: number | null = null;

    frameId = window.requestAnimationFrame(() => {
      setDrawnConnectorIds((current) => {
        const next = { ...current };
        let changed = false;

        for (const connector of connectors) {
          if (connector.hasEnteredView && !next[connector.id]) {
            next[connector.id] = true;
            changed = true;
          }
        }

        return changed ? next : current;
      });
    });

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [connectors, prefersReducedMotion]);

  useLayoutEffect(() => {
    const featureList = featureListRef.current;
    if (!featureList) {
      return;
    }

    let frameId: number | null = null;

    const measureConnectors = () => {
      frameId = null;

      const featureListRect = featureList.getBoundingClientRect();
      const isRtl = getComputedStyle(featureList).direction === "rtl";
      const nextConnectors: FeatureConnectorLayout[] = [];
      const existingConnectorsById = new Map(
        connectors.map((connector) => [connector.id, connector]),
      );

      for (let index = 0; index < FEATURE_ORDER.length - 1; index += 1) {
        const currentCard = featureCardRefs.current[FEATURE_ORDER[index]];
        const nextCard = featureCardRefs.current[FEATURE_ORDER[index + 1]];

        if (!currentCard || !nextCard) {
          continue;
        }

        const currentRect = currentCard.getBoundingClientRect();
        const nextRect = nextCard.getBoundingClientRect();
        const isStacked =
          approximatelyEqual(currentRect.left, nextRect.left) &&
          approximatelyEqual(currentRect.right, nextRect.right);
        const mobileFractions = getMobileConnectorFraction(index, isRtl);
        const startFraction = isStacked ? mobileFractions.start : 0.5;
        const endFraction = isStacked ? mobileFractions.end : 0.5;
        const startX = currentRect.left - featureListRect.left + currentRect.width * startFraction;
        const endX = nextRect.left - featureListRect.left + nextRect.width * endFraction;
        const top = currentRect.bottom - featureListRect.top + CONNECTOR_CARD_GAP;
        const height = Math.max(nextRect.top - currentRect.bottom - CONNECTOR_CARD_GAP * 2, 1);
        const viewportTop = currentRect.bottom + CONNECTOR_CARD_GAP;
        const viewportBottom = nextRect.top - CONNECTOR_CARD_GAP;
        const connectorId = `${FEATURE_ORDER[index]}-${FEATURE_ORDER[index + 1]}`;
        const hasEnteredView =
          existingConnectorsById.get(connectorId)?.hasEnteredView ||
          (viewportBottom > 0 && viewportTop < window.innerHeight);

        nextConnectors.push({
          id: connectorId,
          hasEnteredView,
          top,
          height,
          width: featureListRect.width,
          d: featureConnectorPathD(startX, endX, height),
        });
      }

      setConnectors((current) =>
        areConnectorLayoutsEqual(current, nextConnectors) ? current : nextConnectors,
      );
    };

    const scheduleMeasure = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(measureConnectors);
    };

    scheduleConnectorMeasurementRef.current = scheduleMeasure;
    scheduleMeasure();
    const settleMeasurementId = window.setTimeout(scheduleMeasure, 120);

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(featureList);

    for (const featureId of FEATURE_ORDER) {
      const featureCard = featureCardRefs.current[featureId];
      if (featureCard) {
        resizeObserver.observe(featureCard);
      }
    }

    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("load", scheduleMeasure);
    window.addEventListener("pageshow", scheduleMeasure);

    return () => {
      scheduleConnectorMeasurementRef.current = () => {};
      window.clearTimeout(settleMeasurementId);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("load", scheduleMeasure);
      window.removeEventListener("pageshow", scheduleMeasure);
    };
  }, [connectors, features]);

  const setFeatureCardRef = (id: FeatureId) => (node: HTMLDivElement | null) => {
    featureCardRefs.current[id] = node;
  };

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
    <section className="px-6 py-24 -mt-[clamp(2.5rem,5vh,4rem)] pt-[clamp(2.5rem,5vh,4rem)] md:-mt-[clamp(3rem,5vh,4.5rem)] md:pt-[clamp(6rem,9vh,7.5rem)]">
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

        <div ref={featureListRef} className="relative">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={feature.id}
                id={feature.id}
                className={`scroll-mt-24 ${index < features.length - 1 ? "pb-12 md:pb-16" : ""}`}
              >
                <m.div
                  initial={{ y: 30 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onUpdate={() => {
                    scheduleConnectorMeasurementRef.current();
                  }}
                  className={`flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-2 md:gap-8 items-center`}
                >
                  {/* Card Content */}
                  <div className="flex-1 w-full md:w-1/2">
                    <div
                      ref={setFeatureCardRef(feature.id)}
                      className="glass-card flex h-full flex-col p-6 md:p-8"
                    >
                      <h3 className="mb-4">
                        <button
                          type="button"
                          onClick={() => handleTitleClick(feature.id)}
                          className="interactive-feature-link w-full text-start text-xl md:text-2xl font-display font-normal italic text-foreground/85 focus-visible:outline-none"
                        >
                          {featureTitleFromTaglineSegments(t, feature.id)}
                        </button>
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex justify-end rtl:justify-start md:hidden -mb-2 -mr-2 rtl:-ml-2 rtl:mr-0">
                        <MobileFeatureCta
                          feature={feature}
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
              </div>
            );
          })}
          {connectors.map((connector) => {
            const isDrawn = prefersReducedMotion || Boolean(drawnConnectorIds[connector.id]);

            return (
              <svg
                key={connector.id}
                viewBox={`0 0 ${connector.width} ${connector.height}`}
                className="pointer-events-none absolute left-0 w-full select-none"
                style={{ top: `${connector.top}px`, height: `${connector.height}px` }}
                fill="none"
                aria-hidden="true"
              >
                <m.path
                  className="feature-connector-path"
                  d={connector.d}
                  strokeWidth={2}
                  strokeLinecap="square"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  {...(prefersReducedMotion
                    ? {}
                    : {
                        initial: { pathLength: 0 },
                        animate: { pathLength: isDrawn ? 1 : 0 },
                        transition: {
                          duration: 1,
                          ease: "easeInOut",
                        },
                      })}
                />
              </svg>
            );
          })}
        </div>
      </div>
    </section>
  );
}
