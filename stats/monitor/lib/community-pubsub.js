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
import { kuboPubsub, pkcPubsubKuboRpc, pubsubKuboRpcUrl } from "./pkc-js/pkc-js.js";
import prometheus from "./prometheus.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:community-pubsub");

const fakeChallengeRequestsIntervalMs = 1000 * 60 * 5;
const lastCommunityPubsubMessageTooOldMs = 1000 * 60 * 10;
const pubsubPeersIntervalMs = 1000 * 10;

export const monitorCommunitiesPubsub = async () => {
  for (const community of monitorState.communitiesMonitoring) {
    const pubsubTopic = monitorState.communities[community?.address]?.pubsubTopic;
    const communityPublicKey = monitorState.communities[community?.address]?.publicKey;
    monitorCommunityPubsub(community, pubsubTopic, communityPublicKey).catch((e) =>
      debug(e.message),
    );
  }
};

const monitorCommunityPubsub = async (community, pubsubTopic, communityPublicKey) => {
  if (!pubsubTopic) {
    throw Error(`can't monitor pubsub for '${community?.address}' no pubsub topic found yet`);
  }
  if (!communityPublicKey) {
    throw Error(
      `can't monitor pubsub for '${community?.address}' no community public key found yet`,
    );
  }

  // the dht and http router key used to announce/find providers for the pubsub topic of the community
  const pubsubTopicRoutingCid = await pubsubTopicToDhtKey(pubsubTopic);
  monitorState.communities[community.address] = {
    ...monitorState.communities[community.address],
    pubsubTopicRoutingCid,
  };

  fetchDhtPeers(pubsubTopicRoutingCid)
    .then((pubsubDhtPeers) => {
      debug(
        `fetched community pubsub dht peers for '${community.address}' ${pubsubDhtPeers.length} peers`,
      );
      monitorState.communities[community.address] = {
        ...monitorState.communities[community.address],
        pubsubDhtPeers,
      };
      prometheusObserveCommunityPubsubPeers(community.address, "Dht", pubsubDhtPeers);
    })
    .catch((e) => {
      debug(`failed to fetch community pubsub dht peers for '${community.address}': ${e.message}`);
      prometheusObserveCommunityPubsubPeers(community.address, "Dht");
    });

  fetchHttpRoutersPeers(pubsubTopicRoutingCid)
    .then((pubsubHttpRoutersPeers) => {
      debug(
        `fetched community pubsub http routers peers for '${community.address}' ${pubsubHttpRoutersPeers.length} peers`,
      );
      monitorState.communities[community.address] = {
        ...monitorState.communities[community.address],
        pubsubHttpRoutersPeers,
      };
      prometheusObserveCommunityPubsubPeers(
        community.address,
        "HttpRouters",
        pubsubHttpRoutersPeers,
      );
    })
    .catch((e) => {
      debug(
        `failed to fetch community pubsub http routers peers for '${community.address}': ${e.message}`,
      );
      prometheusObserveCommunityPubsubPeers(community.address, "HttpRouters");
    });

  startListeningToPubsubMessages(community, pubsubTopic, communityPublicKey).catch((e) =>
    debug(`failed start listening to pubsub message for '${community.address}': ${e.message}`),
  );

  startFetchingPubsubPeers(community, pubsubTopic);
};
// test
// config.monitorState = {...config.monitorState, writeFile: false}
// monitorState.communitiesMonitoring = [{address: 'business-and-finance.eth'}]
// monitorCommunitiesPubsub()

const fetchPubsubPeers = async (community, pubsubTopic) => {
  if (!pubsubTopic) {
    throw Error(`can't fetch pubsub peers for '${community?.address}' no pubsub topic found yet`);
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
    throw Error(`failed fetching pubsub peers for '${community.address}': ${e.message}`);
  }
};
// test
// debug(await fetchPubsubPeers({address: 'business-and-finance.eth'}, '12D3KooWNMybS8JqELi38ZBX897PrjWbCrGoMKfw3bgoqzC2n1Dh'))

const isFetchingPubsubPeers = {};
const startFetchingPubsubPeers = (community, pubsubTopic) => {
  if (isFetchingPubsubPeers[pubsubTopic]) {
    return;
  }
  isFetchingPubsubPeers[pubsubTopic] = true;

  setInterval(() => {
    fetchPubsubPeers(community, pubsubTopic)
      .then((pubsubPeers) => {
        if (Math.random() < 0.05) {
          debug(`fetched ${pubsubPeers.length} pubsub peers for '${community.address}'`);
        }
        monitorState.communities[community.address] = {
          ...monitorState.communities[community.address],
          pubsubPeers,
        };
        prometheusObserveCommunityPubsubPeers(community.address, "Pubsub", pubsubPeers);
      })
      .catch((e) => debug(e.message));
  }, pubsubPeersIntervalMs);
};

const countPubsubMessage = createCounter();
const isListeningToPubsubMessages = {};
const startListeningToPubsubMessages = async (community, pubsubTopic, communityPublicKey) => {
  if (isListeningToPubsubMessages[pubsubTopic]) {
    return;
  }
  isListeningToPubsubMessages[pubsubTopic] = true;

  const onPubsubMessageReceived = (rawPubsubMessage) => {
    const stats = { pubsubMessageCount: countPubsubMessage(community.address) };
    try {
      const pubsubMessage = cborg.decode(rawPubsubMessage?.data);
      // debug(community.address, {pubsubMessage})
      const pubsubMessagePublicKeyBase64 = uint8ArrayToString(
        pubsubMessage?.signature?.publicKey,
        "base64",
      );
      stats.lastPubsubMessageTimestamp = Math.round(Date.now() / 1000);

      // TODO: this can be exploited by republishing old community messages, needs more validation
      if (communityPublicKey === pubsubMessagePublicKeyBase64) {
        stats.lastCommunityPubsubMessageTimestamp = stats.lastPubsubMessageTimestamp;
        debug(`got pubsub message from community '${community?.address}'`);
      } else {
        debug(`got pubsub message in '${community?.address}'`);
      }
    } catch (e) {
      debug(`failed onPubsubMessageReceived for '${community.address}': ${e.message}`);
    }
    monitorState.communities[community.address] = {
      ...monitorState.communities[community.address],
      ...stats,
    };
    prometheusObserveCommunityPubsubMessage(community.address, stats);
  };

  pubsubSubscribeRetryForever(pubsubTopic, onPubsubMessageReceived, community.address);

  // give some time to get a message before starting publishing fake ones
  setTimeout(() => {
    startPublishingFakeChallengeRequests(community).catch((e) => debug(e.message));
  }, lastCommunityPubsubMessageTooOldMs);
};

const pubsubSubscribeRetryForever = (pubsubTopic, onMessage, communityAddress) => {
  const onError = async (error, fatal, pubsubMessage) => {
    debug(`kubo.pubsub.subscribe onError '${pubsubKuboRpcUrl}' community '${communityAddress}'`, {
      error,
      fatal,
      pubsubMessage,
    });
    if (fatal) {
      try {
        await kuboPubsub.pubsub.unsubscribe(pubsubTopic, onMessage);
      } catch (e) {
        debug(
          `kubo.pubsub.unsubscribe error '${pubsubKuboRpcUrl}' community '${communityAddress}': ${e.message}`,
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
        debug(`subscribed to community pubsub '${communityAddress}'`);
        break;
      } catch (e) {
        debug(
          `failed subscribe to community pubsub '${communityAddress}': ${e.message}, trying again in 5s...`,
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
const publishFakeChallengeRequest = async (community) => {
  const stats = {
    publishCount: countPublish(community.address),
    lastPublishSuccess: false,
    lastPublishTime: undefined,
    lastPublishErrorCount: 0,
  };
  const beforeTimestamp = Date.now();

  const signer = await pkcPubsubKuboRpc.createSigner();
  const getRandomString = () => (Math.random() + 1).toString(36).replace(".", "");
  const comment = await pkcPubsubKuboRpc.createComment({
    signer,
    subplebbitAddress: community.address,
    title: `I am the community uptime monitor ${getRandomString()}`,
    content: `I am the community uptime monitor ${getRandomString()}`,
  });
  comment.on("challenge", (challenge) => {
    debug(`fake challenge request got challenge from '${community.address}'`);
    comment.stop();
  });
  comment.on("challengeverification", (challengeVerification) => {
    debug(`fake challenge request got challenge verification from '${community.address}'`);
    comment.stop();
  });
  comment.on("error", (error) => {
    stats.lastPublishErrorCount++;
    debug(`fake challenge request to '${community.address}' error: '${error.message}'`);
  });
  comment.on("publishingstatechange", (state) => {
    // Wait briefly so delayed error events from the current upstream client can still surface.
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
        `fake challenge request to '${community.address}' publishing state change: '${state}' after ${time}s`,
      );
      prometheusObservePublish(community.address, stats);
    }, 2);
  });
  await comment.publish();
};

const startPublishingFakeChallengeRequests = async (community) => {
  const publishFakeChallengeRequests = () => {
    const lastCommunityPubsubMessageTimestamp =
      monitorState.communities[community.address]?.lastCommunityPubsubMessageTimestamp;
    const lastCommunityPubsubMessageTimestampIsTooOldTimestamp =
      (Date.now() - lastCommunityPubsubMessageTooOldMs) / 1000;
    if (
      !lastCommunityPubsubMessageTimestamp ||
      lastCommunityPubsubMessageTimestampIsTooOldTimestamp > lastCommunityPubsubMessageTimestamp
    ) {
      debug(
        `last pubsub message from '${community.address}' ${getTimeAgo(lastCommunityPubsubMessageTimestamp)}, publishing fake challenge request`,
      );
      publishFakeChallengeRequest(community).catch((e) =>
        debug(`publishFakeChallengeRequest '${community.address}' error: '${e.message}'`),
      );
    }
  };
  publishFakeChallengeRequests();
  setInterval(() => publishFakeChallengeRequests(), fakeChallengeRequestsIntervalMs);
};
// test
// debug(await startPublishingFakeChallengeRequests({address: 'plebmusic.eth'}))

// test
// setInterval(async () => debug(await monitorCommunityPubsub({address: 'business-and-finance.eth'}, '12D3KooWNMybS8JqELi38ZBX897PrjWbCrGoMKfw3bgoqzC2n1Dh', 'umVN3GWZtpq4ZJokGwplTbyOt5HGJ03wDHTbQ4m3rxg')), 10000)

// prometheus
const labelNames = getCommunityMetricLabelNames();
const counters = {
  communityPubsubMessageCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_message_count`,
    help: `count of community pubsub message labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  }),
  communityPubsubPublishCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_publish_count`,
    help: `count of community pubsub publish labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  communityPubsubPublishDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_publish_duration_seconds_sum`,
    help: `count of community pubsub publish duration seconds labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  communityPubsubPublishSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_publish_success_count`,
    help: `count of community pubsub publish success labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  communityPubsubPublishErrorCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_publish_error_count`,
    help: `count of community pubsub publish error events labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  communityPubsubSecondsSinceLastPubsubMessage: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_seconds_since_last_pubsub_message`,
    help: `gauge of community pubsub seconds since last pubsub message labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
    collect() {
      for (const { address } of monitorState.communitiesMonitoring) {
        const community = monitorState.communities[address];
        if (community?.address && community.lastPubsubMessageTimestamp) {
          this.set(
            getCommunityMetricLabels(community.address),
            Math.ceil(Date.now() / 1000) - community.lastPubsubMessageTimestamp,
          );
        }
      }
    },
  }),
  communityPubsubSecondsSinceLastCommunityPubsubMessage: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_seconds_since_last_community_pubsub_message`,
    help: `gauge of community pubsub seconds since last community pubsub message labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
    collect() {
      for (const { address } of monitorState.communitiesMonitoring) {
        const community = monitorState.communities[address];
        if (community?.address && community.lastCommunityPubsubMessageTimestamp) {
          this.set(
            getCommunityMetricLabels(community.address),
            Math.ceil(Date.now() / 1000) - community.lastCommunityPubsubMessageTimestamp,
          );
        }
      }
    },
  }),
  communityPubsubLastPublishDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_last_publish_duration_seconds`,
    help: `duration gauge of last community pubsub publish labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  communityPubsubLastPublishSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_last_publish_success`,
    help: `success gauge of last community pubsub publish labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
  communityPubsubLastPublishErrorCount: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}community_pubsub_last_publish_error_count`,
    help: `error event count gauge of last community pubsub publish labeled with: ${labelNames.join(", ")}`,
    labelNames: labelNames,
    registers: [prometheus.promClient.register],
  }),
};
const toSnakeCase = (string) => string.replace(/([a-zA-Z])(?=[A-Z])/g, "$1_").toLowerCase();
// add all community pubsub peers types
const peerTypes = ["Dht", "HttpRouters", "Pubsub"];
for (const peerType of peerTypes) {
  counters[`communityPubsub${peerType}PeersFetchCount`] = new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_${toSnakeCase(peerType)}_peers_fetch_count`,
    help: `count of community pubsub ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  counters[`communityPubsub${peerType}PeersFetchSuccessCount`] = new prometheus.promClient.Counter({
    name: `${prometheus.prefix}community_pubsub_${toSnakeCase(peerType)}_peers_fetch_success_count`,
    help: `count of community pubsub ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch success labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  gauges[`lastCommunityPubsub${peerType}PeersFetchSuccess`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_pubsub_${toSnakeCase(peerType)}_peers_fetch_success`,
    help: `success gauge of last community pubsub ${toSnakeCase(peerType).replaceAll("_", " ")} peers fetch labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
  gauges[`lastCommunityPubsub${peerType}PeerCount`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}last_community_pubsub_${toSnakeCase(peerType)}_peer_count`,
    help: `gauge of last community pubsub ${toSnakeCase(peerType).replaceAll("_", " ")} peer count labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
  });
}
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveCommunityPubsubPeers = (communityAddress, peerType, peers) => {
  const labels = getCommunityMetricLabels(communityAddress);
  // counters
  counters[`communityPubsub${peerType}PeersFetchCount`].inc(labels, 1);
  if (peers) {
    counters[`communityPubsub${peerType}PeersFetchSuccessCount`].inc(labels, 1);
  }
  // gauges
  gauges[`lastCommunityPubsub${peerType}PeersFetchSuccess`].set(labels, peers ? 1 : 0);
  if (peers) {
    gauges[`lastCommunityPubsub${peerType}PeerCount`].set(labels, peers.length);
  }
};
const prometheusObserveCommunityPubsubMessage = (communityAddress, stats) => {
  const labels = getCommunityMetricLabels(communityAddress);
  counters.communityPubsubMessageCount.inc(labels, 1);
};
const prometheusObservePublish = (communityAddress, stats) => {
  const labels = getCommunityMetricLabels(communityAddress);
  // counters
  counters.communityPubsubPublishCount.inc(labels, 1);
  if (stats.lastPublishSuccess) {
    counters.communityPubsubPublishSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastPublishTime)) {
    counters.communityPubsubPublishDurationSeconds.inc(labels, stats.lastPublishTime);
  }
  if (isNumber(stats.lastPublishErrorCount)) {
    counters.communityPubsubPublishErrorCount.inc(labels, stats.lastPublishErrorCount);
  }
  // gauges
  if (isNumber(stats.lastPublishTime)) {
    gauges.communityPubsubLastPublishDurationSeconds.set(labels, stats.lastPublishTime);
  }
  if (isNumber(stats.lastPublishErrorCount)) {
    gauges.communityPubsubLastPublishErrorCount.set(labels, stats.lastPublishErrorCount);
  }
  gauges.communityPubsubLastPublishSuccess.set(labels, stats.lastPublishSuccess ? 1 : 0);
};
