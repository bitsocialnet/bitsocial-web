import assert from "node:assert/strict";
import { once } from "node:events";
import http from "node:http";
import test from "node:test";
import { create as createKubo } from "kubo-rpc-client";
import { createPubsubSubscriptions } from "./pubsub-subscriptions.js";

const topic = "12D3KooWNMybS8JqELi38ZBX897PrjWbCrGoMKfw3bgoqzC2n1Dh";
const peerId = "12D3KooWNMybS8JqELi38ZBX897PrjWbCrGoMKfw3bgoqzC2n1Dh";
const toRpc = (text) => `u${Buffer.from(text).toString("base64url")}`;

const waitFor = async (condition, message, timeoutMs = 5000) => {
  const start = Date.now();
  while (!condition()) {
    if (Date.now() - start > timeoutMs) {
      throw Error(message);
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
};

// fake kubo rpc: `onSub` answers each pubsub/sub request, and pubsub/ls lists the topics of the
// sub streams that are still open, like kubo, which drops a subscription when its stream closes
const startKubo = async (t, onSub, { listsOpenSubs = true } = {}) => {
  const subs = [];
  const server = http.createServer(async (req, res) => {
    for await (const _chunk of req) {
      // drain the request body
    }
    const url = new URL(req.url, "http://kubo");
    if (url.pathname === "/api/v0/pubsub/ls") {
      const topics = subs.filter((sub) => listsOpenSubs && sub.isOpen).map((sub) => sub.arg);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ Strings: [...new Set(topics)] }));
      return;
    }
    if (url.pathname !== "/api/v0/pubsub/sub") {
      res.writeHead(404);
      res.end();
      return;
    }
    const sub = {
      arg: url.searchParams.get("arg"),
      isOpen: false,
      open() {
        res.writeHead(200, { "content-type": "application/json" });
        res.flushHeaders();
        sub.isOpen = true;
      },
      send(data) {
        res.write(`${JSON.stringify({ from: peerId, data: toRpc(data), topicIDs: [sub.arg] })}\n`);
      },
      end() {
        sub.isOpen = false;
        res.end();
      },
      fail() {
        res.writeHead(500, { "content-type": "text/plain" });
        res.end("kubo stopped");
      },
      destroy() {
        sub.isOpen = false;
        res.destroy();
      },
    };
    res.on("close", () => {
      sub.isOpen = false;
    });
    subs.push(sub);
    onSub(sub, subs.length);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const kubo = createKubo({ url: `http://127.0.0.1:${server.address().port}` });
  const messages = [];
  const subscriptions = createPubsubSubscriptions({ pubsub: kubo.pubsub, retryDelayMs: 50 });
  t.after(async () => {
    await subscriptions.close();
    server.closeAllConnections();
    server.close();
  });
  return {
    subs,
    messages,
    subscriptions,
    add: () =>
      subscriptions.add(topic, (message) => messages.push(Buffer.from(message.data).toString())),
  };
};

test("subscribes again to a topic whose subscribe request failed after subscribe() resolved", async (t) => {
  const kubo = await startKubo(t, (sub, count) => {
    if (count === 1) {
      // kubo stalled and was restarted: the request fails after kubo-rpc-client's 1s wait
      setTimeout(() => sub.fail(), 1200);
      return;
    }
    sub.open();
  });

  kubo.add();
  await waitFor(() => kubo.subs[0]?.isOpen === false && kubo.subs.length === 1, "no sub request");
  await new Promise((resolve) => setTimeout(resolve, 1500));
  assert.equal(kubo.subs.length, 1, "kubo-rpc-client reported the late failure");

  assert.deepEqual(await kubo.subscriptions.resubscribeDropped(), [topic]);
  await waitFor(() => kubo.subs[1]?.isOpen, "the dropped topic was not subscribed again");
  kubo.subs[1].send("hello");
  await waitFor(() => kubo.messages.length === 1, "no message after resubscribing");
  assert.deepEqual(kubo.messages, ["hello"]);
});

test("subscribes again to a topic whose stream kubo ended cleanly", async (t) => {
  const kubo = await startKubo(t, (sub) => sub.open());

  kubo.add();
  await waitFor(() => kubo.subs[0]?.isOpen, "no sub stream");
  kubo.subs[0].end();

  assert.deepEqual(await kubo.subscriptions.resubscribeDropped(), [topic]);
  await waitFor(() => kubo.subs[1]?.isOpen, "the ended topic was not subscribed again");
  kubo.subs[1].send("hello");
  await waitFor(() => kubo.messages.length === 1, "no message after resubscribing");
  assert.deepEqual(kubo.messages, ["hello"]);
});

test("leaves a topic kubo is still subscribed to alone", async (t) => {
  const kubo = await startKubo(t, (sub) => sub.open());

  assert.equal(kubo.add(), true);
  assert.equal(kubo.add(), false, "a topic is only subscribed once");
  await waitFor(() => kubo.subs[0]?.isOpen, "no sub stream");

  assert.deepEqual(await kubo.subscriptions.resubscribeDropped(), []);
  kubo.subs[0].send("hello");
  await waitFor(() => kubo.messages.length === 1, "no message");
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert.equal(kubo.subs.length, 1);
  assert.deepEqual(kubo.messages, ["hello"]);
});

test("replaces a stream kubo no longer lists without delivering messages twice", async (t) => {
  const kubo = await startKubo(t, (sub) => sub.open(), { listsOpenSubs: false });

  kubo.add();
  await waitFor(() => kubo.subs[0]?.isOpen, "no sub stream");
  assert.deepEqual(await kubo.subscriptions.resubscribeDropped(), [topic]);
  await waitFor(() => kubo.subs[1]?.isOpen && !kubo.subs[0].isOpen, "the old stream was kept");
  // the old stream ending must not untrack the new one, which uses the same message callback
  await new Promise((resolve) => setTimeout(resolve, 1200));
  assert.equal(kubo.subs[1].isOpen, true, "the new stream was closed");
  kubo.subs[1].send("hello");
  await waitFor(() => kubo.messages.length === 1, "no message on the new stream");
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert.deepEqual(kubo.messages, ["hello"]);
});

test("subscribes again right away when the stream breaks", async (t) => {
  const kubo = await startKubo(t, (sub) => sub.open());

  kubo.add();
  await waitFor(() => kubo.subs[0]?.isOpen, "no sub stream");
  // a stream cut mid-response makes kubo-rpc-client call onError with fatal set
  kubo.subs[0].destroy();
  await waitFor(() => kubo.subs[1]?.isOpen, "the broken topic was not subscribed again");
  kubo.subs[1].send("hello");
  await waitFor(() => kubo.messages.length === 1, "no message after resubscribing");
  assert.deepEqual(kubo.messages, ["hello"]);
});
