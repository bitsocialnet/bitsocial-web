import { useEffect, useState, type RefObject } from "react";

declare global {
  interface Window {
    PagefindUI?: new (options: Record<string, unknown>) => unknown;
  }
}

type PagefindStatus = "loading" | "ready" | "error";

const scriptLoads = new Map<string, Promise<void>>();

/**
 * Loads pagefind-ui.js once for every search box on the page. A failed load removes its tag and is
 * forgotten, so the next search box to mount tries again instead of waiting on a dead tag.
 */
function loadPagefindScript(scriptUrl: string): Promise<void> {
  let load = scriptLoads.get(scriptUrl);
  if (!load) {
    load = fetch(scriptUrl, { method: "HEAD" }).then((response) => {
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || contentType.includes("text/html")) {
        throw new Error(`Pagefind UI is not available at ${scriptUrl}`);
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
          script.remove();
          reject(new Error(`Could not load ${scriptUrl}`));
        };
        document.body.appendChild(script);
      });
    });
    load.catch(() => scriptLoads.delete(scriptUrl));
    scriptLoads.set(scriptUrl, load);
  }

  return load;
}

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

    void loadPagefindScript(scriptUrl).then(mountSearch, fail);

    return () => {
      cancelled = true;
    };
  }, [bundlePath, containerRef, isClient, scriptUrl, styleUrl, uiOptions]);

  return { isClient, status };
}
