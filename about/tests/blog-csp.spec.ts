import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { DEFAULT_HTTP_ROUTER_URLS } from "../src/lib/p2p-browser-config";

type VercelHeaderRoute = {
  headers?: Record<string, string>;
};

const requiredBlogConnectSources = [
  "https://newsletter.bitsocial.net",
  "https://pubsubprovider.xyz",
  "https://plebpubsub.xyz",
  "https://rannithepleb.com",
  "https://ipfsgateway.xyz",
  "https://gateway.plebpubsub.xyz",
  "https://gateway.forumindex.com",
  "https://ethereum-rpc.publicnode.com",
  "https://ethereum.publicnode.com",
  "https://eth.drpc.org",
  "https://eth-pokt.nodies.app",
  "https://rpc.mevblocker.io",
  "https://1rpc.io",
  "https://api.ipify.org",
  "https://api.country.is",
  "https://free.freeipapi.com",
  // Every tracker pkc-js queries for provider records must be reachable, or
  // seeder discovery silently loses redundancy.
  ...DEFAULT_HTTP_ROUTER_URLS,
  // Seeders advertise AutoTLS WebSocket addresses under libp2p.direct, but
  // their port rotates when the seeder daemon restarts — the CSP must not pin
  // it (a pinned :45169 once blocked every seeder dial in production).
  "wss://*.libp2p.direct:*",
];

const getConnectSources = () => {
  const vercelConfig = JSON.parse(
    readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
  ) as {
    routes?: VercelHeaderRoute[];
  };
  const contentSecurityPolicy = vercelConfig.routes?.[0]?.headers?.["Content-Security-Policy"];

  expect(contentSecurityPolicy).toBeTruthy();

  const connectSrc = contentSecurityPolicy
    ?.split(";")
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith("connect-src "));

  expect(connectSrc).toBeTruthy();

  return new Set(connectSrc?.split(/\s+/).slice(1));
};

test.describe("blog CSP", () => {
  test("allows pure P2P resolver and seeder connections", ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this config test");

    const connectSources = getConnectSources();
    for (const source of requiredBlogConnectSources) {
      expect(connectSources.has(source), `${source} must be allowed by connect-src`).toBe(true);
    }
  });

  test("does not pin seeder ports or addresses that rotate on restart", ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this config test");

    const connectSources = getConnectSources();
    for (const source of connectSources) {
      expect(
        /^wss:\/\/.*:\d+$/.test(source),
        `${source} must not pin a seeder WebSocket port`,
      ).toBe(false);
      expect(
        /^https:\/\/\d+\.\d+\.\d+\.\d+/.test(source),
        `${source} must not pin a seeder IP address`,
      ).toBe(false);
    }
  });
});
