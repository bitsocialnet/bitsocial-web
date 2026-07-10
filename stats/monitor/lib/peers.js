import monitorState from "./monitor-state.js";
import prometheus from "./prometheus.js";
import fs from "fs-extra";
import { Address4, Address6 } from "ip-address";
import { multiaddr } from "@multiformats/multiaddr";
import { fetchJson } from "./utils.js";
import { countPeerLocations, parsePeerLocation } from "./peer-location.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:peers");

const peersNames = [
  "ipnsDhtPeers",
  "ipnsHttpRoutersPeers",
  "ipnsCidHttpRoutersPeers",
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

const privateIpv4Ranges = [
  new Address4("10.0.0.0/8"),
  new Address4("127.0.0.0/8"),
  new Address4("172.16.0.0/12"),
  new Address4("169.254.0.0/16"),
  new Address4("192.168.0.0/16"),
];
const privateIpv6Ranges = [
  new Address6("::/128"),
  new Address6("::1/128"),
  new Address6("fc00::/7"),
  new Address6("fe80::/10"),
];
const isInAnySubnet = (address, ranges) => ranges.some((range) => address.isInSubnet(range));
const isPrivateIp = (ip) => {
  if (Address4.isValid(ip)) {
    return isInAnySubnet(new Address4(ip), privateIpv4Ranges);
  }
  if (Address6.isValid(ip)) {
    const address = new Address6(ip);
    if (address.address4) {
      return isPrivateIp(address.address4.correctForm());
    }
    return isInAnySubnet(address, privateIpv6Ranges);
  }
  return true;
};

const getIpFromPeer = (peer) => {
  if (!peer.Addrs) {
    return;
  }
  // use the first non private ip
  for (const addr of peer.Addrs) {
    try {
      // nodeAddress().address is unpredictable, not always an ip
      // sometimes '12-144-75-172.k51qzi5uqu5digdd4g1rmh3ircn34nxsehlp9ep60q96fqubc1t2604u88gin4.libp2p.direct'
      const ip = multiaddr(addr).nodeAddress().address;
      if (!isPrivateIp(ip)) {
        return ip;
      }
    } catch (error) {}
  }
};
// console.log(getIpFromPeer({Addrs: ['/dns4/12-144-75-172.k51qzi5uqu5digdd4g1rmh3ircn34nxsehlp9ep60q96fqubc1t2604u88gin4.libp2p.direct/tcp/42743/tls/ws']}))

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

const _fetchPeerLocation = async (peerId, peerIp) => {
  const location = parsePeerLocation(
    await fetchJson(`${peerLocationLookupUrl}/${encodeURIComponent(peerIp)}`),
  );
  if (!location) {
    throw Error(`failed fetching ip location from ip api`);
  }

  if (peerId) {
    peerLocations[peerId] = location;
    peerCountries[peerId] = location.country;
  }
  peerLocations[peerIp] = location;
  peerCountries[peerIp] = location.country;
  writePeerLocationCaches();
  return location;
};

// only fetch 1 at a time to not get limited
import PQueue from "p-queue";
const queue = new PQueue({ concurrency: 1 });

const fetchPeerLocation = (peerId, peerIp) => {
  const failedAt = failedPeerLocationLookups.get(peerIp);
  if (failedAt && Date.now() - failedAt < peerLocationFailureCacheMs) {
    return;
  }

  if (pendingPeerLocationLookups.has(peerIp)) {
    return pendingPeerLocationLookups.get(peerIp);
  }

  const lookup = queue
    .add(() => _fetchPeerLocation(peerId, peerIp))
    .catch((error) => {
      failedPeerLocationLookups.set(peerIp, Date.now());
      debug(error.message);
    })
    .finally(() => pendingPeerLocationLookups.delete(peerIp));
  pendingPeerLocationLookups.set(peerIp, lookup);
  return lookup;
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

  const peerIp = getIpFromPeer(peer);
  if (!peerIp) {
    return missingCountryCode;
  }
  if (peerLocations[peerIp]?.country) {
    return peerLocations[peerIp].country;
  }
  if (peerCountries[peerIp]) {
    return peerCountries[peerIp];
  }

  // Fetch city-level data asynchronously so metric collection is never blocked.
  fetchPeerLocation(peer.ID, peerIp);

  return missingCountryCode;
};

const getPeerLocation = (peer) => {
  if (typeof peer === "string") {
    return peerLocations[peer];
  }

  const peerIp = getIpFromPeer(peer);
  if (!peerIp) {
    return peerLocations[peer.ID];
  }
  const cachedLocation = peerLocations[peerIp];
  if (cachedLocation) {
    return cachedLocation;
  }
  fetchPeerLocation(peer.ID, peerIp);
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
