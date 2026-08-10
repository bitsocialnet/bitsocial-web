import { Ban, Coins, Flame, ShieldCheck, Sparkles } from "lucide-react";
import Section from "./Section";

const LOCKS = [
  { label: "No mint", note: "supply can never grow" },
  { label: "No owner", note: "no admin keys, ever" },
  { label: "No pause", note: "transfers can’t be frozen" },
  { label: "No proxy", note: "the code can’t be swapped" },
];

export default function SoundMoney() {
  return (
    <Section
      id="tokenomics"
      eyebrow="The Supply"
      question="No presale. No team allocation. No mint."
      supporting="The whole supply was issued in 2022 and airdropped, with nothing carved out ahead of the community. What the code can do is now fixed: 210 million, and no function that can add more."
    >
      <div className="spec">
        <div className="spec-head">
          <div className="spec-supply">
            <span className="spec-figure">210,000,000</span>
            <span className="spec-cap">BSO max supply · fixed forever</span>
          </div>
          {/* Airdrop first: the artifact has to open on the claim the headline makes. */}
          <ul className="spec-traits">
            <li>
              <Sparkles aria-hidden size={15} strokeWidth={1.8} /> 100% airdropped, no team or
              presale
            </li>
            <li>
              <Coins aria-hidden size={15} strokeWidth={1.8} /> Fixed cap, zero emissions
            </li>
            <li>
              <Flame aria-hidden size={15} strokeWidth={1.8} /> Deflationary: supply only falls
            </li>
          </ul>
        </div>

        <div className="spec-locks">
          {LOCKS.map((lock) => (
            <div key={lock.label} className="lock">
              <Ban aria-hidden size={16} strokeWidth={1.9} className="lock-icon" />
              <span className="lock-text">
                <span className="lock-label">{lock.label}</span>
                <span className="lock-note">{lock.note}</span>
              </span>
            </div>
          ))}
        </div>

        <p className="spec-foot">
          <ShieldCheck aria-hidden size={15} strokeWidth={1.8} />
          Immutable and adminless: there are no admin keys left to hold, so nobody can change it,
          inflate it, or freeze it.
        </p>
      </div>
    </Section>
  );
}
