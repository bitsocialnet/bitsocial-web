export const DOCS_SITE_URL = "https://docs.bitsocial.net" as const;

export const DOCS_LINKS = {
  home: `${DOCS_SITE_URL}/`,
  search: `${DOCS_SITE_URL}/search/`,
  peerToPeerProtocol: `${DOCS_SITE_URL}/peer-to-peer-protocol/`,
  customChallenges: `${DOCS_SITE_URL}/custom-challenges/`,
  localModeration: `${DOCS_SITE_URL}/local-moderation/`,
  identityAndOwnership: `${DOCS_SITE_URL}/identity-and-ownership/`,
  buildYourOwnClient: `${DOCS_SITE_URL}/build-your-own-client/`,
  permissionlessPublicRpc: `${DOCS_SITE_URL}/permissionless-public-rpc/`,
  flagshipBitsocialApp: `${DOCS_SITE_URL}/flagship-bitsocial-app/`,
  scaleBitsocialEconomies: `${DOCS_SITE_URL}/scale-bitsocial-economies/`,
  decentralizeAllSocialMedia: `${DOCS_SITE_URL}/decentralize-all-social-media/`,
  bsoResolver: `${DOCS_SITE_URL}/infrastructure/bso-resolver/`,
} as const;

export const CHAIN_SITE_URL = "https://chain.bitsocial.net" as const;

export const STATS_SITE_URL = "https://stats.bitsocial.net" as const;

export const STATS_LINKS = {
  home: `${STATS_SITE_URL}/`,
  client5chan: `${STATS_SITE_URL}/5chan`,
} as const;

export function isDocsPath(pathOrHref: string) {
  if (pathOrHref.startsWith(DOCS_SITE_URL)) {
    return true;
  }

  return pathOrHref === "/docs" || pathOrHref === "/docs/" || pathOrHref.startsWith("/docs/");
}

export function isStatsPath(pathOrHref: string) {
  if (pathOrHref.startsWith(STATS_SITE_URL)) {
    return true;
  }

  return pathOrHref === "/stats" || pathOrHref === "/stats/" || pathOrHref.startsWith("/stats/");
}
