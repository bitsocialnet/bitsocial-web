import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { BSO_TOKEN_ADDRESS, UNISWAP_POOL_URL, UNISWAP_TOKEN_URL } from "@/lib/site";
import Section from "./Section";

export default function Verify() {
  const { t } = useTranslation();

  return (
    <Section
      id="verify"
      title={t("sections.verify.title")}
      supporting={t("sections.verify.supporting")}
    >
      <div className="verify">
        <p className="verify-warn">
          <ShieldAlert aria-hidden size={18} strokeWidth={1.85} />
          <span>
            <Trans
              i18nKey="sections.verify.warning"
              values={{ address: BSO_TOKEN_ADDRESS }}
              components={{ contract: <code dir="ltr" /> }}
            />
          </span>
        </p>

        <div className="verify-links">
          <a
            className="verify-link"
            href={UNISWAP_TOKEN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("sections.verify.tradeOnUniswap")}
            <ArrowUpRight aria-hidden size={15} strokeWidth={1.85} />
          </a>
          <a
            className="verify-link"
            href={UNISWAP_POOL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("sections.verify.provideLiquidity")}
            <ArrowUpRight aria-hidden size={15} strokeWidth={1.85} />
          </a>
        </div>

        <p className="verify-note">{t("sections.verify.note")}</p>
      </div>
    </Section>
  );
}
