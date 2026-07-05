import { Boxes, Layers, Users } from "lucide-react";
import Section from "./Section";

const COMMUNITIES = [
  { id: "alpha", name: "Community L3", meta: "token · DAO" },
  { id: "beta", name: "Community L3", meta: "token · DAO" },
  { id: "gamma", name: "Community L3", meta: "token · DAO" },
];

export default function SettlementLayer() {
  return (
    <Section
      id="settlement-layer"
      eyebrow="The settlement layer"
      question="Why would a social network need its own money?"
      supporting="Bitsocial Chain is the proposed Ethereum L2 appchain for Bitsocial. Communities run their own L3s, tokens and DAOs, yet they settle, stake and pay rent in BSO — and every community token trades against BSO. One asset sits under the whole economy, the way ETH sits under DeFi: the reserve currency of social."
      quote="Replacing on-chain TVL with social capital."
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
          <span>settle · stake · rent in BSO</span>
        </div>

        <div className="tree-tier tree-l2">
          <Layers aria-hidden size={18} strokeWidth={1.8} />
          <span className="tree-l2-text">
            <span className="tree-l2-name">Bitsocial Chain</span>
            <span className="tree-l2-meta">Ethereum L2 appchain · BSO settlement</span>
          </span>
        </div>

        <div className="tree-flow tree-flow-plain" aria-hidden="true" />

        <div className="tree-tier tree-l1">
          <Boxes aria-hidden size={16} strokeWidth={1.8} />
          <span>Ethereum L1 · security and data</span>
        </div>
      </div>
    </Section>
  );
}
