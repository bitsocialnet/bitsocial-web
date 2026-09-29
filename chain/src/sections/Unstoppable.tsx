import { FlaskConical } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { PROOF_OF_CONCEPT_URL } from "@/lib/site";
import Locks from "./Locks";
import Section from "./Section";

export default function Unstoppable() {
  const { t } = useTranslation();

  // The chain-level counterpart of the token's locks in #tokenomics, limited to what
  // the proof of concept's design commits to: intents are plain L1 transactions to a
  // keyless inbox, state is re-derived from Ethereum history by anyone, and any L1
  // artifact stays immutable and admin-free.
  const locks = [
    {
      label: t("sections.unstoppable.locks.noSequencer.label"),
      note: t("sections.unstoppable.locks.noSequencer.note"),
    },
    {
      label: t("sections.unstoppable.locks.noAdminKeys.label"),
      note: t("sections.unstoppable.locks.noAdminKeys.note"),
    },
    {
      label: t("sections.unstoppable.locks.noUpgradeableContract.label"),
      note: t("sections.unstoppable.locks.noUpgradeableContract.note"),
    },
    {
      label: t("sections.unstoppable.locks.noPrivilegedNode.label"),
      note: t("sections.unstoppable.locks.noPrivilegedNode.note"),
    },
  ];

  return (
    <Section
      id="unstoppable"
      title={t("sections.unstoppable.title")}
      supporting={t("sections.unstoppable.supporting")}
    >
      <div className="spec">
        <Locks locks={locks} />

        <p className="spec-foot">
          <FlaskConical aria-hidden size={15} strokeWidth={1.8} />
          <span>
            <Trans
              i18nKey="sections.unstoppable.proofOfConcept"
              components={{
                proofLink: (
                  <a
                    className="section-link"
                    href={PROOF_OF_CONCEPT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            />
          </span>
        </p>
      </div>
    </Section>
  );
}
