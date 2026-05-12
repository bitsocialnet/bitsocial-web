import fetch from "node-fetch";
import Debug from "debug";
import config from "../config.js";
import monitorState from "./monitor-state.js";
import prometheus from "./prometheus.js";
import { createCounter, fetchOptions } from "./utils.js";
import { notifyProbeTransition } from "./telegram-alerts.js";

const debug = Debug("bitsocial-stats-monitor:service-probe");

const DEFAULT_TIMEOUT_MS = 15000;
const failureReasons = [
  "body_mismatch",
  "connection_error",
  "dns_error",
  "fetch_error",
  "status_mismatch",
  "timeout",
  "tls_error",
  "unknown",
];

export const monitorServiceProbes = async () => {
  debug(
    `monitoring ${config.monitoring.serviceProbes?.length || 0} service probes: ${config.monitoring.serviceProbes
      ?.map((probe) => probe.id)
      .join(" ")}`,
  );

  for (const probe of config.monitoring.serviceProbes || []) {
    getServiceProbeStats(probe)
      .then((stats) => {
        monitorState.serviceProbes[probe.id] = stats;
        prometheusObserveServiceProbe(probe, stats);
        return notifyProbeTransition({
          id: `serviceProbe:${probe.id}`,
          label: probe.label || probe.id,
          ok: stats.lastServiceProbeSuccess,
          summary: stats.lastServiceProbeSuccess
            ? `${probe.label || probe.id} is healthy.`
            : stats.lastServiceProbeError || `${probe.label || probe.id} probe failed.`,
          details: [
            `url=${probe.url}`,
            `status=${stats.lastServiceProbeStatusCode ?? "none"}`,
            stats.lastServiceProbeMessage ? `message=${stats.lastServiceProbeMessage}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        });
      })
      .catch((error) => debug(error.message));
  }
};

const countServiceProbe = createCounter();

const classifyFetchError = (error) => {
  const code = error?.code || error?.cause?.code;
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    return "dns_error";
  }
  if (code === "ECONNREFUSED" || code === "ECONNRESET" || code === "ETIMEDOUT") {
    return "connection_error";
  }
  if (code?.includes?.("CERT") || code === "DEPTH_ZERO_SELF_SIGNED_CERT") {
    return "tls_error";
  }
  return "fetch_error";
};

const getExpectedBodyRegex = (probe) => {
  if (!probe.expectedBodyMatch) {
    return null;
  }
  return new RegExp(probe.expectedBodyMatch);
};

export const getServiceProbeStats = async (probe) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), probe.timeoutMs || DEFAULT_TIMEOUT_MS);
  const beforeTimestamp = Date.now();
  let lastServiceProbeSuccess = false;
  let lastServiceProbeDurationSeconds;
  let lastServiceProbeStatusCode;
  let lastServiceProbeError;
  let lastServiceProbeMessage;

  try {
    const headers = {
      ...probe.headers,
    };
    let body;
    if (probe.json !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(probe.json);
    } else if (probe.body !== undefined) {
      body = probe.body;
    }

    const response = await fetch(probe.url, {
      ...fetchOptions,
      method: probe.method || "GET",
      headers: {
        ...fetchOptions.headers,
        ...headers,
      },
      body,
      signal: controller.signal,
    });
    const responseText = await response.text();
    lastServiceProbeDurationSeconds = (Date.now() - beforeTimestamp) / 1000;
    lastServiceProbeStatusCode = response.status;

    const expectedStatus = probe.expectedStatus ?? 200;
    if (response.status !== expectedStatus) {
      lastServiceProbeError = "status_mismatch";
      lastServiceProbeMessage = `expected HTTP ${expectedStatus}, got HTTP ${response.status}`;
    } else {
      const expectedBodyRegex = getExpectedBodyRegex(probe);
      if (expectedBodyRegex && !expectedBodyRegex.test(responseText)) {
        lastServiceProbeError = "body_mismatch";
        lastServiceProbeMessage = `response did not match /${probe.expectedBodyMatch}/`;
      } else {
        lastServiceProbeSuccess = true;
        lastServiceProbeMessage = `HTTP ${response.status}`;
      }
    }
  } catch (error) {
    lastServiceProbeDurationSeconds = (Date.now() - beforeTimestamp) / 1000;
    lastServiceProbeError = error.name === "AbortError" ? "timeout" : classifyFetchError(error);
    lastServiceProbeMessage = error.message;
  } finally {
    clearTimeout(timeout);
  }

  const stats = {
    id: probe.id,
    label: probe.label || probe.id,
    url: probe.url,
    serviceProbeCount: countServiceProbe(probe.id),
    lastServiceProbeSuccess,
    lastServiceProbeDurationSeconds,
    lastServiceProbeStatusCode,
    lastServiceProbeError,
    lastServiceProbeMessage,
    checkedAt: new Date().toISOString(),
  };

  debug(
    `${lastServiceProbeSuccess ? "passed" : "failed"} service probe '${probe.id}': ${
      lastServiceProbeMessage || lastServiceProbeError
    }`,
  );

  return stats;
};

const serviceProbeLabelNames = ["service_probe_id", "service_probe_label", "service_probe_url"];
const serviceProbeFailureLabelNames = [...serviceProbeLabelNames, "failure_reason"];
const counters = {
  serviceProbeCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}service_probe_count`,
    help: `count of service probes labeled with: ${serviceProbeLabelNames.join(", ")}`,
    labelNames: serviceProbeLabelNames,
    registers: [prometheus.promClient.register],
  }),
  serviceProbeSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}service_probe_success_count`,
    help: `count of successful service probes labeled with: ${serviceProbeLabelNames.join(", ")}`,
    labelNames: serviceProbeLabelNames,
    registers: [prometheus.promClient.register],
  }),
  serviceProbeDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}service_probe_duration_seconds_sum`,
    help: `sum of service probe durations in seconds labeled with: ${serviceProbeLabelNames.join(", ")}`,
    labelNames: serviceProbeLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastServiceProbeDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}service_probe_last_duration_seconds`,
    help: `duration gauge of the last service probe labeled with: ${serviceProbeLabelNames.join(", ")}`,
    labelNames: serviceProbeLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastServiceProbeSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}service_probe_last_success`,
    help: `success gauge of the last service probe labeled with: ${serviceProbeLabelNames.join(", ")}`,
    labelNames: serviceProbeLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastServiceProbeStatusCode: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}service_probe_last_status_code`,
    help: `HTTP status code of the last service probe labeled with: ${serviceProbeLabelNames.join(", ")}`,
    labelNames: serviceProbeLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastServiceProbeFailure: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}service_probe_last_failure`,
    help: `failure reason of the last service probe labeled with: ${serviceProbeFailureLabelNames.join(", ")}`,
    labelNames: serviceProbeFailureLabelNames,
    registers: [prometheus.promClient.register],
  }),
};

const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveServiceProbe = (probe, stats) => {
  const labels = {
    service_probe_id: probe.id,
    service_probe_label: probe.label || probe.id,
    service_probe_url: probe.url,
  };

  counters.serviceProbeCount.inc(labels, 1);
  if (stats.lastServiceProbeSuccess) {
    counters.serviceProbeSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastServiceProbeDurationSeconds)) {
    counters.serviceProbeDurationSeconds.inc(labels, stats.lastServiceProbeDurationSeconds);
    gauges.lastServiceProbeDurationSeconds.set(labels, stats.lastServiceProbeDurationSeconds);
  }
  gauges.lastServiceProbeSuccess.set(labels, stats.lastServiceProbeSuccess ? 1 : 0);
  if (isNumber(stats.lastServiceProbeStatusCode)) {
    gauges.lastServiceProbeStatusCode.set(labels, stats.lastServiceProbeStatusCode);
  }

  for (const failure_reason of failureReasons) {
    gauges.lastServiceProbeFailure.set({ ...labels, failure_reason }, 0);
  }
  if (!stats.lastServiceProbeSuccess) {
    gauges.lastServiceProbeFailure.set(
      {
        ...labels,
        failure_reason: stats.lastServiceProbeError || "unknown",
      },
      1,
    );
  }
};
