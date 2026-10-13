import http from "node:http";

// longer than the upstream client's longest kubo timeout (5min for community ipns in pkc-js)
const defaultIdleTimeoutMs = 1000 * 60 * 10;

// headers that are proxying related or could potentially cause an ipfs 403 error
const strippedRequestHeaders = [
  "host",
  "connection",
  "cf-ipcountry",
  "cf-ray",
  "x-forwarded-proto",
  "cf-visitor",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "user-agent",
  "origin",
  "sec-fetch-site",
  "sec-fetch-mode",
  "sec-fetch-dest",
  "referer",
  "cf-connecting-ip",
  "cdn-loop",
];

// pubsub/sub responses stream until the client unsubscribes, and kubo sends nothing on quiet topics
const isLongLivedStream = (url) => url.split("?")[0] === "/api/v0/pubsub/sub";

const endWithError = (res, statusCode, message) => {
  if (res.writableEnded || res.destroyed) {
    return;
  }
  // mid-stream, cutting the connection is the only way left to tell the client the response failed
  if (res.headersSent) {
    res.destroy();
    return;
  }
  res.writeHead(statusCode);
  res.end(message);
};

// served by the proxy itself, kubo has no /proxy routes so nothing is shadowed
export const kuboRpcProxyStatsPath = "/proxy/stats";

// http.Agent keeps its sockets and queued requests in lists keyed by host:port
const countByHost = (listsByHost, isCounted = () => true) =>
  Object.values(listsByHost).reduce((count, list) => count + list.filter(isCounted).length, 0);

// validates a stats response, so a different or older proxy can't feed the monitor partial numbers
export const parseKuboRpcProxyStats = (stats) => {
  const counts = {
    rpcActive: stats?.upstreamSockets?.rpcActive,
    rpcIdle: stats?.upstreamSockets?.rpcIdle,
    stream: stats?.upstreamSockets?.stream,
    queuedRequests: stats?.queuedRequests,
  };
  for (const [name, value] of Object.entries(counts)) {
    if (!Number.isInteger(value) || value < 0) {
      throw Error(`invalid kubo rpc proxy stats, '${name}' is ${JSON.stringify(value)}`);
    }
  }
  return { ...counts, upstreamSockets: counts.rpcActive + counts.rpcIdle + counts.stream };
};

export const createKuboRpcProxy = ({
  target,
  idleTimeoutMs = defaultIdleTimeoutMs,
  maxSockets = 256,
}) => {
  const proxyTarget = new URL(target);

  // bounded keep-alive pool, a stalled kubo makes requests queue here instead of opening sockets
  // without limit, and idle sockets are closed after 30s
  const rpcAgent = new http.Agent({
    keepAlive: true,
    maxSockets,
    maxFreeSockets: 64,
    timeout: 1000 * 30,
  });
  // long-lived streams get their own connections so open subscriptions can't use up the rpc pool
  const streamAgent = new http.Agent({ keepAlive: false });

  const getStats = () => ({
    upstreamSockets: {
      rpcActive: countByHost(rpcAgent.sockets),
      rpcIdle: countByHost(rpcAgent.freeSockets),
      stream: countByHost(streamAgent.sockets),
    },
    // the agent only drops a queued request whose client left once a socket frees up
    queuedRequests: countByHost(rpcAgent.requests, (queuedReq) => !queuedReq.destroyed),
  });

  return (req, res) => {
    // open upstream sockets per pool, polled by the stats monitor for its gauges and leak alert
    if (req.url === kuboRpcProxyStatsPath) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(getStats()));
      return;
    }

    const reqHeaders = { ...req.headers };
    for (const header of strippedRequestHeaders) {
      delete reqHeaders[header];
    }

    const longLivedStream = isLongLivedStream(req.url);
    const proxyReq = http.request(
      {
        hostname: proxyTarget.hostname,
        port: proxyTarget.port,
        path: req.url,
        method: req.method,
        headers: reqHeaders,
        agent: longLivedStream ? streamAgent : rpcAgent,
      },
      (proxyRes) => {
        proxyRes.on("error", (e) => {
          console.log("proxy res error:", e.message);
          endWithError(res, 502, `Bad Gateway: ${e.message}`);
        });

        // fix error 'has been blocked by CORS policy'
        const resHeaders = { ...proxyRes.headers };
        resHeaders["access-control-allow-origin"] = "*";

        res.writeHead(proxyRes.statusCode, resHeaders);
        res.flushHeaders(); // send http headers right away, without it kubo.pubsub.subscribe onError not triggered
        proxyRes.pipe(res, { end: true });
      },
    );
    proxyReq.on("error", (e) => {
      console.log("proxy req error:", e.message);
      endWithError(res, 500, `Internal Server Error: ${e.message}`);
    });
    if (!longLivedStream) {
      proxyReq.setTimeout(idleTimeoutMs, () => {
        console.log(`proxy req timeout: no data from kubo for ${idleTimeoutMs}ms`, req.url);
        endWithError(res, 504, "Gateway Timeout");
        proxyReq.destroy();
      });
    }

    // the client left before the response finished (e.g. unsubscribed from pubsub/sub or timed out),
    // abort the kubo request so kubo cancels it and the upstream socket is closed instead of
    // staying open with unread data
    res.on("close", () => {
      if (!res.writableFinished) {
        proxyReq.destroy();
      }
    });

    req.pipe(proxyReq);
  };
};
