import { Boxes, Layers, Users } from "lucide-react";
import Section from "./Section";

const COMMUNITIES = [
  { id: "alpha", name: "Community layer", meta: "its own token" },
  { id: "beta", name: "Community layer", meta: "its own token" },
  { id: "gamma", name: "Community layer", meta: "its own token" },
];

export default function CommunityMoney() {
  return (
    <Section
      id="community-money"
      title="One asset under many communities."
      supporting="Each community could run its own layer, an L3 with its own token, and pay its fees, names and rent in BSO. L3s already exist across crypto; on Bitsocial Chain one would arrive with a community already attached. Its revenue could settle itself: ad slots auctioned by contract, part of every sale destroyed on the spot and the rest paid to the community, with no buyback treasury for anyone to capture."
    >
      <div className="stack-tree">
        <div className="tree-tier tree-l3">
          {COMMUNITIES.map((community) => (
            <div key={community.id} className="tree-node">
              <Users aria-hidden size={16} strokeWidth={1.8} />
              <span className="tree-node-name">{community.name}</span>
              <span className="tree-node-meta">{community.meta}</span>
            </div>
          ))}
        </div>

        <div className="tree-flow">
          <span>fees, names and rent paid in BSO</span>
        </div>

        <div className="tree-tier tree-l2">
          <Layers aria-hidden size={18} strokeWidth={1.8} />
          <span className="tree-l2-text">
            <span className="tree-l2-name">Bitsocial Chain</span>
            <span className="tree-l2-meta">Ethereum layer · its state derives from Ethereum</span>
          </span>
          <span className="tier-badge tier-badge-proposed tree-l2-badge">Proposed</span>
        </div>

        <div className="tree-flow tree-flow-plain" aria-hidden="true" />

        <div className="tree-tier tree-l1">
          <Boxes aria-hidden size={16} strokeWidth={1.8} />
          <span>Ethereum L1 · security and data</span>
        </div>

        <p className="tree-caption">
          A share of every fee is destroyed; the rest pays for the chain's security.
        </p>
      </div>
    </Section>
  );
}
