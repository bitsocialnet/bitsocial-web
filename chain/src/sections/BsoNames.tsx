import { ArrowDown, ArrowRight } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { BSO_RESOLVER_URL } from "@/lib/site";
import Section from "./Section";

export default function BsoNames() {
  const { t } = useTranslation();

  return (
    <Section
      id="bso-names"
      title={t("sections.bsoNames.title")}
      supporting={
        <Trans
          i18nKey="sections.bsoNames.supporting"
          components={{
            resolverLink: (
              <a
                className="section-link"
                href={BSO_RESOLVER_URL}
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          }}
        />
      }
    >
      <div className="bso-map">
        <div className="glass-card bso-card">
          <span className="bso-card-badge">{t("sections.bsoNames.ensBadge")}</span>
          <span className="bso-row-name">mycommunity.eth</span>
          <span className="bso-row-record">
            <span className="bso-row-key">{t("sections.bsoNames.pointsTo")}</span>
            <ArrowRight aria-hidden size={13} strokeWidth={1.85} className="rtl:-scale-x-100" />
            <span className="bso-row-value">{t("sections.bsoNames.communityKey")}</span>
          </span>
        </div>

        <div className="bso-connector" aria-hidden="true">
          <ArrowRight
            size={18}
            strokeWidth={1.8}
            className="bso-connector-arrow bso-connector-arrow-row rtl:-scale-x-100"
          />
          <ArrowDown
            size={18}
            strokeWidth={1.8}
            className="bso-connector-arrow bso-connector-arrow-column"
          />
          <span className="bso-connector-pill">{t("sections.bsoNames.airdropAtLaunch")}</span>
        </div>

        <div className="glass-card bso-card bso-card-next">
          <span className="bso-card-badges">
            <span className="bso-card-badge bso-card-badge-next">
              {t("sections.bsoNames.bsoBadge")}
            </span>
            <span className="bso-card-badge">{t("common.proposed")}</span>
          </span>
          <span className="bso-row-name bso-row-name-next">mycommunity.bso</span>
          <span className="bso-row-record">
            <span className="bso-row-key">{t("sections.bsoNames.owner")}</span>
            <ArrowRight aria-hidden size={13} strokeWidth={1.85} className="rtl:-scale-x-100" />
            <span className="bso-row-value bso-row-value-next">
              {t("sections.bsoNames.sameWallet")}
            </span>
          </span>
        </div>
      </div>
    </Section>
  );
}
