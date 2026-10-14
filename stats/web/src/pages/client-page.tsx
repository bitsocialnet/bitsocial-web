import { CommunitiesTable } from "@/components/communities-table";
import { CommunityTicks } from "@/components/community-ticks";
import { Delta, KpiBand } from "@/components/kpi-band";
import { ExternalLink, Legend, Panel, Section } from "@/components/primitives";
import { Freshness, PageHeader } from "@/components/shell";
import { TimeChart } from "@/components/time-chart";
import { useStats } from "@/lib/api";
import { NEUTRAL, NEUTRAL_DIM, withAlpha } from "@/lib/colors";
import {
  RANGE_LABELS,
  formatCompact,
  formatInteger,
  lastKnown,
  relativeChange,
} from "@/lib/format";
import type { ClientView, RangeKey, Series } from "@/lib/types";
import type { ViewDefinition } from "@/lib/views";
import { LoadState } from "@/pages/load-state";

const addSeries = (left: Series, right: Series) =>
  left.map((value, index) =>
    value === null && right[index] === null ? null : (value ?? 0) + (right[index] ?? 0),
  );

export function ClientPage({ view, range }: { view: ViewDefinition; range: RangeKey }) {
  const { data, error, loading, isPrevious } = useStats<ClientView>(
    `/api/v1/clients/${view.id}?range=${range}`,
  );
  const client = data?.client;
  const Communities = client
    ? `${client.communities[0].toUpperCase()}${client.communities.slice(1)}`
    : "Communities";

  const header = (
    <PageHeader
      view={view}
      title={view.label}
      description={
        client ? (
          <>
            {data.totals.communitiesTotal} {client.communities} from {client.source}.{" "}
            <ExternalLink href={client.appUrl}>{new URL(client.appUrl).host}</ExternalLink>
          </>
        ) : (
          "Loading…"
        )
      }
      status={
        <Freshness
          updatedAt={data && Date.parse(data.generatedAt)}
          loading={loading || isPrevious}
          error={error}
        />
      }
    />
  );
  if (!data || !client) {
    return (
      <>
        {header}
        <LoadState error={error} />
      </>
    );
  }

  const { totals, series } = data;
  const rangeLabel = RANGE_LABELS[data.range.key];
  const color = view.color;
  const tint = withAlpha(color, 0.5);
  const offline =
    totals.communitiesOnline === null ? null : totals.communitiesTotal - totals.communitiesOnline;
  const threads = lastKnown(series.totalPosts);
  const replies = lastKnown(series.totalReplies);

  return (
    <div className={isPrevious ? "opacity-60 transition-opacity" : "transition-opacity"}>
      {header}

      <KpiBand
        items={[
          {
            label: `${Communities} online`,
            wide: true,
            value: (
              <>
                {totals.communitiesOnline ?? "–"}
                <span className="text-ink-3"> / {totals.communitiesTotal}</span>
              </>
            ),
            detail:
              offline === null
                ? "No data"
                : offline === 0
                  ? `Every ${client.community} is reachable`
                  : `${offline} offline or stale for over ${data.offlineAfterSeconds / 3600} hours`,
            footer: (
              <CommunityTicks
                groups={[{ id: client.id, label: client.label, statuses: data.communities }]}
              />
            ),
          },
          {
            label: "Posts (24h)",
            value: formatInteger(totals.postsLastDay),
            detail: (
              <Delta
                change={relativeChange(addSeries(series.posts, series.replies))}
                rangeLabel={rangeLabel}
              />
            ),
          },
          {
            label: "Current users",
            value: formatInteger(totals.currentUsers),
            detail: <Delta change={relativeChange(series.activeWeek)} rangeLabel={rangeLabel} />,
          },
          {
            label: "Total posts",
            value: formatCompact(totals.totalPosts),
            detail:
              threads === null || replies === null
                ? "All time"
                : `${formatCompact(threads)} ${client.postLabel.toLowerCase()} · ${formatCompact(replies)} ${client.replyLabel.toLowerCase()}`,
          },
        ]}
      />

      <Section
        id="activity"
        title="Activity"
        description={`As reported by each ${client.community}'s own stats. Current users are addresses that posted in the last 7 days, summed per ${client.community}.`}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Panel
            title="Posts in the last 24 hours"
            value={formatInteger(totals.postsLastDay)}
            legend={
              <Legend
                items={[
                  { label: client.postLabel, color },
                  { label: client.replyLabel, color: tint },
                ]}
              />
            }
          >
            <TimeChart
              label="Posts in the last 24 hours"
              range={data.range}
              stacked
              series={[
                { key: "posts", label: client.postLabel, color, values: series.posts },
                { key: "replies", label: client.replyLabel, color: tint, values: series.replies },
              ]}
            />
          </Panel>
          <Panel
            title="Active users"
            value={formatInteger(totals.currentUsers)}
            legend={
              <Legend
                items={[
                  { label: "24h", color: NEUTRAL_DIM },
                  { label: "7d", color },
                  { label: "30d", color: NEUTRAL },
                ]}
              />
            }
          >
            <TimeChart
              label="Active users"
              range={data.range}
              series={[
                { key: "month", label: "30 days", color: NEUTRAL, values: series.activeMonth },
                { key: "day", label: "24 hours", color: NEUTRAL_DIM, values: series.activeDay },
                { key: "week", label: "7 days", color, values: series.activeWeek },
              ]}
            />
          </Panel>
          <Panel
            className="md:col-span-2 lg:col-span-1"
            title="All-time posts"
            value={formatCompact(totals.totalPosts)}
            legend={
              <Legend
                items={[
                  { label: client.postLabel, color },
                  { label: client.replyLabel, color: tint },
                ]}
              />
            }
          >
            <TimeChart
              label="All-time posts"
              range={data.range}
              stacked
              series={[
                { key: "posts", label: client.postLabel, color, values: series.totalPosts },
                {
                  key: "replies",
                  label: client.replyLabel,
                  color: tint,
                  values: series.totalReplies,
                },
              ]}
            />
          </Panel>
        </div>
      </Section>

      <Section
        id="communities"
        title={Communities}
        description={`Select a ${client.community} for its charts. A ${client.community} is offline while the monitor cannot fetch it or its latest update is over ${data.offlineAfterSeconds / 3600} hours old.`}
      >
        <CommunitiesTable
          client={client}
          communities={data.communities}
          range={data.range}
          color={color}
          offlineAfterSeconds={data.offlineAfterSeconds}
        />
      </Section>
    </div>
  );
}
