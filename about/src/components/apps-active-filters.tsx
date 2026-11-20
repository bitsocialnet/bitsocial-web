import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export interface ActiveFilter {
  key: string;
  label: string;
  /** Removes the filter in place; without it the chip links to `removeHref` (no-JS view). */
  onRemove?: () => void;
  removeHref: string;
}

interface AppsActiveFiltersProps {
  filters: ActiveFilter[];
  clearHref: string;
  onClear?: () => void;
}

const chipClassName =
  "touch-target inline-flex items-center gap-1.5 rounded-full border border-blue-core/30 py-1 pl-3 pr-2 text-xs font-medium text-foreground ring-glow transition-all duration-300 hover:border-blue-glow dark:border-blue-core/55";

const clearClassName =
  "touch-target inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-foreground/80 transition-all duration-300 hover:border-blue-glow hover:text-foreground sm:ml-auto";

/** "Filtering by" row above the project results, so a filtered list never passes for the full one. */
export default function AppsActiveFilters({ filters, clearHref, onClear }: AppsActiveFiltersProps) {
  const { t } = useTranslation();

  if (filters.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="glass-card mb-5 flex flex-wrap items-center gap-2 !rounded-2xl border-blue-core/30 px-4 py-3 dark:border-blue-core/45"
    >
      <span className="mr-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
        {t("apps.filteringBy")}
      </span>
      {filters.map((filter) => {
        const content = (
          <>
            <span>{filter.label}</span>
            <X className="h-3.5 w-3.5 text-foreground/60" aria-hidden="true" />
          </>
        );
        const ariaLabel = t("apps.removeFilter", { filter: filter.label });

        return filter.onRemove ? (
          <button
            key={filter.key}
            type="button"
            onClick={filter.onRemove}
            aria-label={ariaLabel}
            className={chipClassName}
          >
            {content}
          </button>
        ) : (
          <Link
            key={filter.key}
            to={filter.removeHref}
            aria-label={ariaLabel}
            className={chipClassName}
          >
            {content}
          </Link>
        );
      })}
      {onClear ? (
        <button type="button" onClick={onClear} className={clearClassName}>
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t("apps.clearFilters")}</span>
        </button>
      ) : (
        <Link to={clearHref} className={clearClassName}>
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t("apps.clearFilters")}</span>
        </Link>
      )}
    </div>
  );
}
