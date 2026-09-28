import { m, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FaqAsk from "@/components/faq-ask";
import { scrollToHomeSectionHash } from "@/lib/home-section-nav";
import { goToMailingListSection, MAILING_LIST_HASH } from "@/lib/mailing-list-nav";
import { rememberScrollReturn } from "@/lib/scroll-return";

type FaqId =
  | "problem"
  | "core-features"
  | "browser-peer"
  | "decentralized"
  | "arbitrary-challenges"
  | "text-only-protocol"
  | "adoption-thesis"
  | "master-plan"
  | "about"
  | "mailing-list";

/**
 * Static i18n keys (avoid dynamic `t(\`...\${id}\`)` for tooling). Ids are byte-identical to the
 * anchor ids they scroll to, and `sectionLabel` reuses the destination's own eyebrow string so the
 * row label matches what the reader lands on and no new label needs translating. `route` marks the
 * rows whose answer lives on another page instead of a section of this one.
 */
const FAQ_I18N: Record<FaqId, { question: string; sectionLabel: string; route?: string }> = {
  problem: {
    question: "faq.items.problem.question",
    sectionLabel: "problem.sectionLabel",
  },
  "core-features": {
    question: "faq.items.core-features.question",
    sectionLabel: "features.sectionLabel",
  },
  "browser-peer": {
    question: "faq.items.browser-peer.question",
    sectionLabel: "browserPeer.sectionLabel",
  },
  decentralized: {
    question: "faq.items.decentralized.question",
    sectionLabel: "sanctuary.sectionLabel",
  },
  "arbitrary-challenges": {
    question: "faq.items.arbitrary-challenges.question",
    sectionLabel: "arbitraryChallenges.sectionLabel",
  },
  "text-only-protocol": {
    question: "faq.items.text-only-protocol.question",
    sectionLabel: "textOnlyProtocol.sectionLabel",
  },
  "adoption-thesis": {
    question: "faq.items.adoption-thesis.question",
    sectionLabel: "adoptionThesis.sectionLabel",
  },
  "master-plan": {
    question: "faq.items.master-plan.question",
    sectionLabel: "masterPlan.sectionLabel",
  },
  about: {
    question: "faq.items.about.question",
    sectionLabel: "about.sectionLabel",
    route: "/about",
  },
  "mailing-list": {
    question: "faq.items.mailing-list.question",
    // The newsletter section renders no eyebrow, so `mailingList` has no `sectionLabel` to reuse.
    sectionLabel: "nav.newsletter",
  },
};

const FAQ_IDS: FaqId[] = [
  "problem",
  "core-features",
  "browser-peer",
  "decentralized",
  "arbitrary-challenges",
  "text-only-protocol",
  "adoption-thesis",
  "master-plan",
  "about",
  "mailing-list",
];

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

export default function Faq() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const reveal = (y: number, delay = 0, duration = 0.6) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration, delay },
        };
  // Cards reveal with translateY only. A backdrop-filter is suppressed while an
  // ancestor animates opacity, which would blank the glass surface mid-reveal.
  const revealCard = (y: number, delay = 0, duration = 0.6) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { y },
          whileInView: { y: 0 },
          viewport: { once: true },
          transition: { duration, delay },
        };

  const handleQuestionClick = (event: React.MouseEvent<HTMLAnchorElement>, targetId: FaqId) => {
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();

    // Every answer sits above this index, so the scroll button should offer the way back here
    // rather than the page bottom while the reader is on the answer.
    rememberScrollReturn();

    const hash = `#${targetId}`;
    if (hash === MAILING_LIST_HASH) {
      goToMailingListSection(location.pathname, location.hash, navigate);
      restoreFocusTo(targetId);
      return;
    }

    // `pushState` + a direct scroll rather than `navigate()`: the settle effect in `pages/home.tsx`
    // is keyed on `location.hash`, so re-clicking the current row would not scroll at all, and a
    // hash change would run its correction pass on top of this scroll as a visible double jump.
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${hash}`,
    );
    scrollToHomeSectionHash(hash);
    restoreFocusTo(targetId);
  };

  return (
    // Reduced top pad: the mailing list above already carries `py-20 md:py-28`.
    <section
      className="px-[var(--space-page-inline)] pb-[var(--space-page-bottom)] pt-8 md:pt-10"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto max-w-6xl">
        <div id="faq" data-home-section-label className="scroll-mt-[99px] md:scroll-mt-[103px]">
          <m.div
            {...reveal(14, 0, 0.5)}
            className="home-section-eyebrow mb-6 block text-center font-display uppercase tracking-[0.2em] text-muted-foreground/75 dark:text-muted-foreground/70"
          >
            <a
              href="#faq"
              className="rounded-md transition-[color,box-shadow] duration-300 dark:hover:text-muted-foreground/82"
            >
              {t("faq.sectionLabel")}
            </a>
          </m.div>
        </div>

        <m.h2
          id="faq-title"
          {...reveal(20, 0.1)}
          className="home-section-title mb-6 text-center font-display font-semibold text-balance text-muted-foreground"
        >
          {t("faq.title")}
        </m.h2>

        <m.p
          {...reveal(20, 0.2)}
          className="home-section-lede mx-auto mb-12 text-center text-balance text-muted-foreground"
        >
          {t("faq.supporting")}
        </m.p>

        {/* No `overflow-hidden`: the focus ring is an outset box-shadow and would be clipped. */}
        <m.div
          {...revealCard(20, 0.25)}
          className="glass-card mx-auto max-w-3xl px-2 py-1 md:px-3 md:py-2"
        >
          <nav aria-label={t("faq.navLabel")}>
            <ol className="divide-y divide-border/50">
              {FAQ_IDS.map((id, index) => {
                const keys = FAQ_I18N[id];
                // The diagonal arrow is what tells the reader this row leaves the page instead of
                // scrolling, so it also leans right on hover rather than straight up.
                const ArrowIcon = keys.route ? ArrowUpRight : ArrowUp;
                const arrowHoverClassName = keys.route
                  ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  : "group-hover:-translate-y-0.5";
                const rowClassName =
                  "group flex items-center gap-3.5 rounded-2xl px-4 py-3 md:gap-5 md:px-6 md:py-3.5";
                const rowContent = (
                  <>
                    {/* Reading order comes from the <ol>, so the painted ordinal is decoration. */}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-display text-xs font-semibold tabular-nums text-muted-foreground/45 transition-colors duration-300 group-hover:text-blue-glow group-focus-visible:text-blue-glow motion-reduce:transition-none md:text-sm"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-6">
                      <span className="min-w-0 font-display text-sm font-semibold text-balance text-foreground/85 transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground motion-reduce:transition-none md:text-base">
                        {t(keys.question)}
                      </span>

                      {/* `whitespace-nowrap` and no fixed width: a wrapped label would strand the
                          vertically centred arrow at the far left of the box. */}
                      <span className="text-micro-fluid flex shrink-0 items-center gap-1.5 whitespace-nowrap font-display uppercase tracking-[0.18em] text-muted-foreground/65 transition-colors duration-300 group-hover:text-blue-glow group-focus-visible:text-blue-glow motion-reduce:transition-none">
                        <ArrowIcon
                          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${arrowHoverClassName} motion-reduce:transform-none motion-reduce:transition-none`}
                          aria-hidden="true"
                        />
                        <span className="sr-only">{t("faq.answeredIn")} </span>
                        {t(keys.sectionLabel)}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li key={id}>
                    {keys.route ? (
                      <Link to={keys.route} className={rowClassName}>
                        {rowContent}
                      </Link>
                    ) : (
                      <a
                        href={`#${id}`}
                        onClick={(event) => handleQuestionClick(event, id)}
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
        </m.div>
      </div>
    </section>
  );
}
