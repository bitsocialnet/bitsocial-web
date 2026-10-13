import assert from "node:assert/strict";
import test from "node:test";
import { statsClients } from "../../shared/stats-queries.mjs";
import { createDashboard } from "./dashboard.mjs";
import { getTimeline } from "./ranges.mjs";

const monitoring = {
  webpages: [{ url: "https://bitsocial.net" }, { url: "https://5chan.app" }],
  serviceProbes: [{ id: "spam_blocker_server", label: "Spam Blocker server", url: "https://x" }],
  httpRouterUrls: ["https://routing.lol"],
  chainProviders: { eth: { urls: ["https://eth.drpc.org", "viem"] } },
  ipfsGatewayUrls: ["https://ipfsgateway.xyz"],
  pubsubProviderUrls: ["https://pubsubprovider.xyz/api/v0"],
};
const communityLists = {
  "5chan": [
    { address: "biz.bso", title: "/biz/ - Business & Finance", directoryCode: "biz" },
    { address: "g.bso", title: "/g/ - Technology", directoryCode: "g" },
  ],
  seedit: [{ address: "memes.bso", title: "Memes", directoryCode: "memes" }],
};
const timeline = getTimeline("6h", 1_800_000_000);

const sample = (labels, value) => ({ metric: labels, value: [timeline.end, String(value)] });
const matrix = (labels, values) => ({
  metric: labels,
  values: values.map((value, index) => [timeline.start + index * timeline.step, String(value)]),
});

// Answers each query from the first rule whose pattern matches its PromQL.
const fakePrometheus = (rules) => {
  const calls = [];
  const answer = (kind, expr) => {
    calls.push({ kind, expr });
    const rule = rules.find(
      ({ when, range }) => when.test(expr) && Boolean(range) === (kind === "range"),
    );
    if (rule?.fail) {
      return Promise.reject(new Error("query failed"));
    }
    return Promise.resolve(rule ? rule.result : []);
  };
  return {
    calls,
    instant: (expr) => answer("instant", expr),
    range: (expr) => answer("range", expr),
  };
};

const createTestDashboard = (rules) => {
  const prometheus = fakePrometheus(rules);
  const dashboard = createDashboard({
    prometheus,
    monitoring,
    clients: statsClients,
    communityLists,
  });
  return { dashboard, prometheus };
};

test("overview sums clients into network totals and lists every configured service", async () => {
  const { dashboard } = createTestDashboard([
    {
      when: /^sum\(.*client_id="5chan".*< bool 7200/,
      result: [sample({}, 1)],
    },
    {
      when: /^sum\(.*client_id="seedit".*< bool 7200/,
      result: [sample({}, 1)],
    },
    {
      when: /^sum\(max without.*community_stats_week_active_user_count\{client_id="5chan"\}/,
      result: [sample({}, 40)],
    },
    {
      when: /^sum\(max without.*community_stats_week_active_user_count\{client_id="seedit"\}/,
      result: [sample({}, 2)],
    },
    {
      when: /^\(\(max without.*client_id="5chan".*< bool 7200/,
      result: [
        sample({ community_address: "biz.bso" }, 1),
        sample({ community_address: "g.bso" }, 0),
      ],
    },
    {
      when: /^max without.*webpage_last_webpage_fetch_success\)$/,
      result: [
        sample({ webpage_url: "https://bitsocial.net" }, 1),
        sample({ webpage_url: "https://5chan.app" }, 0),
      ],
    },
    {
      when: /^max without.*service_probe_last_success\)$/,
      result: [sample({ service_probe_id: "spam_blocker_server" }, 1)],
    },
    {
      when: /^max by \(service_probe_id\) \(avg_over_time\(\(max without.*service_probe_last_success\)\)\[120s:30s\]\)\)$/,
      range: true,
      result: [matrix({ service_probe_id: "spam_blocker_server" }, [1, 0.5, 0])],
    },
  ]);

  const overview = await dashboard.overview(timeline);

  assert.equal(overview.network.communitiesTotal, 3);
  assert.equal(overview.network.communitiesOnline, 2);
  assert.equal(overview.network.currentUsers, 42);
  // Nothing reported posts, so the totals stay unknown instead of reading zero.
  assert.equal(overview.network.totalPosts, null);
  assert.equal(overview.network.servicesTotal, 3);
  assert.equal(overview.network.servicesUp, 2);
  assert.deepEqual(
    overview.clients[0].statuses.map(({ address, online }) => [address, online]),
    [
      ["biz.bso", 1],
      ["g.bso", 0],
    ],
  );
  assert.deepEqual(overview.clients[1].statuses, [
    { address: "memes.bso", title: "Memes", directoryCode: "memes", online: null },
  ]);

  const probe = overview.services.find(({ id }) => id === "spam_blocker_server");
  assert.equal(probe.kind, "service");
  assert.equal(probe.history.length, timeline.points);
  assert.deepEqual(probe.history.slice(0, 4), [1, 0.5, 0, null]);
  assert.equal(probe.uptime, 0.5);
  assert.deepEqual(
    overview.services.map(({ label, up }) => [label, up]),
    [
      ["bitsocial.net", 1],
      ["5chan.app", 0],
      ["Spam Blocker server", 1],
    ],
  );
  assert.deepEqual(
    overview.nameResolvers.map(({ label }) => label),
    ["eth.drpc.org", "viem default RPC"],
  );
});

test("a failing query empties only its own block", async () => {
  const { dashboard } = createTestDashboard([
    { when: /webpage_last_webpage_fetch_success/, fail: true },
    {
      when: /^max without.*service_probe_last_success\)$/,
      result: [sample({ service_probe_id: "spam_blocker_server" }, 1)],
    },
  ]);
  const overview = await dashboard.overview(timeline);
  assert.equal(overview.services[0].up, null);
  assert.equal(overview.services[2].up, 1);
});

test("the view fails when Prometheus answers no query at all", async () => {
  const { dashboard } = createTestDashboard([
    { when: /./, fail: true },
    { when: /./, range: true, fail: true },
  ]);
  await assert.rejects(dashboard.overview(timeline), /every Prometheus query failed/);
});

test("client view keeps the list order and fills each community's columns", async () => {
  const { dashboard } = createTestDashboard([
    {
      when: /^max without.*community_stats_all_post_count\{client_id="5chan"\}\)$/,
      result: [
        sample({ community_address: "g.bso" }, 900),
        sample({ community_address: "biz.bso" }, 12),
      ],
    },
    {
      when: /^avg_over_time\(\(\(\(max without/,
      range: true,
      result: [matrix({ community_address: "biz.bso" }, [1, 1, 0, 1])],
    },
  ]);
  const view = await dashboard.clientView("5chan", timeline);
  assert.equal(view.client.postLabel, "Threads");
  assert.equal(view.totals.communitiesTotal, 2);
  assert.deepEqual(
    view.communities.map(({ address, posts }) => [address, posts]),
    [
      ["biz.bso", 12],
      ["g.bso", 900],
    ],
  );
  assert.equal(view.communities[0].uptime, 0.75);
  assert.equal(view.communities[1].uptime, null);
});

test("community view only queries the requested address", async () => {
  const { dashboard, prometheus } = createTestDashboard([]);
  assert.equal(dashboard.hasCommunity("5chan", "biz.bso"), true);
  assert.equal(dashboard.hasCommunity("5chan", "memes.bso"), false);
  assert.equal(dashboard.hasClient("lainchan"), false);
  const view = await dashboard.communityView("5chan", "biz.bso", timeline);
  assert.equal(view.community.directoryCode, "biz");
  assert.ok(prometheus.calls.length > 0);
  for (const { expr } of prometheus.calls) {
    assert.match(expr, /community_address="biz\.bso"/);
  }
});
