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
      title="No operator, no off switch."
      supporting="Every action on Bitsocial Chain is a plain Ethereum transaction, sent to an address nobody controls. Nodes read Ethereum's history and apply the same open rules, so every node arrives at the same state, and anyone could rebuild it from Ethereum alone. No company sits in the middle to pressure, and there is nothing to switch off."
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
