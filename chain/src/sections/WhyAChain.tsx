import { Link2 } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { BITSOCIAL_URL } from "@/lib/site";
import Section from "./Section";

const supportingComponents = {
  bitsocialLink: (
    <a className="section-link" href={BITSOCIAL_URL} target="_blank" rel="noopener noreferrer" />
  ),
};

export default function WhyAChain() {
  const { t } = useTranslation();

  return (
    <Section
      id="why-a-chain"
      title={t("sections.whyAChain.title")}
      supporting={
        <Trans i18nKey="sections.whyAChain.supporting" components={supportingComponents} />
      }
      quote={t("sections.whyAChain.quote")}
    >
      <div className="premise">
        <div className="glass-card premise-half">
          <span className="premise-badge">{t("sections.whyAChain.peerToPeer.badge")}</span>
          <span className="premise-name">Bitsocial</span>
          <span className="premise-note">{t("sections.whyAChain.peerToPeer.note")}</span>
          <ul className="premise-traits">
            <li>{t("sections.whyAChain.peerToPeer.posts")}</li>
            <li>{t("sections.whyAChain.peerToPeer.profiles")}</li>
            <li>{t("sections.whyAChain.peerToPeer.moderation")}</li>
          </ul>
        </div>

        <div className="premise-joint" aria-hidden="true">
          <Link2 size={18} strokeWidth={1.8} className="premise-joint-icon" />
        </div>

        <div className="glass-card premise-half premise-half-next">
          <span className="premise-badge premise-badge-next">
            {t("sections.whyAChain.onChain.badge")}
          </span>
          <span className="premise-name premise-name-next">Bitsocial Chain</span>
          <span className="premise-note">{t("sections.whyAChain.onChain.note")}</span>
          <ul className="premise-traits">
            <li>{t("sections.whyAChain.onChain.names")}</li>
            <li>{t("sections.whyAChain.onChain.tipping")}</li>
            <li>{t("sections.whyAChain.onChain.tokens")}</li>
          </ul>
        </div>

        <p className="premise-caption">{t("sections.whyAChain.caption")}</p>
      </div>
    </Section>
  );
}
