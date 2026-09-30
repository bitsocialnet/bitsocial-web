import { Trans, useTranslation } from "react-i18next";
import { GEN1_TOKEN_ADDRESS, GEN2_TOKEN_ADDRESS } from "@/lib/rich-list/data";
import { useRichList } from "./data-context";
import { BSO_TOKEN_ADDRESS, CONTRIBUTE_URL } from "@/lib/site";
import { useFormatters } from "./format";
import { AddressLink, RichSection } from "./primitives";

const LIMITS = ["exchangeOnly", "sales", "contracts", "snapshot"] as const;

export default function Method() {
  const { t } = useTranslation();
  const format = useFormatters();
  const { snapshot } = useRichList();

  return (
    <RichSection id="method" title={t("richList.method.title")} lead={t("richList.method.lead")}>
      <div className="rl-method">
        <div>
          <h3 className="rl-subtitle">{t("richList.method.howTitle")}</h3>
          <ol className="rl-facts">
            {(["transfers", "funders", "pattern", "migrations"] as const).map((step) => (
              <li key={step}>
                <p>{t(`richList.method.how.${step}`)}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="rl-subtitle">{t("richList.method.limitsTitle")}</h3>
          <ul className="rl-facts">
            {LIMITS.map((limit) => (
              <li key={limit}>
                <p>{t(`richList.method.limits.${limit}`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dl className="rl-contracts">
        <div>
          <dt>{t("richList.method.contracts.gen1")}</dt>
          <dd>
            <AddressLink address={GEN1_TOKEN_ADDRESS} chain="avalanche" full />
          </dd>
        </div>
        <div>
          <dt>{t("richList.method.contracts.gen2")}</dt>
          <dd>
            <a
              className="rl-address"
              href={`https://etherscan.io/token/${GEN2_TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              translate="no"
              dir="ltr"
            >
              {GEN2_TOKEN_ADDRESS}
            </a>
          </dd>
        </div>
        <div>
          <dt>{t("richList.method.contracts.gen3")}</dt>
          <dd>
            <a
              className="rl-address"
              href={`https://etherscan.io/token/${BSO_TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              translate="no"
              dir="ltr"
            >
              {BSO_TOKEN_ADDRESS}
            </a>
          </dd>
        </div>
      </dl>

      <p className="rl-note">
        <Trans
          i18nKey="richList.method.snapshot"
          values={{ date: format.day(snapshot.generatedAt), count: snapshot.holderCount }}
          components={{
            contributeLink: (
              <a
                className="rl-link"
                href={CONTRIBUTE_URL}
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          }}
        />
      </p>
    </RichSection>
  );
}
