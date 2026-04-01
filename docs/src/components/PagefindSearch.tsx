import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useMemo, useRef } from "react";
import { usePagefindUi } from "../lib/usePagefindUi";
import styles from "./PagefindSearch.module.css";

interface PagefindSearchProps {
  className?: string;
  description?: string;
  heading?: string;
}

export default function PagefindSearch({
  className,
  description = translate({
    id: "docs.pagefindSearch.description",
    message: "Full-text search across the live docs. The index appears after the docs build runs.",
    description: "Default description shown above the full-page docs search widget.",
  }),
  heading = translate({
    id: "docs.pagefindSearch.heading",
    message: "Search the docs",
    description: "Heading shown above the full-page docs search widget.",
  }),
}: PagefindSearchProps) {
  const bundlePath = useBaseUrl("pagefind/");
  const scriptUrl = useBaseUrl("pagefind/pagefind-ui.js");
  const styleUrl = useBaseUrl("pagefind/pagefind-ui.css");
  const containerRef = useRef<HTMLDivElement>(null);
  const uiOptions = useMemo(
    () => ({
      showImages: false,
      showSubResults: true,
      translations: {
        placeholder: translate({
          id: "docs.pagefindSearch.placeholder",
          message: "Search Bitsocial docs",
          description: "Placeholder inside the full-page Pagefind docs search input.",
        }),
        zero_results: translate({
          id: "docs.pagefindSearch.zeroResults",
          message: "No matching docs yet.",
          description: "Message shown when the full-page Pagefind docs search has no matches.",
        }),
        load_more: translate({
          id: "docs.pagefindSearch.loadMore",
          message: "Load more",
          description: "Button label to load more Pagefind search results on the full search page.",
        }),
      },
    }),
    [],
  );
  const { isClient, status } = usePagefindUi({
    bundlePath,
    scriptUrl,
    styleUrl,
    containerRef,
    uiOptions,
  });

  return (
    <section className={clsx(styles.searchShell, className)}>
      <div className={styles.header}>
        <p className="docs-kicker">
          {translate({
            id: "docs.pagefindSearch.kicker",
            message: "Pagefind",
            description: "Kicker label shown above the full-page docs search block.",
          })}
        </p>
        <h2>{heading}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.surface}>
        {isClient ? <div ref={containerRef} /> : null}
        {!isClient || status === "loading" ? (
          <p className={styles.status}>
            {translate({
              id: "docs.pagefindSearch.loading",
              message: "Loading search UI…",
              description: "Status shown while the full-page Pagefind UI is booting.",
            })}
          </p>
        ) : null}
        {status === "error" ? (
          <p className={styles.status}>
            {translate({
              id: "docs.pagefindSearch.error",
              message:
                "Search is unavailable in this dev session until the static docs build completes.",
              description:
                "Status shown on the full-page search screen when Pagefind assets are unavailable in a dev session.",
            })}
          </p>
        ) : null}
      </div>
    </section>
  );
}
