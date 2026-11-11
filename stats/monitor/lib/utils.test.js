import assert from "node:assert/strict";
import { once } from "node:events";
import http from "node:http";
import test from "node:test";
import { createRunUnlessPending, fetchHtml, fetchJson } from "./utils.js";

const settlesWithin = async (promise, ms, message) => {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(Error(message)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
};

// a probe target that accepts connections and then stops answering
const startStalledServer = async (t, handler) => {
  const server = http.createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  return `http://127.0.0.1:${server.address().port}`;
};

test("fetchJson gives up on a target that never answers", async (t) => {
  const url = await startStalledServer(t, () => {});
  await assert.rejects(
    settlesWithin(fetchJson(url, { timeoutMs: 100 }), 2000, "fetchJson never settled"),
    { name: "AbortError" },
  );
});

test("fetchHtml gives up on a target that stops in the middle of the body", async (t) => {
  const url = await startStalledServer(t, (req, res) => {
    res.writeHead(200, { "content-type": "text/html" });
    res.write("<html>");
  });
  await assert.rejects(
    settlesWithin(fetchHtml(url, { timeoutMs: 100 }), 2000, "fetchHtml never settled"),
    { name: "AbortError" },
  );
});

test("fetchJson keeps the signal its caller passes", async (t) => {
  const url = await startStalledServer(t, () => {});
  const controller = new AbortController();
  const fetching = fetchJson(url, { signal: controller.signal, timeoutMs: 60_000 });
  controller.abort();
  await assert.rejects(settlesWithin(fetching, 2000, "fetchJson ignored the signal"), {
    name: "AbortError",
  });
});

test("runUnlessPending skips a key until its previous run settled", async () => {
  const runUnlessPending = createRunUnlessPending();
  const runs = [];
  const finishes = [];
  const run = (name) => () => {
    runs.push(name);
    return new Promise((resolve, reject) => finishes.push({ resolve, reject }));
  };

  const first = runUnlessPending("gateway", run("gateway 1"));
  runUnlessPending("gateway", run("gateway 2"));
  runUnlessPending("router", run("router 1"));
  assert.deepEqual(runs, ["gateway 1", "router 1"]);

  finishes[0].reject(Error("gateway failed"));
  await assert.rejects(first, { message: "gateway failed" });
  runUnlessPending("gateway", run("gateway 3"));
  runUnlessPending("router", run("router 2"));
  assert.deepEqual(runs, ["gateway 1", "router 1", "gateway 3"]);
  finishes[1].resolve();
  finishes[2].resolve();
});
