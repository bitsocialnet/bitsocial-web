import config from "../config.js";
import monitorState from "./monitor-state.js";
import { getCommunityMetricLabelNames, getCommunityMetricLabels } from "./community-metrics.js";
import { kubo } from "./pkc-js/pkc-js.js";
import { fetchJson, getCommunityIpnsNameFromPublicKey, createCounter } from "./utils.js";
import prometheus from "./prometheus.js";
import pTimeout from "p-timeout";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:ipfs-gateway");

const waitForIpfsAddMs = 1000 * 10;

const initIpfsGatewayMonitorState = (ipfsGatewayUrl) => {
  if (!monitorState.ipfsGateways[ipfsGatewayUrl]) {
    monitorState.ipfsGateways[ipfsGatewayUrl] = {};
  }
  if (!monitorState.ipfsGateways[ipfsGatewayUrl].communityIpnsFetches) {
    monitorState.ipfsGateways[ipfsGatewayUrl].communityIpnsFetches = {};
  }
};

export const monitorIpfsGateways = async () => {
  debug(
    `monitoring ${config.monitoring.ipfsGatewayUrls?.length} ipfs gateways: ${config.monitoring.ipfsGatewayUrls?.join(" ")}`,
  );
  for (const ipfsGatewayUrl of config.monitoring.ipfsGatewayUrls || []) {
    initIpfsGatewayMonitorState(ipfsGatewayUrl);

    // comment fetches
    getCommentFetchStats(ipfsGatewayUrl)
      .then((stats) => {
        monitorState.ipfsGateways[ipfsGatewayUrl] = {
          ...monitorState.ipfsGateways[ipfsGatewayUrl],
          ...stats,
        };
        prometheusObserveCommentFetch(ipfsGatewayUrl, stats);
      })
      .catch((e) => debug(e.message));

    // community ipns fetches
    (async () => {
      for (const community of monitorState.communitiesMonitoring) {
        // one at a time to not ddos gateway
        try {
          const stats = await getCommunityIpnsFetchStats(
            ipfsGatewayUrl,
            community.address,
            monitorState.communities[community.address],
          );
          monitorState.ipfsGateways[ipfsGatewayUrl].communityIpnsFetches[community.address] = stats;
          prometheusObserveCommunityIpnsFetch(ipfsGatewayUrl, community.address, stats);
        } catch (e) {
          debug(e.message);
        }
      }
    })();
  }
};

const getRandomString = () => (Math.random() + 1).toString(36).replace(".", "");

const createFakeComment = () => ({
  author: {
    address: getRandomString(),
  },
  signature: {
    signature: getRandomString(),
    publicKey: getRandomString(),
  },
  title: getRandomString(),
  content: getRandomString(),
});

const fetchJsonRetry = async (fetchJsonRetryOptions) => {
  if (typeof fetchJsonRetryOptions?.url !== "string")
    throw Error("fetchJsonRetryOptions.url not a string");
  if (typeof fetchJsonRetryOptions?.retries !== "number")
    throw Error("fetchJsonRetryOptions.url not a number");
  if (typeof fetchJsonRetryOptions?.attempts !== "number")
    throw Error("fetchJsonRetryOptions.url not a number");
  while (true) {
    fetchJsonRetryOptions.attempts++;
    try {
      const json = await fetchJson(fetchJsonRetryOptions.url);
      return json;
    } catch (e) {
      if (fetchJsonRetryOptions.attempts > fetchJsonRetryOptions.retries) {
        throw e;
      }
      debug(
        `${fetchJsonRetryOptions.retries - fetchJsonRetryOptions.attempts} retry left fetching '${fetchJsonRetryOptions.url}'`,
      );
    }
  }
};

const countCommentFetch = createCounter();
const getCommentFetchStats = async (ipfsGatewayUrl) => {
  const fakeComment = createFakeComment();
  debug(`adding comment to '${config.kuboRpcUrl}' to monitor '${ipfsGatewayUrl}'...`);
  const { path: cid } = await pTimeout(kubo.add(JSON.stringify(fakeComment)), {
    milliseconds: 1000 * 60,
    message: Error(
      `failed adding comment to '${config.kuboRpcUrl}' (timed out) to monitor '${ipfsGatewayUrl}'`,
    ),
  });

  // wait for comment to propagate to ipfs
  debug(
    `added comment '${cid}' to ipfs to monitor '${ipfsGatewayUrl}', waiting ${waitForIpfsAddMs / 1000}s to propagate...`,
  );
  await new Promise((r) => setTimeout(r, waitForIpfsAddMs));

  debug(`fetching comment '${cid}' from '${ipfsGatewayUrl}'`);
  let lastCommentFetchSuccess = false;
  let lastCommentFetchTime;
  let lastCommentFetchAttemptCount;
  const fetchJsonRetryOptions = {
    url: `${ipfsGatewayUrl}/ipfs/${cid}`,
    retries: 3,
    attempts: 0,
  };
  try {
    const beforeTimestamp = Date.now();
    const fetchedComment = await fetchJsonRetry(fetchJsonRetryOptions);
    if (fetchedComment.author.address !== fakeComment.author.address) {
      throw Error(
        `failed fetching got response '${JSON.stringify(fetchedComment).substring(0, 300)}'`,
      );
    }
    lastCommentFetchSuccess = true;
    lastCommentFetchTime = (Date.now() - beforeTimestamp) / 1000;
    lastCommentFetchAttemptCount = fetchJsonRetryOptions.attempts;

    debug(`fetched comment '${cid}' from '${ipfsGatewayUrl}' in ${lastCommentFetchTime}s`);
  } catch (e) {
    debug(`failed fetching comment '${cid}' from '${ipfsGatewayUrl}': ${e.message}`);
  }

  kubo.pin.rm(cid).catch((e) => debug(e));

  return {
    commentFetchCount: countCommentFetch(ipfsGatewayUrl),
    lastCommentFetchSuccess,
    lastCommentFetchTime,
    lastCommentFetchAttemptCount,
  };
};
// test
// debug(await getCommentFetchStats('https://pubsubprovider.xyz'))

const countCommunityIpnsFetch = createCounter();
const getCommunityIpnsFetchStats = async (ipfsGatewayUrl, communityAddress, community) => {
  if (!community?.publicKey) {
    throw Error(
      `can't monitor ipfs gateway '${ipfsGatewayUrl}' community ipns for '${communityAddress}' no community public key found yet`,
    );
  }
  const communityIpnsName = getCommunityIpnsNameFromPublicKey(community.publicKey);

  debug(
    `fetching community '${community.address}' ipns '${communityIpnsName}' from '${ipfsGatewayUrl}'`,
  );
  let lastCommunityIpnsFetchSuccess = false;
  let lastCommunityIpnsFetchTime;
  let lastCommunityIpnsFetchAttemptCount;
  let lastCommunityIpnsUpdatedAt;
  const fetchJsonRetryOptions = {
    url: `${ipfsGatewayUrl}/ipns/${communityIpnsName}`,
    retries: 3,
    attempts: 0,
  };
  try {
    const beforeTimestamp = Date.now();
    const fetchedCommunity = await fetchJsonRetry(fetchJsonRetryOptions);
    if (fetchedCommunity.signature.publicKey !== community.publicKey) {
      throw Error(
        `failed fetching got response '${JSON.stringify(fetchedCommunity).substring(0, 300)}'`,
      );
    }
    lastCommunityIpnsFetchSuccess = true;
    lastCommunityIpnsFetchTime = (Date.now() - beforeTimestamp) / 1000;
    lastCommunityIpnsFetchAttemptCount = fetchJsonRetryOptions.attempts;
    lastCommunityIpnsUpdatedAt = fetchedCommunity.updatedAt;

    debug(
      `fetched community '${community.address}' ipns '${communityIpnsName}' from '${ipfsGatewayUrl}' in ${lastCommunityIpnsFetchTime}s`,
    );
  } catch (e) {
    debug(
      `failed fetching community '${community.address}' ipns '${communityIpnsName}' from '${ipfsGatewayUrl}': ${e.message}`,
    );
  }

  return {
    communityIpnsFetchCount: countCommunityIpnsFetch(ipfsGatewayUrl + communityAddress),
    lastCommunityIpnsFetchSuccess,
    lastCommunityIpnsFetchTime,
    lastCommunityIpnsFetchAttemptCount,
    lastCommunityIpnsUpdatedAt,
  };
};
// test
// debug(await getCommunityIpnsFetchStats('https://ipfsgateway.xyz', 'plebtoken.eth', {address: 'plebtoken.eth', publicKey: 'oqb9NJrUccHpOHqfi1daakTAFup2BB7tYNbpkOcFOyE'}))

// test
// monitorIpfsGateways(); setInterval(() => monitorIpfsGateways(), 1000 * 60 * 10)

// prometheus
const commentFetchLabelNames = ["ipfs_gateway_url"];
const communityIpnsFetchLabelNames = getCommunityMetricLabelNames(["ipfs_gateway_url"]);
const counters = {
  commentFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}ipfs_gateway_comment_fetch_count`,
    help: `count of ipfs gateways comment fetch labeled with: ${commentFetchLabelNames.join(", ")}`,
    labelNames: commentFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  commentFetchDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}ipfs_gateway_comment_fetch_duration_seconds_sum`,
    help: `count of ipfs gateways comment fetch duration seconds labeled with: ${commentFetchLabelNames.join(", ")}`,
    labelNames: commentFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  commentFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}ipfs_gateway_comment_fetch_success_count`,
    help: `count of ipfs gateways comment fetch success labeled with: ${commentFetchLabelNames.join(", ")}`,
    labelNames: commentFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  commentFetchAttemptCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}ipfs_gateway_comment_fetch_attempt_count`,
    help: `count of ipfs gateways comment fetch attempt labeled with: ${commentFetchLabelNames.join(", ")}`,
    labelNames: commentFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  communityIpnsFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}ipfs_gateway_community_ipns_fetch_count`,
    help: `count of ipfs gateways community ipns fetch labeled with: ${communityIpnsFetchLabelNames.join(", ")}`,
    labelNames: communityIpnsFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  communityIpnsFetchDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}ipfs_gateway_community_ipns_fetch_duration_seconds_sum`,
    help: `count of ipfs gateways community ipns fetch duration seconds labeled with: ${communityIpnsFetchLabelNames.join(", ")}`,
    labelNames: communityIpnsFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  communityIpnsFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}ipfs_gateway_community_ipns_fetch_success_count`,
    help: `count of ipfs gateways community ipns fetch success labeled with: ${communityIpnsFetchLabelNames.join(", ")}`,
    labelNames: communityIpnsFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  communityIpnsFetchSecondsSinceUpdatedAtSum: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}ipfs_gateway_community_ipns_fetch_seconds_since_updated_at_sum`,
    help: `sum of ipfs gateways community ipns seconds since last update labeled with: ${communityIpnsFetchLabelNames.join(", ")}`,
    labelNames: communityIpnsFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastCommentFetchDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}ipfs_gateway_last_comment_fetch_duration_seconds`,
    help: `duration gauge of last ipfs gateways comment fetch labeled with: ${commentFetchLabelNames.join(", ")}`,
    labelNames: commentFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastCommentFetchAttemptCount: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}ipfs_gateway_last_comment_fetch_attempt_count`,
    help: `attempt count gauge of last ipfs gateways comment fetch labeled with: ${commentFetchLabelNames.join(", ")}`,
    labelNames: commentFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastCommentFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}ipfs_gateway_last_comment_fetch_success`,
    help: `success gauge of last ipfs gateways comment fetch labeled with: ${commentFetchLabelNames.join(", ")}`,
    labelNames: commentFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastCommunityIpnsFetchDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}ipfs_gateway_last_community_ipns_fetch_duration_seconds`,
    help: `duration gauge of last ipfs gateways community ipns fetch labeled with: ${communityIpnsFetchLabelNames.join(", ")}`,
    labelNames: communityIpnsFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastCommunityIpnsFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}ipfs_gateway_last_community_ipns_fetch_success`,
    help: `success gauge of last ipfs gateways community ipns fetch labeled with: ${communityIpnsFetchLabelNames.join(", ")}`,
    labelNames: communityIpnsFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastCommunityIpnsFetchSecondsSinceUpdatedAt: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}ipfs_gateway_last_community_ipns_fetch_seconds_since_updated_at`,
    help: `gauge of last ipfs gateways community ipns seconds since last update labeled with: ${communityIpnsFetchLabelNames.join(", ")}`,
    labelNames: communityIpnsFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const histograms = {
  commentFetchDurationSeconds: new prometheus.promClient.Histogram({
    name: `${prometheus.prefix}ipfs_gateway_comment_fetch_duration_seconds_histogram`,
    help: `duration histogram of ipfs gateways comment fetches labeled with: ${commentFetchLabelNames.join(", ")}`,
    labelNames: commentFetchLabelNames,
    buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10],
    registers: [prometheus.promClient.register],
  }),
};
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveCommentFetch = (ipfsGatewayUrl, stats) => {
  const labels = { ipfs_gateway_url: ipfsGatewayUrl };
  // counters
  counters.commentFetchCount.inc(labels, 1);
  if (stats.lastCommentFetchSuccess) {
    counters.commentFetchSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastCommentFetchTime)) {
    counters.commentFetchDurationSeconds.inc(labels, stats.lastCommentFetchTime);
  }
  if (isNumber(stats.lastCommentFetchAttemptCount)) {
    counters.commentFetchAttemptCount.inc(labels, stats.lastCommentFetchAttemptCount);
  }
  // gauges
  if (isNumber(stats.lastCommentFetchTime)) {
    gauges.lastCommentFetchDurationSeconds.set(labels, stats.lastCommentFetchTime);
  }
  if (isNumber(stats.lastCommentFetchAttemptCount)) {
    gauges.lastCommentFetchAttemptCount.set(labels, stats.lastCommentFetchAttemptCount);
  }
  gauges.lastCommentFetchSuccess.set(labels, stats.lastCommentFetchSuccess ? 1 : 0);
  // histograms
  if (isNumber(stats.lastCommentFetchTime)) {
    histograms.commentFetchDurationSeconds.observe(labels, stats.lastCommentFetchTime);
  }
};
const prometheusObserveCommunityIpnsFetch = (ipfsGatewayUrl, communityAddress, stats) => {
  const labels = getCommunityMetricLabels(communityAddress, { ipfs_gateway_url: ipfsGatewayUrl });
  const secondsSinceUpdatedAt = Math.ceil(Date.now() / 1000) - stats.lastCommunityIpnsUpdatedAt;
  // counters
  counters.communityIpnsFetchCount.inc(labels, 1);
  if (stats.lastCommunityIpnsFetchSuccess) {
    counters.communityIpnsFetchSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastCommunityIpnsFetchTime)) {
    counters.communityIpnsFetchDurationSeconds.inc(labels, stats.lastCommunityIpnsFetchTime);
  }
  if (isNumber(secondsSinceUpdatedAt)) {
    counters.communityIpnsFetchSecondsSinceUpdatedAtSum.inc(labels, secondsSinceUpdatedAt);
  }
  // gauges
  if (isNumber(stats.lastCommunityIpnsFetchTime)) {
    gauges.lastCommunityIpnsFetchDurationSeconds.set(labels, stats.lastCommunityIpnsFetchTime);
  }
  gauges.lastCommunityIpnsFetchSuccess.set(labels, stats.lastCommunityIpnsFetchSuccess ? 1 : 0);
  if (isNumber(secondsSinceUpdatedAt)) {
    gauges.lastCommunityIpnsFetchSecondsSinceUpdatedAt.set(labels, secondsSinceUpdatedAt);
  }
};
