// PromQL definitions shared by the Grafana dashboard generator and the stats web API, so both
// report the same numbers for "online", "total posts", "current users" and service health.

// A community counts as offline once its latest update is older than this.
export const COMMUNITY_OFFLINE_AFTER_SECONDS = 2 * 60 * 60;

const dedupeIgnoredLabels = ["instance", "job", "service", "subplebbit_address"];

// Product facts about each monitored client. Ids match `monitoring.clients` in the monitor config.
export const statsClients = [
  {
    id: "5chan",
    label: "5chan",
    source: "the official 5chan directories",
    community: "board",
    communities: "boards",
    postLabel: "Threads",
    replyLabel: "Replies",
    appUrl: "https://5chan.app",
    communityUrlPrefix: "https://5chan.app/#/",
  },
  {
    id: "seedit",
    label: "Seedit",
    source: "Seedit's default subscriptions",
    community: "community",
    communities: "communities",
    postLabel: "Posts",
    replyLabel: "Comments",
    appUrl: "https://seedit.app",
    communityUrlPrefix: "https://seedit.app/#/s/",
  },
];

// Escapes a value for a PromQL regex matcher inside a double-quoted string.
export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
const escapeString = (value) => value.replace(/[\\"]/g, "\\$&");

export const metric = (name, matchers = {}) => {
  const selector = Object.entries(matchers)
    .map(([label, value]) =>
      Array.isArray(value)
        ? `${label}=~"${value.map(escapeRegex).join("|")}"`
        : `${label}="${escapeString(value)}"`,
    )
    .join(",");
  return `max without(${dedupeIgnoredLabels.join(", ")}) (bitsocial_stats_${name}${selector ? `{${selector}}` : ""})`;
};

export const whenSuccessful = (durationExpr, successExpr) =>
  `${durationExpr} and (${successExpr} == 1)`;

// Community queries for one client id, or for several when given an array, optionally
// narrowed to a single community address.
export const communityQueries = (clientIds, communityAddress) => {
  const matchers = communityAddress
    ? { client_id: clientIds, community_address: communityAddress }
    : { client_id: clientIds };
  const communityMetric = (name) => metric(name, matchers);
  const updateAge = communityMetric("last_community_update_fetch_seconds_since_updated_at");
  const fetchSuccess = communityMetric("last_community_update_fetch_success");
  // The monitor keeps a community's last values after a failed fetch; drop them where staleness misleads.
  const whenFetched = (expr) => `${expr} and (${fetchSuccess} == 1)`;
  const stat = (window, name) => communityMetric(`community_stats_${window}_${name}_count`);
  const posts = (window, { freshOnly = false } = {}) =>
    ["post", "reply"]
      .map((name) => `sum(${freshOnly ? whenFetched(stat(window, name)) : stat(window, name)})`)
      .join(" + ");

  return {
    communityMetric,
    stat,
    whenFetched,
    updateAge,
    // 1 when the latest fetch succeeded and the update is fresh, 0 otherwise (including communities never fetched).
    online: `((${updateAge} < bool ${COMMUNITY_OFFLINE_AFTER_SECONDS}) * ${fetchSuccess}) or (${fetchSuccess} * 0)`,
    // Same definitions as the 5chan homepage: threads plus replies, and weekly active addresses.
    totalPosts: posts("all"),
    postsLastDay: posts("day", { freshOnly: true }),
    currentUsers: `sum(${stat("week", "active_user")})`,
  };
};

// Service and client-infrastructure queries for the provider lists in the monitor config.
export const infrastructureQueries = (monitoring) => {
  const httpRouterUrls = monitoring.httpRouterUrls || [];
  const nameResolverUrls = monitoring.chainProviders?.eth?.urls || [];
  const gatewayUrls = monitoring.ipfsGatewayUrls || [];
  const pubsubProviderUrls = monitoring.pubsubProviderUrls || [];
  // Routers are judged by the provider lookups clients make for each community. The monitor's
  // separate write-then-read probe publishes an unsigned record that current routers reject.
  const routerLookupSuccess = metric(
    "http_router_last_community_ipns_get_providers_fetch_success",
    { http_router_url: httpRouterUrls },
  );

  return {
    httpRouterUrls,
    nameResolverUrls,
    gatewayUrls,
    pubsubProviderUrls,
    serviceUp: metric("service_probe_last_success"),
    webpageUp: metric("webpage_last_webpage_fetch_success"),
    serviceTotal: (monitoring.serviceProbes?.length || 0) + (monitoring.webpages?.length || 0),
    routerLookupSuccess,
    httpRouterUp: `max by (http_router_url) (${routerLookupSuccess})`,
    nameResolverUp: metric("chain_provider_last_resolve_address_success", {
      chain_provider_url: nameResolverUrls,
      chain_ticker: "eth",
    }),
    gatewayUp: metric("ipfs_gateway_last_comment_fetch_success", {
      ipfs_gateway_url: gatewayUrls,
    }),
    pubsubProviderUp: `min by (pubsub_provider_url) ({__name__=~"bitsocial_stats_pubsub_provider_last_(publish|subscribe)_success",pubsub_provider_url=~"${pubsubProviderUrls.map(escapeRegex).join("|")}"})`,
  };
};
