import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BSO_TOKEN_ADDRESS } from "@/lib/site";

/**
 * The contract address is the only thing that distinguishes the real token from an impersonator,
 * so it sits in the hero rather than in a section a reader has to scroll to find.
 */
export default function HeroContractAddress() {
  const { t } = useTranslation();
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
      <span className="hero-ca-label">{t("contract.label")}</span>
      <button
        type="button"
        className={`hero-ca-value${copied ? " is-copied" : ""}`}
        onClick={() => void handleCopyAddress()}
        aria-label={t("contract.copyAriaLabel", { address: BSO_TOKEN_ADDRESS })}
        dir="ltr"
      >
        <span className="hero-ca-text">{BSO_TOKEN_ADDRESS}</span>
        {copied ? (
          <Check aria-hidden size={14} strokeWidth={2} />
        ) : (
          <Copy aria-hidden size={14} strokeWidth={1.9} />
        )}
      </button>
      {/* The icon swap is the visible confirmation; this only exists because that swap
          is not announced to a screen reader. */}
      <span className="sr-only" aria-live="polite">
        {copied ? t("contract.copied") : ""}
      </span>
    </div>
  );
}
