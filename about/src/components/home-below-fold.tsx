import AdoptionThesis from "@/components/adoption-thesis";
import ArbitraryChallenges from "@/components/arbitrary-challenges";
import BrowserPeer from "@/components/browser-peer";
import Faq from "@/components/faq";
import Features from "@/components/features";
import Footer from "@/components/footer";
import MailingList from "@/components/mailing-list";
import MasterPlan from "@/components/master-plan";
import ProblemSection from "@/components/problem";
import SanctuaryCommunication from "@/components/sanctuary-communication";
import TextOnlyProtocol from "@/components/text-only-protocol";

/** Every home section under the hero. Loaded as its own chunk; see `deferredComponent`. */
export default function HomeBelowFold() {
  return (
    <>
      <ProblemSection />
      <Features />
      <BrowserPeer />
      <SanctuaryCommunication />
      <ArbitraryChallenges />
      <TextOnlyProtocol />
      <AdoptionThesis />
      <MasterPlan />
      <MailingList />
      <Faq />
      <Footer />
    </>
  );
}
