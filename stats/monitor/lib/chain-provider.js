import config from "../config.js";
import monitorState from "./monitor-state.js";
import { fetchHtml, createCounter } from "./utils.js";
import prometheus from "./prometheus.js";
import PeerId from "peer-id";
import Debug from "debug";
import { BsoResolver } from "@bitsocial/bso-resolver";
const debug = Debug("bitsocial-stats-monitor:chain-provider");

// one resolver per monitored provider, unbatched so each probe times its own eth_call
const resolvers = {};
const resolve = (name, chainProviderUrl) => {
  if (!resolvers[chainProviderUrl]) {
    resolvers[chainProviderUrl] = new BsoResolver({
      key: `bso-${chainProviderUrl}`,
      provider: chainProviderUrl,
      batch: false,
    });
  }
  return resolvers[chainProviderUrl].resolve({ name });
};

const initChainProviderMonitorState = (chainProviderUrl) => {
  if (!monitorState.chainProviders[chainProviderUrl]) {
    monitorState.chainProviders[chainProviderUrl] = {};
  }
};

export const monitorChainProviders = async () => {
  let chainProviderUrls = [];
  for (const chainTicker in config.monitoring.chainProviders) {
    for (const chainProviderUrl of config.monitoring.chainProviders[chainTicker].urls) {
      chainProviderUrls.push(chainProviderUrl);
      initChainProviderMonitorState(chainProviderUrl);

      // resolve addresses
      getResolveAddressStats(
        chainProviderUrl,
        chainTicker,
        config.monitoring.chainProviders[chainTicker].chainId,
      )
        .then((stats) => {
          monitorState.chainProviders[chainProviderUrl] = { chainTicker, ...stats };
          prometheusObserveResolveAddress(chainProviderUrl, chainTicker, stats);
        })
        .catch((e) => debug(e.message));
    }
  }
  debug(`monitoring ${chainProviderUrls.length} chain providers: ${chainProviderUrls.join(" ")}`);
};

const isPeerId = (string) => {
  try {
    PeerId.parse(string);
    return true;
  } catch (e) {
    return false;
  }
};

// 5chan's feedback board, listed with its public key in data/5chan-directories.snapshot.json
const probeNames = { eth: "5chan-feedback.bso" };

const countResolveAddress = createCounter();
const getResolveAddressStats = async (chainProviderUrl, chainTicker, chainId) => {
  const probeName = probeNames[chainTicker];
  if (!probeName) {
    throw Error(`no probe name for chainTicker '${chainTicker}' to monitor '${chainProviderUrl}'`);
  }

  let lastResolveAddressSuccess = false;
  let lastResolveAddressTime;
  try {
    const beforeTimestamp = Date.now();
    const publicKey = (await resolve(probeName, chainProviderUrl))?.publicKey;
    if (!isPeerId(publicKey)) {
      throw Error(
        `failed fetching got response '${publicKey?.substring ? publicKey.substring(0, 300).replace(/\s*\n\s*/g, " ") : publicKey}'`,
      );
    }
    lastResolveAddressSuccess = true;
    lastResolveAddressTime = (Date.now() - beforeTimestamp) / 1000;

    debug(
      `resolved '${chainTicker}' address from '${chainProviderUrl}' in ${lastResolveAddressTime}s`,
    );
  } catch (e) {
    debug(`failed resolving '${chainTicker}' address from '${chainProviderUrl}': ${e.message}`);
  }

  return {
    resolveAddressCount: countResolveAddress(chainProviderUrl + chainTicker + chainId),
    lastResolveAddressSuccess,
    lastResolveAddressTime,
  };
};
// test
// debug(await getResolveAddressStats('https://ethereum-rpc.publicnode.com', 'eth', 1))
// debug(await getResolveAddressStats('viem', 'eth', 1))

// test
// monitorChainProviders(); setInterval(() => monitorChainProviders(), 1000 * 60 * 10)

// prometheus
const resolveAddressLabelNames = ["chain_provider_url", "chain_ticker"];
const counters = {
  resolveAddressCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}chain_provider_resolve_address_count`,
    help: `count of chain providers resolve address labeled with: ${resolveAddressLabelNames.join(", ")}`,
    labelNames: resolveAddressLabelNames,
    registers: [prometheus.promClient.register],
  }),
  resolveAddressDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}chain_provider_resolve_address_duration_seconds_sum`,
    help: `count of chain providers resolve address duration seconds labeled with: ${resolveAddressLabelNames.join(", ")}`,
    labelNames: resolveAddressLabelNames,
    registers: [prometheus.promClient.register],
  }),
  resolveAddressSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}chain_provider_resolve_address_success_count`,
    help: `count of chain providers resolve address success labeled with: ${resolveAddressLabelNames.join(", ")}`,
    labelNames: resolveAddressLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastResolveAddressDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}chain_provider_last_resolve_address_duration_seconds`,
    help: `duration gauge of last chain providers resolve address labeled with: ${resolveAddressLabelNames.join(", ")}`,
    labelNames: resolveAddressLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastResolveAddressSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}chain_provider_last_resolve_address_success`,
    help: `success gauge of last chain providers resolve address labeled with: ${resolveAddressLabelNames.join(", ")}`,
    labelNames: resolveAddressLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveResolveAddress = (chainProviderUrl, chainTicker, stats) => {
  const labels = { chain_provider_url: chainProviderUrl, chain_ticker: chainTicker };
  // counters
  counters.resolveAddressCount.inc(labels, 1);
  if (stats.lastResolveAddressSuccess) {
    counters.resolveAddressSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastResolveAddressTime)) {
    counters.resolveAddressDurationSeconds.inc(labels, stats.lastResolveAddressTime);
  }
  // gauges
  if (isNumber(stats.lastResolveAddressTime)) {
    gauges.lastResolveAddressDurationSeconds.set(labels, stats.lastResolveAddressTime);
  }
  gauges.lastResolveAddressSuccess.set(labels, stats.lastResolveAddressSuccess ? 1 : 0);
};
