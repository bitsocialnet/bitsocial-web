import { ArrowLeftRight, AtSign, Boxes, Layers, Palette, Puzzle } from "lucide-react";
import FlowStep from "./FlowStep";
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
    note: "Communities with their own layer, their own token and their own treasury.",
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
      eyebrow="Possibilities"
      question="What could be built on it."
      supporting="Not a roadmap. There is no order here and no dates, because none of this is scheduled: it is the set of things a social layer with its own money would make possible, proposed in the open. Some of it will get built, some of it will be replaced by better ideas, and some of it will be built by people who have not shown up yet."
    >
      <div className="flywheel">
        <ol className="flow-steps flow-steps-3">
          {IDEAS.map((idea) => (
            <FlowStep key={idea.label} {...idea} />
          ))}
        </ol>
      </div>
    </Section>
  );
}
