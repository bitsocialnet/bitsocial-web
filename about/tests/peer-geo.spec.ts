import { expect, test } from "@playwright/test";
import { extractIpFromAddress, fetchOwnPublicEndpoint } from "../src/lib/peer-geo";

test("own public endpoint does not fall back to a coarse peer country flag", async ({
  browserName,
}) => {
  test.skip(browserName !== "chromium", "one project is enough for this module-cache check");

  const calls: string[] = [];
  const originalFetch = globalThis.fetch;
  const fetchMock: typeof fetch = async (input) => {
    const requestUrl = String(input);
    calls.push(requestUrl);

    if (requestUrl === "https://api.ipify.org?format=json") {
      return new Response(JSON.stringify({ ip: "58.186.196.85" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      requestUrl === "https://api.country.is/58.186.196.85" ||
      requestUrl === "https://free.freeipapi.com/api/json/58.186.196.85"
    ) {
      return new Response("{}", { status: 503 });
    }

    throw new Error(`Unexpected lookup URL: ${requestUrl}`);
  };
  globalThis.fetch = fetchMock;

  try {
    const endpoint = await fetchOwnPublicEndpoint();

    expect(endpoint?.ip).toBe("58.186.196.85");
    expect(endpoint?.countryCode).toBeUndefined();
    expect(endpoint?.location).toBeUndefined();
    expect(calls).toEqual([
      "https://api.ipify.org?format=json",
      "https://api.country.is/58.186.196.85",
      "https://free.freeipapi.com/api/json/58.186.196.85",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("retries own endpoint enrichment after a transient GeoIP failure", async ({ browserName }) => {
  test.skip(browserName !== "chromium", "one project is enough for this module-cache check");

  let enrichmentAttempt = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const requestUrl = String(input);
    if (requestUrl === "https://api.ipify.org?format=json") {
      return new Response(JSON.stringify({ ip: "8.8.8.8" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    if (
      requestUrl === "https://api.country.is/8.8.8.8" ||
      requestUrl === "https://free.freeipapi.com/api/json/8.8.8.8"
    ) {
      enrichmentAttempt++;
      if (enrichmentAttempt <= 2) return new Response("{}", { status: 503 });
      if (requestUrl.startsWith("https://api.country.is/")) {
        return new Response(JSON.stringify({ ip: "8.8.8.8", country: "US" }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({
          countryCode: "US",
          latitude: 37.0902,
          longitude: -95.7129,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }
    throw new Error(`Unexpected lookup URL: ${requestUrl}`);
  };

  try {
    const first = await fetchOwnPublicEndpoint();
    const second = await fetchOwnPublicEndpoint();

    expect(first).toMatchObject({ ip: "8.8.8.8" });
    expect(first?.countryCode).toBeUndefined();
    expect(first?.location).toBeUndefined();
    expect(second?.countryCode).toBe("us");
    expect(second?.location).toMatchObject({ countryCode: "us" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("extracts embedded IPv6 addresses from DNS6 relay hostnames", ({ browserName }) => {
  test.skip(browserName !== "chromium", "one project is enough for this module test");

  expect(
    extractIpFromAddress(
      "/dns6/2a11-6100-0-5e9f--0.k51qzi5uqu5djg5pdoi9a98.example/tcp/443/ws/p2p/relay-peer/p2p-circuit/p2p/12D3KooWIPv6Peer",
    ),
  ).toBe("2a11:6100:0:5e9f::0");
});
