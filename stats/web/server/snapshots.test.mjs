import assert from "node:assert/strict";
import test from "node:test";
import { createSnapshots } from "./snapshots.mjs";

const turn = () => new Promise((resolve) => setImmediate(resolve));

// Lets an in-flight pass finish: its gzip runs on the thread pool, so wait until `done` shows the
// pass stored, then give it a few turns to schedule the next one.
const settle = async (done) => {
  for (let attempt = 0; attempt < 100_000 && !(await done()); attempt += 1) {
    await turn();
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await turn();
  }
};

const stored = (snapshots, at) => async () =>
  snapshots.size > 0 && (await snapshots.get("view")).json.toString() === JSON.stringify({ at });

// A dashboard that records the moment each pass covers and answers from `respond`.
const recordingDashboard = (respond = (at) => [["view", { at }]]) => {
  const covered = [];
  return {
    covered,
    documents: async (at) => {
      covered.push(at);
      return { documents: new Map(respond(at, covered.length)), errors: [] };
    },
  };
};

const createStore = (t, dashboard, options = {}) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const clock = { now: 100 };
  const snapshots = createSnapshots({ dashboard, now: () => clock.now, ...options });
  t.after(() => snapshots.stop());
  return { clock, snapshots };
};

test("each pass covers the next boundary even when its timer fires a moment early", async (t) => {
  const dashboard = recordingDashboard();
  const { clock, snapshots } = createStore(t, dashboard);

  await snapshots.start();
  clock.now = 119.999;
  t.mock.timers.tick(20_000);
  await settle(stored(snapshots, 120));
  clock.now = 149.9995;
  t.mock.timers.tick(30_002);
  await settle(stored(snapshots, 150));

  assert.deepEqual(dashboard.covered, [100, 120, 150]);
});

test("a pass that overruns its window moves on to the next boundary", async (t) => {
  const state = {};
  const dashboard = recordingDashboard((at, pass) => {
    // The pass for 120 runs past 150, so 150 is skipped rather than built late.
    if (pass === 2) {
      state.clock.now = 151;
    }
    return [["view", { at }]];
  });
  const { clock, snapshots } = createStore(t, dashboard);
  state.clock = clock;

  await snapshots.start();
  clock.now = 120;
  t.mock.timers.tick(20_000);
  await settle(stored(snapshots, 120));
  clock.now = 180;
  t.mock.timers.tick(29_000);
  await settle(stored(snapshots, 180));

  assert.deepEqual(dashboard.covered, [100, 120, 180]);
});

test("a pass that built nothing is retried within seconds", async (t) => {
  const dashboard = recordingDashboard((at, pass) => (pass === 1 ? [] : [["view", { at }]]));
  const { clock, snapshots } = createStore(t, dashboard);

  await snapshots.start();
  assert.equal(snapshots.size, 0);
  clock.now = 105;
  t.mock.timers.tick(5_000);
  await settle(stored(snapshots, 105));

  assert.deepEqual(dashboard.covered, [100, 105]);
  assert.equal(snapshots.size, 1);
});

test("stop prevents further passes, even when a pass is in flight", async (t) => {
  let finish;
  const dashboard = {
    passes: 0,
    documents: () => {
      dashboard.passes += 1;
      return new Promise((resolve) => {
        finish = () => resolve({ documents: new Map([["view", {}]]), errors: [] });
      });
    },
  };
  const { snapshots } = createStore(t, dashboard);

  const firstPass = snapshots.start();
  snapshots.stop();
  finish();
  await firstPass;
  t.mock.timers.tick(120_000);
  await settle(() => true);

  assert.equal(dashboard.passes, 1);
});

test("a request before the first pass finishes gets its document", async (t) => {
  let finish;
  const dashboard = {
    documents: () =>
      new Promise((resolve) => {
        finish = () => resolve({ documents: new Map([["view", { ok: true }]]), errors: [] });
      }),
  };
  const { snapshots } = createStore(t, dashboard);

  snapshots.start();
  const pending = snapshots.get("view");
  finish();
  assert.equal((await pending).json.toString(), '{"ok":true}');
});

test("while nothing is built, a request waits for the retry pass", async (t) => {
  const dashboard = recordingDashboard((at, pass) => (pass === 1 ? [] : [["view", { at }]]));
  const { clock, snapshots } = createStore(t, dashboard);

  await snapshots.start();
  const pending = snapshots.get("view");
  clock.now = 105;
  t.mock.timers.tick(5_000);
  assert.equal((await pending).json.toString(), '{"at":105}');
});

test("requests wait for a pass only up to the limit", async (t) => {
  let finish;
  const dashboard = {
    documents: () =>
      new Promise((resolve) => {
        finish = () => resolve({ documents: new Map([["view", { ok: true }]]), errors: [] });
      }),
  };
  const { snapshots } = createStore(t, dashboard, { firstPassWaitSeconds: 10 });

  snapshots.start();
  const early = snapshots.get("view");
  t.mock.timers.tick(10_000);
  assert.equal(await early, undefined);

  finish();
  await settle(() => snapshots.size > 0);
  assert.equal((await snapshots.get("view")).json.toString(), '{"ok":true}');
});
