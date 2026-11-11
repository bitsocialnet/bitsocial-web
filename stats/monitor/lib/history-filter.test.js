import assert from "node:assert/strict";
import test from "node:test";
import { filterHistoryStats } from "./history-filter.js";

const createSnapshot = () => ({
  network: { communityCount: 2 },
  communities: { "a.bso": { lastCommunityUpdateTimestamp: 1 } },
  ipfsGateways: { "https://gateway.example": { lastCommentFetchSuccess: true } },
});

test("include picks top-level keys without changing the cached snapshot", () => {
  const cachedSnapshot = createSnapshot();

  assert.deepEqual(filterHistoryStats(cachedSnapshot, { include: ["network"] }), {
    network: { communityCount: 2 },
  });
  assert.deepEqual(cachedSnapshot, createSnapshot());

  // a later request for the same cached snapshot still finds every key
  assert.deepEqual(
    filterHistoryStats(cachedSnapshot, { ipfsGatewayUrl: "https://gateway.example" }),
    { ipfsGateways: { "https://gateway.example": { lastCommentFetchSuccess: true } } },
  );
});

test("filters by gateway and community, then by include", () => {
  const snapshot = createSnapshot();
  assert.deepEqual(
    filterHistoryStats(snapshot, {
      ipfsGatewayUrl: "https://gateway.example",
      communityAddress: "a.bso",
      include: ["communities"],
    }),
    { communities: { "a.bso": { lastCommunityUpdateTimestamp: 1 } } },
  );
  assert.deepEqual(filterHistoryStats(snapshot, {}), createSnapshot());
});
