export type AppCategorySlug = "apps" | "anti-spam" | "tools";

export type AppPlatformSlug = "web" | "android" | "ios" | "desktop";

export type AppLinkKind = "launch" | "download" | "mirror";

export type AppIconKey =
  | "image"
  | "message-square"
  | "send"
  | "shield"
  | "ticket"
  | "blocks"
  | "terminal"
  | "clipboard";

export type DesktopVariant =
  | "windows"
  | "windows-portable"
  | "macos"
  | "macos-arm"
  | "linux"
  | "linux-arm";

export interface CategoryData {
  slug: AppCategorySlug;
  label: string;
  description: string;
  icon: "layout-grid" | "shield" | "wrench";
}

export interface AppLink {
  label: string;
  url: string;
  kind: AppLinkKind;
  platform?: AppPlatformSlug;
  variant?: DesktopVariant;
  primary?: boolean;
}

export interface AppData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: AppCategorySlug;
  tags: string[];
  icon: AppIconKey;
  logoSrc?: string;
  logoPixelated?: boolean;
  githubRepo: string;
  links: AppLink[];
  relatedSlugs: string[];
  featured?: boolean;
  status?: "ready" | "experimental";
  searchTerms?: string[];
}

export const CATEGORIES: CategoryData[] = [
  {
    slug: "apps",
    label: "Apps",
    description: "User-facing Bitsocial clients you can open or install today.",
    icon: "layout-grid",
  },
  {
    slug: "anti-spam",
    label: "Anti-Spam",
    description: "Authentication, filtering, and moderation modules for Bitsocial communities.",
    icon: "shield",
  },
  {
    slug: "tools",
    label: "Tools",
    description: "CLI and admin utilities for running or extending Bitsocial apps.",
    icon: "wrench",
  },
];

export const PLATFORM_META: Record<
  AppPlatformSlug,
  { label: string; shortLabel: string; description: string }
> = {
  web: {
    label: "Web",
    shortLabel: "Web",
    description: "Browser-based apps and live web mirrors.",
  },
  android: {
    label: "Android",
    shortLabel: "Android",
    description: "Direct APK downloads for Android devices.",
  },
  ios: {
    label: "iOS",
    shortLabel: "iOS",
    description: "Native or installable apps for iPhone and iPad.",
  },
  desktop: {
    label: "Desktop",
    shortLabel: "Desktop",
    description: "Windows, macOS, and Linux downloads.",
  },
};

export const PLATFORM_ORDER: AppPlatformSlug[] = ["web", "android", "ios", "desktop"];

const DESKTOP_VARIANT_ORDER: DesktopVariant[] = [
  "windows",
  "windows-portable",
  "macos",
  "macos-arm",
  "linux",
  "linux-arm",
];

// Release asset URLs were verified on 2026-04-03 via `gh release view`.
export const APPS: AppData[] = [
  {
    slug: "5chan",
    name: "5chan",
    tagline: "Decentralized imageboards with direct web, APK, and desktop downloads.",
    description:
      "5chan is the first public Bitsocial client. It recreates the anonymous imageboard flow on a peer-to-peer network: boards, threads, image posting, community moderation, and multiple public mirrors without relying on a central server.",
    category: "apps",
    tags: ["Imageboard", "Mirrors", "Downloadable"],
    icon: "image",
    logoSrc: "https://5chan.app/favicon.ico?variant=nsfw",
    logoPixelated: true,
    githubRepo: "bitsocialnet/5chan",
    links: [
      { label: "Open web app", url: "https://5chan.app", kind: "launch", platform: "web" },
      {
        label: "Android APK",
        url: "https://github.com/bitsocialnet/5chan/releases/download/v0.7.3/5chan-0.7.3.apk",
        kind: "download",
        platform: "android",
      },
      {
        label: "Windows",
        url: "https://github.com/bitsocialnet/5chan/releases/download/v0.7.3/5chan-0.7.3.Setup.exe",
        kind: "download",
        platform: "desktop",
        variant: "windows",
      },
      {
        label: "macOS Intel",
        url: "https://github.com/bitsocialnet/5chan/releases/download/v0.7.3/5chan-0.7.3-x64.dmg",
        kind: "download",
        platform: "desktop",
        variant: "macos",
      },
      {
        label: "Linux x64",
        url: "https://github.com/bitsocialnet/5chan/releases/download/v0.7.3/5chan-0.7.3-x64.AppImage",
        kind: "download",
        platform: "desktop",
        variant: "linux",
      },
      {
        label: "macOS Apple",
        url: "https://github.com/bitsocialnet/5chan/releases/download/v0.7.3/5chan-0.7.3-arm64.dmg",
        kind: "download",
        platform: "desktop",
        variant: "macos-arm",
      },
      {
        label: "Linux ARM",
        url: "https://github.com/bitsocialnet/5chan/releases/download/v0.7.3/5chan-0.7.3-arm64.AppImage",
        kind: "download",
        platform: "desktop",
        variant: "linux-arm",
        primary: false,
      },
      { label: "5chan.cc", url: "https://5chan.cc", kind: "mirror", platform: "web" },
      { label: "5channel.org", url: "https://5channel.org", kind: "mirror", platform: "web" },
      { label: "5chan.eth.limo", url: "https://5chan.eth.limo", kind: "mirror", platform: "web" },
    ],
    relatedSlugs: ["5chan-board-manager", "seedit"],
    featured: true,
    status: "ready",
    searchTerms: ["apk", "android", "desktop", "windows", "mac", "linux", "mirror"],
  },
  {
    slug: "seedit",
    name: "Seedit",
    tagline: "Forum-style Bitsocial client with web, APK, and desktop builds.",
    description:
      "Seedit brings Reddit-style discussion to Bitsocial with threads, identities, community management, and multiple distribution paths. It is the fastest way to try the forum side of the network from a browser, Android phone, or desktop app.",
    category: "apps",
    tags: ["Forums", "Downloadable"],
    icon: "message-square",
    logoSrc: "https://www.seedit.app/favicon.ico",
    githubRepo: "bitsocialnet/seedit",
    links: [
      { label: "Open web app", url: "https://www.seedit.app", kind: "launch", platform: "web" },
      {
        label: "Android APK",
        url: "https://github.com/bitsocialnet/seedit/releases/download/v0.5.10/seedit-0.5.10.apk",
        kind: "download",
        platform: "android",
      },
      {
        label: "Windows",
        url: "https://github.com/bitsocialnet/seedit/releases/download/v0.5.10/seedit.Setup.0.5.10.exe",
        kind: "download",
        platform: "desktop",
        variant: "windows",
      },
      {
        label: "macOS Intel",
        url: "https://github.com/bitsocialnet/seedit/releases/download/v0.5.10/seedit-0.5.10.dmg",
        kind: "download",
        platform: "desktop",
        variant: "macos",
      },
      {
        label: "Linux",
        url: "https://github.com/bitsocialnet/seedit/releases/download/v0.5.10/seedit-0.5.10.AppImage",
        kind: "download",
        platform: "desktop",
        variant: "linux",
      },
      {
        label: "macOS Apple",
        url: "https://github.com/bitsocialnet/seedit/releases/download/v0.5.10/seedit-0.5.10-arm64.dmg",
        kind: "download",
        platform: "desktop",
        variant: "macos-arm",
      },
      {
        label: "Linux ARM",
        url: "https://github.com/bitsocialnet/seedit/releases/download/v0.5.10/seedit-0.5.10-arm64.AppImage",
        kind: "download",
        platform: "desktop",
        variant: "linux-arm",
        primary: false,
      },
      {
        label: "Windows Portable",
        url: "https://github.com/bitsocialnet/seedit/releases/download/v0.5.10/seedit.Portable.0.5.10.exe",
        kind: "download",
        platform: "desktop",
        variant: "windows-portable",
        primary: false,
      },
      { label: "seedit.eth.limo", url: "https://seedit.eth.limo", kind: "mirror", platform: "web" },
    ],
    relatedSlugs: ["5chan"],
    featured: true,
    status: "experimental",
    searchTerms: ["apk", "android", "desktop", "windows", "mac", "linux", "reddit"],
  },
  {
    slug: "mintpass",
    name: "Mintpass",
    tagline: "NFT-backed access control for communities that need stronger anti-spam gates.",
    description:
      "Mintpass is a flexible authentication layer for Bitsocial communities. It lets moderators mix NFT ownership, verification flows, and custom challenge modules without pushing everyone onto a central login system.",
    category: "anti-spam",
    tags: ["Verification", "Access control"],
    icon: "ticket",
    logoSrc: "https://mintpass.org/favicon.ico",
    githubRepo: "bitsocialnet/mintpass",
    links: [
      { label: "Open website", url: "https://mintpass.org", kind: "launch", platform: "web" },
    ],
    relatedSlugs: ["spam-blocker", "captcha-canvas-challenge", "voucher-challenge"],
    searchTerms: ["identity", "nft", "auth"],
  },
  {
    slug: "spam-blocker",
    name: "Spam Blocker",
    tagline: "Centralized risk scoring layer for filtering abusive publications.",
    description:
      "Spam Blocker evaluates publications and returns a risk score that communities can combine with their own moderation logic. It is useful when you want a pragmatic extra layer before building more custom anti-spam rules.",
    category: "anti-spam",
    tags: ["Risk scores", "Moderation"],
    icon: "shield",
    githubRepo: "bitsocialnet/spam-blocker",
    links: [],
    relatedSlugs: ["mintpass", "captcha-canvas-challenge"],
    searchTerms: ["filtering", "risk", "moderation"],
  },
  {
    slug: "captcha-canvas-challenge",
    name: "Captcha Canvas Challenge",
    tagline: "Custom image captchas for communities that want human verification.",
    description:
      "Captcha Canvas Challenge generates visual captchas that communities can plug into their own publishing flow. It is a lightweight option for communities that want direct human checks without giving up self-hosted moderation.",
    category: "anti-spam",
    tags: ["Captcha", "Human checks"],
    icon: "image",
    githubRepo: "bitsocialnet/captcha-canvas-challenge",
    links: [],
    relatedSlugs: ["mintpass", "voucher-challenge", "evm-contract-call"],
    searchTerms: ["captcha", "verification", "images"],
  },
  {
    slug: "voucher-challenge",
    name: "Voucher Challenge",
    tagline: "Invite-style voucher codes for communities that prefer controlled growth.",
    description:
      "Voucher Challenge lets moderators distribute trusted voucher codes that unlock publishing without a global identity provider. It is a good fit for invite-driven communities, niche boards, and gradual rollouts.",
    category: "anti-spam",
    tags: ["Invites", "Access control"],
    icon: "ticket",
    githubRepo: "bitsocialnet/voucher-challenge",
    links: [],
    relatedSlugs: ["captcha-canvas-challenge", "evm-contract-call", "mintpass"],
    searchTerms: ["voucher", "invite", "codes"],
  },
  {
    slug: "evm-contract-call",
    name: "EVM Contract Call",
    tagline: "On-chain gating for communities that want token or contract checks.",
    description:
      "EVM Contract Call verifies publications by calling an EVM contract before a post is accepted. It lets communities build token gates, staking rules, or other on-chain checks into their moderation flow.",
    category: "anti-spam",
    tags: ["On-chain", "Contracts"],
    icon: "blocks",
    githubRepo: "bitsocialnet/evm-contract-call",
    links: [],
    relatedSlugs: ["voucher-challenge", "mintpass"],
    searchTerms: ["ethereum", "token gating", "smart contract"],
  },
  {
    slug: "bitsocial-cli",
    name: "Bitsocial CLI",
    tagline: "Command-line control for nodes, communities, and automation workflows.",
    description:
      "Bitsocial CLI is the official terminal interface for the protocol. Use it to manage nodes, publish content, automate admin flows, and work directly against Bitsocial primitives without a GUI client.",
    category: "tools",
    tags: ["CLI", "Automation"],
    icon: "terminal",
    githubRepo: "bitsocialnet/bitsocial-cli",
    links: [],
    relatedSlugs: ["5chan-board-manager"],
    searchTerms: ["terminal", "command line", "automation"],
  },
  {
    slug: "telegram-bots",
    name: "Bitsocial Telegram Bots",
    tagline: "Feed bots that relay new Bitsocial posts into Telegram channels or groups.",
    description:
      "Bitsocial Telegram Bots monitor client community lists and forward new posts into Telegram destinations with inline links back to Bitsocial clients. The active bot covers 5chan feeds today, with the repo structured to add more client-specific bots over time.",
    category: "apps",
    tags: ["Telegram", "Bots", "Feeds"],
    icon: "send",
    githubRepo: "bitsocialnet/bitsocial-telegram-bots",
    links: [],
    relatedSlugs: ["5chan", "seedit", "bitsocial-cli"],
    searchTerms: ["telegram", "bots", "feeds", "5chan", "automation"],
  },
  {
    slug: "5chan-board-manager",
    name: "5chan Board Manager",
    tagline: "Board administration tooling for custom 5chan communities.",
    description:
      "5chan Board Manager builds on top of Bitsocial CLI to help administrators create, configure, and moderate custom imageboard boards. It is the utility layer for board owners who want operational control.",
    category: "tools",
    tags: ["Board admin", "CLI"],
    icon: "clipboard",
    githubRepo: "bitsocialnet/5chan-board-manager",
    links: [],
    relatedSlugs: ["5chan", "bitsocial-cli"],
    searchTerms: ["boards", "moderation", "admin"],
  },
];

export function getAppBySlug(slug: string): AppData | undefined {
  return APPS.find((app) => app.slug === slug);
}

export function getAppsByCategory(category: AppCategorySlug): AppData[] {
  return APPS.filter((app) => app.category === category);
}

export function getCategoryBySlug(slug: AppCategorySlug): CategoryData | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getRelatedApps(app: AppData): AppData[] {
  return app.relatedSlugs
    .map((slug) => getAppBySlug(slug))
    .filter((relatedApp): relatedApp is AppData => relatedApp !== undefined);
}

export function getGithubUrl(app: AppData): string {
  return `https://github.com/${app.githubRepo}`;
}

export function getMirrorLinks(app: AppData): AppLink[] {
  return app.links.filter((link) => link.kind === "mirror");
}

export function getLaunchLinks(app: AppData): AppLink[] {
  return sortAppLinks(app.links.filter((link) => link.kind === "launch"));
}

export function getDownloadLinks(app: AppData): AppLink[] {
  return sortAppLinks(app.links.filter((link) => link.kind === "download"));
}

export function getPrimaryLinks(app: AppData, preferredPlatform?: AppPlatformSlug): AppLink[] {
  return sortAppLinks(
    app.links.filter(
      (link) => (link.kind === "launch" || link.kind === "download") && link.primary !== false,
    ),
    preferredPlatform,
  );
}

export function getSecondaryLinks(app: AppData, preferredPlatform?: AppPlatformSlug): AppLink[] {
  return sortAppLinks(
    app.links.filter(
      (link) => (link.kind === "launch" || link.kind === "download") && link.primary === false,
    ),
    preferredPlatform,
  );
}

export function getAppPlatforms(app: AppData): AppPlatformSlug[] {
  return PLATFORM_ORDER.filter((platform) => app.links.some((link) => link.platform === platform));
}

export function appMatchesPlatform(app: AppData, platform: AppPlatformSlug): boolean {
  return app.links.some((link) => link.platform === platform);
}

export function appMatchesSearch(app: AppData, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  const haystack = [
    app.name,
    app.tagline,
    app.description,
    app.category,
    ...app.tags,
    ...(app.searchTerms ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function normalizeTagForFilter(s: string): string {
  return s.trim().toLowerCase();
}

/** Compares active filter tag from the URL to a tag string from app data (trim + case-insensitive). */
export function tagsMatchFilter(active: string | null | undefined, candidate: string): boolean {
  if (active == null || active === "") return false;
  return normalizeTagForFilter(active) === normalizeTagForFilter(candidate);
}

export function appMatchesTag(app: AppData, tag: string | null): boolean {
  if (!tag) return true;

  const normalized = normalizeTagForFilter(tag);
  return app.tags.some((appTag) => normalizeTagForFilter(appTag) === normalized);
}

function sortAppLinks(links: AppLink[], preferredPlatform?: AppPlatformSlug): AppLink[] {
  const platformPriority = preferredPlatform
    ? [preferredPlatform, ...PLATFORM_ORDER.filter((platform) => platform !== preferredPlatform)]
    : PLATFORM_ORDER;

  return [...links].sort((left, right) => {
    const leftPrimaryRank = left.primary === false ? 1 : 0;
    const rightPrimaryRank = right.primary === false ? 1 : 0;
    if (leftPrimaryRank !== rightPrimaryRank) return leftPrimaryRank - rightPrimaryRank;

    const leftKindRank = left.kind === "launch" ? 0 : left.kind === "download" ? 1 : 2;
    const rightKindRank = right.kind === "launch" ? 0 : right.kind === "download" ? 1 : 2;
    if (leftKindRank !== rightKindRank) return leftKindRank - rightKindRank;

    const leftPlatformRank =
      left.platform === undefined
        ? Number.MAX_SAFE_INTEGER
        : platformPriority.indexOf(left.platform);
    const rightPlatformRank =
      right.platform === undefined
        ? Number.MAX_SAFE_INTEGER
        : platformPriority.indexOf(right.platform);
    if (leftPlatformRank !== rightPlatformRank) return leftPlatformRank - rightPlatformRank;

    const leftVariantRank =
      left.variant === undefined
        ? Number.MAX_SAFE_INTEGER
        : DESKTOP_VARIANT_ORDER.indexOf(left.variant);
    const rightVariantRank =
      right.variant === undefined
        ? Number.MAX_SAFE_INTEGER
        : DESKTOP_VARIANT_ORDER.indexOf(right.variant);
    if (leftVariantRank !== rightVariantRank) return leftVariantRank - rightVariantRank;

    return left.label.localeCompare(right.label);
  });
}
