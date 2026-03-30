import clsx from "clsx";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useEffect, useRef, useState } from "react";
import styles from "./PagefindSearch.module.css";

declare global {
  interface Window {
    PagefindUI?: new (options: Record<string, unknown>) => unknown;
  }
}

interface PagefindSearchProps {
  className?: string;
  description?: string;
  heading?: string;
}

export default function PagefindSearch({
  className,
  description = "Full-text search across the live docs. The index appears after the docs build runs.",
  heading = "Search the docs",
}: PagefindSearchProps) {
  const bundlePath = useBaseUrl("pagefind/");
  const scriptUrl = useBaseUrl("pagefind/pagefind-ui.js");
  const styleUrl = useBaseUrl("pagefind/pagefind-ui.css");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    let cancelled = false;

    const ensureStyles = () => {
      if (document.querySelector(`link[href="${styleUrl}"]`)) {
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = styleUrl;
      document.head.appendChild(link);
    };

    const mountSearch = () => {
      if (cancelled || !containerRef.current || !window.PagefindUI) {
        return;
      }

      containerRef.current.replaceChildren();
      new window.PagefindUI({
        element: containerRef.current,
        bundlePath,
        showImages: false,
        showSubResults: true,
        resetStyles: false,
        translations: {
          placeholder: "Search Bitsocial docs",
          zero_results: "No matching docs yet.",
          load_more: "Load more",
        },
      });
      setStatus("ready");
    };

    const fail = () => {
      if (cancelled) {
        return;
      }

      setStatus("error");
    };

    ensureStyles();

    if (window.PagefindUI) {
      mountSearch();
      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);

    if (existingScript) {
      existingScript.addEventListener("load", mountSearch);
      existingScript.addEventListener("error", fail);
      return () => {
        cancelled = true;
        existingScript.removeEventListener("load", mountSearch);
        existingScript.removeEventListener("error", fail);
      };
    }

    let script: HTMLScriptElement | null = null;

    void fetch(scriptUrl, { method: "HEAD" })
      .then((response) => {
        const contentType = response.headers.get("content-type") ?? "";
        if (!response.ok || contentType.includes("text/html")) {
          fail();
          return;
        }

        script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.onload = mountSearch;
        script.onerror = fail;
        document.body.appendChild(script);
      })
      .catch(fail);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", mountSearch);
      script?.removeEventListener("error", fail);
    };
  }, [bundlePath, isClient, scriptUrl, styleUrl]);

  return (
    <section className={clsx(styles.searchShell, className)}>
      <div className={styles.header}>
        <p className="docs-kicker">Pagefind</p>
        <h2>{heading}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.surface}>
        {isClient ? <div ref={containerRef} /> : null}
        {!isClient || status === "loading" ? (
          <p className={styles.status}>Loading search UI…</p>
        ) : null}
        {status === "error" ? (
          <p className={styles.status}>
            Search is unavailable in this dev session until the static docs build completes.
          </p>
        ) : null}
      </div>
    </section>
  );
}
