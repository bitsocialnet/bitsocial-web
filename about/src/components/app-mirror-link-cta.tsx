import { type MouseEvent, type ReactNode, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Check } from "lucide-react";
import CardInlineCta from "@/components/card-inline-cta";
import { getAppLinkLabel, type AppLink } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

const MIRROR_TOOLTIP_WIDTH = 288;
const MIRROR_TOOLTIP_MARGIN = 12;
const MIRROR_TOOLTIP_GAP = 10;

interface AppMirrorLinkCtaProps {
  className: string;
  icon?: ReactNode;
  iconClassName?: string;
  link: AppLink;
  showVerifiedLabel?: boolean;
}

export default function AppMirrorLinkCta({
  className,
  icon,
  iconClassName = "h-4 w-4",
  link,
  showVerifiedLabel = false,
}: AppMirrorLinkCtaProps) {
  const { t } = useTranslation();
  const tooltipId = useId();
  const verification = link.verification;
  const linkLabel = getAppLinkLabel(link, t);
  const verifiedLabel = t("apps.mirrorVerified");
  const tooltipText = verification
    ? t("apps.mirrorVerificationTooltip", {
        appName: verification.appName,
        releaseTag: verification.releaseTag,
      })
    : undefined;
  const destinationLabel = getDestinationLabel(link);
  const destinationTooltipLabel =
    link.kind === "launch" ? `${linkLabel}: ${destinationLabel}` : destinationLabel;

  return (
    <CardInlineCta
      href={link.url}
      className={cn("group/mirror-link", className)}
      aria-describedby={verification ? tooltipId : undefined}
      aria-label={verification ? `${linkLabel} ${verifiedLabel}: ${destinationLabel}` : undefined}
    >
      <span className="inline-flex min-w-0 items-center gap-1.5">
        {icon ? (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : (
          <ArrowUpRight className={cn("shrink-0", iconClassName)} aria-hidden="true" />
        )}
        <span className="min-w-0 truncate">{linkLabel}</span>
        {verification ? (
          <>
            {" "}
            <MirrorVerifiedBadge
              checkedAt={verification.checkedAt}
              id={tooltipId}
              label={verifiedLabel}
              showLabel={showVerifiedLabel}
              title={destinationTooltipLabel}
              tooltip={tooltipText ?? ""}
            />
          </>
        ) : null}
      </span>
    </CardInlineCta>
  );
}

function MirrorVerifiedBadge({
  checkedAt,
  id,
  label,
  showLabel,
  title,
  tooltip,
}: {
  checkedAt: string;
  id: string;
  label: string;
  showLabel: boolean;
  title: string;
  tooltip: string;
}) {
  const [tooltipPosition, setTooltipPosition] = useState<{
    left: number;
    placement: "above" | "below";
    top: number;
  }>();
  const isTooltipVisible = Boolean(tooltipPosition);
  const tooltipMeta = `SHA-256 / ${checkedAt}`;

  function showTooltip(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const tooltipWidth = Math.min(MIRROR_TOOLTIP_WIDTH, viewportWidth - MIRROR_TOOLTIP_MARGIN * 2);
    const left = Math.min(
      Math.max(MIRROR_TOOLTIP_MARGIN, rect.left + rect.width / 2 - tooltipWidth / 2),
      viewportWidth - tooltipWidth - MIRROR_TOOLTIP_MARGIN,
    );
    const placement = rect.top < 120 ? "below" : "above";
    const top =
      placement === "below" ? rect.bottom + MIRROR_TOOLTIP_GAP : rect.top - MIRROR_TOOLTIP_GAP;

    setTooltipPosition({ left, placement, top });
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 text-emerald-600",
        "dark:text-emerald-300",
      )}
      onMouseEnter={showTooltip}
      onMouseLeave={() => setTooltipPosition(undefined)}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center gap-1 font-semibold leading-none",
          showLabel ? "text-xs" : "h-4 w-4",
        )}
        aria-hidden={showLabel ? undefined : "true"}
      >
        <Check className={showLabel ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
        {showLabel ? <span>{label}</span> : null}
      </span>
      <span id={id} className="sr-only">
        {title}. {tooltip} {tooltipMeta}
      </span>
      {isTooltipVisible && typeof document !== "undefined"
        ? createPortal(
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none fixed z-[80] rounded-lg border border-border/70",
                "bg-popover/95 px-3 py-2 text-left text-xs font-body font-medium leading-5 text-popover-foreground",
                "shadow-xl backdrop-blur-md motion-reduce:transition-none",
              )}
              style={{
                left: tooltipPosition?.left,
                maxWidth: `calc(100vw - ${MIRROR_TOOLTIP_MARGIN * 2}px)`,
                top: tooltipPosition?.top,
                transform: tooltipPosition?.placement === "above" ? "translateY(-100%)" : undefined,
                width: MIRROR_TOOLTIP_WIDTH,
              }}
            >
              <span className="mb-1 block font-display text-sm font-semibold" translate="no">
                {title}
              </span>
              {tooltip}{" "}
              <span
                className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-popover-foreground/60"
                translate="no"
              >
                {tooltipMeta}
              </span>
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}

function getDestinationLabel(link: AppLink) {
  try {
    const hostname = new URL(link.url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return link.label;
  }
}
