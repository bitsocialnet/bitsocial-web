import config from "../config.js";
import monitorState from "./monitor-state.js";
import { getCommunityMetricLabelNames, getCommunityMetricLabels } from "./community-metrics.js";
import {
  fetchJson,
  getPlebbitAddressFromPublicKey,
  stringToCid,
  getOwnIp,
  ipnsNameToIpnsOverPubsubTopic,
  pubsubTopicToDhtKey,
  createCounter,
} from "./utils.js";
import prometheus from "./prometheus.js";
import { createEd25519PeerId } from "@libp2p/peer-id-factory";
import net from "net";
import crypto from "crypto";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:http-router");

const waitForPostProvidersMs = 1000 * 10;

const initHttpRouterMonitorState = (httpRouterUrl) => {
  if (!monitorState.httpRouters[httpRouterUrl]) {
    monitorState.httpRouters[httpRouterUrl] = {};
  }
  if (!monitorState.httpRouters[httpRouterUrl].subplebbitIpnsGetProvidersFetches) {
    monitorState.httpRouters[httpRouterUrl].subplebbitIpnsGetProvidersFetches = {};
  }
};

export const monitorHttpRouters = async () => {
  debug(
    `monitoring ${config.monitoring.httpRouterUrls?.length} http routers: ${config.monitoring.httpRouterUrls?.join(" ")}`,
  );
  for (const httpRouterUrl of config.monitoring.httpRouterUrls || []) {
    initHttpRouterMonitorState(httpRouterUrl);

    // get providers fetches
    getProvidersFetchStats(httpRouterUrl)
      .then((stats) => {
        monitorState.httpRouters[httpRouterUrl] = {
          ...monitorState.httpRouters[httpRouterUrl],
          ...stats,
        };
        prometheusObserveGetProvidersFetch(httpRouterUrl, stats);
      })
      .catch((e) => debug(e.message));

    // subplebbit ipns get providers fetches
    (async () => {
      for (const subplebbit of monitorState.subplebbitsMonitoring) {
        // one at a time to not ddos router
        try {
          const stats = await getSubplebbitIpnsGetProvidersFetchStats(
            httpRouterUrl,
            subplebbit.address,
            monitorState.subplebbits[subplebbit.address],
          );
          monitorState.httpRouters[httpRouterUrl].subplebbitIpnsGetProvidersFetches[
            subplebbit.address
          ] = stats;
          prometheusObserveSubplebbitIpnsGetProvidersFetch(
            httpRouterUrl,
            subplebbit.address,
            stats,
          );
        } catch (e) {
          debug(e.message);
        }
      }
    })();
  }
};

const getRandomString = () => crypto.randomBytes(32).toString("base64");

const getRandomCid = () => stringToCid(getRandomString());

// TODO: create a real signature
// TODO: change ttl to correct value
const getFakeProviders = async (cid, peerId) => {
  const ip = await getOwnIp();
  const ipVersion = net.isIP(ip);
  return {
    Providers: [
      {
        Schema: "bitswap",
        Protocol: "transport-bitswap",
        Signature: getRandomString(),
        Payload: {
          Keys: [cid],
          Timestamp: Date.now(),
          AdvisoryTTL: 86400000000000,
          ID: peerId,
          Addrs: [`/ip${ipVersion}/${ip}/tcp/4001`, `/ip${ipVersion}/${ip}/udp/4001/quic-v1`],
        },
      },
    ],
  };
};

const countGetProvidersFetch = createCounter();
const getProvidersFetchStats = async (httpRouterUrl) => {
  const fakeCid = await getRandomCid();
  const fakePeerId = (await createEd25519PeerId()).toString();
  const fakeProviders = await getFakeProviders(fakeCid, fakePeerId);

  let lastGetProvidersFetchSuccess = false;
  let lastGetProvidersFetchTime;
  let lastPostProvidersFetchTime;
  try {
    let beforeTimestamp = Date.now();
    const postProvidersRes = await fetchJson(`${httpRouterUrl}/routing/v1/providers`, {
      method: "PUT",
      body: JSON.stringify(fakeProviders),
    });
    // TODO: schema will change in future kubo versions
    if (typeof postProvidersRes?.ProvideResults?.[0]?.AdvisoryTTL !== "number") {
      throw Error(
        `failed post providers got response '${JSON.stringify(postProvidersRes).substring(0, 300)}'`,
      );
    }
    lastPostProvidersFetchTime = (Date.now() - beforeTimestamp) / 1000;
    debug(`posted providers for cid '${fakeCid}' to '${httpRouterUrl}'`);

    // wait for http router to update
    await new Promise((r) => setTimeout(r, waitForPostProvidersMs));

    debug(`getting providers for cid '${fakeCid}' from '${httpRouterUrl}'`);

    beforeTimestamp = Date.now();
    const fetchedProviders = await fetchJson(`${httpRouterUrl}/routing/v1/providers/${fakeCid}`);
    if (fetchedProviders?.Providers?.[0]?.ID !== fakePeerId) {
      throw Error(
        `failed fetching got response '${JSON.stringify(fetchedProviders).substring(0, 300)}'`,
      );
    }
    lastGetProvidersFetchSuccess = true;
    lastGetProvidersFetchTime = (Date.now() - beforeTimestamp) / 1000;

    debug(
      `got providers for cid '${fakeCid}' from '${httpRouterUrl}' in ${lastGetProvidersFetchTime}s`,
    );
  } catch (e) {
    debug(`failed getting providers for cid '${fakeCid}' from '${httpRouterUrl}': ${e.message}`);
  }

  return {
    getProvidersFetchCount: countGetProvidersFetch(httpRouterUrl),
    lastGetProvidersFetchSuccess,
    lastGetProvidersFetchTime,
    lastPostProvidersFetchTime: lastGetProvidersFetchSuccess
      ? lastPostProvidersFetchTime
      : undefined,
  };
};
// test
// debug(await getProvidersFetchStats('https://peers.pleb.bot'))
// debug(await getProvidersFetchStats('https://routing.lol'))

const countSubplebbitIpnsGetProvidersFetch = createCounter();
const getSubplebbitIpnsGetProvidersFetchStats = async (
  httpRouterUrl,
  subplebbitAddress,
  subplebbit,
) => {
  if (!subplebbit?.publicKey) {
    throw Error(
      `can't monitor http router '${httpRouterUrl}' subplebbit ipns providers for '${subplebbitAddress}' no subplebbit public key found yet`,
    );
  }
  const suplebbitIpnsName = getPlebbitAddressFromPublicKey(subplebbit.publicKey);
  const ipnsOverPubsubTopic = ipnsNameToIpnsOverPubsubTopic(suplebbitIpnsName);
  const dhtKey = await pubsubTopicToDhtKey(ipnsOverPubsubTopic);

  debug(
    `getting providers for subplebbit '${subplebbit.address}' ipns '${suplebbitIpnsName}' from '${httpRouterUrl}'`,
  );
  let lastSubplebbitIpnsGetProvidersFetchSuccess = false;
  let lastSubplebbitIpnsGetProvidersFetchTime;
  let lastSubplebbitIpnsGetProvidersFetchProviderCount;
  try {
    const beforeTimestamp = Date.now();
    const fetchedProviders = await fetchJson(`${httpRouterUrl}/routing/v1/providers/${dhtKey}`);
    // no providers gives null, replace to empty array
    if (fetchedProviders?.Providers === null) {
      fetchedProviders.Providers = [];
    }
    if (!Array.isArray(fetchedProviders?.Providers)) {
      throw Error(
        `failed fetching got response '${JSON.stringify(fetchedProviders).substring(0, 300)}'`,
      );
    }
    lastSubplebbitIpnsGetProvidersFetchSuccess = true;
    lastSubplebbitIpnsGetProvidersFetchTime = (Date.now() - beforeTimestamp) / 1000;
    lastSubplebbitIpnsGetProvidersFetchProviderCount = fetchedProviders.Providers.length;

    debug(
      `got ${lastSubplebbitIpnsGetProvidersFetchProviderCount} providers for subplebbit '${subplebbit.address}' ipns '${suplebbitIpnsName}' from '${httpRouterUrl}' in ${lastSubplebbitIpnsGetProvidersFetchTime}s`,
    );
  } catch (e) {
    debug(
      `failed getting providers for subplebbit '${subplebbit.address}' ipns '${suplebbitIpnsName}' from '${httpRouterUrl}': ${e.message}`,
    );
  }

  return {
    subplebbitIpnsGetProvidersFetchCount: countSubplebbitIpnsGetProvidersFetch(
      httpRouterUrl + subplebbitAddress,
    ),
    lastSubplebbitIpnsGetProvidersFetchSuccess,
    lastSubplebbitIpnsGetProvidersFetchTime,
    lastSubplebbitIpnsGetProvidersFetchProviderCount,
  };
};
// test
// debug(await getSubplebbitIpnsGetProvidersFetchStats('https://peers.pleb.bot', 'plebtoken.eth', {address: 'plebtoken.eth', publicKey: 'oqb9NJrUccHpOHqfi1daakTAFup2BB7tYNbpkOcFOyE'}))

// test
// monitorHttpRouters(); setInterval(() => monitorHttpRouters(), 1000 * 60 * 10)

// prometheus
const getProvidersFetchLabelNames = ["http_router_url"];
const subplebbitIpnsGetProvidersFetchLabelNames = getCommunityMetricLabelNames(["http_router_url"]);
const counters = {
  getProvidersFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}http_router_get_providers_fetch_count`,
    help: `count of http routers get providers fetch labeled with: ${getProvidersFetchLabelNames.join(", ")}`,
    labelNames: getProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  getProvidersFetchDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}http_router_get_providers_fetch_duration_seconds_sum`,
    help: `count of http routers get providers fetch duration seconds labeled with: ${getProvidersFetchLabelNames.join(", ")}`,
    labelNames: getProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  postProvidersFetchDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}http_router_post_providers_fetch_duration_seconds_sum`,
    help: `count of http routers post providers fetch duration seconds labeled with: ${getProvidersFetchLabelNames.join(", ")}`,
    labelNames: getProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  getProvidersFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}http_router_get_providers_fetch_success_count`,
    help: `count of http routers get providers fetch success labeled with: ${getProvidersFetchLabelNames.join(", ")}`,
    labelNames: getProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitIpnsGetProvidersFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}http_router_community_ipns_get_providers_fetch_count`,
    help: `count of http routers community ipns get providers fetch labeled with: ${subplebbitIpnsGetProvidersFetchLabelNames.join(", ")}`,
    labelNames: subplebbitIpnsGetProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitIpnsGetProvidersFetchDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}http_router_community_ipns_get_providers_fetch_duration_seconds_sum`,
    help: `count of http routers community ipns get providers fetch duration seconds labeled with: ${subplebbitIpnsGetProvidersFetchLabelNames.join(", ")}`,
    labelNames: subplebbitIpnsGetProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitIpnsGetProvidersFetchProviderCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}http_router_community_ipns_get_providers_fetch_provider_count_sum`,
    help: `sum of http routers community ipns get providers fetch provider count labeled with: ${subplebbitIpnsGetProvidersFetchLabelNames.join(", ")}`,
    labelNames: subplebbitIpnsGetProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitIpnsGetProvidersFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}http_router_community_ipns_get_providers_fetch_success_count`,
    help: `count of http routers community ipns get providers fetch success labeled with: ${subplebbitIpnsGetProvidersFetchLabelNames.join(", ")}`,
    labelNames: subplebbitIpnsGetProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastGetProvidersFetchDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}http_router_last_get_providers_fetch_duration_seconds`,
    help: `duration gauge of last http routers get providers fetch labeled with: ${getProvidersFetchLabelNames.join(", ")}`,
    labelNames: getProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastPostProvidersFetchDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}http_router_last_post_providers_fetch_duration_seconds`,
    help: `duration gauge of last http routers post providers fetch labeled with: ${getProvidersFetchLabelNames.join(", ")}`,
    labelNames: getProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastGetProvidersFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}http_router_last_get_providers_fetch_success`,
    help: `success gauge of last http routers get providers fetch labeled with: ${getProvidersFetchLabelNames.join(", ")}`,
    labelNames: getProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastSubplebbitIpnsGetProvidersFetchDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}http_router_last_community_ipns_get_providers_fetch_duration_seconds`,
    help: `duration gauge of last http routers community ipns get providers fetch labeled with: ${subplebbitIpnsGetProvidersFetchLabelNames.join(", ")}`,
    labelNames: subplebbitIpnsGetProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastSubplebbitIpnsGetProvidersFetchProviderCount: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}http_router_last_community_ipns_get_providers_fetch_provider_count`,
    help: `provider count gauge of last http routers community ipns get providers fetch labeled with: ${subplebbitIpnsGetProvidersFetchLabelNames.join(", ")}`,
    labelNames: subplebbitIpnsGetProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastSubplebbitIpnsGetProvidersFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}http_router_last_community_ipns_get_providers_fetch_success`,
    help: `success gauge of last http routers community ipns get providers fetch labeled with: ${subplebbitIpnsGetProvidersFetchLabelNames.join(", ")}`,
    labelNames: subplebbitIpnsGetProvidersFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveGetProvidersFetch = (httpRouterUrl, stats) => {
  const labels = { http_router_url: httpRouterUrl };
  // counters
  counters.getProvidersFetchCount.inc(labels, 1);
  if (stats.lastGetProvidersFetchSuccess) {
    counters.getProvidersFetchSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastGetProvidersFetchTime)) {
    counters.getProvidersFetchDurationSeconds.inc(labels, stats.lastGetProvidersFetchTime);
  }
  if (isNumber(stats.lastPostProvidersFetchTime)) {
    counters.postProvidersFetchDurationSeconds.inc(labels, stats.lastPostProvidersFetchTime);
  }
  // gauges
  if (isNumber(stats.lastGetProvidersFetchTime)) {
    gauges.lastGetProvidersFetchDurationSeconds.set(labels, stats.lastGetProvidersFetchTime);
  }
  if (isNumber(stats.lastPostProvidersFetchTime)) {
    gauges.lastPostProvidersFetchDurationSeconds.set(labels, stats.lastPostProvidersFetchTime);
  }
  gauges.lastGetProvidersFetchSuccess.set(labels, stats.lastGetProvidersFetchSuccess ? 1 : 0);
};
const prometheusObserveSubplebbitIpnsGetProvidersFetch = (
  httpRouterUrl,
  subplebbitAddress,
  stats,
) => {
  const labels = getCommunityMetricLabels(subplebbitAddress, { http_router_url: httpRouterUrl });
  // counters
  counters.subplebbitIpnsGetProvidersFetchCount.inc(labels, 1);
  if (stats.lastSubplebbitIpnsGetProvidersFetchSuccess) {
    counters.subplebbitIpnsGetProvidersFetchSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastSubplebbitIpnsGetProvidersFetchTime)) {
    counters.subplebbitIpnsGetProvidersFetchDurationSeconds.inc(
      labels,
      stats.lastSubplebbitIpnsGetProvidersFetchTime,
    );
  }
  if (isNumber(stats.lastSubplebbitIpnsGetProvidersFetchProviderCount)) {
    counters.subplebbitIpnsGetProvidersFetchProviderCount.inc(
      labels,
      stats.lastSubplebbitIpnsGetProvidersFetchProviderCount,
    );
  }
  // gauges
  if (isNumber(stats.lastSubplebbitIpnsGetProvidersFetchTime)) {
    gauges.lastSubplebbitIpnsGetProvidersFetchDurationSeconds.set(
      labels,
      stats.lastSubplebbitIpnsGetProvidersFetchTime,
    );
  }
  if (isNumber(stats.lastSubplebbitIpnsGetProvidersFetchProviderCount)) {
    gauges.lastSubplebbitIpnsGetProvidersFetchProviderCount.set(
      labels,
      stats.lastSubplebbitIpnsGetProvidersFetchProviderCount,
    );
  }
  gauges.lastSubplebbitIpnsGetProvidersFetchSuccess.set(
    labels,
    stats.lastSubplebbitIpnsGetProvidersFetchSuccess ? 1 : 0,
  );
};
