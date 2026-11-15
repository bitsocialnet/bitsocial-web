import monitorState from "./monitor-state.js";
import prometheus from "./prometheus.js";
import fs from "fs-extra";
import { fetchJson } from "./utils.js";
import { countPeerLocations, getPeerIp, parsePeerLocation } from "./peer-location.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:peers");

const peersNames = [
  "ipnsDhtPeers",
  "ipnsHttpRoutersPeers",
  "ipnsCidHttpRoutersPeers",
  // the ipnsCidHttpRoutersPeers a browser can dial (lib/browser-dialable.js)
  "ipnsCidHttpRoutersBrowserPeers",
  "pubsubDhtPeers",
  "pubsubHttpRoutersPeers",
  "pubsubPeers",
];

const getPeerCount = (peersName) => {
  const peersMap = new Map();
  for (const { address: communityAddress } of monitorState.communitiesMonitoring || []) {
    for (const peer of monitorState.communities[communityAddress][peersName] || []) {
      peersMap.set(peer.ID || peer, peer); // peer can be an object or string
    }
  }
  return peersMap.size;
};

const getCountriesPeerCount = (peersName) => {
  const peersMap = new Map();
  for (const { address: communityAddress } of monitorState.communitiesMonitoring || []) {
    for (const peer of monitorState.communities[communityAddress][peersName] || []) {
      peersMap.set(peer.ID || peer, peer); // peer can be an object or string
    }
  }
  const countries = {};
  for (const peer of peersMap.values()) {
    const country = getPeerCountry(peer);
    if (!countries[country]) {
      countries[country] = 0;
    }
    countries[country]++;
  }
  return countries;
};

// prometheus
const countryLabelNames = ["country"];
const locationLabelNames = ["country", "city", "region", "latitude", "longitude"];
const counters = {};
const gauges = {};
const toSnakeCase = (string) => string.replace(/([a-zA-Z])(?=[A-Z])/g, "$1_").toLowerCase();
for (const peersName of peersNames) {
  const peerCountName = `${peersName.replace(/s$/, "")}Count`;
  gauges[`network${peerCountName}`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}network_${toSnakeCase(peerCountName)}`,
    help: `gauge of network ${toSnakeCase(peerCountName).replaceAll("_", " ")} labeled with: ${countryLabelNames.join(", ")}`,
    labelNames: countryLabelNames,
    registers: [prometheus.promClient.register],
    collect() {
      this.reset();
      const countriesPeerCount = getCountriesPeerCount(peersName);
      for (const country in countriesPeerCount) {
        this.set({ country }, countriesPeerCount[country]);
      }
    },
  });

  const peerLocationCountName = `${peersName.replace(/s$/, "")}LocationCount`;
  gauges[`network${peerLocationCountName}`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}network_${toSnakeCase(peerLocationCountName)}`,
    help: `gauge of network ${toSnakeCase(peerLocationCountName).replaceAll("_", " ")} labeled with: ${locationLabelNames.join(", ")}`,
    labelNames: locationLabelNames,
    registers: [prometheus.promClient.register],
    collect() {
      this.reset();
      for (const { count, ...labels } of getLocationsPeerCount(peersName)) {
        this.set(labels, count);
      }
    },
  });
}

// try to load cache from disk on startup
let peerCountries = {};
try {
  peerCountries = JSON.parse(fs.readFileSync("peerCountries.json", "utf8"));
} catch (e) {}

let peerLocations = {};
try {
  peerLocations = JSON.parse(fs.readFileSync("peerLocations.json", "utf8"));
} catch {}

const peerLocationLookupUrl = "https://free.freeipapi.com/api/json";
const failedPeerLocationLookups = new Map();
const pendingPeerLocationLookups = new Map();
const peerLocationFailureCacheMs = 10 * 60 * 1000;

const writePeerLocationCaches = () => {
  fs.writeFileSync("peerCountries.json", JSON.stringify(peerCountries, null, 2));
  fs.writeFileSync("peerLocations.json", JSON.stringify(peerLocations, null, 2));
};

// Peer-ID associations change during metric collection, which runs for every gauge on every scrape,
// so their writes are batched into one.
let peerLocationCachesWriteTimer;
const schedulePeerLocationCachesWrite = () => {
  peerLocationCachesWriteTimer ??= setTimeout(() => {
    peerLocationCachesWriteTimer = undefined;
    writePeerLocationCaches();
  }, 1000);
};

// Results are stored by IP only: the peer-ID association is made by getCachedIpLocation from the IP
// the peer advertises when it is next collected, so a lookup that finishes after the peer moved to
// another address cannot replace its newer location.
const _fetchPeerLocation = async (peerIp) => {
  const location = parsePeerLocation(
    await fetchJson(`${peerLocationLookupUrl}/${encodeURIComponent(peerIp)}`),
  );
  if (!location) {
    throw Error(`failed fetching ip location from ip api`);
  }

  peerLocations[peerIp] = location;
  peerCountries[peerIp] = location.country;
  writePeerLocationCaches();
  return location;
};

// only fetch 1 at a time to not get limited
import PQueue from "p-queue";
const queue = new PQueue({ concurrency: 1 });

const fetchPeerLocation = (peerIp) => {
  const failedAt = failedPeerLocationLookups.get(peerIp);
  if (failedAt && Date.now() - failedAt < peerLocationFailureCacheMs) {
    return;
  }

  if (pendingPeerLocationLookups.has(peerIp)) {
    return pendingPeerLocationLookups.get(peerIp);
  }

  const lookup = queue
    .add(() => _fetchPeerLocation(peerIp))
    .catch((error) => {
      failedPeerLocationLookups.set(peerIp, Date.now());
      debug(error.message);
    })
    .finally(() => pendingPeerLocationLookups.delete(peerIp));
  pendingPeerLocationLookups.set(peerIp, lookup);
  return lookup;
};

// A peer's latest direct address decides where it is, so a cache hit for its IP also replaces the
// location kept under its peer ID, which is what the peer falls back to once it is relay-only.
const getCachedIpLocation = (peer, peerIp) => {
  const location = peerLocations[peerIp];
  if (location && peer.ID && peerLocations[peer.ID] !== location) {
    peerLocations[peer.ID] = location;
    schedulePeerLocationCachesWrite();
  }
  return location;
};

const missingCountryCode = "ZZ";
const getPeerCountry = (peer) => {
  if (typeof peer === "string") {
    if (peerLocations[peer]?.country) {
      return peerLocations[peer].country;
    }
    if (!peerCountries[peer]) {
      return missingCountryCode;
    }
    return peerCountries[peer];
  }

  const peerIp = getPeerIp(peer);
  if (!peerIp) {
    // Same fallback as getPeerLocation, so the country list and the map count the same peers.
    return peerLocations[peer.ID]?.country || missingCountryCode;
  }
  const cachedLocation = getCachedIpLocation(peer, peerIp);
  if (cachedLocation?.country) {
    return cachedLocation.country;
  }

  // Fetch city-level data asynchronously so metric collection is never blocked.
  fetchPeerLocation(peerIp);

  return missingCountryCode;
};

const getPeerLocation = (peer) => {
  if (typeof peer === "string") {
    return peerLocations[peer];
  }

  const peerIp = getPeerIp(peer);
  if (!peerIp) {
    // Located earlier from a direct address of its own (lookups never use relayed addresses).
    return peerLocations[peer.ID];
  }
  const cachedLocation = getCachedIpLocation(peer, peerIp);
  if (cachedLocation) {
    return cachedLocation;
  }
  fetchPeerLocation(peerIp);
};

const getLocationsPeerCount = (peersName) => {
  const peersMap = new Map();
  for (const { address: communityAddress } of monitorState.communitiesMonitoring || []) {
    for (const peer of monitorState.communities[communityAddress][peersName] || []) {
      peersMap.set(peer.ID || peer, peer);
    }
  }

  return countPeerLocations([...peersMap.values()].map(getPeerLocation)).map((location) => ({
    ...location,
    latitude: String(location.latitude),
    longitude: String(location.longitude),
  }));
};

const getPeerCounts = () => {
  const peerCounts = {};
  for (const peersName of peersNames) {
    peerCounts[`${peersName.replace(/s$/, "")}Count`] = getPeerCount(peersName);
    peerCounts[`${peersName.replace(/s$/, "")}CountCountries`] = getCountriesPeerCount(peersName);
  }
  return peerCounts;
};

const peers = { getPeerCounts };
export default peers;

export { getPeerCounts };
