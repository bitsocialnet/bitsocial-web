import test from "node:test";
import assert from "node:assert/strict";
import { normalizeDirectory } from "./client-sources.js";

test("preserves both the community name and public key", async () => {
  assert.deepEqual(
    await normalizeDirectory(
      "5chan",
      {
        name: "animals-and-nature.bso",
        publicKey: "12D3KooWSpKszPM2c17KBgbnoRrkWPCHJosGGFg3bKnzarYhHeSc",
        title: "/an/ - Animals & Nature",
        directoryCode: "an",
      },
      async () => "12D3KooWSpKszPM2c17KBgbnoRrkWPCHJosGGFg3bKnzarYhHeSc",
    ),
    {
      address: "animals-and-nature.bso",
      communityAddress: "animals-and-nature.bso",
      name: "animals-and-nature.bso",
      publicKey: "12D3KooWSpKszPM2c17KBgbnoRrkWPCHJosGGFg3bKnzarYhHeSc",
      title: "/an/ - Animals & Nature",
      directoryCode: "an",
      clientId: "5chan",
      resolutionError: undefined,
    },
  );
});

test("keeps monitoring by community public key when BSO resolution fails", async () => {
  const community = await normalizeDirectory(
    "5chan",
    {
      name: "animals-and-nature.bso",
      publicKey: "12D3KooWSpKszPM2c17KBgbnoRrkWPCHJosGGFg3bKnzarYhHeSc",
    },
    async () => {
      throw Error("provider unavailable");
    },
  );

  assert.equal(community.publicKey, "12D3KooWSpKszPM2c17KBgbnoRrkWPCHJosGGFg3bKnzarYhHeSc");
  assert.equal(community.resolutionError, "provider unavailable");
});
