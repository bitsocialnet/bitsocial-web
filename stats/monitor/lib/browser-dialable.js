// Browser clients (pkc-js) reject WebRTC and WebTransport dials by default, so a browser can only
// reach a peer through a secure WebSocket address whose hostname resolves in public DNS and serves
// a valid certificate. Router provider counts cannot show that path failing: on 2026-10-31
// *.libp2p.direct (Kubo AutoTLS) returned NXDOMAIN, routers kept listing every provider, and no
// board loaded in any browser. These helpers dial providers the way a browser would.
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:browser-dialable");

const MULTISTREAM_HEADER = "/multistream/1.0.0\n";
const PROBE_TIMEOUT_MS = 8000;
// Every community lists mostly the same few providers, so one probe per address serves them all.
const PROBE_CACHE_MS = 5 * 60 * 1000;

const wssAddrPattern = /^\/dns[46]?\/([^/]+)\/tcp\/(\d+)\/(?:tls\/ws|wss)(?:\/p2p\/[^/]+)?$/;

/** wss:// URLs for a provider's direct secure WebSocket addresses. Relayed (p2p-circuit) addresses are left out. */
export const getBrowserWssUrls = (addrs) => {
  const urls = new Set();
  for (const addr of addrs || []) {
    const match = typeof addr === "string" && addr.match(wssAddrPattern);
    if (match) {
      urls.add(match[2] === "443" ? `wss://${match[1]}/` : `wss://${match[1]}:${match[2]}/`);
    }
  }
  return [...urls];
};

const textDecoder = new TextDecoder();
const multistreamHeaderMessage = new Uint8Array([
  MULTISTREAM_HEADER.length,
  ...new TextEncoder().encode(MULTISTREAM_HEADER),
]);

/** Resolves true when the URL completes DNS, TLS, a WebSocket upgrade and a libp2p multistream reply. */
export const probeWss = (
  url,
  { WebSocketImpl = globalThis.WebSocket, timeoutMs = PROBE_TIMEOUT_MS } = {},
) =>
  new Promise((resolve) => {
    let socket;
    let received = "";
    let done = false;
    // error, close and our own close() can each report the end, so only the first counts
    const finish = (ok, reason) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (!ok) debug(`browser dial failed '${url}': ${reason}`);
      try {
        socket?.close();
      } catch {}
      resolve(ok);
    };
    const timer = setTimeout(() => finish(false, "timeout"), timeoutMs);
    try {
      socket = new WebSocketImpl(url);
    } catch (e) {
      finish(false, e.message);
      return;
    }
    socket.binaryType = "arraybuffer";
    socket.onopen = () => socket.send(multistreamHeaderMessage);
    socket.onmessage = (event) => {
      received += typeof event.data === "string" ? event.data : textDecoder.decode(event.data);
      if (received.includes(MULTISTREAM_HEADER)) finish(true);
    };
    socket.onerror = (event) => finish(false, event?.message || "error");
    socket.onclose = () => finish(false, "closed");
  });

export const createBrowserDialableFilter = ({ probe = probeWss, now = Date.now } = {}) => {
  const cache = new Map();
  const probeCached = (url) => {
    const cached = cache.get(url);
    if (cached && now() - cached.at < PROBE_CACHE_MS) return cached.result;
    const result = probe(url);
    cache.set(url, { at: now(), result });
    return result;
  };

  /** The providers a browser can dial, keeping the router's provider objects. */
  return async (providers) => {
    const dialable = await Promise.all(
      (providers || []).map(async (provider) => {
        const results = await Promise.all(getBrowserWssUrls(provider?.Addrs).map(probeCached));
        return results.includes(true);
      }),
    );
    return (providers || []).filter((_, index) => dialable[index]);
  };
};

export const filterBrowserDialablePeers = createBrowserDialableFilter();
