import assert from "node:assert/strict";
import test from "node:test";
import {
  FIVE_CHAN_BOARDS_KEY,
  FIVE_CHAN_STATS_KEY,
  createFiveChanBoardsSource,
  keepPopularBoardThreads,
} from "./five-chan-boards.mjs";

const fileReader = (files) => async (filePath) => {
  if (!Object.hasOwn(files, filePath)) {
    throw Object.assign(new Error(`ENOENT: no such file, open '${filePath}'`), {
      code: "ENOENT",
    });
  }
  return files[filePath];
};

test("builds the boards and stats documents from the monitor's file, keeping only its known fields", async () => {
  const stats = { statsCid: "QmStats", allPostCount: 3 };
  const boards = [{ address: "a.bso", safeForWork: true, updatedAt: 1, stats, threads: [] }];
  const source = createFiveChanBoardsSource({
    filePath: "/exports/5chan-boards.json",
    readFile: fileReader({
      "/exports/5chan-boards.json": JSON.stringify({
        version: 1,
        generatedAt: 1792500000,
        boards,
        debug: "not part of the API",
      }),
    }),
  });

  const { documents, errors } = await source.documents();
  assert.deepEqual(errors, []);
  assert.deepEqual(documents.get(FIVE_CHAN_BOARDS_KEY), {
    version: 1,
    generatedAt: 1792500000,
    boards,
  });
  assert.deepEqual(documents.get(FIVE_CHAN_STATS_KEY), {
    version: 1,
    generatedAt: 1792500000,
    boards: [{ address: "a.bso", safeForWork: true, updatedAt: 1, stats }],
  });
});

const NOW = 1_792_500_000;
// A board as the monitor writes it, whose one thread scores `replyCount` (it was just replied to).
const boardWithThread = (address, replyCount, safeForWork = true) => ({
  address,
  safeForWork,
  stats: { statsCid: `QmStats-${address}`, allPostCount: replyCount },
  threads: [
    {
      cid: `Qm${address}`,
      raw: {
        comment: { link: `https://example.com/${address}.png`, timestamp: NOW - 3600 },
        commentUpdate: { cid: `Qm${address}`, replyCount, lastReplyTimestamp: NOW },
      },
    },
  ],
});

test("sends threads only for the 20 most popular worksafe boards and the 20 most popular NSFW boards", () => {
  const worksafe = Array.from({ length: 25 }, (_, index) =>
    boardWithThread(`sfw${index}.bso`, index + 1),
  );
  // An undeclared board counts as worksafe, as in 5chan.
  worksafe[0].safeForWork = null;
  const nsfw = Array.from({ length: 3 }, (_, index) =>
    boardWithThread(`nsfw${index}.bso`, 100, false),
  );
  const neverFetched = { address: "new.bso", safeForWork: true, stats: null, threads: [] };
  const boards = [...worksafe, ...nsfw, neverFetched];

  const kept = keepPopularBoardThreads(boards, NOW);

  const withThreads = kept.filter(({ threads }) => threads.length).map(({ address }) => address);
  assert.deepEqual(
    withThreads.sort(),
    [
      ...worksafe.slice(5).map(({ address }) => address),
      ...nsfw.map(({ address }) => address),
    ].sort(),
  );
  // The boards past the cut keep everything but their thread.
  assert.deepEqual(kept[0], { ...worksafe[0], threads: [] });
  assert.equal(kept[24], worksafe[24]);
  assert.deepEqual(kept.at(-1), neverFetched);
});

test("ranks boards by their thread's 5chan score, not its reply count alone", () => {
  const recent = boardWithThread("recent.bso", 5);
  const stale = boardWithThread("stale.bso", 6);
  stale.threads[0].raw.commentUpdate.lastReplyTimestamp = NOW - 30 * 24 * 3600;
  const others = Array.from({ length: 19 }, (_, index) => boardWithThread(`b${index}.bso`, 10));

  const kept = keepPopularBoardThreads([stale, recent, ...others], NOW);
  assert.deepEqual(kept[0].threads, []);
  assert.equal(kept[1], recent);
});

test("reports an unreadable file once and builds nothing from it", async () => {
  const files = {};
  const source = createFiveChanBoardsSource({
    filePath: "/exports/5chan-boards.json",
    readFile: fileReader(files),
  });

  const first = await source.documents();
  assert.equal(first.documents.size, 0);
  assert.match(first.errors[0], /cannot read \/exports\/5chan-boards\.json: ENOENT/);
  assert.deepEqual((await source.documents()).errors, []);

  for (const body of ["{", JSON.stringify({ version: 2, generatedAt: 1, boards: [] })]) {
    files["/exports/5chan-boards.json"] = body;
    const { documents, errors } = await source.documents();
    assert.equal(documents.size, 0);
    assert.equal(errors.length, 1);
  }
});
