import { HistoryStrip } from "@/components/history-strip";
import { ExternalLink, Legend } from "@/components/primitives";
import { TimeChart } from "@/components/time-chart";
import { useStats } from "@/lib/api";
import { NEUTRAL, NEUTRAL_DIM, withAlpha } from "@/lib/colors";
import { formatAge, formatInteger, formatPercent } from "@/lib/format";
import type { ClientInfo, CommunityRow, CommunityView, RangeKey } from "@/lib/types";

/** Charts for one community, loaded when its row is opened. */
export function CommunityDetail({
  client,
  row,
  range,
  color,
  label,
  offlineAfterSeconds,
}: {
  client: ClientInfo;
  row: CommunityRow;
  range: RangeKey;
  color: string;
  label: string;
  offlineAfterSeconds: number;
}) {
  const path = `/api/v1/clients/${encodeURIComponent(client.id)}/communities/${encodeURIComponent(row.address)}?range=${range}`;
  const { data, error } = useStats<CommunityView>(path);
  const series = data?.series;
  const tint = withAlpha(color, 0.5);
  const facts = [
    { label: "Unique addresses, all time", value: formatInteger(row.uniqueAddresses) },
    {
      label: `Last ${client.community} update`,
      value: row.lastUpdateAge === null ? "Not fetched" : `${formatAge(row.lastUpdateAge)} ago`,
    },
    {
      label: "Last pubsub message",
      value: row.lastPubsubMessageAge === null ? "–" : `${formatAge(row.lastPubsubMessageAge)} ago`,
    },
    { label: "Uptime in range", value: formatPercent(row.uptime) },
  ];

  return (
    <div className="space-y-4 rounded-xl border border-line bg-bg/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-mono text-ink-2">{row.address}</span>
        <ExternalLink href={`${client.communityUrlPrefix}${row.address}`}>
          Open {label} on {client.label}
        </ExternalLink>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-ink-3">{fact.label}</dt>
            <dd className="tabular text-sm text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {error && !data && <p className="text-sm text-down">{error}</p>}
      {!data && !error && <p className="text-sm text-ink-3">Loading charts…</p>}

      {data && series && (
        <>
          <div>
            <h4 className="mb-2 text-xs font-medium text-ink-2">
              Availability{" "}
              <span className="font-normal text-ink-3">
                · online while fetched with an update under {offlineAfterSeconds / 3600} hours old
              </span>
            </h4>
            <HistoryStrip
              history={series.online}
              range={data.range}
              label={`${label} availability`}
              className="h-4"
            />
          </div>
          <div className="grid gap-x-6 gap-y-4 md:grid-cols-3">
            <div className="min-w-0">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 className="text-xs font-medium text-ink-2">Posts in the last 24h</h4>
                <Legend
                  items={[
                    { label: client.postLabel, color },
                    { label: client.replyLabel, color: tint },
                  ]}
                />
              </div>
              <TimeChart
                label={`${label} posts in the last 24 hours`}
                range={data.range}
                stacked
                height={96}
                series={[
                  { key: "posts", label: client.postLabel, color, values: series.posts },
                  { key: "replies", label: client.replyLabel, color: tint, values: series.replies },
                ]}
              />
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 className="text-xs font-medium text-ink-2">Active users</h4>
                <Legend
                  items={[
                    { label: "24h", color: NEUTRAL_DIM },
                    { label: "7d", color },
                    { label: "30d", color: NEUTRAL },
                  ]}
                />
              </div>
              <TimeChart
                label={`${label} active users`}
                range={data.range}
                height={96}
                series={[
                  { key: "month", label: "30 days", color: NEUTRAL, values: series.activeMonth },
                  { key: "day", label: "24 hours", color: NEUTRAL_DIM, values: series.activeDay },
                  { key: "week", label: "7 days", color, values: series.activeWeek },
                ]}
              />
            </div>
            <div className="min-w-0">
              <h4 className="mb-2 text-xs font-medium text-ink-2">Pubsub peers</h4>
              <TimeChart
                label={`${label} pubsub peers`}
                range={data.range}
                height={96}
                series={[{ key: "peers", label: "Peers", color, values: series.pubsubPeers }]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
