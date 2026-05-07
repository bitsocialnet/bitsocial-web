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
  "Bitsocial is an open-source IPFS-backed peer-to-peer network for social apps, with no servers, no global bans, where users and communities are cryptographic property.";
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
    href: "/docs/peer-to-peer-protocol/",
    cta: "Read the peer-to-peer protocol",
  },
  {
    title: "Local moderation instead of global bans",
    description:
      "Community owners decide how their own spaces work, without a protocol-wide super-admin who can erase every identity or forum at once.",
    href: "/docs/local-moderation/",
    cta: "Read the moderation notes",
  },
  {
    title: "User-owned identities and communities",
    description:
      "Profiles and communities are controlled by keys, so ownership behaves more like property than a revocable account on a company platform.",
    href: "/docs/identity-and-ownership/",
    cta: "Read the ownership notes",
  },
  {
    title: "Apps can share one open network",
    description:
      "Different Bitsocial apps can compete on product quality while sharing the same communities, identities, and underlying network.",
    href: "/apps",
    cta: "Explore Bitsocial apps",
  },
] as const;

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
    alternateName: "Bitsocial Protocol",
    url: SITE_ORIGIN,
    description: SITE_DESCRIPTION,
    foundingDate: "2022",
    image: toAbsoluteUrl(DEFAULT_IMAGE_PATH),
    logo: toAbsoluteUrl("/logo.png"),
    slogan: "Decentralize all social media",
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
      url: toAbsoluteUrl(`/apps/${app.slug}`),
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
    structuredData: createStructuredData([
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      buildHomeItemListSchema(),
      buildHomeWebPageSchema(),
    ]),
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

function buildAboutSeoMetadata(): SeoMetadata {
  const canonicalUrl = toAbsoluteUrl("/about");

  return {
    title: "About Bitsocial | Core Team",
    description: truncateDescription(
      "Meet the Bitsocial core team and learn about the peer-to-peer social protocol they have been building since early 2022.",
    ),
    canonicalUrl,
    robots: NOINDEX_ROBOTS,
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

  if (normalizedPath === "/about") {
    return buildAboutSeoMetadata();
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

function renderStaticShell(content: string) {
  return [
    '<div data-seo-prerender="true" class="min-h-screen bg-background text-foreground">',
    '  <div class="mx-auto max-w-6xl px-6 pb-16 pt-8 md:px-8">',
    '    <nav aria-label="Primary" class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">',
    '      <a href="/" class="font-display font-semibold text-foreground transition-colors hover:text-blue-glow">Bitsocial</a>',
    '      <a href="/apps" class="transition-colors hover:text-foreground">Apps</a>',
    '      <a href="/docs/" class="transition-colors hover:text-foreground">Docs</a>',
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
                <a href="/apps/${escapeHtml(app.slug)}" class="transition-colors hover:text-blue-glow">${escapeHtml(app.name)}</a>
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
          <a href="/apps" class="rounded-full border border-border/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-blue-glow hover:text-blue-glow">Explore Bitsocial apps</a>
          <a href="/docs/" class="rounded-full border border-border/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-blue-glow hover:text-blue-glow">Read the docs</a>
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

function renderAppsStaticBody() {
  const appsMarkup = APPS.map(
    (app) => `            <li class="rounded-[1.5rem] border border-border/60 bg-background/80 p-5">
              <h2 class="text-xl font-display font-semibold text-foreground">
                <a href="/apps/${escapeHtml(app.slug)}" class="transition-colors hover:text-blue-glow">${escapeHtml(app.name)}</a>
              </h2>
              <p class="mt-2 text-sm font-medium text-foreground/70">${escapeHtml(app.tagline)}</p>
              <p class="mt-3 leading-7 text-muted-foreground">${escapeHtml(app.description)}</p>
            </li>`,
  ).join("\n");

  return renderStaticShell(`
    <main class="pt-14">
      <section class="max-w-4xl">
        <p class="text-xs font-display uppercase tracking-[0.24em] text-foreground/45">Bitsocial app directory</p>
        <h1 class="mt-4 text-4xl font-display font-semibold leading-[1.05] text-balance text-foreground md:text-6xl">Bitsocial Apps</h1>
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
      <a href="/apps" class="text-sm text-muted-foreground transition-colors hover:text-foreground">All apps</a>
      <section class="mt-6 max-w-4xl rounded-[2rem] border border-border/60 bg-background/80 p-6 md:p-8">
        <p class="text-xs font-display uppercase tracking-[0.24em] text-foreground/45">${escapeHtml(getApplicationCategory(app.category))}</p>
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

  if (pathname === "/apps") {
    return renderAppsStaticBody();
  }

  const appSlugMatch = pathname.match(/^\/apps\/([^/]+)$/);
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
  if (pathname === "/apps") return "weekly";
  if (pathname.startsWith("/apps/")) return "monthly";
  return "yearly";
}

function getRoutePriority(pathname: string) {
  if (pathname === "/") return "1.0";
  if (pathname === "/apps") return "0.9";
  if (pathname.startsWith("/apps/")) return "0.7";
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
    "Disallow: /stats",
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    `Sitemap: ${SITE_ORIGIN}/docs/sitemap.xml`,
    "",
  ].join("\n");
}
