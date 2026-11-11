import assert from "node:assert/strict";
import test from "node:test";
import { createProbeTransitionNotifier } from "./probe-alerts.js";

const createNotifier = (alerts, results = []) => {
  const sent = [];
  const notify = createProbeTransitionNotifier({
    getAlerts: () => alerts,
    alertName: "Stats",
    sendMessage: async (text) => {
      sent.push(text.split("\n")[0]);
      const result = results.shift() ?? true;
      if (result instanceof Error) {
        throw result;
      }
      return result;
    },
  });
  const probe = (ok) => notify({ id: "probe", label: "Probe", ok, summary: "summary" });
  return { sent, probe };
};

test("retries a DOWN alert whose send failed on the next poll", async () => {
  const alerts = {};
  const { sent, probe } = createNotifier(alerts, [Error("HTTP 429")]);

  await probe(false);
  assert.equal(alerts.probe.lastNotificationStatus, "failed");
  await probe(false);
  assert.deepEqual(sent, ["<b>Stats DOWN</b>", "<b>Stats DOWN</b>"]);
  assert.equal(alerts.probe.lastNotificationStatus, "sent");

  await probe(false);
  assert.equal(sent.length, 2, "a delivered DOWN alert is not sent again");
});

test("retries a failed DOWN alert after the alerts were saved to disk and loaded again", async () => {
  const alerts = {};
  await createNotifier(alerts, [Error("HTTP 502")]).probe(false);

  // monitorState.json round trip, as on a monitor restart
  const { sent, probe } = createNotifier(JSON.parse(JSON.stringify(alerts)));
  await probe(false);
  assert.deepEqual(sent, ["<b>Stats DOWN</b>"]);
});

test("retries a RECOVERED alert whose send failed on the next poll", async () => {
  const alerts = {};
  const { sent, probe } = createNotifier(alerts, [true, Error("fetch failed")]);

  await probe(false);
  await probe(true);
  await probe(true);
  assert.deepEqual(sent, ["<b>Stats DOWN</b>", "<b>Stats RECOVERED</b>", "<b>Stats RECOVERED</b>"]);

  await probe(true);
  assert.equal(sent.length, 3, "a delivered RECOVERED alert is not sent again");
});

test("drops an undelivered DOWN alert when the probe recovers before a retry succeeds", async () => {
  const alerts = {};
  const { sent, probe } = createNotifier(alerts, [Error("HTTP 500")]);

  await probe(false);
  await probe(true);
  assert.deepEqual(sent, ["<b>Stats DOWN</b>"], "no RECOVERED for a DOWN the operator never got");
});

test("stays silent for a first healthy poll and when alerts are disabled", async () => {
  const alerts = {};
  const { sent, probe } = createNotifier(alerts, [false, false]);

  await probe(true);
  assert.deepEqual(sent, []);
  await probe(false);
  assert.equal(alerts.probe.lastNotificationStatus, "disabled");
  await probe(false);
  assert.equal(sent.length, 1, "a disabled send is not retried every poll");
});

test("keeps a long alert under Telegram's length cap with its markup intact", async () => {
  const sent = [];
  const notify = createProbeTransitionNotifier({
    getAlerts: () => ({}),
    alertName: "Stats",
    sendMessage: async (text) => sent.push(text),
  });

  await notify({
    id: "probe",
    label: "Probe",
    ok: false,
    summary: "<&>".repeat(1000),
    details: "a&b".repeat(2000),
  });
  const [message] = sent;
  // telegram-alerts.js cuts anything longer, which could split a tag or an entity
  assert.ok(message.length <= 3500, `message is ${message.length} characters`);
  assert.ok(message.endsWith("...</pre>"), "the details are clipped inside their <pre>");
  assert.doesNotMatch(
    message.replaceAll(/<\/?(b|pre)>/g, ""),
    /[<>]|&(?!(amp|lt|gt);)/,
    "no tag or entity was split",
  );
});

test("treats alerts saved before notifiedState existed as already notified", async () => {
  const alerts = {
    down: { state: "down", lastNotificationStatus: "sent" },
    up: { state: "up" },
  };
  const sent = [];
  const notify = createProbeTransitionNotifier({
    getAlerts: () => alerts,
    alertName: "Stats",
    sendMessage: async (text) => sent.push(text.split("\n")[1]),
  });

  await notify({ id: "down", label: "Down", ok: false, summary: "still down" });
  await notify({ id: "up", label: "Up", ok: true, summary: "still up" });
  assert.deepEqual(sent, []);
  await notify({ id: "up", label: "Up", ok: false, summary: "now down" });
  assert.deepEqual(sent, ["<b>Up</b>"]);
});
