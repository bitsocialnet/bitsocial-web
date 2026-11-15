import assert from "node:assert/strict";
import test from "node:test";
import { countPeerLocations, getPeerIp, parsePeerLocation } from "./peer-location.js";

test("parsePeerLocation normalizes city-level GeoIP data", () => {
  assert.deepEqual(
    parsePeerLocation({
      cityName: " Haarlem ",
      countryCode: "nl",
      latitude: 52.3874,
      longitude: 4.64622,
      regionName: "North Holland",
    }),
    {
      city: "Haarlem",
      country: "NL",
      latitude: 52.3874,
      longitude: 4.64622,
      region: "North Holland",
    },
  );
});

test("parsePeerLocation rejects invalid or incomplete coordinates", () => {
  assert.equal(
    parsePeerLocation({ countryCode: "NL", latitude: 95, longitude: 4.64622 }),
    undefined,
  );
  assert.equal(parsePeerLocation({ countryCode: "NL", latitude: 52.3874 }), undefined);
});

test("countPeerLocations reports the count for each reported city location", () => {
  const haarlem = {
    city: "Haarlem",
    country: "NL",
    latitude: 52.3874,
    longitude: 4.64622,
    region: "North Holland",
  };
  const daNang = {
    city: "Da Nang",
    country: "VN",
    latitude: 16.0678,
    longitude: 108.221,
    region: "Da Nang City",
  };

  assert.deepEqual(countPeerLocations([haarlem, haarlem, daNang, undefined]), [
    { ...haarlem, count: 2 },
    { ...daNang, count: 1 },
  ]);
});

test("getPeerIp skips relayed addresses, whose IP belongs to the relay", () => {
  const relayOnly = {
    ID: "12D3KooWNatPeer",
    Addrs: [
      "/ip4/65.109.84.173/tcp/4001/p2p/12D3KooWRelayA/p2p-circuit",
      "/ip4/65.109.84.173/udp/4001/quic-v1/p2p/12D3KooWRelayA/p2p-circuit",
      "/ip6/2a01:4f9:c010:1::1/tcp/4001/p2p/12D3KooWRelayB/p2p-circuit/p2p/12D3KooWNatPeer",
    ],
  };
  assert.equal(getPeerIp(relayOnly), undefined);

  assert.equal(
    getPeerIp({
      ID: "12D3KooWDirectPeer",
      Addrs: [
        "/ip4/65.109.84.173/tcp/4001/p2p/12D3KooWRelayA/p2p-circuit",
        "/ip4/192.168.1.20/tcp/4001",
        "/ip4/203.0.113.7/tcp/4001",
      ],
    }),
    "203.0.113.7",
  );
});

test("getPeerIp ignores private addresses and peers without addresses", () => {
  assert.equal(
    getPeerIp({ ID: "a", Addrs: ["/ip4/10.0.0.5/tcp/4001", "/ip6/::1/tcp/4001"] }),
    undefined,
  );
  assert.equal(getPeerIp({ ID: "b", Addrs: null }), undefined);
  assert.equal(getPeerIp({ ID: "c" }), undefined);
});
