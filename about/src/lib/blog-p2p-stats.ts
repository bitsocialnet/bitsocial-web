// Reads live libp2p stats from the PKC account so the blog's P2P modal can
// show the same kind of "Mode / Peer ID / Connected peers" info 5chan exposes
// under Settings → P2P. Adapted (and trimmed) from
// `5chan/src/components/settings-modal/p2p-stats-settings/p2p-stats-settings.tsx`.

interface Libp2pPeerId {
  toString: () => string;
}

interface Libp2pHandle {
  peerId?: Libp2pPeerId;
  getPeers?: () => unknown[] | Promise<unknown[]>;
  getConnections?: () => unknown[] | Promise<unknown[]>;
}

interface Libp2pClient {
  _helia?: { libp2p?: Libp2pHandle };
}

interface AccountShape {
  pkc?: {
    clients?: {
      libp2pJsClients?: Record<string, Libp2pClient>;
    };
  };
  pkcOptions?: {
    httpRoutersOptions?: string[];
    libp2pJsClientsOptions?: unknown[];
  };
}

export interface BlogPeerConnection {
  id: string;
  peerId: string;
  address: string;
  transport: string;
  direction?: string;
  status?: string;
}

export interface BlogP2PStats {
  mode: "Browser libp2p" | "Initializing" | "Unavailable";
  peerId: string;
  peerCount: number;
  connectionCount: number;
  connections: BlogPeerConnection[];
  httpRouters: string[];
}

function getFirstObjectValue<T>(value?: Record<string, T>): T | undefined {
  return value ? Object.values(value)[0] : undefined;
}

async function resolveSafeArray(reader?: () => unknown[] | Promise<unknown[]>): Promise<unknown[]> {
  if (typeof reader !== "function") return [];
  try {
    const value = await reader();
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function pickString(value: unknown, ...keys: string[]): string {
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  for (const key of keys) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.length > 0) return candidate;
    if (
      candidate &&
      typeof candidate === "object" &&
      typeof (candidate as { toString?: () => string }).toString === "function"
    ) {
      const text = String(candidate);
      if (text && text !== "[object Object]") return text;
    }
  }
  return "";
}

function extractConnection(raw: unknown, index: number): BlogPeerConnection | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const record = raw as Record<string, unknown>;
  const peerRecord = record.remotePeer ?? record.peer ?? record.Peer ?? record.peerId;
  const peerId =
    pickString(peerRecord, "toString", "id", "peerId") ||
    pickString(record, "peerId", "id", "Peer", "peer", "remotePeer") ||
    "unknown";
  const addressRecord = record.remoteAddr ?? record.multiaddr ?? record.address ?? record.addr;
  const address =
    pickString(addressRecord, "toString") || pickString(record, "address", "addr") || "";
  const direction = pickString(record, "direction") || undefined;
  const status = pickString(record, "status", "state") || undefined;
  const transport =
    /\/(?:tcp|webrtc(?:-direct)?|webtransport|ws|wss|p2p-circuit)/i
      .exec(address)?.[0]
      ?.replace(/^\//, "") || "unknown";
  return {
    id: `${peerId}-${address || index}`,
    peerId,
    address,
    transport,
    direction,
    status,
  };
}

export async function readBlogP2PStats(account: unknown): Promise<BlogP2PStats> {
  const accountShape = account as AccountShape | undefined;
  const client = getFirstObjectValue(accountShape?.pkc?.clients?.libp2pJsClients);
  const libp2p = client?._helia?.libp2p;
  const httpRouters = accountShape?.pkcOptions?.httpRoutersOptions ?? [];

  if (!libp2p) {
    return {
      mode: client ? "Initializing" : "Unavailable",
      peerId: "unknown",
      peerCount: 0,
      connectionCount: 0,
      connections: [],
      httpRouters,
    };
  }

  const [peers, connections] = await Promise.all([
    resolveSafeArray(libp2p.getPeers),
    resolveSafeArray(libp2p.getConnections),
  ]);

  const connectionEntries = connections
    .map((entry, index) => extractConnection(entry, index))
    .filter((entry): entry is BlogPeerConnection => entry !== undefined);

  return {
    mode: "Browser libp2p",
    peerId: libp2p.peerId?.toString() ?? "unknown",
    peerCount: peers.length,
    connectionCount: connectionEntries.length,
    connections: connectionEntries,
    httpRouters,
  };
}
