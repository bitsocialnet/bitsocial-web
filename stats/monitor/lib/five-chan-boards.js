import fs from "node:fs/promises";
import path from "node:path";

// Keeps what the 5chan home page needs from every 5chan board the monitor fetches (its record's
// updatedAt, its stats and its most popular thread) and writes it to a JSON file that the stats
// web server serves at /api/v1/5chan/boards, so the home page does not have to download every
// board over P2P before it can show its Popular Threads and Stats boxes.

export const FIVE_CHAN_CLIENT_ID = "5chan";
export const FIVE_CHAN_BOARDS_VERSION = 1;
// The home page's popularity half-life (src/hooks/use-popular-posts.ts in 5chan).
const POPULARITY_HALF_LIFE_SECONDS = 72 * 3600;
// The extensions 5chan classifies as image, video, audio or flash (src/lib/utils/media-utils.ts).
const mediaExtensions = new Set(
  [
    ["jpg", "jpeg", "jpe", "jfif", "jif", "png", "apng", "gif", "webp", "avif", "svg", "bmp"],
    ["ico", "tiff", "mp4", "webm", "mov", "avi", "mkv", "flv", "wmv", "m4v", "mp3", "wav"],
    ["ogg", "flac", "aac", "m4a", "wma", "swf"],
  ].flat(),
);
// The counts a community's stats file holds, e.g. weekActiveUserCount or allPostCount.
const statsFieldPattern = /^(hour|day|week|month|year|all)(ActiveUser|Post|Reply)Count$/;

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const finiteNumber = (value) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

// A page entry is { comment, commentUpdate }: the CommentIpfs and CommentUpdate as published.
const isHidden = ({ comment, commentUpdate }) =>
  [comment, commentUpdate].some(
    (fields) => fields.pinned || fields.locked || fields.removed || fields.deleted,
  ) || Boolean(commentUpdate.edit?.deleted);

export const isPopularThreadCandidate = (entry) =>
  isObject(entry) &&
  isObject(entry.comment) &&
  isObject(entry.commentUpdate) &&
  typeof entry.commentUpdate.cid === "string" &&
  typeof entry.comment.link === "string" &&
  entry.comment.link.length > 0 &&
  !isHidden(entry);

// 5chan's time-decayed popularity: replies divided by the age of the latest activity.
export const popularityScore = ({ comment, commentUpdate }, nowSeconds) => {
  const replyCount = finiteNumber(commentUpdate.replyCount) ?? 0;
  const lastActivity =
    finiteNumber(commentUpdate.lastReplyTimestamp) ?? finiteNumber(comment.timestamp) ?? 0;
  const ageSeconds = Math.max(0, nowSeconds - lastActivity);
  return Math.max(replyCount, 0.1) / (1 + ageSeconds / POPULARITY_HALF_LIFE_SECONDS);
};

// The threads of the page a community record preloads that may become popular threads. A
// community may preload any sort (5chan boards preload `active`, not `hot`), so this reads the
// first page under `posts.pages`, as bitsocial-react-hooks' getPreloadedPostSortType does. A sort
// published only as a page cid holds no threads in the record.
export const getPopularThreadCandidates = (communityUpdate) => {
  const pages = communityUpdate?.posts?.pages;
  const preloadedSortType = isObject(pages) ? Object.keys(pages).find(Boolean) : undefined;
  const comments = preloadedSortType && pages[preloadedSortType]?.comments;
  return Array.isArray(comments) ? comments.filter(isPopularThreadCandidate) : [];
};

// A thread the home page can show with a picture: one with a thumbnail, or a link to a media file
// (by its path's extension, or a `format` query like pbs.twimg.com's, as 5chan reads them).
export const isMediaThread = ({ comment }) => {
  if (typeof comment.thumbnailUrl === "string" && comment.thumbnailUrl.length > 0) {
    return true;
  }
  let url;
  try {
    url = new URL(comment.link);
  } catch {
    return false;
  }
  const pathParts = url.pathname.toLowerCase().split(".");
  const extension = pathParts.length > 1 ? pathParts.at(-1) : "";
  const format = url.searchParams.get("format")?.toLowerCase();
  return mediaExtensions.has(extension) || mediaExtensions.has(format);
};

// The board's single most popular thread: the best one with media, else the best with any link,
// so a board of plain links still has one. Each record's `replies` preview is signed, so a thread
// weighs its whole preview; one per board keeps the payload small.
// The objects go out untouched: clients verify the author and community signatures and hash
// `comment` to check `cid`, so any change would make the thread fail verification.
export const pickPopularThreads = (candidates, nowSeconds) => {
  const ranked = candidates
    .map((entry) => ({ entry, score: popularityScore(entry, nowSeconds) }))
    .sort((left, right) => right.score - left.score)
    .map(({ entry }) => entry);
  const best = ranked.find(isMediaThread) ?? ranked[0];
  return best
    ? [
        {
          cid: best.commentUpdate.cid,
          raw: { comment: best.comment, commentUpdate: best.commentUpdate },
        },
      ]
    : [];
};

export const pickCommunityStats = (statsCid, communityStats) => {
  if (typeof statsCid !== "string" || !isObject(communityStats)) {
    return null;
  }
  const stats = { statsCid };
  for (const [name, value] of Object.entries(communityStats)) {
    if (statsFieldPattern.test(name) && finiteNumber(value) !== undefined) {
      stats[name] = value;
    }
  }
  return stats;
};

export const createFiveChanBoards = ({
  filePath,
  now = () => Math.floor(Date.now() / 1000),
  log = () => {},
}) => {
  // address -> { updatedAt, statsCid, stats, candidates }, only for boards fetched at least once.
  // `statsCid` is the record's, while `stats` stays the last stats read until that cid's arrive.
  const boards = new Map();

  const document = (communities) => {
    const nowSeconds = now();
    return {
      version: FIVE_CHAN_BOARDS_VERSION,
      generatedAt: nowSeconds,
      boards: communities
        .filter(({ clientId }) => clientId === FIVE_CHAN_CLIENT_ID)
        .map(({ address, publicKey, directoryCode }) => {
          const board = boards.get(address);
          return {
            address,
            publicKey: publicKey ?? null,
            directoryCode: directoryCode ?? null,
            updatedAt: board?.updatedAt ?? null,
            stats: board?.stats ?? null,
            threads: board ? pickPopularThreads(board.candidates, nowSeconds) : [],
          };
        }),
    };
  };

  return {
    recordCommunityUpdate(community, communityUpdate) {
      if (community?.clientId !== FIVE_CHAN_CLIENT_ID) {
        return;
      }
      const previous = boards.get(community.address);
      const updatedAt = finiteNumber(communityUpdate?.updatedAt);
      // IPNS can still answer with an older record; keep the newest, as clients do.
      if (updatedAt === undefined || updatedAt < previous?.updatedAt) {
        return;
      }
      boards.set(community.address, {
        updatedAt,
        statsCid: communityUpdate.statsCid,
        stats: previous?.stats ?? null,
        candidates: getPopularThreadCandidates(communityUpdate),
      });
    },

    recordCommunityStats(community, statsCid, communityStats) {
      const board = boards.get(community?.address);
      const stats = pickCommunityStats(statsCid, communityStats);
      if (community?.clientId === FIVE_CHAN_CLIENT_ID && stats && board?.statsCid === statsCid) {
        board.stats = stats;
      }
    },

    document,

    // Picks up the boards from the last file written, so a monitor restart keeps serving them
    // until its own fetches replace them, instead of serving empty boards for the first pass.
    async load() {
      let previous;
      try {
        previous = JSON.parse(await fs.readFile(filePath, "utf8"));
      } catch (error) {
        if (error.code !== "ENOENT") {
          log(`failed to load 5chan boards from '${filePath}': ${error.message}`);
        }
        return;
      }
      if (previous?.version !== FIVE_CHAN_BOARDS_VERSION || !Array.isArray(previous.boards)) {
        return;
      }
      for (const board of previous.boards) {
        const updatedAt = finiteNumber(board?.updatedAt);
        if (
          typeof board?.address !== "string" ||
          updatedAt === undefined ||
          boards.has(board.address)
        ) {
          continue;
        }
        const stats = pickCommunityStats(board.stats?.statsCid, board.stats);
        boards.set(board.address, {
          updatedAt,
          statsCid: stats?.statsCid,
          stats,
          candidates: Array.isArray(board.threads)
            ? board.threads.map((thread) => thread?.raw).filter(isPopularThreadCandidate)
            : [],
        });
      }
    },

    // Written to a temporary file and renamed into place, so the web server never reads a
    // partial file.
    async write(communities) {
      const body = JSON.stringify(document(communities));
      const temporaryPath = `${filePath}.${process.pid}.tmp`;
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(temporaryPath, body);
      await fs.rename(temporaryPath, filePath);
    },
  };
};
