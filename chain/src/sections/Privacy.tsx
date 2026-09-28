import { Eye, EyeOff } from "lucide-react";
import Section from "./Section";

// Transparent by default, privacy-compatible by design: the split the proof of
// concept's design notes draw between public ownership records and money.
const PUBLIC_ON_PURPOSE = [".bso names and who owns them", "Every rule and every state change"];

const NEVER_REQUIRED = [
  "Your name or profile on a tip",
  "One wallet per person",
  "An official wallet or app",
];

export default function Privacy() {
  return (
    <Section
      id="privacy"
      title="Tipping shouldn't dox you."
      supporting="Bitsocial Chain is public by default, like Ethereum, and .bso names are meant to be seen. Money is different: a tip should never require putting your name, profile or post on-chain beside it, and a fresh wallet should be normal, not suspicious. The chain won't build its own privacy system. It is designed so existing ones can plug in without asking permission: shielded pools, stealth addresses, zero-knowledge proofs."
    >
      <div className="privacy-split">
        <div className="privacy-col">
          <span className="privacy-head">
            <Eye aria-hidden size={16} strokeWidth={1.8} />
            Public on purpose
          </span>
          <ul className="privacy-list">
            {PUBLIC_ON_PURPOSE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="privacy-col privacy-col-private">
          <span className="privacy-head">
            <EyeOff aria-hidden size={16} strokeWidth={1.8} />
            Never required
          </span>
          <ul className="privacy-list">
            {NEVER_REQUIRED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
