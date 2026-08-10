import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { BSO_TOKEN_ADDRESS } from "@/lib/site";

/**
 * The contract address is the only thing that distinguishes the real token from an impersonator,
 * so it sits in the hero rather than in a section a reader has to scroll to find.
 */
export default function HeroContractAddress() {
  const [copied, setCopied] = useState(false);
  const resetCopiedTimeoutRef = useRef<number | undefined>(undefined);

  async function handleCopyAddress() {
    try {
      await navigator.clipboard.writeText(BSO_TOKEN_ADDRESS);
      setCopied(true);
      if (resetCopiedTimeoutRef.current) {
        window.clearTimeout(resetCopiedTimeoutRef.current);
      }
      resetCopiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="hero-ca">
      <span className="hero-ca-label">BSO contract</span>
      <button
        type="button"
        className={`hero-ca-value${copied ? " is-copied" : ""}`}
        onClick={() => void handleCopyAddress()}
        aria-label={`Copy BSO contract address ${BSO_TOKEN_ADDRESS}`}
        dir="ltr"
      >
        <span className="hero-ca-text">{BSO_TOKEN_ADDRESS}</span>
        {copied ? (
          <Check aria-hidden size={14} strokeWidth={2} />
        ) : (
          <Copy aria-hidden size={14} strokeWidth={1.9} />
        )}
      </button>
      <span className="hero-ca-status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
