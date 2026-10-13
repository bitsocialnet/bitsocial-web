import fetch from "node-fetch";
import Debug from "debug";
import config from "../config.js";
import prometheus from "./prometheus.js";
import { notifyProbeTransition } from "./telegram-alerts.js";

const debug = Debug("bitsocial-stats-monitor:kubo-rpc-proxy");

const statsTimeoutMs = 1000 * 15;
const defaultMaxUpstreamSockets = 1000;

export const monitorKuboRpcProxy = async () => {
  // the start-ipfs.js proxy serves its stats next to the kubo rpc api it proxies
  const statsUrl = new URL("/proxy/stats", config.kuboRpcUrl).toString();
  let stats;
  try {
    const response = await fetch(statsUrl, { signal: AbortSignal.timeout(statsTimeoutMs) });
    if (!response.ok) {
      throw Error(`HTTP ${response.status}`);
    }
    stats = await response.json();
  } catch (e) {
    // no proxy in front of kubo (e.g. a local kubo on 5001), or the ipfs container is down
    debug(`failed fetching kubo rpc proxy stats from '${statsUrl}': ${e.message}`);
    gauges.upstreamSockets.reset();
    gauges.queuedRequests.reset();
    return;
  }

  const { rpcActive, rpcIdle, stream } = stats.upstreamSockets;
  gauges.upstreamSockets.set({ pool: "rpc", state: "active" }, rpcActive);
  gauges.upstreamSockets.set({ pool: "rpc", state: "idle" }, rpcIdle);
  gauges.upstreamSockets.set({ pool: "stream", state: "active" }, stream);
  gauges.queuedRequests.set({ pool: "rpc" }, stats.queuedRequests);

  const upstreamSockets = rpcActive + rpcIdle + stream;
  const maxUpstreamSockets =
    config.monitoring.kuboRpcProxy?.maxUpstreamSockets ?? defaultMaxUpstreamSockets;
  const ok = upstreamSockets <= maxUpstreamSockets;
  await notifyProbeTransition({
    id: "kuboRpcProxy:upstreamSockets",
    label: "Kubo RPC proxy upstream sockets",
    ok,
    summary: ok
      ? `The Kubo RPC proxy is back to ${upstreamSockets} upstream sockets.`
      : `The Kubo RPC proxy has ${upstreamSockets} sockets open to Kubo, above the limit of ${maxUpstreamSockets}. Restarting the ipfs container clears them.`,
    details: [
      `url=${statsUrl}`,
      `rpc_active=${rpcActive}`,
      `rpc_idle=${rpcIdle}`,
      `stream=${stream}`,
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
