import config from "../config.js";
import monitorState from "./monitor-state.js";
import { fetchJson, createCounter } from "./utils.js";
import prometheus from "./prometheus.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:pkc-seeder");

// fix helia error
if (typeof Promise.withResolvers !== "function") {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// helia
import { yamux } from "@chainsafe/libp2p-yamux";
import { noise } from "@chainsafe/libp2p-noise";
import { bitswap } from "@helia/block-brokers";
import { strings } from "@helia/strings";
import { identify } from "@libp2p/identify";
import { webSockets } from "@libp2p/websockets";
import { createHelia } from "helia";
import { createLibp2p } from "libp2p";
import { CID } from "multiformats/cid";
import { multiaddr } from "@multiformats/multiaddr";
const libp2p = await createLibp2p({
  addresses: { listen: [] },
  peerDiscovery: [], // disable dht
  transports: [webSockets()],
  connectionEncrypters: [noise()],
  streamMuxers: [yamux()],
  services: { identify: identify() },
});
const helia = await createHelia({
  libp2p,
  blockBrokers: [bitswap()], // disable gateways fallback
});
const s = strings(helia);
const heliaGet = (cid, pkcSeederPeerId) =>
  Promise.race([
    s.get(CID.parse(cid)),
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(`pkc seeder '${pkcSeederPeerId}' helia get '${cid}': timed out after 30s`),
          ),
        30 * 1000,
      ),
    ),
  ]);

const initPkcSeederMonitorState = (pkcSeederPeerId) => {
  if (!monitorState.pkcSeeders[pkcSeederPeerId]) {
    monitorState.pkcSeeders[pkcSeederPeerId] = {};
  }
};

export const monitorPkcSeeders = async () => {
  const seederPeerIds = config.monitoring.seederPeerIds || config.monitoring.pkcSeederPeerIds || [];
  debug(`monitoring ${seederPeerIds.length} seeders: ${seederPeerIds.join(" ")}`);
  for (const pkcSeederPeerId of seederPeerIds) {
    initPkcSeederMonitorState(pkcSeederPeerId);

    // community update cids fetches
    getCommunityUpdateCidFetchStats(pkcSeederPeerId)
      .then((stats) => {
        monitorState.pkcSeeders[pkcSeederPeerId] = stats;
        prometheusObserveCommunityUpdateCidFetch(pkcSeederPeerId, stats);
      })
      .catch((e) => debug(e.message));
  }
};

const getShuffledCommunitiesWithUpdateCid = () => {
  const shuffleArray = (array) => {
    array = [...array];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const communities = shuffleArray(Object.values(monitorState.communities));
  const thirtyMinutesAgo = Date.now() / 1000 - 30 * 60 * 9999;
  const recentlyUpdatedCommunities = communities.filter(
    (community) =>
      community.lastCommunityUpdateTimestamp > thirtyMinutesAgo && community.lastUpdateCid,
  );
  if (!recentlyUpdatedCommunities.length) {
    throw Error(`no community update cids recently updated`);
  }
  return recentlyUpdatedCommunities;
};

const getPkcSeederMultiaddresses = async (pkcSeederPeerId, communityUpdateCid) => {
  const multiaddresses = [];
  let error;
  const promises = [];
  for (const httpRouterOptions of config.pkcOptions.httpRoutersOptions || []) {
    promises.push(
      (async () => {
        const url = `${httpRouterOptions.url || httpRouterOptions}/routing/v1/providers/${communityUpdateCid}`;
        try {
          const { Providers } = await fetchJson(url);
          for (const provider of Providers || []) {
            if (provider.ID === pkcSeederPeerId) {
              multiaddresses.push(...provider.Addrs);
            }
          }
        } catch (e) {
          e.message = `${url}: ${e.message}`;
          error = e;
        }
      })(),
    );
  }
  await Promise.all(promises);
  if (!multiaddresses.length) {
    throw Error(
      `failed getting pkc seeder '${pkcSeederPeerId}' multiaddresses from http routers for cid '${communityUpdateCid}': ${error?.message || "pkc seeder not providing"}`,
    );
  }
  return [...new Set(multiaddresses)];
};

const getSeededCommunity = async (pkcSeederPeerId) => {
  let error;

  for (const community of getShuffledCommunitiesWithUpdateCid()) {
    try {
      const multiaddresses = await getPkcSeederMultiaddresses(
        pkcSeederPeerId,
        community.lastUpdateCid,
      );
      return { community, multiaddresses };
    } catch (e) {
      error = e;
    }
  }

  throw error || Error(`no community update cids are currently provided by '${pkcSeederPeerId}'`);
};

const countCommunityUpdateCidFetch = createCounter();
const getCommunityUpdateCidFetchStats = async (pkcSeederPeerId) => {
  const { community, multiaddresses } = await getSeededCommunity(pkcSeederPeerId);
  const communityUpdateCid = community.lastUpdateCid;

  let lastCommunityUpdateCidFetchSuccess = false;
  let lastCommunityUpdateCidFetchTime;
  let multiaddress;

  // retry 3 times, total 10min wait, in case the pkc seeder has a delay
  let attempts = 3;
  const retryDelay = 5 * 60 * 1000;

  while (attempts--) {
    try {
      const websocketMultiaddress = multiaddresses.find((multiaddress) =>
        multiaddress.includes("/tls/ws/"),
      );
      if (!websocketMultiaddress) {
        throw Error(
          `pkc seeder '${pkcSeederPeerId}' has ${multiaddresses.length} multiaddresses but no websocket multiaddress`,
        );
      }
      multiaddress = multiaddr(websocketMultiaddress);

      debug(`dialing pkc seeder '${websocketMultiaddress}'...`);
      const before = Date.now();
      await libp2p.dial(multiaddress);
      debug(
        `connected to pkc seeder '${websocketMultiaddress}', downloading community update cid '${communityUpdateCid} (${community.address})'...`,
      );

      const res = await heliaGet(communityUpdateCid, pkcSeederPeerId);
      if (!res) {
        throw Error(
          `pkc seeder '${websocketMultiaddress}' failed helia strings.get('${communityUpdateCid}') (${community.address})`,
        );
      }
      lastCommunityUpdateCidFetchSuccess = true;
      lastCommunityUpdateCidFetchTime = (Date.now() - before) / 1000;
      debug(
        `pkc seeder '${pkcSeederPeerId}' fetched community update cid '${communityUpdateCid} (${community.address})' in ${lastCommunityUpdateCidFetchTime}s`,
      );
      break;
    } catch (e) {
      debug(`${e.message}, retrying in ${retryDelay / 1000}s...`);
      await new Promise((r) => setTimeout(r, retryDelay));
    }
  }

  // disconnect from peer
  try {
    await libp2p.hangUp(multiaddress.getPeerId());
  } catch (e) {
    debug(`error disconnecting from pkc seeder '${pkcSeederPeerId}': ${e.message}`);
  }

  return {
    communityUpdateCidFetch: countCommunityUpdateCidFetch(pkcSeederPeerId),
    lastCommunityUpdateCidFetchSuccess,
    lastCommunityUpdateCidFetchTime,
  };
};
// test
// console.log(await getCommunityUpdateCidFetchStats('12D3KooWDfnXqdZfsoqKbcYEDKRttt3adumB5m6tw8YghPwMAz8V'))

// prometheus
const communityUpdateCidFetchLabelNames = ["seeder_peer_id"];
const counters = {
  communityUpdateCidFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}seeder_community_update_cid_fetch_count`,
    help: `count of seeders community update cid fetch labeled with: ${communityUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: communityUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  communityUpdateCidFetchDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}seeder_community_update_cid_fetch_duration_seconds_sum`,
    help: `count of seeders community update cid fetch duration seconds labeled with: ${communityUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: communityUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  communityUpdateCidFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}seeder_community_update_cid_fetch_success_count`,
    help: `count of seeders community update cid fetch success labeled with: ${communityUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: communityUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastCommunityUpdateCidFetchDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}seeder_last_community_update_cid_fetch_duration_seconds`,
    help: `duration gauge of last seeders community update cid fetch labeled with: ${communityUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: communityUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastCommunityUpdateCidFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}seeder_last_community_update_cid_fetch_success`,
    help: `success gauge of last seeders community update cid fetch labeled with: ${communityUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: communityUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveCommunityUpdateCidFetch = (pkcSeederPeerId, stats) => {
  const labels = { seeder_peer_id: pkcSeederPeerId };
  // counters
  counters.communityUpdateCidFetchCount.inc(labels, 1);
  if (stats.lastCommunityUpdateCidFetchSuccess) {
    counters.communityUpdateCidFetchSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastCommunityUpdateCidFetchTime)) {
    counters.communityUpdateCidFetchDurationSeconds.inc(
      labels,
      stats.lastCommunityUpdateCidFetchTime,
    );
  }
  // gauges
  if (isNumber(stats.lastCommunityUpdateCidFetchTime)) {
    gauges.lastCommunityUpdateCidFetchDurationSeconds.set(
      labels,
      stats.lastCommunityUpdateCidFetchTime,
    );
  }
  gauges.lastCommunityUpdateCidFetchSuccess.set(
    labels,
    stats.lastCommunityUpdateCidFetchSuccess ? 1 : 0,
  );
};
