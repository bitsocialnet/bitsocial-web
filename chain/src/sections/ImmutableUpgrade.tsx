import { ArrowUpRight, BadgeCheck, ShieldCheck, TriangleAlert } from "lucide-react";
import { BSO_TOKEN_ADDRESS_SHORT, DOCS_TOKEN_HISTORY_URL, ETHERSCAN_TOKEN_URL } from "@/lib/site";
import Section from "./Section";

type Gen = {
  gen: string;
  chain: string;
  when: string;
  addr: string;
  href: string | null;
  statuses: Array<{
    icon: "origin" | "proxy" | "immutable";
    label: string;
  }>;
  badge: "past" | "now" | "next";
  badgeLabel: string;
};

const GENS: Gen[] = [
  {
    gen: "Gen 1",
    chain: "Avalanche",
    when: "2022",
    addr: "0x625f…bee9",
    href: "https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9",
    statuses: [
      { icon: "origin", label: "origin · 100% airdropped" },
      { icon: "proxy", label: "upgradeable proxy · the code could still be changed" },
    ],
    badge: "past",
    badgeLabel: "Origin",
  },
  {
    gen: "Gen 2",
    chain: "Ethereum",
    when: "2023",
    addr: "0xEA81…Bd8f",
    href: "https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f",
    statuses: [{ icon: "proxy", label: "upgradeable proxy · the code could still be changed" }],
    badge: "past",
    badgeLabel: "Previous",
  },
  {
    gen: "Gen 3",
    chain: "Ethereum",
    when: "2026",
    addr: BSO_TOKEN_ADDRESS_SHORT,
    href: ETHERSCAN_TOKEN_URL,
    statuses: [{ icon: "immutable", label: "immutable · adminless" }],
    badge: "now",
    badgeLabel: "Current",
  },
];

function StatusIcon({ icon }: { icon: Gen["statuses"][number]["icon"] }) {
  if (icon === "proxy") return <TriangleAlert aria-hidden size={13} strokeWidth={1.9} />;
  if (icon === "immutable") return <ShieldCheck aria-hidden size={13} strokeWidth={1.9} />;
  return <BadgeCheck aria-hidden size={13} strokeWidth={1.9} />;
}

export default function ImmutableUpgrade() {
  return (
    <Section
      id="immutable-upgrade"
      eyebrow="Three Generations"
      question="Why are there three BSO addresses?"
      supporting="The first two contracts were upgradeable proxies: whoever held the keys could swap the code. The third removed that key. Each move was a 1:1 airdrop, so holders signed nothing and claimed nothing."
      quote="For a provenance coin, the history is the point."
      quoteAttribution="— Esteban Abaroa, Bitsocial founder"
    >
      <div className="lineage">
        <ol className="lineage-rail">
          {GENS.map((g) => (
            <li key={g.gen} className={`gen${g.badge === "now" ? " gen-next" : ""}`}>
              <span className="gen-head">
                <span className="gen-name">{g.gen}</span>
                <span className={`gen-badge gen-badge-${g.badge}`}>{g.badgeLabel}</span>
              </span>
              <span className="gen-chain">
                {g.chain} · {g.when}
              </span>
              {g.href ? (
                <a className="gen-addr" href={g.href} target="_blank" rel="noopener noreferrer">
                  {g.addr}
                </a>
              ) : (
                <span className="gen-addr gen-addr-pending">{g.addr}</span>
              )}
              <span className="gen-statuses">
                {g.statuses.map((status) => (
                  <span className="gen-status" key={status.label}>
                    <StatusIcon icon={status.icon} />
                    {status.label}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>

        {/* The concession and its counterweight travel together, the way the token
            history doc states them; splitting them is what made it self-harming. */}
        <p className="lineage-note">
          The protocol is open and the chain is optional by design: anyone can fork the code, run
          their own client, or build their own economy on top of it. What cannot be forked away is
          provenance. BSO has been the official Bitsocial token since day one.
        </p>

        <a
          className="lineage-link"
          href={DOCS_TOKEN_HISTORY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          The full token history
          <ArrowUpRight aria-hidden size={15} strokeWidth={1.85} />
        </a>
      </div>
    </Section>
  );
}
