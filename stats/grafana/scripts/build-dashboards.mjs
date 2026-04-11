import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const grafanaRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(grafanaRoot, "..", "..");
const upstreamStatusPath = path.join(grafanaRoot, "upstream", "plebbit-status.json");
const directoriesSnapshotPath = path.join(
  repoRoot,
  "stats",
  "monitor",
  "data",
  "5chan-directories.snapshot.json",
);
const dashboardsOutputDir = path.join(grafanaRoot, "dashboards");

const COMMUNITY_FILTER = "5chan";
const COMMUNITY_SECTION_START = 12;
const COMMUNITY_PANEL_START = 13;
const PUBSUB_ROW_INDEX = 198;
const PUBSUB_PANEL_START = 199;
const LOWER_SECTIONS_START = 384;
const NFT_ROW_INDEX = 432;
const COMMUNITY_PANEL_COUNT_PER_GROUP = 5;
const COMMUNITY_GROUP_HEIGHT = 4;
const GENERATED_PANEL_ID_START = 2000000000;
const PROMETHEUS_DATASOURCE = { type: "prometheus", uid: "prometheus" };

const exprReplacements = [
  [
    "plebbit_uptime_monitor_http_router_last_subplebbit_ipns_",
    "bitsocial_stats_http_router_last_community_ipns_",
  ],
  [
    "plebbit_uptime_monitor_http_router_subplebbit_ipns_",
    "bitsocial_stats_http_router_community_ipns_",
  ],
  [
    "plebbit_uptime_monitor_ipfs_gateway_last_subplebbit_ipns_",
    "bitsocial_stats_ipfs_gateway_last_community_ipns_",
  ],
  [
    "plebbit_uptime_monitor_ipfs_gateway_subplebbit_ipns_",
    "bitsocial_stats_ipfs_gateway_community_ipns_",
  ],
  ["plebbit_uptime_monitor_last_subplebbit_pubsub_", "bitsocial_stats_last_community_pubsub_"],
  ["plebbit_uptime_monitor_last_subplebbit_update_", "bitsocial_stats_last_community_update_"],
  [
    "plebbit_uptime_monitor_subplebbit_pubsub_seconds_since_last_subplebbit_pubsub_message",
    "bitsocial_stats_community_pubsub_seconds_since_last_community_pubsub_message",
  ],
  ["plebbit_uptime_monitor_subplebbit_pubsub_", "bitsocial_stats_community_pubsub_"],
  ["plebbit_uptime_monitor_subplebbit_stats_", "bitsocial_stats_community_stats_"],
  [
    "plebbit_uptime_monitor_plebbit_seeder_last_subplebbit_update_cid_",
    "bitsocial_stats_seeder_last_community_update_cid_",
  ],
  [
    "plebbit_uptime_monitor_plebbit_seeder_subplebbit_update_cid_",
    "bitsocial_stats_seeder_community_update_cid_",
  ],
  ["plebbit_uptime_monitor_plebbit_previewer_", "bitsocial_stats_previewer_"],
  ["plebbit_uptime_monitor_plebbit_ipns_", "bitsocial_stats_network_ipns_"],
  ["plebbit_uptime_monitor_plebbit_pubsub_", "bitsocial_stats_network_pubsub_"],
  ["plebbit_uptime_monitor_", "bitsocial_stats_"],
];

const displayReplacements = [
  ["subplebbit_address", "community_address"],
  ["Plebbit Peers", "Bitsocial Network Peers"],
  ["Plebbit Seeders", "Bitsocial Seeders"],
  ["Plebbit Seeder", "Bitsocial Seeder"],
  ["Plebbit Previewers", "Bitsocial Previewers"],
  ["Plebbit Previewer", "Bitsocial Previewer"],
  ["Subplebbits", "Communities"],
  ["Subplebbit", "Community"],
  ["Plebbit", "Bitsocial"],
];

const communityMetricPrefixes = [
  "bitsocial_stats_community_",
  "bitsocial_stats_last_community_",
  "bitsocial_stats_http_router_community_",
  "bitsocial_stats_http_router_last_community_",
  "bitsocial_stats_ipfs_gateway_community_",
  "bitsocial_stats_ipfs_gateway_last_community_",
];

const dedupeIgnoredLabels = ["instance", "job", "service"];

let nextGeneratedPanelId = GENERATED_PANEL_ID_START;

const clone = (value) => JSON.parse(JSON.stringify(value));

const replaceAll = (value, replacements) =>
  replacements.reduce((result, [from, to]) => result.replaceAll(from, to), value);

const isCommunityMetric = (metricName) =>
  communityMetricPrefixes.some((prefix) => metricName.startsWith(prefix));

const addClientFilter = (metricName, selector, clientId) => {
  if (!clientId || !isCommunityMetric(metricName)) {
    return selector;
  }

  if (!selector) {
    return `{client_id="${clientId}"}`;
  }

  if (selector.includes("client_id=")) {
    return selector;
  }

  const selectorBody = selector.slice(1, -1).trim();
  const nextSelector = selectorBody
    ? `${selectorBody},client_id="${clientId}"`
    : `client_id="${clientId}"`;

  return `{${nextSelector}}`;
};

const normalizeMetricSelectors = (expr, { clientId } = {}) =>
  expr.replace(
    /\b(bitsocial_stats_[a-z0-9_]+)(\{[^{}]*\})?/g,
    (match, metricName, selector = "") => {
      const nextSelector = addClientFilter(metricName, selector, clientId);
      return `max without(${dedupeIgnoredLabels.join(", ")}) (${metricName}${nextSelector})`;
    },
  );

const transformExpr = (expr, { clientId } = {}) => {
  if (typeof expr !== "string") {
    return expr;
  }

  let transformed = replaceAll(expr, exprReplacements);
  transformed = transformed.replaceAll("subplebbit_address", "community_address");
  return normalizeMetricSelectors(transformed, { clientId });
};

const transformDisplayText = (value) => replaceAll(value, displayReplacements);

const transformObjectStrings = (value, key = "") => {
  if (Array.isArray(value)) {
    return value.map((item) => transformObjectStrings(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        transformObjectStrings(entryValue, entryKey),
      ]),
    );
  }

  if (typeof value === "string" && key !== "expr") {
    return transformDisplayText(value);
  }

  return value;
};

const normalizeDatasource = (panel) => {
  if (panel?.datasource?.type === "prometheus") {
    panel.datasource = clone(PROMETHEUS_DATASOURCE);
  }

  for (const target of panel.targets || []) {
    if (target?.datasource?.type === "prometheus") {
      target.datasource = clone(PROMETHEUS_DATASOURCE);
    }
  }

  return panel;
};

const moveLegacyFieldMapping = (mapping, fromKey, toKey) => {
  if (!mapping || typeof mapping !== "object" || !(fromKey in mapping)) {
    return;
  }

  if (!(toKey in mapping)) {
    mapping[toKey] = mapping[fromKey];
  }

  delete mapping[fromKey];
};

const normalizeTransformations = (panel) => {
  for (const transformation of panel.transformations || []) {
    if (transformation?.id !== "organize") {
      continue;
    }

    transformation.options = transformation.options || {};
    transformation.options.excludeByName = transformation.options.excludeByName || {};
    transformation.options.indexByName = transformation.options.indexByName || {};
    transformation.options.renameByName = transformation.options.renameByName || {};

    moveLegacyFieldMapping(
      transformation.options.indexByName,
      "subplebbit_address",
      "community_address",
    );
    moveLegacyFieldMapping(
      transformation.options.renameByName,
      "subplebbit_address",
      "community_address",
    );
    delete transformation.options.excludeByName.subplebbit_address;
  }

  return panel;
};

const transformPanel = (panel, { clientId } = {}) => {
  const transformedPanel = transformObjectStrings(clone(panel));
  normalizeDatasource(transformedPanel);
  normalizeTransformations(transformedPanel);

  for (const target of transformedPanel.targets || []) {
    target.expr = transformExpr(target.expr, { clientId });
  }

  return transformedPanel;
};

const makeGeneratedPanelId = () => {
  nextGeneratedPanelId += 1;
  return nextGeneratedPanelId;
};

const setPanelGridY = (panel, y) => {
  panel.gridPos = { ...panel.gridPos, y };
  return panel;
};

const replaceCommunityAddressInPanel = (panel, address) => {
  for (const target of panel.targets || []) {
    if (typeof target.expr === "string") {
      target.expr = target.expr.replaceAll("plebtoken.eth", address);
    }
  }

  panel.fieldConfig = panel.fieldConfig || {};
  panel.fieldConfig.overrides = [];
  return panel;
};

const buildCommunitySectionPanels = ({ templatePanels, communities, startY, clientId }) => {
  const panels = [];

  for (const [index, community] of communities.entries()) {
    const groupY = startY + index * COMMUNITY_GROUP_HEIGHT;
    for (const templatePanel of templatePanels) {
      const panel = transformPanel(templatePanel, { clientId });
      panel.id = makeGeneratedPanelId();
      delete panel.repeat;
      delete panel.repeatDirection;
      delete panel.repeatPanelId;
      delete panel.scopedVars;

      replaceCommunityAddressInPanel(panel, community.address);
      setPanelGridY(panel, groupY);
      panels.push(panel);
    }
  }

  return panels;
};

const shiftPanelsY = (panels, deltaY, { clientId } = {}) =>
  panels.map((panel) => {
    const transformedPanel = transformPanel(panel, { clientId });
    setPanelGridY(transformedPanel, transformedPanel.gridPos.y + deltaY);
    return transformedPanel;
  });

const applyPanelTitleOverrides = (dashboard) => {
  const panelsById = new Map(dashboard.panels.map((panel) => [panel.id, panel]));

  const titleOverrides = new Map([
    [941089908, "5chan Communities Summary"],
    [941089901, "5chan Communities"],
    [998904550, "5chan Community Pubsub"],
    [997284785, "Popular 5chan Communities"],
    [997284786, "5chan Unique Addresses"],
    [997284787, "5chan Posts"],
    [997284788, "5chan Monthly Active Addresses"],
    [997284789, "5chan Weekly Active Addresses"],
  ]);

  for (const [panelId, title] of titleOverrides) {
    const panel = panelsById.get(panelId);
    if (panel) {
      panel.title = title;
    }
  }

  return dashboard;
};

const buildDashboard = ({ upstreamDashboard, communities, title, uid }) => {
  const basePanels = upstreamDashboard.panels;
  const topPanels = basePanels
    .slice(0, COMMUNITY_SECTION_START)
    .map((panel) => transformPanel(panel, { clientId: COMMUNITY_FILTER }));
  const communityRow = transformPanel(basePanels[COMMUNITY_SECTION_START], {
    clientId: COMMUNITY_FILTER,
  });

  const originalCommunityCount =
    (PUBSUB_ROW_INDEX - COMMUNITY_PANEL_START) / COMMUNITY_PANEL_COUNT_PER_GROUP;
  const originalPubsubCount =
    (LOWER_SECTIONS_START - PUBSUB_PANEL_START) / COMMUNITY_PANEL_COUNT_PER_GROUP;
  const communitySectionDelta =
    (originalCommunityCount - communities.length) * COMMUNITY_GROUP_HEIGHT;
  const pubsubSectionDelta = (originalPubsubCount - communities.length) * COMMUNITY_GROUP_HEIGHT;

  const communityTemplatePanels = basePanels.slice(
    COMMUNITY_PANEL_START,
    COMMUNITY_PANEL_START + COMMUNITY_PANEL_COUNT_PER_GROUP,
  );
  const pubsubRow = transformPanel(basePanels[PUBSUB_ROW_INDEX], { clientId: COMMUNITY_FILTER });
  const pubsubTemplatePanels = basePanels.slice(
    PUBSUB_PANEL_START,
    PUBSUB_PANEL_START + COMMUNITY_PANEL_COUNT_PER_GROUP,
  );

  setPanelGridY(pubsubRow, pubsubRow.gridPos.y - communitySectionDelta);

  const communityPanels = buildCommunitySectionPanels({
    templatePanels: communityTemplatePanels,
    communities,
    startY: communityTemplatePanels[0].gridPos.y,
    clientId: COMMUNITY_FILTER,
  });
  const pubsubPanels = buildCommunitySectionPanels({
    templatePanels: pubsubTemplatePanels,
    communities,
    startY: pubsubTemplatePanels[0].gridPos.y - communitySectionDelta,
    clientId: COMMUNITY_FILTER,
  });
  const lowerPanels = shiftPanelsY(
    basePanels.slice(LOWER_SECTIONS_START, NFT_ROW_INDEX),
    -(communitySectionDelta + pubsubSectionDelta),
  );

  const dashboard = clone(upstreamDashboard);
  dashboard.id = null;
  dashboard.uid = uid;
  dashboard.title = title;
  dashboard.version = 1;
  dashboard.tags = ["bitsocial", "stats", "5chan"];
  dashboard.editable = false;
  dashboard.panels = [
    ...topPanels,
    communityRow,
    ...communityPanels,
    pubsubRow,
    ...pubsubPanels,
    ...lowerPanels,
  ];

  applyPanelTitleOverrides(dashboard);
  return dashboard;
};

const main = async () => {
  const upstreamStatus = JSON.parse(await fs.readFile(upstreamStatusPath, "utf8"));
  const directoriesSnapshot = JSON.parse(await fs.readFile(directoriesSnapshotPath, "utf8"));
  const communities =
    directoriesSnapshot?.directories?.map((directory) => ({
      address: directory.communityAddress,
      title: directory.title,
      directoryCode: directory.directoryCode,
    })) || [];

  if (communities.length === 0) {
    throw new Error("No 5chan communities found in the directories snapshot");
  }

  const summaryDashboard = buildDashboard({
    upstreamDashboard: upstreamStatus.dashboard,
    communities,
    title: "Bitsocial Stats",
    uid: "bitsocial-stats",
  });
  const fiveChanDashboard = buildDashboard({
    upstreamDashboard: upstreamStatus.dashboard,
    communities,
    title: "5chan Stats",
    uid: "bitsocial-5chan",
  });

  await fs.mkdir(dashboardsOutputDir, { recursive: true });
  await fs.writeFile(
    path.join(dashboardsOutputDir, "bitsocial-stats.json"),
    `${JSON.stringify(summaryDashboard, null, 2)}\n`,
  );
  await fs.writeFile(
    path.join(dashboardsOutputDir, "5chan-stats.json"),
    `${JSON.stringify(fiveChanDashboard, null, 2)}\n`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
