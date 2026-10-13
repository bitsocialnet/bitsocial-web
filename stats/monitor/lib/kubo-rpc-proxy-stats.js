import fetch from "node-fetch";
import Debug from "debug";
import config from "../config.js";
import prometheus from "./prometheus.js";
import { kuboRpcProxyStatsPath, parseKuboRpcProxyStats } from "./kubo-rpc-proxy.js";
import { notifyProbeTransition } from "./telegram-alerts.js";

const debug = Debug("bitsocial-stats-monitor:kubo-rpc-proxy");

const statsTimeoutMs = 1000 * 15;
const defaultMaxUpstreamSockets = 1000;
// requests only queue once the rpc pool is full, and healthy kubo calls free a socket within
// seconds, so a queue that lasts this many polls (1 per minute) means the pool is stuck
const stuckQueuePolls = 3;

let consecutiveQueuedPolls = 0;

export const monitorKuboRpcProxy = async () => {
  // the start-ipfs.js proxy serves its stats next to the kubo rpc api it proxies
  const statsUrl = new URL(kuboRpcProxyStatsPath, config.kuboRpcUrl).toString();
  let stats;
  try {
    const response = await fetch(statsUrl, { signal: AbortSignal.timeout(statsTimeoutMs) });
    if (!response.ok) {
      throw Error(`HTTP ${response.status}`);
    }
    stats = parseKuboRpcProxyStats(await response.json());
  } catch (e) {
    // no proxy in front of kubo (e.g. a local kubo on 5001), the ipfs container is down,
    // or the proxy answers in a shape this monitor doesn't know
    debug(`failed fetching kubo rpc proxy stats from '${statsUrl}': ${e.message}`);
    gauges.upstreamSockets.reset();
    gauges.queuedRequests.reset();
    consecutiveQueuedPolls = 0;
    return;
  }

  gauges.upstreamSockets.set({ pool: "rpc", state: "active" }, stats.rpcActive);
  gauges.upstreamSockets.set({ pool: "rpc", state: "idle" }, stats.rpcIdle);
  gauges.upstreamSockets.set({ pool: "stream", state: "active" }, stats.stream);
  gauges.queuedRequests.set({ pool: "rpc" }, stats.queuedRequests);

  consecutiveQueuedPolls = stats.queuedRequests > 0 ? consecutiveQueuedPolls + 1 : 0;
  const maxUpstreamSockets =
    config.monitoring.kuboRpcProxy?.maxUpstreamSockets ?? defaultMaxUpstreamSockets;
  const tooManySockets = stats.upstreamSockets > maxUpstreamSockets;
  const poolStuck = consecutiveQueuedPolls >= stuckQueuePolls;
  let summary = `The Kubo RPC proxy is back to ${stats.upstreamSockets} upstream sockets with no queued requests.`;
  if (tooManySockets) {
    summary = `The Kubo RPC proxy has ${stats.upstreamSockets} sockets open to Kubo, above the limit of ${maxUpstreamSockets}. Restarting the ipfs container clears them.`;
  } else if (poolStuck) {
    summary = `The Kubo RPC proxy's rpc pool has been full for ${consecutiveQueuedPolls} minutes with ${stats.queuedRequests} requests waiting for a socket. Kubo is stuck or rpc calls are leaking.`;
  }
  await notifyProbeTransition({
    id: "kuboRpcProxy:upstreamSockets",
    label: "Kubo RPC proxy upstream sockets",
    ok: !tooManySockets && !poolStuck,
    summary,
    details: [
      `url=${statsUrl}`,
      `rpc_active=${stats.rpcActive}`,
      `rpc_idle=${stats.rpcIdle}`,
      `stream=${stats.stream}`,
      `queued_requests=${stats.queuedRequests}`,
    ].join("\n"),
  });
};

// prometheus
const upstreamSocketsLabelNames = ["pool", "state"];
const gauges = {
  upstreamSockets: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}kubo_rpc_proxy_upstream_sockets`,
    help: `gauge of sockets the kubo rpc proxy has open to kubo labeled with: ${upstreamSocketsLabelNames.join(", ")}`,
    labelNames: upstreamSocketsLabelNames,
    registers: [prometheus.promClient.register],
  }),
  queuedRequests: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}kubo_rpc_proxy_queued_requests`,
    help: "gauge of kubo rpc proxy requests waiting for a free upstream socket labeled with: pool",
    labelNames: ["pool"],
    registers: [prometheus.promClient.register],
  }),
};
