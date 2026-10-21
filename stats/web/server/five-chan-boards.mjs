import fs from "node:fs/promises";
import {
  FIVE_CHAN_BOARDS_VERSION,
  isPopularThreadCandidate,
  popularityScore,
} from "../../monitor/lib/five-chan-boards.js";

// The documents behind GET /api/v1/5chan/boards and GET /api/v1/5chan/stats: each 5chan board's
// record time, stats and, for the boards the home page can pick from, most popular thread, which
// the monitor writes to a file (stats/monitor/lib/five-chan-boards.js). The snapshot store reads
// that file on its own schedule, so requests never touch the file or cause any upstream work.

export const FIVE_CHAN_BOARDS_KEY = "5chan:boards";
export const FIVE_CHAN_STATS_KEY = "5chan:stats";
// How often the snapshot is rebuilt, and how long clients may cache it. The monitor rewrites the
// file every minute too.
export const FIVE_CHAN_BOARDS_SECONDS = 60;
// The 5chan home page fills its Popular Threads box from the threads of the 16 most popular boards
// it shows (CANDIDATE_POOL_SIZE in 5chan's src/lib/popular-threads.ts), and its visitors show
// worksafe boards, NSFW boards or both. The most popular boards of each group cover all three
// choices; the 4 past 16 stand in for boards 5chan skips, such as one whose thread shows a picture
// a more popular board already shows.
const POPULAR_BOARDS_PER_GROUP = 20;

// The score of a board's best thread, or undefined for a board without one.
const boardScore = (board, nowSeconds) => {
  const scores = (Array.isArray(board.threads) ? board.threads : [])
    .map((thread) => thread?.raw)
    .filter(isPopularThreadCandidate)
    .map((raw) => popularityScore(raw, nowSeconds));
  return scores.length ? Math.max(...scores) : undefined;
};

// Every other board keeps its stats but sends no thread: each thread carries the signed preview
// of its replies, which makes up most of the document. 5chan reads a board as NSFW only when its
// directory says it is not worksafe.
export const keepPopularBoardThreads = (boards, nowSeconds) => {
  const popularBoards = new Set();
  for (const nsfw of [false, true]) {
    boards
      .filter((board) => (board.safeForWork === false) === nsfw)
      .map((board) => ({ board, score: boardScore(board, nowSeconds) }))
      .filter(({ score }) => score !== undefined)
      .sort((left, right) => right.score - left.score)
      .slice(0, POPULAR_BOARDS_PER_GROUP)
      .forEach(({ board }) => popularBoards.add(board));
  }
  return boards.map((board) => (popularBoards.has(board) ? board : { ...board, threads: [] }));
};

export const createFiveChanBoardsSource = ({ filePath, readFile = fs.readFile }) => {
  let lastError;

  return {
    async documents() {
      try {
        const { version, generatedAt, boards } = JSON.parse(await readFile(filePath, "utf8"));
        if (
          version !== FIVE_CHAN_BOARDS_VERSION ||
          !Number.isFinite(generatedAt) ||
          !Array.isArray(boards)
        ) {
          throw new Error(`expected a version ${FIVE_CHAN_BOARDS_VERSION} boards snapshot`);
        }
        lastError = undefined;
        return {
          documents: new Map([
            [
              FIVE_CHAN_BOARDS_KEY,
              { version, generatedAt, boards: keepPopularBoardThreads(boards, generatedAt) },
            ],
            // The Stats box needs a few numbers per board, so it does not wait for any thread.
            [
              FIVE_CHAN_STATS_KEY,
              {
                version,
                generatedAt,
                boards: boards.map(({ threads: _threads, ...board }) => board),
              },
            ],
          ]),
          errors: [],
        };
      } catch (error) {
        // Until the monitor writes its first file, every retry fails the same way; say it once.
        const message = `5chan boards: cannot read ${filePath}: ${error.message}`;
        const errors = message === lastError ? [] : [message];
        lastError = message;
        return { documents: new Map(), errors };
      }
    },
  };
};
