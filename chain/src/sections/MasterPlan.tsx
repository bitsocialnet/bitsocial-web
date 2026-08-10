import { ArrowLeftRight, AtSign, Boxes, Coins, Network, Sparkles } from "lucide-react";
import Section from "./Section";

type PhaseStatus = "now" | "proposed" | "frontier";

const PHASES = [
  {
    icon: Coins,
    num: "Phase 01",
    status: "now" as PhaseStatus,
    title: "Immutable BSO",
    desc: "The fixed-supply token migrates to its final immutable, adminless contract. The sound-money base layer.",
    active: true,
  },
  {
    icon: Network,
    num: "Phase 02",
    status: "proposed" as PhaseStatus,
    title: "Bitsocial Chain",
    desc: "The Ethereum L2 appchain whose state derives from L1, and the settlement home for BSO.",
    active: false,
  },
  {
    icon: AtSign,
    num: "Phase 03",
    status: "proposed" as PhaseStatus,
    title: ".bso namespace",
    desc: "Names and identity on the chain, registered and renewed in BSO; names already in use through ENS airdrop to their owners.",
    active: false,
  },
  {
    icon: Boxes,
    num: "Phase 04",
    status: "proposed" as PhaseStatus,
    title: "Community L3s and tokens",
    desc: "Sovereign communities launch their own tokens and DAOs, all settling down to BSO. Assets scale with real communities, not with hype cycles.",
    active: false,
  },
  {
    icon: ArrowLeftRight,
    num: "Phase 05",
    status: "proposed" as PhaseStatus,
    title: "AgoraSwap",
    desc: "The community exchange where every community token trades against BSO, keeping the economy's liquidity on-chain instead of on custodial dollar exchanges.",
    active: false,
  },
  {
    icon: Sparkles,
    num: "Phase 06",
    status: "frontier" as PhaseStatus,
    title: "The open frontier",
    desc: "Creator collectibles, client tokens and decentralized sequencing: the long roadmap.",
    active: false,
  },
];

const STATUS_LABEL: Record<PhaseStatus, string> = {
  now: "Now",
  proposed: "Proposed",
  frontier: "Frontier",
};

export default function MasterPlan() {
  return (
    <Section
      id="master-plan"
      eyebrow="The Master Plan"
      question="One of six phases is built."
      supporting="Phase 1 is done: the token sits on its final contract, and no one can change it. The other five are proposals, built in the open, and none of them carries a date."
    >
      <>
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
                  <span className="phase-num">{phase.num}</span>
                  <span className={`phase-status phase-status-${phase.status}`}>
                    {STATUS_LABEL[phase.status]}
                  </span>
                  <h3 className="phase-title">{phase.title}</h3>
                  <p className="phase-desc">{phase.desc}</p>
                </span>
              </li>
            );
          })}
        </ol>

        <p className="roadmap-note">
          If nothing past Phase 1 ships, BSO stays exactly what it is today: a fixed-supply contract
          with no admin keys, on Ethereum.
        </p>
      </>
    </Section>
  );
}
