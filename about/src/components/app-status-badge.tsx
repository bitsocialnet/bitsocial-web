import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { type AppStatus, getAppStatusLabel } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

interface AppStatusBadgeProps {
  status: AppStatus;
  /** True when the directory is filtered by this status. */
  active?: boolean;
  /** Renders a plain label (e.g. when adding the filter would exceed the filter cap). */
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

const statusClassNames: Record<AppStatus, string> = {
  ready: "border-emerald-500/30 text-emerald-700 dark:border-emerald-400/35 dark:text-emerald-200",
  experimental: "border-amber-500/25 text-amber-700 dark:border-amber-400/35 dark:text-amber-200",
  idea: "border-violet-500/25 text-violet-700 dark:border-violet-400/35 dark:text-violet-200",
};

// The pseudo-element widens the tap area without growing the small pill beside the title.
const interactiveClassName =
  "relative transition-colors duration-300 hover:border-current after:absolute after:-inset-x-1 after:-inset-y-3 after:content-['']";

export default function AppStatusBadge({
  status,
  active = false,
  disabled = false,
  href,
  onClick,
}: AppStatusBadgeProps) {
  const { t } = useTranslation();
  const label = getAppStatusLabel(status, t);
  const className = cn(
    "rounded-full border px-2 py-0.5 text-[0.625rem] font-medium uppercase leading-4 tracking-[0.14em]",
    statusClassNames[status],
  );
  const activeAttr = active ? "true" : undefined;

  if (disabled || (!href && !onClick)) {
    return (
      <span
        className={className}
        data-active={activeAttr}
        title={
          disabled
            ? t("apps.filterLimitReached", { defaultValue: "Filter limit reached" })
            : undefined
        }
      >
        {label}
      </span>
    );
  }

  if (href) {
    return (
      <Link to={href} className={cn(className, interactiveClassName)} data-active={activeAttr}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(className, interactiveClassName)}
      data-active={activeAttr}
    >
      {label}
    </button>
  );
}
