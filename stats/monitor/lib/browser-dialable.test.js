import assert from "node:assert/strict";
import test from "node:test";
import { createBrowserDialableFilter, getBrowserWssUrls, probeWss } from "./browser-dialable.js";

const peerId = "12D3KooWS4n7KEYotpqcVVTQ5gSd9b5Ua8P71wUBaFiJDVosogGV";
const autoTls =
  "/dns4/91-234-199-189.k51qzi5uqu5dm77i7q9ikuvhdsh1m4y2tl5dty6fsr1encybgtpcn926bjuzny.libp2p.direct/tcp/4001/tls/ws";

test("getBrowserWssUrls keeps direct secure WebSocket addresses only", () => {
  assert.deepEqual(
    getBrowserWssUrls([
      autoTls,
      `/dns4/bsotracker.online/tcp/443/tls/ws/p2p/${peerId}`,
      "/dns4/bsotracker.online/tcp/443/tls/ws",
      "/dns/example.org/tcp/443/wss",
      "/ip4/91.234.199.189/tcp/4001",
      "/ip4/91.234.199.189/udp/4001/quic-v1/webtransport/certhash/uEiB",
      "/dns4/example.org/tcp/4002/ws",
      `${autoTls}/p2p/${peerId}/p2p-circuit`,
    ]),
    [
      "wss://91-234-199-189.k51qzi5uqu5dm77i7q9ikuvhdsh1m4y2tl5dty6fsr1encybgtpcn926bjuzny.libp2p.direct:4001/",
      "wss://bsotracker.online/",
      "wss://example.org/",
    ],
  );
  assert.deepEqual(getBrowserWssUrls(undefined), []);
});

// Emulates the browser WebSocket API: `behavior` decides what the server does.
const fakeWebSocket = (behavior) =>
  class {
    constructor(url) {
      this.url = url;
      setTimeout(() => behavior(this), 0);
    }
    send(data) {
      this.sent = data;
      this.onsent?.();
    }
    close() {
      this.closed = true;
    }
  };

test("probeWss succeeds when the peer answers the multistream header", async () => {
  let sent;
  const WebSocketImpl = fakeWebSocket((socket) => {
    socket.onsent = () => {
      sent = socket.sent;
      socket.onmessage({ data: new TextEncoder().encode("\x13/multistream/1.0.0\n").buffer });
    };
    socket.onopen();
  });
  assert.equal(await probeWss("wss://bsotracker.online/", { WebSocketImpl }), true);
  assert.equal(new TextDecoder().decode(sent.slice(1)), "/multistream/1.0.0\n");
});

test("probeWss fails on a socket error, an early close, or no reply", async () => {
  const error = fakeWebSocket((socket) => socket.onerror({ message: "getaddrinfo ENOTFOUND" }));
  const closed = fakeWebSocket((socket) => {
    socket.onopen();
    socket.onclose();
  });
  const silent = fakeWebSocket((socket) => socket.onopen());
  assert.equal(await probeWss("wss://a/", { WebSocketImpl: error }), false);
  assert.equal(await probeWss("wss://a/", { WebSocketImpl: closed }), false);
  assert.equal(await probeWss("wss://a/", { WebSocketImpl: silent, timeoutMs: 20 }), false);
});

test("the dialable filter keeps providers with a working address and probes each URL once", async () => {
  const probed = [];
  const filter = createBrowserDialableFilter({
    probe: async (url) => {
      probed.push(url);
      return url === "wss://bsotracker.online/";
    },
  });
  const host = { ID: peerId, Addrs: [autoTls, "/dns4/bsotracker.online/tcp/443/tls/ws"] };
  const outage = { ID: "autotls-only", Addrs: [autoTls] };
  const noWss = { ID: "tcp-only", Addrs: ["/ip4/1.2.3.4/tcp/4001"] };

  assert.deepEqual(await filter([host, outage, noWss]), [host]);
  assert.deepEqual(await filter([outage, host]), [host]);
  assert.deepEqual(probed.sort(), [
    "wss://91-234-199-189.k51qzi5uqu5dm77i7q9ikuvhdsh1m4y2tl5dty6fsr1encybgtpcn926bjuzny.libp2p.direct:4001/",
    "wss://bsotracker.online/",
  ]);
});

test("the dialable filter probes again once its cache expires", async () => {
  let time = 0;
  let probes = 0;
  const filter = createBrowserDialableFilter({
    probe: async () => {
      probes++;
      return true;
    },
    now: () => time,
  });
  const providers = [{ ID: peerId, Addrs: ["/dns4/bsotracker.online/tcp/443/tls/ws"] }];
  await filter(providers);
  time = 4 * 60 * 1000;
  await filter(providers);
  time = 6 * 60 * 1000;
  await filter(providers);
  assert.equal(probes, 2);
});
