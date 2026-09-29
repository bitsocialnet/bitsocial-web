import { ArrowUp, ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import FaqAsk from "@/components/faq-ask";
import { useSectionFaq } from "@/lib/faq";
import { scrollToMailingListSection } from "@/lib/mailing-list-nav";
import { rememberScrollReturn } from "@/lib/scroll-return";
import { ABOUT_URL } from "@/lib/site";
import { getScrollBehavior } from "@/lib/utils";
import { SectionFrame } from "@/sections/Section";

const MAILING_LIST_ID = "mailing-list";

type FaqRow = {
  id: string;
  question: string;
  /** Names where the answer lives: the destination section's own eyebrow, so the two match. */
  label: string;
  /** Set when the answer is on another site rather than a section of this page. */
  externalHref?: string;
};

/**
 * `preventDefault()` suppresses the browser's native focus move, so without this a keyboard user is
 * scrolled back up the page while focus stays on the row and the next Tab yanks them down again.
 */
function restoreFocusTo(targetId: string) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
}

function handleQuestionClick(event: MouseEvent<HTMLAnchorElement>, targetId: string) {
  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
  event.preventDefault();

  // Every answer sits above this index, so the scroll button should offer the way back here rather
  // than the page bottom while the reader is on the answer.
  rememberScrollReturn();

  // `pushState` rather than assigning the hash: a hash change would also run the deep-link scroll
  // in `useHashScroll` on top of this one, and re-clicking the current row would not scroll at all.
  window.history.pushState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#${targetId}`,
  );
  if (targetId === MAILING_LIST_ID) {
    scrollToMailingListSection();
  } else {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
  }
  restoreFocusTo(targetId);
}

const rowClassName =
  "group flex items-center gap-3.5 rounded-2xl px-4 py-3 md:gap-5 md:px-6 md:py-3.5";

/**
 * Like bitsocial.net's FAQ, nothing expands here: every question links back up to the section that
 * already answers it, so the sections stay the single source of answers.
 */
export default function Faq() {
  const { t } = useTranslation();
  const sectionFaq = useSectionFaq();
  const faqRows: FaqRow[] = [
    ...sectionFaq.map(({ id, eyebrow, question }) => ({ id, label: eyebrow, question })),
    {
      id: "about",
      label: t("faq.rows.about.label"),
      question: t("faq.rows.about.question"),
      externalHref: ABOUT_URL,
    },
    // The newsletter section renders no eyebrow, so this label is its own.
    {
      id: MAILING_LIST_ID,
      label: t("faq.rows.mailingList.label"),
      question: t("faq.rows.mailingList.question"),
    },
  ];

  return (
    <SectionFrame
      id="faq"
      className="section-faq"
      eyebrow={t("faq.eyebrow")}
      title={t("faq.title")}
      supporting={t("faq.supporting")}
    >
      {/* No `overflow-hidden`: the focus ring is an outset box-shadow and would be clipped. */}
      <div className="glass-card mx-auto max-w-3xl px-2 py-1 text-left md:px-3 md:py-2">
        <nav aria-label={t("faq.navLabel")}>
          <ol className="divide-y divide-border/50">
            {faqRows.map((row, index) => {
              const ArrowIcon = row.externalHref ? ArrowUpRight : ArrowUp;
              // The diagonal arrow is what tells the reader this row leaves the page instead of
              // scrolling, so it also leans right on hover rather than straight up.
              const arrowHoverClassName = row.externalHref
                ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                : "group-hover:-translate-y-0.5";
              const rowContent = (
                <>
                  {/* Reading order comes from the <ol>, so the painted ordinal is decoration. Exo's digits
                      are proportional, so a fixed width keeps every question on one left edge. */}
                  <span
                    aria-hidden="true"
                    className="w-5 shrink-0 font-display text-xs font-semibold tabular-nums text-muted-foreground/45 transition-colors duration-300 group-hover:text-blue-glow group-focus-visible:text-blue-glow motion-reduce:transition-none md:text-sm"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-6">
                    <span className="min-w-0 font-display text-sm font-semibold text-balance text-foreground/85 transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground motion-reduce:transition-none md:text-base">
                      {row.question}
                    </span>

                    {/* `whitespace-nowrap` and no fixed width: a wrapped label would strand the
                        vertically centred arrow at the far left of the box. */}
                    <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-display text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground/65 transition-colors duration-300 group-hover:text-blue-glow group-focus-visible:text-blue-glow motion-reduce:transition-none md:text-xs">
                      <ArrowIcon
                        className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${arrowHoverClassName} motion-reduce:transform-none motion-reduce:transition-none`}
                        aria-hidden="true"
                      />
                      {/* One sentence with the label inside, so a language that puts the verb or
                          preposition after the noun can phrase it. The painted label is the same
                          text, hidden from assistive tech so it is not read twice. */}
                      <span className="sr-only">{t("faq.answeredIn", { label: row.label })}</span>
                      <span aria-hidden="true">{row.label}</span>
                    </span>
                  </span>
                </>
              );

              return (
                <li key={row.id}>
                  {row.externalHref ? (
                    <a
                      href={row.externalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={rowClassName}
                    >
                      {rowContent}
                    </a>
                  ) : (
                    <a
                      href={`#${row.id}`}
                      onClick={(event) => handleQuestionClick(event, row.id)}
                      className={rowClassName}
                    >
                      {rowContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Same divider weight as the rows above: the ask row is the list's last entry. */}
        <div className="border-t border-border/50">
          <FaqAsk />
        </div>
      </div>
    </SectionFrame>
  );
}
