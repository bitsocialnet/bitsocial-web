import monitorState from "./monitor-state.js";
import prometheus from "./prometheus.js";
import fs from "fs-extra";
import IP from "ip";
import { multiaddr } from "@multiformats/multiaddr";
import { fetchJson } from "./utils.js";
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
  for (const { address: subplebbitAddress } of monitorState.subplebbitsMonitoring) {
    for (const peer of monitorState.subplebbits[subplebbitAddress][peersName] || []) {
      peersMap.set(peer.ID || peer, peer); // peer can be an object or string
    }
  }
  return peersMap.size;
};

const getCountriesPeerCount = (peersName) => {
  const peersMap = new Map();
  for (const { address: subplebbitAddress } of monitorState.subplebbitsMonitoring) {
    for (const peer of monitorState.subplebbits[subplebbitAddress][peersName] || []) {
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
const labelNames = ["country"];
const counters = {};
const gauges = {};
const toSnakeCase = (string) => string.replace(/([a-zA-Z])(?=[A-Z])/g, "$1_").toLowerCase();
for (const peersName of peersNames) {
  const peerCountName = `${peersName.replace(/s$/, "")}Count`;
  gauges[`plebbit${peerCountName}`] = new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}network_${toSnakeCase(peerCountName)}`,
    help: `gauge of network ${toSnakeCase(peerCountName).replaceAll("_", " ")} labeled with: ${labelNames.join(", ")}`,
    labelNames,
    registers: [prometheus.promClient.register],
    collect() {
      const countriesPeerCount = getCountriesPeerCount(peersName);
      for (const country in countriesPeerCount) {
        this.set({ country }, countriesPeerCount[country]);
      }
    },
  });
}

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
      if (!IP.isPrivate(ip)) {
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

const _fetchPeerCountry = async (peerId, peerIp) => {
  const { country } = await fetchJson(`https://api.country.is/${peerIp}`);
  if (typeof country !== "string" || country.length !== 2) {
    throw Error(`failed fetching ip country from ip api`);
  }
  peerCountries[peerId] = country;
  peerCountries[peerIp] = country;
  fs.writeFileSync("peerCountries.json", JSON.stringify(peerCountries, null, 2));
  return country;
};

// only fetch 1 at a time to not get limited
import PQueue from "p-queue";
const queue = new PQueue({ concurrency: 1 });
const fetchPeerCountry = (peerId, peerIp) => queue.add(() => _fetchPeerCountry(peerId, peerIp));

const missingCountryCode = "ZZ";
const getPeerCountry = (peer) => {
  if (typeof peer === "string") {
    if (!peerCountries[peer]) {
      return missingCountryCode;
    }
    return peerCountries[peer];
  }

  const peerIp = getIpFromPeer(peer);
  if (!peerIp) {
    return missingCountryCode;
  }
  if (peerCountries[peerIp]) {
    return peerCountries[peerIp];
  }

  // fetch country code async to not slow down metrics
  fetchPeerCountry(peer.ID, peerIp).catch((e) => debug(e.message));

  return missingCountryCode;
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
