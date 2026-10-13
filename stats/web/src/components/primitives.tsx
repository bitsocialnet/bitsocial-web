import type { ReactNode } from "react";
import type { Health } from "@/lib/health";
import type { ViewDefinition } from "@/lib/views";

const lampColors: Record<Health, string> = {
  up: "bg-up",
  down: "bg-down",
  unknown: "bg-unknown",
};

/** A status dot. Always paired with text that names the state. */
export function Lamp({ health, className = "" }: { health: Health; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-2 shrink-0 rounded-full ${lampColors[health]} ${className}`}
    />
  );
}

export function LogoTile({
  view,
  size = "md",
}: {
  view: ViewDefinition;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "size-7 rounded-[8px]",
    md: "size-10 rounded-[11px]",
    lg: "size-14 rounded-[15px]",
  };
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden ring-1 ring-inset ring-black/10 ${sizes[size]} ${view.tile}`}
    >
      <img
        src={view.logo}
        alt=""
        width={128}
        height={128}
        className={view.id === "network" ? "size-[82%]" : "size-full"}
      />
    </span>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  id,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section aria-labelledby={headingId} className="mt-10 first:mt-0" id={id}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <h2 id={headingId} className="section-title">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-[13px] text-ink-3">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** A labelled chart or list inside a section. */
export function Panel({
  title,
  value,
  legend,
  children,
  className = "",
}: {
  title?: string;
  value?: ReactNode;
  legend?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel min-w-0 p-4 ${className}`}>
      {(title || value || legend) && (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <div className="min-w-0">
            {title && <h3 className="text-[13px] font-medium text-ink-2">{title}</h3>}
            {value && <div className="figure mt-0.5 text-xl font-semibold text-ink">{value}</div>}
          </div>
          {legend}
        </div>
      )}
      {children}
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-2">
      {items.map(({ label, color }) => (
        <li key={label} className="flex items-center gap-1.5">
          <span className="size-2 rounded-[2px]" style={{ background: color }} />
          {label}
        </li>
      ))}
    </ul>
  );
}

export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 rounded-sm text-accent hover:underline ${className}`}
    >
      {children}
      <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
        <path
          d="M4.5 2.5h5v5M9.5 2.5 3 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** "58 / 65", with the total recessed. */
export function OfTotal({ value, total }: { value: number | null; total: number }) {
  return (
    <>
      {value ?? "–"}
      <span className="text-ink-3"> / {total}</span>
    </>
  );
}
