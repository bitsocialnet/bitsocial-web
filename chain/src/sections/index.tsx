import type { ComponentType } from "react";
import { SECTION_FAQ, type SectionId } from "@/lib/faq";
import WhyAChain from "./WhyAChain";
import WhyAnL2 from "./WhyAnL2";
import SoundMoney from "./SoundMoney";
import TheAirdrop from "./TheAirdrop";
import CommunityMoney from "./CommunityMoney";
import AdsAndTips from "./AdsAndTips";
import BsoNames from "./BsoNames";
import Possibilities from "./Possibilities";
import Privacy from "./Privacy";
import Unstoppable from "./Unstoppable";
import Verify from "./Verify";

// Keyed by FAQ id so a section without a question, or a question without a
// section, fails to typecheck. Page order comes from the FAQ list.
const SECTION_COMPONENTS: Record<SectionId, ComponentType> = {
  "why-a-chain": WhyAChain,
  "why-an-l2": WhyAnL2,
  tokenomics: SoundMoney,
  "the-airdrop": TheAirdrop,
  unstoppable: Unstoppable,
  "bso-names": BsoNames,
  "community-money": CommunityMoney,
  "ads-and-tips": AdsAndTips,
  privacy: Privacy,
  possibilities: Possibilities,
  verify: Verify,
};

export default function Sections() {
  return (
    <>
      {SECTION_FAQ.map(({ id }) => {
        const SectionComponent = SECTION_COMPONENTS[id];
        return <SectionComponent key={id} />;
      })}
    </>
  );
}
