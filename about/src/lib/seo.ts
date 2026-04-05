import {
  APPS,
  getAppBySlug,
  getAppPlatforms,
  type AppCategorySlug,
  type AppData,
} from "./apps-data";

const SITE_NAME = "Bitsocial";
const SITE_ORIGIN = "https://bitsocial.net";
const SITE_TITLE = "Bitsocial - Open Source P2P Network for Social Apps";
const SITE_DESCRIPTION =
  "Bitsocial is an open-source peer-to-peer network for social apps, with no servers, no global bans, where users and communities are cryptographic property.";
const DEFAULT_IMAGE_PATH = "/hero-fallback-desktop-light.png";
const DEFAULT_IMAGE_ALT = "Bitsocial network preview";
const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const NOINDEX_ROBOTS =
  "noindex, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const TWITTER_HANDLE = "@bitsocialnet";
const SEO_MARKER_START = "<!-- SEO_START -->";
const SEO_MARKER_END = "<!-- SEO_END -->";

type StructuredDataValue = Record<string, unknown>;

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogType: "website";
  imageUrl: string;
  imageAlt: string;
  structuredData: StructuredDataValue;
}

export interface StaticSeoRoute {
  pathname: string;
  seo: SeoMetadata;
}

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  const normalizedPath = pathname.split(/[?#]/, 1)[0] || "/";
  return normalizedPath.endsWith("/") ? normalizedPath.slice(0, -1) || "/" : normalizedPath;
}

function toAbsoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_ORIGIN}${normalizedPath}`;
}

function truncateDescription(text: string, maxLength = 160) {
  const normalizedText = text.replace(/\s+/g, " ").trim();

  if (normalizedText.length <= maxLength) {
    return normalizedText;
  }

  const clippedText = normalizedText.slice(0, maxLength - 1);
  const lastSpace = clippedText.lastIndexOf(" ");
  const fallbackText = clippedText.slice(0, Math.max(0, maxLength - 2));
  return `${(lastSpace > 80 ? clippedText.slice(0, lastSpace) : fallbackText).trim()}…`;
}

function createStructuredData(graph: StructuredDataValue[]): StructuredDataValue {
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function compactObject<T extends StructuredDataValue>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, entry]) => entry !== undefined && entry !== null && entry !== "",
    ),
  ) as T;
}

function buildOrganizationSchema(): StructuredDataValue {
  return {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    description: SITE_DESCRIPTION,
    logo: toAbsoluteUrl("/logo.png"),
    sameAs: ["https://github.com/bitsocialnet", "https://twitter.com/bitsocialnet"],
  };
}

function buildWebsiteSchema(): StructuredDataValue {
  return {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    url: SITE_ORIGIN,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_ORIGIN}/apps?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>): StructuredDataValue {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildHomeSeoMetadata(search: string): SeoMetadata {
  const hasSearchParams = new URLSearchParams(search).size > 0;

  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    canonicalUrl: toAbsoluteUrl("/"),
    robots: hasSearchParams ? NOINDEX_ROBOTS : DEFAULT_ROBOTS,
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: DEFAULT_IMAGE_ALT,
    structuredData: createStructuredData([buildOrganizationSchema(), buildWebsiteSchema()]),
  };
}

function buildAppsCollectionPageSchema(): StructuredDataValue {
  const appsUrl = toAbsoluteUrl("/apps");

  return {
    "@type": "CollectionPage",
    "@id": `${appsUrl}#webpage`,
    url: appsUrl,
    name: "Bitsocial Apps",
    description:
      "Explore Bitsocial apps, anti-spam modules, and CLI tools across web, Android, iOS, and desktop.",
    isPartOf: {
      "@id": `${SITE_ORIGIN}/#website`,
    },
    about: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: APPS.length,
      itemListElement: APPS.map((app, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: app.name,
        url: toAbsoluteUrl(`/apps/${app.slug}`),
      })),
    },
  };
}

function buildAppsSeoMetadata(search: string): SeoMetadata {
  const hasSearchParams = new URLSearchParams(search).size > 0;

  return {
    title: "Bitsocial Apps | P2P Social Apps and Tools",
    description: truncateDescription(
      "Explore Bitsocial apps, anti-spam modules, and CLI tools, including live web apps, Android APKs, desktop builds, and developer utilities.",
    ),
    canonicalUrl: toAbsoluteUrl("/apps"),
    robots: hasSearchParams ? NOINDEX_ROBOTS : DEFAULT_ROBOTS,
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: "Bitsocial app directory preview",
    structuredData: createStructuredData([
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      buildAppsCollectionPageSchema(),
      buildBreadcrumbSchema([
        { name: SITE_NAME, url: toAbsoluteUrl("/") },
        { name: "Apps", url: toAbsoluteUrl("/apps") },
      ]),
    ]),
  };
}

function buildPrivacySeoMetadata(): SeoMetadata {
  const canonicalUrl = toAbsoluteUrl("/privacy");

  return {
    title: "Bitsocial | Privacy",
    description: truncateDescription(
      "How bitsocial.net handles newsletter signups, privacy-friendly analytics, language preferences, and third-party services across the about site, docs, and stats surfaces.",
    ),
    canonicalUrl,
    robots: DEFAULT_ROBOTS,
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: "Bitsocial privacy notice",
    structuredData: createStructuredData([
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: "Bitsocial | Privacy",
        description:
          "How bitsocial.net handles newsletter signups, privacy-friendly analytics, language preferences, and third-party services.",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
      },
      buildBreadcrumbSchema([
        { name: SITE_NAME, url: toAbsoluteUrl("/") },
        { name: "Privacy", url: canonicalUrl },
      ]),
    ]),
  };
}

function getApplicationCategory(category: AppCategorySlug) {
  switch (category) {
    case "apps":
      return "Social networking";
    case "anti-spam":
      return "Security";
    case "tools":
      return "Developer tool";
  }
}

function getOperatingSystem(app: AppData) {
  const operatingSystems = getAppPlatforms(app).flatMap((platform) => {
    switch (platform) {
      case "web":
        return ["Web Browser"];
      case "android":
        return ["Android"];
      case "ios":
        return ["iOS"];
      case "desktop":
        return ["Windows", "macOS", "Linux"];
    }
  });

  return operatingSystems.length > 0 ? Array.from(new Set(operatingSystems)).join(", ") : undefined;
}

function buildSoftwareApplicationSchema(app: AppData): StructuredDataValue {
  const canonicalUrl = toAbsoluteUrl(`/apps/${app.slug}`);
  const primaryLaunchUrl = app.links.find((link) => link.kind === "launch")?.url;
  const primaryDownloadUrl = app.links.find((link) => link.kind === "download")?.url;
  const sameAs = [primaryLaunchUrl, `https://github.com/${app.githubRepo}`].filter(Boolean);

  return compactObject({
    "@type": "SoftwareApplication",
    "@id": `${canonicalUrl}#app`,
    name: app.name,
    description: app.description,
    url: canonicalUrl,
    image: app.logoSrc ?? toAbsoluteUrl("/logo.png"),
    applicationCategory: getApplicationCategory(app.category),
    operatingSystem: getOperatingSystem(app),
    keywords: app.tags.join(", "),
    author: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
    publisher: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
    codeRepository: `https://github.com/${app.githubRepo}`,
    downloadUrl: primaryDownloadUrl,
    sameAs,
  });
}

function buildAppDetailPageSchema(app: AppData): StructuredDataValue {
  const canonicalUrl = toAbsoluteUrl(`/apps/${app.slug}`);

  return {
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: `${app.name} | Bitsocial`,
    description: app.description,
    isPartOf: {
      "@id": `${SITE_ORIGIN}/#website`,
    },
    about: {
      "@id": `${canonicalUrl}#app`,
    },
    breadcrumb: {
      "@id": `${canonicalUrl}#breadcrumb`,
    },
    primaryImageOfPage: {
      "@id": `${canonicalUrl}#primaryimage`,
    },
  };
}

function buildAppDetailSeoMetadata(search: string, app: AppData): SeoMetadata {
  const hasSearchParams = new URLSearchParams(search).size > 0;
  const canonicalUrl = toAbsoluteUrl(`/apps/${app.slug}`);

  return {
    title: `${app.name} | Bitsocial App Directory`,
    description: truncateDescription(`${app.tagline} ${app.description}`),
    canonicalUrl,
    robots: hasSearchParams ? NOINDEX_ROBOTS : DEFAULT_ROBOTS,
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: `${app.name} on Bitsocial`,
    structuredData: createStructuredData([
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      {
        "@type": "ImageObject",
        "@id": `${canonicalUrl}#primaryimage`,
        url: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
        caption: `${app.name} on Bitsocial`,
      },
      buildAppDetailPageSchema(app),
      {
        ...buildBreadcrumbSchema([
          { name: SITE_NAME, url: toAbsoluteUrl("/") },
          { name: "Apps", url: toAbsoluteUrl("/apps") },
          { name: app.name, url: canonicalUrl },
        ]),
        "@id": `${canonicalUrl}#breadcrumb`,
      },
      buildSoftwareApplicationSchema(app),
    ]),
  };
}

function buildFallbackSeoMetadata(pathname: string): SeoMetadata {
  return {
    title: "Page Not Found | Bitsocial",
    description: SITE_DESCRIPTION,
    canonicalUrl: toAbsoluteUrl(pathname),
    robots: NOINDEX_ROBOTS,
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: DEFAULT_IMAGE_ALT,
    structuredData: createStructuredData([buildOrganizationSchema(), buildWebsiteSchema()]),
  };
}

export function getSeoMetadata(pathname: string, search = ""): SeoMetadata {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === "/") {
    return buildHomeSeoMetadata(search);
  }

  if (normalizedPath === "/apps") {
    return buildAppsSeoMetadata(search);
  }

  if (normalizedPath === "/privacy") {
    return buildPrivacySeoMetadata();
  }

  const appSlugMatch = normalizedPath.match(/^\/apps\/([^/]+)$/);
  if (appSlugMatch?.[1]) {
    const app = getAppBySlug(appSlugMatch[1]);
    if (app) {
      return buildAppDetailSeoMetadata(search, app);
    }
  }

  return buildFallbackSeoMetadata(normalizedPath);
}

export function getStaticSeoRoutes(): StaticSeoRoute[] {
  return ["/", "/apps", "/privacy", ...APPS.map((app) => `/apps/${app.slug}`)].map((pathname) => ({
    pathname,
    seo: getSeoMetadata(pathname),
  }));
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function serializeStructuredData(value: StructuredDataValue) {
  return JSON.stringify(value)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E");
}

export function renderSeoHead(seo: SeoMetadata) {
  const structuredDataJson = serializeStructuredData(seo.structuredData);

  return [
    `    <title data-seo-managed="title">${escapeHtml(seo.title)}</title>`,
    `    <meta data-seo-managed="description" name="description" content="${escapeHtml(seo.description)}" />`,
    `    <meta data-seo-managed="robots" name="robots" content="${escapeHtml(seo.robots)}" />`,
    `    <link data-seo-managed="canonical" rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />`,
    `    <meta data-seo-managed="og:type" property="og:type" content="${escapeHtml(seo.ogType)}" />`,
    `    <meta data-seo-managed="og:site_name" property="og:site_name" content="${SITE_NAME}" />`,
    `    <meta data-seo-managed="og:title" property="og:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta data-seo-managed="og:description" property="og:description" content="${escapeHtml(seo.description)}" />`,
    `    <meta data-seo-managed="og:url" property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />`,
    `    <meta data-seo-managed="og:image" property="og:image" content="${escapeHtml(seo.imageUrl)}" />`,
    `    <meta data-seo-managed="og:image:alt" property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
    `    <meta data-seo-managed="twitter:card" name="twitter:card" content="summary_large_image" />`,
    `    <meta data-seo-managed="twitter:site" name="twitter:site" content="${TWITTER_HANDLE}" />`,
    `    <meta data-seo-managed="twitter:title" name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta data-seo-managed="twitter:description" name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `    <meta data-seo-managed="twitter:image" name="twitter:image" content="${escapeHtml(seo.imageUrl)}" />`,
    `    <meta data-seo-managed="twitter:image:alt" name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
    `    <script data-seo-managed="structured-data" type="application/ld+json">${structuredDataJson}</script>`,
  ].join("\n");
}

export function injectSeoHead(html: string, seo: SeoMetadata) {
  const seoHead = renderSeoHead(seo);
  const replacement = `${SEO_MARKER_START}\n${seoHead}\n    ${SEO_MARKER_END}`;
  return html.replace(new RegExp(`${SEO_MARKER_START}[\\s\\S]*?${SEO_MARKER_END}`), replacement);
}

function renderSitemapEntry(pathname: string) {
  return `  <url>\n    <loc>${toAbsoluteUrl(pathname)}</loc>\n  </url>`;
}

export function renderSitemapXml(routes: StaticSeoRoute[]) {
  const entries = routes.map((route) => renderSitemapEntry(route.pathname)).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
  ].join("\n");
}

export function renderRobotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /stats",
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    `Sitemap: ${SITE_ORIGIN}/docs/sitemap.xml`,
    "",
  ].join("\n");
}
