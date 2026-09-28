import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { BSO_TOKEN_ADDRESS, UNISWAP_POOL_URL, UNISWAP_TOKEN_URL } from "@/lib/site";
import Section from "./Section";

export default function Verify() {
  return (
    <Section
      id="verify"
      title="Which address is the real one?"
      supporting="Anyone can create a token and call it BSO, so the contract address is the only thing that tells the real one apart. Match all 42 characters against this site and Bitsocial's official channels before sending anything anywhere."
    >
      <div className="verify">
        <p className="verify-warn">
          <ShieldAlert aria-hidden size={18} strokeWidth={1.85} />
          <span>
            The official BSO contract is <code dir="ltr">{BSO_TOKEN_ADDRESS}</code>. Anything else
            is not BSO, whatever it is called and wherever it is listed.
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
            <ArrowUpRight aria-hidden size={15} strokeWidth={1.85} />
          </a>
          <a
            className="verify-link"
            href={UNISWAP_POOL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Provide liquidity
            <ArrowUpRight aria-hidden size={15} strokeWidth={1.85} />
          </a>
        </div>

        <p className="verify-note">
          Liquidity on Uniswap is provided by independent people, and anyone can add to it. It is
          not a savings account: the value of a liquidity position can fall, including below what
          was put in.
        </p>
      </div>
    </Section>
  );
}
