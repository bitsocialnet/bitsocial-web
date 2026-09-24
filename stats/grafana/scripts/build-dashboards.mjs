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
const directoriesSnapshotPath = path.join(
  repoRoot,
  "stats",
  "monitor",
  "data",
  "5chan-directories.snapshot.json",
);
const dashboardsOutputDir = path.join(grafanaRoot, "dashboards");

const FIVE_CHAN_CLIENT_ID = "5chan";
const PROMETHEUS_DATASOURCE = { type: "prometheus", uid: "prometheus" };
const FIVE_CHAN_DIRECTORY_FILE_NAME_PATTERN = /^5chan-(.+)-directory\.json$/;
const FETCH_TIMEOUT_MS = 30_000;
const GRID_WIDTH = 24;
// A board counts as offline once its latest community update is older than this.
const BOARD_OFFLINE_AFTER_SECONDS = 2 * 60 * 60;
// Shared-dashboard paths; the access tokens must match ensure-shared-dashboards.mjs.
const sharedDashboardPaths = {
  overview: "/public-dashboards/e9277bcc0c421ddcacd29f591466678c",
  fiveChan: "/public-dashboards/fa6f2225e0ea98e116fb6f85d84e0186",
};
const dedupeIgnoredLabels = ["client_id", "instance", "job", "service", "subplebbit_address"];
const palette = {
  blue: "#3b82f6",
  deepBlue: "#1d4ed8",
  lightBlue: "#93c5fd",
  cyan: "#22d3ee",
  violet: "#a78bfa",
};

const clone = (value) => JSON.parse(JSON.stringify(value));

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

// Queries

const metric = (name, matchers = {}) => {
  const selector = Object.entries(matchers)
    .map(([label, value]) => `${label}="${value}"`)
    .join(",");
  return `max without(${dedupeIgnoredLabels.join(", ")}) (bitsocial_stats_${name}${selector ? `{${selector}}` : ""})`;
};

const boardMetric = (name) => metric(name, { client_id: FIVE_CHAN_CLIENT_ID });
const sumOrZero = (expr) => `(sum(${expr}) or vector(0))`;
const whenSuccessful = (durationExpr, successExpr) => `${durationExpr} and (${successExpr} == 1)`;

const boardUpdateAge = boardMetric("last_community_update_fetch_seconds_since_updated_at");
const boardFetchSuccess = boardMetric("last_community_update_fetch_success");
// 1 when the latest fetch succeeded and the update is fresh, 0 otherwise (including boards never fetched).
const boardOnline = `((${boardUpdateAge} < bool ${BOARD_OFFLINE_AFTER_SECONDS}) * ${boardFetchSuccess}) or (${boardFetchSuccess} * 0)`;
const boardStat = (window, name) => boardMetric(`community_stats_${window}_${name}_count`);
// The monitor keeps a board's last values after a failed fetch; drop them where staleness misleads.
const whenBoardFetched = (expr) => `${expr} and (${boardFetchSuccess} == 1)`;

const routerBoardProviders = metric(
  "http_router_last_community_ipns_get_providers_fetch_provider_count",
);
const routerBoardLookupSuccess = metric(
  "http_router_last_community_ipns_get_providers_fetch_success",
);

const serviceUp = metric("service_probe_last_success");
const webpageUp = metric("webpage_last_webpage_fetch_success");

const { monitoring } = monitorConfig;
const byLabel = (label, values = []) => values.map((value) => ({ [label]: value }));
// Reports 0 for configured providers whose check never recorded a result, so a hung or
// throwing check still shows up as down instead of disappearing.
const withConfiguredFallback = (expr, labelSets) =>
  [
    expr,
    ...labelSets.map((labels) =>
      Object.entries(labels).reduce(
        (fallback, [label, value]) => `label_replace(${fallback}, "${label}", "${value}", "", "")`,
        "vector(0)",
      ),
    ),
  ].join(" or ");
const providerHealth = [
  {
    legend: "Gateway · {{ipfs_gateway_url}}",
    expr: metric("ipfs_gateway_last_comment_fetch_success"),
    labelSets: byLabel("ipfs_gateway_url", monitoring.ipfsGatewayUrls),
  },
  {
    legend: "Pubsub · {{pubsub_provider_url}}",
    expr: 'min by (pubsub_provider_url) ({__name__=~"bitsocial_stats_pubsub_provider_last_(publish|subscribe)_success"})',
    labelSets: byLabel("pubsub_provider_url", monitoring.pubsubProviderUrls),
  },
  {
    legend: "Router · {{http_router_url}}",
    expr: metric("http_router_last_get_providers_fetch_success"),
    labelSets: byLabel("http_router_url", monitoring.httpRouterUrls),
  },
  {
    legend: "Chain · {{chain_provider_url}} ({{chain_ticker}})",
    expr: metric("chain_provider_last_resolve_address_success"),
    labelSets: Object.entries(monitoring.chainProviders || {}).flatMap(([chainTicker, { urls }]) =>
      (urls || []).map((url) => ({ chain_provider_url: url, chain_ticker: chainTicker })),
    ),
  },
  {
    legend: "Seeder · {{seeder_peer_id}}",
    expr: metric("seeder_last_community_update_cid_fetch_success"),
    labelSets: byLabel("seeder_peer_id", monitoring.seederPeerIds),
  },
  {
    legend: "Previewer · {{previewer_url}}",
    expr: metric("previewer_last_comment_preview_fetch_success"),
    labelSets: byLabel("previewer_url", monitoring.previewerUrls),
  },
].map(({ expr, labelSets, legend }) => ({
  count: labelSets.length,
  expr: withConfiguredFallback(expr, labelSets),
  legend,
}));
const providerTotal = providerHealth.reduce((total, { count }) => total + count, 0);
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

const makeStatPanel = ({
  title,
  description,
  expr,
  unit = "locale",
  total,
  sparkline = false,
}) => ({
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
      unit: total ? `suffix: / ${total}` : unit,
    },
    overrides: [],
  },
  options: {
    colorMode: total ? "value" : "none",
    graphMode: sparkline ? "area" : "none",
    justifyMode: "auto",
    orientation: "auto",
    reduceOptions: { calcs: ["lastNotNull"], fields: "", values: false },
    showPercentChange: false,
    textMode: "value",
    wideLayout: true,
  },
  targets: [makeTarget({ expr })],
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

const makePeersMapPanel = () => ({
  datasource: clone(PROMETHEUS_DATASOURCE),
  description:
    "Approximate city-level locations of peers that provide board IPNS records through HTTP routers, derived from their public IP addresses. Larger dots mean more peers in that city.",
  fieldConfig: {
    defaults: {
      color: { fixedColor: palette.blue, mode: "fixed" },
      custom: { hideFrom: { legend: false, tooltip: false, viz: false } },
      decimals: 0,
      unit: "short",
    },
    overrides: ["Latitude", "Longitude"].map((name) => ({
      matcher: { id: "byName", options: name },
      properties: [{ id: "custom.hideFrom", value: { legend: false, tooltip: true, viz: false } }],
    })),
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

// Listed in display order, between the board name and its address.
const boardTableColumns = [
  { name: "Status", expr: boardOnline, width: 90 },
  { name: "Last update", expr: whenBoardFetched(boardUpdateAge), unit: "s", width: 110 },
  { name: "Threads", expr: boardStat("all", "post"), width: 90 },
  { name: "Replies", expr: boardStat("all", "reply"), width: 90 },
  { name: "Unique addresses", expr: boardStat("all", "active_user"), width: 140 },
  { name: "Monthly active", expr: boardStat("month", "active_user"), width: 130 },
  {
    name: "Pubsub peers",
    expr: boardMetric("last_community_pubsub_pubsub_peer_count"),
    width: 120,
  },
  {
    name: "Last pubsub message",
    expr: boardMetric("community_pubsub_seconds_since_last_community_pubsub_message"),
    unit: "s",
    width: 170,
  },
];

const byNameOverride = (name, properties) => ({
  matcher: { id: "byName", options: name },
  properties,
});

const makeBoardsTablePanel = (boards) => {
  const [firstColumn, ...otherColumns] = boardTableColumns;
  const queries = [
    // Copy the address into a "board" label so the table can show both the title and the address.
    { expr: `label_replace(${firstColumn.expr}, "board", "$1", "community_address", "(.*)")` },
    ...otherColumns.map(({ expr }) => ({ expr })),
  ];
  const renameByName = { board: "Board", community_address: "Address" };
  const indexByName = { board: 0, community_address: boardTableColumns.length + 1 };
  for (const [index, column] of boardTableColumns.entries()) {
    renameByName[`Value #${refIdAt(index)}`] = column.name;
    indexByName[`Value #${refIdAt(index)}`] = index + 1;
  }

  return {
    datasource: clone(PROMETHEUS_DATASOURCE),
    description: `Every board in the official 5chan directories. A board is offline when the monitor cannot fetch it or its latest update is more than ${BOARD_OFFLINE_AFTER_SECONDS / 3600} hours old. Click a column header to sort; click a board to open it on 5chan.`,
    fieldConfig: {
      defaults: {
        custom: { align: "auto", cellOptions: { type: "auto" }, filterable: false, inspect: false },
        decimals: 0,
        mappings: [],
        unit: "short",
      },
      overrides: [
        byNameOverride("Board", [
          {
            id: "mappings",
            value: [
              {
                type: "value",
                options: Object.fromEntries(
                  boards.map(({ address, title }, index) => [address, { index, text: title }]),
                ),
              },
            ],
          },
          {
            id: "links",
            value: [
              {
                targetBlank: true,
                title: "Open on 5chan",
                url: "https://5chan.app/#/${__value.raw}",
              },
            ],
          },
          { id: "custom.width", value: 230 },
        ]),
        byNameOverride("Status", [
          { id: "mappings", value: statusMappings("Online", "Offline") },
          { id: "custom.cellOptions", value: { type: "color-text" } },
        ]),
        ...boardTableColumns
          .filter(({ unit, width }) => unit || width)
          .map(({ name, unit, width }) =>
            byNameOverride(name, [
              ...(unit ? [{ id: "unit", value: unit }] : []),
              ...(width ? [{ id: "custom.width", value: width }] : []),
            ]),
          ),
      ],
    },
    options: {
      cellHeight: "sm",
      showHeader: true,
      sortBy: [{ desc: true, displayName: "Threads" }],
    },
    targets: makeTargets(queries, { instant: true, table: true }),
    title: "Boards",
    transformations: [
      { id: "merge", options: {} },
      {
        id: "organize",
        options: { excludeByName: { Time: true }, includeByName: {}, indexByName, renameByName },
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
    { key: "overview", label: "Network overview", path: sharedDashboardPaths.overview },
    { key: "fiveChan", label: "5chan boards", path: sharedDashboardPaths.fiveChan },
  ]
    .map(({ key, label, path: linkPath }) =>
      key === current ? `**${label}**` : `[${label}](${linkPath})`,
    )
    .join(" &nbsp;·&nbsp; ");
  return makeTextPanel({ content: `${links}\n\n${intro}` });
};

// Dashboards

const fiveChanActivityPanels = () => [
  makeTimeseriesPanel({
    title: "Posts per hour",
    description:
      "New threads and replies across all 5chan boards within each rolling hour, as reported by each board's own stats.",
    queries: [
      { expr: `sum(${whenBoardFetched(boardStat("hour", "post"))})`, legend: "Threads" },
      { expr: `sum(${whenBoardFetched(boardStat("hour", "reply"))})`, legend: "Replies" },
    ],
    stacked: true,
    colors: [palette.blue, palette.lightBlue],
  }),
  makeTimeseriesPanel({
    title: "Active addresses",
    description:
      "Addresses that posted within the last 24 hours, 7 days and 30 days, summed per board: an address active on several boards is counted once per board.",
    queries: [
      { expr: `sum(${whenBoardFetched(boardStat("day", "active_user"))})`, legend: "24 hours" },
      { expr: `sum(${boardStat("week", "active_user")})`, legend: "7 days" },
      { expr: `sum(${boardStat("month", "active_user")})`, legend: "30 days" },
    ],
    fillOpacity: 0,
    colors: [palette.lightBlue, palette.blue, palette.deepBlue],
  }),
  makeTimeseriesPanel({
    title: "All-time totals",
    description:
      "Cumulative threads and replies across all 5chan boards, plus unique posting addresses summed per board.",
    queries: [
      { expr: `sum(${boardStat("all", "post")})`, legend: "Threads" },
      { expr: `sum(${boardStat("all", "reply")})`, legend: "Replies" },
      { expr: `sum(${boardStat("all", "active_user")})`, legend: "Unique addresses" },
    ],
    fillOpacity: 0,
    colors: [palette.blue, palette.lightBlue, palette.violet],
  }),
];

const boardsOnlineStat = (boards) =>
  makeStatPanel({
    title: "Boards online",
    description: `Boards from the official 5chan directories whose latest fetch succeeded and whose latest update is less than ${BOARD_OFFLINE_AFTER_SECONDS / 3600} hours old.`,
    expr: sumOrZero(boardOnline),
    total: boards.length,
  });

const buildOverviewDashboard = ({ boards }) => {
  const layout = createLayout();

  layout.add(
    makeNavigationPanel({
      current: "overview",
      intro:
        "Live health and activity of the Bitsocial peer-to-peer network, measured continuously by the Bitsocial stats monitor.",
    }),
    { w: GRID_WIDTH, h: 3 },
  );

  for (const panel of [
    makeStatPanel({
      title: "Services up",
      description:
        "Bitsocial websites plus the newsletter, spam blocker and challenge servers that respond as expected right now.",
      expr: `${sumOrZero(serviceUp)} + ${sumOrZero(webpageUp)}`,
      total: serviceTotal,
    }),
    makeStatPanel({
      title: "Providers up",
      description:
        "IPFS gateways, pubsub providers, HTTP routers, chain providers, seeders and previewers that passed their latest check. Providers without a check result count as down.",
      expr: providerHealth.map(({ expr }) => sumOrZero(expr)).join(" + "),
      total: providerTotal,
    }),
    boardsOnlineStat(boards),
    makeStatPanel({
      title: "5chan posts",
      description: "All-time threads and replies across the official 5chan boards.",
      expr: `sum(${boardStat("all", "post")}) + sum(${boardStat("all", "reply")})`,
      sparkline: true,
    }),
  ]) {
    layout.add(panel, { w: 6, h: 4 });
  }

  layout.row("5chan activity");
  for (const panel of fiveChanActivityPanels()) {
    layout.add(panel, { w: 8, h: 8 });
  }

  layout.row("Peer-to-peer network");
  layout.add(makePeersMapPanel(), { w: 14, h: 13 });
  layout.add(
    makeTimeseriesPanel({
      title: "Peers over time",
      description:
        "Unique peers across all 5chan boards: peers connected to board pubsub topics, and peers that HTTP routers list as providers of board pubsub topics and IPNS records.",
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

  layout.row("Bitsocial services");
  layout.add(
    makeStateTimelinePanel({
      title: "Service uptime",
      description:
        "Green while a website or service answers with the expected status and content; red while its check fails.",
      queries: [
        { expr: webpageUp, legend: "{{webpage_url}}" },
        { expr: serviceUp, legend: "{{service_probe_label}}" },
      ],
      transformations: [shortenUrlsTransformation],
    }),
    { w: GRID_WIDTH, h: Math.ceil(serviceTotal * 0.75) + 2 },
  );

  layout.row("Service response times", { collapsed: true });
  layout.add(
    makeTimeseriesPanel({
      title: "Response time",
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
    { w: GRID_WIDTH, h: 10 },
  );

  layout.row("Network providers");
  layout.add(
    makeStateTimelinePanel({
      title: "Provider uptime",
      description:
        "Public infrastructure that Bitsocial clients rely on. Green while the provider passed its latest check: gateways and previewers serve content, pubsub providers publish and subscribe, HTTP routers answer provider lookups, chain providers resolve addresses, and seeders serve board updates.",
      queries: providerHealth.map(({ expr, legend }) => ({ expr, legend })),
      transformations: [
        shortenUrlsTransformation,
        {
          id: "renameByRegex",
          options: { regex: "^(Seeder · \\w{8})\\w+(\\w{4})$", renamePattern: "$1…$2" },
        },
      ],
    }),
    { w: GRID_WIDTH, h: Math.max(8, Math.ceil(providerTotal * 0.75) + 2) },
  );

  layout.row("IPFS gateways", { collapsed: true });
  layout.add(
    makeTimeseriesPanel({
      title: "Comment fetch time",
      description: "Time to fetch a comment through each gateway. Gaps mean the fetch failed.",
      queries: [
        {
          expr: whenSuccessful(
            metric("ipfs_gateway_last_comment_fetch_duration_seconds"),
            metric("ipfs_gateway_last_comment_fetch_success"),
          ),
          legend: "{{ipfs_gateway_url}}",
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
      title: "Boards served",
      description:
        "Share of 5chan boards whose IPNS record each gateway resolved on its latest check.",
      queries: [
        {
          expr: `avg by (ipfs_gateway_url) (${metric("ipfs_gateway_last_community_ipns_fetch_success")})`,
          legend: "{{ipfs_gateway_url}}",
        },
      ],
      unit: "percentunit",
      max: 1,
      fillOpacity: 0,
      transformations: [shortenUrlsTransformation],
    }),
    { w: 12, h: 8 },
  );

  layout.row("Pubsub providers", { collapsed: true });
  for (const [action, label] of [
    ["publish", "Publish time"],
    ["subscribe", "Subscribe time"],
  ]) {
    layout.add(
      makeTimeseriesPanel({
        title: label,
        description: `Time for each pubsub provider to ${action} a test message. Gaps mean the check failed.`,
        queries: [
          {
            expr: whenSuccessful(
              metric(`pubsub_provider_last_${action}_duration_seconds`),
              metric(`pubsub_provider_last_${action}_success`),
            ),
            legend: "{{pubsub_provider_url}}",
          },
        ],
        unit: "s",
        fillOpacity: 0,
        transformations: [shortenUrlsTransformation],
      }),
      { w: 12, h: 8 },
    );
  }

  layout.row("HTTP routers", { collapsed: true });
  layout.add(
    makeTimeseriesPanel({
      title: "Provider lookup time",
      description:
        "Time for each HTTP router to answer a providers lookup. Gaps mean the lookup failed.",
      queries: [
        {
          expr: whenSuccessful(
            metric("http_router_last_get_providers_fetch_duration_seconds"),
            metric("http_router_last_get_providers_fetch_success"),
          ),
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
      title: "Boards with providers",
      description:
        "Share of 5chan boards for which each HTTP router returned at least one IPNS record provider.",
      queries: [
        {
          expr: `(count by (http_router_url) ((${routerBoardProviders} > 0) and (${routerBoardLookupSuccess} == 1)) or count by (http_router_url) (${routerBoardLookupSuccess}) * 0) / count by (http_router_url) (${routerBoardLookupSuccess})`,
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

  layout.row("Chain providers", { collapsed: true });
  layout.add(
    makeTimeseriesPanel({
      title: "Address resolve time",
      description:
        "Time for each chain provider to resolve a test address. Gaps mean the resolution failed.",
      queries: [
        {
          expr: whenSuccessful(
            metric("chain_provider_last_resolve_address_duration_seconds"),
            metric("chain_provider_last_resolve_address_success"),
          ),
          legend: "{{chain_provider_url}} ({{chain_ticker}})",
        },
      ],
      unit: "s",
      fillOpacity: 0,
      transformations: [shortenUrlsTransformation],
    }),
    { w: GRID_WIDTH, h: 8 },
  );

  layout.row("Seeders and previewers", { collapsed: true });
  layout.add(
    makeTimeseriesPanel({
      title: "Seeder update fetch time",
      description: "Time to fetch a board update from each seeder. Gaps mean the fetch failed.",
      queries: [
        {
          expr: whenSuccessful(
            metric("seeder_last_community_update_cid_fetch_duration_seconds"),
            metric("seeder_last_community_update_cid_fetch_success"),
          ),
          legend: "{{seeder_peer_id}}",
        },
      ],
      unit: "s",
      fillOpacity: 0,
    }),
    { w: 12, h: 8 },
  );
  layout.add(
    makeTimeseriesPanel({
      title: "Previewer fetch time",
      description:
        "Time to render a comment preview through each previewer. Gaps mean the fetch failed.",
      queries: [
        {
          expr: whenSuccessful(
            metric("previewer_last_comment_preview_fetch_duration_seconds"),
            metric("previewer_last_comment_preview_fetch_success"),
          ),
          legend: "{{previewer_url}}",
        },
      ],
      unit: "s",
      fillOpacity: 0,
      transformations: [shortenUrlsTransformation],
    }),
    { w: 12, h: 8 },
  );

  return layout.panels();
};

const buildFiveChanDashboard = ({ boards }) => {
  const layout = createLayout();

  layout.add(
    makeNavigationPanel({
      current: "fiveChan",
      intro: `Activity and availability of the ${boards.length} boards in the official 5chan directories.`,
    }),
    { w: GRID_WIDTH, h: 3 },
  );

  for (const panel of [
    boardsOnlineStat(boards),
    makeStatPanel({
      title: "Threads",
      description: "All-time threads across the official 5chan boards.",
      expr: `sum(${boardStat("all", "post")})`,
      sparkline: true,
    }),
    makeStatPanel({
      title: "Replies",
      description: "All-time replies across the official 5chan boards.",
      expr: `sum(${boardStat("all", "reply")})`,
      sparkline: true,
    }),
    makeStatPanel({
      title: "Monthly active",
      description: "Addresses that posted in the last 30 days, summed per board.",
      expr: `sum(${boardStat("month", "active_user")})`,
      sparkline: true,
    }),
  ]) {
    layout.add(panel, { w: 6, h: 4 });
  }

  layout.row("Activity");
  for (const panel of fiveChanActivityPanels()) {
    layout.add(panel, { w: 8, h: 8 });
  }

  layout.row("Boards");
  // Tall enough to list every board without a nested scrollbar.
  layout.add(makeBoardsTablePanel(boards), {
    w: GRID_WIDTH,
    h: Math.ceil((boards.length + 2) * 0.95) + 2,
  });

  layout.row("Board availability history", { collapsed: true });
  layout.add(
    makeStateTimelinePanel({
      title: "Board availability",
      description: `Green while a board is online: fetched successfully with an update less than ${BOARD_OFFLINE_AFTER_SECONDS / 3600} hours old.`,
      queries: [{ expr: boardOnline, legend: "{{community_address}}" }],
      upText: "Online",
      downText: "Offline",
    }),
    { w: GRID_WIDTH, h: Math.ceil(boards.length * 0.6) + 2 },
  );

  return layout.panels();
};

const makeDashboard = ({ uid, title, description, panels }) => ({
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
  tags: ["bitsocial", "stats", "5chan"],
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

const main = async () => {
  const directoryList = await loadFiveChanDirectories();
  const boards =
    directoryList.directories?.map((directory) => ({
      address: getDirectoryAddress(directory),
      title: directory.title,
      directoryCode: directory.directoryCode,
    })) || [];

  const missingAddress = boards.find((board) => typeof board.address !== "string");
  if (missingAddress) {
    throw new Error(
      `5chan directory '${missingAddress.directoryCode || missingAddress.title}' is missing name/communityAddress`,
    );
  }

  if (boards.length === 0) {
    throw new Error(`No 5chan communities found in ${fiveChanDirectoriesIndexUrl}`);
  }

  const overviewDashboard = makeDashboard({
    uid: "bitsocial-stats",
    title: "Bitsocial Stats",
    description: "Health and activity of the Bitsocial peer-to-peer network.",
    panels: buildOverviewDashboard({ boards }),
  });
  const fiveChanDashboard = makeDashboard({
    uid: "bitsocial-5chan",
    title: "5chan Stats",
    description: "Activity and availability of the official 5chan boards.",
    panels: buildFiveChanDashboard({ boards }),
  });

  await fs.mkdir(dashboardsOutputDir, { recursive: true });
  await fs.writeFile(
    path.join(dashboardsOutputDir, "bitsocial-stats.json"),
    `${JSON.stringify(overviewDashboard, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(dashboardsOutputDir, "5chan-stats.json"),
    `${JSON.stringify(fiveChanDashboard, null, 2)}\n`,
  );
  await fs.writeFile(directoriesSnapshotPath, `${JSON.stringify(directoryList, null, 2)}\n`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
