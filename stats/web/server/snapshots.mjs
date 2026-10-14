import { createHash } from "node:crypto";
import { promisify } from "node:util";
import { gzip as gzipCallback } from "node:zlib";
import { SNAPSHOT_SECONDS } from "./ranges.mjs";

// Holds every API document the dashboard builds, rebuilt once per snapshot window on the server's
// own schedule. Requests only read what is here, so traffic never reaches Prometheus and each
// response is a pre-serialized, pre-compressed buffer.

// Until a pass has built anything, a request waits at most this long for the next one to finish.
const FIRST_PASS_WAIT_SECONDS = 20;
// A pass that built nothing (Prometheus still starting) is retried this soon, not a window later.
const EMPTY_RETRY_SECONDS = 5;

const gzip = promisify(gzipCallback);

const encode = async (document) => {
  const json = Buffer.from(JSON.stringify(document));
  const hash = createHash("sha256").update(json).digest("base64url").slice(0, 27);
  // Weak, because the gzip and identity bodies of one document share it.
  return { json, gzip: await gzip(json), etag: `W/"${hash}"` };
};

export const createSnapshots = ({
  dashboard,
  now = () => Date.now() / 1000,
  windowSeconds = SNAPSHOT_SECONDS,
  firstPassWaitSeconds = FIRST_PASS_WAIT_SECONDS,
}) => {
  const snapshots = new Map();
  let firstPass;
  let passEnded;
  let nextPassEnd = new Promise((resolve) => (passEnded = resolve));
  let lastAt = -Infinity;
  let timer;
  let stopped = false;

  // Builds every document for the moment `at`. A view whose queries all fail keeps its previous
  // snapshot; documents carry their own generatedAt, so the dashboard shows how old they are.
  const refresh = async (at = now()) => {
    lastAt = at;
    const { documents, errors } = await dashboard.documents(at);
    const encoded = await Promise.all(
      [...documents].map(async ([key, document]) => [key, await encode(document)]),
    );
    for (const [key, snapshot] of encoded) {
      snapshots.set(key, snapshot);
    }
    for (const error of errors) {
      console.error(`stats snapshot ${error}`);
    }
  };

  // Each pass covers the next window boundary after the last one it built. A timer can fire a
  // moment early, so the pass is given its boundary rather than the clock, which would repeat the
  // previous window; a pass that overruns its window just moves on to the next boundary.
  const schedule = () => {
    if (stopped) {
      return;
    }
    const built = Math.max(Math.floor(now() / windowSeconds), Math.floor(lastAt / windowSeconds));
    const at = snapshots.size ? (built + 1) * windowSeconds : now() + EMPTY_RETRY_SECONDS;
    timer = setTimeout(() => run(at), Math.max(0, at - now()) * 1000);
  };

  const run = (at) =>
    refresh(Math.max(now(), at))
      .catch((error) => console.error(`stats snapshot pass failed: ${error.message}`))
      .finally(() => {
        passEnded();
        nextPassEnd = new Promise((resolve) => (passEnded = resolve));
        schedule();
      });

  return {
    start() {
      firstPass ??= run(now());
      return firstPass;
    },
    stop() {
      stopped = true;
      clearTimeout(timer);
    },
    refresh,
    get size() {
      return snapshots.size;
    },
    /** The latest snapshot for a key. Until anything is built, waits briefly for the next pass. */
    async get(key) {
      if (firstPass && !stopped && snapshots.size === 0) {
        let timeout;
        await Promise.race([
          nextPassEnd,
          new Promise((resolve) => {
            timeout = setTimeout(resolve, firstPassWaitSeconds * 1000);
          }),
        ]);
        clearTimeout(timeout);
      }
      return snapshots.get(key);
    },
  };
};
