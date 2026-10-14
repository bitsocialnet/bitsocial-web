import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { SNAPSHOT_SECONDS } from "./ranges.mjs";

// Holds every API document the dashboard builds, rebuilt once per snapshot window on the server's
// own schedule. Requests only read what is here, so traffic never reaches Prometheus and each
// response is a pre-serialized, pre-compressed buffer.

const encode = (document) => {
  const json = Buffer.from(JSON.stringify(document));
  const hash = createHash("sha256").update(json).digest("base64url").slice(0, 27);
  // Weak, because the gzip and identity bodies of one document share it.
  return { json, gzip: gzipSync(json), etag: `W/"${hash}"` };
};

export const createSnapshots = ({
  dashboard,
  now = () => Date.now() / 1000,
  windowSeconds = SNAPSHOT_SECONDS,
}) => {
  const snapshots = new Map();
  let firstPass;
  let timer;
  let stopped = false;

  // A view that fails keeps its previous snapshot; documents carry their own generatedAt, so the
  // dashboard shows how old they are.
  const refresh = async () => {
    const { documents, errors } = await dashboard.documents(now());
    for (const [key, document] of documents) {
      snapshots.set(key, encode(document));
    }
    for (const error of errors) {
      console.error(`stats snapshot ${error}`);
    }
  };

  // Each pass starts on the next window boundary, once every range's timeline has moved on. A
  // pass that overruns its window just pushes the next one back.
  const schedule = () => {
    if (stopped) {
      return;
    }
    const wait = (Math.floor(now() / windowSeconds) + 1) * windowSeconds - now();
    timer = setTimeout(run, wait * 1000);
  };

  const run = () =>
    refresh()
      .catch((error) => console.error(`stats snapshot pass failed: ${error.message}`))
      .finally(schedule);

  return {
    start() {
      firstPass ??= run();
      return firstPass;
    },
    stop() {
      stopped = true;
      clearTimeout(timer);
    },
    refresh,
    /** The latest snapshot for a key, waiting only for the server's first pass after it starts. */
    async get(key) {
      await firstPass;
      return snapshots.get(key);
    },
  };
};
