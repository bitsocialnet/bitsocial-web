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
      id="sound-money"
      eyebrow="tokenomics"
      question="Sound money."
      supporting="BSO is a fixed-supply ERC-20: 210 million, no inflation, deflationary by design. Its final contract is immutable and adminless, so the rules are fixed forever."
      quote="There are only two ways to be valuable: make money, or be money."
    >
      <div className="spec">
        <div className="spec-head">
          <div className="spec-supply">
            <span className="spec-figure">210,000,000</span>
            <span className="spec-cap">BSO max supply · fixed forever</span>
          </div>
          <ul className="spec-traits">
            <li>
              <Coins aria-hidden size={15} strokeWidth={1.8} /> Fixed cap, zero emissions
            </li>
            <li>
              <Flame aria-hidden size={15} strokeWidth={1.8} /> Deflationary: supply only falls
            </li>
            <li>
              <Sparkles aria-hidden size={15} strokeWidth={1.8} /> 100% airdropped, no team or
              presale
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
          Immutable and adminless: nobody can change it, inflate it, or freeze it.
        </p>
      </div>
    </Section>
  );
}
