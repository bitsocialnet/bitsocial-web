import { Ban, FlaskConical } from "lucide-react";
import { PROOF_OF_CONCEPT_URL } from "@/lib/site";
import Section from "./Section";

// The chain-level counterpart of the token's locks in #tokenomics, limited to what
// the proof of concept's design commits to: intents are plain L1 transactions to a
// keyless inbox, state is re-derived from Ethereum history by anyone, and any L1
// artifact stays immutable and admin-free.
const LOCKS = [
  { label: "No sequencer needed", note: "Ethereum orders every transaction" },
  { label: "No admin keys", note: "nobody changes the rules for you" },
  { label: "No upgradeable contract", note: "nothing on Ethereum to seize" },
  { label: "No privileged node", note: "anyone can derive the same state" },
];

export default function Unstoppable() {
  return (
    <Section
      id="unstoppable"
      title="Built on Ethereum. Run by nobody."
      supporting="A new blockchain would rebuild the security and developer base Ethereum already has, and would need a new token when BSO is already fully distributed. So Bitsocial Chain is designed as an Ethereum L2 with no operator: every action is a plain Ethereum transaction sent to an address nobody controls, and anyone can run a node that derives the same state from Ethereum's history. There is no company to pressure and no switch to flip."
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
            The proof of concept already derives .bso names this way, on a local dev chain. A
            production launch still needs a proof system, an audit and final economics.{" "}
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
