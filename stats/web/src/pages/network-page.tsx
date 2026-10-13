import { ClientCard } from "@/components/client-card";
import { CommunityTicks } from "@/components/community-ticks";
import { Delta, KpiBand } from "@/components/kpi-band";
import { NetworkActivity } from "@/components/network-activity";
import { PeerNetwork } from "@/components/peer-network";
import { OfTotal } from "@/components/primitives";
import { ServicesSection } from "@/components/services-section";
import { Freshness, PageHeader } from "@/components/shell";
import type { StatsResult } from "@/lib/api";
import {
  RANGE_LABELS,
  firstKnown,
  formatCompact,
  formatInteger,
  lastKnown,
  relativeChange,
} from "@/lib/format";
import type { Overview, RangeKey, Series } from "@/lib/types";
import { LoadState } from "@/pages/load-state";

const sumSeries = (all: Series[]) =>
  (all[0] ?? []).map((_, index) => {
    const values = all
      .map((values) => values[index])
      .filter((value): value is number => value !== null);
    return values.length ? values.reduce((total, value) => total + value, 0) : null;
  });

function NetworkFigures({ data }: { data: Overview }) {
  const { network, clients } = data;
  const rangeLabel = RANGE_LABELS[data.range.key];
  const totalSeries = sumSeries(clients.map(({ series }) => series.totalPosts));
  const first = firstKnown(totalSeries);
  const last = lastKnown(totalSeries);
  const growth = first === null || last === null ? null : last - first;
  const servicesDown = data.services.filter(({ up }) => up === 0);
  const offline =
    network.communitiesOnline === null
      ? null
      : network.communitiesTotal - network.communitiesOnline;

  return (
    <KpiBand
      items={[
        {
          label: "Communities online",
          wide: true,
          value: <OfTotal value={network.communitiesOnline} total={network.communitiesTotal} />,
          detail:
            offline === null
              ? "No data"
              : offline === 0
                ? "Every listed community is reachable"
                : `${offline} offline or stale for over ${data.offlineAfterSeconds / 3600} hours`,
          footer: (
            <CommunityTicks
              groups={clients.map(({ id, label, statuses }) => ({ id, label, statuses }))}
            />
          ),
        },
        {
          label: "Posts (24h)",
          value: formatInteger(network.postsLastDay),
          detail: (
            <Delta
              change={relativeChange(sumSeries(clients.map(({ series }) => series.postsLastDay)))}
              rangeLabel={rangeLabel}
            />
          ),
        },
        {
          label: "Current users",
          value: formatInteger(network.currentUsers),
          detail: (
            <Delta
              change={relativeChange(sumSeries(clients.map(({ series }) => series.currentUsers)))}
              rangeLabel={rangeLabel}
            />
          ),
        },
        {
          label: "Total posts",
          value: formatCompact(network.totalPosts),
          detail:
            growth === null
              ? "Posts and replies, all time"
              : `${growth >= 0 ? "+" : ""}${formatInteger(growth)} in the last ${rangeLabel}`,
        },
        {
          label: "Services up",
          value: <OfTotal value={network.servicesUp} total={network.servicesTotal} />,
          detail:
            servicesDown.length === 0
              ? "All responding"
              : `Down: ${servicesDown.map(({ label }) => label).join(", ")}`,
        },
      ]}
    />
  );
}

export function NetworkPage({ result, range }: { result: StatsResult<Overview>; range: RangeKey }) {
  const { data, error, fetchedAt, loading, isPrevious } = result;
  const clientNames = data?.clients.map(({ label }) => label).join(" and ") ?? "5chan and Seedit";

  const header = (
    <PageHeader
      title="Bitsocial network"
      description={`${data?.network.communitiesTotal ?? "All"} communities across ${clientNames}, plus the services and peer-to-peer infrastructure their apps depend on.`}
      status={<Freshness fetchedAt={fetchedAt} loading={loading || isPrevious} error={error} />}
    />
  );
  if (!data) {
    return (
      <>
        {header}
        <LoadState error={error} />
      </>
    );
  }

  return (
    <div className={isPrevious ? "opacity-60 transition-opacity" : "transition-opacity"}>
      {header}
      <NetworkFigures data={data} />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {data.clients.map((client) => (
          <ClientCard key={client.id} client={client} range={range} timeline={data.range} />
        ))}
      </div>
      <NetworkActivity data={data} />
      <PeerNetwork data={data} />
      <ServicesSection data={data} />
    </div>
  );
}
