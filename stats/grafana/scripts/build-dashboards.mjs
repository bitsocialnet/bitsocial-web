import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import monitorConfig from "../../monitor/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const grafanaRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(grafanaRoot, "..", "..");
const fiveChanDirectoriesBaseUrl =
  "https://raw.githubusercontent.com/bitsocialnet/lists/master/5chan-directories";
const fiveChanDirectoriesIndexUrl =
  "https://api.github.com/repos/bitsocialnet/lists/contents/5chan-directories?ref=master";
const fiveChanDirectoryDefaultsSourceUrl = `${fiveChanDirectoriesBaseUrl}/5chan-directories-defaults.json`;
const seeditDefaultSubscriptionsUrl =
  "https://raw.githubusercontent.com/bitsocialnet/lists/master/seedit-default-subscriptions.json";
const monitorDataDir = path.join(repoRoot, "stats", "monitor", "data");
const directoriesSnapshotPath = path.join(monitorDataDir, "5chan-directories.snapshot.json");
const seeditSnapshotPath = path.join(monitorDataDir, "seedit-communities.snapshot.json");
const dashboardsOutputDir = path.join(grafanaRoot, "dashboards");

const PROMETHEUS_DATASOURCE = { type: "prometheus", uid: "prometheus" };
const FIVE_CHAN_DIRECTORY_FILE_NAME_PATTERN = /^5chan-(.+)-directory\.json$/;
const FETCH_TIMEOUT_MS = 30_000;
const GRID_WIDTH = 24;
// A community counts as offline once its latest update is older than this.
const COMMUNITY_OFFLINE_AFTER_SECONDS = 2 * 60 * 60;
// Shared-dashboard paths; the access tokens must match ensure-shared-dashboards.mjs.
const sharedDashboardPaths = {
  overview: "/public-dashboards/e9277bcc0c421ddcacd29f591466678c",
  fiveChan: "/public-dashboards/fa6f2225e0ea98e116fb6f85d84e0186",
  seedit: "/public-dashboards/c770d7565c18df52dd26461c9191e05d",
};
const dedupeIgnoredLabels = ["instance", "job", "service", "subplebbit_address"];
const palette = {
  blue: "#3b82f6",
  deepBlue: "#1d4ed8",
  lightBlue: "#93c5fd",
  cyan: "#22d3ee",
  violet: "#a78bfa",
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const capitalize = (text) => text[0].toUpperCase() + text.slice(1);

const fetchJson = async (url) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json, application/json",
        "User-Agent": "bitsocial-stats-dashboard-builder",
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Timed out fetching ${url} after ${FETCH_TIMEOUT_MS}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const getDirectoryDefaults = (directoryDefaults, sourceLabel) => {
  if (
    directoryDefaults?.directories &&
    typeof directoryDefaults.directories === "object" &&
    !Array.isArray(directoryDefaults.directories)
  ) {
    return directoryDefaults.directories;
  }

  throw new Error(`${sourceLabel} is missing a directories object`);
};

const getDirectoryFileCode = (entry) => {
  if (typeof entry?.name !== "string") {
    return undefined;
  }

  return entry.name.match(FIVE_CHAN_DIRECTORY_FILE_NAME_PATTERN)?.[1];
};

const getDirectoryFileUrl = (entry, directoryCode) => {
  if (typeof entry?.download_url === "string") {
    return entry.download_url;
  }

  return `${fiveChanDirectoriesBaseUrl}/5chan-${directoryCode}-directory.json`;
};

const getDirectoryBoards = (directoryFile, sourceLabel) => {
  if (Array.isArray(directoryFile?.boards)) {
    return directoryFile.boards;
  }

  throw new Error(`${sourceLabel} is missing a boards array`);
};

const getPrimaryDirectoryBoard = (directoryFile, sourceLabel) => {
  const [primaryBoard] = getDirectoryBoards(directoryFile, sourceLabel);
  if (!primaryBoard) {
    throw new Error(`${sourceLabel} does not define any boards`);
  }

  const address = primaryBoard.address || primaryBoard.communityAddress || primaryBoard.name;
  if (typeof address !== "string") {
    throw new Error(`${sourceLabel} primary board is missing address/communityAddress/name`);
  }

  return { ...primaryBoard, address };
};

const getDirectoryUpdatedAt = (directoryList, directoryRecords) =>
  Math.max(
    directoryList.updatedAt || 0,
    ...directoryRecords.map(({ directoryFile }) => directoryFile.updatedAt || 0),
  );

const loadFiveChanDirectoryRecords = async () => {
  const directoryIndex = await fetchJson(fiveChanDirectoriesIndexUrl);
  if (!Array.isArray(directoryIndex)) {
    throw new Error(`${fiveChanDirectoriesIndexUrl} is missing a GitHub contents array`);
  }

  const directoryFiles = directoryIndex
    .map((entry) => ({ entry, directoryCode: getDirectoryFileCode(entry) }))
    .filter(({ entry, directoryCode }) => entry?.type === "file" && directoryCode)
    .sort((left, right) => left.directoryCode.localeCompare(right.directoryCode));

  if (directoryFiles.length === 0) {
    throw new Error(`${fiveChanDirectoriesIndexUrl} does not contain 5chan directory files`);
  }

  return Promise.all(
    directoryFiles.map(async ({ entry, directoryCode }) => {
      const sourceUrl = getDirectoryFileUrl(entry, directoryCode);
      return {
        directoryCode,
        directoryFile: await fetchJson(sourceUrl),
        sourceUrl,
      };
    }),
  );
};

const buildResolvedDirectoryList = ({ directoryDefaults, directoryRecords }) => {
  const defaultsByCode = getDirectoryDefaults(
    directoryDefaults,
    fiveChanDirectoryDefaultsSourceUrl,
  );
  // Hidden directory files (e.g. /trash/) exist only for seeder discovery and have no defaults.
  const recordsByCode = new Map(
    directoryRecords
      .filter((record) => record.directoryFile.hidden !== true)
      .map((record) => [record.directoryCode, record]),
  );
  const activeDirectoryCodes = [...recordsByCode.keys()];
  const missingDefaults = activeDirectoryCodes.filter(
    (directoryCode) => !defaultsByCode[directoryCode],
  );

  if (missingDefaults.length > 0) {
    throw new Error(
      `${fiveChanDirectoryDefaultsSourceUrl} is missing defaults for ${missingDefaults.join(", ")}`,
    );
  }

  const orderedDirectoryCodes = Object.keys(defaultsByCode).filter((directoryCode) =>
    recordsByCode.has(directoryCode),
  );
  const directories = orderedDirectoryCodes.map((directoryCode) => {
    const defaults = defaultsByCode[directoryCode];
    const record = recordsByCode.get(directoryCode);
    const primaryBoard = getPrimaryDirectoryBoard(record.directoryFile, record.sourceUrl);

    return {
      ...defaults,
      directoryCode: defaults.directoryCode || directoryCode,
      name: primaryBoard.address,
      publicKey: primaryBoard.publicKey,
    };
  });

  return {
    title: "/all/ - All 5chan Directories",
    description:
      "Resolved from the active 5chan directory files and defaults in bitsocialnet/lists.\n\nhttps://github.com/bitsocialnet/lists/tree/master/5chan-directories",
    createdAt: directoryDefaults.createdAt,
    updatedAt: getDirectoryUpdatedAt(directoryDefaults, directoryRecords),
    directories,
  };
};

const getDirectoryAddress = (directory) => directory.communityAddress || directory.name;

const loadFiveChanDirectories = async () => {
  const [directoryDefaults, directoryRecords] = await Promise.all([
    fetchJson(fiveChanDirectoryDefaultsSourceUrl),
    loadFiveChanDirectoryRecords(),
  ]);
  return buildResolvedDirectoryList({ directoryDefaults, directoryRecords });
};

const loadSeeditCommunities = async () => {
  const defaultSubscriptions = await fetchJson(seeditDefaultSubscriptionsUrl);
  if (!Array.isArray(defaultSubscriptions?.communities)) {
    throw new Error(`${seeditDefaultSubscriptionsUrl} is missing a communities array`);
  }

  return {
    title: "Seedit Default Communities",
    description:
      "Resolved from Seedit's default subscriptions in bitsocialnet/lists.\n\nhttps://github.com/bitsocialnet/lists/blob/master/seedit-default-subscriptions.json",
    createdAt: defaultSubscriptions.createdAt,
    updatedAt: defaultSubscriptions.updatedAt,
    // The monitor reads every client source in the 5chan directory-list shape.
    directories: defaultSubscriptions.communities.map(
      ({ address, directoryCode, publicKey, title }) => ({
        directoryCode,
        title,
        name: address,
        publicKey,
      }),
    ),
  };
};

// Clients

const clients = [
  {
    id: "5chan",
    label: "5chan",
    color: palette.blue,
    uid: "bitsocial-5chan",
    title: "5chan Stats",
    navKey: "fiveChan",
    navLabel: "5chan boards",
    source: "the official 5chan directories",
    community: "board",
    communities: "boards",
    postLabel: "Threads",
    replyLabel: "Replies",
    communityUrl: "https://5chan.app/#/${__value.raw}",
  },
  {
    id: "seedit",
    label: "Seedit",
    color: palette.violet,
    uid: "bitsocial-seedit",
    title: "Seedit Stats",
    navKey: "seedit",
    navLabel: "Seedit communities",
    source: "Seedit's default subscriptions",
    community: "community",
    communities: "communities",
    postLabel: "Posts",
    replyLabel: "Comments",
    communityUrl: "https://seedit.app/#/s/${__value.raw}",
  },
];

// Queries

// Escapes a value for a PromQL regex matcher inside a double-quoted string.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");

const metric = (name, matchers = {}) => {
  const selector = Object.entries(matchers)
    .map(([label, value]) =>
      Array.isArray(value)
        ? `${label}=~"${value.map(escapeRegex).join("|")}"`
        : `${label}="${value}"`,
    )
    .join(",");
  return `max without(${dedupeIgnoredLabels.join(", ")}) (bitsocial_stats_${name}${selector ? `{${selector}}` : ""})`;
};

const whenSuccessful = (durationExpr, successExpr) => `${durationExpr} and (${successExpr} == 1)`;

// Community queries for one client id, or for several when given an array.
const communityQueries = (clientIds) => {
  const communityMetric = (name) => metric(name, { client_id: clientIds });
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

const serviceUp = metric("service_probe_last_success");
const webpageUp = metric("webpage_last_webpage_fetch_success");

const { monitoring } = monitorConfig;
const httpRouterUrls = monitoring.httpRouterUrls || [];
const nameResolverUrls = monitoring.chainProviders?.eth?.urls || [];
const gatewayUrls = monitoring.ipfsGatewayUrls || [];
const pubsubProviderUrls = monitoring.pubsubProviderUrls || [];
// Routers are judged by the provider lookups clients make for each community. The monitor's
// separate write-then-read probe publishes an unsigned record that current routers reject.
const routerLookupSuccess = metric("http_router_last_community_ipns_get_providers_fetch_success", {
  http_router_url: httpRouterUrls,
});
const httpRouterUp = `max by (http_router_url) (${routerLookupSuccess})`;
const nameResolverUp = metric("chain_provider_last_resolve_address_success", {
  chain_provider_url: nameResolverUrls,
  chain_ticker: "eth",
});
const gatewayUp = metric("ipfs_gateway_last_comment_fetch_success", {
  ipfs_gateway_url: gatewayUrls,
});
const pubsubProviderUp = `min by (pubsub_provider_url) ({__name__=~"bitsocial_stats_pubsub_provider_last_(publish|subscribe)_success",pubsub_provider_url=~"${pubsubProviderUrls.map(escapeRegex).join("|")}"})`;
const serviceTotal = (monitoring.serviceProbes?.length || 0) + (monitoring.webpages?.length || 0);

// Panels

const refIdAt = (index) => String.fromCharCode(65 + index);

const makeTarget = ({ expr, legend = "__auto", refId = "A", instant = false, table = false }) => ({
  datasource: clone(PROMETHEUS_DATASOURCE),
  editorMode: "code",
  expr,
  ...(table ? { format: "table" } : {}),
  instant,
  legendFormat: legend,
  range: !instant,
  refId,
});

const makeTargets = (queries, options = {}) =>
  queries.map((query, index) => makeTarget({ refId: refIdAt(index), ...options, ...query }));

// Strips URL schemes and paths from series names, e.g. "https://ipfs.io/api/v0" -> "ipfs.io".
const shortenUrlsTransformation = {
  id: "renameByRegex",
  options: {
    regex: "^(.*?)https?://([^/\\s)]+)[^\\s)]*(.*)$",
    renamePattern: "$1$2$3",
  },
};

const statusMappings = (upText = "Up", downText = "Down") => [
  {
    type: "value",
    options: {
      0: { color: "red", index: 1, text: downText },
      1: { color: "green", index: 0, text: upText },
    },
  },
];

const countThresholds = (total) => ({
  mode: "absolute",
  steps: [
    { color: "red", value: null },
    { color: "orange", value: Math.max(1, Math.ceil(total * 0.75)) },
    { color: "green", value: total },
  ],
});

const colorOverride = (refId, color) => ({
  matcher: { id: "byFrameRefID", options: refId },
  properties: [{ id: "color", value: { fixedColor: color, mode: "fixed" } }],
});

const byNameOverride = (name, properties) => ({
  matcher: { id: "byName", options: name },
  properties,
});

const makeRowPanel = ({ title, collapsed }) => ({
  collapsed,
  panels: [],
  title,
  type: "row",
});

const makeTextPanel = ({ content }) => ({
  options: {
    code: { language: "markdown", showLineNumbers: false, showMiniMap: false },
    content,
    mode: "markdown",
  },
  title: "",
  transparent: true,
  type: "text",
});

// Instant queries, so a monitor outage reads "No data" instead of the last value before it.
const makeStatPanel = ({ title, description, expr, total }) => ({
  datasource: clone(PROMETHEUS_DATASOURCE),
  description,
  fieldConfig: {
    defaults: {
      color: total ? { mode: "thresholds" } : { fixedColor: palette.blue, mode: "fixed" },
      decimals: 0,
      mappings: [],
      thresholds: total
        ? countThresholds(total)
        : { mode: "absolute", steps: [{ color: palette.blue, value: null }] },
      unit: total ? `suffix: / ${total}` : "locale",
    },
    overrides: [],
  },
  options: {
    colorMode: total ? "value" : "none",
    graphMode: "none",
    justifyMode: "auto",
    orientation: "auto",
    reduceOptions: { calcs: ["lastNotNull"], fields: "", values: false },
    showPercentChange: false,
    textMode: "value",
    wideLayout: true,
  },
  targets: [makeTarget({ expr, instant: true })],
  title,
  type: "stat",
});

const makeTimeseriesPanel = ({
  title,
  description,
  queries,
  unit = "short",
  min = 0,
  max,
  stacked = false,
  fillOpacity = 12,
  colors = [],
  legendPlacement = "bottom",
  transformations = [],
}) => ({
  datasource: clone(PROMETHEUS_DATASOURCE),
  description,
  fieldConfig: {
    defaults: {
      color: { mode: "palette-classic" },
      custom: {
        axisBorderShow: false,
        axisPlacement: "auto",
        drawStyle: "line",
        fillOpacity,
        gradientMode: "opacity",
        lineInterpolation: "smooth",
        lineWidth: 2,
        pointSize: 4,
        showPoints: "never",
        spanNulls: false,
        stacking: { group: "A", mode: stacked ? "normal" : "none" },
        thresholdsStyle: { mode: "off" },
      },
      decimals: unit === "s" ? 1 : undefined,
      min,
      max,
      unit,
    },
    overrides: colors.map((color, index) => colorOverride(refIdAt(index), color)),
  },
  options: {
    legend: { calcs: [], displayMode: "list", placement: legendPlacement, showLegend: true },
    tooltip: { hideZeros: false, mode: "multi", sort: "desc" },
  },
  targets: makeTargets(queries),
  title,
  transformations,
  type: "timeseries",
});

const makeStateTimelinePanel = ({
  title,
  description,
  queries,
  upText,
  downText,
  transformations = [],
}) => ({
  datasource: clone(PROMETHEUS_DATASOURCE),
  description,
  fieldConfig: {
    defaults: {
      color: { mode: "thresholds" },
      custom: {
        fillOpacity: 80,
        hideFrom: { legend: false, tooltip: false, viz: false },
        lineWidth: 0,
      },
      mappings: statusMappings(upText, downText),
      thresholds: {
        mode: "absolute",
        steps: [
          { color: "red", value: null },
          { color: "green", value: 1 },
        ],
      },
    },
    overrides: [],
  },
  options: {
    alignValue: "left",
    legend: { displayMode: "list", placement: "bottom", showLegend: false },
    mergeValues: true,
    rowHeight: 0.8,
    showValue: "never",
    tooltip: { hideZeros: false, mode: "single", sort: "none" },
  },
  targets: makeTargets(queries),
  title,
  transformations,
  type: "state-timeline",
});

// Grid height that fits a state timeline with this many rows.
const timelineHeight = (rowCount) => Math.max(6, Math.ceil(rowCount * 0.75) + 2);

const makePeersMapPanel = () => ({
  datasource: clone(PROMETHEUS_DATASOURCE),
  description:
    "Approximate city-level locations of peers that provide community IPNS records through HTTP routers, derived from their public IP addresses. Larger dots mean more peers in that city.",
  fieldConfig: {
    defaults: {
      color: { fixedColor: palette.blue, mode: "fixed" },
      custom: { hideFrom: { legend: false, tooltip: false, viz: false } },
      decimals: 0,
      unit: "short",
    },
    overrides: ["Latitude", "Longitude"].map((name) =>
      byNameOverride(name, [
        { id: "custom.hideFrom", value: { legend: false, tooltip: true, viz: false } },
      ]),
    ),
  },
  options: {
    // Grafana's default CARTO basemap now requires an API key, so draw countries from the
    // GeoJSON bundled with Grafana instead of loading third-party tiles.
    basemap: {
      config: {
        rules: [],
        src: "public/maps/countries.geojson",
        style: { color: { fixed: "#475569" }, lineWidth: 1, opacity: 0.35 },
      },
      name: "Countries",
      type: "geojson",
    },
    controls: {
      mouseWheelZoom: false,
      showAttribution: false,
      showDebug: false,
      showMeasure: false,
      showScale: false,
      showZoom: true,
    },
    layers: [
      {
        config: {
          showLegend: false,
          style: {
            color: { fixed: palette.blue },
            opacity: 0.75,
            size: { field: "Peers", fixed: 6, max: 16, min: 5 },
            symbol: { fixed: "img/icons/marker/circle.svg", mode: "fixed" },
            symbolAlign: { horizontal: "center", vertical: "center" },
          },
        },
        location: { latitude: "Latitude", longitude: "Longitude", mode: "coords" },
        name: "Peers",
        tooltip: true,
        type: "markers",
      },
    ],
    tooltip: { mode: "details" },
    view: { allLayers: true, id: "coords", lat: 28, lon: 10, zoom: 1.3 },
  },
  targets: [
    makeTarget({
      expr: metric("network_ipns_http_routers_peer_location_count"),
      instant: true,
      table: true,
    }),
  ],
  title: "Where peers are",
  transformations: [
    {
      id: "convertFieldType",
      options: {
        conversions: [
          { destinationType: "number", targetField: "latitude" },
          { destinationType: "number", targetField: "longitude" },
        ],
        fields: {},
      },
    },
    {
      id: "organize",
      options: {
        excludeByName: { Time: true },
        indexByName: {},
        renameByName: {
          Value: "Peers",
          city: "City",
          country: "Country",
          latitude: "Latitude",
          longitude: "Longitude",
          region: "Region",
        },
      },
    },
  ],
  type: "geomap",
});

const makeCommunitiesTablePanel = (client) => {
  const queries = communityQueries(client.id);
  // Listed in display order, between the community name and its address.
  const columns = [
    { name: "Status", expr: queries.online, width: 90 },
    {
      name: "Last update",
      expr: queries.whenFetched(queries.updateAge),
      unit: "s",
      width: 110,
    },
    { name: client.postLabel, expr: queries.stat("all", "post"), width: 100 },
    { name: client.replyLabel, expr: queries.stat("all", "reply"), width: 100 },
    { name: "Current users", expr: queries.stat("week", "active_user"), width: 120 },
    { name: "Unique addresses", expr: queries.stat("all", "active_user"), width: 140 },
    {
      name: "Pubsub peers",
      expr: queries.communityMetric("last_community_pubsub_pubsub_peer_count"),
      width: 120,
    },
    {
      name: "Last pubsub message",
      expr: queries.communityMetric("community_pubsub_seconds_since_last_community_pubsub_message"),
      unit: "s",
      width: 170,
    },
  ];
  const [firstColumn, ...otherColumns] = columns;
  const nameColumn = capitalize(client.community);
  const renameByName = { community_name: nameColumn, community_address: "Address" };
  const indexByName = { community_name: 0, community_address: columns.length + 1 };
  for (const [index, column] of columns.entries()) {
    renameByName[`Value #${refIdAt(index)}`] = column.name;
    indexByName[`Value #${refIdAt(index)}`] = index + 1;
  }

  return {
    datasource: clone(PROMETHEUS_DATASOURCE),
    description: `Every ${client.community} in ${client.source}. A ${client.community} is offline when the monitor cannot fetch it or its latest update is more than ${COMMUNITY_OFFLINE_AFTER_SECONDS / 3600} hours old. Current users are addresses that posted in the last 7 days. Click a column header to sort; click a ${client.community} to open it on ${client.label}.`,
    fieldConfig: {
      defaults: {
        custom: { align: "auto", cellOptions: { type: "auto" }, filterable: false, inspect: false },
        decimals: 0,
        mappings: [],
        unit: "short",
      },
      overrides: [
        byNameOverride(nameColumn, [
          {
            id: "mappings",
            value: [
              {
                type: "value",
                options: Object.fromEntries(
                  client.communityList.map(({ address, title }, index) => [
                    address,
                    { index, text: title || address },
                  ]),
                ),
              },
            ],
          },
          {
            id: "links",
            value: [
              { targetBlank: true, title: `Open on ${client.label}`, url: client.communityUrl },
            ],
          },
          { id: "custom.width", value: 230 },
        ]),
        byNameOverride("Status", [
          { id: "mappings", value: statusMappings("Online", "Offline") },
          { id: "custom.cellOptions", value: { type: "color-text" } },
        ]),
        ...columns.map(({ name, unit, width }) =>
          byNameOverride(name, [
            ...(unit ? [{ id: "unit", value: unit }] : []),
            { id: "custom.width", value: width },
          ]),
        ),
      ],
    },
    options: {
      cellHeight: "sm",
      showHeader: true,
      sortBy: [{ desc: true, displayName: client.postLabel }],
    },
    targets: makeTargets(
      [
        // Copy the address into another label so the table can show both the title and the address.
        {
          expr: `label_replace(${firstColumn.expr}, "community_name", "$1", "community_address", "(.*)")`,
        },
        ...otherColumns.map(({ expr }) => ({ expr })),
      ],
      { instant: true, table: true },
    ),
    title: capitalize(client.communities),
    transformations: [
      { id: "merge", options: {} },
      {
        id: "organize",
        options: {
          excludeByName: { Time: true, client_id: true },
          includeByName: {},
          indexByName,
          renameByName,
        },
      },
    ],
    type: "table",
  };
};

// Layout

const createLayout = () => {
  const panels = [];
  let nextId = 1;
  let x = 0;
  let y = 0;
  let lineHeight = 0;
  let collapsedRow = null;

  const newLine = () => {
    y += lineHeight;
    x = 0;
    lineHeight = 0;
  };

  return {
    add(panel, { w, h }) {
      if (x + w > GRID_WIDTH) {
        newLine();
      }
      panel.id = nextId++;
      panel.gridPos = { h, w, x, y };
      x += w;
      lineHeight = Math.max(lineHeight, h);
      (collapsedRow ? collapsedRow.panels : panels).push(panel);
    },
    row(title, { collapsed = false } = {}) {
      newLine();
      if (collapsedRow) {
        // Panels inside a collapsed row take no space until it is expanded.
        y = collapsedRow.gridPos.y + 1;
        collapsedRow = null;
      }
      const row = makeRowPanel({ title, collapsed });
      row.id = nextId++;
      row.gridPos = { h: 1, w: GRID_WIDTH, x: 0, y };
      panels.push(row);
      y += 1;
      collapsedRow = collapsed ? row : null;
    },
    panels: () => panels,
  };
};

const makeNavigationPanel = ({ current, intro }) => {
  const links = [
    { key: "overview", label: "Network overview" },
    ...clients.map(({ navKey, navLabel }) => ({ key: navKey, label: navLabel })),
  ]
    .map(({ key, label }) =>
      key === current ? `**${label}**` : `[${label}](${sharedDashboardPaths[key]})`,
    )
    .join(" &nbsp;·&nbsp; ");
  return makeTextPanel({ content: `${links}\n\n${intro}` });
};

const addStatRow = (layout, panels) => {
  const width = GRID_WIDTH / panels.length;
  for (const panel of panels) {
    layout.add(panel, { w: width, h: 4 });
  }
};

// Dashboards

const buildOverviewDashboard = () => {
  const layout = createLayout();
  const allClients = communityQueries(clients.map(({ id }) => id));
  const communityTotal = clients.reduce((total, client) => total + client.communityList.length, 0);
  const perClient = (build) =>
    clients.map((client) => ({ expr: build(communityQueries(client.id)), legend: client.label }));
  const clientColors = clients.map(({ color }) => color);
  const clientNames = clients.map(({ label }) => label).join(" and ");

  layout.add(
    makeNavigationPanel({
      current: "overview",
      intro:
        "Live health and activity of the Bitsocial peer-to-peer network, measured continuously by the Bitsocial stats monitor.",
    }),
    { w: GRID_WIDTH, h: 3 },
  );

  addStatRow(layout, [
    makeStatPanel({
      title: "Services up",
      description:
        "Bitsocial websites plus the newsletter, spam blocker and challenge servers that respond as expected right now.",
      expr: `sum(${serviceUp}) + sum(${webpageUp})`,
      total: serviceTotal,
    }),
    makeStatPanel({
      title: "Communities online",
      description: `${clientNames} communities whose latest fetch succeeded and whose latest update is less than ${COMMUNITY_OFFLINE_AFTER_SECONDS / 3600} hours old.`,
      expr: `sum(${allClients.online})`,
      total: communityTotal,
    }),
    makeStatPanel({
      title: "Total posts",
      description: `All-time posts and replies across the default ${clientNames} communities, counted like the 5chan homepage.`,
      expr: allClients.totalPosts,
    }),
    makeStatPanel({
      title: "Current users",
      description: `Addresses that posted in the last 7 days across the default ${clientNames} communities, counted like the 5chan homepage: summed per community, so an address active in several communities counts once for each.`,
      expr: allClients.currentUsers,
    }),
  ]);

  // Stacked per client, so the top edge of each chart matches the network-wide number.
  layout.row("Activity");
  for (const panel of [
    makeTimeseriesPanel({
      title: "Posts (24h)",
      description:
        "Posts and replies from the last 24 hours in communities the monitor can currently fetch, stacked per client.",
      queries: perClient(({ postsLastDay }) => postsLastDay),
      stacked: true,
      fillOpacity: 35,
      colors: clientColors,
    }),
    makeTimeseriesPanel({
      title: "Current users",
      description:
        "Addresses that posted in the last 7 days, summed per community like the 5chan homepage, stacked per client.",
      queries: perClient(({ currentUsers }) => currentUsers),
      stacked: true,
      fillOpacity: 35,
      colors: clientColors,
    }),
    makeTimeseriesPanel({
      title: "Total posts",
      description: "All-time posts and replies, stacked per client.",
      queries: perClient(({ totalPosts }) => totalPosts),
      stacked: true,
      fillOpacity: 35,
      colors: clientColors,
    }),
  ]) {
    layout.add(panel, { w: 8, h: 8 });
  }

  layout.row("Peer-to-peer network");
  layout.add(makePeersMapPanel(), { w: 14, h: 13 });
  layout.add(
    makeTimeseriesPanel({
      title: "Peers over time",
      description:
        "Unique peers across all monitored communities: peers connected to community pubsub topics, and peers that HTTP routers list as providers of community pubsub topics and IPNS records.",
      queries: [
        { expr: `sum(${metric("network_pubsub_peer_count")})`, legend: "Pubsub peers" },
        {
          expr: `sum(${metric("network_pubsub_http_routers_peer_count")})`,
          legend: "Pubsub topic providers",
        },
        {
          expr: `sum(${metric("network_ipns_http_routers_peer_count")})`,
          legend: "IPNS record providers",
        },
      ],
      fillOpacity: 0,
      colors: [palette.blue, palette.cyan, palette.violet],
    }),
    { w: 10, h: 13 },
  );

  const infrastructureRows = httpRouterUrls.length + nameResolverUrls.length;
  const statusHeight = timelineHeight(Math.max(serviceTotal, infrastructureRows));
  layout.row("Services and infrastructure");
  layout.add(
    makeStateTimelinePanel({
      title: "Bitsocial services",
      description:
        "Green while a website or service answers with the expected status and content; red while its check fails.",
      queries: [
        { expr: webpageUp, legend: "{{webpage_url}}" },
        { expr: serviceUp, legend: "{{service_probe_label}}" },
      ],
      transformations: [shortenUrlsTransformation],
    }),
    { w: GRID_WIDTH / 2, h: statusHeight },
  );
  layout.add(
    makeStateTimelinePanel({
      title: "Client infrastructure",
      description:
        "What 5chan and Seedit use by default in pure P2P mode: HTTP routers to find peers, and Ethereum RPCs to resolve community names. A router is green while it answers provider lookups for monitored communities; an RPC is green while it resolves a test name.",
      queries: [
        {
          expr: httpRouterUp,
          legend: "Router · {{http_router_url}}",
        },
        {
          expr: nameResolverUp,
          legend: "Name resolution · {{chain_provider_url}}",
        },
      ],
      transformations: [shortenUrlsTransformation],
    }),
    { w: GRID_WIDTH / 2, h: statusHeight },
  );

  layout.row("Response times", { collapsed: true });
  layout.add(
    makeTimeseriesPanel({
      title: "Bitsocial services",
      description: "How long each successful website and service check took.",
      queries: [
        {
          expr: whenSuccessful(metric("webpage_last_webpage_fetch_duration_seconds"), webpageUp),
          legend: "{{webpage_url}}",
        },
        {
          expr: whenSuccessful(metric("service_probe_last_duration_seconds"), serviceUp),
          legend: "{{service_probe_label}}",
        },
      ],
      unit: "s",
      fillOpacity: 0,
      legendPlacement: "right",
      transformations: [shortenUrlsTransformation],
    }),
    { w: GRID_WIDTH, h: 9 },
  );
  layout.add(
    makeTimeseriesPanel({
      title: "HTTP router lookup time",
      description:
        "Average time for each HTTP router to answer the latest successful provider lookup for each community. Gaps mean every lookup failed.",
      queries: [
        {
          expr: `avg by (http_router_url) (${whenSuccessful(
            metric("http_router_last_community_ipns_get_providers_fetch_duration_seconds", {
              http_router_url: httpRouterUrls,
            }),
            routerLookupSuccess,
          )})`,
          legend: "{{http_router_url}}",
        },
      ],
      unit: "s",
      fillOpacity: 0,
      transformations: [shortenUrlsTransformation],
    }),
    { w: 12, h: 8 },
  );
  layout.add(
    makeTimeseriesPanel({
      title: "Communities found by each router",
      description:
        "Share of monitored communities for which each HTTP router returned at least one IPNS record provider on its latest lookup. Failed lookups count as not found.",
      queries: [
        {
          expr: (() => {
            const providers = metric(
              "http_router_last_community_ipns_get_providers_fetch_provider_count",
              { http_router_url: httpRouterUrls },
            );
            const lookups = routerLookupSuccess;
            return `(count by (http_router_url) ((${providers} > 0) and (${lookups} == 1)) or count by (http_router_url) (${lookups}) * 0) / count by (http_router_url) (${lookups})`;
          })(),
          legend: "{{http_router_url}}",
        },
      ],
      unit: "percentunit",
      max: 1,
      fillOpacity: 0,
      transformations: [shortenUrlsTransformation],
    }),
    { w: 12, h: 8 },
  );
  layout.add(
    makeTimeseriesPanel({
      title: "Name resolution time",
      description:
        "Time for each Ethereum RPC to resolve a test name. Gaps mean the resolution failed.",
      queries: [
        {
          expr: whenSuccessful(
            metric("chain_provider_last_resolve_address_duration_seconds", {
              chain_provider_url: nameResolverUrls,
              chain_ticker: "eth",
            }),
            nameResolverUp,
          ),
          legend: "{{chain_provider_url}}",
        },
      ],
      unit: "s",
      fillOpacity: 0,
      transformations: [shortenUrlsTransformation],
    }),
    { w: GRID_WIDTH, h: 8 },
  );

  const fallbackRows = gatewayUrls.length + pubsubProviderUrls.length;
  layout.row("Gateway mode fallback", { collapsed: true });
  layout.add(
    makeStateTimelinePanel({
      title: "Gateway mode providers",
      description:
        "IPFS gateways and pubsub providers that 5chan and Seedit only use when pure P2P mode is turned off. Green while the provider passed its latest check.",
      queries: [
        {
          expr: gatewayUp,
          legend: "Gateway · {{ipfs_gateway_url}}",
        },
        {
          expr: pubsubProviderUp,
          legend: "Pubsub · {{pubsub_provider_url}}",
        },
      ],
      transformations: [shortenUrlsTransformation],
    }),
    { w: GRID_WIDTH, h: timelineHeight(fallbackRows) },
  );
  for (const panel of [
    makeTimeseriesPanel({
      title: "Gateway comment fetch time",
      description: "Time to fetch a comment through each gateway. Gaps mean the fetch failed.",
      queries: [
        {
          expr: whenSuccessful(
            metric("ipfs_gateway_last_comment_fetch_duration_seconds", {
              ipfs_gateway_url: gatewayUrls,
            }),
            gatewayUp,
          ),
          legend: "{{ipfs_gateway_url}}",
        },
      ],
      unit: "s",
      fillOpacity: 0,
      transformations: [shortenUrlsTransformation],
    }),
    ...["publish", "subscribe"].map((action) =>
      makeTimeseriesPanel({
        title: `Pubsub ${action} time`,
        description: `Time for each pubsub provider to ${action} a test message. Gaps mean the check failed.`,
        queries: [
          {
            expr: whenSuccessful(
              metric(`pubsub_provider_last_${action}_duration_seconds`, {
                pubsub_provider_url: pubsubProviderUrls,
              }),
              metric(`pubsub_provider_last_${action}_success`, {
                pubsub_provider_url: pubsubProviderUrls,
              }),
            ),
            legend: "{{pubsub_provider_url}}",
          },
        ],
        unit: "s",
        fillOpacity: 0,
        transformations: [shortenUrlsTransformation],
      }),
    ),
  ]) {
    layout.add(panel, { w: 8, h: 8 });
  }

  return layout.panels();
};

const buildClientDashboard = (client) => {
  const layout = createLayout();
  const queries = communityQueries(client.id);
  const communityCount = client.communityList.length;
  const Communities = capitalize(client.communities);

  layout.add(
    makeNavigationPanel({
      current: client.navKey,
      intro: `Activity and availability of the ${communityCount} ${client.communities} in ${client.source}.`,
    }),
    { w: GRID_WIDTH, h: 3 },
  );

  addStatRow(layout, [
    makeStatPanel({
      title: `${Communities} online`,
      description: `${Communities} whose latest fetch succeeded and whose latest update is less than ${COMMUNITY_OFFLINE_AFTER_SECONDS / 3600} hours old.`,
      expr: `sum(${queries.online})`,
      total: communityCount,
    }),
    makeStatPanel({
      title: "Total posts",
      description: `All-time ${client.postLabel.toLowerCase()} and ${client.replyLabel.toLowerCase()}, counted like the 5chan homepage.`,
      expr: queries.totalPosts,
    }),
    makeStatPanel({
      title: "Posts (24h)",
      description: `${client.postLabel} and ${client.replyLabel.toLowerCase()} from the last 24 hours in ${client.communities} the monitor can currently fetch.`,
      expr: queries.postsLastDay,
    }),
    makeStatPanel({
      title: "Current users",
      description: `Addresses that posted in the last 7 days, counted like the 5chan homepage: summed per ${client.community}, so an address active in several ${client.communities} counts once for each.`,
      expr: queries.currentUsers,
    }),
  ]);

  layout.row("Activity");
  for (const panel of [
    makeTimeseriesPanel({
      title: "Posts (24h)",
      description: `${client.postLabel} and ${client.replyLabel.toLowerCase()} from the last 24 hours, as reported by each ${client.community}'s own stats.`,
      queries: [
        {
          expr: `sum(${queries.whenFetched(queries.stat("day", "post"))})`,
          legend: client.postLabel,
        },
        {
          expr: `sum(${queries.whenFetched(queries.stat("day", "reply"))})`,
          legend: client.replyLabel,
        },
      ],
      stacked: true,
      fillOpacity: 35,
      colors: [palette.blue, palette.lightBlue],
    }),
    makeTimeseriesPanel({
      title: "Active users",
      description: `Addresses that posted within the last 24 hours, 7 days (current users) and 30 days, summed per ${client.community}.`,
      queries: [
        {
          expr: `sum(${queries.whenFetched(queries.stat("day", "active_user"))})`,
          legend: "24 hours",
        },
        { expr: queries.currentUsers, legend: "7 days" },
        { expr: `sum(${queries.stat("month", "active_user")})`, legend: "30 days" },
      ],
      fillOpacity: 0,
      colors: [palette.lightBlue, palette.blue, palette.deepBlue],
    }),
    makeTimeseriesPanel({
      title: "All-time totals",
      description: `Cumulative ${client.postLabel.toLowerCase()} and ${client.replyLabel.toLowerCase()}, plus unique posting addresses summed per ${client.community}.`,
      queries: [
        { expr: `sum(${queries.stat("all", "post")})`, legend: client.postLabel },
        { expr: `sum(${queries.stat("all", "reply")})`, legend: client.replyLabel },
        { expr: `sum(${queries.stat("all", "active_user")})`, legend: "Unique addresses" },
      ],
      fillOpacity: 0,
      colors: [palette.blue, palette.lightBlue, palette.violet],
    }),
  ]) {
    layout.add(panel, { w: 8, h: 8 });
  }

  layout.row(Communities);
  // Tall enough to list every community without a nested scrollbar.
  layout.add(makeCommunitiesTablePanel(client), {
    w: GRID_WIDTH,
    h: Math.ceil((communityCount + 1) * 0.95) + 2,
  });

  layout.row(`${capitalize(client.community)} availability history`, { collapsed: true });
  layout.add(
    makeStateTimelinePanel({
      title: `${capitalize(client.community)} availability`,
      description: `Green while a ${client.community} is online: fetched successfully with an update less than ${COMMUNITY_OFFLINE_AFTER_SECONDS / 3600} hours old.`,
      queries: [{ expr: queries.online, legend: "{{community_address}}" }],
      upText: "Online",
      downText: "Offline",
    }),
    { w: GRID_WIDTH, h: Math.ceil(communityCount * 0.6) + 2 },
  );

  return layout.panels();
};

const makeDashboard = ({ uid, title, description, panels, tags }) => ({
  annotations: { list: [] },
  description,
  editable: false,
  fiscalYearStartMonth: 0,
  graphTooltip: 1,
  id: null,
  links: [],
  panels,
  refresh: "1m",
  schemaVersion: 39,
  tags: ["bitsocial", "stats", ...tags],
  templating: { list: [] },
  time: { from: "now-24h", to: "now" },
  timepicker: {
    refresh_intervals: ["1m", "5m", "15m", "1h"],
    time_options: ["1h", "6h", "24h", "7d", "30d"],
  },
  timezone: "browser",
  title,
  uid,
  version: 1,
  weekStart: "",
});

const toCommunityList = (directoryList, sourceLabel) => {
  const communityList = directoryList.directories.map((directory) => ({
    address: getDirectoryAddress(directory),
    title: directory.title,
    directoryCode: directory.directoryCode,
  }));

  const missingAddress = communityList.find((community) => typeof community.address !== "string");
  if (missingAddress) {
    throw new Error(
      `${sourceLabel} entry '${missingAddress.directoryCode || missingAddress.title}' is missing an address`,
    );
  }
  if (communityList.length === 0) {
    throw new Error(`No communities found in ${sourceLabel}`);
  }

  return communityList;
};

const writeJson = (filePath, value) =>
  fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);

const main = async () => {
  const [fiveChanDirectories, seeditCommunities] = await Promise.all([
    loadFiveChanDirectories(),
    loadSeeditCommunities(),
  ]);
  const communityLists = {
    "5chan": toCommunityList(fiveChanDirectories, fiveChanDirectoriesIndexUrl),
    seedit: toCommunityList(seeditCommunities, seeditDefaultSubscriptionsUrl),
  };
  for (const client of clients) {
    client.communityList = communityLists[client.id];
  }
  // The monitor attributes a shared address to one client only, which would skew both clients' totals.
  const clientsByAddress = new Map();
  for (const client of clients) {
    for (const { address } of client.communityList) {
      if (clientsByAddress.has(address)) {
        throw new Error(
          `'${address}' is listed by both ${clientsByAddress.get(address)} and ${client.label}`,
        );
      }
      clientsByAddress.set(address, client.label);
    }
  }

  await fs.mkdir(dashboardsOutputDir, { recursive: true });
  await writeJson(
    path.join(dashboardsOutputDir, "bitsocial-stats.json"),
    makeDashboard({
      uid: "bitsocial-stats",
      title: "Bitsocial Stats",
      description: "Health and activity of the Bitsocial peer-to-peer network.",
      panels: buildOverviewDashboard(),
      tags: clients.map(({ id }) => id),
    }),
  );
  for (const client of clients) {
    await writeJson(
      path.join(dashboardsOutputDir, `${client.id}-stats.json`),
      makeDashboard({
        uid: client.uid,
        title: client.title,
        description: `Activity and availability of the ${client.label} ${client.communities} monitored by Bitsocial.`,
        panels: buildClientDashboard(client),
        tags: [client.id],
      }),
    );
  }
  await writeJson(directoriesSnapshotPath, fiveChanDirectories);
  await writeJson(seeditSnapshotPath, seeditCommunities);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
