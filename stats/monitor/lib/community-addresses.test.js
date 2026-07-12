import test from "node:test";
import assert from "node:assert/strict";
import { resolveCommunityTargetAddress } from "./community-addresses.js";

test("resolves BSO names through the bitsocial text record", async () => {
  const resolvers = [
    {
      provider: "first",
      resolve: async () => {
        throw Error("unavailable");
      },
    },
    {
      provider: "second",
      resolve: async ({ name }) => {
        assert.equal(name, "animals-and-nature.bso");
        return { publicKey: "12D3KooWSpKszPM2c17KBgbnoRrkWPCHJosGGFg3bKnzarYhHeSc" };
      },
    },
  ];

  assert.equal(
    await resolveCommunityTargetAddress("animals-and-nature.bso", resolvers),
    "12D3KooWSpKszPM2c17KBgbnoRrkWPCHJosGGFg3bKnzarYhHeSc",
  );
});

test("leaves IPNS public keys unchanged", async () => {
  assert.equal(
    await resolveCommunityTargetAddress("12D3KooWSpKszPM2c17KBgbnoRrkWPCHJosGGFg3bKnzarYhHeSc", []),
    "12D3KooWSpKszPM2c17KBgbnoRrkWPCHJosGGFg3bKnzarYhHeSc",
  );
});
