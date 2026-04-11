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
        sources: [
          "https://raw.githubusercontent.com/bitsocialnet/lists/master/5chan-directories.json",
          "./data/5chan-directories.snapshot.json",
        ],
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
      { url: "https://5chan.app", match: "5chan|4chan alternative" },
      { url: "https://seedit.app", match: "Seedit|reddit alternative" },
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
