import { m, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import {
  Fragment,
  memo,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import EasterEggOverlay from "@/components/easter-egg-overlay";
import { loadGsap, type TweenLike } from "@/lib/motion-runtime";

type ApproachId = "federated" | "blockchain" | "bitsocial";
type DeepComparisonServiceId =
  | "nostr"
  | "bluesky"
  | "mastodon"
  | "lemmy"
  | "farcaster"
  | "lens"
  | "deso"
  | "steemit";

type RowKey =
  | "selfHostingCost"
  | "whoKeepsOnline"
  | "scalingModel"
  | "customAntiSpam"
  | "takedownChokePoints";

const ROW_KEYS: RowKey[] = [
  "selfHostingCost",
  "whoKeepsOnline",
  "scalingModel",
  "customAntiSpam",
  "takedownChokePoints",
];

/** Static row keys (avoid dynamic template keys for tooling). */
const SANCTUARY_ROW_I18N: Record<
  RowKey,
  { label: string; federated: string; blockchain: string; bitsocial: string }
> = {
  selfHostingCost: {
    label: "sanctuary.rows.selfHostingCost.label",
    federated: "sanctuary.rows.selfHostingCost.federated",
    blockchain: "sanctuary.rows.selfHostingCost.blockchain",
    bitsocial: "sanctuary.rows.selfHostingCost.bitsocial",
  },
  whoKeepsOnline: {
    label: "sanctuary.rows.whoKeepsOnline.label",
    federated: "sanctuary.rows.whoKeepsOnline.federated",
    blockchain: "sanctuary.rows.whoKeepsOnline.blockchain",
    bitsocial: "sanctuary.rows.whoKeepsOnline.bitsocial",
  },
  scalingModel: {
    label: "sanctuary.rows.scalingModel.label",
    federated: "sanctuary.rows.scalingModel.federated",
    blockchain: "sanctuary.rows.scalingModel.blockchain",
    bitsocial: "sanctuary.rows.scalingModel.bitsocial",
  },
  customAntiSpam: {
    label: "sanctuary.rows.customAntiSpam.label",
    federated: "sanctuary.rows.customAntiSpam.federated",
    blockchain: "sanctuary.rows.customAntiSpam.blockchain",
    bitsocial: "sanctuary.rows.customAntiSpam.bitsocial",
  },
  takedownChokePoints: {
    label: "sanctuary.rows.takedownChokePoints.label",
    federated: "sanctuary.rows.takedownChokePoints.federated",
    blockchain: "sanctuary.rows.takedownChokePoints.blockchain",
    bitsocial: "sanctuary.rows.takedownChokePoints.bitsocial",
  },
};

type Approach = { id: ApproachId; label: string; subtitle: string };
type ComparisonRow = { label: string; values: Record<ApproachId, string> };
type DeepComparisonRowKey =
  | "dataLayer"
  | "browserMobile"
  | "identity"
  | "communityModel"
  | "antiSpam"
  | "replies"
  | "contentDiscovery"
  | "scalingEconomics"
  | "moderation";
type DeepComparisonSourceId =
  | "activityPubSpec"
  | "atprotoDataRepos"
  | "atprotoFeeds"
  | "atprotoFederation"
  | "atprotoIdentity"
  | "atprotoModeration"
  | "atprotoOverview"
  | "atprotoRelayOps"
  | "atprotoRepository"
  | "atprotoSelfHosting"
  | "atprotoSync"
  | "bitsocialBsoDocs"
  | "lemmyFederation"
  | "mastodonActivityPub"
  | "mastodonAccountMigration"
  | "mastodonModeration"
  | "mastodonRunServer"
  | "mastodonScaling"
  | "mastodonUserModeration"
  | "mastodonWebFinger"
  | "nip01"
  | "nip10"
  | "nip11"
  | "nip13"
  | "nip29"
  | "nip42"
  | "nip50"
  | "nip65"
  | "nip72"
  | "blueskyRateLimits"
  | "bitsocialDocs";
type DeepComparisonRow = {
  bitsocial: string;
  detail: string;
  id: DeepComparisonRowKey;
  label: string;
  service: string;
  sources: DeepComparisonSource[];
};
type DeepComparisonSource = {
  href: string;
  id: DeepComparisonSourceId;
  label: string;
  shortLabel: string;
};
type DeepComparison = {
  id: DeepComparisonServiceId;
  label: string;
  rows: DeepComparisonRow[];
};

const DEEP_COMPARISON_SERVICE_IDS: DeepComparisonServiceId[] = [
  "nostr",
  "bluesky",
  "mastodon",
  // TODO: re-enable these after their deep comparisons are researched.
  // "lemmy",
  // "farcaster",
  // "lens",
  // "deso",
  // "steemit",
];
const DEEP_COMPARISON_CONTENT_SERVICE_IDS: DeepComparisonServiceId[] = [
  "nostr",
  "bluesky",
  "mastodon",
];
const DEEP_COMPARISON_SERVICE_I18N: Record<DeepComparisonServiceId, { label: string }> = {
  nostr: { label: "sanctuary.deepComparison.services.nostr" },
  bluesky: { label: "sanctuary.deepComparison.services.bluesky" },
  mastodon: { label: "sanctuary.deepComparison.services.mastodon" },
  lemmy: { label: "sanctuary.deepComparison.services.lemmy" },
  farcaster: { label: "sanctuary.deepComparison.services.farcaster" },
  lens: { label: "sanctuary.deepComparison.services.lens" },
  deso: { label: "sanctuary.deepComparison.services.deso" },
  steemit: { label: "sanctuary.deepComparison.services.steemit" },
};
const DEEP_COMPARISON_HASH_BY_SERVICE: Record<DeepComparisonServiceId, string> = {
  nostr: "nostr-comparison",
  bluesky: "bluesky-comparison",
  mastodon: "mastodon-comparison",
  lemmy: "lemmy-comparison",
  farcaster: "farcaster-comparison",
  lens: "lens-comparison",
  deso: "deso-comparison",
  steemit: "steemit-comparison",
};
const DEEP_COMPARISON_ROW_KEYS: DeepComparisonRowKey[] = [
  "replies",
  "antiSpam",
  "scalingEconomics",
  "dataLayer",
  "moderation",
  "communityModel",
  "browserMobile",
  "identity",
  "contentDiscovery",
];
const DEEP_COMPARISON_ROW_I18N: Record<
  DeepComparisonRowKey,
  {
    bitsocial: string;
    detail: string;
    bitsocialByService?: Partial<Record<DeepComparisonServiceId, string>>;
    detailByService?: Partial<Record<DeepComparisonServiceId, string>>;
    label: string;
    services: Partial<Record<DeepComparisonServiceId, string>>;
    sources: DeepComparisonSourceId[];
    sourcesByService?: Partial<Record<DeepComparisonServiceId, DeepComparisonSourceId[]>>;
  }
> = {
  dataLayer: {
    label: "sanctuary.deepComparison.rows.dataLayer.label",
    services: {
      nostr: "sanctuary.deepComparison.rows.dataLayer.nostr",
      bluesky: "sanctuary.deepComparison.rows.dataLayer.bluesky",
      mastodon: "sanctuary.deepComparison.rows.dataLayer.mastodon",
    },
    bitsocial: "sanctuary.deepComparison.rows.dataLayer.bitsocial",
    detail: "sanctuary.deepComparison.rows.dataLayer.detail",
    detailByService: {
      bluesky: "sanctuary.deepComparison.rows.dataLayer.detailBluesky",
      mastodon: "sanctuary.deepComparison.rows.dataLayer.detailMastodon",
    },
    sources: ["nip01", "bitsocialDocs"],
    sourcesByService: {
      bluesky: ["atprotoRepository", "atprotoSync", "atprotoOverview", "bitsocialDocs"],
      mastodon: ["activityPubSpec", "mastodonActivityPub", "bitsocialDocs"],
    },
  },
  browserMobile: {
    label: "sanctuary.deepComparison.rows.browserMobile.label",
    services: {
      nostr: "sanctuary.deepComparison.rows.browserMobile.nostr",
      bluesky: "sanctuary.deepComparison.rows.browserMobile.bluesky",
      mastodon: "sanctuary.deepComparison.rows.browserMobile.mastodon",
    },
    bitsocial: "sanctuary.deepComparison.rows.browserMobile.bitsocial",
    detail: "sanctuary.deepComparison.rows.browserMobile.detail",
    detailByService: {
      bluesky: "sanctuary.deepComparison.rows.browserMobile.detailBluesky",
      mastodon: "sanctuary.deepComparison.rows.browserMobile.detailMastodon",
    },
    sources: ["nip01", "bitsocialDocs"],
    sourcesByService: {
      bluesky: ["atprotoFederation", "blueskyRateLimits", "bitsocialDocs"],
      mastodon: ["mastodonRunServer", "mastodonScaling", "bitsocialDocs"],
    },
  },
  identity: {
    label: "sanctuary.deepComparison.rows.identity.label",
    services: {
      nostr: "sanctuary.deepComparison.rows.identity.nostr",
      bluesky: "sanctuary.deepComparison.rows.identity.bluesky",
      mastodon: "sanctuary.deepComparison.rows.identity.mastodon",
    },
    bitsocial: "sanctuary.deepComparison.rows.identity.bitsocial",
    detail: "sanctuary.deepComparison.rows.identity.detail",
    detailByService: {
      bluesky: "sanctuary.deepComparison.rows.identity.detailBluesky",
      mastodon: "sanctuary.deepComparison.rows.identity.detailMastodon",
    },
    sources: ["nip01", "bitsocialDocs"],
    sourcesByService: {
      bluesky: ["atprotoIdentity", "atprotoOverview", "bitsocialBsoDocs"],
      mastodon: ["mastodonWebFinger", "mastodonAccountMigration", "bitsocialBsoDocs"],
    },
  },
  communityModel: {
    label: "sanctuary.deepComparison.rows.communityModel.label",
    services: {
      nostr: "sanctuary.deepComparison.rows.communityModel.nostr",
      bluesky: "sanctuary.deepComparison.rows.communityModel.bluesky",
      mastodon: "sanctuary.deepComparison.rows.communityModel.mastodon",
    },
    bitsocial: "sanctuary.deepComparison.rows.communityModel.bitsocial",
    detail: "sanctuary.deepComparison.rows.communityModel.detail",
    detailByService: {
      bluesky: "sanctuary.deepComparison.rows.communityModel.detailBluesky",
      mastodon: "sanctuary.deepComparison.rows.communityModel.detailMastodon",
    },
    sources: ["nip29", "nip72", "bitsocialDocs"],
    sourcesByService: {
      bluesky: ["atprotoFederation", "atprotoFeeds", "bitsocialDocs"],
      mastodon: ["mastodonActivityPub", "lemmyFederation", "bitsocialDocs"],
    },
  },
  antiSpam: {
    label: "sanctuary.deepComparison.rows.antiSpam.label",
    services: {
      nostr: "sanctuary.deepComparison.rows.antiSpam.nostr",
      bluesky: "sanctuary.deepComparison.rows.antiSpam.bluesky",
      mastodon: "sanctuary.deepComparison.rows.antiSpam.mastodon",
    },
    bitsocial: "sanctuary.deepComparison.rows.antiSpam.bitsocial",
    detail: "sanctuary.deepComparison.rows.antiSpam.detail",
    detailByService: {
      bluesky: "sanctuary.deepComparison.rows.antiSpam.detailBluesky",
      mastodon: "sanctuary.deepComparison.rows.antiSpam.detailMastodon",
    },
    sources: ["nip13", "nip42", "bitsocialDocs"],
    sourcesByService: {
      bluesky: ["atprotoModeration", "blueskyRateLimits", "bitsocialDocs"],
      mastodon: [
        "mastodonModeration",
        "mastodonUserModeration",
        "activityPubSpec",
        "bitsocialDocs",
      ],
    },
  },
  replies: {
    label: "sanctuary.deepComparison.rows.replies.label",
    services: {
      nostr: "sanctuary.deepComparison.rows.replies.nostr",
      bluesky: "sanctuary.deepComparison.rows.replies.bluesky",
      mastodon: "sanctuary.deepComparison.rows.replies.mastodon",
    },
    bitsocial: "sanctuary.deepComparison.rows.replies.bitsocial",
    detail: "sanctuary.deepComparison.rows.replies.detail",
    detailByService: {
      bluesky: "sanctuary.deepComparison.rows.replies.detailBluesky",
      mastodon: "sanctuary.deepComparison.rows.replies.detailMastodon",
    },
    sources: ["nip10", "nip72", "bitsocialDocs"],
    sourcesByService: {
      bluesky: ["blueskyRateLimits", "atprotoModeration", "bitsocialDocs"],
      mastodon: ["activityPubSpec", "mastodonModeration", "bitsocialDocs"],
    },
  },
  contentDiscovery: {
    label: "sanctuary.deepComparison.rows.contentDiscovery.label",
    services: {
      nostr: "sanctuary.deepComparison.rows.contentDiscovery.nostr",
      bluesky: "sanctuary.deepComparison.rows.contentDiscovery.bluesky",
      mastodon: "sanctuary.deepComparison.rows.contentDiscovery.mastodon",
    },
    bitsocial: "sanctuary.deepComparison.rows.contentDiscovery.bitsocial",
    detail: "sanctuary.deepComparison.rows.contentDiscovery.detail",
    detailByService: {
      bluesky: "sanctuary.deepComparison.rows.contentDiscovery.detailBluesky",
      mastodon: "sanctuary.deepComparison.rows.contentDiscovery.detailMastodon",
    },
    sources: ["nip65", "nip50", "bitsocialDocs"],
    sourcesByService: {
      bluesky: ["atprotoOverview", "atprotoFederation", "atprotoFeeds", "bitsocialDocs"],
      mastodon: ["activityPubSpec", "mastodonUserModeration", "bitsocialDocs"],
    },
  },
  scalingEconomics: {
    label: "sanctuary.deepComparison.rows.scalingEconomics.label",
    services: {
      nostr: "sanctuary.deepComparison.rows.scalingEconomics.nostr",
      bluesky: "sanctuary.deepComparison.rows.scalingEconomics.bluesky",
      mastodon: "sanctuary.deepComparison.rows.scalingEconomics.mastodon",
    },
    bitsocial: "sanctuary.deepComparison.rows.scalingEconomics.bitsocial",
    detail: "sanctuary.deepComparison.rows.scalingEconomics.detail",
    detailByService: {
      bluesky: "sanctuary.deepComparison.rows.scalingEconomics.detailBluesky",
      mastodon: "sanctuary.deepComparison.rows.scalingEconomics.detailMastodon",
    },
    sources: ["nip11", "bitsocialDocs"],
    sourcesByService: {
      bluesky: ["atprotoSelfHosting", "atprotoRelayOps", "atprotoFeeds", "bitsocialDocs"],
      mastodon: ["mastodonRunServer", "mastodonScaling", "bitsocialDocs"],
    },
  },
  moderation: {
    label: "sanctuary.deepComparison.rows.moderation.label",
    services: {
      nostr: "sanctuary.deepComparison.rows.moderation.nostr",
      bluesky: "sanctuary.deepComparison.rows.moderation.bluesky",
      mastodon: "sanctuary.deepComparison.rows.moderation.mastodon",
    },
    bitsocial: "sanctuary.deepComparison.rows.moderation.bitsocial",
    detail: "sanctuary.deepComparison.rows.moderation.detail",
    detailByService: {
      bluesky: "sanctuary.deepComparison.rows.moderation.detailBluesky",
      mastodon: "sanctuary.deepComparison.rows.moderation.detailMastodon",
    },
    sources: ["nip01", "nip29", "nip72", "bitsocialDocs"],
    sourcesByService: {
      bluesky: ["atprotoOverview", "atprotoFederation", "atprotoSelfHosting", "bitsocialDocs"],
      mastodon: ["mastodonModeration", "mastodonUserModeration", "bitsocialDocs"],
    },
  },
};
const DEEP_COMPARISON_SOURCE_LINKS: DeepComparisonSource[] = [
  {
    id: "activityPubSpec",
    label: "W3C ActivityPub specification",
    shortLabel: "ActivityPub",
    href: "https://www.w3.org/TR/activitypub/",
  },
  {
    id: "atprotoOverview",
    label: "AT Protocol overview",
    shortLabel: "ATProto Overview",
    href: "https://atproto.com/guides/overview",
  },
  {
    id: "atprotoDataRepos",
    label: "AT Protocol data repositories",
    shortLabel: "ATProto Repos",
    href: "https://atproto.com/guides/data-repos",
  },
  {
    id: "atprotoRepository",
    label: "AT Protocol repository specification",
    shortLabel: "ATProto Repository",
    href: "https://atproto.com/specs/repository",
  },
  {
    id: "atprotoSync",
    label: "AT Protocol synchronization specification",
    shortLabel: "ATProto Sync",
    href: "https://atproto.com/specs/sync",
  },
  {
    id: "atprotoFederation",
    label: "Bluesky federation architecture",
    shortLabel: "Bluesky Architecture",
    href: "https://docs.bsky.app/docs/advanced-guides/federation-architecture",
  },
  {
    id: "atprotoSelfHosting",
    label: "AT Protocol self-hosting guide",
    shortLabel: "ATProto Self-hosting",
    href: "https://atproto.com/guides/self-hosting",
  },
  {
    id: "atprotoIdentity",
    label: "AT Protocol identity guide",
    shortLabel: "ATProto Identity",
    href: "https://atproto.com/guides/identity",
  },
  {
    id: "atprotoModeration",
    label: "AT Protocol moderation guide",
    shortLabel: "ATProto Moderation",
    href: "https://atproto.com/guides/moderation",
  },
  {
    id: "atprotoFeeds",
    label: "AT Protocol custom feeds guide",
    shortLabel: "ATProto Feeds",
    href: "https://atproto.com/guides/feeds",
  },
  {
    id: "atprotoRelayOps",
    label: "AT Protocol relay operational updates",
    shortLabel: "Relay Ops",
    href: "https://atproto.com/blog/relay-ops",
  },
  {
    id: "blueskyRateLimits",
    label: "Bluesky rate limits",
    shortLabel: "Bluesky Rate Limits",
    href: "https://docs.bsky.app/docs/advanced-guides/rate-limits",
  },
  {
    id: "nip01",
    label: "NIP-01: basic relay protocol",
    shortLabel: "NIP-01",
    href: "https://github.com/nostr-protocol/nips/blob/master/01.md",
  },
  {
    id: "nip10",
    label: "NIP-10: text notes and replies",
    shortLabel: "NIP-10",
    href: "https://nips.nostr.com/10",
  },
  {
    id: "nip11",
    label: "NIP-11: relay information and limits",
    shortLabel: "NIP-11",
    href: "https://nips.nostr.com/11",
  },
  {
    id: "nip13",
    label: "NIP-13: proof-of-work spam deterrence",
    shortLabel: "NIP-13",
    href: "https://nips.nostr.com/13",
  },
  {
    id: "nip29",
    label: "NIP-29: relay-based groups",
    shortLabel: "NIP-29",
    href: "https://nips.nostr.com/29",
  },
  {
    id: "nip42",
    label: "NIP-42: relay authentication",
    shortLabel: "NIP-42",
    href: "https://nips.nostr.com/42",
  },
  {
    id: "nip50",
    label: "NIP-50: relay search",
    shortLabel: "NIP-50",
    href: "https://nips.nostr.com/50",
  },
  {
    id: "nip65",
    label: "NIP-65: relay list metadata and outbox",
    shortLabel: "NIP-65",
    href: "https://nips.nostr.com/65",
  },
  {
    id: "nip72",
    label: "NIP-72: moderated communities",
    shortLabel: "NIP-72",
    href: "https://nips.nostr.com/72",
  },
  {
    id: "bitsocialDocs",
    label: "Bitsocial Docs",
    shortLabel: "Bitsocial Docs",
    href: "/docs/peer-to-peer-protocol/",
  },
  {
    id: "bitsocialBsoDocs",
    label: "Bitsocial Docs: BSO Resolver",
    shortLabel: "Bitsocial Docs",
    href: "/docs/infrastructure/bso-resolver/",
  },
  {
    id: "mastodonActivityPub",
    label: "Mastodon ActivityPub documentation",
    shortLabel: "Mastodon ActivityPub",
    href: "https://docs.joinmastodon.org/spec/activitypub/",
  },
  {
    id: "mastodonWebFinger",
    label: "Mastodon WebFinger documentation",
    shortLabel: "Mastodon WebFinger",
    href: "https://docs.joinmastodon.org/spec/webfinger/",
  },
  {
    id: "mastodonAccountMigration",
    label: "Mastodon account migration guide",
    shortLabel: "Mastodon Migration",
    href: "https://docs.joinmastodon.org/user/moving/",
  },
  {
    id: "mastodonModeration",
    label: "Mastodon moderation actions",
    shortLabel: "Mastodon Moderation",
    href: "https://docs.joinmastodon.org/admin/moderation/",
  },
  {
    id: "mastodonUserModeration",
    label: "Mastodon user moderation controls",
    shortLabel: "Mastodon Controls",
    href: "https://docs.joinmastodon.org/user/moderating/",
  },
  {
    id: "mastodonRunServer",
    label: "Mastodon running your own server guide",
    shortLabel: "Mastodon Hosting",
    href: "https://docs.joinmastodon.org/user/run-your-own/",
  },
  {
    id: "mastodonScaling",
    label: "Mastodon scaling documentation",
    shortLabel: "Mastodon Scaling",
    href: "https://docs.joinmastodon.org/admin/scaling/",
  },
  {
    id: "lemmyFederation",
    label: "Lemmy federation documentation",
    shortLabel: "Lemmy Federation",
    href: "https://join-lemmy.org/docs/contributors/05-federation.html",
  },
];
const DEEP_COMPARISON_SOURCE_BY_ID = DEEP_COMPARISON_SOURCE_LINKS.reduce(
  (sources, source) => {
    sources[source.id] = source;
    return sources;
  },
  {} as Record<DeepComparisonSourceId, DeepComparisonSource>,
);

function getDeepComparisonHash(serviceId: DeepComparisonServiceId) {
  return `#${DEEP_COMPARISON_HASH_BY_SERVICE[serviceId]}`;
}

function getDeepComparisonServiceFromHash(hash: string): DeepComparisonServiceId | null {
  const normalizedHash = hash.replace(/^#/, "");

  return (
    DEEP_COMPARISON_SERVICE_IDS.find(
      (serviceId) => DEEP_COMPARISON_HASH_BY_SERVICE[serviceId] === normalizedHash,
    ) ?? null
  );
}

function replaceDeepComparisonHash(nextHash: string) {
  if (typeof window === "undefined" || window.location.hash === nextHash) {
    return;
  }

  window.history.replaceState(null, "", nextHash);
}

function pushDeepComparisonHash(serviceId: DeepComparisonServiceId) {
  if (typeof window === "undefined") {
    return;
  }

  const nextHash = getDeepComparisonHash(serviceId);

  if (window.location.hash === nextHash) {
    return;
  }

  window.history.pushState(null, "", nextHash);
}

function getSanctuaryDeepComparisons(t: TFunction): DeepComparison[] {
  return DEEP_COMPARISON_SERVICE_IDS.map((serviceId) => ({
    id: serviceId,
    label: t(DEEP_COMPARISON_SERVICE_I18N[serviceId].label),
    rows: DEEP_COMPARISON_ROW_KEYS.map((rowKey) => {
      const keys = DEEP_COMPARISON_ROW_I18N[rowKey];
      const serviceKey = keys.services[serviceId];
      const hasComparisonContent = DEEP_COMPARISON_CONTENT_SERVICE_IDS.includes(serviceId);
      const bitsocialKey = keys.bitsocialByService?.[serviceId] ?? keys.bitsocial;
      const detailKey = keys.detailByService?.[serviceId] ?? keys.detail;
      const sourceIds = keys.sourcesByService?.[serviceId] ?? keys.sources;

      return {
        id: rowKey,
        label: t(keys.label),
        service: serviceKey
          ? t(serviceKey)
          : t("sanctuary.deepComparison.placeholder.service", {
              service: t(DEEP_COMPARISON_SERVICE_I18N[serviceId].label),
            }),
        bitsocial: hasComparisonContent
          ? t(bitsocialKey)
          : t("sanctuary.deepComparison.placeholder.bitsocial"),
        detail: hasComparisonContent
          ? t(detailKey)
          : t("sanctuary.deepComparison.placeholder.detail", {
              service: t(DEEP_COMPARISON_SERVICE_I18N[serviceId].label),
            }),
        sources: hasComparisonContent
          ? sourceIds.map((sourceId) => DEEP_COMPARISON_SOURCE_BY_ID[sourceId])
          : [],
      };
    }),
  }));
}

function useSanctuaryComparisonData(t: TFunction) {
  return useMemo(() => {
    const approaches: Approach[] = [
      {
        id: "federated",
        label: t("sanctuary.approaches.federated.label"),
        subtitle: t("sanctuary.approaches.federated.subtitle"),
      },
      {
        id: "blockchain",
        label: t("sanctuary.approaches.blockchain.label"),
        subtitle: t("sanctuary.approaches.blockchain.subtitle"),
      },
      {
        id: "bitsocial",
        label: t("sanctuary.approaches.bitsocial.label"),
        subtitle: t("sanctuary.approaches.bitsocial.subtitle"),
      },
    ];
    const rows: ComparisonRow[] = ROW_KEYS.map((rk) => {
      const keys = SANCTUARY_ROW_I18N[rk];
      return {
        label: t(keys.label),
        values: {
          federated: t(keys.federated),
          blockchain: t(keys.blockchain),
          bitsocial: t(keys.bitsocial),
        },
      };
    });
    return { approaches, rows };
  }, [t]);
}

function useDefaultApproachIndex(approaches: Approach[]) {
  return useMemo(
    () =>
      Math.max(
        0,
        approaches.findIndex(({ id }) => id === "bitsocial"),
      ),
    [approaches],
  );
}
const MOBILE_CARD_SIDE_PEEK_CLASS = "w-9";
const MOBILE_CARD_FOCUS_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.9,
};
const MOBILE_SCROLL_SETTLE_DELAY_MS = 96;
const MOBILE_TAB_SCROLL_BASE_DURATION_S = 0.2;
const MOBILE_TAB_SCROLL_MAX_DURATION_S = 0.44;
const MOBILE_TAB_SCROLL_DISTANCE_FACTOR = 2600;

const ComparisonCardContent = memo(function ComparisonCardContent({
  approach,
  rows,
  isBitsocial,
}: {
  approach: Approach;
  rows: ComparisonRow[];
  isBitsocial: boolean;
}) {
  return (
    <>
      <div className="mb-4 pb-3 border-b border-[var(--glass-border-subtle)]">
        <h3 className="text-base md:text-lg font-display font-semibold">{approach.label}</h3>
        <p className="text-xs text-muted-foreground/60">{approach.subtitle}</p>
      </div>
      <div className="space-y-3.5">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground/50 mb-0.5">
              {row.label}
            </p>
            <div className="flex gap-2 items-start">
              {isBitsocial ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" aria-hidden />
              ) : (
                <X className="h-4 w-4 shrink-0 text-red-500 mt-0.5" aria-hidden />
              )}
              <p
                className={`text-sm font-medium min-w-0 ${
                  isBitsocial ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {row.values[approach.id]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
});

const ComparisonCard = memo(function ComparisonCard({
  approach,
  rows,
  isBitsocial,
}: {
  approach: Approach;
  rows: ComparisonRow[];
  isBitsocial: boolean;
}) {
  return (
    <div
      className={`glass-card p-5 md:p-7 h-full ${
        isBitsocial ? "border !border-blue-glow shadow-[0_0_28px_rgba(37,99,235,0.28)]" : ""
      }`}
    >
      <ComparisonCardContent approach={approach} rows={rows} isBitsocial={isBitsocial} />
    </div>
  );
});

const NoJsMobileComparisonList = memo(function NoJsMobileComparisonList({
  approaches,
  rows,
}: {
  approaches: Approach[];
  rows: ComparisonRow[];
}) {
  return (
    <div className="space-y-3 md:hidden">
      {approaches.map((approach, index) => {
        const isBitsocial = approach.id === "bitsocial";

        return (
          <details
            key={approach.id}
            className={`glass-card overflow-hidden ${isBitsocial ? "border !border-blue-glow" : ""}`}
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {isBitsocial ? (
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  ) : (
                    <X className="h-4 w-4 shrink-0 text-red-500" aria-hidden />
                  )}
                  <h3 className="text-base font-display font-semibold text-foreground">
                    {approach.label}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground/70">{approach.subtitle}</p>
              </div>
              <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" />
            </summary>

            <div className="border-t border-[var(--glass-border-subtle)] px-5 pb-5 pt-4">
              <div className="space-y-3.5">
                {rows.map((row) => (
                  <div key={row.label}>
                    <p className="mb-0.5 text-xs uppercase tracking-wider text-muted-foreground/50">
                      {row.label}
                    </p>
                    <div className="flex items-start gap-2">
                      {isBitsocial ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                      )}
                      <p
                        className={`min-w-0 text-sm font-medium ${
                          isBitsocial ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {row.values[approach.id]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
});

const MobileComparisonCarousel = memo(function MobileComparisonCarousel({
  approaches,
  rows,
  defaultApproachIndex,
}: {
  approaches: Approach[];
  rows: ComparisonRow[];
  defaultApproachIndex: number;
}) {
  const [activeIndex, setActiveIndex] = useState(defaultApproachIndex);
  const [highlightedIndex, setHighlightedIndex] = useState(defaultApproachIndex);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollSettleTimeoutRef = useRef<number | null>(null);
  const scrollTweenRef = useRef<TweenLike | null>(null);
  const scrollAnimationRequestRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const getPanels = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return [];
    }

    return Array.from(carousel.querySelectorAll<HTMLDivElement>("[role='tabpanel']"));
  }, []);

  const getPanelScrollLeft = useCallback(
    (nextIndex: number) => {
      const carousel = carouselRef.current;
      if (!carousel) {
        return 0;
      }

      const panel = getPanels()[nextIndex];
      if (!panel) {
        return 0;
      }

      return Math.max(0, panel.offsetLeft - (carousel.clientWidth - panel.offsetWidth) / 2);
    },
    [getPanels],
  );

  const clampIndex = useCallback(
    (nextIndex: number) => Math.max(0, Math.min(approaches.length - 1, nextIndex)),
    [approaches.length],
  );

  const getClosestIndex = useCallback(
    (scrollLeft: number) => {
      const carousel = carouselRef.current;
      if (!carousel || carousel.clientWidth === 0) {
        return 0;
      }

      const panelOffsets = getPanels().map((panel) =>
        Math.max(0, panel.offsetLeft - (carousel.clientWidth - panel.offsetWidth) / 2),
      );
      if (panelOffsets.length === 0) {
        return 0;
      }

      return clampIndex(
        panelOffsets.reduce((closestIndex, panelOffset, index) => {
          const closestOffset = panelOffsets[closestIndex] ?? Number.POSITIVE_INFINITY;

          return Math.abs(panelOffset - scrollLeft) < Math.abs(closestOffset - scrollLeft)
            ? index
            : closestIndex;
        }, 0),
      );
    },
    [clampIndex, getPanels],
  );

  const scrollToIndex = useCallback(
    (nextIndex: number, behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth") => {
      const carousel = carouselRef.current;
      if (!carousel) {
        return;
      }

      const boundedIndex = clampIndex(nextIndex);

      carousel.scrollTo({
        left: getPanelScrollLeft(boundedIndex),
        behavior,
      });
    },
    [clampIndex, getPanelScrollLeft, prefersReducedMotion],
  );

  const clearScrollSettleTimeout = useCallback(() => {
    if (scrollSettleTimeoutRef.current !== null) {
      window.clearTimeout(scrollSettleTimeoutRef.current);
      scrollSettleTimeoutRef.current = null;
    }
  }, []);

  const cancelScrollAnimation = useCallback(() => {
    scrollAnimationRequestRef.current += 1;
    scrollTweenRef.current?.kill();
    scrollTweenRef.current = null;

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.style.scrollSnapType = "";
    }
  }, []);

  const animateToIndex = useCallback(
    (nextIndex: number) => {
      const carousel = carouselRef.current;
      if (!carousel) {
        return;
      }

      const boundedIndex = clampIndex(nextIndex);
      const targetScrollLeft = getPanelScrollLeft(boundedIndex);

      if (Math.abs(targetScrollLeft - carousel.scrollLeft) < 1) {
        setHighlightedIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        setActiveIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        return;
      }

      const distance = Math.abs(targetScrollLeft - carousel.scrollLeft);
      const duration = Math.min(
        MOBILE_TAB_SCROLL_MAX_DURATION_S,
        MOBILE_TAB_SCROLL_BASE_DURATION_S + distance / MOBILE_TAB_SCROLL_DISTANCE_FACTOR,
      );

      setPendingIndex((currentIndex) =>
        currentIndex === boundedIndex ? currentIndex : boundedIndex,
      );
      clearScrollSettleTimeout();
      cancelScrollAnimation();
      carousel.style.scrollSnapType = "none";
      const animationRequest = scrollAnimationRequestRef.current;

      void loadGsap()
        .then((gsap) => {
          if (!gsap || scrollAnimationRequestRef.current !== animationRequest) {
            carousel.style.scrollSnapType = "";
            setPendingIndex(null);
            return;
          }

          scrollTweenRef.current = gsap.to(carousel, {
            scrollLeft: targetScrollLeft,
            duration,
            ease: "power2.out",
            overwrite: true,
            onComplete: () => {
              if (scrollAnimationRequestRef.current !== animationRequest) {
                return;
              }

              carousel.style.scrollSnapType = "";
              scrollTweenRef.current = null;
              setPendingIndex(null);
              setHighlightedIndex((currentIndex) =>
                currentIndex === boundedIndex ? currentIndex : boundedIndex,
              );
              setActiveIndex((currentIndex) =>
                currentIndex === boundedIndex ? currentIndex : boundedIndex,
              );
            },
          });
        })
        .catch(() => {
          if (scrollAnimationRequestRef.current !== animationRequest) {
            return;
          }

          carousel.style.scrollSnapType = "";
          scrollTweenRef.current = null;
          setPendingIndex(null);
          scrollToIndex(boundedIndex, "smooth");
          setHighlightedIndex((currentIndex) =>
            currentIndex === boundedIndex ? currentIndex : boundedIndex,
          );
          setActiveIndex((currentIndex) =>
            currentIndex === boundedIndex ? currentIndex : boundedIndex,
          );
        });
    },
    [
      cancelScrollAnimation,
      clampIndex,
      clearScrollSettleTimeout,
      getPanelScrollLeft,
      scrollToIndex,
    ],
  );

  const setPage = useCallback(
    (nextIndex: number, behavior?: ScrollBehavior) => {
      const boundedIndex = clampIndex(nextIndex);

      if (behavior === "auto" || prefersReducedMotion) {
        setPendingIndex(null);
        setHighlightedIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        setActiveIndex((currentIndex) =>
          currentIndex === boundedIndex ? currentIndex : boundedIndex,
        );
        clearScrollSettleTimeout();
        cancelScrollAnimation();
        scrollToIndex(boundedIndex, "auto");
        return;
      }

      animateToIndex(boundedIndex);
    },
    [
      animateToIndex,
      cancelScrollAnimation,
      clampIndex,
      clearScrollSettleTimeout,
      prefersReducedMotion,
      scrollToIndex,
    ],
  );

  const syncActiveIndex = useCallback(() => {
    scrollSettleTimeoutRef.current = null;

    const carousel = carouselRef.current;
    if (!carousel || carousel.clientWidth === 0 || scrollTweenRef.current) {
      return;
    }

    const nextIndex = getClosestIndex(carousel.scrollLeft);

    startTransition(() => {
      setPendingIndex(null);
      setHighlightedIndex((currentIndex) =>
        currentIndex === nextIndex ? currentIndex : nextIndex,
      );
      setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
    });
  }, [getClosestIndex]);

  const handleScroll = useCallback(() => {
    if (scrollTweenRef.current) {
      return;
    }

    const carousel = carouselRef.current;
    if (carousel) {
      const nextIndex = getClosestIndex(carousel.scrollLeft);

      startTransition(() => {
        setHighlightedIndex((currentIndex) =>
          currentIndex === nextIndex ? currentIndex : nextIndex,
        );
      });
    }

    clearScrollSettleTimeout();
    scrollSettleTimeoutRef.current = window.setTimeout(
      syncActiveIndex,
      MOBILE_SCROLL_SETTLE_DELAY_MS,
    );
  }, [clearScrollSettleTimeout, getClosestIndex, syncActiveIndex]);

  const handlePointerDownCapture = useCallback(() => {
    setPendingIndex(null);
    clearScrollSettleTimeout();
    cancelScrollAnimation();
  }, [cancelScrollAnimation, clearScrollSettleTimeout]);

  useLayoutEffect(() => {
    scrollToIndex(defaultApproachIndex, "auto");
  }, [scrollToIndex, defaultApproachIndex]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setPage(activeIndex, "auto");
    });

    observer.observe(carousel);

    return () => {
      observer.disconnect();
    };
  }, [activeIndex, setPage]);

  useEffect(() => {
    return () => {
      clearScrollSettleTimeout();
      cancelScrollAnimation();
    };
  }, [cancelScrollAnimation, clearScrollSettleTimeout]);

  return (
    <m.div
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="md:hidden"
    >
      <div className="flex gap-1.5 justify-center mb-5" role="tablist">
        {approaches.map((approach, index) => (
          <button
            key={approach.id}
            role="tab"
            aria-selected={highlightedIndex === index}
            aria-controls={`panel-${approach.id}`}
            id={`tab-${approach.id}`}
            onClick={() => setPage(index)}
            className={`px-4 py-2 rounded-full border border-transparent text-xs font-display font-medium transition-colors duration-200 motion-reduce:transition-none ${
              (pendingIndex ?? highlightedIndex) === index
                ? approach.id === "bitsocial"
                  ? "bg-blue-core text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                  : "glass-card text-foreground"
                : approach.id === "bitsocial"
                  ? "border-blue-core/30 bg-blue-core/10 text-blue-glow hover:bg-blue-core/15 hover:border-blue-glow"
                  : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {approach.label}
          </button>
        ))}
      </div>

      <div className="-mx-6 overflow-visible">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          onPointerDownCapture={handlePointerDownCapture}
          className="overflow-x-auto overscroll-x-contain snap-x snap-mandatory py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex items-stretch gap-3">
            <div aria-hidden className={`${MOBILE_CARD_SIDE_PEEK_CLASS} shrink-0`} />
            {approaches.map((approach, index) => {
              const isActive = activeIndex === index;

              return (
                <m.div
                  key={approach.id}
                  id={`panel-${approach.id}`}
                  role="tabpanel"
                  aria-hidden={!isActive}
                  aria-labelledby={`tab-${approach.id}`}
                  animate={{ scale: isActive ? 1 : 0.985 }}
                  transition={prefersReducedMotion ? { duration: 0 } : MOBILE_CARD_FOCUS_TRANSITION}
                  className="w-[calc(100vw-4.5rem)] shrink-0 snap-center px-2 transform-gpu"
                >
                  <ComparisonCard
                    approach={approach}
                    rows={rows}
                    isBitsocial={approach.id === "bitsocial"}
                  />
                </m.div>
              );
            })}
            <div aria-hidden className={`${MOBILE_CARD_SIDE_PEEK_CLASS} shrink-0`} />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-4" aria-hidden>
        {approaches.map((approach, index) => (
          <button
            key={approach.id}
            tabIndex={-1}
            aria-label={approach.label}
            onClick={() => setPage(index)}
            className={`h-1.5 w-6 origin-center rounded-full transform-gpu transition-[transform,background-color,opacity] duration-200 motion-reduce:transition-none ${
              index === highlightedIndex
                ? "scale-x-100 bg-blue-glow"
                : "scale-x-[0.25] bg-muted-foreground/20 hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </m.div>
  );
});

type DeepComparisonSide = "service" | "bitsocial";

function getDeepComparisonCellClass(side: DeepComparisonSide) {
  if (side === "bitsocial") {
    return "border-emerald-500/30 bg-emerald-500/[0.07] text-foreground dark:border-emerald-400/45 dark:bg-emerald-500/[0.12]";
  }

  return "border-red-500/25 bg-red-500/[0.04] text-foreground dark:border-red-400/45 dark:bg-red-500/[0.09]";
}

function DeepComparisonResultIcon({ side }: { side: DeepComparisonSide }) {
  if (side === "bitsocial") {
    return <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />;
  }

  return <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />;
}

function DeepComparisonSourceLinks({
  sources,
  t,
}: {
  sources: DeepComparisonSource[];
  t: TFunction;
}) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="font-display text-[0.68rem] font-normal leading-none text-foreground/75">
        {t("sanctuary.deepComparison.sourcesLabel")}
      </span>
      {sources.map((source) => {
        const isExternal = source.href.startsWith("http");

        return (
          <a
            key={source.href}
            href={source.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            title={source.label}
            className="ring-glow cta-glow rounded-full border border-blue-core/20 bg-blue-core/[0.06] px-2 py-1 text-[0.68rem] font-display font-semibold leading-none text-foreground/75 hover:border-blue-glow hover:bg-blue-core/[0.12] hover:text-foreground dark:border-blue-core/35 dark:bg-blue-core/[0.14] dark:text-foreground/80 dark:hover:border-blue-glow dark:hover:bg-blue-core/[0.2] motion-reduce:transition-none"
          >
            {source.shortLabel}
          </a>
        );
      })}
    </div>
  );
}

function DeepComparisonExpandButton({
  className = "mt-3",
  controls,
  expanded,
  onClick,
  t,
}: {
  className?: string;
  controls: string;
  expanded: boolean;
  onClick: () => void;
  t: TFunction;
}) {
  return (
    <button
      type="button"
      aria-controls={controls}
      aria-expanded={expanded}
      data-expanded={expanded ? "true" : undefined}
      onClick={onClick}
      className={`${className} ring-glow cta-glow flex w-fit items-center gap-1.5 rounded-full border border-blue-core/30 bg-blue-core/[0.07] px-3 py-1.5 text-[0.72rem] font-display font-semibold text-foreground/80 hover:border-blue-glow hover:bg-blue-core/[0.13] hover:text-foreground active:border-blue-core/45 active:bg-blue-core/[0.12] data-[expanded=true]:border-blue-core/45 data-[expanded=true]:bg-blue-core/[0.12] data-[expanded=true]:hover:border-blue-glow data-[expanded=true]:hover:bg-blue-core/[0.13] dark:border-blue-core/45 dark:bg-blue-core/[0.18] dark:text-foreground/85 dark:hover:border-blue-glow dark:hover:bg-blue-core/[0.24] dark:data-[expanded=true]:border-blue-core/45 dark:data-[expanded=true]:bg-blue-glow/[0.08] dark:data-[expanded=true]:hover:border-blue-glow dark:data-[expanded=true]:hover:bg-blue-core/[0.24] [&:focus-within:not(:focus-visible)]:border-blue-core/40 [&:focus:not(:focus-visible)]:border-blue-core/40 [&:focus-within:not(:focus-visible):hover]:border-blue-glow [&:focus:not(:focus-visible):hover]:border-blue-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none`}
    >
      {expanded ? t("sanctuary.deepComparison.collapse") : t("sanctuary.deepComparison.expand")}
      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform duration-300 motion-reduce:transition-none ${
          expanded ? "rotate-180" : ""
        }`}
        aria-hidden
      />
    </button>
  );
}

function DeepComparisonOverlay({
  comparison,
  open,
  onOpenChange,
  t,
}: {
  comparison: DeepComparison;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: TFunction;
}) {
  const title = t("sanctuary.deepComparison.modalTitle", { service: comparison.label });
  const [expandedRows, setExpandedRows] = useState<ReadonlySet<DeepComparisonRowKey>>(
    () => new Set(),
  );
  const toggleExpandedRow = (rowId: DeepComparisonRowKey) => {
    setExpandedRows((currentRows) => {
      const nextRows = new Set(currentRows);

      if (nextRows.has(rowId)) {
        nextRows.delete(rowId);
      } else {
        nextRows.add(rowId);
      }

      return nextRows;
    });
  };

  return (
    <EasterEggOverlay
      ariaLabel={title}
      contentInitialScale={1}
      contentClassName="glass-card deep-comparison-modal-surface max-h-[88vh] w-[min(1180px,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain !rounded-[1.75rem] p-5 shadow-[0_0_40px_rgba(37,99,235,0.2)] [scrollbar-width:none] dark:shadow-[0_24px_80px_rgba(0,0,0,0.48)] sm:p-6 md:p-8 [&::-webkit-scrollbar]:hidden"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex items-start justify-between gap-4 border-b border-[var(--glass-border-subtle)] pb-5">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-display font-semibold uppercase tracking-[0.18em] text-blue-glow">
            {t("sanctuary.deepComparison.modalEyebrow")}
          </p>
          <h3 className="-ml-px text-2xl font-display font-semibold leading-tight text-foreground md:text-3xl">
            {title}
          </h3>
        </div>
        <button
          type="button"
          aria-label={t("sanctuary.deepComparison.close")}
          onClick={() => onOpenChange(false)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border-subtle)] bg-background/70 text-muted-foreground transition-[border-color,color,box-shadow] duration-300 hover:border-blue-glow hover:text-foreground hover:shadow-[0_0_16px_rgba(37,99,235,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-muted/60 dark:text-foreground/70 motion-reduce:transition-none"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-6 space-y-3 md:hidden">
        {comparison.rows.map((row) => {
          const detailId = `${comparison.id}-${row.id}-mobile-detail`;
          const expanded = expandedRows.has(row.id);

          return (
            <section
              key={row.id}
              className="overflow-hidden rounded-[1.25rem] border border-[var(--glass-border-subtle)] dark:bg-background/35"
            >
              <div className="bg-blue-core/10 px-4 py-3 dark:bg-muted/55">
                <h4 className="text-sm font-display font-semibold text-foreground">{row.label}</h4>
              </div>
              <div className="space-y-2 px-4 py-3">
                <div
                  className={`rounded-[1rem] border p-3 ${getDeepComparisonCellClass("service")}`}
                >
                  <p className="mb-1 text-xs font-display font-semibold uppercase tracking-[0.16em]">
                    {comparison.label}
                  </p>
                  <div className="flex items-start gap-2">
                    <DeepComparisonResultIcon side="service" />
                    <p className="text-sm leading-relaxed">{row.service}</p>
                  </div>
                </div>
                <div
                  className={`rounded-[1rem] border p-3 ${getDeepComparisonCellClass("bitsocial")}`}
                >
                  <p className="mb-1 text-xs font-display font-semibold uppercase tracking-[0.16em]">
                    {t("sanctuary.deepComparison.table.bitsocial")}
                  </p>
                  <div className="flex items-start gap-2">
                    <DeepComparisonResultIcon side="bitsocial" />
                    <p className="text-sm leading-relaxed">{row.bitsocial}</p>
                  </div>
                </div>
                {expanded ? (
                  <div
                    id={detailId}
                    className="rounded-[1rem] border border-blue-core/20 bg-blue-core/[0.06] p-3 dark:border-[var(--glass-border-subtle)] dark:bg-muted/45"
                  >
                    <p className="text-sm leading-relaxed text-foreground">{row.detail}</p>
                    <DeepComparisonSourceLinks sources={row.sources} t={t} />
                  </div>
                ) : null}
              </div>
              <div className="px-4 pb-4">
                <DeepComparisonExpandButton
                  className=""
                  controls={detailId}
                  expanded={expanded}
                  onClick={() => toggleExpandedRow(row.id)}
                  t={t}
                />
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-[1.25rem] border border-[var(--glass-border-subtle)] dark:bg-background/35 md:block">
        <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
          <caption className="sr-only">
            {t("sanctuary.deepComparison.tableCaption", { service: comparison.label })}
          </caption>
          <thead>
            <tr className="bg-blue-core/10 dark:bg-muted/55">
              <th
                scope="col"
                className="w-[24%] px-4 py-3 text-xs font-display font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                {t("sanctuary.deepComparison.table.topic")}
              </th>
              <th
                scope="col"
                className="w-[38%] px-4 py-3 text-xs font-display font-semibold uppercase tracking-[0.16em] text-foreground"
              >
                {comparison.label}
              </th>
              <th
                scope="col"
                className="w-[38%] px-4 py-3 text-xs font-display font-semibold uppercase tracking-[0.16em] text-blue-glow"
              >
                {t("sanctuary.deepComparison.table.bitsocial")}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => {
              const detailId = `${comparison.id}-${row.id}-detail`;
              const expanded = expandedRows.has(row.id);

              return (
                <Fragment key={row.id}>
                  <tr className="border-t border-[var(--glass-border-subtle)] align-top">
                    <th scope="row" className="px-4 py-4 text-sm font-display text-foreground">
                      <div className="flex flex-col items-start gap-3">
                        <span className="font-semibold">{row.label}</span>
                        <div>
                          <DeepComparisonExpandButton
                            className=""
                            controls={detailId}
                            expanded={expanded}
                            onClick={() => toggleExpandedRow(row.id)}
                            t={t}
                          />
                        </div>
                      </div>
                    </th>
                    <td className="px-4 py-4 text-sm leading-relaxed">
                      <div
                        className={`rounded-[1rem] border p-3 ${getDeepComparisonCellClass("service")}`}
                      >
                        <div className="flex items-start gap-2">
                          <DeepComparisonResultIcon side="service" />
                          <p>{row.service}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm leading-relaxed">
                      <div
                        className={`rounded-[1rem] border p-3 ${getDeepComparisonCellClass("bitsocial")}`}
                      >
                        <div className="flex items-start gap-2">
                          <DeepComparisonResultIcon side="bitsocial" />
                          <p>{row.bitsocial}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {expanded ? (
                    <tr
                      id={detailId}
                      className="border-t border-blue-core/10 bg-blue-core/[0.035] dark:border-[var(--glass-border-subtle)] dark:bg-muted/45"
                    >
                      <td colSpan={3} className="px-4 py-4">
                        <p className="text-sm leading-relaxed text-foreground">{row.detail}</p>
                        <DeepComparisonSourceLinks sources={row.sources} t={t} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </EasterEggOverlay>
  );
}

function DeepComparisonServiceSelect({
  comparisons,
  onServiceChange,
  selectedService,
}: {
  comparisons: DeepComparison[];
  onServiceChange: (serviceId: DeepComparisonServiceId) => void;
  selectedService: DeepComparisonServiceId;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = Math.max(
    0,
    comparisons.findIndex(({ id }) => id === selectedService),
  );
  const activeComparison = comparisons[Math.min(activeIndex, comparisons.length - 1)];
  const selectedComparison = comparisons[selectedIndex] ?? comparisons[0];
  const listboxId = "sanctuary-deep-comparison-service-listbox";

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && rootRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  const openListbox = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const selectComparison = (serviceId: DeepComparisonServiceId) => {
    onServiceChange(serviceId);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (comparisons.length === 0) {
      return;
    }

    if (!open) {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openListbox();
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((currentIndex) => {
        const nextIndex = currentIndex + direction;

        if (nextIndex < 0) {
          return comparisons.length - 1;
        }

        if (nextIndex >= comparisons.length) {
          return 0;
        }

        return nextIndex;
      });
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : comparisons.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (activeComparison) {
        selectComparison(activeComparison.id);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative min-w-[10rem]">
      <button
        ref={triggerRef}
        id="sanctuary-deep-comparison-service"
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        data-expanded={open ? "true" : undefined}
        aria-activedescendant={
          open && activeComparison
            ? `sanctuary-deep-comparison-service-${activeComparison.id}`
            : undefined
        }
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }

          openListbox();
        }}
        className="ring-glow cta-glow flex h-11 w-full min-w-[10rem] items-center justify-between gap-3 rounded-full border border-blue-core/30 bg-blue-core/10 py-0 pl-4 pr-3 text-left text-sm font-display font-semibold text-foreground shadow-[inset_0_0_0_1px_rgba(37,99,235,0.08)] hover:border-blue-glow hover:bg-blue-core/15 active:border-blue-core/45 active:bg-blue-core/[0.12] data-[expanded=true]:border-blue-glow data-[expanded=true]:bg-blue-core/[0.12] data-[expanded=true]:hover:border-blue-glow data-[expanded=true]:hover:bg-blue-core/15 [&:focus:not(:focus-visible)]:border-blue-glow focus-visible:border-blue-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-blue-core/45 dark:bg-blue-core/[0.18] dark:hover:border-blue-glow dark:hover:bg-blue-core/[0.24] dark:active:border-blue-core/45 dark:active:bg-blue-core/[0.12] dark:data-[expanded=true]:border-blue-glow dark:data-[expanded=true]:bg-blue-glow/[0.08] dark:data-[expanded=true]:hover:border-blue-glow dark:data-[expanded=true]:hover:bg-blue-core/[0.24] dark:[&:focus:not(:focus-visible)]:border-blue-glow motion-reduce:transition-none sm:w-auto"
      >
        <span className="truncate">{selectedComparison?.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-blue-glow transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby="sanctuary-deep-comparison-service"
          className="absolute left-0 right-0 top-full z-30 mt-2 flex max-h-72 flex-col gap-2 overflow-y-auto rounded-[1.25rem] border border-blue-core/25 bg-background/95 p-2 text-left shadow-[0_16px_40px_rgba(0,0,0,0.24),0_0_24px_rgba(37,99,235,0.14)] [scrollbar-width:none] backdrop-blur-md dark:border-[var(--glass-border-subtle)] dark:bg-card dark:shadow-[0_20px_45px_rgba(0,0,0,0.42)] sm:right-auto sm:min-w-full [&::-webkit-scrollbar]:hidden"
        >
          {comparisons.map((comparison, index) => {
            const selected = comparison.id === selectedService;
            const active = index === activeIndex;

            return (
              <button
                key={comparison.id}
                id={`sanctuary-deep-comparison-service-${comparison.id}`}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => selectComparison(comparison.id)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-display font-semibold transition-all duration-200 motion-reduce:transition-none ${
                  selected
                    ? "border-blue-glow bg-blue-glow/[0.08] text-foreground hover:border-blue-glow hover:bg-blue-glow/[0.12]"
                    : active
                      ? "border-foreground/[0.16] bg-foreground/[0.08] text-foreground"
                      : "border-foreground/[0.06] bg-foreground/[0.03] text-muted-foreground hover:border-foreground/[0.12] hover:bg-foreground/[0.07] hover:text-foreground"
                }`}
              >
                <span>{comparison.label}</span>
                {selected ? <Check className="h-4 w-4 shrink-0 text-blue-glow" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function SanctuaryCommunication() {
  const { t } = useTranslation();
  const { approaches, rows } = useSanctuaryComparisonData(t);
  const defaultApproachIndex = useDefaultApproachIndex(approaches);
  const deepComparisons = getSanctuaryDeepComparisons(t);
  const [deepComparisonState, setDeepComparisonState] = useState<{
    open: boolean;
    selectedService: DeepComparisonServiceId;
  }>(() => ({ open: false, selectedService: "nostr" }));
  const selectedDeepService = deepComparisonState.selectedService;
  const deepComparisonOpen = deepComparisonState.open;
  const selectedDeepComparison =
    deepComparisons.find(({ id }) => id === selectedDeepService) ?? deepComparisons[0];
  const openDeepComparison = useCallback((serviceId: DeepComparisonServiceId) => {
    setDeepComparisonState({ open: true, selectedService: serviceId });
    pushDeepComparisonHash(serviceId);
  }, []);
  const handleSelectedDeepServiceChange = useCallback((serviceId: DeepComparisonServiceId) => {
    setDeepComparisonState((currentState) => ({
      ...currentState,
      selectedService: serviceId,
    }));
  }, []);
  const handleDeepComparisonOpenChange = useCallback((nextOpen: boolean) => {
    setDeepComparisonState((currentState) => ({ ...currentState, open: nextOpen }));

    if (
      !nextOpen &&
      typeof window !== "undefined" &&
      getDeepComparisonServiceFromHash(window.location.hash)
    ) {
      replaceDeepComparisonHash("#sanctuary-communication");
    }
  }, []);
  const noJsMobileApproaches = useMemo(() => {
    const bitsocialApproach = approaches.find(({ id }) => id === "bitsocial");
    const otherApproaches = approaches.filter(({ id }) => id !== "bitsocial");

    return bitsocialApproach ? [bitsocialApproach, ...otherApproaches] : approaches;
  }, [approaches]);
  useEffect(() => {
    const syncDeepComparisonHash = () => {
      const serviceId = getDeepComparisonServiceFromHash(window.location.hash);

      if (!serviceId) {
        setDeepComparisonState((currentState) =>
          currentState.open ? { ...currentState, open: false } : currentState,
        );
        return;
      }

      setDeepComparisonState((currentState) =>
        currentState.open && currentState.selectedService === serviceId
          ? currentState
          : { open: true, selectedService: serviceId },
      );
    };

    syncDeepComparisonHash();
    window.addEventListener("hashchange", syncDeepComparisonHash);
    window.addEventListener("popstate", syncDeepComparisonHash);

    return () => {
      window.removeEventListener("hashchange", syncDeepComparisonHash);
      window.removeEventListener("popstate", syncDeepComparisonHash);
    };
  }, []);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section label — reads last (smallest, muted) per visual hierarchy principle */}
        <div
          id="sanctuary-communication"
          data-home-section-label
          className="scroll-mt-[99px] md:scroll-mt-[103px]"
        >
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="block text-xs md:text-sm font-display tracking-[0.2em] uppercase text-center mb-6 text-muted-foreground/50"
          >
            <a
              data-sanctuary-label
              href="#sanctuary-communication"
              className="rounded-md transition-[color,box-shadow] duration-300 hover:text-muted-foreground/70"
            >
              {t("sanctuary.sectionLabel")}
            </a>
          </m.div>
        </div>

        {/* Hero statement — reads first (biggest, boldest) */}
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-center mb-6 text-balance leading-[1.1] text-muted-foreground"
        >
          {t("sanctuary.headline")}
        </m.h2>

        {/* Supporting text — reads second */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-16 text-balance leading-relaxed"
        >
          {t("sanctuary.supporting")}
        </m.p>

        <div className="js-only md:hidden">
          <MobileComparisonCarousel
            approaches={approaches}
            rows={rows}
            defaultApproachIndex={defaultApproachIndex}
          />
        </div>
        <noscript>
          <NoJsMobileComparisonList approaches={noJsMobileApproaches} rows={rows} />
        </noscript>

        {/* ---- Desktop: three-column grid ---- */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {approaches.map((a, i) => (
            <m.div
              key={a.id}
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              <ComparisonCard approach={a} rows={rows} isBitsocial={a.id === "bitsocial"} />
            </m.div>
          ))}
        </div>

        {selectedDeepComparison ? (
          <>
            {deepComparisons.map((comparison) => (
              <span
                key={comparison.id}
                id={DEEP_COMPARISON_HASH_BY_SERVICE[comparison.id]}
                className="block scroll-mt-[99px] md:scroll-mt-[103px]"
                aria-hidden="true"
              />
            ))}
            <m.form
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="glass-card mx-auto mt-10 flex w-fit max-w-[calc(100vw-3rem)] flex-col items-stretch justify-center gap-3 !rounded-[1.75rem] p-3 text-center sm:flex-row sm:items-center sm:!rounded-full sm:pl-5"
              onSubmit={(event) => {
                event.preventDefault();
                openDeepComparison(selectedDeepService);
              }}
            >
              <label
                htmlFor="sanctuary-deep-comparison-service"
                className="px-2 text-sm font-display font-semibold text-muted-foreground dark:text-foreground/80 sm:px-0"
              >
                {t("sanctuary.deepComparison.prompt")}
              </label>
              <DeepComparisonServiceSelect
                comparisons={deepComparisons}
                selectedService={selectedDeepService}
                onServiceChange={handleSelectedDeepServiceChange}
              />
              <button
                type="submit"
                className="ring-glow cta-glow inline-flex h-11 items-center justify-center gap-2 rounded-full border border-blue-core/30 bg-blue-core/[0.08] px-5 text-sm font-display font-semibold text-foreground/90 transition-[box-shadow,border-color,background-color,color,opacity] duration-300 hover:border-blue-glow hover:bg-blue-core/[0.14] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-blue-core/45 dark:bg-blue-core/[0.18] dark:hover:bg-blue-core/[0.24] motion-reduce:transition-none"
              >
                {t("sanctuary.deepComparison.go")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </m.form>
            <DeepComparisonOverlay
              comparison={selectedDeepComparison}
              open={deepComparisonOpen}
              onOpenChange={handleDeepComparisonOpenChange}
              t={t}
            />
          </>
        ) : null}

        {/* Founder attribution */}
        <m.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="block text-center text-xs md:text-sm text-muted-foreground/40 mt-14 italic max-w-lg mx-auto"
        >
          &ldquo;{t("sanctuary.quote")}&rdquo;
          <span className="not-italic block mt-1">{t("sanctuary.quoteAttribution")}</span>
        </m.blockquote>
      </div>
    </section>
  );
}
