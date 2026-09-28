import { Ban, FlaskConical } from "lucide-react";
import { PROOF_OF_CONCEPT_URL } from "@/lib/site";
import Section from "./Section";

// The chain-level counterpart of the token's locks in #tokenomics, taken from the
// proof of concept's design: intents are plain L1 transactions to a keyless inbox
// address, and state is re-derived from Ethereum history by anyone.
const LOCKS = [
  { label: "No sequencer", note: "Ethereum orders every transaction" },
  { label: "No admin keys", note: "nobody changes the rules for you" },
  { label: "No L1 contract", note: "nothing to upgrade or seize" },
  { label: "No privileged node", note: "anyone can derive the same state" },
];

export default function Unstoppable() {
  return (
    <Section
      id="unstoppable"
      title="Built on Ethereum. Run by nobody."
      supporting="A new blockchain would rebuild the security and developer base Ethereum already has, and would need a new token when BSO is already fully distributed. So Bitsocial Chain is an Ethereum L2 with no operator: every action is a plain Ethereum transaction sent to an address nobody controls, and every node derives the same state from Ethereum's history. Nothing sits in the middle to pressure or switch off."
    >
      <div className="spec">
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
          <FlaskConical aria-hidden size={15} strokeWidth={1.8} />
          <span>
            The proof of concept already derives .bso names this way. A production launch still
            needs a proof system, an audit and final economics.{" "}
            <a
              className="section-link"
              href={PROOF_OF_CONCEPT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the proof of concept
            </a>
            .
          </span>
        </p>
      </div>
    </Section>
  );
}
