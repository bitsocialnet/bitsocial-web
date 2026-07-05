import { ArrowRight, Banknote, Landmark, Lock } from "lucide-react";
import Section from "./Section";

const PILLARS = [
  {
    icon: Landmark,
    label: "The reserve asset of social",
    note: "Every community token pairs with BSO, settles in BSO, pays rent in BSO. ETH ran this playbook for DeFi, SOL for on-chain trading. Social is the bigger economy — and it is still off-chain.",
  },
  {
    icon: Banknote,
    label: "Revenue, not promises",
    note: "Ads and tipping burn tokens at the point of revenue, mechanically. No emissions, no treasury games: usage itself is the buy pressure.",
  },
  {
    icon: Lock,
    label: "The moat nobody can copy",
    note: "Exchanges have liquidity and L2s have tech, but none of them own distribution. A social network that routes its own ad demand and order flow on-chain cannot be forked away.",
  },
];

export default function Endgame() {
  return (
    <Section
      id="endgame"
      eyebrow="the endgame"
      question="How big does this get?"
      supporting="Social networks are the largest distribution machines ever built: their attention prints hundreds of billions of dollars a year, and today every one of those dollars is captured off-chain — by ad platforms, by custodial exchanges, by whoever stands in the middle. Bitsocial Chain routes that same economy through one immutable asset."
      quote="Whoever owns distribution owns the economy."
    >
      <div className="flywheel">
        <ol className="flow-steps flow-steps-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <li key={pillar.label} className="flow-step">
                <span className="flow-icon">
                  <Icon aria-hidden size={18} strokeWidth={1.8} />
                </span>
                <span className="flow-label">{pillar.label}</span>
                <span className="flow-note">{pillar.note}</span>
              </li>
            );
          })}
        </ol>
        <p className="flow-loop">
          <ArrowRight aria-hidden size={15} strokeWidth={1.8} />
          Sound money is Phase 1. The economy on top is the upside.
        </p>
      </div>
    </Section>
  );
}
