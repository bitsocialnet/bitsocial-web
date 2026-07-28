import { Link2 } from "lucide-react";
import { BITSOCIAL_URL } from "@/lib/site";
import Section from "./Section";

export default function Premise() {
  return (
    <Section
      id="premise"
      eyebrow="The premise"
      question="Why does Bitsocial need its own money?"
      supporting={
        <>
          <a
            className="section-link"
            href={BITSOCIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Bitsocial
          </a>{" "}
          is a peer-to-peer social protocol: no company, no servers, no owner. The money that moves
          through it should be held to the same standard, which is the one thing a cryptocurrency
          can actually do. So BSO is not a partner token or a payments integration bolted on the
          side. It carries the same name, so every community, token and user that joins Bitsocial
          Chain compounds one brand and one economy instead of bootstrapping its own from zero. And
          BSO was never anyone's to begin with: 100% airdropped, no team allocation, no presale.
        </>
      }
      quote="A decentralized social network needs decentralized money."
    >
      <div className="premise">
        <div className="premise-half">
          <span className="premise-badge">The protocol</span>
          <span className="premise-name">Bitsocial</span>
          <span className="premise-note">Peer-to-peer social network</span>
          <ul className="premise-traits">
            <li>No company</li>
            <li>No servers</li>
            <li>No owner</li>
          </ul>
        </div>

        <div className="premise-joint" aria-hidden="true">
          <Link2 size={18} strokeWidth={1.8} className="premise-joint-icon" />
        </div>

        <div className="premise-half premise-half-next">
          <span className="premise-badge premise-badge-next">The money</span>
          <span className="premise-name premise-name-next">BSO</span>
          <span className="premise-note">Decentralized monetary layer</span>
          <ul className="premise-traits">
            <li>No team allocation</li>
            <li>No presale</li>
            <li>No admin key</li>
          </ul>
        </div>

        <p className="premise-caption">Same brand · shared network effect</p>
      </div>
    </Section>
  );
}
