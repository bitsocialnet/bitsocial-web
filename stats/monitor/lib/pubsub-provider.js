import config from "../config.js";
import monitorState from "./monitor-state.js";
import {
  fetchDhtPeers,
  fetchHttpRoutersPeers,
  pubsubTopicToDhtKey,
  getTimeAgo,
  createCounter,
} from "./utils.js";
import * as cborg from "cborg";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { kuboPubsub, kuboPubsubProviders, pubsubKuboRpcUrl } from "./pkc-js/pkc-js.js";
import prometheus from "./prometheus.js";
import { createEd25519PeerId } from "@libp2p/peer-id-factory";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:pubsub-provider");

const waitForMessageTimeoutMs = 1000 * 60 * 5;

export const monitorPubsubProviders = async () => {
  for (const pubsubProviderUrl of config.monitoring.pubsubProviderUrls || []) {
    getPublishStats(pubsubProviderUrl)
      .then((stats) => {
        monitorState.pubsubProviders[pubsubProviderUrl] = {
          ...monitorState.pubsubProviders[pubsubProviderUrl],
          ...stats,
        };
        prometheusObservePublish(pubsubProviderUrl, stats);
      })
      .catch((e) => debug(e.message));
  }
};

const createOnMessage = () => {
  let resolveWaitForMessagePromise;
  let rejectWaitForMessagePromise;
  const waitForMessagePromise = new Promise((resolve, reject) => {
    resolveWaitForMessagePromise = resolve;
    rejectWaitForMessagePromise = reject;
  });

  let messageWaiting;
  const waitForMessage = (message) => {
    messageWaiting = message;
    setTimeout(() => {
      rejectWaitForMessagePromise(Error(`waitForMessage timed out ${waitForMessageTimeoutMs}ms`));
    }, waitForMessageTimeoutMs);
    return waitForMessagePromise;
  };

  const onMessage = (rawMessage) => {
    const message = new TextDecoder().decode(rawMessage?.data);
    // debug('message:', message)
    if (messageWaiting && message === messageWaiting) {
      resolveWaitForMessagePromise();
    }
  };
  onMessage.waitForMessage = waitForMessage;

  return onMessage;
};

const countPublish = createCounter();
const getPublishStats = async (pubsubProviderUrl) => {
  const kuboPubsubProvider = kuboPubsubProviders[pubsubProviderUrl];
  if (!kuboPubsubProvider) {
    throw Error(`config.monitoring.pubsubProviderUrls missing url '${pubsubProviderUrl}'`);
  }
  const pubsubTopic = (await createEd25519PeerId()).toString(); // random pubsub topic
  const pubsubTopicRoutingCid = await pubsubTopicToDhtKey(pubsubTopic);

  let lastSubscribeSuccess = false;
  let lastSubscribeTime;
  let lastPublishSuccess = false;
  let lastPublishTime;

  try {
    // subscribe from ipfs api
    debug(`subscribing to pubsub topic '${pubsubTopic}' from '${pubsubKuboRpcUrl}'...`);
    const ipfsApiOnMessage = createOnMessage();
    await kuboPubsub.pubsub.subscribe(pubsubTopic, ipfsApiOnMessage, { onError: debug });

    // subscribe from pubsub provider
    debug(
      `subscribing to pubsub topic '${pubsubTopic}' (peers cid: ${pubsubTopicRoutingCid}) from pubsub provider '${pubsubProviderUrl}'...`,
    );
    const pubsubProviderOnMessage = createOnMessage();
    const beforeTimestamp = Date.now();
    await kuboPubsubProvider.pubsub.subscribe(pubsubTopic, pubsubProviderOnMessage, {
      onError: debug,
    });
    lastSubscribeSuccess = true;
    lastSubscribeTime = (Date.now() - beforeTimestamp) / 1000;

    // publish from pubsub provider
    const randomMessage = `hello from pubsub provider ${new Date().toISOString()}`;
    let waitForMessagePromise = ipfsApiOnMessage.waitForMessage(randomMessage);
    kuboPubsubProvider.pubsub
      .publish(pubsubTopic, Buffer.from(randomMessage)) // don't await this, causes bug
      .catch((e) =>
        debug(`failed kuboPubsubProvider.pubsub.publish from '${pubsubProviderUrl}': ${e.message}`),
      );
    await waitForMessagePromise;

    // publish from ipfs api
    const randomMessage2 = `hello from bitsocial stats monitor ${new Date().toISOString()}`;
    waitForMessagePromise = pubsubProviderOnMessage.waitForMessage(randomMessage2);
    kuboPubsub.pubsub
      .publish(pubsubTopic, Buffer.from(randomMessage2)) // don't await this, causes bug
      .catch((e) =>
        debug(`failed kuboPubsub.pubsub.publish from '${pubsubProviderUrl}': ${e.message}`),
      );
    await waitForMessagePromise;
    lastPublishSuccess = true;
    lastPublishTime = (Date.now() - beforeTimestamp) / 1000;
    debug(`published to pubsub provider ${pubsubProviderUrl} in ${lastPublishTime}s`);
  } catch (e) {
    debug(`failed to publish to pubsub provider ${pubsubProviderUrl}: ${e.message}`);
  }

  kuboPubsubProvider.pubsub
    .unsubscribe(pubsubTopic)
    .catch((e) => debug(`failed to pubsub unsubscribe from '${pubsubProviderUrl}': ${e.message}`));
  kuboPubsub.pubsub
    .unsubscribe(pubsubTopic)
    .catch((e) => debug(`failed to pubsub unsubscribe from '${pubsubKuboRpcUrl}': ${e.message}`));

  return {
    publishCount: countPublish(pubsubProviderUrl),
    lastSubscribeSuccess,
    lastSubscribeTime,
    lastPublishSuccess,
    lastPublishTime,
  };
};
// test
// debug(await getPublishStats('https://pubsubprovider.xyz/api/v0'))
// debug(await getPublishStats('https://rannithepleb.com/api/v0'))
// debug(await getPublishStats('https://plebpubsub.xyz/api/v0'))
// debug(await getPublishStats('https://example.com.xyz/api/v0'))
// monitorPubsubProviders()

// prometheus
const publishLabelNames = ["pubsub_provider_url"];
const counters = {
  publishCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}pubsub_provider_publish_count`,
    help: `count of pubsub providers publish labeled with: ${publishLabelNames.join(", ")}`,
    labelNames: publishLabelNames,
    registers: [prometheus.promClient.register],
  }),
  publishDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}pubsub_provider_publish_duration_seconds_sum`,
    help: `count of pubsub providers publish duration seconds labeled with: ${publishLabelNames.join(", ")}`,
    labelNames: publishLabelNames,
    registers: [prometheus.promClient.register],
  }),
  publishSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}pubsub_provider_publish_success_count`,
    help: `count of pubsub providers publish success labeled with: ${publishLabelNames.join(", ")}`,
    labelNames: publishLabelNames,
    registers: [prometheus.promClient.register],
  }),
  subscribeDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}pubsub_provider_subscribe_duration_seconds_sum`,
    help: `count of pubsub providers subscribe duration seconds labeled with: ${publishLabelNames.join(", ")}`,
    labelNames: publishLabelNames,
    registers: [prometheus.promClient.register],
  }),
  subscribeSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}pubsub_provider_subscribe_success_count`,
    help: `count of pubsub providers subscribe success labeled with: ${publishLabelNames.join(", ")}`,
    labelNames: publishLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastPublishDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}pubsub_provider_last_publish_duration_seconds`,
    help: `duration gauge of last pubsub providers publish labeled with: ${publishLabelNames.join(", ")}`,
    labelNames: publishLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastPublishSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}pubsub_provider_last_publish_success`,
    help: `success gauge of last pubsub providers publish labeled with: ${publishLabelNames.join(", ")}`,
    labelNames: publishLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastSubscribeDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}pubsub_provider_last_subscribe_duration_seconds`,
    help: `duration gauge of last pubsub providers subscribe labeled with: ${publishLabelNames.join(", ")}`,
    labelNames: publishLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastSubscribeSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}pubsub_provider_last_subscribe_success`,
    help: `success gauge of last pubsub providers subscribe labeled with: ${publishLabelNames.join(", ")}`,
    labelNames: publishLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObservePublish = (pubsubProviderUrl, stats) => {
  const labels = { pubsub_provider_url: pubsubProviderUrl };
  // counters
  counters.publishCount.inc(labels, 1);
  if (stats.lastPublishSuccess) {
    counters.publishSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastPublishTime)) {
    counters.publishDurationSeconds.inc(labels, stats.lastPublishTime);
  }
  if (stats.lastSubscribeSuccess) {
    counters.subscribeSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastSubscribeTime)) {
    counters.subscribeDurationSeconds.inc(labels, stats.lastSubscribeTime);
  }
  // gauges
  if (isNumber(stats.lastPublishTime)) {
    gauges.lastPublishDurationSeconds.set(labels, stats.lastPublishTime);
  }
  gauges.lastPublishSuccess.set(labels, stats.lastPublishSuccess ? 1 : 0);
  if (isNumber(stats.lastSubscribeTime)) {
    gauges.lastSubscribeDurationSeconds.set(labels, stats.lastSubscribeTime);
  }
  gauges.lastSubscribeSuccess.set(labels, stats.lastSubscribeSuccess ? 1 : 0);
};
