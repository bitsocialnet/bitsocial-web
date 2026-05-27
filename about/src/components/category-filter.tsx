import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BadgeCheck, LayoutGrid, Shield, Wrench } from "lucide-react";
import type { AppCategorySlug, CategoryData } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Array<CategoryData & { count: number }>;
  activeCategory: AppCategorySlug | null;
  allDescription: string;
  allLabel: string;
  directoryLabel: string;
  getCategoryHref?: (category: AppCategorySlug | null) => string;
  /** Skip the section header (used when the parent supplies its own label, e.g. a mobile disclosure). */
  hideHeader?: boolean;
  /** When true and no category is currently active, individual category buttons render as disabled (the cap would be exceeded). */
  isAtFilterCap?: boolean;
  onCategoryChange?: (category: AppCategorySlug | null) => void;
  totalCount: number;
}

const categoryIconMap = {
  "layout-grid": LayoutGrid,
  "badge-check": BadgeCheck,
  shield: Shield,
  wrench: Wrench,
} as const;

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  allLabel,
  allDescription,
  directoryLabel,
  getCategoryHref,
  hideHeader = false,
  isAtFilterCap = false,
  totalCount,
}: CategoryFilterProps) {
  return (
    <aside className="h-fit lg:sticky lg:top-28">
      {hideHeader ? null : (
        <div className="mb-3 px-1 pt-1">
          <h2 className="text-xs font-display uppercase tracking-[0.2em] text-foreground/50">
            {directoryLabel}
          </h2>
        </div>
      )}

      <div className="space-y-2">
        {/* "All Projects" only clears the category; never blocked by the cap. */}
        <CategoryButton
          active={activeCategory === null}
          count={totalCount}
          description={allDescription}
          href={getCategoryHref ? getCategoryHref(null) : undefined}
          icon={<LayoutGrid className="h-4 w-4" aria-hidden="true" />}
          label={allLabel}
          onClick={onCategoryChange ? () => onCategoryChange(null) : undefined}
        />

        {categories.map((category) => {
          const Icon = categoryIconMap[category.icon];
          const isActive = activeCategory === category.slug;

          return (
            <CategoryButton
              key={category.slug}
              active={isActive}
              count={category.count}
              description={category.description}
              disabled={!isActive && isAtFilterCap && !activeCategory}
              href={getCategoryHref ? getCategoryHref(category.slug) : undefined}
              icon={<Icon className="h-4 w-4" aria-hidden="true" />}
              label={category.label}
              onClick={onCategoryChange ? () => onCategoryChange(category.slug) : undefined}
            />
          );
        })}
      </div>
    </aside>
  );
}

function CategoryButton({
  active,
  count,
  description,
  disabled = false,
  href,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  description: string;
  disabled?: boolean;
  href?: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const { t } = useTranslation();
  const className = cn(
    "category-filter-button glass-card group flex w-full items-start justify-between rounded-[1.4rem] px-5 py-4 text-left transition-all duration-300",
    active
      ? "border-blue-core/30 text-foreground hover:border-blue-core/30 shadow-[0_0_24px_rgba(37,99,235,0.12)] dark:border-blue-core/55 dark:hover:border-blue-core/55"
      : "hover:border-blue-glow",
    disabled && "cursor-not-allowed opacity-40 hover:!border-border/60",
  );
  const content = (
    <>
      <div className="min-w-0 pr-4">
        <div className="flex items-center gap-2">
          <span className={cn(active ? "text-blue-glow" : "text-muted-foreground")}>{icon}</span>
          <span className="font-display text-lg leading-none">{label}</span>
        </div>
        <p
          className={cn(
            "mt-2 text-xs leading-5",
            active ? "text-foreground/72" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      </div>

      <span
        className={cn(
          "rounded-full border px-2.5 py-1 text-xs font-semibold",
          active ? "border-blue-core/25 text-foreground" : "border-border/60 text-foreground/70",
        )}
      >
        {count}
      </span>
    </>
  );

  if (disabled) {
    return (
      <div
        className={className}
        aria-disabled="true"
        title={t("apps.filterLimitReached", { defaultValue: "Filter limit reached" })}
      >
        {content}
      </div>
    );
  }

  if (href) {
    return (
      <Link to={href} data-active={active ? "true" : undefined} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active ? "true" : undefined}
      className={className}
    >
      {content}
    </button>
  );
}
