import { Coins, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { ETHERSCAN_TOKEN_URL } from "@/lib/site";
import Locks from "./Locks";
import Section from "./Section";

/**
 * Verbatim from the verified source, including the mint address, so the code shown here matches
 * byte for byte what a reader finds on Etherscan. The brevity is the argument; do not paraphrase.
 */
const CONTRACT_SOURCE = `contract BitsocialToken is ERC20, ERC20Burnable {
    constructor() ERC20("Bitsocial", "BSO") {
        _mint(0x5Bc4FF33f86E0272be53Fa25861294489AB2FE2a, 210_000_000 * 1e18);
    }
}`;

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
      title="Sound money."
      supporting="BSO is a fixed-supply ERC-20: 210 million, no inflation, deflationary by design. The whole supply was airdropped to about 600 people in early 2022, with no presale and nothing carved out ahead of the community. Its contract is immutable and adminless, so the rules are fixed forever."
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

        <Locks locks={LOCKS} />

        <div className="spec-band">
          <span className="spec-band-label">The airdrop</span>
          <p className="spec-band-note">
            About 600 people, in three claim rounds between January and February 2022. They signed
            up through a Telegram bot, referral codes earned larger shares, and every recipient was
            checked by hand so no one could walk away with too much of the supply. No presale, no
            team allocation, nothing sold.
          </p>
        </div>

        <div className="spec-band">
          <span className="spec-band-label">The whole contract</span>
          <pre className="spec-code-block" dir="ltr">
            <code>{CONTRACT_SOURCE}</code>
          </pre>
          <p className="spec-band-note">
            The full supply mints to one address because that is how the migration works: balances
            were mirrored one-for-one onto it and paid back out by transfer, every one of them
            on-chain. Everything else is{" "}
            <a
              className="section-link"
              href="https://github.com/OpenZeppelin/openzeppelin-contracts"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenZeppelin
            </a>
            , unmodified — the most used and most reviewed token code in Ethereum. Nothing custom,
            nothing clever. Read it on{" "}
            <a
              className="section-link"
              href={ETHERSCAN_TOKEN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Etherscan
            </a>
            .
          </p>
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
