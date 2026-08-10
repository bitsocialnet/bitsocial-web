import { Flame, Megaphone, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import Section from "./Section";

const STEPS = [
  { icon: Megaphone, label: "Ad slot", note: "auctioned by contract, not a sales team" },
  { icon: TrendingUp, label: "Bids", note: "advertisers bid in the community's own token" },
  {
    icon: Flame,
    label: "Settlement",
    note: "part of the payment is destroyed, the rest goes to the community",
  },
  { icon: Sparkles, label: "Scarcer token", note: "and the next auction" },
];

export default function ProgrammableRevenue() {
  return (
    <Section
      id="programmable-revenue"
      eyebrow="Ads and Tips"
      question="The marketplace is a contract."
      supporting="Advertisers would bid for a community's ad slots, in that community's own token. When a sale clears, the contract destroys part of the payment and the rest goes to the community."
      quote="Burn at the point of revenue, not buyback from a treasury."
      quoteAttribution="— Esteban Abaroa, Bitsocial founder"
    >
      {/* The site's only flow diagram, and the one place the loop is drawn as a
          ring instead of a straight arrow chain captioned "it compounds". */}
      <div className="loop">
        <div className="loop-ring">
          <ol className="loop-steps">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.label} className={`loop-step loop-step-${i + 1}`}>
                  <span className="loop-icon">
                    <Icon aria-hidden size={18} strokeWidth={1.8} />
                  </span>
                  <span className="loop-label">{step.label}</span>
                  <span className="loop-note">{step.note}</span>
                </li>
              );
            })}
          </ol>
          <span className="loop-hub" aria-hidden="true">
            <RefreshCw size={18} strokeWidth={1.8} />
          </span>
        </div>

        <p className="loop-caption">
          Tipping works the same way: the contract is the revenue endpoint.
        </p>
      </div>
    </Section>
  );
}
