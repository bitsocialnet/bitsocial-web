const SITE_ORIGIN = "https://bitsocial.net" as const;

export const ASK_AI_INDEX_URL = `${SITE_ORIGIN}/llms.txt` as const;
export const ASK_AI_CORPUS_URL = `${SITE_ORIGIN}/llms-full.txt` as const;

/**
 * The published `llms.txt` is ~9KB and `llms-full.txt` is ~500KB, so the grounding material is
 * linked rather than inlined: a query string cannot carry either file, and pointing at both lets
 * the assistant pull the depth it needs.
 */
const ASK_AI_PREAMBLE =
  `Answer using ${ASK_AI_INDEX_URL} (and ${ASK_AI_CORPUS_URL} for detail), the official docs for ` +
  "Bitsocial, the open-source peer-to-peer social network. Reply in the language of the question " +
  "and cite the pages you used.";

/** Long enough for a real multi-sentence question, short enough to stay inside URL length limits. */
const QUESTION_MAX_LENGTH = 700;

/**
 * `q` is the parameter chatgpt.com submits; `prompt` only prefills the composer. `hints=search`
 * selects Search mode so the linked files actually get fetched rather than answered from memory,
 * and is independent of whether the prompt is sent.
 *
 * Whether it sends is decided server-side, and OpenAI gates that on `Sec-Fetch-Site` as a
 * prompt-injection mitigation (Tenable TRA-2025-22), so a click from this page can land on a
 * composed-but-unsent prompt that the reader submits themselves. No URL flag overrides it, and
 * the header is browser-controlled by design, so there is nothing to fix here.
 */
export function buildAskAiUrl(question: string): string | null {
  const trimmed = question.trim().slice(0, QUESTION_MAX_LENGTH);
  if (!trimmed) return null;

  const url = new URL("https://chatgpt.com/");
  url.searchParams.set("hints", "search");
  url.searchParams.set("q", `${ASK_AI_PREAMBLE}\n\nQuestion: ${trimmed}`);

  return url.toString();
}
