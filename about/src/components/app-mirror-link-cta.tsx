import { type MouseEvent, type ReactNode, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Check } from "lucide-react";
import CardInlineCta from "@/components/card-inline-cta";
import { getAppLinkLabel, type AppLink } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

const IPFS_COMPANION_DOCS_URL = "https://docs.ipfs.tech/install/ipfs-companion/";
const ETH_LIMO_SUFFIX = ".eth.limo";
const ETH_LIMO_GATEWAY_SUFFIX = ".limo";
const MIRROR_TOOLTIP_WIDTH = 320;
const MIRROR_TOOLTIP_MARGIN = 12;
const MIRROR_TOOLTIP_GAP = 10;
const MIRROR_TOOLTIP_HIDE_DELAY_MS = 220;

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
  const verificationTooltipId = useId();
  const web3TooltipId = useId();
  const verification = link.verification;
  const linkLabel = getAppLinkLabel(link, t);
  const verifiedLabel = t("apps.mirrorVerified");
  const ensName = getEthNameFromEthLimo(link);
  const tooltipText = verification
    ? t("apps.mirrorVerificationTooltip", {
        appName: verification.appName,
        releaseTag: verification.releaseTag,
      })
    : undefined;
  const web3Tooltip = ensName
    ? {
        body: t("apps.mirrorWeb3TooltipBody", { ensName }),
        companionLabel: t("apps.mirrorWeb3CompanionLink"),
        id: web3TooltipId,
        label: t("apps.mirrorWeb3Tag"),
        title: t("apps.mirrorWeb3TooltipTitle", { ensName }),
      }
    : undefined;
  const destinationLabel = getDestinationLabel(link);
  const destinationTooltipLabel =
    link.kind === "launch" ? `${linkLabel}: ${destinationLabel}` : destinationLabel;
  const describedBy =
    [verification ? verificationTooltipId : undefined, web3Tooltip ? web3Tooltip.id : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <CardInlineCta
      href={link.url}
      className={cn("group/mirror-link", className)}
      aria-describedby={describedBy}
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
              id={verificationTooltipId}
              label={verifiedLabel}
              showLabel={showVerifiedLabel}
              title={destinationTooltipLabel}
              tooltip={tooltipText ?? ""}
              web3={web3Tooltip}
            />
          </>
        ) : null}
      </span>
    </CardInlineCta>
  );
}

type MirrorTooltipKind = "verification" | "web3";

interface MirrorTooltipPosition {
  kind: MirrorTooltipKind;
  left: number;
  placement: "above" | "below";
  top: number;
}

interface Web3MirrorTooltip {
  body: string;
  companionLabel: string;
  id: string;
  label: string;
  title: string;
}

function MirrorVerifiedBadge({
  checkedAt,
  id,
  label,
  showLabel,
  title,
  tooltip,
  web3,
}: {
  checkedAt: string;
  id: string;
  label: string;
  showLabel: boolean;
  title: string;
  tooltip: string;
  web3?: Web3MirrorTooltip;
}) {
  const [tooltipPosition, setTooltipPosition] = useState<MirrorTooltipPosition>();
  const hideTooltipTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isTooltipVisible = Boolean(tooltipPosition);
  const tooltipMeta = `SHA-256 / ${checkedAt}`;
  const activeWeb3Tooltip = tooltipPosition?.kind === "web3" ? web3 : undefined;

  function clearHideTooltipTimer() {
    if (hideTooltipTimer.current) {
      clearTimeout(hideTooltipTimer.current);
      hideTooltipTimer.current = undefined;
    }
  }

  function showTooltip(event: MouseEvent<HTMLElement>, kind: MirrorTooltipKind) {
    clearHideTooltipTimer();
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

    setTooltipPosition({ kind, left, placement, top });
  }

  function scheduleHideTooltip() {
    clearHideTooltipTimer();
    hideTooltipTimer.current = setTimeout(() => {
      setTooltipPosition(undefined);
      hideTooltipTimer.current = undefined;
    }, MIRROR_TOOLTIP_HIDE_DELAY_MS);
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 text-emerald-600",
        "dark:text-emerald-300",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center gap-1 font-semibold leading-none",
          showLabel ? "text-xs" : "h-4 w-4",
        )}
        onMouseEnter={(event) => showTooltip(event, "verification")}
        onMouseLeave={scheduleHideTooltip}
        aria-hidden={showLabel ? undefined : "true"}
      >
        <Check className={showLabel ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
        {showLabel ? <span>{label}</span> : null}
      </span>
      {web3 ? (
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10",
            "px-1.5 py-0.5 text-[10px] font-semibold leading-none text-emerald-700",
            "dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-100",
          )}
          onMouseEnter={(event) => showTooltip(event, "web3")}
          onMouseLeave={scheduleHideTooltip}
        >
          {web3.label}
        </span>
      ) : null}
      <span id={id} className="sr-only">
        {title}. {tooltip} {tooltipMeta}
      </span>
      {web3 ? (
        <span id={web3.id} className="sr-only">
          {web3.title}. {web3.body} {web3.companionLabel}.
        </span>
      ) : null}
      {isTooltipVisible && typeof document !== "undefined"
        ? createPortal(
            <span
              className={cn(
                "fixed z-[80] rounded-lg border border-border/70",
                "bg-popover/95 px-3 py-2 text-left text-xs font-body font-medium leading-5 text-popover-foreground",
                "shadow-xl backdrop-blur-md motion-reduce:transition-none",
              )}
              onMouseEnter={clearHideTooltipTimer}
              onMouseLeave={scheduleHideTooltip}
              style={{
                left: tooltipPosition?.left,
                maxWidth: `calc(100vw - ${MIRROR_TOOLTIP_MARGIN * 2}px)`,
                top: tooltipPosition?.top,
                transform: tooltipPosition?.placement === "above" ? "translateY(-100%)" : undefined,
                width: MIRROR_TOOLTIP_WIDTH,
              }}
            >
              <span className="mb-1 block font-display text-sm font-semibold">
                {activeWeb3Tooltip ? activeWeb3Tooltip.title : title}
              </span>
              {activeWeb3Tooltip ? (
                <>
                  {activeWeb3Tooltip.body}{" "}
                  <a
                    href={IPFS_COMPANION_DOCS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-semibold text-blue-core hover:text-blue-glow"
                  >
                    <span>{activeWeb3Tooltip.companionLabel}</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                </>
              ) : (
                <>
                  {tooltip}{" "}
                  <span
                    className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-popover-foreground/60"
                    translate="no"
                  >
                    {tooltipMeta}
                  </span>
                </>
              )}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}

function getEthNameFromEthLimo(link: AppLink) {
  if (link.kind !== "mirror") {
    return undefined;
  }

  try {
    const hostname = new URL(link.url).hostname.replace(/^www\./, "").toLowerCase();
    return hostname.endsWith(ETH_LIMO_SUFFIX)
      ? hostname.slice(0, -ETH_LIMO_GATEWAY_SUFFIX.length)
      : undefined;
  } catch {
    return undefined;
  }
}

function getDestinationLabel(link: AppLink) {
  try {
    const hostname = new URL(link.url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return link.label;
  }
}
