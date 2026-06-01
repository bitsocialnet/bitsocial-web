// Browser-libp2p P2P stats reader, mirroring exactly the fields 5chan's
// settings panel displays (`5chan/src/components/settings-modal/p2p-stats-settings/p2p-stats-settings.tsx`,
// `getBrowserLibp2pStats`). Restyled on the consumer side — the data shape and
// every field name here matches 5chan so the modal can render the same rows.

import {
  fetchOwnPublicEndpoint,
  fetchPeerMapLocation,
  getApproximateCountryCode,
  getCountryConsistentLocation,
  getFirstPublicIpFromAddresses,
  type PeerMapLocation,
  type PublicEndpoint,
} from "@/lib/peer-geo";

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

const getFirstObjectValue = <T>(value?: Record<string, T>) =>
  value ? Object.values(value)[0] : undefined;

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
  _helia?: { libp2p?: Libp2pHandle; metrics?: unknown };
  key?: string;
};

type AccountShape = {
  pkc?: {
    clients?: {
      libp2pJsClients?: Record<string, Libp2pClientShape>;
    };
  };
};

// ---------- Transfer-stats walker (helia metrics + per-connection counters) ----------

const MAX_DEPTH = 10;
const MAX_OBJECTS = 400;

function addBytes(stats: TransferStats, direction: keyof TransferStats, value: unknown) {
  const numeric = getFiniteNumber(value);
  if (numeric === undefined) return;
  stats[direction] = (stats[direction] ?? 0) + numeric;
}

function walkHeliaMetrics(root: unknown): TransferStats {
  const totals: TransferStats = {};
  const visited = new WeakSet<object>();
  let objects = 0;
  const visit = (value: unknown, depth: number) => {
    try {
      if (!isRecord(value) || visited.has(value) || depth > MAX_DEPTH || objects > MAX_OBJECTS) {
        return;
      }
      visited.add(value);
      objects++;
      if ("bytesReceived" in value) addBytes(totals, "downloadedBytes", value.bytesReceived);
      if ("bytesSent" in value) addBytes(totals, "uploadedBytes", value.bytesSent);
      for (const [key, entry] of Object.entries(value)) {
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
        visit(entry, depth + 1);
      }
    } catch {
      // ignore — best-effort introspection
    }
  };
  visit(root, 0);
  return totals;
}

function readConnectionTransferStats(connection: unknown): TransferStats {
  const stats: TransferStats = {};
  if (!isRecord(connection)) return stats;
  addBytes(stats, "downloadedBytes", getRecordField(connection, ["bytesReceived"]));
  addBytes(stats, "uploadedBytes", getRecordField(connection, ["bytesSent"]));
  const metrics = getRecordField(connection, ["metrics", "stats"]);
  if (isRecord(metrics)) {
    addBytes(stats, "downloadedBytes", getRecordField(metrics, ["bytesReceived", "downloaded"]));
    addBytes(stats, "uploadedBytes", getRecordField(metrics, ["bytesSent", "uploaded"]));
  }
  return stats;
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

function extractConnectedPeers(
  connections: unknown[],
  knownPeers: unknown[],
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
    const transfer = readConnectionTransferStats(connection);
    return {
      id: `${peerId}-${address || index}`,
      peerId,
      address,
      transport,
      direction,
      status,
      transferStats:
        transfer.downloadedBytes !== undefined || transfer.uploadedBytes !== undefined
          ? transfer
          : undefined,
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
  const lookups = row.entries.map(async (entry) => {
    if (!entry.address) return entry;
    const onlineLocation = await fetchPeerMapLocation(entry.address, signal).catch(() => undefined);
    const approximateCountry = getApproximateCountryCode(entry.address);
    const location = getCountryConsistentLocation(approximateCountry, onlineLocation);
    return {
      ...entry,
      countryCode: location?.countryCode ?? approximateCountry,
      location,
    };
  });
  const entries = await Promise.all(lookups);
  return { ...row, entries };
}

function buildMapEntries(
  ownEndpoint: PublicEndpoint | undefined,
  row: ConnectedPeersStatRow,
): PeerMapEntry[] {
  const map: PeerMapEntry[] = [];
  if (ownEndpoint?.location) {
    map.push({
      address: ownEndpoint.ip,
      id: "self",
      location: ownEndpoint.location,
      peerId: "Your node",
      role: "seeder",
    });
  }
  for (const entry of row.entries) {
    if (!entry.location) continue;
    map.push({
      address: entry.address,
      id: entry.id,
      location: entry.location,
      peerId: entry.peerId,
      role: entry.role,
    });
  }
  return map;
}

// ---------- Public entry point ----------

export async function getBlogP2PStats(account: unknown, signal?: AbortSignal): Promise<StatRow[]> {
  const accountShape = account as AccountShape | undefined;
  const client = getFirstObjectValue(accountShape?.pkc?.clients?.libp2pJsClients);
  const libp2p = client?._helia?.libp2p;
  if (!libp2p) {
    return [{ name: "Mode", value: "Browser libp2p (initializing)" }];
  }

  // NOTE: getPeers / getConnections must be called as methods so `this` stays
  // bound to the libp2p node — passing the bare reference makes them throw.
  const [peers, connections, ownEndpoint] = await Promise.all([
    getSafeArray(() => libp2p.getPeers?.()),
    getSafeArray(() => libp2p.getConnections?.()),
    fetchOwnPublicEndpoint(signal).catch(() => undefined),
  ]);

  // Walk helia metrics for global transfer totals if the runtime exposes them,
  // and fall back to summing per-connection counters when missing.
  const heliaTotals = walkHeliaMetrics(client?._helia ?? libp2p);
  let downloadedSum = 0;
  let uploadedSum = 0;
  let sawConnectionStats = false;
  for (const connection of connections) {
    const t = readConnectionTransferStats(connection);
    if (t.downloadedBytes !== undefined) {
      downloadedSum += t.downloadedBytes;
      sawConnectionStats = true;
    }
    if (t.uploadedBytes !== undefined) {
      uploadedSum += t.uploadedBytes;
      sawConnectionStats = true;
    }
  }
  const totalDownloaded =
    heliaTotals.downloadedBytes ?? (sawConnectionStats ? downloadedSum : undefined);
  const totalUploaded = heliaTotals.uploadedBytes ?? (sawConnectionStats ? uploadedSum : undefined);

  // Use peer-side IPs as a fallback for the map when own endpoint lookup fails.
  let endpointForMap = ownEndpoint;
  if (!endpointForMap) {
    const peerIp = getFirstPublicIpFromAddresses(connections.map(getConnectionAddress));
    if (peerIp) endpointForMap = { ip: peerIp };
  }

  const connectedPeersRow = await resolvePeerLocations(
    extractConnectedPeers(connections, peers),
    signal,
  );
  const mapEntries = buildMapEntries(endpointForMap, connectedPeersRow);

  return [
    { name: "Mode", value: "Browser libp2p" },
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
      value: totalDownloaded === undefined ? "unknown" : formatBytes(totalDownloaded),
    },
    {
      name: "Data sent",
      value: totalUploaded === undefined ? "unknown" : formatBytes(totalUploaded),
    },
    { ...connectedPeersRow, mapEntries },
  ];
}
