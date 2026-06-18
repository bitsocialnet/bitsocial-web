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

test("extracts embedded IPv6 addresses from DNS6 relay hostnames", ({ browserName }) => {
  test.skip(browserName !== "chromium", "one project is enough for this module test");

  expect(
    extractIpFromAddress(
      "/dns6/2a11-6100-0-5e9f--0.k51qzi5uqu5djg5pdoi9a98.example/tcp/443/ws/p2p/relay-peer/p2p-circuit/p2p/12D3KooWIPv6Peer",
    ),
  ).toBe("2a11:6100:0:5e9f::0");
});
