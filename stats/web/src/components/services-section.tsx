import { OfTotal, Panel, Section } from "@/components/primitives";
import { StatusList } from "@/components/status-list";
import { RANGE_LABELS, formatPercent } from "@/lib/format";
import type { Overview } from "@/lib/types";

/** Bitsocial services, client infrastructure and the gateway-mode fallback providers. */
export function ServicesSection({ data }: { data: Overview }) {
  const { network } = data;
  const rangeLabel = RANGE_LABELS[data.range.key];

  return (
    <Section
      id="services"
      title="Services and infrastructure"
      description={`Each bar covers the last ${rangeLabel}: green while a check passes, amber for a partial outage, red while it fails.`}
    >
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <Panel
          title="Bitsocial services"
          value={<OfTotal value={network.servicesUp} total={network.servicesTotal} />}
        >
          <StatusList
            range={data.range}
            groups={[
              { label: "Websites", rows: data.services.filter(({ kind }) => kind === "website") },
              { label: "Services", rows: data.services.filter(({ kind }) => kind === "service") },
            ]}
          />
        </Panel>
        <Panel
          title="Client infrastructure"
          value={
            <span className="text-sm font-medium text-ink-2">
              What 5chan and Seedit use in pure P2P mode
            </span>
          }
        >
          <StatusList
            range={data.range}
            groups={[
              {
                label: "HTTP routers (finding peers)",
                rows: data.routers,
                note: (row) =>
                  row.coverage !== null && row.coverage !== undefined && row.coverage < 1 ? (
                    <span
                      className="shrink-0 text-[11px] text-ink-3"
                      title="Share of communities this router found IPNS record providers for"
                    >
                      finds {formatPercent(row.coverage, 0)}
                    </span>
                  ) : null,
              },
              { label: "Ethereum RPCs (resolving names)", rows: data.nameResolvers },
            ]}
          />
        </Panel>
        <Panel
          className="lg:col-span-2 2xl:col-span-1"
          title="Gateway mode fallback"
          value={
            <span className="text-sm font-medium text-ink-2">
              Only used when pure P2P mode is off
            </span>
          }
        >
          <StatusList
            range={data.range}
            className="grid gap-x-8 gap-y-4 lg:grid-cols-2 2xl:grid-cols-1"
            groups={[
              { label: "IPFS gateways", rows: data.gateways },
              { label: "Pubsub providers", rows: data.pubsubProviders },
            ]}
          />
        </Panel>
      </div>
    </Section>
  );
}
