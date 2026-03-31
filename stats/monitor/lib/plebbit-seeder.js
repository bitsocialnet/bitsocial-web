import config from "../config.js";
import monitorState from "./monitor-state.js";
import { fetchJson, createCounter } from "./utils.js";
import prometheus from "./prometheus.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:plebbit-seeder");

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
const heliaGet = (cid, plebbitSeederPeerId) =>
  Promise.race([
    s.get(CID.parse(cid)),
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `plebbit seeder '${plebbitSeederPeerId}' helia get '${cid}': timed out after 30s`,
            ),
          ),
        30 * 1000,
      ),
    ),
  ]);

const initPlebbitSeederMonitorState = (plebbitSeederPeerId) => {
  if (!monitorState.plebbitSeeders[plebbitSeederPeerId]) {
    monitorState.plebbitSeeders[plebbitSeederPeerId] = {};
  }
};

export const monitorPlebbitSeeders = async () => {
  const seederPeerIds =
    config.monitoring.seederPeerIds || config.monitoring.plebbitSeederPeerIds || [];
  debug(`monitoring ${seederPeerIds.length} seeders: ${seederPeerIds.join(" ")}`);
  for (const plebbitSeederPeerId of seederPeerIds) {
    initPlebbitSeederMonitorState(plebbitSeederPeerId);

    // subplebbit update cids fetches
    getSubplebbitUpdateCidFetchStats(plebbitSeederPeerId)
      .then((stats) => {
        monitorState.plebbitSeeders[plebbitSeederPeerId] = stats;
        prometheusObserveSubplebbitUpdateCidFetch(plebbitSeederPeerId, stats);
      })
      .catch((e) => debug(e.message));
  }
};

const getRandomSubplebbitWithUpdateCid = () => {
  const shuffleArray = (array) => {
    array = [...array];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const subplebbits = shuffleArray(Object.values(monitorState.subplebbits));
  const thirtyMinutesAgo = Date.now() / 1000 - 30 * 60 * 9999;
  const recentlyUpdatedSubplebbit = subplebbits.find(
    (subplebbit) =>
      subplebbit.lastSubplebbitUpdateTimestamp > thirtyMinutesAgo && subplebbit.lastUpdateCid,
  );
  if (!recentlyUpdatedSubplebbit) {
    throw Error(`no subplebbit update cids recently updated`);
  }
  return recentlyUpdatedSubplebbit;
};

const getPlebbitSeederMultiaddresses = async (plebbitSeederPeerId, subplebbitUpdateCid) => {
  const multiaddresses = [];
  let error;
  const promises = [];
  for (const httpRouterOptions of config.plebbitOptions.httpRoutersOptions || []) {
    promises.push(
      (async () => {
        const url = `${httpRouterOptions.url || httpRouterOptions}/routing/v1/providers/${subplebbitUpdateCid}`;
        try {
          const { Providers } = await fetchJson(url);
          for (const provider of Providers || []) {
            if (provider.ID === plebbitSeederPeerId) {
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
      `failed getting plebbit seeder '${plebbitSeederPeerId}' multiaddresses from http routers for cid '${subplebbitUpdateCid}': ${error?.message || "plebbit seeder not providing"}`,
    );
  }
  return [...new Set(multiaddresses)];
};

const countSubplebbitUpdateCidFetch = createCounter();
const getSubplebbitUpdateCidFetchStats = async (plebbitSeederPeerId) => {
  const subplebbit = getRandomSubplebbitWithUpdateCid();
  const subplebbitUpdateCid = subplebbit.lastUpdateCid;

  let lastSubplebbitUpdateCidFetchSuccess = false;
  let lastSubplebbitUpdateCidFetchTime;
  let multiaddress;

  // retry 3 times, total 10min wait, in case the plebbit seeder has a delay
  let attempts = 3;
  const retryDelay = 5 * 60 * 1000;

  while (attempts--) {
    try {
      const multiaddresses = await getPlebbitSeederMultiaddresses(
        plebbitSeederPeerId,
        subplebbitUpdateCid,
      );
      const websocketMultiaddress = multiaddresses.find((multiaddress) =>
        multiaddress.includes("/tls/ws/"),
      );
      if (!websocketMultiaddress) {
        throw Error(
          `plebbit seeder '${plebbitSeederPeerId}' has ${multiaddresses.length} multiaddresses but no websocket multiaddress`,
        );
      }
      multiaddress = multiaddr(websocketMultiaddress);

      debug(`dialing plebbit seeder '${websocketMultiaddress}'...`);
      const before = Date.now();
      await libp2p.dial(multiaddress);
      debug(
        `connected to plebbit seeder '${websocketMultiaddress}', downloading subplebbit update cid '${subplebbitUpdateCid} (${subplebbit.address})'...`,
      );

      const res = await heliaGet(subplebbitUpdateCid, plebbitSeederPeerId);
      if (!res) {
        throw Error(
          `plebbit seeder '${websocketMultiaddress}' failed helia strings.get('${subplebbitUpdateCid}') (${subplebbit.address})`,
        );
      }
      lastSubplebbitUpdateCidFetchSuccess = true;
      lastSubplebbitUpdateCidFetchTime = (Date.now() - before) / 1000;
      debug(
        `plebbit seeder '${plebbitSeederPeerId}' fetched subplebbit update cid '${subplebbitUpdateCid} (${subplebbit.address})' in ${lastSubplebbitUpdateCidFetchTime}s`,
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
    debug(`error disconnecting from plebbit seeder '${plebbitSeederPeerId}': ${e.message}`);
  }

  return {
    subplebbitUpdateCidFetch: countSubplebbitUpdateCidFetch(plebbitSeederPeerId),
    lastSubplebbitUpdateCidFetchSuccess,
    lastSubplebbitUpdateCidFetchTime,
  };
};
// test
// console.log(await getSubplebbitUpdateCidFetchStats('12D3KooWDfnXqdZfsoqKbcYEDKRttt3adumB5m6tw8YghPwMAz8V'))

// prometheus
const subplebbitUpdateCidFetchLabelNames = ["seeder_peer_id"];
const counters = {
  subplebbitUpdateCidFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}seeder_community_update_cid_fetch_count`,
    help: `count of seeders community update cid fetch labeled with: ${subplebbitUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: subplebbitUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitUpdateCidFetchDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}seeder_community_update_cid_fetch_duration_seconds_sum`,
    help: `count of seeders community update cid fetch duration seconds labeled with: ${subplebbitUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: subplebbitUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitUpdateCidFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}seeder_community_update_cid_fetch_success_count`,
    help: `count of seeders community update cid fetch success labeled with: ${subplebbitUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: subplebbitUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastSubplebbitUpdateCidFetchDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}seeder_last_community_update_cid_fetch_duration_seconds`,
    help: `duration gauge of last seeders community update cid fetch labeled with: ${subplebbitUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: subplebbitUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastSubplebbitUpdateCidFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}seeder_last_community_update_cid_fetch_success`,
    help: `success gauge of last seeders community update cid fetch labeled with: ${subplebbitUpdateCidFetchLabelNames.join(", ")}`,
    labelNames: subplebbitUpdateCidFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveSubplebbitUpdateCidFetch = (plebbitSeederPeerId, stats) => {
  const labels = { seeder_peer_id: plebbitSeederPeerId };
  // counters
  counters.subplebbitUpdateCidFetchCount.inc(labels, 1);
  if (stats.lastSubplebbitUpdateCidFetchSuccess) {
    counters.subplebbitUpdateCidFetchSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastSubplebbitUpdateCidFetchTime)) {
    counters.subplebbitUpdateCidFetchDurationSeconds.inc(
      labels,
      stats.lastSubplebbitUpdateCidFetchTime,
    );
  }
  // gauges
  if (isNumber(stats.lastSubplebbitUpdateCidFetchTime)) {
    gauges.lastSubplebbitUpdateCidFetchDurationSeconds.set(
      labels,
      stats.lastSubplebbitUpdateCidFetchTime,
    );
  }
  gauges.lastSubplebbitUpdateCidFetchSuccess.set(
    labels,
    stats.lastSubplebbitUpdateCidFetchSuccess ? 1 : 0,
  );
};
