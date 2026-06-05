import path from "node:path";
import { fileURLToPath } from "node:url";

const monitorRoot = path.dirname(fileURLToPath(import.meta.url));
const fiveChanDirectoriesSnapshotPath = path.join(
  monitorRoot,
  "data",
  "5chan-directories.snapshot.json",
);

const parseCsvEnv = (value) =>
  value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const kuboRpcUrl = process.env.BITSOCIAL_STATS_KUBO_RPC_URL || "http://127.0.0.1:5001";
const pubsubKuboRpcUrl = process.env.BITSOCIAL_STATS_PUBSUB_KUBO_RPC_URL || kuboRpcUrl;
const delegatedRoutingUrls = parseCsvEnv(process.env.BITSOCIAL_STATS_DELEGATED_ROUTING_URLS) || [
  "https://delegated-ipfs.dev",
];

export default {
  monitoring: {
    clients: [
      {
        id: "5chan",
        label: "5chan",
        sources: [fiveChanDirectoriesSnapshotPath],
      },
    ],
    ipfsGatewayUrls: [
      "https://gateway.forumindex.com",
      "https://gateway.plebpubsub.xyz",
      "https://ipfs.io",
      "https://ipfsgateway.xyz",
    ],
    pubsubProviderUrls: [
      "http://nocf.pubsubprovider.xyz/api/v0",
      "https://plebpubsub.xyz/api/v0",
      "https://pubsubprovider.xyz/api/v0",
      "https://rannithepleb.com/api/v0",
    ],
    httpRouterUrls: [
      "https://peers.forumindex.com",
      "https://peers.pleb.bot",
      "https://peers.plebpubsub.xyz",
      "https://routing.lol",
    ],
    previewerUrls: ["https://pleb.bz"],
    seederPeerIds: ["12D3KooWDfnXqdZfsoqKbcYEDKRttt3adumB5m6tw8YghPwMAz8V"],
    chainProviders: {
      eth: { urls: ["https://ethrpc.xyz", "ethers.js", "viem"], chainId: 1 },
      sol: { urls: ["https://solrpc.xyz", "web3.js"] },
    },
    webpages: [
      { url: "https://bitsocial.net", match: "Bitsocial" },
      { url: "https://bitsocial.net/docs", match: "Bitsocial Docs|Bitsocial" },
      { url: "https://bitsocial.net/stats", match: "Grafana|Stats" },
      { url: "https://newsletter.bitsocial.net", match: "listmonk|Bitsocial Newsletter" },
      { url: "https://5chan.app", match: "5chan|4chan alternative" },
      { url: "https://seedit.app", match: "Seedit|reddit alternative" },
    ],
    serviceProbes: [
      {
        id: "newsletter_site_root",
        label: "Newsletter site",
        url: "https://newsletter.bitsocial.net/",
        expectedStatus: 200,
        expectedBodyMatch: "listmonk|Bitsocial Newsletter",
      },
      {
        id: "newsletter_subscribe_preflight",
        label: "Newsletter CORS preflight",
        url: "https://newsletter.bitsocial.net/api/bitsocial/subscribe",
        method: "OPTIONS",
        expectedStatus: 204,
        headers: {
          Origin: "https://bitsocial.net",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type",
        },
      },
      {
        id: "newsletter_subscribe_gateway",
        label: "Newsletter signup gateway",
        url: "https://newsletter.bitsocial.net/api/bitsocial/subscribe",
        method: "POST",
        expectedStatus: 403,
        expectedBodyMatch: "This list is not allowed",
        headers: {
          Origin: "https://bitsocial.net",
        },
        json: {
          email: "newsletter-monitor@example.com",
          list_uuids: ["00000000-0000-0000-0000-000000000000"],
        },
      },
      {
        id: "spam_blocker_server",
        label: "Spam Blocker server",
        url: "https://spamblocker.bitsocial.net/",
        expectedStatus: 200,
        expectedBodyMatch: "spam.?blocker|Spam Blocker|@bitsocial",
      },
      {
        id: "ai_moderation_challenge_server",
        label: "AI Moderation Challenge server",
        url: "https://ai.bitsocialforge.com/",
        expectedStatus: 200,
        expectedBodyMatch: "ai.?moderation|AI Moderation|bitsocialforge|@bitsocial",
      },
      {
        id: "flags_challenge_server",
        label: "Flags Challenge server",
        url: "https://flags.5chan.app/",
        expectedStatus: 200,
        expectedBodyMatch: "flag|5chan|Flags Challenge|@bitsocial",
      },
    ],
    nfts: [],
  },
  delegatedRoutingUrls,
  kuboRpcUrl,
  pubsubKuboRpcUrl,
  pkcOptions: {
    ipfsGatewayUrls: [
      "https://ipfs.io",
      "https://ipfsgateway.xyz",
      "https://gateway.plebpubsub.xyz",
      "https://gateway.forumindex.com",
    ],
    pubsubKuboRpcClientsOptions: ["https://pubsubprovider.xyz/api/v0"],
    chainProviders: {
      eth: { urls: ["https://ethrpc.xyz", "viem", "ethers.js"], chainId: 1 },
      sol: { urls: ["https://solrpc.xyz", "web3.js"], chainId: 1 },
    },
    httpRoutersOptions: [
      "https://routing.lol",
      "https://peers.pleb.bot",
      "https://peers.plebpubsub.xyz",
      "https://peers.forumindex.com",
    ],
  },
};
