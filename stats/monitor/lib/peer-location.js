import { Address4, Address6 } from "ip-address";
import { multiaddr } from "@multiformats/multiaddr";

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

/**
 * The first public IP among a provider's direct addresses. A relayed (p2p-circuit) address starts
 * with the relay's address, so its IP locates the relay, not the peer: a peer behind NAT that is
 * reachable only through relays has no IP of its own and is left unlocated.
 */
const getPeerIp = (peer) => {
  for (const addr of peer?.Addrs || []) {
    if (String(addr).includes("/p2p-circuit")) {
      continue;
    }
    try {
      // nodeAddress().address is unpredictable, not always an ip
      // sometimes '12-144-75-172.k51qzi5uqu5digdd4g1rmh3ircn34nxsehlp9ep60q96fqubc1t2604u88gin4.libp2p.direct'
      const ip = multiaddr(addr).nodeAddress().address;
      if (!isPrivateIp(ip)) {
        return ip;
      }
    } catch {}
  }
};

const normalizePlaceName = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : "";

const normalizeCoordinate = (value, min, max) => {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) && coordinate >= min && coordinate <= max
    ? coordinate
    : undefined;
};

const parsePeerLocation = (data) => {
  const country = normalizePlaceName(data?.countryCode).toUpperCase();
  const latitude = normalizeCoordinate(data?.latitude, -85, 85);
  const longitude = normalizeCoordinate(data?.longitude, -180, 180);
  if (!/^[A-Z]{2}$/.test(country) || latitude === undefined || longitude === undefined) {
    return;
  }

  return {
    country,
    city: normalizePlaceName(data?.cityName),
    region: normalizePlaceName(data?.regionName),
    latitude,
    longitude,
  };
};

const countPeerLocations = (locations) => {
  const counts = new Map();
  for (const location of locations) {
    if (!location) {
      continue;
    }
    const key = [
      location.country,
      location.city,
      location.region,
      location.latitude,
      location.longitude,
    ].join("\u0000");
    const entry = counts.get(key) || { ...location, count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  }
  return [...counts.values()];
};

export { countPeerLocations, getPeerIp, parsePeerLocation };
