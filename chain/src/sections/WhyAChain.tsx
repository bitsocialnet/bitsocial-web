import { Link2 } from "lucide-react";
import { BITSOCIAL_URL } from "@/lib/site";
import Section from "./Section";

export default function WhyAChain() {
  return (
    <Section
      id="why-a-chain"
      eyebrow="Why a Chain"
      question="Bitsocial itself is not on a blockchain."
      supporting={
        <>
          Posts, profiles, communities and moderation on{" "}
          <a
            className="section-link"
            href={BITSOCIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Bitsocial
          </a>{" "}
          are peer-to-peer. No chain, no fees, no wallet: you can use the whole network without ever
          touching crypto, and most people will. But a few things genuinely need a chain — names
          that are yours, money that moves between strangers, tokens a community actually owns.
          Bitsocial Chain is for exactly those, and nothing else.
        </>
      }
      quote="A decentralized social network needs decentralized money."
    >
      <div className="premise">
        <div className="premise-half">
          <span className="premise-badge">Peer-to-peer</span>
          <span className="premise-name">Bitsocial</span>
          <span className="premise-note">The social network. No chain involved.</span>
          <ul className="premise-traits">
            <li>Posts and comments</li>
            <li>Profiles and communities</li>
            <li>Moderation and anti-spam</li>
          </ul>
        </div>

        <div className="premise-joint" aria-hidden="true">
          <Link2 size={18} strokeWidth={1.8} className="premise-joint-icon" />
        </div>

        <div className="premise-half premise-half-next">
          <span className="premise-badge premise-badge-next">On-chain</span>
          <span className="premise-name premise-name-next">Bitsocial Chain</span>
          <span className="premise-note">The few parts that need one.</span>
          <ul className="premise-traits">
            <li>.bso names</li>
            <li>Tipping and awards</li>
            <li>Community tokens</li>
          </ul>
        </div>

        <p className="premise-caption">The chain is optional. The social network is not.</p>
      </div>
    </Section>
  );
}
