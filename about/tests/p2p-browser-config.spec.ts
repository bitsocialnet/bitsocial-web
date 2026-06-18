import { expect, test } from "@playwright/test";
import {
  configureP2PBrowserPkcOptions,
  getBrowserGatewayPkcOptions,
  getPureP2PBrowserPreference,
  PURE_P2P_BROWSER_SETTING_KEY,
  setPureP2PBrowserPreference,
  shouldUsePureP2PBrowser,
  type P2PBrowserConfigWindow,
} from "../src/lib/p2p-browser-config";
import {
  getBrowserGatewayAccountOptions,
  getBrowserPureP2PAccountOptions,
  getP2PRuntimeMode,
  isBrowserPureP2PEnabled,
  shouldDowngradeBrowserPureP2PAccount,
  shouldUpgradeBrowserPureP2PAccount,
} from "../src/lib/p2p-runtime";
import {
  BLOG_BITSOCIAL_SEEDER_MULTIADDRS,
  BLOG_BITSOCIAL_SEEDER_PEER_ID,
} from "../src/lib/p2p-seeder-dial";

const createStorage = (values: Record<string, string | undefined> = {}) => ({
  getItem: (key: string) => values[key] ?? null,
  setItem: (key: string, value: string) => {
    values[key] = value;
  },
});

test.describe("browser P2P config", () => {
  test("configures pure browser PKC options by default", ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    const chainProviders = {
      eth: { chainId: 1, urls: ["https://eth.example"] },
    };
    const targetWindow: P2PBrowserConfigWindow = {
      localStorage: createStorage(),
      defaultPkcOptions: {
        chainProviders,
        ipfsGatewayUrls: ["https://gateway.example"],
      },
    };

    expect(shouldUsePureP2PBrowser(targetWindow)).toBe(true);
    expect(configureP2PBrowserPkcOptions(targetWindow)).toBe(true);
    expect(targetWindow.defaultPkcOptions).toMatchObject({
      chainProviders,
      httpRoutersOptions: [
        "https://peers.plebpubsub.xyz",
        "https://routing.lol",
        "https://peers.pleb.bot",
        "https://peers.forumindex.com",
      ],
      ipfsGatewayUrls: undefined,
      libp2pJsClientsOptions: [{ key: "libp2pjs" }],
      pubsubKuboRpcClientsOptions: undefined,
    });
  });

  test("defines direct-dial addresses for the blog seeder", ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    expect(BLOG_BITSOCIAL_SEEDER_MULTIADDRS).toEqual(
      expect.arrayContaining([expect.stringContaining(`/p2p/${BLOG_BITSOCIAL_SEEDER_PEER_ID}`)]),
    );
  });

  test("configures gateway options when pure P2P is disabled", ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    const targetWindow: P2PBrowserConfigWindow = {
      localStorage: createStorage({ [PURE_P2P_BROWSER_SETTING_KEY]: "false" }),
      defaultPkcOptions: {
        chainProviders: {
          eth: { chainId: 1, urls: ["https://eth.example"] },
        },
      },
    };

    expect(shouldUsePureP2PBrowser(targetWindow)).toBe(false);
    expect(configureP2PBrowserPkcOptions(targetWindow)).toBe(false);
    expect(targetWindow.defaultPkcOptions).toEqual({
      chainProviders: {
        eth: { chainId: 1, urls: ["https://eth.example"] },
      },
      ...getBrowserGatewayPkcOptions(),
    });
  });

  test("persists the browser pure P2P preference", ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    const targetWindow: P2PBrowserConfigWindow = {
      localStorage: createStorage(),
    };

    expect(getPureP2PBrowserPreference(targetWindow)).toBeUndefined();
    setPureP2PBrowserPreference(false, targetWindow);
    expect(getPureP2PBrowserPreference(targetWindow)).toBe(false);
    setPureP2PBrowserPreference(true, targetWindow);
    expect(getPureP2PBrowserPreference(targetWindow)).toBe(true);
  });
});

test.describe("browser P2P runtime", () => {
  const browserWindow: P2PBrowserConfigWindow = {
    isElectron: false,
    localStorage: createStorage(),
  };
  const disabledBrowserWindow: P2PBrowserConfigWindow = {
    isElectron: false,
    localStorage: createStorage({ [PURE_P2P_BROWSER_SETTING_KEY]: "false" }),
  };
  const electronWindow: P2PBrowserConfigWindow = {
    electronApi: { isElectron: true },
    isElectron: true,
  };

  test("detects browser, full-node, and electron runtime modes", ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    expect(
      getP2PRuntimeMode(
        { pkcOptions: { libp2pJsClientsOptions: [{ key: "libp2pjs" }] } },
        browserWindow,
      ),
    ).toBe("browser-libp2p");
    expect(
      getP2PRuntimeMode(
        { pkcOptions: { pkcRpcClientsOptions: ["ws://node.example"] } },
        browserWindow,
      ),
    ).toBe("full-node-rpc");
    expect(
      getP2PRuntimeMode(
        { pkcOptions: { pkcRpcClientsOptions: ["ws://node.example"] } },
        electronWindow,
      ),
    ).toBe("electron-kubo-rpc");
  });

  test("upgrades stale gateway browser accounts when pure P2P is enabled", ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    const gatewayAccount = { pkcOptions: { ipfsGatewayUrls: ["https://gateway.example"] } };
    const browserAccount = { pkcOptions: { libp2pJsClientsOptions: [{ key: "libp2pjs" }] } };
    const mixedBrowserAccount = {
      pkcOptions: {
        libp2pJsClientsOptions: [{ key: "libp2pjs" }],
        pubsubKuboRpcClientsOptions: ["https://pubsub.example/api/v0"],
      },
    };
    const fullNodeAccount = { pkcOptions: { pkcRpcClientsOptions: ["ws://node.example"] } };

    expect(shouldUpgradeBrowserPureP2PAccount(gatewayAccount, browserWindow)).toBe(true);
    expect(shouldUpgradeBrowserPureP2PAccount(browserAccount, browserWindow)).toBe(false);
    expect(shouldUpgradeBrowserPureP2PAccount(mixedBrowserAccount, browserWindow)).toBe(true);
    expect(shouldUpgradeBrowserPureP2PAccount(fullNodeAccount, browserWindow)).toBe(false);
    expect(shouldUpgradeBrowserPureP2PAccount(gatewayAccount, disabledBrowserWindow)).toBe(false);
    expect(shouldUpgradeBrowserPureP2PAccount(gatewayAccount, electronWindow)).toBe(false);
  });

  test("downgrades browser accounts when pure P2P is explicitly disabled", ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    const gatewayAccount = { pkcOptions: { ipfsGatewayUrls: ["https://gateway.example"] } };
    const browserAccount = { pkcOptions: { libp2pJsClientsOptions: [{ key: "libp2pjs" }] } };

    expect(isBrowserPureP2PEnabled(browserAccount, disabledBrowserWindow)).toBe(false);
    expect(shouldUpgradeBrowserPureP2PAccount(browserAccount, disabledBrowserWindow)).toBe(false);
    expect(shouldDowngradeBrowserPureP2PAccount(browserAccount, disabledBrowserWindow)).toBe(true);
    expect(shouldDowngradeBrowserPureP2PAccount(gatewayAccount, disabledBrowserWindow)).toBe(false);
    expect(shouldDowngradeBrowserPureP2PAccount(browserAccount, browserWindow)).toBe(false);

    expect(getBrowserGatewayAccountOptions(browserAccount)).toMatchObject({
      ipfsGatewayUrls: [
        "https://ipfsgateway.xyz",
        "https://gateway.plebpubsub.xyz",
        "https://gateway.forumindex.com",
      ],
      libp2pJsClientsOptions: undefined,
      pubsubKuboRpcClientsOptions: [
        "https://pubsubprovider.xyz/api/v0",
        "https://plebpubsub.xyz/api/v0",
        "https://rannithepleb.com/api/v0",
      ],
    });
  });

  test("builds pure P2P and gateway account options from an existing account", ({
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    const account = {
      pkcOptions: {
        httpRoutersOptions: ["https://custom-router.example"],
        ipfsGatewayUrls: ["https://gateway.example"],
        pkcRpcClientsOptions: ["ws://remote.example"],
      },
    };

    expect(isBrowserPureP2PEnabled(account, browserWindow)).toBe(true);
    expect(getBrowserPureP2PAccountOptions(account)).toMatchObject({
      ipfsGatewayUrls: undefined,
      libp2pJsClientsOptions: [{ key: "libp2pjs" }],
      pkcRpcClientsOptions: undefined,
      pubsubKuboRpcClientsOptions: undefined,
    });
    expect(getBrowserGatewayAccountOptions(account)).toMatchObject({
      httpRoutersOptions: ["https://custom-router.example"],
      ipfsGatewayUrls: ["https://gateway.example"],
      libp2pJsClientsOptions: undefined,
      pkcRpcClientsOptions: undefined,
      pubsubKuboRpcClientsOptions: [
        "https://pubsubprovider.xyz/api/v0",
        "https://plebpubsub.xyz/api/v0",
        "https://rannithepleb.com/api/v0",
      ],
    });
  });
});
