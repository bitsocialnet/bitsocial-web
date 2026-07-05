import { ArrowLeftRight, AtSign, Boxes, Coins, Network, Sparkles } from "lucide-react";
import Section from "./Section";

const PHASES = [
  {
    icon: Coins,
    label: "Phase 01 · Now",
    title: "Immutable BSO",
    desc: "The fixed-supply token migrates to its final immutable, adminless contract. The sound-money base layer.",
    active: true,
  },
  {
    icon: Network,
    label: "Phase 02 · Proposed",
    title: "Bitsocial Chain",
    desc: "The Ethereum L2 appchain whose state derives from L1, and the settlement home for BSO.",
    active: false,
  },
  {
    icon: AtSign,
    label: "Phase 03 · Proposed",
    title: ".bso namespace",
    desc: "Names and identity on the chain, registered and renewed in BSO.",
    active: false,
  },
  {
    icon: Boxes,
    label: "Phase 04 · Proposed",
    title: "Community L3s and tokens",
    desc: "Sovereign communities launch their own tokens and DAOs, all settling down to BSO.",
    active: false,
  },
  {
    icon: ArrowLeftRight,
    label: "Phase 05 · Proposed",
    title: "AgoraSwap",
    desc: "The community DEX where every community token trades against BSO — keeping the economy's liquidity on-chain instead of on custodial dollar exchanges.",
    active: false,
  },
  {
    icon: Sparkles,
    label: "Phase 06 · Frontier",
    title: "The open frontier",
    desc: "Creator collectibles, client tokens and decentralized sequencing: the long roadmap.",
    active: false,
  },
];

export default function MasterPlan() {
  return (
    <Section
      id="master-plan"
      eyebrow="The master plan"
      question="One token, then a whole economy on top."
      supporting="The token ships first; the network is the vision it unlocks. Everything past Phase 1 is proposed infrastructure, built in the open."
      quote="All or nothing: almost every other altcoin is just nothing."
    >
      <ol className="roadmap">
        {PHASES.map((phase) => {
          const Icon = phase.icon;
          return (
            <li key={phase.title} className={`phase${phase.active ? " phase-active" : ""}`}>
              <span className="phase-rail">
                <span className="phase-dot">
                  <Icon aria-hidden size={18} strokeWidth={1.8} />
                </span>
                <span className="phase-line" />
              </span>
              <span className="phase-body">
                <span className="phase-label">{phase.label}</span>
                <h3 className="phase-title">{phase.title}</h3>
                <p className="phase-desc">{phase.desc}</p>
              </span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
