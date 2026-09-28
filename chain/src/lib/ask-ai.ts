import { BSO_TOKEN_ADDRESS } from "@/lib/site";

const SITE_ORIGIN = "https://chain.bitsocial.net" as const;

const ASK_AI_INDEX_URL = `${SITE_ORIGIN}/llms.txt` as const;
const ASK_AI_CORPUS_URL = `${SITE_ORIGIN}/llms-full.txt` as const;

/**
 * Grounding material is linked rather than inlined, since a query string cannot carry the files.
 * The contract address is stated outright: impersonator tokens are the main way a BSO question goes
 * wrong, and an assistant answering from memory has no reliable way to know the real one.
 */
const ASK_AI_PREAMBLE =
  `Answer using ${ASK_AI_INDEX_URL} (and ${ASK_AI_CORPUS_URL} for detail), the official site ` +
  "for BSO and Bitsocial Chain, the proposed Ethereum L2 for Bitsocial, the open-source " +
  `peer-to-peer social network. The only official BSO contract is ${BSO_TOKEN_ADDRESS} on ` +
  "Ethereum. Reply in the language of the question and cite the pages you used.";

/** Long enough for a real multi-sentence question, short enough to stay inside URL length limits. */
const QUESTION_MAX_LENGTH = 700;

/**
 * Mirrors bitsocial.net's ask row. `q` is the parameter chatgpt.com submits and `hints=search`
 * selects Search mode so the linked files are fetched rather than answered from memory. Whether
 * the prompt is sent automatically is decided by ChatGPT from the request's `Sec-Fetch-Site`
 * header, so a click can land on a composed prompt the reader submits themselves.
 */
export function buildAskAiUrl(question: string): string | null {
  const trimmed = question.trim().slice(0, QUESTION_MAX_LENGTH);
  if (!trimmed) return null;

  const url = new URL("https://chatgpt.com/");
  url.searchParams.set("hints", "search");
  url.searchParams.set("q", `${ASK_AI_PREAMBLE}\n\nQuestion: ${trimmed}`);

  return url.toString();
}
