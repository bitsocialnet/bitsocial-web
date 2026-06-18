import { multiaddr } from "@multiformats/multiaddr";

export const BLOG_BITSOCIAL_SEEDER_PEER_ID = "12D3KooWJdrcuyRwEGL7mnzV6tEYbgwmScFCvHtb1hN9fa9AL222";

export const BLOG_BITSOCIAL_SEEDER_MULTIADDRS = [
  `/dns4/91-234-199-189.k51qzi5uqu5djg5pdoi9a982tlvfy407t88c0wwghg9xe5u5i9h0gu8icejw9z.libp2p.direct/tcp/45169/tls/ws/p2p/${BLOG_BITSOCIAL_SEEDER_PEER_ID}`,
  `/ip4/91.234.199.189/udp/54667/quic-v1/webtransport/certhash/uEiCHEJWgvrRF-nr2scU7RRcACJlcVN1O94L_HVDsgVmJNg/certhash/uEiDg7pe07wPf5pIUO-rgww8TDuSUG8NAU_NRbseUwMZqeQ/p2p/${BLOG_BITSOCIAL_SEEDER_PEER_ID}`,
];

type Libp2pLike = {
  dial?: (address: unknown, options?: { signal?: AbortSignal }) => Promise<unknown>;
  getConnections?: () => unknown[];
  getPeers?: () => unknown[];
  status?: string;
};

type AccountShape = {
  pkc?: {
    clients?: {
      libp2pJsClients?: Record<
        string,
        {
          _helia?: {
            libp2p?: Libp2pLike;
          };
        }
      >;
    };
  };
};

const dialAttemptsByLibp2p = new WeakMap<Libp2pLike, Promise<boolean>>();

const toPeerString = (value: unknown) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toString" in value && typeof value.toString === "function") {
    return value.toString();
  }
  return "";
};

const getConnectionPeer = (connection: unknown) =>
  connection && typeof connection === "object" && "remotePeer" in connection
    ? toPeerString(connection.remotePeer)
    : "";

const getConnectionAddress = (connection: unknown) =>
  connection && typeof connection === "object" && "remoteAddr" in connection
    ? toPeerString(connection.remoteAddr)
    : "";

export function getBlogLibp2pFromAccount(account: unknown): Libp2pLike | undefined {
  const accountShape = account as AccountShape | undefined;
  const clients = accountShape?.pkc?.clients?.libp2pJsClients;
  if (!clients) return undefined;
  return Object.values(clients).find((client) => client?._helia?.libp2p)?._helia?.libp2p;
}

export function isConnectedToBlogSeeder(libp2p: Libp2pLike | undefined) {
  return Boolean(
    libp2p?.getConnections?.().some((connection) => {
      const peer = getConnectionPeer(connection);
      const address = getConnectionAddress(connection);
      return (
        peer === BLOG_BITSOCIAL_SEEDER_PEER_ID || address.includes(BLOG_BITSOCIAL_SEEDER_PEER_ID)
      );
    }),
  );
}

function createTimeoutSignal(parentSignal: AbortSignal | undefined, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  const abort = () => controller.abort();
  if (parentSignal?.aborted) {
    controller.abort();
  } else {
    parentSignal?.addEventListener("abort", abort, { once: true });
  }

  return {
    cleanup: () => {
      globalThis.clearTimeout(timeoutId);
      parentSignal?.removeEventListener("abort", abort);
    },
    signal: controller.signal,
  };
}

async function dialBlogSeeders(libp2p: Libp2pLike, signal?: AbortSignal) {
  if (libp2p.status === "stopped" || libp2p.status === "stopping") return false;
  if (isConnectedToBlogSeeder(libp2p)) return true;

  for (const address of BLOG_BITSOCIAL_SEEDER_MULTIADDRS) {
    const timeout = createTimeoutSignal(signal, 10_000);
    try {
      await libp2p.dial?.(multiaddr(address), { signal: timeout.signal });
      return true;
    } catch {
      // Try the next advertised transport.
    } finally {
      timeout.cleanup();
    }
  }

  return isConnectedToBlogSeeder(libp2p);
}

export async function dialBlogSeederPeers(account: unknown, signal?: AbortSignal) {
  const libp2p = getBlogLibp2pFromAccount(account);
  if (!libp2p?.dial) return false;
  if (isConnectedToBlogSeeder(libp2p)) return true;

  const existingAttempt = dialAttemptsByLibp2p.get(libp2p);
  if (existingAttempt) return existingAttempt;

  const attempt = dialBlogSeeders(libp2p, signal).finally(() => {
    dialAttemptsByLibp2p.delete(libp2p);
  });
  dialAttemptsByLibp2p.set(libp2p, attempt);
  return attempt;
}
