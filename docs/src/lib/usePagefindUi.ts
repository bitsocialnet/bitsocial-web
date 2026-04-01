import { useEffect, useState, type RefObject } from "react";

declare global {
  interface Window {
    PagefindUI?: new (options: Record<string, unknown>) => unknown;
  }
}

type PagefindStatus = "loading" | "ready" | "error";

interface UsePagefindUiOptions {
  bundlePath: string;
  scriptUrl: string;
  styleUrl: string;
  containerRef: RefObject<HTMLDivElement | null>;
  uiOptions?: Record<string, unknown>;
}

export function usePagefindUi({
  bundlePath,
  scriptUrl,
  styleUrl,
  containerRef,
  uiOptions = {},
}: UsePagefindUiOptions) {
  const [isClient, setIsClient] = useState(false);
  const [status, setStatus] = useState<PagefindStatus>("loading");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    let cancelled = false;
    setStatus("loading");

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
        resetStyles: false,
        ...uiOptions,
      });
      setStatus("ready");
    };

    const fail = () => {
      if (!cancelled) {
        setStatus("error");
      }
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
  }, [bundlePath, containerRef, isClient, scriptUrl, styleUrl, uiOptions]);

  return { isClient, status };
}
