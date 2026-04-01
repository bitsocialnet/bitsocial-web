import config from "../config.js";
import monitorState from "./monitor-state.js";
import { getCommunityMetricLabelNames, getCommunityMetricLabels } from "./community-metrics.js";
import {
  fetchDhtPeers,
  fetchHttpRoutersPeers,
  pubsubTopicToDhtKey,
  getTimeAgo,
  createCounter,
} from "./utils.js";
import * as cborg from "cborg";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { kuboPubsub, plebbitPubsubKuboRpc, pubsubKuboRpcUrl } from "./plebbit-js/plebbit-js.js";
import prometheus from "./prometheus.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:subplebbit-pubsub");

const fakeChallengeRequestsIntervalMs = 1000 * 60 * 5;
const lastSubplebbitPubsubMessageTooOldMs = 1000 * 60 * 10;
const pubsubPeersIntervalMs = 1000 * 10;

export const monitorSubplebbitsPubsub = async () => {
  for (const subplebbit of monitorState.subplebbitsMonitoring) {
    const pubsubTopic = monitorState.subplebbits[subplebbit?.address]?.pubsubTopic;
    const subplebbitPublicKey = monitorState.subplebbits[subplebbit?.address]?.publicKey;
    monitorSubplebbitPubsub(subplebbit, pubsubTopic, subplebbitPublicKey).catch((e) =>
      debug(e.message),
    );
  }
};

const monitorSubplebbitPubsub = async (subplebbit, pubsubTopic, subplebbitPublicKey) => {
  if (!pubsubTopic) {
    throw Error(`can't monitor pubsub for '${subplebbit?.address}' no pubsub topic found yet`);
  }
  if (!subplebbitPublicKey) {
    throw Error(
      `can't monitor pubsub for '${subplebbit?.address}' no subplebbit public key found yet`,
    );
  }

  // the dht and http router key used to announce/find providers for the pubsub topic of the subplebbit
  const pubsubTopicRoutingCid = await pubsubTopicToDhtKey(pubsubTopic);
  monitorState.subplebbits[subplebbit.address] = {
    ...monitorState.subplebbits[subplebbit.address],
    pubsubTopicRoutingCid,
  };

  fetchDhtPeers(pubsubTopicRoutingCid)
    .then((pubsubDhtPeers) => {
      debug(
        `fetched subplebbit pubsub dht peers for '${subplebbit.address}' ${pubsubDhtPeers.length} peers`,
      );
      monitorState.subplebbits[subplebbit.address] = {
        ...monitorState.subplebbits[subplebbit.address],
        pubsubDhtPeers,
      };
      prometheusObserveSubplebbitPubsubPeers(subplebbit.address, "Dht", pubsubDhtPeers);
    })
    .catch((e) => {
      debug(
        `failed to fetch subplebbit pubsub dht peers for '${subplebbit.address}': ${e.message}`,
      );
      prometheusObserveSubplebbitPubsubPeers(subplebbit.address, "Dht");
    });

  fetchHttpRoutersPeers(pubsubTopicRoutingCid)
    .then((pubsubHttpRoutersPeers) => {
      debug(
        `fetched subplebbit pubsub http routers peers for '${subplebbit.address}' ${pubsubHttpRoutersPeers.length} peers`,
      );
      monitorState.subplebbits[subplebbit.address] = {
        ...monitorState.subplebbits[subplebbit.address],
        pubsubHttpRoutersPeers,
      };
      prometheusObserveSubplebbitPubsubPeers(
        subplebbit.address,
        "HttpRouters",
        pubsubHttpRoutersPeers,
      );
    })
    .catch((e) => {
      debug(
        `failed to fetch subplebbit pubsub http routers peers for '${subplebbit.address}': ${e.message}`,
      );
      prometheusObserveSubplebbitPubsubPeers(subplebbit.address, "HttpRouters");
    });

  startListeningToPubsubMessages(subplebbit, pubsubTopic, subplebbitPublicKey).catch((e) =>
    debug(`failed start listening to pubsub message for '${subplebbit.address}': ${e.message}`),
  );

  startFetchingPubsubPeers(subplebbit, pubsubTopic);
};
// test
// config.monitorState = {...config.monitorState, writeFile: false}
// monitorState.subplebbitsMonitoring = [{address: 'business-and-finance.eth'}]
// monitorSubplebbitsPubsub()

const fetchPubsubPeers = async (subplebbit, pubsubTopic) => {
  if (!pubsubTopic) {
    throw Error(`can't fetch pubsub peers for '${subplebbit?.address}' no pubsub topic found yet`);
  }

  try {
    // probably not needed to check subscriptions
    // const subscriptions = await kuboPubsub.pubsub.ls()
    // if (!subscriptions.includes(pubsubTopic)) {
    //   throw Error(`not yet subscribed to pubsub topic '${pubsubTopic}'`)
    // }

    const pubsubPeers = await kuboPubsub.pubsub.peers(pubsubTopic);
    return pubsubPeers;
  } catch (e) {
    throw Error(`failed fetching pubsub peers for '${subplebbit.address}': ${e.message}`);
  }
};
// test
// debug(await fetchPubsubPeers({address: 'business-and-finance.eth'}, '12D3KooWNMybS8JqELi38ZBX897PrjWbCrGoMKfw3bgoqzC2n1Dh'))

const isFetchingPubsubPeers = {};
const startFetchingPubsubPeers = (subplebbit, pubsubTopic) => {
  if (isFetchingPubsubPeers[pubsubTopic]) {
    return;
  }
  isFetchingPubsubPeers[pubsubTopic] = true;

  setInterval(() => {
    fetchPubsubPeers(subplebbit, pubsubTopic)
      .then((pubsubPeers) => {
        if (Math.random() < 0.05) {
          debug(`fetched ${pubsubPeers.length} pubsub peers for '${subplebbit.address}'`);
        }
        monitorState.subplebbits[subplebbit.address] = {
          ...monitorState.subplebbits[subplebbit.address],
          pubsubPeers,
        };
        prometheusObserveSubplebbitPubsubPeers(subplebbit.address, "Pubsub", pubsubPeers);
      })
      .catch((e) => debug(e.message));
  }, pubsubPeersIntervalMs);
};

const countPubsubMessage = createCounter();
const isListeningToPubsubMessages = {};
const startListeningToPubsubMessages = async (subplebbit, pubsubTopic, subplebbitPublicKey) => {
  if (isListeningToPubsubMessages[pubsubTopic]) {
    return;
  }
  isListeningToPubsubMessages[pubsubTopic] = true;

  const onPubsubMessageReceived = (rawPubsubMessage) => {
    const stats = { pubsubMessageCount: countPubsubMessage(subplebbit.address) };
    try {
      const pubsubMessage = cborg.decode(rawPubsubMessage?.data);
      // debug(subplebbit.address, {pubsubMessage})
      const pubsubMessagePublicKeyBase64 = uint8ArrayToString(
        pubsubMessage?.signature?.publicKey,
        "base64",
      );
      stats.lastPubsubMessageTimestamp = Math.round(Date.now() / 1000);

      // TODO: this can be exploited by republishing old subplebbit messages, needs more validation
      if (subplebbitPublicKey === pubsubMessagePublicKeyBase64) {
        stats.lastSubplebbitPubsubMessageTimestamp = stats.lastPubsubMessageTimestamp;
        debug(`got pubsub message from subplebbit '${subplebbit?.address}'`);
      } else {
        debug(`got pubsub message in '${subplebbit?.address}'`);
      }
    } catch (e) {
      debug(`failed onPubsubMessageReceived for '${subplebbit.address}': ${e.message}`);
    }
    monitorState.subplebbits[subplebbit.address] = {
      ...monitorState.subplebbits[subplebbit.address],
      ...stats,
    };
    prometheusObserveSubplebbitPubsubMessage(subplebbit.address, stats);
  };

  pubsubSubscribeRetryForever(pubsubTopic, onPubsubMessageReceived, subplebbit.address);

  // give some time to get a message before starting publishing fake ones
  setTimeout(() => {
    startPublishingFakeChallengeRequests(subplebbit).catch((e) => debug(e.message));
  }, lastSubplebbitPubsubMessageTooOldMs);
};

const pubsubSubscribeRetryForever = (pubsubTopic, onMessage, subplebbitAddress) => {
  const onError = async (error, fatal, pubsubMessage) => {
    debug(`kubo.pubsub.subscribe onError '${pubsubKuboRpcUrl}' subplebbit '${subplebbitAddress}'`, {
      error,
      fatal,
      pubsubMessage,
    });
    if (fatal) {
      try {
        await kuboPubsub.pubsub.unsubscribe(pubsubTopic, onMessage);
      } catch (e) {
        debug(
          `kubo.pubsub.unsubscribe error '${pubsubKuboRpcUrl}' subplebbit '${subplebbitAddress}': ${e.message}`,
        );
      }
      await trySubscribe();
    }
  };
  let isSubscribed = true;
  const trySubscribe = async () => {
    while (isSubscribed) {
      try {
        await kuboPubsub.pubsub.subscribe(pubsubTopic, onMessage, { onError });
        debug(`subscribed to subplebbit pubsub '${subplebbitAddress}'`);
        break;
      } catch (e) {
        debug(
          `failed subscribe to subplebbit pubsub '${subplebbitAddress}': ${e.message}, trying again in 5s...`,
        );
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  };
  trySubscribe();
  const unsubscribe = async () => {
    isSubscribed = false;
    await kuboPubsub.pubsub.unsubscribe(pubsubTopic, onMessage);
  };
  return unsubscribe;
};

const countPublish = createCounter();
const publishFakeChallengeRequest = async (subplebbit) => {
  const stats = {
    publishCount: countPublish(subplebbit.address),
    lastPublishSuccess: false,
    lastPublishTime: undefined,
    lastPublishErrorCount: 0,
  };
  const beforeTimestamp = Date.now();

  const signer = await plebbitPubsubKuboRpc.createSigner();
  const getRandomString = () => (Math.random() + 1).toString(36).replace(".", "");
  const comment = await plebbitPubsubKuboRpc.createComment({
    signer,
    subplebbitAddress: subplebbit.address,
    title: `I am the subplebbit uptime monitor ${getRandomString()}`,
    content: `I am the subplebbit uptime monitor ${getRandomString()}`,
  });
  comment.on("challenge", (challenge) => {
    debug(`fake challenge request got challenge from '${subplebbit.address}'`);
    comment.stop();
  });
  comment.on("challengeverification", (challengeVerification) => {
    debug(`fake challenge request got challenge verification from '${subplebbit.address}'`);
    comment.stop();
  });
  comment.on("error", (error) => {
    stats.lastPublishErrorCount++;
    debug(`fake challenge request to '${subplebbit.address}' error: '${error.message}'`);
  });
  comment.on("publishingstatechange", (state) => {
    // wait some time for the error event to emit, probably a plebbit-js bug, it should emit before
    setTimeout(() => {
      if (state !== "succeeded" && state !== "failed" && state !== "waiting-challenge-answers") {
        return;
      }
      const time = (Date.now() - beforeTimestamp) / 1000;
      if (state === "succeeded" || state === "waiting-challenge-answers") {
        stats.lastPublishSuccess = true;
        stats.lastPublishTime = time;
      }
      debug(
        `fake challenge request to '${subplebbit.address}' publishing state change: '${state}' after ${time}s`,
      );
      prometheusObservePublish(subplebbit.address, stats);
    }, 2);
  });
  await comment.publish();
};

const startPublishingFakeChallengeRequests = async (subplebbit) => {
  const publishFakeChallengeRequests = () => {
    const lastSubplebbitPubsubMessageTimestamp =
      monitorState.subplebbits[subplebbit.address]?.lastSubplebbitPubsubMessageTimestamp;
    const lastSubplebbitPubsubMessageTimestampIsTooOldTimestamp =
      (Date.now() - lastSubplebbitPubsubMessageTooOldMs) / 1000;
    if (
      !lastSubplebbitPubsubMessageTimestamp ||
      lastSubplebbitPubsubMessageTimestampIsTooOldTimestamp > lastSubplebbitPubsubMessageTimestamp
    ) {
      debug(
        `last pubsub message from '${subplebbit.address}' ${getTimeAgo(lastSubplebbitPubsubMessageTimestamp)}, publishing fake challenge request`,
      );
      publishFakeChallengeRequest(subplebbit).catch((e) =>
        debug(`publishFakeChallengeRequest '${subplebbit.address}' error: '${e.message}'`),
      );
    }
  };
  publishFakeChallengeRequests();
  setInterval(() => publishFakeChallengeRequests(), fakeChallengeRequestsIntervalMs);
};
// test
// debug(await startPublishingFakeChallengeRequests({address: 'plebmusic.eth'}))

// test
// setInterval(async () => debug(await monitorSubplebbitPubsub({address: 'business-and-finance.eth'}, '12D3KooWNMybS8JqELi38ZBX897PrjWbCrGoMKfw3bgoqzC2n1Dh', 'umVN3GWZtpq4ZJokGwplTbyOt5HGJ03wDHTbQ4m3rxg')), 10000)

// prometheus
const labelNames = getCommunityMetricLabelNames();
const counters = {
  subplebbitPubsubMessageCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_message_count`,
    help: `count of community pubsub message labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitPubsubPublishCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_publish_count`,
    help: `count of community pubsub publish labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitPubsubPublishDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_publish_duration_seconds_sum`,
    help: `count of community pubsub publish duration seconds labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitPubsubPublishSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_publish_success_count`,
    help: `count of community pubsub publish success labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitPubsubPublishErrorCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_publish_error_count`,
    help: `count of community pubsub publish error events labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  subplebbitPubsubSecondsSinceLastPubsubMessage: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_seconds_since_last_pubsub_message`,
    help: `gauge of community pubsub seconds since last pubsub message labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
    collect() {
      for (const { address } of monitorState.subplebbitsMonitoring) {
        const subplebbit = monitorState.subplebbits[address];
        if (subplebbit?.address && subplebbit.lastPubsubMessageTimestamp) {
          this.set(
            getCommunityMetricLabels(subplebbit.address),
            Math.ceil(Date.now() / 1000) - subplebbit.lastPubsubMessageTimestamp,
          );
        }
      }
    },
  }),
  subplebbitPubsubSecondsSinceLastSubplebbitPubsubMessage: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_seconds_since_last_community_pubsub_message`,
    help: `gauge of community pubsub seconds since last community pubsub message labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
    collect() {
      for (const { address } of monitorState.subplebbitsMonitoring) {
        const subplebbit = monitorState.subplebbits[address];
        if (subplebbit?.address && subplebbit.lastSubplebbitPubsubMessageTimestamp) {
          this.set(
            getCommunityMetricLabels(subplebbit.address),
            Math.ceil(Date.now() / 1000) - subplebbit.lastSubplebbitPubsubMessageTimestamp,
          );
        }
      }
    },
  }),
  subplebbitPubsubLastPublishDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_last_publish_duration_seconds`,
    help: `duration gauge of last community pubsub publish labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitPubsubLastPublishSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_last_publish_success`,
    help: `success gauge of last community pubsub publish labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  subplebbitPubsubLastPublishErrorCount: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_last_publish_error_count`,
    help: `error event count gauge of last community pubsub publish labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
};
const toSnakeCase = (string) => string.replace(/([a-zA-Z])(?=[A-Z])/g, "$1_").toLowerCase();
// add all subplebbit pubsub peers types
const peerTypes = ["Dht", "HttpRouters", "Pubsub"];
for (const peerType of peerTypes) {
  counters[`subplebbitPubsub${peerType}PeersFetchCount`] = new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_${toSnakeCase(peerType)}_peers_fetch_count`,
    help: `count of community pubsub ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  counters[`subplebbitPubsub${peerType}PeersFetchSuccessCount`] = new prometheus.promClient.Counter(
    {
      name: `${prometheus.prefix}community_pubsub_${toSnakeCase(peerType)}_peers_fetch_success_count`,
      help: `count of community pubsub ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch success labeled with: ${labelNames.join(", ")}`,
      labelNames,
      registers: [prometheus.promClient.register],
    },
  );
  gauges[`lastSubplebbitPubsub${peerType}PeersFetchSuccess`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_pubsub_${toSnakeCase(peerType)}_peers_fetch_success`,
    help: `success gauge of last community pubsub ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  gauges[`lastSubplebbitPubsub${peerType}PeerCount`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_pubsub_${toSnakeCase(peerType)}_peer_count`,
    help: `gauge of last community pubsub ${toSnakeCase(peerType).replaceAll("_", " ")} peer count labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
}
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveSubplebbitPubsubPeers = (subplebbitAddress, peerType, peers) => {
  const labels = getCommunityMetricLabels(subplebbitAddress);
  // counters
  counters[`subplebbitPubsub${peerType}PeersFetchCount`].inc(labels, 1);
  if (peers) {
    counters[`subplebbitPubsub${peerType}PeersFetchSuccessCount`].inc(labels, 1);
  }
  // gauges
  gauges[`lastSubplebbitPubsub${peerType}PeersFetchSuccess`].set(labels, peers ? 1 : 0);
  if (peers) {
    gauges[`lastSubplebbitPubsub${peerType}PeerCount`].set(labels, peers.length);
  }
};
const prometheusObserveSubplebbitPubsubMessage = (subplebbitAddress, stats) => {
  const labels = getCommunityMetricLabels(subplebbitAddress);
  counters.subplebbitPubsubMessageCount.inc(labels, 1);
};
const prometheusObservePublish = (subplebbitAddress, stats) => {
  const labels = getCommunityMetricLabels(subplebbitAddress);
  // counters
  counters.subplebbitPubsubPublishCount.inc(labels, 1);
  if (stats.lastPublishSuccess) {
    counters.subplebbitPubsubPublishSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastPublishTime)) {
    counters.subplebbitPubsubPublishDurationSeconds.inc(labels, stats.lastPublishTime);
  }
  if (isNumber(stats.lastPublishErrorCount)) {
    counters.subplebbitPubsubPublishErrorCount.inc(labels, stats.lastPublishErrorCount);
  }
  // gauges
  if (isNumber(stats.lastPublishTime)) {
    gauges.subplebbitPubsubLastPublishDurationSeconds.set(labels, stats.lastPublishTime);
  }
  if (isNumber(stats.lastPublishErrorCount)) {
    gauges.subplebbitPubsubLastPublishErrorCount.set(labels, stats.lastPublishErrorCount);
  }
  gauges.subplebbitPubsubLastPublishSuccess.set(labels, stats.lastPublishSuccess ? 1 : 0);
};
