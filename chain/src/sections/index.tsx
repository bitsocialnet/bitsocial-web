import type { ComponentType } from "react";
import { SECTION_IDS, type SectionId } from "@/lib/faq";
import WhyAChain from "./WhyAChain";
import SoundMoney from "./SoundMoney";
import CommunityMoney from "./CommunityMoney";
import BsoNames from "./BsoNames";
import Possibilities from "./Possibilities";
import Privacy from "./Privacy";
import Unstoppable from "./Unstoppable";
import Verify from "./Verify";

// Keyed by FAQ id so a section without a question, or a question without a
// section, fails to typecheck. Page order comes from the FAQ list.
const SECTION_COMPONENTS: Record<SectionId, ComponentType> = {
  "why-a-chain": WhyAChain,
  tokenomics: SoundMoney,
  unstoppable: Unstoppable,
  "bso-names": BsoNames,
  "community-money": CommunityMoney,
  privacy: Privacy,
  possibilities: Possibilities,
  verify: Verify,
};

export default function Sections() {
  return (
    <>
      {SECTION_IDS.map((id) => {
        const SectionComponent = SECTION_COMPONENTS[id];
        return <SectionComponent key={id} />;
      })}
    </>
  );
}
