import fs from "node:fs/promises";
import { FIVE_CHAN_BOARDS_VERSION } from "../../monitor/lib/five-chan-boards.js";

// The document behind GET /api/v1/5chan/boards: each 5chan board's record time, stats and most
// popular threads, which the monitor writes to a file (stats/monitor/lib/five-chan-boards.js).
// The snapshot store reads that file on its own schedule, so requests never touch the file or
// cause any upstream work.

export const FIVE_CHAN_BOARDS_KEY = "5chan:boards";
// How often the snapshot is rebuilt, and how long clients may cache it. The monitor rewrites the
// file every minute too.
export const FIVE_CHAN_BOARDS_SECONDS = 60;

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
          documents: new Map([[FIVE_CHAN_BOARDS_KEY, { version, generatedAt, boards }]]),
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
