import config from "../config.js";
import monitorState from "./monitor-state.js";
import { fetchHtml, createCounter } from "./utils.js";
import prometheus from "./prometheus.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:webpage");

export const monitorWebpages = async () => {
  debug(
    `monitoring ${config.monitoring.webpages?.length} webpages: ${config.monitoring.webpages?.map((webpage) => webpage.url).join(" ")}`,
  );
  for (const webpage of config.monitoring.webpages || []) {
    // webpage fetches
    getWebpageFetchStats(webpage.url, webpage.match)
      .then((stats) => {
        monitorState.webpages[webpage.url] = stats;
        prometheusObserveWebpageFetch(webpage.url, stats);
      })
      .catch((e) => debug(e.message));
  }
};

const countWebpageFetch = createCounter();
const getWebpageFetchStats = async (webpageUrl, match) => {
  let lastWebpageFetchSuccess = false;
  let lastWebpageFetchTime;

  try {
    const beforeTimestamp = Date.now();
    const fetchedHtml = await fetchHtml(webpageUrl);
    if (!fetchedHtml.match(match)) {
      throw Error(
        `not matching regex '/${match}/' got response '${fetchedHtml.substring(0, 300).replace(/\s*\n\s*/g, " ")}'`,
      );
    }
    lastWebpageFetchSuccess = true;
    lastWebpageFetchTime = (Date.now() - beforeTimestamp) / 1000;

    debug(`fetched webpage '${webpageUrl}' in ${lastWebpageFetchTime}s`);
  } catch (e) {
    debug(`failed fetching webpage '${webpageUrl}': ${e.message}`);
  }

  return {
    webpageFetchCount: countWebpageFetch(webpageUrl),
    lastWebpageFetchSuccess,
    lastWebpageFetchTime,
  };
};
// test
// debug(await getWebpageFetchStats('https://plebbit.com', 'test'))

// test
// monitorWebpages(); setInterval(() => monitorWebpages(), 1000 * 60 * 10)

// prometheus
const webpageFetchLabelNames = ["webpage_url"];
const counters = {
  webpageFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}webpage_webpage_fetch_count`,
    help: `count of webpages webpage fetch labeled with: ${webpageFetchLabelNames.join(", ")}`,
    labelNames: webpageFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  webpageFetchDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}webpage_webpage_fetch_duration_seconds_sum`,
    help: `count of webpages webpage fetch duration seconds labeled with: ${webpageFetchLabelNames.join(", ")}`,
    labelNames: webpageFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  webpageFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}webpage_webpage_fetch_success_count`,
    help: `count of webpages webpage fetch success labeled with: ${webpageFetchLabelNames.join(", ")}`,
    labelNames: webpageFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastWebpageFetchDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}webpage_last_webpage_fetch_duration_seconds`,
    help: `duration gauge of last webpages webpage fetch labeled with: ${webpageFetchLabelNames.join(", ")}`,
    labelNames: webpageFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastWebpageFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}webpage_last_webpage_fetch_success`,
    help: `success gauge of last webpages webpage fetch labeled with: ${webpageFetchLabelNames.join(", ")}`,
    labelNames: webpageFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveWebpageFetch = (webpageUrl, stats) => {
  const labels = { webpage_url: webpageUrl };
  // counters
  counters.webpageFetchCount.inc(labels, 1);
  if (stats.lastWebpageFetchSuccess) {
    counters.webpageFetchSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastWebpageFetchTime)) {
    counters.webpageFetchDurationSeconds.inc(labels, stats.lastWebpageFetchTime);
  }
  // gauges
  if (isNumber(stats.lastWebpageFetchTime)) {
    gauges.lastWebpageFetchDurationSeconds.set(labels, stats.lastWebpageFetchTime);
  }
  gauges.lastWebpageFetchSuccess.set(labels, stats.lastWebpageFetchSuccess ? 1 : 0);
};
