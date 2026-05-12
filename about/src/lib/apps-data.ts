import type { TFunction } from "i18next";

export type AppCategorySlug = "apps" | "anti-spam" | "tools";

export type AppPlatformSlug = "web" | "android" | "ios" | "desktop";

export type AppLinkKind = "launch" | "download" | "package" | "mirror";

export interface AppMirrorVerification {
  appName: string;
  checkedAt: string;
  indexHtmlSha256: string;
  releaseAssetName: string;
  releaseAssetSha256: string;
  releaseAssetUrl: string;
  releaseTag: string;
}

export interface AppReleaseIntegrityProbe {
  appName: string;
  keyId: string;
  manifestUrl: string;
  publicKeyJwk: JsonWebKey;
  signatureUrl: string;
  targetMeasurementsUrl: string;
}

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

interface BaseAppLink {
  label: string;
  url: string;
  platform?: AppPlatformSlug;
  variant?: DesktopVariant;
  primary?: boolean;
}

export type AppLink =
  | (BaseAppLink & {
      kind: "launch" | "mirror";
      releaseIntegrity?: AppReleaseIntegrityProbe;
      verification?: AppMirrorVerification;
    })
  | (BaseAppLink & {
      kind: Exclude<AppLinkKind, "launch" | "mirror">;
      releaseIntegrity?: never;
      verification?: never;
    });

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

const APP_LINK_KIND_ORDER: Record<AppLinkKind, number> = {
  launch: 0,
  package: 1,
  download: 2,
  mirror: 3,
};

const CATEGORY_TRANSLATION_KEYS: Record<AppCategorySlug, { label: string; description: string }> = {
  apps: {
    label: "apps.catalog.categories.apps.label",
    description: "apps.catalog.categories.apps.description",
  },
  "anti-spam": {
    label: "apps.catalog.categories.anti-spam.label",
    description: "apps.catalog.categories.anti-spam.description",
  },
  tools: {
    label: "apps.catalog.categories.tools.label",
    description: "apps.catalog.categories.tools.description",
  },
};

const PLATFORM_TRANSLATION_KEYS: Record<
  AppPlatformSlug,
  { label: string; shortLabel: string; description: string }
> = {
  web: {
    label: "apps.catalog.platforms.web.label",
    shortLabel: "apps.catalog.platforms.web.shortLabel",
    description: "apps.catalog.platforms.web.description",
  },
  android: {
    label: "apps.catalog.platforms.android.label",
    shortLabel: "apps.catalog.platforms.android.shortLabel",
    description: "apps.catalog.platforms.android.description",
  },
  ios: {
    label: "apps.catalog.platforms.ios.label",
    shortLabel: "apps.catalog.platforms.ios.shortLabel",
    description: "apps.catalog.platforms.ios.description",
  },
  desktop: {
    label: "apps.catalog.platforms.desktop.label",
    shortLabel: "apps.catalog.platforms.desktop.shortLabel",
    description: "apps.catalog.platforms.desktop.description",
  },
};

const APP_TAG_TRANSLATION_KEYS: Record<string, string> = {
  "Access control": "apps.catalog.tags.accessControl",
  Automation: "apps.catalog.tags.automation",
  "Board admin": "apps.catalog.tags.boardAdmin",
  Bots: "apps.catalog.tags.bots",
  CLI: "apps.catalog.tags.cli",
  Captcha: "apps.catalog.tags.captcha",
  Contracts: "apps.catalog.tags.contracts",
  Downloadable: "apps.catalog.tags.downloadable",
  Feeds: "apps.catalog.tags.feeds",
  Forums: "apps.catalog.tags.forums",
  "Human checks": "apps.catalog.tags.humanChecks",
  Imageboard: "apps.catalog.tags.imageboard",
  Invites: "apps.catalog.tags.invites",
  Mirrors: "apps.catalog.tags.mirrors",
  Moderation: "apps.catalog.tags.moderation",
  "On-chain": "apps.catalog.tags.onChain",
  "Risk scores": "apps.catalog.tags.riskScores",
  Telegram: "apps.catalog.tags.telegram",
  Verification: "apps.catalog.tags.verification",
};

const APP_LINK_LABEL_TRANSLATION_KEYS: Record<string, string> = {
  "Android APK": "apps.catalog.linkLabels.androidApk",
  Linux: "apps.catalog.linkLabels.linux",
  "Linux ARM": "apps.catalog.linkLabels.linuxArm",
  "Linux x64": "apps.catalog.linkLabels.linuxX64",
  "Open web app": "apps.catalog.linkLabels.openWebApp",
  "Open website": "apps.catalog.linkLabels.openWebsite",
  Windows: "apps.catalog.linkLabels.windows",
  "Windows Portable": "apps.catalog.linkLabels.windowsPortable",
  "macOS Apple": "apps.catalog.linkLabels.macosApple",
  "macOS Intel": "apps.catalog.linkLabels.macosIntel",
};

const APP_COPY_TRANSLATION_KEYS: Record<string, { tagline: string; description: string }> = {
  "5chan": {
    tagline: "apps.catalog.items.5chan.tagline",
    description: "apps.catalog.items.5chan.description",
  },
  seedit: {
    tagline: "apps.catalog.items.seedit.tagline",
    description: "apps.catalog.items.seedit.description",
  },
  mintpass: {
    tagline: "apps.catalog.items.mintpass.tagline",
    description: "apps.catalog.items.mintpass.description",
  },
  "spam-blocker": {
    tagline: "apps.catalog.items.spam-blocker.tagline",
    description: "apps.catalog.items.spam-blocker.description",
  },
  "captcha-canvas-challenge": {
    tagline: "apps.catalog.items.captcha-canvas-challenge.tagline",
    description: "apps.catalog.items.captcha-canvas-challenge.description",
  },
  "voucher-challenge": {
    tagline: "apps.catalog.items.voucher-challenge.tagline",
    description: "apps.catalog.items.voucher-challenge.description",
  },
  "evm-contract-call": {
    tagline: "apps.catalog.items.evm-contract-call.tagline",
    description: "apps.catalog.items.evm-contract-call.description",
  },
  "bitsocial-cli": {
    tagline: "apps.catalog.items.bitsocial-cli.tagline",
    description: "apps.catalog.items.bitsocial-cli.description",
  },
  "telegram-bots": {
    tagline: "apps.catalog.items.telegram-bots.tagline",
    description: "apps.catalog.items.telegram-bots.description",
  },
  "5chan-board-manager": {
    tagline: "apps.catalog.items.5chan-board-manager.tagline",
    description: "apps.catalog.items.5chan-board-manager.description",
  },
};

function translateCatalogValue(t: TFunction, key: string, fallback: string): string {
  const translatedValue = t(key, { defaultValue: fallback });
  return typeof translatedValue === "string" ? translatedValue : fallback;
}

const FIVECHAN_RELEASE_PUBLIC_KEY_JWK: JsonWebKey = {
  crv: "P-256",
  ext: true,
  key_ops: ["verify"],
  kty: "EC",
  x: "IR6Kz6DlypO9x1cQzjcFUYq3suWWsPuacSI5tdottcQ",
  y: "38GJRFhC6IKVDX_N8csqlRX4ERqIVgbLm9wmqspNDkI",
};

const SEEDIT_RELEASE_PUBLIC_KEY_JWK: JsonWebKey = {
  crv: "P-256",
  ext: true,
  key_ops: ["verify"],
  kty: "EC",
  x: "JO91ctROSL7ft410tY9KuY9aYkmbyikbjGDawhhL6vA",
  y: "LPp2XNKyfM2GDHj11gaOHhD3YV0sRzhCODLKPGNt5oA",
};

const FIVECHAN_SIGNED_RELEASE_INTEGRITY: AppReleaseIntegrityProbe = {
  appName: "5chan",
  keyId: "5chan-release-p256-2026-05",
  manifestUrl: "/api/release-integrity?app=5chan&asset=manifest",
  publicKeyJwk: FIVECHAN_RELEASE_PUBLIC_KEY_JWK,
  signatureUrl: "/api/release-integrity?app=5chan&asset=signature",
  targetMeasurementsUrl: "/api/release-integrity?app=5chan&asset=target-measurements",
};

const SEEDIT_SIGNED_RELEASE_INTEGRITY: AppReleaseIntegrityProbe = {
  appName: "Seedit",
  keyId: "seedit-release-p256-2026-05",
  manifestUrl: "/api/release-integrity?app=seedit&asset=manifest",
  publicKeyJwk: SEEDIT_RELEASE_PUBLIC_KEY_JWK,
  signatureUrl: "/api/release-integrity?app=seedit&asset=signature",
  targetMeasurementsUrl: "/api/release-integrity?app=seedit&asset=target-measurements",
};

export function getCategoryLabel(
  categoryOrSlug: CategoryData | AppCategorySlug,
  t: TFunction,
): string {
  const slug: AppCategorySlug =
    typeof categoryOrSlug === "string" ? categoryOrSlug : categoryOrSlug.slug;
  const fallback =
    typeof categoryOrSlug === "string"
      ? (getCategoryBySlug(categoryOrSlug)?.label ?? categoryOrSlug)
      : categoryOrSlug.label;

  return translateCatalogValue(t, CATEGORY_TRANSLATION_KEYS[slug].label, fallback);
}

export function getCategoryDescription(
  categoryOrSlug: CategoryData | AppCategorySlug,
  t: TFunction,
): string {
  const slug: AppCategorySlug =
    typeof categoryOrSlug === "string" ? categoryOrSlug : categoryOrSlug.slug;
  const fallback =
    typeof categoryOrSlug === "string"
      ? (getCategoryBySlug(categoryOrSlug)?.description ?? categoryOrSlug)
      : categoryOrSlug.description;

  return translateCatalogValue(t, CATEGORY_TRANSLATION_KEYS[slug].description, fallback);
}

export function getPlatformLabel(platform: AppPlatformSlug, t: TFunction) {
  return translateCatalogValue(
    t,
    PLATFORM_TRANSLATION_KEYS[platform].label,
    PLATFORM_META[platform].label,
  );
}

export function getPlatformShortLabel(platform: AppPlatformSlug, t: TFunction) {
  return translateCatalogValue(
    t,
    PLATFORM_TRANSLATION_KEYS[platform].shortLabel,
    PLATFORM_META[platform].shortLabel,
  );
}

export function getPlatformDescription(platform: AppPlatformSlug, t: TFunction) {
  return translateCatalogValue(
    t,
    PLATFORM_TRANSLATION_KEYS[platform].description,
    PLATFORM_META[platform].description,
  );
}

export function getAppTagLabel(tag: string, t: TFunction) {
  const key = APP_TAG_TRANSLATION_KEYS[tag];
  return key ? translateCatalogValue(t, key, tag) : tag;
}

export function getAppLinkLabel(link: AppLink, t: TFunction) {
  const key = APP_LINK_LABEL_TRANSLATION_KEYS[link.label];
  return key ? translateCatalogValue(t, key, link.label) : link.label;
}

export function getAppTagline(app: AppData, t: TFunction) {
  const key = APP_COPY_TRANSLATION_KEYS[app.slug]?.tagline;
  return key ? translateCatalogValue(t, key, app.tagline) : app.tagline;
}

export function getAppDescription(app: AppData, t: TFunction) {
  const key = APP_COPY_TRANSLATION_KEYS[app.slug]?.description;
  return key ? translateCatalogValue(t, key, app.description) : app.description;
}

// Native release downloads go through the same-origin release API so they can track latest assets.
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
      {
        label: "Open web app",
        url: "https://5chan.app",
        kind: "launch",
        platform: "web",
        releaseIntegrity: FIVECHAN_SIGNED_RELEASE_INTEGRITY,
      },
      {
        label: "Android APK",
        url: "/api/release-integrity?app=5chan&asset=download&variant=android",
        kind: "download",
        platform: "android",
      },
      {
        label: "Windows",
        url: "/api/release-integrity?app=5chan&asset=download&variant=windows",
        kind: "download",
        platform: "desktop",
        variant: "windows",
      },
      {
        label: "macOS Intel",
        url: "/api/release-integrity?app=5chan&asset=download&variant=macos-x64",
        kind: "download",
        platform: "desktop",
        variant: "macos",
      },
      {
        label: "Linux x64",
        url: "/api/release-integrity?app=5chan&asset=download&variant=linux-x64",
        kind: "download",
        platform: "desktop",
        variant: "linux",
      },
      {
        label: "macOS Apple",
        url: "/api/release-integrity?app=5chan&asset=download&variant=macos-arm64",
        kind: "download",
        platform: "desktop",
        variant: "macos-arm",
      },
      {
        label: "Linux ARM",
        url: "/api/release-integrity?app=5chan&asset=download&variant=linux-arm64",
        kind: "download",
        platform: "desktop",
        variant: "linux-arm",
        primary: false,
      },
      {
        label: "5chan.eth.limo",
        url: "https://5chan.eth.limo",
        kind: "mirror",
        platform: "web",
        releaseIntegrity: FIVECHAN_SIGNED_RELEASE_INTEGRITY,
      },
      {
        label: "5chan.cc",
        url: "https://5chan.cc",
        kind: "mirror",
        platform: "web",
        releaseIntegrity: FIVECHAN_SIGNED_RELEASE_INTEGRITY,
      },
      {
        label: "5channel.org",
        url: "https://5channel.org",
        kind: "mirror",
        platform: "web",
        releaseIntegrity: FIVECHAN_SIGNED_RELEASE_INTEGRITY,
      },
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
      {
        label: "Open web app",
        url: "https://seedit.app",
        kind: "launch",
        platform: "web",
        releaseIntegrity: SEEDIT_SIGNED_RELEASE_INTEGRITY,
      },
      {
        label: "Android APK",
        url: "/api/release-integrity?app=seedit&asset=download&variant=android",
        kind: "download",
        platform: "android",
      },
      {
        label: "Windows",
        url: "/api/release-integrity?app=seedit&asset=download&variant=windows",
        kind: "download",
        platform: "desktop",
        variant: "windows",
      },
      {
        label: "macOS Intel",
        url: "/api/release-integrity?app=seedit&asset=download&variant=macos-x64",
        kind: "download",
        platform: "desktop",
        variant: "macos",
      },
      {
        label: "Linux",
        url: "/api/release-integrity?app=seedit&asset=download&variant=linux-x64",
        kind: "download",
        platform: "desktop",
        variant: "linux",
      },
      {
        label: "macOS Apple",
        url: "/api/release-integrity?app=seedit&asset=download&variant=macos-arm64",
        kind: "download",
        platform: "desktop",
        variant: "macos-arm",
      },
      {
        label: "Linux ARM",
        url: "/api/release-integrity?app=seedit&asset=download&variant=linux-arm64",
        kind: "download",
        platform: "desktop",
        variant: "linux-arm",
        primary: false,
      },
      {
        label: "Windows Portable",
        url: "/api/release-integrity?app=seedit&asset=download&variant=windows-portable",
        kind: "download",
        platform: "desktop",
        variant: "windows-portable",
        primary: false,
      },
      {
        label: "seedit.eth.limo",
        url: "https://seedit.eth.limo",
        kind: "mirror",
        platform: "web",
        releaseIntegrity: SEEDIT_SIGNED_RELEASE_INTEGRITY,
      },
      {
        label: "seedit.online",
        url: "https://seedit.online",
        kind: "mirror",
        platform: "web",
        releaseIntegrity: SEEDIT_SIGNED_RELEASE_INTEGRITY,
      },
      {
        label: "seedit.today",
        url: "https://seedit.today",
        kind: "mirror",
        platform: "web",
        releaseIntegrity: SEEDIT_SIGNED_RELEASE_INTEGRITY,
      },
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
      {
        label: "@bitsocial/mintpass-challenge",
        url: "https://www.npmjs.com/package/@bitsocial/mintpass-challenge",
        kind: "package",
      },
    ],
    relatedSlugs: [
      "ai-moderation-challenge",
      "spam-blocker",
      "captcha-canvas-challenge",
      "voucher-challenge",
    ],
    searchTerms: ["identity", "nft", "auth"],
  },
  {
    slug: "ai-moderation-challenge",
    name: "AI Moderation Challenge",
    tagline: "OpenAI-compatible moderation checks against each community's rules.",
    description:
      "AI Moderation Challenge evaluates Bitsocial comment content against community.rules with an OpenAI-compatible model endpoint. Communities can route risky posts to review while keeping provider keys and prompts in private node settings.",
    category: "anti-spam",
    tags: ["Moderation", "Risk scores"],
    icon: "shield",
    githubRepo: "bitsocialnet/ai-moderation-challenge",
    links: [
      {
        label: "@bitsocial/ai-moderation-challenge",
        url: "https://www.npmjs.com/package/@bitsocial/ai-moderation-challenge",
        kind: "package",
      },
    ],
    relatedSlugs: ["spam-blocker", "captcha-canvas-challenge", "voucher-challenge"],
    searchTerms: ["ai", "openai", "llm", "rules", "review", "moderation"],
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
    links: [
      {
        label: "@bitsocial/spam-blocker-challenge",
        url: "https://www.npmjs.com/package/@bitsocial/spam-blocker-challenge",
        kind: "package",
      },
    ],
    relatedSlugs: ["ai-moderation-challenge", "mintpass", "captcha-canvas-challenge"],
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
    links: [
      {
        label: "@bitsocial/captcha-canvas-challenge",
        url: "https://www.npmjs.com/package/@bitsocial/captcha-canvas-challenge",
        kind: "package",
      },
    ],
    relatedSlugs: ["ai-moderation-challenge", "mintpass", "voucher-challenge", "evm-contract-call"],
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
    links: [
      {
        label: "@bitsocial/voucher-challenge",
        url: "https://www.npmjs.com/package/@bitsocial/voucher-challenge",
        kind: "package",
      },
    ],
    relatedSlugs: [
      "ai-moderation-challenge",
      "captcha-canvas-challenge",
      "evm-contract-call",
      "mintpass",
    ],
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
    links: [
      {
        label: "@bitsocial/evm-contract-challenge",
        url: "https://www.npmjs.com/package/@bitsocial/evm-contract-challenge",
        kind: "package",
      },
    ],
    relatedSlugs: ["voucher-challenge", "mintpass"],
    searchTerms: ["ethereum", "token gating", "smart contract"],
  },
  {
    slug: "bitsocial-cli",
    name: "Bitsocial CLI",
    tagline: "Command-line control for nodes, communities, and automation workflows.",
    description:
      "Bitsocial CLI is the official terminal interface for the protocol. Use it to manage nodes, publish content, start a WebSocket JSON-RPC server for programmatic control and code automation, automate admin flows, and work directly against Bitsocial primitives without a GUI client.",
    category: "tools",
    tags: ["CLI", "Automation"],
    icon: "terminal",
    githubRepo: "bitsocialnet/bitsocial-cli",
    links: [
      {
        label: "@bitsocial/bitsocial-cli",
        url: "https://www.npmjs.com/package/@bitsocial/bitsocial-cli",
        kind: "package",
      },
    ],
    relatedSlugs: ["5chan-board-manager"],
    searchTerms: ["terminal", "command line", "automation"],
  },
  {
    slug: "telegram-bots",
    name: "Bitsocial Telegram Bots",
    tagline: "Feed bots that relay new Bitsocial posts into Telegram channels or groups.",
    description:
      "Bitsocial Telegram Bots monitor client community lists and forward new posts into Telegram destinations with inline links back to Bitsocial clients. The active bot covers 5chan feeds today, with the repo structured to add more client-specific bots over time.",
    category: "tools",
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
      "5chan Board Manager connects to Bitsocial CLI to help administrators create, configure, and moderate custom imageboard boards. It is the utility layer for board owners who want operational control.",
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
    app.links.filter((link) => isActionLink(link) && link.primary !== false),
    preferredPlatform,
  );
}

export function getSecondaryLinks(app: AppData, preferredPlatform?: AppPlatformSlug): AppLink[] {
  return sortAppLinks(
    app.links.filter((link) => isActionLink(link) && link.primary === false),
    preferredPlatform,
  );
}

export function getAppPlatforms(app: AppData): AppPlatformSlug[] {
  return PLATFORM_ORDER.filter((platform) => app.links.some((link) => link.platform === platform));
}

export function appMatchesPlatform(app: AppData, platform: AppPlatformSlug): boolean {
  return app.links.some((link) => link.platform === platform);
}

export function appMatchesSearch(app: AppData, query: string, t?: TFunction): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  const category = getCategoryBySlug(app.category);
  const localizedTagline = t ? getAppTagline(app, t) : app.tagline;
  const localizedDescription = t ? getAppDescription(app, t) : app.description;
  const localizedCategoryLabel = t && category ? getCategoryLabel(category, t) : category?.label;
  const localizedCategoryDescription =
    t && category ? getCategoryDescription(category, t) : category?.description;
  const localizedTags = t ? app.tags.map((tag) => getAppTagLabel(tag, t)) : app.tags;
  const localizedLinkLabels = t ? app.links.map((link) => getAppLinkLabel(link, t)) : [];
  const localizedPlatformTerms = t
    ? getAppPlatforms(app).flatMap((platform) => [
        getPlatformLabel(platform, t),
        getPlatformShortLabel(platform, t),
        getPlatformDescription(platform, t),
      ])
    : [];

  const haystack = [
    app.name,
    app.tagline,
    localizedTagline,
    app.description,
    localizedDescription,
    app.category,
    localizedCategoryLabel,
    localizedCategoryDescription,
    ...app.tags,
    ...localizedTags,
    ...app.links.map((link) => link.label),
    ...localizedLinkLabels,
    ...localizedPlatformTerms,
    ...(app.searchTerms ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function normalizeTagForFilter(s: string): string {
  return s.trim().toLowerCase();
}

function isActionLink(link: AppLink): boolean {
  return link.kind === "launch" || link.kind === "download" || link.kind === "package";
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

    const leftKindRank = APP_LINK_KIND_ORDER[left.kind];
    const rightKindRank = APP_LINK_KIND_ORDER[right.kind];
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
