import { ArrowRight, ScanEye, Send, Share2, Wallet } from "lucide-react";
import FlowStep from "./FlowStep";
import Section from "./Section";

const STEPS = [
  { icon: Send, label: "Registered by bot", note: "a Telegram bot, open to anyone who showed up" },
  { icon: Share2, label: "Referral codes", note: "bringing in more people earned a larger share" },
  { icon: ScanEye, label: "Vetted by hand", note: "so no single participant could take too much" },
  { icon: Wallet, label: "Airdropped", note: "no presale, no team allocation, nothing sold" },
];

export default function TheAirdrop() {
  return (
    <Section
      id="the-airdrop"
      title="Airdropped, never sold."
      supporting="Around 600 people, in January 2022. They registered through a Telegram bot that gave each of them a referral code, and bringing in more people earned a larger allocation. Every recipient was then checked by hand, specifically so that no one could walk away with too much of the supply."
    >
      <div className="flywheel">
        <ol className="flow-steps">
          {STEPS.map((step, i) => (
            <FlowStep key={step.label} {...step}>
              {i < STEPS.length - 1 ? (
                <ArrowRight aria-hidden size={16} strokeWidth={1.8} className="flow-arrow" />
              ) : null}
            </FlowStep>
          ))}
        </ol>
        <p className="flow-loop">
          <ArrowRight aria-hidden size={15} strokeWidth={1.8} />
          The current contract mints the full supply to one address on deployment, which is how the
          migration works rather than a holding: balances were mirrored one-for-one onto it and paid
          back out by transfer. Every one of those transfers is on-chain and can be checked.
        </p>
      </div>
    </Section>
  );
}
