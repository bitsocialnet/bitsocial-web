import { m, useReducedMotion } from "framer-motion";
import { Network, ShieldCheck, type LucideIcon } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import CardInlineCta, { prominentCtaClassName } from "@/components/card-inline-cta";
import { DOCS_LINKS } from "@/lib/docs-links";

type ReceiptId = "node" | "unstoppable";

type Receipt = {
  id: ReceiptId;
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
};

const RECEIPTS: Receipt[] = [
  {
    id: "node",
    icon: Network,
    titleKey: "browserPeer.cards.node.title",
    descriptionKey: "browserPeer.cards.node.description",
  },
  {
    id: "unstoppable",
    icon: ShieldCheck,
    titleKey: "browserPeer.cards.unstoppable.title",
    descriptionKey: "browserPeer.cards.unstoppable.description",
  },
];

const sourceLinkClassName =
  "font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-blue-glow";

const richTextComponents = {
  strong: <strong className="font-semibold" />,
  helia: (
    <a href="https://helia.io/" target="_blank" rel="noreferrer" className={sourceLinkClassName} />
  ),
  gossipsub: (
    <a
      href="https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545"
      target="_blank"
      rel="noreferrer"
      className={sourceLinkClassName}
    />
  ),
};

function ReceiptCard({ receipt }: { receipt: Receipt }) {
  const { t } = useTranslation();
  const Icon = receipt.icon;

  return (
    <article className="glass-card flex h-full flex-col p-6 md:p-7">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-core/40 bg-blue-core/[0.08] text-blue-glow dark:border-blue-core/55 dark:bg-blue-core/[0.16]"
        aria-hidden
      >
        <Icon className="h-4 w-4" />
      </span>

      <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-foreground/90 md:text-2xl">
        {t(receipt.titleKey)}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground/85">
        <Trans i18nKey={receipt.descriptionKey} components={richTextComponents} />
      </p>
    </article>
  );
}

export default function BrowserPeer() {
  const { t } = useTranslation();
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

  return (
    <section className="px-6 py-24" aria-labelledby="browser-peer-title">
      <div className="mx-auto max-w-6xl">
        <div
          id="browser-peer"
          data-home-section-label
          className="scroll-mt-[99px] md:scroll-mt-[103px]"
        >
          <m.div
            {...reveal(14, 0, 0.5)}
            className="mb-6 block text-center text-xs font-display uppercase tracking-[0.2em] text-muted-foreground/75 dark:text-muted-foreground/70 md:text-sm"
          >
            <a
              href="#browser-peer"
              className="rounded-md transition-[color,box-shadow] duration-300 dark:hover:text-muted-foreground/82"
            >
              {t("browserPeer.sectionLabel")}
            </a>
          </m.div>
        </div>

        <m.h2
          id="browser-peer-title"
          {...reveal(20, 0.1)}
          className="mb-6 text-center text-4xl font-display font-semibold leading-[1.1] text-balance text-muted-foreground md:text-6xl lg:text-7xl"
        >
          {t("browserPeer.title")}
        </m.h2>

        <m.p
          {...reveal(20, 0.2)}
          className="mx-auto mb-12 max-w-xl text-center text-base leading-relaxed text-balance text-muted-foreground md:text-lg"
        >
          {t("browserPeer.supporting")}
        </m.p>

        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2 lg:gap-5">
          {RECEIPTS.map((receipt, index) => (
            <m.div key={receipt.id} {...revealCard(20, 0.3 + index * 0.08)}>
              <ReceiptCard receipt={receipt} />
            </m.div>
          ))}
        </div>

        <m.div
          {...reveal(20, 0.45)}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <CardInlineCta href="/blog" className={`${prominentCtaClassName} w-full sm:w-auto`}>
            {t("browserPeer.liveCta")}
          </CardInlineCta>
          <CardInlineCta
            href={DOCS_LINKS.browserP2P}
            className={`${prominentCtaClassName} w-full sm:w-auto`}
          >
            {t("browserPeer.docsCta")}
          </CardInlineCta>
        </m.div>
      </div>
    </section>
  );
}
