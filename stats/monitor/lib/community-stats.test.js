import assert from "node:assert/strict";
import { once } from "node:events";
import http from "node:http";
import test from "node:test";
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import { readCommunityStats } from "./community-stats.js";

const rawCodec = 0x55;
// kubo's block put answers with a raw cidv1, while stats cids are cidv0 (dag-pb)
const rawCidOf = async (bytes) => CID.createV1(rawCodec, await sha256.digest(bytes));
const statsCidOf = async (bytes) => CID.createV0(await sha256.digest(bytes));
const stats = { allPostCount: 135, allReplyCount: 170 };
const statsBlock = new TextEncoder().encode(JSON.stringify(stats));

// fake kubo that, like kubo, keys its blockstore by multihash and searches the network for a
// missing block until the request is aborted
const createKubo = (blocks = []) => {
  const store = new Map(blocks.map(([cid, bytes]) => [cid.multihash.toString(), bytes]));
  return {
    async *cat(path, { signal } = {}) {
      const bytes = store.get(CID.parse(path).multihash.toString());
      if (!bytes) {
        await new Promise((resolve, reject) => {
          signal?.addEventListener("abort", () => reject(signal.reason));
        });
      }
      yield bytes;
    },
    block: {
      put: async (bytes) => {
        const cid = await rawCidOf(bytes);
        store.set(cid.multihash.toString(), bytes);
        return cid;
      },
    },
  };
};

const startGateway = async (t, handler) => {
  const requests = [];
  const server = http.createServer((req, res) => {
    requests.push({ url: req.url, accept: req.headers.accept });
    handler(req, res);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => server.close());
  return { url: `http://127.0.0.1:${server.address().port}`, requests };
};

test("reads stats from kubo without asking a gateway", async (t) => {
  const statsCid = await statsCidOf(statsBlock);
  const gateway = await startGateway(t, (req, res) => res.end());
  const result = await readCommunityStats(statsCid.toString(), {
    kubo: createKubo([[statsCid, statsBlock]]),
    ipfsGatewayUrls: [gateway.url],
  });
  assert.deepEqual(result, stats);
  assert.equal(gateway.requests.length, 0);
});

test("falls back to a gateway's raw block when kubo can't read it", async (t) => {
  const statsCid = await statsCidOf(statsBlock);
  const missing = await startGateway(t, (req, res) => {
    res.writeHead(404);
    res.end();
  });
  const gateway = await startGateway(t, (req, res) => res.end(statsBlock));
  const result = await readCommunityStats(statsCid.toString(), {
    kubo: createKubo(),
    ipfsGatewayUrls: [missing.url, gateway.url],
    kuboReadTimeoutMs: 50,
  });
  assert.deepEqual(result, stats);
  assert.deepEqual(gateway.requests, [
    { url: `/ipfs/${statsCid}?format=raw`, accept: "application/vnd.ipld.raw" },
  ]);
});

test("rejects a gateway block that doesn't hash to the stats cid", async (t) => {
  const statsCid = await statsCidOf(statsBlock);
  const gateway = await startGateway(t, (req, res) =>
    res.end(JSON.stringify({ ...stats, allPostCount: 999999 })),
  );
  const logs = [];
  await assert.rejects(
    readCommunityStats(statsCid.toString(), {
      kubo: createKubo(),
      ipfsGatewayUrls: [gateway.url],
      log: (message) => logs.push(message),
      kuboReadTimeoutMs: 50,
    }),
    { name: "TimeoutError" },
  );
  assert.match(logs[0], /got a block with a different hash/);
});
