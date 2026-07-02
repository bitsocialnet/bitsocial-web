import { useRef, useState } from "react";
import { ArrowUpRight, ListTree, ShieldAlert } from "lucide-react";
import { BSO_TOKEN_ADDRESS, UNISWAP_TOKEN_URL } from "@/lib/site";
import Section from "./Section";

export default function GetBso() {
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
    <Section
      id="get-bso"
      eyebrow="how to buy"
      question="How to get BSO, safely."
      supporting="The immutable BSO contract is live on Ethereum. Always verify the full address yourself before sending anything."
    >
      <div className="verify">
        <div className="verify-addr">
          <span className="verify-addr-main">
            <span className="verify-addr-label">Official BSO contract</span>
            <span className="verify-addr-value-wrap">
              <button
                type="button"
                className={`verify-addr-value${copied ? " is-copied" : ""}`}
                onClick={() => void handleCopyAddress()}
                aria-label={`Copy BSO contract address ${BSO_TOKEN_ADDRESS}`}
                dir="ltr"
              >
                {BSO_TOKEN_ADDRESS}
              </button>
              {copied ? (
                <span className="verify-addr-copied" aria-live="polite">
                  Copied to clipboard
                </span>
              ) : null}
            </span>
          </span>
          <span className="verify-badge">Live on Ethereum</span>
        </div>

        <p className="verify-warn">
          <ShieldAlert aria-hidden size={18} strokeWidth={1.85} />
          <span>
            Always check the full official address <code dir="ltr">{BSO_TOKEN_ADDRESS}</code> on
            this site and Bitsocial’s official channels, and beware impersonators.
          </span>
        </p>

        <div className="verify-links">
          <a
            className="verify-link"
            href={UNISWAP_TOKEN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Trade on Uniswap
            <ArrowUpRight aria-hidden size={14} strokeWidth={1.85} />
          </a>
          <a className="verify-link" href="#immutable-upgrade">
            <ListTree aria-hidden size={14} strokeWidth={1.85} />
            View the on-chain lineage
          </a>
        </div>
      </div>
    </Section>
  );
}
