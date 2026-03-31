import config from "../config.js";
import monitorState from "./monitor-state.js";
import { getCommunityMetricLabelNames, getCommunityMetricLabels } from "./community-metrics.js";
import { plebbit } from "./plebbit-js/plebbit-js.js";
import {
  getTimeAgo,
  createCounter,
  fetchDhtPeers,
  fetchHttpRoutersPeers,
  pubsubTopicToDhtKey,
  ipnsNameToIpnsOverPubsubTopic,
  getPlebbitAddressFromPublicKey,
} from "./utils.js";
import prometheus from "./prometheus.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:subplebbit-ipns");

const countGetSubplebbit = createCounter();
export const monitorSubplebbitsIpns = async () => {
  for (const subplebbit of monitorState.subplebbitsMonitoring) {
    const targetAddress = subplebbit?.targetAddress || subplebbit?.address;
    debug(`fetching subplebbit '${subplebbit?.address}' ipns via '${targetAddress}'`);
    (async () => {
      try {
        const subplebbitUpdate = await plebbit.getSubplebbit(targetAddress);
        debug(
          `fetched subplebbit '${subplebbit.address}' ipns last updated ${getTimeAgo(subplebbitUpdate.updatedAt)}`,
        );
        monitorState.subplebbits[subplebbit.address] = {
          ...monitorState.subplebbits[subplebbit.address],
          getSubplebbitCount: countGetSubplebbit(subplebbit.address),
          lastSubplebbitUpdateTimestamp: subplebbitUpdate.updatedAt,
          pubsubTopic: subplebbitUpdate.pubsubTopic, // needed for pubsub monitoring
          publicKey: subplebbitUpdate.signature.publicKey, // needed for pubsub monitoring
          ipnsName: getPlebbitAddressFromPublicKey(subplebbitUpdate.signature.publicKey), // useful for debugging
          lastPostCid: subplebbitUpdate.lastPostCid, // needed for plebbit previewer monitoring
          lastUpdateCid: subplebbitUpdate.updateCid, // needed for plebbit seeder monitoring
        };

        prometheusObserveSubplebbitUpdate(subplebbit.address, subplebbitUpdate);

        // fetch subplebbit stats
        if (subplebbitUpdate.statsCid) {
          plebbit
            .fetchCid(subplebbitUpdate.statsCid)
            .then((res) => {
              const subplebbitStats = JSON.parse(res);
              debug(
                `fetched subplebbit stats for '${subplebbit.address}' ${subplebbitStats.allPostCount} posts`,
              );
              monitorState.subplebbits[subplebbit.address] = {
                ...monitorState.subplebbits[subplebbit.address],
                subplebbitStats,
              };
              prometheusObserveSubplebbitStats(subplebbit.address, subplebbitStats);
            })
            .catch((e) => {
              debug(`failed to fetch subplebbit stats for '${subplebbit.address}': ${e.message}`);
            });
        }

        // the dht and http router key used to announce/find providers for ipns over pubsub for the subplebbit
        const ipnsPubsubTopic = ipnsNameToIpnsOverPubsubTopic(
          getPlebbitAddressFromPublicKey(subplebbitUpdate.signature.publicKey),
        );
        const ipnsPubsubTopicRoutingCid = await pubsubTopicToDhtKey(
          ipnsNameToIpnsOverPubsubTopic(
            getPlebbitAddressFromPublicKey(subplebbitUpdate.signature.publicKey),
          ),
        );
        monitorState.subplebbits[subplebbit.address] = {
          ...monitorState.subplebbits[subplebbit.address],
          ipnsPubsubTopic,
          ipnsPubsubTopicRoutingCid,
        };

        fetchDhtPeers(ipnsPubsubTopicRoutingCid)
          .then((ipnsDhtPeers) => {
            debug(
              `fetched subplebbit ipns dht peers for '${subplebbit.address}' ${ipnsDhtPeers.length} peers`,
            );
            monitorState.subplebbits[subplebbit.address] = {
              ...monitorState.subplebbits[subplebbit.address],
              ipnsDhtPeers,
            };
            prometheusObserveSubplebbitIpnsPeers(subplebbit.address, "Dht", ipnsDhtPeers);
          })
          .catch((e) => {
            debug(
              `failed to fetch subplebbit ipns dht peers for '${subplebbit.address}': ${e.message}`,
            );
            prometheusObserveSubplebbitIpnsPeers(subplebbit.address, "Dht");
          });

        fetchHttpRoutersPeers(ipnsPubsubTopicRoutingCid)
          .then((ipnsHttpRoutersPeers) => {
            debug(
              `fetched subplebbit ipns http routers peers for '${subplebbit.address}' ${ipnsHttpRoutersPeers.length} peers`,
            );
            monitorState.subplebbits[subplebbit.address] = {
              ...monitorState.subplebbits[subplebbit.address],
              ipnsHttpRoutersPeers,
            };
            prometheusObserveSubplebbitIpnsPeers(
              subplebbit.address,
              "HttpRouters",
              ipnsHttpRoutersPeers,
            );
          })
          .catch((e) => {
            debug(
              `failed to fetch subplebbit ipns http routers peers for '${subplebbit.address}': ${e.message}`,
            );
            prometheusObserveSubplebbitIpnsPeers(subplebbit.address, "HttpRouters");
          });

        if (subplebbitUpdate.updateCid) {
          fetchHttpRoutersPeers(subplebbitUpdate.updateCid)
            .then((ipnsCidHttpRoutersPeers) => {
              debug(
                `fetched subplebbit ipns cid http routers peers for '${subplebbit.address}' ${ipnsCidHttpRoutersPeers.length} peers`,
              );
              monitorState.subplebbits[subplebbit.address] = {
                ...monitorState.subplebbits[subplebbit.address],
                ipnsCidHttpRoutersPeers,
              };
              prometheusObserveSubplebbitIpnsPeers(
                subplebbit.address,
                "CidHttpRouters",
                ipnsCidHttpRoutersPeers,
              );
            })
            .catch((e) => {
              debug(
                `failed to fetch subplebbit update cid http routers peers for '${subplebbit.address}': ${e.message}`,
              );
              prometheusObserveSubplebbitIpnsPeers(subplebbit.address, "CidHttpRouters");
            });
        }
      } catch (e) {
        debug(`failed to get subplebbit '${subplebbit?.address}': ${e.message}`);
        prometheusObserveSubplebbitUpdateFailed(subplebbit?.address);
      }
    })();
  }
};
// test
// config.monitorState = {...config.monitorState, writeFile: false}
// monitorState.subplebbitsMonitoring = [{address: 'business-and-finance.eth'}]
// monitorSubplebbitsIpns()

// prometheus
const labelNames = getCommunityMetricLabelNames();
const counters = {
  subplebbitUpdateFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_update_fetch_count`,
    help: `count of community update fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitUpdateFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_update_fetch_success_count`,
    help: `count of community update fetch success labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitUpdateFetchSecondsSinceUpdatedAtSum: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_update_fetch_seconds_since_updated_at_sum`,
    help: `sum of community update seconds since last update labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastSubplebbitUpdateFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_update_fetch_success`,
    help: `success gauge of last community update fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
  lastSubplebbitUpdateFetchSecondsSinceUpdatedAt: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_update_fetch_seconds_since_updated_at`,
    help: `gauge of community update seconds since last update labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
};
// add all subplebbit stats times and names, e.g. subplebbitStats.allActiveUserCount
const subplebbitStatsTimes = ["hour", "day", "week", "month", "year", "all"];
const subplebbitStatsNames = ["ActiveUser", "Post", "Reply"];
const toSnakeCase = (string) => string.replace(/([a-zA-Z])(?=[A-Z])/g, "$1_").toLowerCase();
for (const statsName of subplebbitStatsNames) {
  for (const statsTime of subplebbitStatsTimes) {
    gauges[`subplebbitStats${statsTime}${statsName}Count`] = new prometheus.promClient.Gauge({
      name: `${prometheus.prefix}community_stats_${statsTime}_${toSnakeCase(statsName)}_count`,
      help: `gauge of community stats ${statsTime} ${toSnakeCase(statsName).replaceAll("_", " ")} count labeled with: ${labelNames.join(", ")}`,
      labelNames,
      registers: [prometheus.promClient.register],
    });
  }
}
// add all subplebbit ipns peers types
const peerTypes = ["Dht", "HttpRouters", "CidHttpRouters"];
for (const peerType of peerTypes) {
  counters[`subplebbitIpns${peerType}PeersFetchCount`] = new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_ipns_${toSnakeCase(peerType)}_peers_fetch_count`,
    help: `count of community ipns ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  counters[`subplebbitIpns${peerType}PeersFetchSuccessCount`] = new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_ipns_${toSnakeCase(peerType)}_peers_fetch_success_count`,
    help: `count of community ipns ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch success labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  gauges[`lastSubplebbitIpns${peerType}PeersFetchSuccess`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_ipns_${toSnakeCase(peerType)}_peers_fetch_success`,
    help: `success gauge of last community ipns ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  gauges[`lastSubplebbitIpns${peerType}PeerCount`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_ipns_${toSnakeCase(peerType)}_peer_count`,
    help: `gauge of last community ipns ${toSnakeCase(peerType).replaceAll("_", " ")} peer count labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
}
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveSubplebbitUpdate = (subplebbitAddress, subplebbitUpdate) => {
  const labels = getCommunityMetricLabels(subplebbitAddress);
  const secondsSinceUpdatedAt = Math.ceil(Date.now() / 1000) - subplebbitUpdate.updatedAt;
  // counters
  counters.subplebbitUpdateFetchCount.inc(labels, 1);
  counters.subplebbitUpdateFetchSuccessCount.inc(labels, 1);
  if (isNumber(secondsSinceUpdatedAt)) {
    counters.subplebbitUpdateFetchSecondsSinceUpdatedAtSum.inc(labels, secondsSinceUpdatedAt);
  }
  // gauges
  gauges.lastSubplebbitUpdateFetchSuccess.set(labels, 1);
  if (isNumber(secondsSinceUpdatedAt)) {
    gauges.lastSubplebbitUpdateFetchSecondsSinceUpdatedAt.set(labels, secondsSinceUpdatedAt);
  }
};
const prometheusObserveSubplebbitUpdateFailed = (subplebbitAddress) => {
  const labels = getCommunityMetricLabels(subplebbitAddress);
  // counters
  counters.subplebbitUpdateFetchCount.inc(labels, 1);
  // gauges
  gauges.lastSubplebbitUpdateFetchSuccess.set(labels, 0);
};
const prometheusObserveSubplebbitStats = (subplebbitAddress, subplebbitStats) => {
  const labels = getCommunityMetricLabels(subplebbitAddress);
  // add all subplebbit stats times and names
  for (const statsName of subplebbitStatsNames) {
    for (const statsTime of subplebbitStatsTimes) {
      const value = subplebbitStats?.[`${statsTime}${statsName}Count`];
      if (isNumber(value)) {
        gauges[`subplebbitStats${statsTime}${statsName}Count`].set(labels, value);
      }
    }
  }
};
const prometheusObserveSubplebbitIpnsPeers = (subplebbitAddress, peerType, peers) => {
  const labels = getCommunityMetricLabels(subplebbitAddress);
  // counters
  counters[`subplebbitIpns${peerType}PeersFetchCount`].inc(labels, 1);
  if (peers) {
    counters[`subplebbitIpns${peerType}PeersFetchSuccessCount`].inc(labels, 1);
  }
  // gauges
  gauges[`lastSubplebbitIpns${peerType}PeersFetchSuccess`].set(labels, peers ? 1 : 0);
  if (peers) {
    gauges[`lastSubplebbitIpns${peerType}PeerCount`].set(labels, peers.length);
  }
};
