import { PeerMap } from "@/components/peer-map";
import { Panel, Section } from "@/components/primitives";
import { TimeChart } from "@/components/time-chart";
import { countryName, formatInteger, formatPercent } from "@/lib/format";
import type { Overview } from "@/lib/types";

/** Where peers are and how many there are now. */
export function PeerNetwork({ data }: { data: Overview }) {
  const { network, peers } = data;
  const peerRows = [
    {
      key: "pubsub",
      label: "Pubsub peers",
      hint: "Connected to community pubsub topics",
      values: peers.series.pubsub,
      now: network.peers.pubsub,
    },
    {
      key: "pubsubProviders",
      label: "Pubsub topic providers",
      hint: "Listed by HTTP routers",
      values: peers.series.pubsubProviders,
      now: network.peers.pubsubProviders,
    },
    {
      key: "ipnsProviders",
      label: "IPNS record providers",
      hint: "Listed by HTTP routers",
      values: peers.series.ipnsProviders,
      now: network.peers.ipnsProviders,
    },
  ];
  const countryTotal = peers.countries.reduce((sum, { count }) => sum + count, 0);

  return (
    <Section
      id="peers"
      title="Peer-to-peer network"
      description="Unique peers across every monitored community. City locations are approximate, from the public IPs of peers that provide community IPNS records."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
        <Panel
          title="Where IPNS record providers are"
          value={`${formatInteger(countryTotal)} peers in ${peers.countries.length} countries`}
        >
          <PeerMap locations={peers.locations} />
          <ol className="mt-4 grid gap-x-6 gap-y-2.5 border-t border-line pt-4 sm:grid-cols-2 2xl:grid-cols-4">
            {peers.countries.slice(0, 8).map(({ country, count }) => (
              <li
                key={country ?? "unknown"}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-[13px]"
              >
                <span className="truncate text-ink">{countryName(country)}</span>
                <span className="tabular text-ink-2">
                  {formatInteger(count)}{" "}
                  <span className="text-ink-3">· {formatPercent(count / countryTotal, 0)}</span>
                </span>
                <span className="col-span-2 h-1 overflow-hidden rounded-full bg-raised">
                  <span
                    className="block h-full rounded-full bg-network"
                    style={{ width: `${(count / (peers.countries[0]?.count || 1)) * 100}%` }}
                  />
                </span>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Peers now">
          <ul className="space-y-3">
            {peerRows.map(({ key, label, hint, values, now }) => (
              <li key={key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-[13px] text-ink">{label}</span>
                    <span className="block text-[11px] text-ink-3">{hint}</span>
                  </span>
                  <span className="figure text-lg font-semibold text-ink">
                    {formatInteger(now)}
                  </span>
                </div>
                <div className="mt-1">
                  <TimeChart
                    label={label}
                    range={data.range}
                    height={64}
                    axes={false}
                    series={[{ key, label, color: "rgb(var(--network))", values }]}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Section>
  );
}
