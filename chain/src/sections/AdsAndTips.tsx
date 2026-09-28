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

export default function AdsAndTips() {
  return (
    <Section
      id="ads-and-tips"
      title="Revenue burns at the point of sale."
      supporting="One way it could work: a community auctions its ad slots through a contract, advertisers bid in the community's own token, and part of every sale is destroyed on settlement while the rest goes to the community. No sales team, no treasury and no buyback bot, so there is no pot for anyone to capture. Only revenue born on-chain can be programmed like this, and none of it is scheduled."
    >
      {/* The one place the loop is drawn as a ring instead of a straight arrow
          chain captioned "it compounds". */}
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
          Tipping could work the same way, with the contract as the revenue endpoint. Whether either
          gets built, and how, is for the people building it to decide.
        </p>
      </div>
    </Section>
  );
}
