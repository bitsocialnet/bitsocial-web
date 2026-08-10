import { ArrowRight, Boxes, Coins, ShieldCheck } from "lucide-react";
import Section from "./Section";

const REASONS = [
  {
    icon: ShieldCheck,
    label: "Ethereum already works",
    note: "It is the most secure and most decentralized settlement layer in crypto, with the deepest developer ecosystem to build against. An L2 inherits that security instead of bootstrapping its own.",
  },
  {
    icon: Boxes,
    label: "Only a few functions are needed",
    note: "Names, tipping, community tokens and settlement. A whole L1 is years of machinery for a handful of jobs, and most of it would never be used.",
  },
  {
    icon: Coins,
    label: "The token is already distributed",
    note: "A new L1 would need a new token. BSO was airdropped in full, so issuing another one would break the distribution this project is built on.",
  },
];

export default function WhyAnL2() {
  return (
    <Section
      id="why-an-l2"
      eyebrow="Why an L2"
      question="Why not build a new blockchain?"
      supporting="Because almost none of it would be needed. Ethereum already provides the security and the developer base; Bitsocial only needs a small set of on-chain functions on top. An appchain does those few things well, and keeps Ethereum underneath."
    >
      <div className="flywheel">
        <ol className="flow-steps flow-steps-3">
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <li key={reason.label} className="flow-step">
                <span className="flow-icon">
                  <Icon aria-hidden size={18} strokeWidth={1.8} />
                </span>
                <span className="flow-label">{reason.label}</span>
                <span className="flow-note">{reason.note}</span>
              </li>
            );
          })}
        </ol>
        <p className="flow-loop">
          <ArrowRight aria-hidden size={15} strokeWidth={1.8} />
          Ethereum's proven demand today is financial. Consumer social is the use case it does not
          have yet, and it is the one Bitsocial is already building.
        </p>
      </div>
    </Section>
  );
}
