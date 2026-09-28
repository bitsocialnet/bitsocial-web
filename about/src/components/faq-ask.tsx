import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buildAskAiUrl } from "@/lib/ask-ai";

/**
 * Closing row of the FAQ card: whatever the list above did not answer goes to an assistant primed
 * with the site's own `llms.txt`, so the answer comes from published Bitsocial material rather than
 * whatever the model already believes about the name.
 *
 * Class names stay plain strings rather than `cn()`: tailwind-merge reads `text-micro-fluid` as a
 * text-colour utility and drops it in favour of the later `text-muted-foreground`, which silently
 * pushes the button label back to the inherited 16px.
 */
export default function FaqAsk() {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const askUrl = buildAskAiUrl(question);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!askUrl) return;

    window.open(askUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={handleSubmit}
      // Row geometry is copied from the question rows above so the input reads as the last entry in
      // the same list rather than a separate widget bolted underneath it.
      className="group flex items-center gap-3.5 rounded-2xl px-4 py-3 md:gap-5 md:px-6 md:py-3.5"
    >
      <Sparkles
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground/45 transition-colors duration-300 group-focus-within:text-blue-glow motion-reduce:transition-none md:h-4 md:w-4"
      />

      <input
        type="text"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder={t("faq.ask.placeholder")}
        aria-label={t("faq.ask.label")}
        enterKeyHint="go"
        autoComplete="off"
        // `faq-ask-input` clears the global text-input focus ring, which would otherwise paint a
        // bare box around a borderless field. The caret and the sparkle turning blue carry the
        // focus state instead, as the apps search input does inside its own shell.
        className="faq-ask-input min-w-0 flex-1 bg-transparent font-display text-sm font-semibold text-foreground/85 placeholder:font-semibold placeholder:text-foreground/55 focus:outline-none dark:placeholder:text-foreground/50 md:text-base"
      />

      <button
        type="submit"
        disabled={!askUrl}
        className="text-micro-fluid touch-target inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-blue-core/25 bg-blue-core/[0.07] px-3.5 py-2 font-display uppercase tracking-[0.18em] text-muted-foreground/75 transition-[color,background-color,border-color,opacity] duration-300 hover:border-blue-glow hover:bg-blue-core/[0.13] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-blue-core/25 disabled:hover:bg-blue-core/[0.07] disabled:hover:text-muted-foreground/75 motion-reduce:transition-none dark:border-blue-core/40 dark:bg-blue-core/[0.15] dark:hover:border-blue-glow dark:hover:bg-blue-core/[0.22] dark:disabled:hover:border-blue-core/40 dark:disabled:hover:bg-blue-core/[0.15]"
      >
        <span className="hidden sm:inline">{t("faq.ask.action")}</span>
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="sr-only sm:hidden">{t("faq.ask.action")}</span>
      </button>
    </form>
  );
}
