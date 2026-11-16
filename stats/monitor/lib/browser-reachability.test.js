import assert from "node:assert/strict";
import test from "node:test";
import { createBrowserReachabilityMonitor } from "./browser-reachability.js";

const seeder = "12D3KooWS4n7KEYotpqcVVTQ5gSd9b5Ua8P71wUBaFiJDVosogGV";
const owner = "12D3KooWDfnXqdZfsoqKbcYEDKRttt3adumB5m6tw8YghPwMAz8V";
const seederWss = "wss://1-2-3-4.seeder.libp2p.direct:4001/";
const seederProvider = {
  ID: seeder,
  Addrs: ["/dns4/1-2-3-4.seeder.libp2p.direct/tcp/4001/tls/ws", "/ip4/1.2.3.4/tcp/4001"],
};
const ownerProvider = { ID: owner, Addrs: ["/ip4/5.6.7.8/tcp/4001"] };

const setup = ({ communities, seederPeerIds = [], dialable = () => true, resolves = true }) => {
  const notifications = [];
  const state = { communities, dialable };
  const run = createBrowserReachabilityMonitor({
    getCommunities: () => state.communities,
    getSeederPeerIds: () => seederPeerIds,
    notify: async (notification) => notifications.push(notification),
    probe: async (url) => state.dialable(url),
    resolveHost: async () => resolves,
  });
  const last = (id) => notifications.findLast((notification) => notification.id === id);
  return { run, state, last, notifications };
};

test("reports the network down once every provider fails three checks in a row, then recovered", async () => {
  const { run, state, last } = setup({
    communities: {
      "a.bso": { ipnsCidHttpRoutersPeers: [seederProvider, ownerProvider] },
      "b.bso": { ipnsCidHttpRoutersPeers: [seederProvider] },
      "c.bso": {},
    },
    dialable: () => false,
    resolves: false,
  });
  const id = "browserReachability:network";

  // under the threshold nothing is reported, so a restart during an outage sends no false recovery
  await run();
  await run();
  assert.equal(last(id), undefined);
  await run();
  assert.equal(last(id).ok, false);
  assert.match(last(id).summary, /any of the 2 monitored communities/);
  assert.equal(last(id).details, `${seederWss} name does not resolve`);

  state.dialable = () => true;
  await run();
  assert.equal(last(id).ok, true);
  assert.match(last(id).summary, /2 of 2 monitored communities/);
});

test("stays up while one community still has a browser-dialable provider", async () => {
  const { run, last } = setup({
    communities: {
      "a.bso": { ipnsCidHttpRoutersPeers: [ownerProvider] },
      "b.bso": { ipnsCidHttpRoutersPeers: [seederProvider] },
    },
  });
  for (let i = 0; i < 4; i++) await run();
  assert.equal(last("browserReachability:network").ok, true);
  assert.match(last("browserReachability:network").summary, /1 of 2 monitored communities/);
});

test("sends nothing until the routers have answered for a community", async () => {
  const { run, notifications } = setup({
    communities: { "a.bso": {}, "b.bso": undefined },
    seederPeerIds: [seeder],
  });
  for (let i = 0; i < 4; i++) await run();
  assert.deepEqual(notifications, []);
});

test("reports the network and seeders down when the routers list no provider at all", async () => {
  const { run, last } = setup({
    communities: { "a.bso": { ipnsCidHttpRoutersPeers: [] }, "b.bso": {} },
    seederPeerIds: [seeder],
  });
  for (let i = 0; i < 3; i++) await run();
  assert.equal(last("browserReachability:network").ok, false);
  assert.match(
    last("browserReachability:network").summary,
    /any of the 1 monitored communities\. The routers list no provider/,
  );
  assert.equal(last(`browserReachability:seeder:${seeder}`).ok, false);
  assert.match(
    last(`browserReachability:seeder:${seeder}`).summary,
    /No HTTP router lists the seeder/,
  );
});

test("reports a configured seeder that fails its dial, has no secure WebSocket address, or is unlisted", async () => {
  const id = `browserReachability:seeder:${seeder}`;

  const failing = setup({
    communities: { "a.bso": { ipnsCidHttpRoutersPeers: [seederProvider, ownerProvider] } },
    seederPeerIds: [seeder],
    dialable: () => false,
  });
  for (let i = 0; i < 3; i++) await failing.run();
  assert.equal(failing.last(id).ok, false);
  assert.match(failing.last(id).summary, /all 1 secure WebSocket addresses failed/);
  assert.equal(failing.last(id).details, `${seederWss} dial failed`);

  const noWss = setup({
    communities: {
      "a.bso": { ipnsCidHttpRoutersPeers: [{ ID: seeder, Addrs: ["/ip4/1.2.3.4/tcp/4001"] }] },
    },
    seederPeerIds: [seeder],
  });
  for (let i = 0; i < 3; i++) await noWss.run();
  assert.equal(noWss.last(id).ok, false);
  assert.match(noWss.last(id).summary, /no secure WebSocket address/);

  const unlisted = setup({
    communities: { "a.bso": { ipnsCidHttpRoutersPeers: [ownerProvider] } },
    seederPeerIds: [seeder],
  });
  for (let i = 0; i < 3; i++) await unlisted.run();
  assert.equal(unlisted.last(id).ok, false);
  assert.match(unlisted.last(id).summary, /No HTTP router lists the seeder/);
});

test("a seeder that dials on any address is up, and one good check resets its failures", async () => {
  const id = `browserReachability:seeder:${seeder}`;
  const { run, state, last } = setup({
    communities: {
      "a.bso": { ipnsCidHttpRoutersPeers: [seederProvider] },
      "b.bso": {
        ipnsCidHttpRoutersPeers: [{ ID: seeder, Addrs: ["/dns4/seeder.example/tcp/443/tls/ws"] }],
      },
    },
    seederPeerIds: [seeder],
    dialable: (url) => url === "wss://seeder.example/",
  });
  await run();
  assert.equal(last(id).ok, true);
  assert.match(last(id).summary, /provides 2 community records/);

  state.dialable = () => false;
  await run();
  await run();
  state.dialable = () => true;
  await run();
  state.dialable = () => false;
  await run();
  await run();
  assert.equal(last(id).ok, true);
});
