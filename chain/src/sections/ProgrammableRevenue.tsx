import { ArrowRight, Flame, Megaphone, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import Section from "./Section";

const STEPS = [
  { icon: Megaphone, label: "Ad slot on-chain", note: "auctioned by contract, not a sales team" },
  { icon: TrendingUp, label: "Bids in the token", note: "advertisers market-buy to bid" },
  { icon: Flame, label: "Burn at settlement", note: "a share burns, the rest funds the DAO" },
  { icon: Sparkles, label: "Scarcer with every ad", note: "revenue is the buyback" },
];

export default function ProgrammableRevenue() {
  return (
    <Section
      id="programmable-revenue"
      eyebrow="Programmable revenue"
      question="How does ad revenue burn a community's token?"
      supporting="Because the ad marketplace is a contract, not a sales team. Communities auction their ad slots on-chain, bids are denominated in their own token, and settlement burns a share. Advertisers create the buy pressure, the contract does the burning: no treasury, no buyback bot, no trusted middleman. Revenue lives in an immutable contract instead of a founder's promise — community tokens become productive, rug-resistant assets, not memecoins."
      quote="Burn at the point of revenue, not buyback from a treasury."
    >
      <div className="flywheel">
        <ol className="flow-steps">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.label} className="flow-step">
                <span className="flow-icon">
                  <Icon aria-hidden size={18} strokeWidth={1.8} />
                </span>
                <span className="flow-label">{step.label}</span>
                <span className="flow-note">{step.note}</span>
                {i < STEPS.length - 1 ? (
                  <ArrowRight aria-hidden size={16} strokeWidth={1.8} className="flow-arrow" />
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="flow-loop">
          <RefreshCw aria-hidden size={15} strokeWidth={1.8} />
          Tipping works the same way: the contract is the revenue endpoint. Only revenue born
          on-chain can be programmed, and that is what native web3 distribution means.
        </p>
      </div>
    </Section>
  );
}
