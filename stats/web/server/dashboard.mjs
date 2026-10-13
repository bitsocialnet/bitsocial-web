import {
  COMMUNITY_OFFLINE_AFTER_SECONDS,
  communityQueries,
  infrastructureQueries,
  metric,
  whenSuccessful,
} from "../../shared/stats-queries.mjs";

// Builds the JSON documents behind the dashboard views. Every PromQL expression is fixed here:
// visitors only pick a view, a range from an allowlist and a known community address.

// Four decimals keep uptime shares and sub-millisecond latencies exact enough while halving the
// size of long series.
const toNumber = (raw) => {
  const number = Number(raw);
  return Number.isFinite(number) ? Math.round(number * 10_000) / 10_000 : null;
};

const firstValue = (vector) => (vector?.length ? toNumber(vector[0].value[1]) : null);

const valuesByLabel = (vector, label) =>
  new Map((vector || []).map((sample) => [sample.metric[label], toNumber(sample.value[1])]));

// Places a range result on the shared timeline, leaving gaps where Prometheus had no sample.
const alignValues = (values, timeline) => {
  const aligned = Array.from({ length: timeline.points }, () => null);
  for (const [time, raw] of values || []) {
    const index = Math.round((time - timeline.start) / timeline.step);
    if (index >= 0 && index < timeline.points) {
      aligned[index] = toNumber(raw);
    }
  }
  return aligned;
};

const firstSeries = (matrix, timeline) => alignValues(matrix?.[0]?.values, timeline);

const seriesByLabel = (matrix, label, timeline) =>
  new Map(
    (matrix || []).map((series) => [series.metric[label], alignValues(series.values, timeline)]),
  );

// Share of each step a status (1 up, 0 down) was up, sampled at the range's resolution.
const bucketAverage = (expr, timeline) =>
  `avg_over_time((${expr})[${timeline.step}s:${timeline.resolution}s])`;

const average = (values) => {
  const known = values.filter((value) => value !== null);
  return known.length ? known.reduce((total, value) => total + value, 0) / known.length : null;
};

const sumKnown = (values) =>
  values.some((value) => value !== null)
    ? values.reduce((total, value) => total + (value ?? 0), 0)
    : null;

const hostOf = (url) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

// Runs a named set of queries in parallel. A failed query leaves its key undefined so one bad
// expression degrades a single block; the request only fails when Prometheus answers nothing.
const runQueries = async (prometheus, timeline, queries) => {
  const entries = Object.entries(queries);
  const settled = await Promise.allSettled(
    entries.map(([, { expr, range }]) =>
      range ? prometheus.range(expr, timeline) : prometheus.instant(expr, timeline.end),
    ),
  );
  const results = {};
  const errors = [];
  for (const [index, outcome] of settled.entries()) {
    const [key] = entries[index];
    if (outcome.status === "fulfilled") {
      results[key] = outcome.value;
    } else {
      errors.push(`${key}: ${outcome.reason?.message || outcome.reason}`);
    }
  }
  if (errors.length === entries.length) {
    throw new Error(`every Prometheus query failed (${errors[0]})`);
  }
  for (const error of errors) {
    console.warn(`stats query failed: ${error}`);
  }
  return results;
};

const rangeInfo = (timeline) => ({
  key: timeline.key,
  start: timeline.start,
  end: timeline.end,
  step: timeline.step,
});

const statusRows = ({ items, up, history, latency, extra = () => ({}) }, timeline) =>
  items.map((item) => {
    const values = history.get(item.key) || Array.from({ length: timeline.points }, () => null);
    return {
      id: item.id,
      label: item.label,
      url: item.url,
      up: up.get(item.key) ?? null,
      uptime: average(values),
      latency: latency?.get(item.key) ?? null,
      history: values,
      ...extra(item),
    };
  });

export const createDashboard = ({ prometheus, monitoring, clients, communityLists }) => {
  const infra = infrastructureQueries(monitoring);
  const clientById = new Map(clients.map((client) => [client.id, client]));

  const webpages = (monitoring.webpages || []).map(({ url }) => ({
    key: url,
    id: url,
    label: hostOf(url),
    url,
  }));
  const serviceProbes = (monitoring.serviceProbes || []).map(({ id, label, url }) => ({
    key: id,
    id,
    label: label || id,
    url,
  }));
  const urlItems = (urls, labelOf = hostOf) =>
    urls.map((url) => ({ key: url, id: url, label: labelOf(url), url }));

  const overview = async (timeline) => {
    const perClient = clients.map((client) => [client.id, communityQueries(client.id)]);
    const peerMetrics = {
      pubsub: "network_pubsub_peer_count",
      pubsubProviders: "network_pubsub_http_routers_peer_count",
      ipnsProviders: "network_ipns_http_routers_peer_count",
    };
    const routerDuration = whenSuccessful(
      metric("http_router_last_community_ipns_get_providers_fetch_duration_seconds", {
        http_router_url: infra.httpRouterUrls,
      }),
      infra.routerLookupSuccess,
    );
    const routerProviders = metric(
      "http_router_last_community_ipns_get_providers_fetch_provider_count",
      { http_router_url: infra.httpRouterUrls },
    );

    const queries = {
      webpageUp: { expr: infra.webpageUp },
      webpageHistory: { expr: bucketAverage(infra.webpageUp, timeline), range: true },
      webpageLatency: {
        expr: whenSuccessful(
          metric("webpage_last_webpage_fetch_duration_seconds"),
          infra.webpageUp,
        ),
      },
      serviceUp: { expr: infra.serviceUp },
      serviceHistory: { expr: bucketAverage(infra.serviceUp, timeline), range: true },
      serviceLatency: {
        expr: whenSuccessful(metric("service_probe_last_duration_seconds"), infra.serviceUp),
      },
      routerUp: { expr: infra.httpRouterUp },
      routerHistory: { expr: bucketAverage(infra.httpRouterUp, timeline), range: true },
      routerLatency: { expr: `avg by (http_router_url) (${routerDuration})` },
      // Share of communities for which the router returned at least one IPNS record provider.
      routerCoverage: {
        expr: `(count by (http_router_url) ((${routerProviders} > 0) and (${infra.routerLookupSuccess} == 1)) or count by (http_router_url) (${infra.routerLookupSuccess}) * 0) / count by (http_router_url) (${infra.routerLookupSuccess})`,
      },
      resolverUp: { expr: infra.nameResolverUp },
      resolverHistory: { expr: bucketAverage(infra.nameResolverUp, timeline), range: true },
      resolverLatency: {
        expr: whenSuccessful(
          metric("chain_provider_last_resolve_address_duration_seconds", {
            chain_provider_url: infra.nameResolverUrls,
            chain_ticker: "eth",
          }),
          infra.nameResolverUp,
        ),
      },
      gatewayUp: { expr: infra.gatewayUp },
      gatewayHistory: { expr: bucketAverage(infra.gatewayUp, timeline), range: true },
      gatewayLatency: {
        expr: whenSuccessful(
          metric("ipfs_gateway_last_comment_fetch_duration_seconds", {
            ipfs_gateway_url: infra.gatewayUrls,
          }),
          infra.gatewayUp,
        ),
      },
      pubsubUp: { expr: infra.pubsubProviderUp },
      pubsubHistory: { expr: bucketAverage(infra.pubsubProviderUp, timeline), range: true },
      pubsubLatency: {
        expr: whenSuccessful(
          metric("pubsub_provider_last_publish_duration_seconds", {
            pubsub_provider_url: infra.pubsubProviderUrls,
          }),
          metric("pubsub_provider_last_publish_success", {
            pubsub_provider_url: infra.pubsubProviderUrls,
          }),
        ),
      },
      peerLocations: { expr: metric("network_ipns_http_routers_peer_location_count") },
      peerCountries: { expr: metric(peerMetrics.ipnsProviders) },
    };
    for (const [key, name] of Object.entries(peerMetrics)) {
      queries[`peers:${key}`] = { expr: `sum(${metric(name)})` };
      queries[`peersSeries:${key}`] = { expr: `sum(${metric(name)})`, range: true };
    }
    for (const [clientId, client] of perClient) {
      const totals = {
        communitiesOnline: `sum(${client.online})`,
        totalPosts: client.totalPosts,
        postsLastDay: client.postsLastDay,
        currentUsers: client.currentUsers,
      };
      for (const [key, expr] of Object.entries(totals)) {
        queries[`${clientId}:${key}`] = { expr };
        queries[`${clientId}:series:${key}`] = { expr, range: true };
      }
      queries[`${clientId}:statuses`] = { expr: client.online };
    }

    const results = await runQueries(prometheus, timeline, queries);

    const clientSummaries = clients.map((client) => {
      const value = (key) => firstValue(results[`${client.id}:${key}`]);
      const series = (key) => firstSeries(results[`${client.id}:series:${key}`], timeline);
      const statuses = valuesByLabel(results[`${client.id}:statuses`], "community_address");
      return {
        id: client.id,
        label: client.label,
        community: client.community,
        communities: client.communities,
        appUrl: client.appUrl,
        communitiesTotal: communityLists[client.id]?.length ?? 0,
        communitiesOnline: value("communitiesOnline"),
        totalPosts: value("totalPosts"),
        postsLastDay: value("postsLastDay"),
        currentUsers: value("currentUsers"),
        series: {
          communitiesOnline: series("communitiesOnline"),
          totalPosts: series("totalPosts"),
          postsLastDay: series("postsLastDay"),
          currentUsers: series("currentUsers"),
        },
        statuses: (communityLists[client.id] || []).map(({ address, title, directoryCode }) => ({
          address,
          title,
          directoryCode,
          online: statuses.get(address) ?? null,
        })),
      };
    });

    const services = [
      ...statusRows(
        {
          items: webpages,
          up: valuesByLabel(results.webpageUp, "webpage_url"),
          history: seriesByLabel(results.webpageHistory, "webpage_url", timeline),
          latency: valuesByLabel(results.webpageLatency, "webpage_url"),
          extra: () => ({ kind: "website" }),
        },
        timeline,
      ),
      ...statusRows(
        {
          items: serviceProbes,
          up: valuesByLabel(results.serviceUp, "service_probe_id"),
          history: seriesByLabel(results.serviceHistory, "service_probe_id", timeline),
          latency: valuesByLabel(results.serviceLatency, "service_probe_id"),
          extra: () => ({ kind: "service" }),
        },
        timeline,
      ),
    ];
    const routerCoverage = valuesByLabel(results.routerCoverage, "http_router_url");

    const locations = (results.peerLocations || [])
      .map(({ metric: labels, value }) => ({
        city: labels.city || null,
        region: labels.region || null,
        country: labels.country || null,
        latitude: toNumber(labels.latitude),
        longitude: toNumber(labels.longitude),
        count: toNumber(value[1]) ?? 0,
      }))
      .filter((location) => location.latitude !== null && location.longitude !== null)
      .sort((left, right) => right.count - left.count);
    const countries = (results.peerCountries || [])
      .map(({ metric: labels, value }) => ({
        country: labels.country || null,
        count: toNumber(value[1]) ?? 0,
      }))
      .filter((country) => country.count > 0)
      .sort((left, right) => right.count - left.count);

    const network = {
      communitiesTotal: clientSummaries.reduce(
        (total, client) => total + client.communitiesTotal,
        0,
      ),
      communitiesOnline: sumKnown(clientSummaries.map((client) => client.communitiesOnline)),
      totalPosts: sumKnown(clientSummaries.map((client) => client.totalPosts)),
      postsLastDay: sumKnown(clientSummaries.map((client) => client.postsLastDay)),
      currentUsers: sumKnown(clientSummaries.map((client) => client.currentUsers)),
      servicesTotal: services.length,
      servicesUp: services.some((service) => service.up !== null)
        ? services.filter((service) => service.up === 1).length
        : null,
      peers: Object.fromEntries(
        Object.keys(peerMetrics).map((key) => [key, firstValue(results[`peers:${key}`])]),
      ),
    };

    return {
      generatedAt: new Date(timeline.end * 1000).toISOString(),
      range: rangeInfo(timeline),
      offlineAfterSeconds: COMMUNITY_OFFLINE_AFTER_SECONDS,
      network,
      clients: clientSummaries,
      peers: {
        series: Object.fromEntries(
          Object.keys(peerMetrics).map((key) => [
            key,
            firstSeries(results[`peersSeries:${key}`], timeline),
          ]),
        ),
        locations,
        countries,
      },
      services,
      routers: statusRows(
        {
          items: urlItems(infra.httpRouterUrls),
          up: valuesByLabel(results.routerUp, "http_router_url"),
          history: seriesByLabel(results.routerHistory, "http_router_url", timeline),
          latency: valuesByLabel(results.routerLatency, "http_router_url"),
          extra: (item) => ({ coverage: routerCoverage.get(item.key) ?? null }),
        },
        timeline,
      ),
      nameResolvers: statusRows(
        {
          // "viem" is the library's built-in default transport, not a URL.
          items: urlItems(infra.nameResolverUrls, (url) =>
            url === "viem" ? "viem default RPC" : hostOf(url),
          ),
          up: valuesByLabel(results.resolverUp, "chain_provider_url"),
          history: seriesByLabel(results.resolverHistory, "chain_provider_url", timeline),
          latency: valuesByLabel(results.resolverLatency, "chain_provider_url"),
        },
        timeline,
      ),
      gateways: statusRows(
        {
          items: urlItems(infra.gatewayUrls),
          up: valuesByLabel(results.gatewayUp, "ipfs_gateway_url"),
          history: seriesByLabel(results.gatewayHistory, "ipfs_gateway_url", timeline),
          latency: valuesByLabel(results.gatewayLatency, "ipfs_gateway_url"),
        },
        timeline,
      ),
      pubsubProviders: statusRows(
        {
          items: urlItems(infra.pubsubProviderUrls),
          up: valuesByLabel(results.pubsubUp, "pubsub_provider_url"),
          history: seriesByLabel(results.pubsubHistory, "pubsub_provider_url", timeline),
          latency: valuesByLabel(results.pubsubLatency, "pubsub_provider_url"),
        },
        timeline,
      ),
    };
  };

  const clientView = async (clientId, timeline) => {
    const client = clientById.get(clientId);
    const communityList = communityLists[clientId] || [];
    const q = communityQueries(clientId);
    const fresh = (window, name) => `sum(${q.whenFetched(q.stat(window, name))})`;

    const series = {
      communitiesOnline: `sum(${q.online})`,
      posts: fresh("day", "post"),
      replies: fresh("day", "reply"),
      activeDay: fresh("day", "active_user"),
      activeWeek: q.currentUsers,
      activeMonth: `sum(${q.stat("month", "active_user")})`,
      totalPosts: `sum(${q.stat("all", "post")})`,
      totalReplies: `sum(${q.stat("all", "reply")})`,
    };
    const perCommunity = {
      online: q.online,
      lastUpdateAge: q.whenFetched(q.updateAge),
      posts: q.stat("all", "post"),
      replies: q.stat("all", "reply"),
      postsLastDay: `(${q.whenFetched(q.stat("day", "post"))}) + (${q.whenFetched(q.stat("day", "reply"))})`,
      currentUsers: q.stat("week", "active_user"),
      uniqueAddresses: q.stat("all", "active_user"),
      pubsubPeers: q.communityMetric("last_community_pubsub_pubsub_peer_count"),
      lastPubsubMessageAge: q.communityMetric(
        "community_pubsub_seconds_since_last_community_pubsub_message",
      ),
    };
    const queries = {
      communitiesOnline: { expr: series.communitiesOnline },
      totalPosts: { expr: q.totalPosts },
      postsLastDay: { expr: q.postsLastDay },
      currentUsers: { expr: q.currentUsers },
      availability: { expr: bucketAverage(q.online, timeline), range: true },
    };
    for (const [key, expr] of Object.entries(series)) {
      queries[`series:${key}`] = { expr, range: true };
    }
    for (const [key, expr] of Object.entries(perCommunity)) {
      queries[`community:${key}`] = { expr };
    }

    const results = await runQueries(prometheus, timeline, queries);
    const columns = Object.fromEntries(
      Object.keys(perCommunity).map((key) => [
        key,
        valuesByLabel(results[`community:${key}`], "community_address"),
      ]),
    );
    const availability = seriesByLabel(results.availability, "community_address", timeline);

    return {
      generatedAt: new Date(timeline.end * 1000).toISOString(),
      range: rangeInfo(timeline),
      offlineAfterSeconds: COMMUNITY_OFFLINE_AFTER_SECONDS,
      client: {
        id: client.id,
        label: client.label,
        community: client.community,
        communities: client.communities,
        postLabel: client.postLabel,
        replyLabel: client.replyLabel,
        source: client.source,
        appUrl: client.appUrl,
        communityUrlPrefix: client.communityUrlPrefix,
      },
      totals: {
        communitiesTotal: communityList.length,
        communitiesOnline: firstValue(results.communitiesOnline),
        totalPosts: firstValue(results.totalPosts),
        postsLastDay: firstValue(results.postsLastDay),
        currentUsers: firstValue(results.currentUsers),
      },
      series: Object.fromEntries(
        Object.keys(series).map((key) => [key, firstSeries(results[`series:${key}`], timeline)]),
      ),
      communities: communityList.map((community) => {
        const history =
          availability.get(community.address) ||
          Array.from({ length: timeline.points }, () => null);
        return {
          ...community,
          ...Object.fromEntries(
            Object.keys(perCommunity).map((key) => [
              key,
              columns[key].get(community.address) ?? null,
            ]),
          ),
          uptime: average(history),
          history,
        };
      }),
    };
  };

  const communityView = async (clientId, address, timeline) => {
    const community = communityLists[clientId].find((entry) => entry.address === address);
    const q = communityQueries(clientId, address);
    const fresh = (window, name) => `sum(${q.whenFetched(q.stat(window, name))})`;
    const series = {
      online: bucketAverage(q.online, timeline),
      posts: fresh("day", "post"),
      replies: fresh("day", "reply"),
      activeDay: fresh("day", "active_user"),
      activeWeek: q.currentUsers,
      activeMonth: `sum(${q.stat("month", "active_user")})`,
      pubsubPeers: q.communityMetric("last_community_pubsub_pubsub_peer_count"),
    };
    const results = await runQueries(
      prometheus,
      timeline,
      Object.fromEntries(Object.entries(series).map(([key, expr]) => [key, { expr, range: true }])),
    );
    return {
      generatedAt: new Date(timeline.end * 1000).toISOString(),
      range: rangeInfo(timeline),
      community,
      series: Object.fromEntries(
        Object.keys(series).map((key) => [key, firstSeries(results[key], timeline)]),
      ),
    };
  };

  return {
    overview,
    clientView,
    communityView,
    hasClient: (clientId) => clientById.has(clientId),
    hasCommunity: (clientId, address) =>
      Boolean(communityLists[clientId]?.some((entry) => entry.address === address)),
  };
};
