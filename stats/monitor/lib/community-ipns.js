import monitorState from "./monitor-state.js";
import { getCommunityMetricLabelNames, getCommunityMetricLabels } from "./community-metrics.js";
import { kubo, pkcKuboRpc } from "./pkc-js/pkc-js.js";
import {
  getTimeAgo,
  createCounter,
  fetchDhtPeers,
  fetchHttpRoutersPeers,
  pubsubTopicToDhtKey,
  ipnsNameToIpnsOverPubsubTopic,
  getCommunityIpnsNameFromPublicKey,
} from "./utils.js";
import prometheus from "./prometheus.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:community-ipns");

const countGetCommunity = createCounter();

const readJsonFromKubo = async (path) => {
  const chunks = [];
  for await (const chunk of kubo.cat(path)) {
    chunks.push(Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const resolveIpnsPath = async (ipnsName) => {
  let resolvedPath;

  for await (const candidatePath of kubo.name.resolve(ipnsName)) {
    resolvedPath = candidatePath;
  }

  if (!resolvedPath) {
    throw Error(`failed to resolve ipns name '${ipnsName}' to an ipfs path`);
  }

  return resolvedPath;
};

const getCidFromIpfsPath = (ipfsPath) => {
  if (typeof ipfsPath !== "string" || !ipfsPath.startsWith("/ipfs/")) {
    return undefined;
  }

  const [cid] = ipfsPath.slice("/ipfs/".length).split("/");
  return cid || undefined;
};

// Resolve the public `.eth` alias first, then fetch the canonical `.bso` record via Kubo.
const fetchCommunityUpdate = async (communityAddress, targetAddress) => {
  const resolvedIpnsName =
    await pkcKuboRpc._clientsManager.resolveSubplebbitAddressIfNeeded(targetAddress);
  const resolvedUpdatePath = await resolveIpnsPath(resolvedIpnsName);
  const resolvedUpdateCid = getCidFromIpfsPath(resolvedUpdatePath);
  const communityUpdate = await readJsonFromKubo(resolvedUpdatePath);

  if (communityUpdate?.address !== communityAddress) {
    throw Error(
      `resolved '${targetAddress}' to '${resolvedIpnsName}' but fetched '${communityUpdate?.address}'`,
    );
  }

  return { resolvedIpnsName, resolvedUpdateCid, communityUpdate };
};

export const monitorCommunitiesIpns = async () => {
  for (const community of monitorState.communitiesMonitoring) {
    const targetAddress = community?.targetAddress || community?.address;
    debug(`fetching community '${community?.address}' ipns via '${targetAddress}'`);
    (async () => {
      try {
        const { resolvedIpnsName, resolvedUpdateCid, communityUpdate } = await fetchCommunityUpdate(
          community.address,
          targetAddress,
        );
        const lastUpdateCid = communityUpdate.updateCid || resolvedUpdateCid;
        debug(
          `fetched community '${community.address}' ipns last updated ${getTimeAgo(communityUpdate.updatedAt)}`,
        );
        monitorState.communities[community.address] = {
          ...monitorState.communities[community.address],
          getCommunityCount: countGetCommunity(community.address),
          lastCommunityUpdateTimestamp: communityUpdate.updatedAt,
          pubsubTopic: communityUpdate.pubsubTopic, // needed for pubsub monitoring
          publicKey: communityUpdate.signature.publicKey, // needed for pubsub monitoring
          ipnsName:
            resolvedIpnsName ||
            getCommunityIpnsNameFromPublicKey(communityUpdate.signature.publicKey), // useful for debugging
          lastPostCid: communityUpdate.lastPostCid, // needed for previewer monitoring
          lastUpdateCid, // needed for pkc seeder monitoring
        };

        prometheusObserveCommunityUpdate(community.address, communityUpdate);

        // fetch community stats
        if (communityUpdate.statsCid) {
          readJsonFromKubo(communityUpdate.statsCid)
            .then((res) => {
              const communityStats = res;
              debug(
                `fetched community stats for '${community.address}' ${communityStats.allPostCount} posts`,
              );
              monitorState.communities[community.address] = {
                ...monitorState.communities[community.address],
                communityStats,
              };
              prometheusObserveCommunityStats(community.address, communityStats);
            })
            .catch((e) => {
              debug(`failed to fetch community stats for '${community.address}': ${e.message}`);
            });
        }

        // the dht and http router key used to announce/find providers for ipns over pubsub for the community
        const ipnsPubsubTopic = ipnsNameToIpnsOverPubsubTopic(
          getCommunityIpnsNameFromPublicKey(communityUpdate.signature.publicKey),
        );
        const ipnsPubsubTopicRoutingCid = await pubsubTopicToDhtKey(
          ipnsNameToIpnsOverPubsubTopic(
            getCommunityIpnsNameFromPublicKey(communityUpdate.signature.publicKey),
          ),
        );
        monitorState.communities[community.address] = {
          ...monitorState.communities[community.address],
          ipnsPubsubTopic,
          ipnsPubsubTopicRoutingCid,
        };

        fetchDhtPeers(ipnsPubsubTopicRoutingCid)
          .then((ipnsDhtPeers) => {
            debug(
              `fetched community ipns dht peers for '${community.address}' ${ipnsDhtPeers.length} peers`,
            );
            monitorState.communities[community.address] = {
              ...monitorState.communities[community.address],
              ipnsDhtPeers,
            };
            prometheusObserveCommunityIpnsPeers(community.address, "Dht", ipnsDhtPeers);
          })
          .catch((e) => {
            debug(
              `failed to fetch community ipns dht peers for '${community.address}': ${e.message}`,
            );
            prometheusObserveCommunityIpnsPeers(community.address, "Dht");
          });

        fetchHttpRoutersPeers(ipnsPubsubTopicRoutingCid)
          .then((ipnsHttpRoutersPeers) => {
            debug(
              `fetched community ipns http routers peers for '${community.address}' ${ipnsHttpRoutersPeers.length} peers`,
            );
            monitorState.communities[community.address] = {
              ...monitorState.communities[community.address],
              ipnsHttpRoutersPeers,
            };
            prometheusObserveCommunityIpnsPeers(
              community.address,
              "HttpRouters",
              ipnsHttpRoutersPeers,
            );
          })
          .catch((e) => {
            debug(
              `failed to fetch community ipns http routers peers for '${community.address}': ${e.message}`,
            );
            prometheusObserveCommunityIpnsPeers(community.address, "HttpRouters");
          });

        if (lastUpdateCid) {
          fetchHttpRoutersPeers(lastUpdateCid)
            .then((ipnsCidHttpRoutersPeers) => {
              debug(
                `fetched community ipns cid http routers peers for '${community.address}' ${ipnsCidHttpRoutersPeers.length} peers`,
              );
              monitorState.communities[community.address] = {
                ...monitorState.communities[community.address],
                ipnsCidHttpRoutersPeers,
              };
              prometheusObserveCommunityIpnsPeers(
                community.address,
                "CidHttpRouters",
                ipnsCidHttpRoutersPeers,
              );
            })
            .catch((e) => {
              debug(
                `failed to fetch community update cid http routers peers for '${community.address}': ${e.message}`,
              );
              prometheusObserveCommunityIpnsPeers(community.address, "CidHttpRouters");
            });
        }
      } catch (e) {
        debug(`failed to get community '${community?.address}': ${e.message}`);
        prometheusObserveCommunityUpdateFailed(community?.address);
      }
    })();
  }
};
// test
// config.monitorState = {...config.monitorState, writeFile: false}
// monitorState.communitiesMonitoring = [{address: 'business-and-finance.eth'}]
// monitorCommunitiesIpns()

// prometheus
const labelNames = getCommunityMetricLabelNames();
const counters = {
  communityUpdateFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_update_fetch_count`,
    help: `count of community update fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
  communityUpdateFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_update_fetch_success_count`,
    help: `count of community update fetch success labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
  communityUpdateFetchSecondsSinceUpdatedAtSum: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_update_fetch_seconds_since_updated_at_sum`,
    help: `sum of community update seconds since last update labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastCommunityUpdateFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_update_fetch_success`,
    help: `success gauge of last community update fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
  lastCommunityUpdateFetchSecondsSinceUpdatedAt: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_update_fetch_seconds_since_updated_at`,
    help: `gauge of community update seconds since last update labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
};
// add all community stats times and names, e.g. communityStats.allActiveUserCount
const communityStatsTimes = ["hour", "day", "week", "month", "year", "all"];
const communityStatsNames = ["ActiveUser", "Post", "Reply"];
const toSnakeCase = (string) => string.replace(/([a-zA-Z])(?=[A-Z])/g, "$1_").toLowerCase();
for (const statsName of communityStatsNames) {
  for (const statsTime of communityStatsTimes) {
    gauges[`communityStats${statsTime}${statsName}Count`] = new prometheus.promClient.Gauge({
      name: `${prometheus.prefix}community_stats_${statsTime}_${toSnakeCase(statsName)}_count`,
      help: `gauge of community stats ${statsTime} ${toSnakeCase(statsName).replaceAll("_", " ")} count labeled with: ${labelNames.join(", ")}`,
      labelNames,
      registers: [prometheus.promClient.register],
    });
  }
}
// add all community ipns peers types
const peerTypes = ["Dht", "HttpRouters", "CidHttpRouters"];
for (const peerType of peerTypes) {
  counters[`communityIpns${peerType}PeersFetchCount`] = new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_ipns_${toSnakeCase(peerType)}_peers_fetch_count`,
    help: `count of community ipns ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  counters[`communityIpns${peerType}PeersFetchSuccessCount`] = new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_ipns_${toSnakeCase(peerType)}_peers_fetch_success_count`,
    help: `count of community ipns ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch success labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  gauges[`lastCommunityIpns${peerType}PeersFetchSuccess`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_ipns_${toSnakeCase(peerType)}_peers_fetch_success`,
    help: `success gauge of last community ipns ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  gauges[`lastCommunityIpns${peerType}PeerCount`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_ipns_${toSnakeCase(peerType)}_peer_count`,
    help: `gauge of last community ipns ${toSnakeCase(peerType).replaceAll("_", " ")} peer count labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
}
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveCommunityUpdate = (communityAddress, communityUpdate) => {
  const labels = getCommunityMetricLabels(communityAddress);
  const secondsSinceUpdatedAt = Math.ceil(Date.now() / 1000) - communityUpdate.updatedAt;
  // counters
  counters.communityUpdateFetchCount.inc(labels, 1);
  counters.communityUpdateFetchSuccessCount.inc(labels, 1);
  if (isNumber(secondsSinceUpdatedAt)) {
    counters.communityUpdateFetchSecondsSinceUpdatedAtSum.inc(labels, secondsSinceUpdatedAt);
  }
  // gauges
  gauges.lastCommunityUpdateFetchSuccess.set(labels, 1);
  if (isNumber(secondsSinceUpdatedAt)) {
    gauges.lastCommunityUpdateFetchSecondsSinceUpdatedAt.set(labels, secondsSinceUpdatedAt);
  }
};
const prometheusObserveCommunityUpdateFailed = (communityAddress) => {
  const labels = getCommunityMetricLabels(communityAddress);
  // counters
  counters.communityUpdateFetchCount.inc(labels, 1);
  // gauges
  gauges.lastCommunityUpdateFetchSuccess.set(labels, 0);
};
const prometheusObserveCommunityStats = (communityAddress, communityStats) => {
  const labels = getCommunityMetricLabels(communityAddress);
  // add all community stats times and names
  for (const statsName of communityStatsNames) {
    for (const statsTime of communityStatsTimes) {
      const value = communityStats?.[`${statsTime}${statsName}Count`];
      if (isNumber(value)) {
        gauges[`communityStats${statsTime}${statsName}Count`].set(labels, value);
      }
    }
  }
};
const prometheusObserveCommunityIpnsPeers = (communityAddress, peerType, peers) => {
  const labels = getCommunityMetricLabels(communityAddress);
  // counters
  counters[`communityIpns${peerType}PeersFetchCount`].inc(labels, 1);
  if (peers) {
    counters[`communityIpns${peerType}PeersFetchSuccessCount`].inc(labels, 1);
  }
  // gauges
  gauges[`lastCommunityIpns${peerType}PeersFetchSuccess`].set(labels, peers ? 1 : 0);
  if (peers) {
    gauges[`lastCommunityIpns${peerType}PeerCount`].set(labels, peers.length);
  }
};
