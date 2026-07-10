import assert from "node:assert/strict";
import test from "node:test";
import { countPeerLocations, parsePeerLocation } from "./peer-location.js";

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
