import type { ReactNode } from "react";
import { LayoutGrid, Shield, Wrench } from "lucide-react";
import type { AppCategorySlug, CategoryData } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Array<CategoryData & { count: number }>;
  activeCategory: AppCategorySlug | null;
  onCategoryChange: (category: AppCategorySlug | null) => void;
  allLabel: string;
  allDescription: string;
  totalCount: number;
}

const categoryIconMap = {
  "layout-grid": LayoutGrid,
  shield: Shield,
  wrench: Wrench,
} as const;

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  allLabel,
  allDescription,
  totalCount,
}: CategoryFilterProps) {
  return (
    <aside className="h-fit lg:sticky lg:top-28">
      <div className="mb-3 px-1 pt-1">
        <p className="text-xs font-display uppercase tracking-[0.2em] text-foreground/50">
          Directory
        </p>
      </div>

      <div className="space-y-2">
        <CategoryButton
          active={activeCategory === null}
          label={allLabel}
          description={allDescription}
          count={totalCount}
          onClick={() => onCategoryChange(null)}
          icon={<LayoutGrid className="h-4 w-4" aria-hidden="true" />}
        />

        {categories.map((category) => {
          const Icon = categoryIconMap[category.icon];

          return (
            <CategoryButton
              key={category.slug}
              active={activeCategory === category.slug}
              label={category.label}
              description={category.description}
              count={category.count}
              onClick={() => onCategoryChange(category.slug)}
              icon={<Icon className="h-4 w-4" aria-hidden="true" />}
            />
          );
        })}
      </div>
    </aside>
  );
}

function CategoryButton({
  active,
  label,
  description,
  count,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  description: string;
  count: number;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "glass-card group flex w-full items-start justify-between rounded-[1.4rem] px-5 py-4 text-left transition-all duration-300",
        active
          ? "border-blue-core/30 text-foreground ring-glow shadow-[0_0_24px_rgba(37,99,235,0.12)] dark:border-blue-core/55"
          : "hover:border-blue-glow",
      )}
    >
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
    </button>
  );
}
