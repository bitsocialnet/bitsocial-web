import { expect, test } from "@playwright/test";
import {
  getBlogP2PStats,
  type ConnectedPeersStatRow,
  type StatRow,
} from "../src/lib/blog-p2p-stats";

const createAbortedSignal = () => {
  const controller = new AbortController();
  controller.abort();
  return controller.signal;
};

const createBrowserAccount = (client: unknown) => ({
  pkc: {
    clients: {
      libp2pJsClients: {
        libp2pjs: client,
      },
    },
  },
});

const createBrowserAccountWithClients = (clients: Record<string, unknown>) => ({
  pkc: {
    clients: {
      libp2pJsClients: clients,
    },
  },
});

const getTextRowValue = (rows: StatRow[], name: string) => {
  const row = rows.find((entry) => entry.name === name && entry.type !== "connectedPeers");
  return row && "value" in row ? row.value : undefined;
};

const getConnectedPeersRow = (rows: StatRow[]) =>
  rows.find((row): row is ConnectedPeersStatRow => row.type === "connectedPeers");

test.describe("blog P2P stats", () => {
  test("reads 5chan-shaped browser transfer metrics", async ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    const peerId = "12D3KooWPeerWithMetrics";
    const connection = {
      remotePeer: { toString: () => peerId },
      remoteAddr: {
        toString: () => `/ip4/91.234.199.189/tcp/45169/tls/ws/p2p/${peerId}`,
      },
      streams: [],
    };
    const client = {
      _helia: {
        libp2p: {
          peerId: { toString: () => "12D3KooWSelf" },
          getPeers: () => [peerId],
          getConnections: () => [connection],
          metrics: {
            toJSON: () => ({
              helia_bitswap_data_received_bytes: {
                global: 256,
                [peerId]: 128,
              },
              helia_bitswap_data_sent_bytes: {
                global: 512,
                [peerId]: 64,
              },
            }),
          },
        },
      },
    };

    const rows = await getBlogP2PStats(createBrowserAccount(client), createAbortedSignal());
    const connectedPeers = getConnectedPeersRow(rows);

    expect(getTextRowValue(rows, "Data received")).toBe("256 B");
    expect(getTextRowValue(rows, "Data sent")).toBe("512 B");
    expect(connectedPeers?.entries[0]).toMatchObject({
      peerId,
      transport: "Secure WebSocket",
      transferStats: {
        downloadedBytes: 128,
        uploadedBytes: 64,
      },
    });
  });

  test("reports zero transfer bytes when counters are not exposed yet", async ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    const peerId = "12D3KooWPeerWithoutMetrics";
    const connection = {
      remotePeer: { toString: () => peerId },
      remoteAddr: {
        toString: () => `/ip4/10.0.0.2/tcp/45169/tls/ws/p2p/${peerId}`,
      },
      streams: [],
    };
    const client = {
      _helia: {
        libp2p: {
          peerId: { toString: () => "12D3KooWSelf" },
          getPeers: () => [peerId],
          getConnections: () => [connection],
        },
      },
    };

    const rows = await getBlogP2PStats(createBrowserAccount(client), createAbortedSignal());
    const connectedPeers = getConnectedPeersRow(rows);

    expect(getTextRowValue(rows, "Data received")).toBe("0 B");
    expect(getTextRowValue(rows, "Data sent")).toBe("0 B");
    expect(connectedPeers?.entries[0]?.transferStats).toEqual({
      downloadedBytes: 0,
      uploadedBytes: 0,
    });
  });

  test("uses the first live libp2p client instead of the first client entry", async ({
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    const peerId = "12D3KooWLiveClientPeer";
    const liveClient = {
      _helia: {
        libp2p: {
          peerId: { toString: () => peerId },
          getPeers: () => [],
          getConnections: () => [],
        },
      },
    };

    const rows = await getBlogP2PStats(
      createBrowserAccountWithClients({
        stale: {},
        live: liveClient,
      }),
      createAbortedSignal(),
    );

    expect(getTextRowValue(rows, "Peer ID")).toBe(peerId);
  });

  test("does not wait for seeder dials before reading stats", async ({ browserName }) => {
    test.skip(browserName !== "chromium", "one project is enough for this module test");

    let dialStarted = false;
    const client = {
      _helia: {
        libp2p: {
          peerId: { toString: () => "12D3KooWSelf" },
          getPeers: () => [],
          getConnections: () => [],
          dial: () =>
            new Promise((resolve) => {
              dialStarted = true;
              setTimeout(resolve, 250);
            }),
        },
      },
    };

    const result = await Promise.race([
      getBlogP2PStats(createBrowserAccount(client), createAbortedSignal()),
      new Promise<"timeout">((resolve) => {
        setTimeout(() => resolve("timeout"), 50);
      }),
    ]);

    expect(result).not.toBe("timeout");
    expect(dialStarted).toBe(true);
    expect(getTextRowValue(result as StatRow[], "Peer ID")).toBe("12D3KooWSelf");
  });
});
