/**
 * Every section of the page exists to answer one question a reader actually asks. This list is the
 * single source for that mapping and for page order: sections render in this order, each section's
 * eyebrow comes from here, and the FAQ index at the bottom of the page lists these questions. The
 * section headline is the answer, so the question itself is only shown in the index.
 *
 * `scripts/generate-llms-files.mjs` parses this literal, so keep each entry's keys in this order and
 * its values as plain double-quoted strings.
 */
export const SECTION_FAQ = [
  {
    id: "why-a-chain",
    eyebrow: "Why a Chain",
    question: "Why does a peer-to-peer social network need a chain?",
  },
  {
    id: "why-an-l2",
    eyebrow: "Why an L2",
    question: "Why an Ethereum L2 instead of a new blockchain?",
  },
  {
    id: "tokenomics",
    eyebrow: "Tokenomics",
    question: "What are BSO's tokenomics?",
  },
  {
    id: "the-airdrop",
    eyebrow: "The Airdrop",
    question: "Who got BSO? Was there a presale?",
  },
  {
    id: "community-money",
    eyebrow: "Community Money",
    question: "What would communities do with it?",
  },
  {
    id: "ads-and-tips",
    eyebrow: "Ads and Tips",
    question: "How would communities make money?",
  },
  {
    id: "bso-names",
    eyebrow: "BSO Names",
    question: "What happens to my .bso name?",
  },
  {
    id: "first-users",
    eyebrow: "First Users",
    question: "Who would use it first?",
  },
  {
    id: "possibilities",
    eyebrow: "Possibilities",
    question: "What's planned?",
  },
  {
    id: "verify",
    eyebrow: "Verify",
    question: "How do I get BSO safely?",
  },
] as const;

export type SectionId = (typeof SECTION_FAQ)[number]["id"];

const EYEBROWS = Object.fromEntries(
  SECTION_FAQ.map((entry) => [entry.id, entry.eyebrow]),
) as Record<SectionId, string>;

export function getSectionEyebrow(id: SectionId) {
  return EYEBROWS[id];
}
