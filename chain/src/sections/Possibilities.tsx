import { ArrowLeftRight, AtSign, Boxes, Layers, Palette, Puzzle } from "lucide-react";
import Section from "./Section";

const IDEAS = [
  {
    icon: Layers,
    label: "Bitsocial Chain",
    note: "The Ethereum L2 appchain itself, and the settlement home for BSO.",
  },
  {
    icon: AtSign,
    label: "A native .bso registry",
    note: "Names and identity registered on the chain, instead of borrowed from ENS.",
  },
  {
    icon: Boxes,
    label: "Community L3s and tokens",
    note: "Communities with their own layer and their own token, settling in BSO.",
  },
  {
    icon: ArrowLeftRight,
    label: "AgoraSwap",
    note: "A community DEX where community tokens trade against BSO, keeping liquidity on-chain.",
  },
  {
    icon: Palette,
    label: "Creator collectibles",
    note: "Ways for creators to sell something directly, without a platform taking a cut.",
  },
  {
    icon: Puzzle,
    label: "Whatever else fits",
    note: "Client tokens, decentralized sequencing, and ideas nobody has proposed yet.",
  },
];

export default function Possibilities() {
  return (
    <Section
      id="possibilities"
      title="Proposed, in the open."
      supporting="Not live yet. BSO is live on Ethereum today; Bitsocial Chain is a proposal, and its first proof of concept, native .bso names, runs on a local dev chain. Nothing below has a date. It is what a social layer with its own money would make possible: some of it will get built, some replaced by better ideas, and some built by people who have not shown up yet."
    >
      <div className="flywheel">
        <ol className="flow-steps">
          {IDEAS.map((idea) => {
            const Icon = idea.icon;
            return (
              <li key={idea.label} className="flow-step">
                <span className="flow-icon">
                  <Icon aria-hidden size={18} strokeWidth={1.8} />
                </span>
                <span className="flow-label">{idea.label}</span>
                <span className="flow-note">{idea.note}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
