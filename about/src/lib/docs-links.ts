export const DOCS_LINKS = {
  home: "/docs/",
  search: "/docs/search/",
  peerToPeerProtocol: "/docs/peer-to-peer-protocol/",
  customChallenges: "/docs/custom-challenges/",
  localModeration: "/docs/local-moderation/",
  identityAndOwnership: "/docs/identity-and-ownership/",
  buildYourOwnClient: "/docs/build-your-own-client/",
  permissionlessPublicRpc: "/docs/permissionless-public-rpc/",
  bitsocialNetwork: "/docs/bitsocial-network/",
  flagshipBitsocialApp: "/docs/flagship-bitsocial-app/",
  scaleBitsocialEconomies: "/docs/scale-bitsocial-economies/",
  decentralizeAllSocialMedia: "/docs/decentralize-all-social-media/",
} as const;

export const STATS_LINKS = {
  home: "/stats/",
  client5chan: "/stats/5chan",
} as const;

export function isDocsPath(pathOrHref: string) {
  return pathOrHref === "/docs" || pathOrHref === "/docs/" || pathOrHref.startsWith("/docs/");
}

export function isStatsPath(pathOrHref: string) {
  return pathOrHref === "/stats" || pathOrHref === "/stats/" || pathOrHref.startsWith("/stats/");
}
