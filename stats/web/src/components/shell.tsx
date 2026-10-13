import { useEffect, useState, type ReactNode } from "react";
import { LogoTile } from "@/components/primitives";
import { formatAge } from "@/lib/format";
import { RANGE_KEYS, hrefFor, navigate, onLinkClick, useLocation } from "@/lib/router";
import type { Overview } from "@/lib/types";
import { VIEWS, type ViewDefinition } from "@/lib/views";

const readout = (view: ViewDefinition, overview: Overview | undefined) => {
  if (!overview) {
    return undefined;
  }
  if (view.id === "network") {
    const { communitiesOnline, communitiesTotal } = overview.network;
    return {
      short: `${communitiesOnline ?? "–"}/${communitiesTotal}`,
      long: `${communitiesOnline ?? "–"}/${communitiesTotal} communities online`,
    };
  }
  const client = overview.clients.find(({ id }) => id === view.id);
  if (!client) {
    return undefined;
  }
  return {
    short: `${client.communitiesOnline ?? "–"}/${client.communitiesTotal}`,
    long: `${client.communitiesOnline ?? "–"}/${client.communitiesTotal} ${client.communities} online`,
  };
};

function Wordmark() {
  const { range } = useLocation();
  const href = hrefFor("/", range);
  return (
    <a href={href} onClick={onLinkClick(href)} className="flex items-center gap-2.5 rounded-lg">
      <img src="/logos/bitsocial.webp" alt="" width={128} height={128} className="size-7" />
      <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
        Bitsocial <span className="font-medium text-ink-2">Stats</span>
      </span>
    </a>
  );
}

function RailNav({ overview }: { overview: Overview | undefined }) {
  const { pathname, range } = useLocation();
  return (
    <nav aria-label="Views">
      <ul className="space-y-1.5">
        {VIEWS.map((view) => {
          const href = hrefFor(view.path, range);
          const active = pathname === view.path;
          const status = readout(view, overview);
          return (
            <li key={view.id}>
              <a
                href={href}
                onClick={onLinkClick(href)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                  active
                    ? "border-accent/50 bg-accent/10"
                    : "border-transparent hover:border-line hover:bg-raised"
                }`}
              >
                <LogoTile view={view} />
                <span className="min-w-0">
                  <span
                    className={`block font-display text-[15px] font-semibold ${active ? "text-ink" : "text-ink-2"}`}
                  >
                    {view.label}
                  </span>
                  <span className="tabular block truncate text-xs text-ink-3">
                    {status?.long ?? "Loading…"}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function TabBar({ overview }: { overview: Overview | undefined }) {
  const { pathname, range } = useLocation();
  return (
    <nav
      aria-label="Views"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-rail/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-xl gap-1.5">
        {VIEWS.map((view) => {
          const href = hrefFor(view.path, range);
          const active = pathname === view.path;
          const status = readout(view, overview);
          return (
            <li key={view.id} className="flex-1">
              <a
                href={href}
                onClick={onLinkClick(href)}
                aria-current={active ? "page" : undefined}
                aria-label={status ? `${view.label}, ${status.long}` : view.label}
                className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border px-2 py-1.5 ${
                  active ? "border-accent/50 bg-accent/10" : "border-transparent"
                }`}
              >
                <LogoTile view={view} size="sm" />
                <span className="min-w-0 text-left">
                  <span
                    className={`block font-display text-[13px] font-semibold leading-tight ${active ? "text-ink" : "text-ink-2"}`}
                  >
                    {view.label}
                  </span>
                  <span className="tabular block text-[11px] leading-tight text-ink-3">
                    {status?.short ?? "…"}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const SOURCE_URL = "https://github.com/bitsocialnet/bitsocial-web/tree/master/stats";

export function AppShell({
  overview,
  children,
}: {
  overview: Overview | undefined;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[264px] shrink-0 flex-col border-r border-line bg-rail px-4 py-5 lg:flex">
        <div className="px-1">
          <Wordmark />
        </div>
        <div className="mt-7">
          <RailNav overview={overview} />
        </div>
        <div className="mt-auto space-y-3 px-1 text-xs leading-relaxed text-ink-3">
          <p>
            Measured continuously by the Bitsocial stats monitor, which fetches every listed
            community and probes each service the apps depend on.
          </p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <a className="hover:text-ink" href="https://bitsocial.net">
              bitsocial.net
            </a>
            <a className="hover:text-ink" href="https://docs.bitsocial.net">
              Docs
            </a>
            <a className="hover:text-ink" href={SOURCE_URL}>
              Source
            </a>
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-rail px-4 py-3 sm:px-6 lg:hidden">
          <Wordmark />
          <a className="text-xs text-ink-3 hover:text-ink" href={SOURCE_URL}>
            Source
          </a>
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-14 lg:pt-7">
          {children}
        </main>
      </div>

      <TabBar overview={overview} />
    </div>
  );
}

export function RangePicker() {
  const { pathname, range } = useLocation();
  return (
    <div
      role="radiogroup"
      aria-label="Time range"
      className="flex rounded-full border border-line bg-panel p-0.5"
    >
      {RANGE_KEYS.map((key) => {
        const selected = key === range;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => navigate(hrefFor(pathname, key), { replace: true, scroll: false })}
            className={`tabular min-w-11 rounded-full px-3 py-1.5 font-display text-[13px] font-semibold uppercase transition-colors ${
              selected ? "bg-accent-strong text-white" : "text-ink-2 hover:text-ink"
            }`}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}

const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(interval);
  }, [intervalMs]);
  return now;
};

/** How fresh the data on screen is, and whether the last refresh failed. */
export function Freshness({
  fetchedAt,
  loading,
  error,
}: {
  fetchedAt: number | undefined;
  loading: boolean;
  error: string | undefined;
}) {
  const now = useNow(10_000);
  let text = "Loading…";
  let tone = "bg-unknown";
  if (error) {
    text = fetchedAt
      ? `Refresh failed · data from ${formatAge((now - fetchedAt) / 1000)} ago`
      : "Stats are unavailable right now";
    tone = "bg-down";
  } else if (fetchedAt) {
    text = loading ? "Refreshing…" : `Updated ${formatAge((now - fetchedAt) / 1000)} ago`;
    tone = "bg-up";
  }
  return (
    <p className="flex items-center gap-2 text-xs text-ink-3">
      <span className={`size-1.5 rounded-full ${tone}`} aria-hidden="true" />
      {text}
      {/* Announce only failures and recoveries, not the ticking age. */}
      <span className="sr-only" aria-live="polite">
        {error ? "Stats could not be refreshed." : ""}
      </span>
    </p>
  );
}

export function PageHeader({
  view,
  title,
  description,
  status,
}: {
  view?: ViewDefinition;
  title: string;
  description: ReactNode;
  status: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 items-center gap-4">
        {view && <LogoTile view={view} size="lg" />}
        <div className="min-w-0">
          <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[2rem]">
            {title}
          </h1>
          <p className="mt-1 max-w-[70ch] text-sm text-ink-2">{description}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {status}
        <RangePicker />
      </div>
    </header>
  );
}
