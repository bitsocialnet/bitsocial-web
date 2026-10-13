import { CommunityTicks } from "@/components/community-ticks";
import { LogoTile, OfTotal } from "@/components/primitives";
import { TimeChart } from "@/components/time-chart";
import { formatCompact, formatInteger } from "@/lib/format";
import { hrefFor, onLinkClick } from "@/lib/router";
import type { ClientSummary, RangeInfo, RangeKey } from "@/lib/types";
import { clientView } from "@/lib/views";

/** One client's share of the network, linking to its own view. */
export function ClientCard({
  client,
  range,
  timeline,
}: {
  client: ClientSummary;
  range: RangeKey;
  timeline: RangeInfo;
}) {
  const view = clientView(client.id);
  if (!view) {
    return null;
  }
  const href = hrefFor(view.path, range);
  const offline =
    client.communitiesOnline === null ? null : client.communitiesTotal - client.communitiesOnline;
  const stats = [
    {
      label: `${client.communities[0].toUpperCase()}${client.communities.slice(1)} online`,
      value: <OfTotal value={client.communitiesOnline} total={client.communitiesTotal} />,
    },
    { label: "Posts 24h", value: formatInteger(client.postsLastDay) },
    { label: "Users 7d", value: formatInteger(client.currentUsers) },
    { label: "Total posts", value: formatCompact(client.totalPosts) },
  ];
  return (
    <article className="panel flex min-w-0 flex-col p-4">
      <header className="flex items-center gap-3">
        <LogoTile view={view} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold leading-tight text-ink">
            {client.label}
          </h3>
          <p className="truncate text-xs text-ink-3">
            {client.communitiesTotal} {client.communities}
            {offline ? ` · ${offline} offline` : offline === 0 ? " · all online" : ""}
          </p>
        </div>
        <a
          href={href}
          onClick={onLinkClick(href)}
          className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[13px] font-medium text-ink-2 transition-colors hover:border-accent/60 hover:text-ink"
        >
          {client.label} stats <span aria-hidden="true">→</span>
        </a>
      </header>
      <CommunityTicks
        className="mt-4"
        groups={[{ id: client.id, label: client.label, statuses: client.statuses }]}
      />
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="truncate text-xs text-ink-3">{label}</dt>
            <dd className="figure text-lg font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4">
        <TimeChart
          label={`${client.label} posts in the last 24 hours`}
          range={timeline}
          height={48}
          axes={false}
          series={[
            {
              key: client.id,
              label: "Posts 24h",
              color: view.color,
              values: client.series.postsLastDay,
            },
          ]}
        />
      </div>
    </article>
  );
}
