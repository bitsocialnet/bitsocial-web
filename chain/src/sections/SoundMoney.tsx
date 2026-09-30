import { Coins, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { ETHERSCAN_TOKEN_URL, RICH_LIST_PATH } from "@/lib/site";
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

const contractNoteComponents = {
  openZeppelinLink: (
    <a
      className="section-link"
      href="https://github.com/OpenZeppelin/openzeppelin-contracts"
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
  etherscanLink: (
    <a
      className="section-link"
      href={ETHERSCAN_TOKEN_URL}
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
};

export default function SoundMoney() {
  const { t } = useTranslation();

  const locks = [
    {
      label: t("sections.tokenomics.locks.noMint.label"),
      note: t("sections.tokenomics.locks.noMint.note"),
    },
    {
      label: t("sections.tokenomics.locks.noOwner.label"),
      note: t("sections.tokenomics.locks.noOwner.note"),
    },
    {
      label: t("sections.tokenomics.locks.noPause.label"),
      note: t("sections.tokenomics.locks.noPause.note"),
    },
    {
      label: t("sections.tokenomics.locks.noProxy.label"),
      note: t("sections.tokenomics.locks.noProxy.note"),
    },
  ];

  return (
    <Section
      id="tokenomics"
      title={t("sections.tokenomics.title")}
      supporting={t("sections.tokenomics.supporting")}
    >
      <div className="glass-card spec">
        <div className="spec-head">
          <div className="spec-supply">
            <span className="spec-figure">210,000,000</span>
            <span className="spec-cap">{t("sections.tokenomics.supply.cap")}</span>
          </div>
          {/* Airdrop first: the artifact has to open on the claim the headline makes. */}
          <ul className="spec-traits">
            <li>
              <Sparkles aria-hidden size={15} strokeWidth={1.8} />{" "}
              {t("sections.tokenomics.traits.airdropped")}
            </li>
            <li>
              <Coins aria-hidden size={15} strokeWidth={1.8} />{" "}
              {t("sections.tokenomics.traits.fixedCap")}
            </li>
            <li>
              <Flame aria-hidden size={15} strokeWidth={1.8} />{" "}
              {t("sections.tokenomics.traits.deflationary")}
            </li>
          </ul>
        </div>

        <Locks locks={locks} />

        <div className="spec-band">
          <span className="spec-band-label">{t("sections.tokenomics.airdrop.label")}</span>
          <p className="spec-band-note">{t("sections.tokenomics.airdrop.note")}</p>
          <p className="spec-band-note">
            <a className="section-link" href={RICH_LIST_PATH}>
              {t("sections.tokenomics.airdrop.richListLink")}
            </a>
          </p>
        </div>

        <div className="spec-band">
          <span className="spec-band-label">{t("sections.tokenomics.contract.label")}</span>
          <pre className="spec-code-block" dir="ltr">
            <code>{CONTRACT_SOURCE}</code>
          </pre>
          <p className="spec-band-note">
            <Trans
              i18nKey="sections.tokenomics.contract.note"
              components={contractNoteComponents}
            />
          </p>
        </div>

        <p className="spec-foot">
          <ShieldCheck aria-hidden size={15} strokeWidth={1.8} />
          {t("sections.tokenomics.foot")}
        </p>
      </div>
    </Section>
  );
}
