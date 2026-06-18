import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "@bitsocial/bitsocial-react-hooks";
import { RefreshCw, X } from "lucide-react";
import BlogPeerWorldMap from "@/components/blog-peer-world-map";
import EasterEggOverlay from "@/components/easter-egg-overlay";
import {
  COUNTRY_FLAG_HEIGHT,
  COUNTRY_FLAG_WIDTH,
  getCountryFlagPosition,
  getCountryLabel,
} from "@/lib/country-flags";
import {
  formatBytes,
  getBlogP2PStats,
  type ConnectedPeerEntry,
  type ConnectedPeersStatRow,
  type NodeEndpointStatRow,
  type StatRow,
  type TextStatRow,
} from "@/lib/blog-p2p-stats";
import { cn } from "@/lib/utils";

interface BlogP2PModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REFRESH_INTERVAL_MS = 5_000;

type StatsState =
  | { status: "loading"; rows: null; lastUpdated: null }
  | { status: "ready"; rows: StatRow[]; lastUpdated: number }
  | { status: "error"; rows: null; lastUpdated: number | null; error: string };

export default function BlogP2PModal({ open, onOpenChange }: BlogP2PModalProps) {
  const { t } = useTranslation();
  const account = useAccount();
  const [state, setState] = useState<StatsState>({
    status: "loading",
    rows: null,
    lastUpdated: null,
  });
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    getBlogP2PStats(account, controller.signal)
      .then((rows) => {
        if (controller.signal.aborted) return;
        setState({ status: "ready", rows, lastUpdated: Date.now() });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState((previous) => ({
          status: "error",
          rows: null,
          lastUpdated: previous.lastUpdated,
          error: error instanceof Error ? error.message : String(error),
        }));
      });
    return () => controller.abort();
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
      contentClassName="glass-card !rounded-3xl max-h-[calc(100vh-1rem)] w-[min(760px,calc(100vw-1rem))] overflow-y-auto overscroll-contain p-4 shadow-[0_20px_64px_rgba(15,23,42,0.3)] [scrollbar-width:none] sm:p-5 [&::-webkit-scrollbar]:hidden"
    >
      <header className="flex items-start justify-between gap-3 border-b border-border/40 pb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-display uppercase tracking-[0.16em] text-foreground/45">
            {t("blog.p2p.eyebrow")}
          </p>
          <h2 className="mt-1 truncate font-display text-xl leading-tight text-foreground sm:text-2xl">
            {t("blog.p2p.title")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {state.lastUpdated
              ? t("blog.p2p.updated", { time: new Date(state.lastUpdated).toLocaleTimeString() })
              : t("blog.p2p.loading")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border/60 px-3 text-xs font-semibold text-foreground/80 transition-colors hover:border-blue-glow hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("blog.p2p.refresh")}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={t("blog.p2p.close")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-blue-glow hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {state.status === "loading" && !state.rows ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t("blog.p2p.loading")}</p>
      ) : null}

      {state.status === "error" ? (
        <p className="py-10 text-center text-sm text-foreground/70">{state.error}</p>
      ) : null}

      {state.status === "ready" && state.rows ? <StatsList rows={state.rows} /> : null}
    </EasterEggOverlay>
  );
}

function StatsList({ rows }: { rows: StatRow[] }) {
  return (
    <dl className="grid gap-2.5 pt-4 sm:grid-cols-3">
      {rows.map((row, index) => {
        if (row.type === "connectedPeers") {
          return <ConnectedPeersRow key={`${row.name}-${index}`} row={row} />;
        }
        if (row.type === "nodeEndpoint") {
          return <NodeEndpointRow key={`${row.name}-${index}`} row={row} />;
        }
        return <TextRow key={`${row.name}-${index}`} row={row} />;
      })}
    </dl>
  );
}

function StatCard({
  label,
  children,
  fullWidth = false,
  className,
}: {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-background/40 p-2.5",
        fullWidth ? "sm:col-span-3" : "",
        className,
      )}
    >
      <dt className="text-[10px] font-display uppercase tracking-[0.14em] text-foreground/45">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-5 text-foreground/85">{children}</dd>
    </div>
  );
}

function TextRow({ row }: { row: TextStatRow }) {
  const isMono = row.name === "Peer ID";
  const className = row.name === "Peer ID" ? "sm:col-span-2" : undefined;
  return (
    <StatCard label={row.name} className={className}>
      <span
        className={cn(
          "break-all",
          isMono ? "font-mono text-xs leading-relaxed text-foreground/80" : "",
        )}
      >
        {row.value}
      </span>
    </StatCard>
  );
}

function CountryFlag({ countryCode, className }: { countryCode?: string; className?: string }) {
  const position = getCountryFlagPosition(countryCode);
  if (!position) return null;
  const label = getCountryLabel(countryCode);
  return (
    <>
      <span
        aria-hidden="true"
        title={label}
        className={cn("inline-block shrink-0", className)}
        style={{
          backgroundImage: "url('/assets/icons/flags-1.png')",
          backgroundPosition: `-${position.x}px -${position.y}px`,
          backgroundRepeat: "no-repeat",
          width: COUNTRY_FLAG_WIDTH,
          height: COUNTRY_FLAG_HEIGHT,
          imageRendering: "pixelated",
        }}
      />
      <span className="sr-only">{label ?? countryCode ?? "flag"}</span>
    </>
  );
}

function NodeEndpointRow({ row }: { row: NodeEndpointStatRow }) {
  return (
    <StatCard label={row.name}>
      <span className="inline-flex flex-wrap items-center gap-2 break-all font-mono text-xs text-foreground/80">
        <CountryFlag countryCode={row.countryCode} />
        <span>{row.ip}</span>
      </span>
    </StatCard>
  );
}

function ConnectedPeersRow({ row }: { row: ConnectedPeersStatRow }) {
  return (
    <StatCard label={`${row.name} (${row.peerCount}/${row.connectionCount})`} fullWidth>
      {row.mapEntries && row.mapEntries.length > 0 ? (
        <div className="mt-2">
          <BlogPeerWorldMap peers={row.mapEntries} />
        </div>
      ) : null}
      {row.entries.length === 0 ? (
        <p className="mt-3 text-sm italic text-muted-foreground">
          Still bootstrapping — connecting to peers…
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {row.entries.map((entry) => (
            <PeerListItem key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </StatCard>
  );
}

function PeerListItem({ entry }: { entry: ConnectedPeerEntry }) {
  const downloaded = entry.transferStats?.downloadedBytes;
  const uploaded = entry.transferStats?.uploadedBytes;
  return (
    <li className="rounded-lg border border-border/40 bg-background/40 p-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="inline-flex min-w-0 items-center gap-2">
          {entry.countryCode ? <CountryFlag countryCode={entry.countryCode} /> : null}
          <span className="rounded-full border border-blue-core/30 px-2 py-0.5 font-semibold text-foreground/85">
            {entry.transport}
          </span>
        </span>
        <span className="shrink-0 text-muted-foreground">
          Received {formatBytes(downloaded ?? 0)} · Sent {formatBytes(uploaded ?? 0)}
        </span>
      </div>
      <p className="mt-2 truncate font-mono text-[11px] text-foreground/70">{entry.peerId}</p>
      {entry.address ? (
        <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{entry.address}</p>
      ) : null}
    </li>
  );
}
