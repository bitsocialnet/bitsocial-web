// Browser-libp2p P2P stats reader, adapted from 5chan's
// `getBrowserLibp2pStats`. Restyled on the consumer side; row names and shapes
// stay aligned so the modal can render the same browser P2P details.

import {
  fetchOwnPublicEndpoint,
  fetchPeerMapLocation,
  getFirstPublicIpFromAddresses,
  type PeerMapLocation,
  type PublicEndpoint,
} from "@/lib/peer-geo";
import { dialBlogSeederPeers } from "@/lib/p2p-seeder-dial";

// ---------- Public types (1:1 with 5chan StatRow union) ----------

export type TextStatRow = {
  name: string;
  type?: "text";
  value: string;
};

export type NodeEndpointStatRow = {
  countryCode?: string;
  ip: string;
  name: string;
  type: "nodeEndpoint";
};

export type PeerConnectionRole = "leecher" | "seeder";

export type TransferStats = {
  downloadedBytes?: number;
  uploadedBytes?: number;
};

type TransferStatsSnapshot = {
  peers: Map<string, TransferStats>;
  totals: TransferStats;
};

type ObservedTransferStats = {
  connections: WeakSet<object>;
  downloadedBytes: number;
  peers: Map<string, TransferStats>;
  streams: WeakSet<object>;
  uploadedBytes: number;
};

export type ConnectedPeerEntry = {
  address: string;
  countryCode?: string;
  direction?: string;
  id: string;
  location?: PeerMapLocation;
  peerId: string;
  role?: PeerConnectionRole;
  status?: string;
  transferStats?: TransferStats;
  transport: string;
};

export type PeerMapEntry = {
  address: string;
  id: string;
  location?: PeerMapLocation;
  peerId: string;
  role?: PeerConnectionRole;
};

export type ConnectedPeersStatRow = {
  connectionCount: number;
  entries: ConnectedPeerEntry[];
  mapEntries?: PeerMapEntry[];
  name: string;
  peerCount: number;
  type: "connectedPeers";
};

export type StatRow = ConnectedPeersStatRow | NodeEndpointStatRow | TextStatRow;

// ---------- Generic helpers (subset of 5chan's, same semantics) ----------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object";

const toArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && Symbol.iterator in value) {
    return Array.from(value as Iterable<unknown>);
  }
  return [];
};

const getStringValue = (value: unknown, fallback = "unknown") => {
  if (value === null || value === undefined) return fallback;
  try {
    const stringValue = String(value);
    return stringValue || fallback;
  } catch {
    return fallback;
  }
};

const getFiniteNumber = (value: unknown) => {
  if (value === null || value === undefined) return undefined;
  const numericValue = typeof value === "bigint" ? Number(value) : Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
};

const getRecordField = (record: unknown, fields: string[]) => {
  if (!isRecord(record)) return undefined;
  for (const field of fields) {
    if (field in record) return record[field];
  }
  return undefined;
};

const getStringField = (record: unknown, fields: string[], fallback = "") => {
  const value = getRecordField(record, fields);
  if (Array.isArray(value)) return getStringValue(value[0], fallback);
  return getStringValue(value, fallback);
};

const getSafeArray = async (
  reader?: () => unknown[] | Promise<unknown[]> | undefined,
): Promise<unknown[]> => {
  try {
    return toArray(reader ? await reader() : undefined);
  } catch {
    return [];
  }
};

export const formatBytes = (value: unknown) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value ?? "unknown");
  if (numericValue < 1024) return `${numericValue} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let size = numericValue / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(size >= 10 ? 1 : 2)} ${units[unitIndex]}`;
};

// ---------- Account / libp2p shapes ----------

type Libp2pHandle = {
  peerId?: { toString: () => string };
  getPeers?: () => unknown[] | Promise<unknown[]>;
  getConnections?: () => unknown[] | Promise<unknown[]>;
  metrics?: unknown;
};

type Libp2pClientShape = {
  _helia?: {
    libp2p?: Libp2pHandle;
    metrics?: unknown;
    routing?: {
      routers?: unknown[];
    };
  };
  heliaWithKuboRpcClientFunctions?: {
    add?: unknown;
  };
  key?: string;
};

type AccountShape = {
  pkc?: {
    clients?: {
      libp2pJsClients?: Record<string, Libp2pClientShape>;
    };
  };
  pkcOptions?: Record<string, unknown>;
};

function getBlogLibp2pClientFromAccount(accountShape: AccountShape | undefined) {
  const clients = accountShape?.pkc?.clients?.libp2pJsClients;
  if (!clients) return undefined;
  return Object.values(clients).find((client) => client?._helia?.libp2p);
}

// ---------- Transfer-stats walker (ported from 5chan's browser P2P stats) ----------

const MAX_TRANSFER_COUNTER_DEPTH = 10;
const MAX_TRANSFER_COUNTER_OBJECTS = 400;
const observedBrowserTransferStats = new WeakMap<object, ObservedTransferStats>();

function addTransferStats(stats: TransferStats, direction: keyof TransferStats, value: unknown) {
  const numericValue = getFiniteNumber(value);
  if (numericValue === undefined) return;
  stats[direction] = (stats[direction] ?? 0) + numericValue;
}

function mergeTransferStats(primary: TransferStats, fallback: TransferStats): TransferStats {
  return {
    downloadedBytes: primary.downloadedBytes ?? fallback.downloadedBytes,
    uploadedBytes: primary.uploadedBytes ?? fallback.uploadedBytes,
  };
}

function createTransferStatsSnapshot(): TransferStatsSnapshot {
  return { peers: new Map(), totals: {} };
}

function hasTransferStats(stats?: TransferStats) {
  return stats?.downloadedBytes !== undefined || stats?.uploadedBytes !== undefined;
}

function getPeerTransferKey(value: unknown) {
  const key = getStringValue(value, "").trim();
  if (!key) return undefined;
  const normalizedKey = key.toLowerCase();
  if (
    /^\d+$/.test(key) ||
    ["global", "value", "total", "sum", "count"].includes(normalizedKey) ||
    normalizedKey.includes("bytes") ||
    normalizedKey.includes("rate")
  ) {
    return undefined;
  }
  return key;
}

function addPeerTransferStats(
  peers: Map<string, TransferStats>,
  peerKey: unknown,
  direction: keyof TransferStats,
  value: unknown,
) {
  const key = getPeerTransferKey(peerKey);
  if (!key) return;
  const stats = peers.get(key) ?? {};
  addTransferStats(stats, direction, value);
  if (hasTransferStats(stats)) peers.set(key, stats);
}

function addTransferSnapshotStats(
  snapshot: TransferStatsSnapshot,
  direction: keyof TransferStats,
  value: unknown,
  peerKey?: unknown,
) {
  addTransferStats(snapshot.totals, direction, value);
  if (peerKey !== undefined) addPeerTransferStats(snapshot.peers, peerKey, direction, value);
}

function mergeTransferSnapshots(
  primary: TransferStatsSnapshot,
  fallback: TransferStatsSnapshot,
): TransferStatsSnapshot {
  const peers = new Map<string, TransferStats>();
  for (const [peerKey, stats] of fallback.peers) peers.set(peerKey, stats);
  for (const [peerKey, stats] of primary.peers) {
    peers.set(peerKey, mergeTransferStats(stats, peers.get(peerKey) ?? {}));
  }
  return {
    peers,
    totals: mergeTransferStats(primary.totals, fallback.totals),
  };
}

function getEntries(value: unknown): [string, unknown][] {
  try {
    if (value instanceof Map)
      return Array.from(value.entries()).map(([key, entry]) => [String(key), entry]);
    if (Array.isArray(value)) return value.map((entry, index) => [String(index), entry]);
    if (isRecord(value)) return Object.entries(value);
    return [];
  } catch {
    return [];
  }
}

function getByteLength(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") return new TextEncoder().encode(value).byteLength;
  if (value instanceof ArrayBuffer) return value.byteLength;
  if (ArrayBuffer.isView(value)) return value.byteLength;
  if (isRecord(value)) {
    const directByteLength = getFiniteNumber(value.byteLength);
    if (directByteLength !== undefined) return directByteLength;
    const dataByteLength = getByteLength(value.data);
    if (dataByteLength !== undefined) return dataByteLength;
  }
  if (Array.isArray(value)) {
    const total = value.reduce((sum, entry) => sum + (getByteLength(entry) ?? 0), 0);
    return total > 0 ? total : undefined;
  }
  return undefined;
}

function getTransferStatsFromHeliaCounters(helia: unknown): TransferStatsSnapshot {
  const snapshot = createTransferStatsSnapshot();
  const visited = new WeakSet<object>();
  let objectsVisited = 0;

  const visit = (value: unknown, depth: number, peerKey?: string) => {
    try {
      if (
        !isRecord(value) ||
        visited.has(value) ||
        depth > MAX_TRANSFER_COUNTER_DEPTH ||
        objectsVisited > MAX_TRANSFER_COUNTER_OBJECTS
      ) {
        return;
      }
      visited.add(value);
      objectsVisited++;

      if ("bytesReceived" in value || "bytesSent" in value) {
        const directPeerKey =
          getPeerTransferKey(
            getRecordField(value, ["peerId", "peer", "Peer", "id", "remotePeer"]),
          ) ?? peerKey;
        addTransferSnapshotStats(snapshot, "downloadedBytes", value.bytesReceived, directPeerKey);
        addTransferSnapshotStats(snapshot, "uploadedBytes", value.bytesSent, directPeerKey);
      }

      for (const [key, entry] of getEntries(value)) {
        if (
          typeof entry === "function" ||
          key === "logger" ||
          key === "log" ||
          key === "events" ||
          key === "datastore" ||
          key === "routing"
        ) {
          continue;
        }
        const nextPeerKey =
          peerKey ??
          (isRecord(entry) && ("bytesReceived" in entry || "bytesSent" in entry)
            ? getPeerTransferKey(key)
            : undefined);
        visit(entry, depth + 1, nextPeerKey);
      }
    } catch {
      return;
    }
  };

  visit(helia, 0);
  return snapshot;
}

function classifyTransferMetricPath(path: string[]) {
  const normalizedPath = path
    .join("_")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (normalizedPath.includes("rate")) return undefined;
  if (
    normalizedPath.includes("totalin") ||
    normalizedPath.includes("bytesreceived") ||
    normalizedPath.includes("receivedbytes") ||
    normalizedPath.includes("datareceivedbytes")
  ) {
    return "downloadedBytes" as const;
  }
  if (
    normalizedPath.includes("totalout") ||
    normalizedPath.includes("bytessent") ||
    normalizedPath.includes("sentbytes") ||
    normalizedPath.includes("datasentbytes") ||
    normalizedPath.includes("sentdatabytes")
  ) {
    return "uploadedBytes" as const;
  }
  return undefined;
}

async function getMetricSnapshot(source: unknown) {
  if (!isRecord(source)) return source;
  const snapshots = await Promise.all(
    ["getMetrics", "getMetricValues", "toJSON"].map(async (method) => {
      const candidate = source[method];
      if (typeof candidate !== "function") return undefined;
      try {
        return await candidate.call(source);
      } catch {
        return undefined;
      }
    }),
  );
  return snapshots.find((snapshot) => snapshot !== undefined) ?? source;
}

function getTransferStatsFromMetricSnapshot(metricSnapshot: unknown): TransferStatsSnapshot {
  const snapshot = createTransferStatsSnapshot();
  const visited = new WeakSet<object>();

  const visit = (value: unknown, path: string[], depth: number) => {
    const direction = classifyTransferMetricPath(path);
    const numericValue = getFiniteNumber(value);
    if (direction && numericValue !== undefined) {
      addTransferStats(snapshot.totals, direction, numericValue);
      return;
    }

    if (!isRecord(value) || visited.has(value) || depth > MAX_TRANSFER_COUNTER_DEPTH) return;
    visited.add(value);

    if (direction) {
      const totalValue =
        "global" in value ? value.global : "value" in value ? value.value : undefined;
      const hasTotalValue = getFiniteNumber(totalValue) !== undefined;
      if (hasTotalValue) addTransferStats(snapshot.totals, direction, totalValue);

      let foundPeerValue = false;
      for (const [key, entry] of getEntries(value)) {
        const peerKey = getPeerTransferKey(key);
        const peerValue = getFiniteNumber(entry);
        if (!peerKey || peerValue === undefined) continue;
        addPeerTransferStats(snapshot.peers, peerKey, direction, peerValue);
        if (!hasTotalValue) addTransferStats(snapshot.totals, direction, peerValue);
        foundPeerValue = true;
      }

      if (hasTotalValue || foundPeerValue) return;
    }

    for (const [key, entry] of getEntries(value)) visit(entry, [...path, key], depth + 1);
  };

  visit(metricSnapshot, [], 0);
  return snapshot;
}

function getTransferStatsFromSources(sources: unknown[]): TransferStats {
  return sources.reduce<TransferStats>((stats, source) => {
    if (!isRecord(source)) return stats;
    const downloadedBytes =
      source.totalIn ??
      source.TotalIn ??
      source.downloadedBytes ??
      source.bytesReceived ??
      source.receivedBytes ??
      source.dataReceivedBytes;
    const uploadedBytes =
      source.totalOut ??
      source.TotalOut ??
      source.uploadedBytes ??
      source.bytesSent ??
      source.sentBytes ??
      source.dataSentBytes;
    addTransferStats(stats, "downloadedBytes", downloadedBytes);
    addTransferStats(stats, "uploadedBytes", uploadedBytes);
    return stats;
  }, {});
}

function getNestedTransferStats(source: unknown): TransferStats {
  if (!isRecord(source)) return {};
  return getTransferStatsFromSources([
    source,
    source.stat,
    source.stats,
    source.sessionStats,
    source.bandwidth,
    source.Bandwidth,
    source.bandwidthStats,
    source.transferStats,
  ]);
}

function getTransferStatsFromClientShape(client?: Libp2pClientShape): TransferStats {
  const clientRecord = isRecord(client) ? (client as Record<string, unknown>) : undefined;
  return getNestedTransferStats(clientRecord);
}

function getObservedTransferStats(client?: Libp2pClientShape): ObservedTransferStats | undefined {
  if (!isRecord(client)) return undefined;
  let stats = observedBrowserTransferStats.get(client);
  if (!stats) {
    stats = {
      connections: new WeakSet<object>(),
      downloadedBytes: 0,
      peers: new Map(),
      streams: new WeakSet<object>(),
      uploadedBytes: 0,
    };
    observedBrowserTransferStats.set(client, stats);
  }
  return stats;
}

function addObservedTransferStats(
  stats: ObservedTransferStats,
  direction: keyof TransferStats,
  value: unknown,
  peerKey?: unknown,
) {
  addTransferStats(stats, direction, value);
  addPeerTransferStats(stats.peers, peerKey, direction, value);
}

function getObservedTransferSnapshot(stats?: ObservedTransferStats): TransferStatsSnapshot {
  const snapshot = createTransferStatsSnapshot();
  if (!stats) return snapshot;
  snapshot.totals = {
    downloadedBytes: stats.downloadedBytes,
    uploadedBytes: stats.uploadedBytes,
  };
  for (const [peerKey, peerStats] of stats.peers) snapshot.peers.set(peerKey, peerStats);
  return snapshot;
}

function instrumentStreamTransferStats(
  stream: unknown,
  stats: ObservedTransferStats,
  peerKey?: unknown,
) {
  if (!isRecord(stream) || stats.streams.has(stream)) return;
  stats.streams.add(stream);

  const send = stream.send;
  if (typeof send === "function") {
    try {
      stream.send = function sendWithTransferStats(
        this: unknown,
        data: unknown,
        ...args: unknown[]
      ) {
        addObservedTransferStats(stats, "uploadedBytes", getByteLength(data), peerKey);
        return send.call(this, data, ...args);
      };
    } catch {
      // Some stream implementations expose read-only methods.
    }
  }

  const addEventListener = stream.addEventListener;
  if (typeof addEventListener === "function") {
    try {
      addEventListener.call(stream, "message", (event: unknown) => {
        const data = isRecord(event) ? (event.data ?? event.detail) : undefined;
        addObservedTransferStats(stats, "downloadedBytes", getByteLength(data), peerKey);
      });
    } catch {
      return;
    }
  }
}

function instrumentConnectionTransferStats(connection: unknown, stats: ObservedTransferStats) {
  if (!isRecord(connection)) return;
  const peerKey = getStringValue(connection.remotePeer);

  if (!stats.connections.has(connection)) {
    stats.connections.add(connection);
    const newStream = connection.newStream;
    if (typeof newStream === "function") {
      try {
        connection.newStream = async function newStreamWithTransferStats(
          this: unknown,
          ...args: unknown[]
        ) {
          const stream = await newStream.apply(this, args);
          instrumentStreamTransferStats(stream, stats, peerKey);
          return stream;
        };
      } catch {
        // Some connection implementations expose read-only methods.
      }
    }
  }

  for (const stream of toArray(connection.streams))
    instrumentStreamTransferStats(stream, stats, peerKey);
}

async function getBrowserTransferStats(
  client?: Libp2pClientShape,
  connections: unknown[] = [],
): Promise<TransferStatsSnapshot> {
  try {
    const helia = client?._helia;
    const observedStats = getObservedTransferStats(client);
    if (observedStats) {
      connections.forEach((connection) =>
        instrumentConnectionTransferStats(connection, observedStats),
      );
    }

    const clientStats = {
      peers: new Map<string, TransferStats>(),
      totals: getTransferStatsFromClientShape(client),
    };
    const counterStats = getTransferStatsFromHeliaCounters(helia);
    const metricSources = [helia?.metrics, helia?.libp2p?.metrics].filter(Boolean);
    const metricSnapshots = await Promise.all(
      metricSources.map((source) => getMetricSnapshot(source)),
    );
    const metricStats = metricSnapshots
      .map((snapshot) => getTransferStatsFromMetricSnapshot(snapshot))
      .reduce<TransferStatsSnapshot>(
        (stats, nextStats) => mergeTransferSnapshots(stats, nextStats),
        createTransferStatsSnapshot(),
      );

    return mergeTransferSnapshots(
      mergeTransferSnapshots(mergeTransferSnapshots(clientStats, counterStats), metricStats),
      getObservedTransferSnapshot(observedStats),
    );
  } catch {
    return createTransferStatsSnapshot();
  }
}

function getFunctionSource(value: unknown) {
  if (typeof value !== "function") return undefined;
  try {
    return Function.prototype.toString.call(value).toLowerCase();
  } catch {
    return undefined;
  }
}

function hasSupportedAdd(client?: Libp2pClientShape) {
  const add = client?.heliaWithKuboRpcClientFunctions?.add;
  const source = getFunctionSource(add);
  return (
    typeof add === "function" &&
    !source?.includes("not supported") &&
    !source?.includes("unsupported")
  );
}

function isKnownNoopProvide(provide: unknown) {
  const source = getFunctionSource(provide);
  if (typeof provide !== "function") return true;
  return Boolean(source?.includes("noop") || source?.replace(/\s/g, "") === "asyncprovide(){}");
}

function hasProviderPublishingRouter(client?: Libp2pClientShape) {
  return (client?._helia?.routing?.routers ?? []).some(
    (router) => isRecord(router) && !isKnownNoopProvide(router.provide),
  );
}

function getBrowserMode(client?: Libp2pClientShape) {
  if (!client) return "Unknown";
  return hasSupportedAdd(client) && hasProviderPublishingRouter(client) ? "Seeding" : "Leeching";
}

function getEndpointAddress(ip: string) {
  return ip.includes(":") ? `/ip6/${ip}/tcp/0` : `/ip4/${ip}/tcp/0`;
}

// ---------- Connection extraction ----------

const PEER_ID_FIELDS = ["remotePeer", "peer", "Peer", "peerId", "id"];
const ADDRESS_FIELDS = ["remoteAddr", "multiaddr", "address", "addr"];

function getConnectionPeerId(connection: unknown): string {
  if (!isRecord(connection)) return "unknown";
  const peerField = getRecordField(connection, PEER_ID_FIELDS);
  if (peerField && typeof (peerField as { toString?: unknown }).toString === "function") {
    const stringified = String(peerField);
    if (stringified && stringified !== "[object Object]") return stringified;
  }
  return getStringField(connection, ["peerId", "id"], "unknown");
}

function getConnectionAddress(connection: unknown): string {
  if (!isRecord(connection)) return "";
  const addressField = getRecordField(connection, ADDRESS_FIELDS);
  if (addressField && typeof (addressField as { toString?: unknown }).toString === "function") {
    const stringified = String(addressField);
    if (stringified && stringified !== "[object Object]") return stringified;
  }
  return getStringField(connection, ["address", "addr"], "");
}

// Verbatim port of 5chan's getTransportLabel: prefer the application-layer
// transport (WebTransport/WebRTC/WebSocket/QUIC) over the underlying tcp/udp,
// and flag relayed connections.
function getConnectionTransport(address: string): string {
  const normalized = address.toLowerCase();
  let transport = "Unknown transport";
  if (normalized.includes("/webtransport")) transport = "WebTransport";
  else if (normalized.includes("/webrtc-direct")) transport = "WebRTC direct";
  else if (normalized.includes("/webrtc")) transport = "WebRTC";
  else if (normalized.includes("/wss")) transport = "Secure WebSocket";
  else if (normalized.includes("/tls/ws") || normalized.includes("/ws"))
    transport = normalized.includes("/tls") ? "Secure WebSocket" : "WebSocket";
  else if (normalized.includes("/quic")) transport = "QUIC";
  else if (normalized.includes("/tcp")) transport = "TCP";
  else if (normalized.includes("/udp")) transport = "UDP";
  return normalized.includes("/p2p-circuit") ? `${transport} through relay` : transport;
}

function getPeerIdFromAddress(address: string) {
  const parts = address.split("/p2p/");
  return parts.length > 1 ? parts[parts.length - 1]?.split("/")[0] : undefined;
}

function getPeerTransferStats(
  peerStats: Map<string, TransferStats>,
  peerId: string,
  address: string,
) {
  const addressPeerId = getPeerIdFromAddress(address);
  return (
    peerStats.get(peerId) ??
    (addressPeerId ? peerStats.get(addressPeerId) : undefined) ??
    peerStats.get(address)
  );
}

function getBrowserPeerTransferStats(
  connection: unknown,
  peerId: string,
  address: string,
  peerStats: Map<string, TransferStats>,
) {
  return mergeTransferStats(
    getPeerTransferStats(peerStats, peerId, address) ?? {},
    mergeTransferStats(getNestedTransferStats(connection), {
      downloadedBytes: 0,
      uploadedBytes: 0,
    }),
  );
}

function extractConnectedPeers(
  connections: unknown[],
  knownPeers: unknown[],
  peerTransferStats: Map<string, TransferStats>,
): ConnectedPeersStatRow {
  const entries: ConnectedPeerEntry[] = connections.map((connection, index) => {
    const peerId = getConnectionPeerId(connection);
    const address = getConnectionAddress(connection);
    const transport = getConnectionTransport(address);
    const direction = isRecord(connection)
      ? getStringField(connection, ["direction"], "") || undefined
      : undefined;
    const status = isRecord(connection)
      ? getStringField(connection, ["status", "state"], "") || undefined
      : undefined;
    return {
      id: `${peerId}-${address || index}`,
      peerId,
      address,
      transport,
      direction,
      status,
      transferStats: getBrowserPeerTransferStats(connection, peerId, address, peerTransferStats),
    };
  });

  const peerIdSet = new Set<string>();
  for (const peer of [...knownPeers, ...entries]) {
    const peerId =
      typeof peer === "string"
        ? peer
        : isRecord(peer)
          ? getStringField(peer, PEER_ID_FIELDS, getStringValue(peer, "unknown"))
          : "unknown";
    if (peerId && peerId !== "unknown") peerIdSet.add(peerId);
  }

  return {
    connectionCount: entries.length,
    entries,
    name: "Connected peers",
    peerCount: peerIdSet.size || entries.length,
    type: "connectedPeers",
  };
}

// ---------- Peer location resolution (online + offline fallback) ----------

async function resolvePeerLocations(
  row: ConnectedPeersStatRow,
  signal?: AbortSignal,
): Promise<ConnectedPeersStatRow> {
  if (!row.entries.length) return row;
  const lookups = new Map<string, Promise<PeerMapLocation | undefined>>();
  const entries = await Promise.all(
    row.entries.map(async (entry) => {
      if (!entry.address) return entry;
      let lookup = lookups.get(entry.address);
      if (!lookup) {
        lookup = fetchPeerMapLocation(entry.address, signal).catch(() => undefined);
        lookups.set(entry.address, lookup);
      }
      const location = await lookup;
      if (!location) return entry;
      return {
        ...entry,
        countryCode: location.countryCode ?? entry.countryCode,
        location,
      };
    }),
  );
  return { ...row, entries };
}

function buildMapEntries(
  ownEndpoint: PublicEndpoint | undefined,
  row: ConnectedPeersStatRow,
  mode: string,
): PeerMapEntry[] {
  const map: PeerMapEntry[] = [];
  if (ownEndpoint?.location) {
    map.push({
      address: getEndpointAddress(ownEndpoint.ip),
      id: "self",
      location: ownEndpoint.location,
      peerId: "Your node",
      role: mode === "Leeching" ? "leecher" : "seeder",
    });
  }
  for (const entry of row.entries) {
    if (!entry.location) continue;
    map.push({
      address: entry.address,
      id: entry.id,
      location: entry.location,
      peerId: entry.peerId,
      role: entry.role ?? "seeder",
    });
  }
  return map;
}

// ---------- Public entry point ----------

export async function getBlogP2PStats(account: unknown, signal?: AbortSignal): Promise<StatRow[]> {
  const accountShape = account as AccountShape | undefined;
  const client = getBlogLibp2pClientFromAccount(accountShape);
  const libp2p = client?._helia?.libp2p;

  if (!libp2p) {
    return [{ name: "Mode", value: "Browser libp2p (initializing)" }];
  }

  const mode = getBrowserMode(client);

  void dialBlogSeederPeers(accountShape, signal).catch(() => undefined);

  // NOTE: getPeers / getConnections must be called as methods so `this` stays
  // bound to the libp2p node — passing the bare reference makes them throw.
  const [peers, connections, ownEndpoint] = await Promise.all([
    getSafeArray(() => libp2p.getPeers?.()),
    getSafeArray(() => libp2p.getConnections?.()),
    fetchOwnPublicEndpoint(signal).catch(() => undefined),
  ]);

  const transferStats = await getBrowserTransferStats(client, connections);

  // Use peer-side IPs as a fallback for the map when own endpoint lookup fails.
  let endpointForMap = ownEndpoint;
  if (!endpointForMap) {
    const peerIp = getFirstPublicIpFromAddresses(connections.map(getConnectionAddress));
    if (peerIp) endpointForMap = { ip: peerIp };
  }

  const connectedPeersRow = await resolvePeerLocations(
    extractConnectedPeers(connections, peers, transferStats.peers),
    signal,
  );
  const mapEntries = buildMapEntries(endpointForMap, connectedPeersRow, mode);

  return [
    { name: "Mode", value: mode },
    { name: "Peer ID", value: libp2p.peerId?.toString() ?? "unknown" },
    ownEndpoint
      ? {
          countryCode: ownEndpoint.countryCode,
          ip: ownEndpoint.ip,
          name: "Your IP",
          type: "nodeEndpoint",
        }
      : { name: "Your IP", value: "unavailable" },
    {
      name: "Data received",
      value: formatBytes(transferStats.totals.downloadedBytes),
    },
    {
      name: "Data sent",
      value: formatBytes(transferStats.totals.uploadedBytes),
    },
    { ...connectedPeersRow, mapEntries },
  ];
}
