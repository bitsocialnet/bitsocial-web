import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { build } from "esbuild";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const reportedAddress = "0xe2Eea174e91611Ee38705365C2Fa11f9C31029b1";
const token = { exchange_rate: "0.01", total_supply: "210000000000000000000000000" };
const items = [
  {
    address: { hash: reportedAddress, is_contract: true, proxy_type: "eip7702" },
    value: "4000000000000000000",
  },
  {
    address: { hash: "0x0000000000000000000000000000000000000002", is_contract: true },
    value: "3000000000000000000",
  },
  {
    address: {
      hash: "0x0000000000000000000000000000000000000003",
      is_contract: true,
      proxy_type: "master_copy",
    },
    value: "2000000000000000000",
  },
  {
    address: { hash: "0x0000000000000000000000000000000000000004", is_contract: false },
    value: "1000000000000000000",
  },
  {
    address: { hash: "0x0000000000000000000000000000000000000005", proxy_type: null },
    value: "500000000000000000",
  },
];
const expectedHolders = items.map((item, index) => ({
  address: item.address.hash,
  balance: [4, 3, 2, 1, 0.5][index],
  isContract: [false, true, true, false, false][index],
}));

function responseFor(url) {
  const { pathname, searchParams } = new URL(url);
  if (pathname.endsWith("/holders")) {
    return searchParams.has("page")
      ? { items: items.slice(2), next_page_params: null }
      : { items: items.slice(0, 2), next_page_params: { page: 2 } };
  }
  return token;
}

test("live holders treat EIP-7702 delegated wallets as holders and keep contracts tagged", async (t) => {
  const { outputFiles } = await build({
    entryPoints: [path.join(repoRoot, "chain/src/lib/rich-list/live.ts")],
    alias: { "@": path.join(repoRoot, "chain/src") },
    bundle: true,
    write: false,
    platform: "node",
    format: "esm",
  });
  const { fetchLiveSnapshot } = await import(
    `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString("base64")}`
  );
  const controller = new AbortController();
  let requests = 0;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(options.signal, controller.signal);
    requests += 1;
    return new Response(JSON.stringify(responseFor(url)));
  });

  const snapshot = await fetchLiveSnapshot(controller.signal);
  assert.deepEqual(snapshot.holders, expectedHolders);
  assert.equal(snapshot.holderCount, items.length);
  assert.equal(snapshot.priceUsd, 0.01);
  assert.equal(snapshot.totalSupply, 210000000);
  assert.equal(requests, 3);
});

test("snapshot generation uses the same delegated-wallet classification across pages", async (t) => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "bitsocial-holders-"));
  t.after(() => rm(fixture, { recursive: true, force: true }));
  await mkdir(path.join(fixture, "scripts"), { recursive: true });
  await mkdir(path.join(fixture, "chain/src/lib"), { recursive: true });
  await cp(
    path.join(repoRoot, "scripts/generate-bso-holders.mjs"),
    path.join(fixture, "scripts/generate-bso-holders.mjs"),
  );
  await cp(
    path.join(repoRoot, "chain/src/lib/site.ts"),
    path.join(fixture, "chain/src/lib/site.ts"),
  );

  const server = createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify(responseFor(`http://localhost${request.url}`)));
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  await promisify(execFile)(
    process.execPath,
    [path.join(fixture, "scripts/generate-bso-holders.mjs")],
    {
      env: { ...process.env, BLOCKSCOUT_API: `http://127.0.0.1:${server.address().port}/api/v2` },
      timeout: 10000,
    },
  );

  const snapshot = JSON.parse(
    await readFile(path.join(fixture, "chain/src/data/bso-holders.json"), "utf8"),
  );
  assert.deepEqual(snapshot.holders, expectedHolders);
  assert.equal(snapshot.holderCount, items.length);
  assert.equal(snapshot.priceUsd, 0.01);
  assert.equal(snapshot.totalSupply, 210000000);
});

test("the committed fallback snapshot does not tag the reported delegated wallet as a contract", async () => {
  const snapshot = JSON.parse(
    await readFile(path.join(repoRoot, "chain/src/data/bso-holders.json"), "utf8"),
  );
  const holder = snapshot.holders.find((entry) => entry.address === reportedAddress);
  assert.ok(holder, "the reported holder must be present in the fallback snapshot");
  assert.equal(holder.isContract, false);
});
