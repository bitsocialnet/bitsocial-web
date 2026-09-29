import { useTranslation } from "react-i18next";

/**
 * Every section of the page exists to answer one question a reader actually asks. This list is the
 * single source for page order: sections render in this order, and the FAQ index at the bottom of
 * the page lists their questions in it. The section headline is the answer, so the question itself
 * is only shown in the index.
 *
 * The eyebrow and question of each entry are translated under `faq.entries.<camelId>`, read by
 * `useSectionCopy`; the English source is `chain/public/translations/en/default.json`.
 */
export const SECTION_IDS = [
  "why-a-chain",
  "tokenomics",
  "unstoppable",
  "bso-names",
  "community-money",
  "privacy",
  "possibilities",
  "verify",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type SectionCopy = { eyebrow: string; question: string };

/** The translated eyebrow and question of every section, keyed by section id. */
export function useSectionCopy(): Record<SectionId, SectionCopy> {
  const { t } = useTranslation();

  return {
    "why-a-chain": {
      eyebrow: t("faq.entries.whyAChain.eyebrow"),
      question: t("faq.entries.whyAChain.question"),
    },
    tokenomics: {
      eyebrow: t("faq.entries.tokenomics.eyebrow"),
      question: t("faq.entries.tokenomics.question"),
    },
    unstoppable: {
      eyebrow: t("faq.entries.unstoppable.eyebrow"),
      question: t("faq.entries.unstoppable.question"),
    },
    "bso-names": {
      eyebrow: t("faq.entries.bsoNames.eyebrow"),
      question: t("faq.entries.bsoNames.question"),
    },
    "community-money": {
      eyebrow: t("faq.entries.communityMoney.eyebrow"),
      question: t("faq.entries.communityMoney.question"),
    },
    privacy: {
      eyebrow: t("faq.entries.privacy.eyebrow"),
      question: t("faq.entries.privacy.question"),
    },
    possibilities: {
      eyebrow: t("faq.entries.possibilities.eyebrow"),
      question: t("faq.entries.possibilities.question"),
    },
    verify: {
      eyebrow: t("faq.entries.verify.eyebrow"),
      question: t("faq.entries.verify.question"),
    },
  };
}

/** The same copy as an ordered list, in page order. */
export function useSectionFaq() {
  const copy = useSectionCopy();

  return SECTION_IDS.map((id) => ({ id, ...copy[id] }));
}
