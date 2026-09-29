import { Boxes, Layers, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import Section from "./Section";

const COMMUNITY_IDS = ["alpha", "beta", "gamma"];

export default function CommunityMoney() {
  const { t } = useTranslation();

  return (
    <Section
      id="community-money"
      title={t("sections.communityMoney.title")}
      supporting={t("sections.communityMoney.supporting")}
    >
      <div className="stack-tree">
        <div className="tree-tier tree-l3">
          {COMMUNITY_IDS.map((id) => (
            <div key={id} className="tree-node">
              <Users aria-hidden size={16} strokeWidth={1.8} />
              <span className="tree-node-name">{t("sections.communityMoney.communityLayer")}</span>
              <span className="tree-node-meta">{t("sections.communityMoney.ownToken")}</span>
            </div>
          ))}
        </div>

        <div className="tree-flow">
          <span>{t("sections.communityMoney.feesFlow")}</span>
        </div>

        <div className="tree-tier tree-l2">
          <Layers aria-hidden size={18} strokeWidth={1.8} />
          <span className="tree-l2-text">
            <span className="tree-l2-name">Bitsocial Chain</span>
            <span className="tree-l2-meta">{t("sections.communityMoney.chainMeta")}</span>
          </span>
          <span className="tier-badge tier-badge-proposed tree-l2-badge">
            {t("common.proposed")}
          </span>
        </div>

        <div className="tree-flow tree-flow-plain" aria-hidden="true" />

        <div className="tree-tier tree-l1">
          <Boxes aria-hidden size={16} strokeWidth={1.8} />
          <span>{t("sections.communityMoney.ethereumMeta")}</span>
        </div>

        <p className="tree-caption">{t("sections.communityMoney.caption")}</p>
      </div>
    </Section>
  );
}
