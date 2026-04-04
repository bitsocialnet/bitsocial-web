import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";

function joinBasePath(basePath: string, relativePath: string) {
  return `${basePath.replace(/\/+$/, "")}/${relativePath.replace(/^\/+/, "")}`;
}

function getDocsRootBaseUrl(
  localizedBaseUrl: string,
  currentLocale: string,
  defaultLocale: string,
) {
  const normalizedBaseUrl = localizedBaseUrl.endsWith("/")
    ? localizedBaseUrl
    : `${localizedBaseUrl}/`;
  if (currentLocale === defaultLocale) {
    return normalizedBaseUrl;
  }

  const localeSuffix = `/${currentLocale}/`;
  if (!normalizedBaseUrl.endsWith(localeSuffix)) {
    return normalizedBaseUrl;
  }

  return `${normalizedBaseUrl.slice(0, -localeSuffix.length)}/`;
}

export function usePagefindPaths() {
  const localizedBaseUrl = useBaseUrl("/");
  const {
    i18n: { currentLocale, defaultLocale },
  } = useDocusaurusContext();
  const docsRootBaseUrl = getDocsRootBaseUrl(localizedBaseUrl, currentLocale, defaultLocale);

  return {
    bundlePath: joinBasePath(docsRootBaseUrl, "pagefind/"),
    scriptUrl: joinBasePath(docsRootBaseUrl, "pagefind/pagefind-ui.js"),
    styleUrl: joinBasePath(docsRootBaseUrl, "pagefind/pagefind-ui.css"),
  };
}
