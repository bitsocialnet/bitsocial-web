import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import Section from "./Section";

export default function Privacy() {
  const { t } = useTranslation();

  // Transparent by default, privacy-compatible by design: the split the proof of
  // concept's design notes draw between public ownership records and money.
  const publicOnPurpose = [
    { id: "names", label: t("sections.privacy.publicOnPurpose.names") },
    { id: "rules", label: t("sections.privacy.publicOnPurpose.rules") },
  ];

  const neverRequired = [
    { id: "profile", label: t("sections.privacy.neverRequired.profile") },
    { id: "wallet", label: t("sections.privacy.neverRequired.wallet") },
    { id: "app", label: t("sections.privacy.neverRequired.app") },
  ];

  return (
    <Section
      id="privacy"
      title={t("sections.privacy.title")}
      supporting={t("sections.privacy.supporting")}
    >
      <div className="glass-card privacy-split">
        <div className="privacy-col">
          <span className="privacy-head">
            <Eye aria-hidden size={16} strokeWidth={1.8} />
            {t("sections.privacy.publicOnPurpose.heading")}
          </span>
          <ul className="privacy-list">
            {publicOnPurpose.map((item) => (
              <li key={item.id}>{item.label}</li>
            ))}
          </ul>
        </div>

        <div className="privacy-col privacy-col-private">
          <span className="privacy-head">
            <EyeOff aria-hidden size={16} strokeWidth={1.8} />
            {t("sections.privacy.neverRequired.heading")}
          </span>
          <ul className="privacy-list">
            {neverRequired.map((item) => (
              <li key={item.id}>{item.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
