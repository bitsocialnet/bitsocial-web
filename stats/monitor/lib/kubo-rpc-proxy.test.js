import assert from "node:assert/strict";
import { once } from "node:events";
import http from "node:http";
import test from "node:test";
import { createKuboRpcProxy } from "./kubo-rpc-proxy.js";

const listen = async (server) => {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return `http://127.0.0.1:${server.address().port}`;
};

// fake kubo rpc server with the proxy in front of it, both closed when the test ends
const startProxy = async (t, kuboHandler, proxyOptions) => {
  const kubo = http.createServer(kuboHandler);
  const kuboUrl = await listen(kubo);
  const proxy = http.createServer(createKuboRpcProxy({ target: kuboUrl, ...proxyOptions }));
  const proxyUrl = await listen(proxy);
  t.after(() => {
    proxy.closeAllConnections();
    proxy.close();
    kubo.closeAllConnections();
    kubo.close();
  });
  return proxyUrl;
};

const postToProxy = (proxyUrl, path) => {
  const req = http.request(`${proxyUrl}${path}`, { method: "POST", agent: false });
  req.on("error", () => {});
  req.end();
  return req;
};

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

test("forwards rpc calls to kubo with the cors header and stripped client headers", async (t) => {
  const kuboSockets = new Set();
  const kuboRequests = [];
  const proxyUrl = await startProxy(t, async (req, res) => {
    kuboSockets.add(req.socket);
    let body = "";
    req.setEncoding("utf8");
    for await (const chunk of req) {
      body += chunk;
    }
    kuboRequests.push({ headers: req.headers, body });
    res.writeHead(201, { "content-type": "application/json", "x-kubo": "1" });
    res.end('{"Hash":"cid"}');
  });

  const uploadedBody = "x".repeat(100_000);
  for (let i = 0; i < 2; i++) {
    const clientReq = http.request(`${proxyUrl}/api/v0/add`, {
      method: "POST",
      agent: false,
      headers: {
        "content-type": "text/plain",
        origin: "https://example.com",
        "user-agent": "test",
      },
    });
    clientReq.end(uploadedBody);
    const [clientRes] = await settlesWithin(
      once(clientReq, "response"),
      2000,
      "kubo never answered the proxied rpc call",
    );
    clientRes.setEncoding("utf8");
    let responseBody = "";
    for await (const chunk of clientRes) {
      responseBody += chunk;
    }

    assert.equal(clientRes.statusCode, 201);
    assert.equal(clientRes.headers["access-control-allow-origin"], "*");
    assert.equal(clientRes.headers["x-kubo"], "1");
    assert.equal(responseBody, '{"Hash":"cid"}');
  }

  for (const { headers, body } of kuboRequests) {
    assert.equal(body, uploadedBody);
    assert.equal(headers["content-type"], "text/plain");
    assert.equal(headers.origin, undefined);
    assert.equal(headers["user-agent"], undefined);
  }
  assert.equal(kuboSockets.size, 1, "sequential rpc calls should reuse the kubo connection");
});

test("closes the kubo connection when the client leaves a pubsub/sub stream", async (t) => {
  const kuboRes = Promise.withResolvers();
  const proxyUrl = await startProxy(t, (req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.flushHeaders();
    kuboRes.resolve(res);
  });

  const clientReq = postToProxy(proxyUrl, "/api/v0/pubsub/sub?arg=topic");
  const [clientRes] = await once(clientReq, "response");
  assert.equal(clientRes.statusCode, 200);
  const kuboResClosed = once(await kuboRes.promise, "close");
  clientReq.destroy();

  await settlesWithin(kuboResClosed, 2000, "kubo connection stayed open after the client left");
});

test("closes the kubo connection when the client leaves before kubo responds", async (t) => {
  const kuboRes = Promise.withResolvers();
  const proxyUrl = await startProxy(t, (req, res) => kuboRes.resolve(res));

  const clientReq = postToProxy(proxyUrl, "/api/v0/cat?arg=cid");
  const kuboResClosed = once(await kuboRes.promise, "close");
  clientReq.destroy();

  await settlesWithin(kuboResClosed, 2000, "kubo connection stayed open after the client left");
});

test("answers 504 when kubo sends nothing within the idle timeout", async (t) => {
  const proxyUrl = await startProxy(t, () => {}, { idleTimeoutMs: 100 });

  const clientReq = postToProxy(proxyUrl, "/api/v0/cat?arg=cid");
  const [clientRes] = await settlesWithin(
    once(clientReq, "response"),
    2000,
    "proxy kept waiting on an idle kubo request",
  );
  clientRes.resume();

  assert.equal(clientRes.statusCode, 504);
});

test("drops the client connection when kubo goes idle mid-response", async (t) => {
  const kuboRes = Promise.withResolvers();
  const proxyUrl = await startProxy(
    t,
    (req, res) => {
      res.writeHead(200);
      res.write("partial");
      kuboRes.resolve(res);
    },
    { idleTimeoutMs: 100 },
  );

  const clientReq = postToProxy(proxyUrl, "/api/v0/cat?arg=cid");
  const [clientRes] = await once(clientReq, "response");
  const clientResError = Promise.withResolvers();
  clientRes.on("error", clientResError.resolve);
  clientRes.resume();
  const kuboResClosed = once(await kuboRes.promise, "close");

  const error = await settlesWithin(clientResError.promise, 2000, "client connection stayed open");
  assert.equal(error.code, "ECONNRESET");
  assert.equal(clientRes.complete, false);
  await settlesWithin(kuboResClosed, 2000, "kubo connection stayed open after the timeout");
});

test("keeps pubsub/sub streams open past the idle timeout", async (t) => {
  const kuboRes = Promise.withResolvers();
  const proxyUrl = await startProxy(
    t,
    (req, res) => {
      res.writeHead(200);
      res.flushHeaders();
      kuboRes.resolve(res);
    },
    { idleTimeoutMs: 100 },
  );

  const clientReq = postToProxy(proxyUrl, "/api/v0/pubsub/sub?arg=topic");
  const [clientRes] = await once(clientReq, "response");
  await new Promise((resolve) => setTimeout(resolve, 300));
  (await kuboRes.promise).end("message");

  clientRes.setEncoding("utf8");
  let body = "";
  for await (const chunk of clientRes) {
    body += chunk;
  }
  assert.equal(body, "message");
});

test("drops the client connection when kubo dies mid-response", async (t) => {
  const kuboRes = Promise.withResolvers();
  const proxyUrl = await startProxy(t, (req, res) => {
    res.writeHead(200);
    res.write("partial");
    kuboRes.resolve(res);
  });

  const clientReq = postToProxy(proxyUrl, "/api/v0/cat?arg=cid");
  const [clientRes] = await once(clientReq, "response");
  const clientResError = Promise.withResolvers();
  clientRes.on("error", clientResError.resolve);
  clientRes.resume();
  (await kuboRes.promise).socket.destroy();

  const error = await settlesWithin(clientResError.promise, 2000, "client connection stayed open");
  assert.equal(error.code, "ECONNRESET");
  assert.equal(clientRes.complete, false);
});
