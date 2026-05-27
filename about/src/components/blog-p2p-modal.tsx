import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "@bitsocial/bitsocial-react-hooks";
import { RefreshCw, X } from "lucide-react";
import EasterEggOverlay from "@/components/easter-egg-overlay";
import { readBlogP2PStats, type BlogP2PStats } from "@/lib/blog-p2p-stats";
import { cn } from "@/lib/utils";

interface BlogP2PModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REFRESH_INTERVAL_MS = 5_000;

export default function BlogP2PModal({ open, onOpenChange }: BlogP2PModalProps) {
  const { t } = useTranslation();
  const account = useAccount();
  type StatsState =
    | { status: "loading"; stats: null; lastUpdated: null }
    | { status: "ready"; stats: BlogP2PStats; lastUpdated: number }
    | { status: "error"; stats: null; lastUpdated: number | null; error: string };
  const [state, setState] = useState<StatsState>({
    status: "loading",
    stats: null,
    lastUpdated: null,
  });
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    readBlogP2PStats(account)
      .then((stats) => {
        if (cancelled) return;
        setState({ status: "ready", stats, lastUpdated: Date.now() });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState((previous) => ({
          status: "error",
          stats: null,
          lastUpdated: previous.lastUpdated,
          error: error instanceof Error ? error.message : String(error),
        }));
      });
    return () => {
      cancelled = true;
    };
  }, [account, open, tick]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [open, refresh]);

  return (
    <EasterEggOverlay
      open={open}
      onOpenChange={onOpenChange}
      ariaLabel={t("blog.p2p.title")}
      contentClassName="glass-card !rounded-[1.75rem] max-h-[88vh] w-[min(880px,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain p-5 sm:p-6 md:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.32)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <header className="flex items-start justify-between gap-4 pb-4">
        <div>
          <p className="text-xs font-display uppercase tracking-[0.2em] text-foreground/45">
            {t("blog.p2p.eyebrow")}
          </p>
          <h2 className="mt-1 font-display text-2xl leading-tight text-foreground md:text-3xl">
            {t("blog.p2p.title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("blog.p2p.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label={t("blog.p2p.close")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-blue-glow hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2 border-y border-border/40 py-3">
        <span className="text-xs text-muted-foreground">
          {state.lastUpdated
            ? t("blog.p2p.updated", {
                seconds: Math.max(0, Math.round((Date.now() - state.lastUpdated) / 1000)),
              })
            : t("blog.p2p.loading")}
        </span>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-foreground/80 transition-colors hover:border-blue-glow hover:text-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{t("blog.p2p.refresh")}</span>
        </button>
      </div>

      {state.status === "loading" && !state.stats ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t("blog.p2p.loading")}</p>
      ) : null}

      {state.status === "error" ? (
        <p className="py-10 text-center text-sm text-foreground/70">{state.error}</p>
      ) : null}

      {state.status === "ready" && state.stats ? (
        <div className="space-y-6 pt-5">
          <dl className="grid gap-3 sm:grid-cols-2">
            <StatRow label={t("blog.p2p.mode")} value={state.stats.mode} mono={false} />
            <StatRow label={t("blog.p2p.peerId")} value={state.stats.peerId} mono />
            <StatRow
              label={t("blog.p2p.peerCount")}
              value={String(state.stats.peerCount)}
              mono={false}
            />
            <StatRow
              label={t("blog.p2p.connectionCount")}
              value={String(state.stats.connectionCount)}
              mono={false}
            />
          </dl>

          {state.stats.httpRouters.length > 0 ? (
            <section>
              <h3 className="text-xs font-display uppercase tracking-[0.18em] text-foreground/55">
                {t("blog.p2p.routers")}
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {state.stats.httpRouters.map((router) => (
                  <li key={router} className="font-mono text-foreground/70">
                    {router}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h3 className="text-xs font-display uppercase tracking-[0.18em] text-foreground/55">
              {t("blog.p2p.connections")}
            </h3>
            {state.stats.connections.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">{t("blog.p2p.noConnections")}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {state.stats.connections.map((connection) => (
                  <li
                    key={connection.id}
                    className="rounded-2xl border border-border/40 bg-background/40 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full border border-blue-core/30 px-2 py-0.5 text-foreground/80">
                        {connection.transport}
                      </span>
                      {connection.direction ? (
                        <span className="text-muted-foreground">{connection.direction}</span>
                      ) : null}
                      {connection.status ? (
                        <span className="text-muted-foreground">{connection.status}</span>
                      ) : null}
                    </div>
                    <p className="mt-2 truncate font-mono text-[11px] text-foreground/70">
                      {connection.peerId}
                    </p>
                    {connection.address ? (
                      <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
                        {connection.address}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </EasterEggOverlay>
  );
}

function StatRow({ label, value, mono }: { label: string; value: string; mono: boolean }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-background/40 p-3">
      <dt className="text-[11px] font-display uppercase tracking-[0.16em] text-foreground/45">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 break-all text-sm text-foreground/85",
          mono ? "font-mono text-xs leading-relaxed" : "",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
