import { Legend, OfTotal, Panel, Section } from "@/components/primitives";
import { TimeChart } from "@/components/time-chart";
import { formatInteger } from "@/lib/format";
import type { ClientSummary, Overview, Series } from "@/lib/types";
import { clientView } from "@/lib/views";

/** Network activity stacked by client, so the top edge of each chart is the whole network. */
export function NetworkActivity({ data }: { data: Overview }) {
  const { network, clients } = data;
  const clientSeries = (pick: (client: ClientSummary) => Series) =>
    clients.map((client) => ({
      key: client.id,
      label: client.label,
      color: clientView(client.id)?.color ?? "rgb(var(--network))",
      values: pick(client),
    }));
  const legend = (
    <Legend
      items={clients.map((client) => ({
        label: client.label,
        color: clientView(client.id)?.color ?? "rgb(var(--network))",
      }))}
    />
  );

  return (
    <Section
      id="activity"
      title="Activity"
      description="Stacked by client, so the top edge is the whole network. Posts count threads and replies; current users are addresses that posted in the last 7 days."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Panel
          title="Posts in the last 24 hours"
          value={formatInteger(network.postsLastDay)}
          legend={legend}
        >
          <TimeChart
            label="Posts in the last 24 hours"
            range={data.range}
            stacked
            series={clientSeries((client) => client.series.postsLastDay)}
          />
        </Panel>
        <Panel title="Current users" value={formatInteger(network.currentUsers)} legend={legend}>
          <TimeChart
            label="Current users"
            range={data.range}
            stacked
            series={clientSeries((client) => client.series.currentUsers)}
          />
        </Panel>
        <Panel
          className="md:col-span-2 lg:col-span-1"
          title="Communities online"
          value={<OfTotal value={network.communitiesOnline} total={network.communitiesTotal} />}
          legend={legend}
        >
          <TimeChart
            label="Communities online"
            range={data.range}
            stacked
            series={clientSeries((client) => client.series.communitiesOnline)}
          />
        </Panel>
      </div>
    </Section>
  );
}
