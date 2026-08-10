import { BITSOCIAL_URL } from "@/lib/site";
import Section from "./Section";

// Every cell is lifted from bitsocial.net's own comparison rather than written
// here, so the two sites cannot end up scoring the same question differently.
const ROWS = [
  {
    label: "Self-hosting cost",
    them: "Expensive node, hub, or RPC",
    us: "Extremely cheap, runs on Raspberry Pi",
  },
  {
    label: "Scaling model",
    them: "More state, heavier infra",
    us: "More peers, more bandwidth",
  },
  {
    label: "Takedown choke points",
    them: "Validators, hubs, RPCs",
    us: "No single choke point",
  },
  {
    label: "Custom anti-spam logic",
    them: "Tied to chains, hubs, or fees",
    us: "Built in: challenge can be anything",
  },
  {
    label: "What the chain stores",
    them: "Posts, comments, follows and reactions.",
    us: "The token and the names. No posts.",
  },
];

export default function OffChainPosts() {
  return (
    <Section
      id="off-chain-posts"
      eyebrow="On-chain Social"
      question="The chain never touches your posts."
      supporting="Bitsocial's own comparison rates on-chain social networks worse: heavier infrastructure, more choke points. That verdict stands. It does not apply to a chain that carries money and names, never posts."
    >
      <div className="compare">
        <div className="compare-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <td className="compare-corner" />
                <th scope="col" className="compare-col">
                  <span className="compare-col-name">Blockchain-based</span>
                  <span className="compare-col-sub">Farcaster, Lens, DeSo, Steemit</span>
                </th>
                <th scope="col" className="compare-col compare-col-us">
                  <span className="compare-col-name">Bitsocial + BSO</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="compare-label">
                    {row.label}
                  </th>
                  <td className="compare-them">{row.them}</td>
                  <td className="compare-us">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="compare-sources">
          Sources:{" "}
          <a
            className="section-link"
            href={`${BITSOCIAL_URL}/#decentralized`}
            target="_blank"
            rel="noopener noreferrer"
          >
            the comparison on bitsocial.net
          </a>
        </p>
      </div>
    </Section>
  );
}
