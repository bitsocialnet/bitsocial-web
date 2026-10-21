import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  createFiveChanBoards,
  getPopularThreadCandidates,
  isMediaThread,
  pickPopularThreads,
  popularityScore,
} from "./five-chan-boards.js";

const NOW = 1_792_500_000;
const HOUR = 3600;

let cidCounter = 0;
// A hot-page entry shaped like pkc-js publishes it, with fields the monitor must pass through.
const pageEntry = ({ comment = {}, commentUpdate = {} } = {}) => {
  cidCounter += 1;
  const cid = `QmThread${cidCounter}`;
  return {
    comment: {
      communityPublicKey: "12D3KooWBoard",
      timestamp: NOW - 10 * HOUR,
      title: `thread ${cidCounter}`,
      content: 'ünïcödé   "quoted" <b>',
      link: `https://example.com/${cidCounter}.png`,
      linkWidth: 640,
      linkHeight: 480,
      author: { address: "author.bso", displayName: null, wallets: {} },
      signature: {
        type: "ed25519",
        publicKey: "authorKey",
        signature: `sig${cidCounter}`,
        signedPropertyNames: ["content", "link", "timestamp", "title"],
      },
      protocolVersion: "1.0.0",
      ...comment,
    },
    commentUpdate: {
      cid,
      upvoteCount: 0,
      downvoteCount: 0,
      replyCount: 0,
      updatedAt: NOW - HOUR,
      replies: { pages: {} },
      signature: { type: "ed25519", publicKey: "boardKey", signature: `upd${cidCounter}` },
      protocolVersion: "1.0.0",
      ...commentUpdate,
    },
  };
};

const communityRecord = (comments, fields = {}) => ({
  address: "anime-and-manga.bso",
  updatedAt: NOW - 120,
  statsCid: "QmStats",
  posts: { pages: { active: { comments, nextCid: "QmNext" } } },
  ...fields,
});

const board = (address, fields = {}) => ({
  address,
  publicKey: `12D3KooW${address}`,
  directoryCode: address.slice(0, 1),
  safeForWork: true,
  clientId: "5chan",
  ...fields,
});

test("scores threads like the 5chan home page", () => {
  const fresh = pageEntry({ commentUpdate: { replyCount: 6, lastReplyTimestamp: NOW } });
  assert.equal(popularityScore(fresh, NOW), 6);
  const threeDaysOld = pageEntry({
    comment: { timestamp: NOW - 72 * HOUR },
    commentUpdate: { replyCount: 6 },
  });
  assert.equal(popularityScore(threeDaysOld, NOW), 3);
  // No replies still counts as 0.1, and the future never counts as negative age.
  const noReplies = pageEntry({ comment: { timestamp: NOW + HOUR } });
  assert.equal(popularityScore(noReplies, NOW), 0.1);
  const noTimes = pageEntry({ comment: { timestamp: undefined } });
  assert.equal(popularityScore(noTimes, NOW), 0.1 / (1 + NOW / (72 * HOUR)));
});

test("skips pinned, locked, removed, deleted and link-less threads", () => {
  const kept = pageEntry();
  const excluded = [
    pageEntry({ commentUpdate: { pinned: true } }),
    pageEntry({ commentUpdate: { locked: true } }),
    pageEntry({ commentUpdate: { removed: true } }),
    pageEntry({ commentUpdate: { deleted: true } }),
    pageEntry({ commentUpdate: { edit: { deleted: true } } }),
    pageEntry({ comment: { pinned: true } }),
    pageEntry({ comment: { locked: true } }),
    pageEntry({ comment: { removed: true } }),
    pageEntry({ comment: { deleted: true } }),
    pageEntry({ comment: { link: undefined } }),
    pageEntry({ comment: { link: "" } }),
    pageEntry({ commentUpdate: { cid: undefined } }),
    { comment: null, commentUpdate: {} },
    "not an entry",
  ];
  assert.deepEqual(getPopularThreadCandidates(communityRecord([...excluded, kept])), [kept]);
  assert.deepEqual(getPopularThreadCandidates({ posts: { pages: {} } }), []);
  assert.deepEqual(getPopularThreadCandidates({ posts: { pages: { hot: { comments: {} } } } }), []);
});

test("reads the threads of the page the record preloads, whatever its sort", () => {
  // Live 5chan boards preload only `active`, with no `hot` page and no page cids.
  const popular = pageEntry({ commentUpdate: { replyCount: 8, lastReplyTimestamp: NOW } });
  const quiet = pageEntry({ commentUpdate: { replyCount: 1 } });
  const pinned = pageEntry({ commentUpdate: { replyCount: 50, pinned: true } });
  const activeOnly = {
    updatedAt: NOW,
    posts: { pages: { active: { comments: [pinned, quiet, popular] } }, pageCids: {} },
  };
  assert.deepEqual(getPopularThreadCandidates(activeOnly), [quiet, popular]);
  assert.deepEqual(pickPopularThreads(getPopularThreadCandidates(activeOnly), NOW), [
    { cid: popular.commentUpdate.cid, raw: popular },
  ]);

  // Only the first preloaded page counts, like getPreloadedPostSortType in bitsocial-react-hooks.
  const other = pageEntry();
  const twoPages = {
    posts: { pages: { active: { comments: [quiet] }, new: { comments: [other] } } },
  };
  assert.deepEqual(getPopularThreadCandidates(twoPages), [quiet]);

  // No preloaded page means no threads, even when sorts are published as page cids.
  assert.deepEqual(getPopularThreadCandidates({ posts: { pageCids: { active: "QmPage" } } }), []);
  assert.deepEqual(getPopularThreadCandidates({ posts: { pages: {} } }), []);
  assert.deepEqual(getPopularThreadCandidates({}), []);
});

test("keeps the most popular thread with media, else the most popular with any link", () => {
  const plainLink = (fields) =>
    pageEntry({ ...fields, comment: { link: "https://example.com/article", ...fields?.comment } });
  const entries = [
    pageEntry({ commentUpdate: { replyCount: 1, lastReplyTimestamp: NOW } }),
    pageEntry({ commentUpdate: { replyCount: 40, lastReplyTimestamp: NOW - 30 * 24 * HOUR } }),
    pageEntry({ commentUpdate: { replyCount: 5, lastReplyTimestamp: NOW - HOUR } }),
    plainLink({ commentUpdate: { replyCount: 90, lastReplyTimestamp: NOW } }),
    pageEntry({ commentUpdate: { replyCount: 0 } }),
  ];
  // The plain link scores highest, but the best media thread wins.
  assert.deepEqual(
    pickPopularThreads(entries, NOW).map(({ cid }) => cid),
    [entries[2].commentUpdate.cid],
  );

  const plainLinks = [
    plainLink({ commentUpdate: { replyCount: 1 } }),
    plainLink({ commentUpdate: { replyCount: 2 } }),
  ];
  assert.deepEqual(
    pickPopularThreads(plainLinks, NOW).map(({ cid }) => cid),
    [plainLinks[1].commentUpdate.cid],
  );
  assert.deepEqual(pickPopularThreads([], NOW), []);
});

test("recognizes media threads the way 5chan does", () => {
  const thread = (comment) => ({ comment, commentUpdate: {} });
  for (const link of [
    "https://example.com/a.JPG",
    "https://example.com/path/clip.webm?t=1",
    "https://example.com/song.mp3",
    "https://pbs.twimg.com/media/abc?format=png&name=small",
  ]) {
    assert.equal(isMediaThread(thread({ link })), true, link);
  }
  for (const link of [
    "https://example.com/article",
    "https://example.com/page.html",
    "https://example.png.example.com/",
    "not a url",
  ]) {
    assert.equal(isMediaThread(thread({ link })), false, link);
  }
  assert.equal(
    isMediaThread(
      thread({ link: "https://youtu.be/x", thumbnailUrl: "https://i.ytimg.com/a.jpg" }),
    ),
    true,
  );
});

test("passes each thread's comment and update through exactly as published", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "five-chan-boards-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const filePath = path.join(directory, "exports", "5chan-boards.json");
  const fiveChanBoards = createFiveChanBoards({ filePath, now: () => NOW });

  const published = JSON.stringify(
    communityRecord([pageEntry({ commentUpdate: { replyCount: 2, flairs: [{ text: "x" }] } })]),
  );
  // The monitor parses the record it read from kubo, as pkc-js does.
  fiveChanBoards.recordCommunityUpdate(board("anime-and-manga.bso"), JSON.parse(published));
  await fiveChanBoards.write([board("anime-and-manga.bso")]);

  const written = await fs.readFile(filePath, "utf8");
  const [{ threads }] = JSON.parse(written).boards;
  const [{ comment, commentUpdate }] = JSON.parse(published).posts.pages.active.comments;
  assert.equal(threads[0].cid, commentUpdate.cid);
  assert.deepEqual(threads[0].raw, { comment, commentUpdate });
  for (const object of [comment, commentUpdate]) {
    const text = JSON.stringify(object);
    assert.ok(published.includes(text));
    assert.ok(written.includes(text));
  }
  assert.deepEqual(
    (await fs.readdir(path.dirname(filePath))).sort(),
    ["5chan-boards.json"],
    "leaves no temporary file behind",
  );
});

test("lists every 5chan board, including boards never fetched", () => {
  const fiveChanBoards = createFiveChanBoards({ filePath: "unused", now: () => NOW });
  const fetched = board("anime-and-manga.bso");
  const popular = pageEntry({ commentUpdate: { replyCount: 9 } });
  fiveChanBoards.recordCommunityUpdate(fetched, communityRecord([popular]));
  fiveChanBoards.recordCommunityStats(fetched, "QmStats", {
    allPostCount: 123,
    allReplyCount: 456,
    weekActiveUserCount: 7,
    hourPostCount: 0,
    unexpected: "dropped",
    weekPostCount: "not a number",
  });
  // A Seedit community is neither recorded nor listed.
  const seedit = board("seedit.bso", { clientId: "seedit" });
  fiveChanBoards.recordCommunityUpdate(seedit, communityRecord([pageEntry()]));

  assert.deepEqual(
    fiveChanBoards.document([
      fetched,
      board("biz.bso", { publicKey: undefined, safeForWork: undefined }),
      seedit,
    ]),
    {
      version: 1,
      generatedAt: NOW,
      boards: [
        {
          address: "anime-and-manga.bso",
          publicKey: "12D3KooWanime-and-manga.bso",
          directoryCode: "a",
          safeForWork: true,
          updatedAt: NOW - 120,
          stats: {
            statsCid: "QmStats",
            allPostCount: 123,
            allReplyCount: 456,
            weekActiveUserCount: 7,
            hourPostCount: 0,
          },
          threads: [{ cid: popular.commentUpdate.cid, raw: popular }],
        },
        {
          address: "biz.bso",
          publicKey: null,
          directoryCode: "b",
          safeForWork: null,
          updatedAt: null,
          stats: null,
          threads: [],
        },
      ],
    },
  );
});

test("a board keeps its stats when a newer record arrives", () => {
  const fiveChanBoards = createFiveChanBoards({ filePath: "unused", now: () => NOW });
  const fetched = board("anime-and-manga.bso");
  fiveChanBoards.recordCommunityUpdate(fetched, communityRecord([]));
  fiveChanBoards.recordCommunityStats(fetched, "QmStats", { allPostCount: 1 });
  fiveChanBoards.recordCommunityUpdate(fetched, communityRecord([], { updatedAt: NOW }));

  const [entry] = fiveChanBoards.document([fetched]).boards;
  assert.equal(entry.updatedAt, NOW);
  assert.deepEqual(entry.stats, { statsCid: "QmStats", allPostCount: 1 });
});

test("a board drops its stats when a newer record points to other stats", () => {
  const fiveChanBoards = createFiveChanBoards({ filePath: "unused", now: () => NOW });
  const fetched = board("anime-and-manga.bso");
  fiveChanBoards.recordCommunityUpdate(fetched, communityRecord([]));
  fiveChanBoards.recordCommunityStats(fetched, "QmStats", { allPostCount: 1 });
  fiveChanBoards.recordCommunityUpdate(
    fetched,
    communityRecord([], { updatedAt: NOW, statsCid: "QmNewerStats" }),
  );

  let [entry] = fiveChanBoards.document([fetched]).boards;
  assert.equal(entry.stats, null);

  fiveChanBoards.recordCommunityStats(fetched, "QmNewerStats", { allPostCount: 2 });
  [entry] = fiveChanBoards.document([fetched]).boards;
  assert.deepEqual(entry.stats, { statsCid: "QmNewerStats", allPostCount: 2 });
});

test("a board drops its stats when a newer record publishes none", () => {
  const fiveChanBoards = createFiveChanBoards({ filePath: "unused", now: () => NOW });
  const fetched = board("anime-and-manga.bso");
  fiveChanBoards.recordCommunityUpdate(fetched, communityRecord([]));
  fiveChanBoards.recordCommunityStats(fetched, "QmStats", { allPostCount: 1 });
  fiveChanBoards.recordCommunityUpdate(
    fetched,
    communityRecord([], { updatedAt: NOW, statsCid: undefined }),
  );

  const [entry] = fiveChanBoards.document([fetched]).boards;
  assert.equal(entry.updatedAt, NOW);
  assert.equal(entry.stats, null);
});

test("an older record does not replace a newer one, nor its stats", () => {
  const fiveChanBoards = createFiveChanBoards({ filePath: "unused", now: () => NOW });
  const fetched = board("anime-and-manga.bso");
  const newer = pageEntry();
  fiveChanBoards.recordCommunityUpdate(
    fetched,
    communityRecord([newer], { updatedAt: NOW, statsCid: "QmNewStats" }),
  );
  fiveChanBoards.recordCommunityUpdate(
    fetched,
    communityRecord([pageEntry()], { updatedAt: NOW - 600, statsCid: "QmOldStats" }),
  );
  fiveChanBoards.recordCommunityStats(fetched, "QmOldStats", { allPostCount: 1 });

  let [entry] = fiveChanBoards.document([fetched]).boards;
  assert.equal(entry.updatedAt, NOW);
  assert.deepEqual(entry.threads, [{ cid: newer.commentUpdate.cid, raw: newer }]);
  assert.equal(entry.stats, null);

  fiveChanBoards.recordCommunityStats(fetched, "QmNewStats", { allPostCount: 2 });
  [entry] = fiveChanBoards.document([fetched]).boards;
  assert.deepEqual(entry.stats, { statsCid: "QmNewStats", allPostCount: 2 });
});

test("a restarted monitor serves the boards it last wrote until it fetches them again", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "five-chan-boards-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const filePath = path.join(directory, "5chan-boards.json");
  const communities = [board("anime-and-manga.bso"), board("biz.bso")];

  const before = createFiveChanBoards({ filePath, now: () => NOW });
  const threads = [1, 2, 3].map((replyCount) => pageEntry({ commentUpdate: { replyCount } }));
  before.recordCommunityUpdate(communities[0], communityRecord(threads));
  before.recordCommunityStats(communities[0], "QmStats", { allPostCount: 5 });
  await before.write(communities);

  const after = createFiveChanBoards({ filePath, now: () => NOW + 60 });
  await after.load();
  const document = after.document(communities);
  assert.equal(document.generatedAt, NOW + 60);
  assert.deepEqual(document.boards, before.document(communities).boards);

  // A missing, unreadable or other-version file just starts empty.
  const logs = [];
  const brokenPath = path.join(directory, "broken.json");
  const otherVersionPath = path.join(directory, "other-version.json");
  await fs.writeFile(brokenPath, "{");
  await fs.writeFile(otherVersionPath, JSON.stringify({ ...document, version: 2 }));
  for (const filePath of [path.join(directory, "missing.json"), brokenPath, otherVersionPath]) {
    const empty = createFiveChanBoards({ filePath, log: (message) => logs.push(message) });
    await empty.load();
    assert.equal(empty.document(communities).boards[0].updatedAt, null, filePath);
  }
  assert.equal(logs.length, 1);
  assert.match(logs[0], /failed to load 5chan boards from '.*broken\.json'/);
});

test("ignores a record without an updatedAt", () => {
  const fiveChanBoards = createFiveChanBoards({ filePath: "unused", now: () => NOW });
  const fetched = board("anime-and-manga.bso");
  fiveChanBoards.recordCommunityUpdate(fetched, communityRecord([], { updatedAt: undefined }));
  assert.equal(fiveChanBoards.document([fetched]).boards[0].updatedAt, null);
  fiveChanBoards.recordCommunityUpdate(fetched, communityRecord([], { updatedAt: NOW }));
  assert.equal(fiveChanBoards.document([fetched]).boards[0].updatedAt, NOW);
});
