import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

type VercelHeaderRoute = {
  headers?: Record<string, string>;
};

const requiredBlogConnectSources = [
  "https://newsletter.bitsocial.net",
  "https://pubsubprovider.xyz",
  "https://plebpubsub.xyz",
  "https://rannithepleb.com",
  "https://peers.plebpubsub.xyz",
  "https://routing.lol",
  "https://peers.pleb.bot",
  "https://peers.forumindex.com",
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
  "https://91.234.199.189:54667",
  "wss://*.libp2p.direct:45169",
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
});
