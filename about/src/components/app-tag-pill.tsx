import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AppTagPillProps {
  active?: boolean;
  /** Renders the pill as non-interactive (e.g. when adding it would exceed the filter cap). */
  disabled?: boolean;
  href?: string;
  label: string;
  onClick?: () => void;
}

const baseClassName =
  "app-tag-pill inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300";

export default function AppTagPill({
  active = false,
  disabled = false,
  href,
  label,
  onClick,
}: AppTagPillProps) {
  const { t } = useTranslation();
  const className = cn(
    baseClassName,
    active
      ? "border-blue-core/30 text-foreground ring-glow hover:border-blue-glow dark:border-blue-core/55 dark:hover:border-blue-glow"
      : "border-border/60 bg-transparent text-muted-foreground hover:border-blue-glow hover:text-foreground",
    disabled &&
      "cursor-not-allowed opacity-40 hover:!border-border/60 hover:!text-muted-foreground",
  );
  const activeAttr = active ? "true" : undefined;

  if (disabled) {
    return (
      <span
        className={className}
        data-active={activeAttr}
        aria-disabled="true"
        title={t("apps.filterLimitReached", { defaultValue: "Filter limit reached" })}
      >
        {label}
      </span>
    );
  }

  if (href) {
    return (
      <Link to={href} className={className} data-active={activeAttr}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} data-active={activeAttr}>
      {label}
    </button>
  );
}
