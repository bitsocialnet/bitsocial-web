import type { TFunction } from "i18next";
import {
  APPS,
  getAppBySlug,
  getAppDescription,
  getAppPlatforms,
  getAppTagline,
  getPrimaryCategorySlug,
  type AppCategorySlug,
  type AppData,
} from "./apps-data";
import { DOCS_LINKS, DOCS_SITE_URL } from "./docs-links";
import {
  DEFAULT_LANGUAGE_CODE,
  LANGUAGE_QUERY_PARAM,
  SUPPORTED_LANGUAGE_CODES,
  resolveSupportedLanguageCode,
  type SupportedLanguageCode,
} from "./locales";

const SITE_NAME = "Bitsocial";
const SITE_ORIGIN = "https://bitsocial.net";
const SITE_TITLE = "Bitsocial - Open Source P2P Network for Social Apps";
const SITE_DESCRIPTION =
  "Bitsocial is an open-source IPFS-backed peer-to-peer network for social apps, with no servers, no global bans, where users and communities are cryptographic property.";
const SITE_DISAMBIGUATING_DESCRIPTION =
  "Bitsocial is the open-source peer-to-peer social-app network at bitsocial.net, not the similarly named WordPress social media scheduler plugin.";
const SITE_KEYWORDS = [
  "Bitsocial",
  "peer-to-peer social network",
  "IPFS social apps",
  "decentralized social apps",
  "serverless social network",
  "local moderation",
  "anti-spam challenges",
];
const DEFAULT_IMAGE_PATH = "/hero-fallback-desktop-light.png";
const DEFAULT_IMAGE_ALT = "Bitsocial network preview";
const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const NOINDEX_ROBOTS =
  "noindex, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const TWITTER_HANDLE = "@bitsocialnet";
const SEO_MARKER_START = "<!-- SEO_START -->";
const SEO_MARKER_END = "<!-- SEO_END -->";
const ROOT_MARKER_REGEX = /<div id="root"><\/div>/;

const HOME_SEO_FEATURES = [
  {
    title: "IPFS-backed peer-to-peer communities",
    description:
      "Bitsocial communities use IPFS/libp2p primitives for public-key-addressed records, gossipsub pubsub, and content transfer instead of company-controlled servers.",
    href: DOCS_LINKS.peerToPeerProtocol,
    cta: "Read the peer-to-peer protocol",
  },
  {
    title: "Local moderation instead of global bans",
    description:
      "Community owners decide how their own spaces work, without a protocol-wide super-admin who can erase every identity or forum at once.",
    href: DOCS_LINKS.localModeration,
    cta: "Read the moderation notes",
  },
  {
    title: "User-owned identities and communities",
    description:
      "Profiles and communities are controlled by keys, so ownership behaves more like property than a revocable account on a company platform.",
    href: DOCS_LINKS.identityAndOwnership,
    cta: "Read the ownership notes",
  },
  {
    title: "Apps can share one open network",
    description:
      "Different Bitsocial apps can compete on product quality while sharing the same communities, identities, and underlying network.",
    href: "/projects?category=apps",
    cta: "Explore Bitsocial apps",
  },
] as const;

// Google documents hreflang values as ISO 639-1; Filipino only has a three-letter code.
const HREFLANG_OVERRIDES: Partial<Record<SupportedLanguageCode, string>> = {
  fil: "tl",
};

type StructuredDataValue = Record<string, unknown>;

export interface SeoAlternateLink {
  hreflang: string;
  href: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  alternates: SeoAlternateLink[];
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

// Each language is indexable at `?lang=<code>`; English stays on the bare path, which is also
// the locale-adaptive x-default that crawlers without Accept-Language receive in English.
function toLocalizedUrl(pathname: string, language: SupportedLanguageCode) {
  const url = toAbsoluteUrl(pathname);
  return language === DEFAULT_LANGUAGE_CODE ? url : `${url}?${LANGUAGE_QUERY_PARAM}=${language}`;
}

function buildAlternateLinks(pathname: string): SeoAlternateLink[] {
  return [
    ...SUPPORTED_LANGUAGE_CODES.map((language) => ({
      hreflang: HREFLANG_OVERRIDES[language] ?? language,
      href: toLocalizedUrl(pathname, language),
    })),
    { hreflang: "x-default", href: toAbsoluteUrl(pathname) },
  ];
}

interface SeoUrlState {
  language: SupportedLanguageCode;
  hasNonLanguageParams: boolean;
}

function getSeoUrlState(search: string): SeoUrlState {
  const searchParams = new URLSearchParams(search);
  // Repeated `lang` values are ambiguous, so they stay as extra params and the URL is noindex.
  const languageValues = searchParams.getAll(LANGUAGE_QUERY_PARAM);
  const language =
    languageValues.length === 1 ? resolveSupportedLanguageCode(languageValues[0]) : null;
  if (language) {
    searchParams.delete(LANGUAGE_QUERY_PARAM);
  }

  return {
    language: language ?? DEFAULT_LANGUAGE_CODE,
    hasNonLanguageParams: searchParams.size > 0,
  };
}

function buildIndexingMetadata(pathname: string, urlState: SeoUrlState) {
  return {
    canonicalUrl: toLocalizedUrl(pathname, urlState.language),
    alternates: urlState.hasNonLanguageParams ? [] : buildAlternateLinks(pathname),
    robots: urlState.hasNonLanguageParams ? NOINDEX_ROBOTS : DEFAULT_ROBOTS,
  };
}

function translateSeoValue(
  t: TFunction | undefined,
  key: string,
  fallback: string,
  values: Record<string, string> = {},
) {
  const translatedValue = t?.(key, { defaultValue: fallback, ...values });
  if (typeof translatedValue === "string") {
    return translatedValue;
  }

  return Object.entries(values).reduce(
    (text, [name, value]) => text.split(`{{${name}}}`).join(value),
    fallback,
  );
}

function stripMarkup(text: string) {
  return text.replace(/<[^>]+>/g, "");
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

function buildPrimaryCitationUrls() {
  return [
    DOCS_LINKS.peerToPeerProtocol,
    DOCS_LINKS.customChallenges,
    DOCS_LINKS.localModeration,
    DOCS_LINKS.identityAndOwnership,
    "https://github.com/bitsocialnet",
  ];
}

function buildOrganizationSchema(): StructuredDataValue {
  return {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    legalName: "Bitsocial Forge, Inc.",
    alternateName: "Bitsocial Protocol",
    url: SITE_ORIGIN,
    description: SITE_DESCRIPTION,
    disambiguatingDescription: SITE_DISAMBIGUATING_DESCRIPTION,
    foundingDate: "2022",
    image: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    logo: toAbsoluteUrl("/logo.png"),
    slogan: "Decentralize all social media",
    knowsAbout: SITE_KEYWORDS,
    sameAs: [
      "https://github.com/bitsocialnet",
      "https://twitter.com/bitsocialnet",
      "https://bsky.app/profile/bitsocialnet.bsky.social",
    ],
  };
}

function buildWebsiteSchema(): StructuredDataValue {
  return {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    url: SITE_ORIGIN,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    disambiguatingDescription: SITE_DISAMBIGUATING_DESCRIPTION,
    keywords: SITE_KEYWORDS.join(", "),
    publisher: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_ORIGIN}/projects?q={search_term_string}`,
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

function buildHomeItemListSchema(): StructuredDataValue {
  const featuredApps = APPS.filter((app) => app.featured).slice(0, 4);

  return {
    "@type": "ItemList",
    "@id": `${SITE_ORIGIN}/#featured-apps`,
    name: "Featured Bitsocial apps",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: featuredApps.length,
    itemListElement: featuredApps.map((app, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: app.name,
      url: toAbsoluteUrl(`/projects/${app.slug}`),
      description: app.description,
    })),
  };
}

function buildHomeWebPageSchema(): StructuredDataValue {
  return {
    "@type": "WebPage",
    "@id": `${SITE_ORIGIN}/#webpage`,
    url: SITE_ORIGIN,
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    disambiguatingDescription: SITE_DISAMBIGUATING_DESCRIPTION,
    keywords: SITE_KEYWORDS.join(", "),
    citation: buildPrimaryCitationUrls(),
    isPartOf: {
      "@id": `${SITE_ORIGIN}/#website`,
    },
    about: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
    mainEntity: {
      "@id": `${SITE_ORIGIN}/#featured-apps`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
      caption: DEFAULT_IMAGE_ALT,
    },
  };
}

function buildHomeSeoMetadata(urlState: SeoUrlState, t?: TFunction): SeoMetadata {
  return {
    title: translateSeoValue(t, "seo.home.title", SITE_TITLE),
    description: translateSeoValue(t, "seo.home.description", SITE_DESCRIPTION),
    ...buildIndexingMetadata("/", urlState),
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: DEFAULT_IMAGE_ALT,
    structuredData: createStructuredData([
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      buildHomeItemListSchema(),
      buildHomeWebPageSchema(),
    ]),
  };
}

function buildProjectsCollectionPageSchema(): StructuredDataValue {
  const projectsUrl = toAbsoluteUrl("/projects");

  return {
    "@type": "CollectionPage",
    "@id": `${projectsUrl}#webpage`,
    url: projectsUrl,
    name: "Bitsocial Projects",
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
        url: toAbsoluteUrl(`/projects/${app.slug}`),
      })),
    },
  };
}

function buildProjectsSeoMetadata(urlState: SeoUrlState, t?: TFunction): SeoMetadata {
  return {
    title: translateSeoValue(
      t,
      "seo.projects.title",
      "Bitsocial Projects | P2P Social Apps and Tools",
    ),
    description: truncateDescription(
      translateSeoValue(
        t,
        "seo.projects.description",
        "Explore Bitsocial apps, anti-spam modules, and CLI tools, including live web apps, Android APKs, desktop builds, and developer utilities.",
      ),
    ),
    ...buildIndexingMetadata("/projects", urlState),
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: "Bitsocial project directory preview",
    structuredData: createStructuredData([
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      buildProjectsCollectionPageSchema(),
      buildBreadcrumbSchema([
        { name: SITE_NAME, url: toAbsoluteUrl("/") },
        { name: "Projects", url: toAbsoluteUrl("/projects") },
      ]),
    ]),
  };
}

function buildPrivacySeoMetadata(urlState: SeoUrlState, t?: TFunction): SeoMetadata {
  const canonicalUrl = toAbsoluteUrl("/privacy");

  return {
    title: translateSeoValue(t, "seo.privacy.title", "Bitsocial | Privacy"),
    description: truncateDescription(
      translateSeoValue(
        t,
        "seo.privacy.description",
        "How bitsocial.net handles newsletter signups, privacy-friendly analytics, language preferences, and third-party services across the about site, docs, and stats surfaces.",
      ),
    ),
    ...buildIndexingMetadata("/privacy", urlState),
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

function buildAboutSeoMetadata(urlState: SeoUrlState, t?: TFunction): SeoMetadata {
  const canonicalUrl = toAbsoluteUrl("/about");

  return {
    title: translateSeoValue(t, "seo.about.title", "About Bitsocial | Core Team"),
    description: truncateDescription(
      translateSeoValue(
        t,
        "seo.about.description",
        "Meet the Bitsocial core team and learn about the peer-to-peer social protocol they have been building since early 2022.",
      ),
    ),
    ...buildIndexingMetadata("/about", urlState),
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: "Bitsocial core team page",
    structuredData: createStructuredData([
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      {
        "@type": "AboutPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: "About Bitsocial | Core Team",
        description:
          "Meet the Bitsocial core team and learn about the peer-to-peer social protocol they have been building since early 2022.",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        about: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
      },
      buildBreadcrumbSchema([
        { name: SITE_NAME, url: toAbsoluteUrl("/") },
        { name: "About", url: canonicalUrl },
      ]),
    ]),
  };
}

function buildBlogSeoMetadata(urlState: SeoUrlState, t?: TFunction): SeoMetadata {
  const canonicalUrl = toAbsoluteUrl("/blog");

  return {
    title: translateSeoValue(
      t,
      "seo.blog.title",
      "Bitsocial Blog | Updates, Releases, and Tutorials",
    ),
    description: truncateDescription(
      translateSeoValue(
        t,
        "seo.blog.description",
        "The official Bitsocial blog from the core devs, published as an unstoppable peer-to-peer feed. Read product updates, release notes, and tutorials from any Bitsocial app.",
      ),
    ),
    ...buildIndexingMetadata("/blog", urlState),
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: "Bitsocial blog preview",
    structuredData: createStructuredData([
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      {
        "@type": "Blog",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: "Bitsocial Blog",
        description:
          "The official Bitsocial blog from the core devs, published as an unstoppable peer-to-peer feed.",
        isPartOf: {
          "@id": `${SITE_ORIGIN}/#website`,
        },
        publisher: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
      },
      buildBreadcrumbSchema([
        { name: SITE_NAME, url: toAbsoluteUrl("/") },
        { name: "Blog", url: canonicalUrl },
      ]),
    ]),
  };
}

function getApplicationCategory(category: AppCategorySlug) {
  switch (category) {
    case "apps":
      return "Social networking";
    case "identity":
      return "Security";
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
  const canonicalUrl = toAbsoluteUrl(`/projects/${app.slug}`);
  const primaryLaunchUrl = app.links.find((link) => link.kind === "launch")?.url;
  const primaryDownloadUrl = app.links.find((link) => link.kind === "download")?.url;
  const sameAs = [primaryLaunchUrl, `https://github.com/${app.githubRepo}`].filter(Boolean);

  return compactObject({
    "@type": "SoftwareApplication",
    "@id": `${canonicalUrl}#app`,
    name: app.name,
    description: app.description,
    url: canonicalUrl,
    image: toAbsoluteUrl(app.logoSrc ?? "/logo.png"),
    applicationCategory: getApplicationCategory(getPrimaryCategorySlug(app)),
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
  const canonicalUrl = toAbsoluteUrl(`/projects/${app.slug}`);

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

function buildAppDetailSeoMetadata(
  urlState: SeoUrlState,
  app: AppData,
  t?: TFunction,
): SeoMetadata {
  const pathname = `/projects/${app.slug}`;
  const canonicalUrl = toAbsoluteUrl(pathname);
  const tagline = t ? getAppTagline(app, t) : app.tagline;
  const description = t ? getAppDescription(app, t) : app.description;

  return {
    title: translateSeoValue(t, "seo.appDetail.title", "{{name}} | Bitsocial Project Directory", {
      name: app.name,
    }),
    description: truncateDescription(stripMarkup(`${tagline} ${description}`)),
    ...buildIndexingMetadata(pathname, urlState),
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
          { name: "Projects", url: toAbsoluteUrl("/projects") },
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
    alternates: [],
    robots: NOINDEX_ROBOTS,
    ogType: "website",
    imageUrl: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    imageAlt: DEFAULT_IMAGE_ALT,
    structuredData: createStructuredData([buildOrganizationSchema(), buildWebsiteSchema()]),
  };
}

function resolveKnownSeoMetadata(
  normalizedPath: string,
  search: string,
  t?: TFunction,
): SeoMetadata | null {
  const urlState = getSeoUrlState(search);

  if (normalizedPath === "/") {
    return buildHomeSeoMetadata(urlState, t);
  }

  if (normalizedPath === "/projects") {
    return buildProjectsSeoMetadata(urlState, t);
  }

  if (normalizedPath === "/privacy") {
    return buildPrivacySeoMetadata(urlState, t);
  }

  if (normalizedPath === "/about") {
    return buildAboutSeoMetadata(urlState, t);
  }

  if (normalizedPath === "/blog") {
    return buildBlogSeoMetadata(urlState, t);
  }

  const appSlugMatch = normalizedPath.match(/^\/projects\/([^/]+)$/);
  if (appSlugMatch?.[1]) {
    const app = getAppBySlug(appSlugMatch[1]);
    if (app) {
      return buildAppDetailSeoMetadata(urlState, app, t);
    }
  }

  return null;
}

// `t` should be bound to the rendered locale so the title and description match the page body;
// canonical and hreflang URLs come from the `lang` query parameter alone.
export function getSeoMetadata(pathname: string, search = "", t?: TFunction): SeoMetadata {
  const normalizedPath = normalizePathname(pathname);

  return (
    resolveKnownSeoMetadata(normalizedPath, search, t) ?? buildFallbackSeoMetadata(normalizedPath)
  );
}

// Unknown paths must answer 404 rather than 200, otherwise every probed URL becomes a
// crawlable soft 404 that search engines file as an indexable page.
export function isKnownRoute(pathname: string): boolean {
  return resolveKnownSeoMetadata(normalizePathname(pathname), "") !== null;
}

export function getStaticSeoRoutes(): StaticSeoRoute[] {
  return [
    "/",
    "/projects",
    "/privacy",
    "/about",
    "/blog",
    ...APPS.map((app) => `/projects/${app.slug}`),
  ].flatMap((pathname) =>
    SUPPORTED_LANGUAGE_CODES.map((language) => ({
      pathname,
      seo: getSeoMetadata(
        pathname,
        language === DEFAULT_LANGUAGE_CODE ? "" : `?${LANGUAGE_QUERY_PARAM}=${language}`,
      ),
    })),
  );
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
    ...seo.alternates.map(
      (alternate) =>
        `    <link data-seo-managed="alternate" rel="alternate" hreflang="${escapeHtml(alternate.hreflang)}" href="${escapeHtml(alternate.href)}" />`,
    ),
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

function renderStaticShell(content: string) {
  return [
    '<div data-seo-prerender="true" class="min-h-screen bg-background text-foreground">',
    '  <div class="mx-auto max-w-6xl px-6 pb-16 pt-8 md:px-8">',
    '    <nav aria-label="Primary" class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">',
    '      <a href="/" class="font-display font-semibold text-foreground transition-colors hover:text-blue-glow">Bitsocial</a>',
    '      <a href="/projects?category=apps" class="transition-colors hover:text-foreground">Apps</a>',
    '      <a href="' +
      DOCS_LINKS.home +
      '" class="transition-colors hover:text-foreground">Docs</a>',
    '      <a href="https://github.com/bitsocialnet" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-foreground">Source code</a>',
    "    </nav>",
    content,
    "  </div>",
    "</div>",
  ].join("\n");
}

function renderHomeStaticBody() {
  const featuredApps = APPS.filter((app) => app.featured).slice(0, 4);
  const featuresMarkup = HOME_SEO_FEATURES.map(
    (
      feature,
    ) => `            <li class="rounded-[1.5rem] border border-border/60 bg-background/80 p-5">
              <h2 class="text-xl font-display font-semibold text-foreground">${escapeHtml(feature.title)}</h2>
              <p class="mt-3 leading-7 text-muted-foreground">${escapeHtml(feature.description)}</p>
              <a href="${escapeHtml(feature.href)}" class="mt-4 inline-flex text-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-blue-glow">${escapeHtml(feature.cta)}</a>
            </li>`,
  ).join("\n");
  const featuredAppsMarkup = featuredApps
    .map(
      (
        app,
      ) => `            <li class="rounded-[1.5rem] border border-border/60 bg-background/80 p-5">
              <h3 class="text-lg font-display font-semibold text-foreground">
                <a href="/projects/${escapeHtml(app.slug)}" class="transition-colors hover:text-blue-glow">${escapeHtml(app.name)}</a>
              </h3>
              <p class="mt-2 text-sm font-medium text-foreground/70">${escapeHtml(app.tagline)}</p>
              <p class="mt-3 leading-7 text-muted-foreground">${escapeHtml(app.description)}</p>
            </li>`,
    )
    .join("\n");

  return renderStaticShell(`
    <main class="pt-14">
      <section class="max-w-4xl">
        <p class="text-xs font-display uppercase tracking-[0.24em] text-foreground/45">${SITE_NAME}</p>
        <h1 class="mt-4 max-w-4xl text-4xl font-display font-semibold leading-[1.05] text-balance text-foreground md:text-6xl">${escapeHtml(SITE_DESCRIPTION)}</h1>
        <p class="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">${escapeHtml(SITE_DESCRIPTION)}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="/projects?category=apps" class="rounded-full border border-border/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-blue-glow hover:text-blue-glow">Explore Bitsocial apps</a>
          <a href="${escapeHtml(DOCS_LINKS.home)}" class="rounded-full border border-border/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-blue-glow hover:text-blue-glow">Read the docs</a>
          <a href="https://github.com/bitsocialnet" target="_blank" rel="noopener noreferrer" class="rounded-full border border-border/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-blue-glow hover:text-blue-glow">Browse the source code</a>
        </div>
      </section>

      <section class="mt-14">
        <h2 class="text-2xl font-display font-semibold text-foreground md:text-3xl">Why developers and communities use Bitsocial</h2>
        <ul class="mt-6 grid gap-4 md:grid-cols-2">
${featuresMarkup}
        </ul>
      </section>

      <section class="mt-14">
        <h2 class="text-2xl font-display font-semibold text-foreground md:text-3xl">Featured Bitsocial apps</h2>
        <p class="mt-3 max-w-3xl leading-7 text-muted-foreground">Browse live Bitsocial clients, moderation modules, and protocol tools built on the same open peer-to-peer network.</p>
        <ul class="mt-6 grid gap-4 md:grid-cols-2">
${featuredAppsMarkup}
        </ul>
      </section>
    </main>`);
}

function renderProjectsStaticBody() {
  const appsMarkup = APPS.map(
    (app) => `            <li class="rounded-[1.5rem] border border-border/60 bg-background/80 p-5">
              <h2 class="text-xl font-display font-semibold text-foreground">
                <a href="/projects/${escapeHtml(app.slug)}" class="transition-colors hover:text-blue-glow">${escapeHtml(app.name)}</a>
              </h2>
              <p class="mt-2 text-sm font-medium text-foreground/70">${escapeHtml(app.tagline)}</p>
              <p class="mt-3 leading-7 text-muted-foreground">${escapeHtml(app.description)}</p>
            </li>`,
  ).join("\n");

  return renderStaticShell(`
    <main class="pt-14">
      <section class="max-w-4xl">
        <p class="text-xs font-display uppercase tracking-[0.24em] text-foreground/45">Projects Directory</p>
        <h1 class="mt-4 text-4xl font-display font-semibold leading-[1.05] text-balance text-foreground md:text-6xl">Bitsocial Projects</h1>
        <p class="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Explore user-facing Bitsocial clients, anti-spam modules, and developer tools that run on the open peer-to-peer Bitsocial network.</p>
      </section>

      <section class="mt-12">
        <ul class="grid gap-4 md:grid-cols-2">
${appsMarkup}
        </ul>
      </section>
    </main>`);
}

function renderAppDetailStaticBody(app: AppData) {
  const platformSummary = getAppPlatforms(app).join(", ");
  const primaryLinks = app.links
    .filter((link) => link.primary || link.kind !== "mirror")
    .slice(0, 4);
  const linkMarkup = primaryLinks
    .map(
      (link) => `          <li>
            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-blue-glow">${escapeHtml(link.label)}</a>
          </li>`,
    )
    .join("\n");

  return renderStaticShell(`
    <main class="pt-14">
      <a href="/projects" class="text-sm text-muted-foreground transition-colors hover:text-foreground">All projects</a>
      <section class="mt-6 max-w-4xl rounded-[2rem] border border-border/60 bg-background/80 p-6 md:p-8">
        <p class="text-xs font-display uppercase tracking-[0.24em] text-foreground/45">${escapeHtml(getApplicationCategory(getPrimaryCategorySlug(app)))}</p>
        <h1 class="mt-4 text-4xl font-display font-semibold leading-[1.05] text-balance text-foreground md:text-5xl">${escapeHtml(app.name)}</h1>
        <p class="mt-3 text-lg font-medium leading-7 text-foreground/70">${escapeHtml(app.tagline)}</p>
        <p class="mt-5 max-w-3xl leading-8 text-muted-foreground">${escapeHtml(app.description)}</p>
        <p class="mt-4 text-sm text-muted-foreground">Platforms: ${escapeHtml(platformSummary || "Web")}</p>
        <h2 class="mt-8 text-xl font-display font-semibold text-foreground">Links</h2>
        <ul class="mt-4 space-y-2 text-muted-foreground">
${linkMarkup}
          <li>
            <a href="https://github.com/${escapeHtml(app.githubRepo)}" target="_blank" rel="noopener noreferrer" class="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-blue-glow">Source code</a>
          </li>
        </ul>
      </section>
    </main>`);
}

function renderStaticSeoBody(pathname: string) {
  if (pathname === "/") {
    return renderHomeStaticBody();
  }

  if (pathname === "/projects") {
    return renderProjectsStaticBody();
  }

  const appSlugMatch = pathname.match(/^\/projects\/([^/]+)$/);
  if (appSlugMatch?.[1]) {
    const app = getAppBySlug(appSlugMatch[1]);
    if (app) {
      return renderAppDetailStaticBody(app);
    }
  }

  return "";
}

export function injectSeoBody(html: string, pathname: string) {
  const body = renderStaticSeoBody(pathname);
  if (!body) {
    return html;
  }

  return html.replace(ROOT_MARKER_REGEX, `<div id="root">${body}</div>`);
}

function getRouteLastModified() {
  return new Date().toISOString().split("T", 1)[0] ?? new Date().toISOString();
}

function getRouteChangeFrequency(pathname: string) {
  if (pathname === "/") return "weekly";
  if (pathname === "/projects") return "weekly";
  if (pathname.startsWith("/projects/")) return "monthly";
  return "yearly";
}

function getRoutePriority(pathname: string) {
  if (pathname === "/") return "1.0";
  if (pathname === "/projects") return "0.9";
  if (pathname.startsWith("/projects/")) return "0.7";
  return "0.3";
}

function renderSitemapEntry(route: StaticSeoRoute, lastModified: string) {
  return [
    "  <url>",
    `    <loc>${route.seo.canonicalUrl}</loc>`,
    `    <lastmod>${lastModified}</lastmod>`,
    `    <changefreq>${getRouteChangeFrequency(route.pathname)}</changefreq>`,
    `    <priority>${getRoutePriority(route.pathname)}</priority>`,
    "  </url>",
  ].join("\n");
}

export function renderSitemapXml(routes: StaticSeoRoute[]) {
  const lastModified = getRouteLastModified();
  const entries = routes.map((route) => renderSitemapEntry(route, lastModified)).join("\n");

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
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    `Sitemap: ${DOCS_SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
}
