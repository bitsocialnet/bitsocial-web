import path from "path";
import { fileURLToPath } from "url";
import { spawn, spawnSync } from "child_process";
import fs from "fs-extra";
import ps from "node:process";
import ProgressBar from "progress";
import https from "https";
import decompress from "decompress";
import http from "http";
import tcpPortUsed from "tcp-port-used";
import { arch } from "os";
import { URL } from "url";

const basicAuthUsername = process.env.IPFS_BASIC_AUTH_USERNAME;
const basicAuthPassword = process.env.IPFS_BASIC_AUTH_PASSWORD;

const proxyIpfsApiPort = 11111;
const ipfsGatewayPort = 8080;
const ipfsApiPort = 5001;
const ipfsClientVersion = "0.32.1";

// list of http routers to use
const envHttpRouterUrls = process.env.HTTP_ROUTER_URLS
  ? process.env.HTTP_ROUTER_URLS.split(",").map((url) => url.trim())
  : [];
const httpRouterUrls = [
  "https://routing.lol",
  "https://peers.pleb.bot",
  "https://peers.plebpubsub.xyz",
  "https://peers.forumindex.com",
  ...envHttpRouterUrls,
];

const architecture = arch();
let ipfsClientArchitecture;
if (architecture === "ia32") {
  ipfsClientArchitecture = "386";
} else if (architecture === "x64") {
  ipfsClientArchitecture = "amd64";
} else if (architecture === "arm64") {
  ipfsClientArchitecture = "arm64";
} else if (architecture === "arm") {
  ipfsClientArchitecture = "arm";
} else {
  throw Error(`ipfs doesn't support architecture '${architecture}'`);
}
const ipfsClientOs = process.platform === "win32" ? "windows" : process.platform;
const ipfsClientUrl = `https://dist.ipfs.io/kubo/v${ipfsClientVersion}/kubo_v${ipfsClientVersion}_${ipfsClientOs}-${ipfsClientArchitecture}.tar.gz`;

const downloadWithProgress = (url) =>
  new Promise((resolve) => {
    const split = url.split("/");
    const fileName = split[split.length - 1];
    const chunks = [];
    const req = https.request(url);
    req.on("response", (res) => {
      // handle redirects
      if (res.statusCode == 301 || res.statusCode === 302) {
        resolve(downloadWithProgress(res.headers.location));
        return;
      }

      const len = parseInt(res.headers["content-length"], 10);
      console.log();
      const bar = new ProgressBar(`  ${fileName} [:bar] :rate/bps :percent :etas`, {
        complete: "=",
        incomplete: " ",
        width: 20,
        total: len,
      });
      res.on("data", (chunk) => {
        chunks.push(chunk);
        bar.tick(chunk.length);
      });
      res.on("end", () => {
        console.log("\n");
        resolve(Buffer.concat(chunks));
      });
    });
    req.end();
  });

// official kubo downloads need to be extracted
const downloadAndExtract = async (url, destinationPath) => {
  const binName = "ipfs";
  const binPath = path.join(destinationPath, binName);
  if (fs.pathExistsSync(binPath)) {
    return;
  }
  const split = url.split("/");
  const fileName = split[split.length - 1];
  const dowloadPath = path.join(destinationPath, fileName);
  const file = await downloadWithProgress(url);
  fs.ensureDirSync(destinationPath);
  await fs.writeFile(dowloadPath, file);
  await decompress(dowloadPath, destinationPath);
  const extractedPath = path.join(destinationPath, "kubo");
  const extractedBinPath = path.join(extractedPath, binName);
  fs.moveSync(extractedBinPath, binPath);
  fs.removeSync(extractedPath);
  fs.removeSync(dowloadPath);
};

// use this custom function instead of spawnSync for better logging
// also spawnSync might have been causing crash on start on windows
const spawnAsync = (...args) =>
  new Promise((resolve, reject) => {
    const spawedProcess = spawn(...args);
    spawedProcess.on("exit", (exitCode, signal) => {
      if (exitCode === 0) resolve();
      else
        reject(
          Error(
            `spawnAsync process '${spawedProcess.pid}' exited with code '${exitCode}' signal '${signal}'`,
          ),
        );
    });
    spawedProcess.stderr.on("data", (data) => console.error(data.toString()));
    spawedProcess.stdin.on("data", (data) => console.log(data.toString()));
    spawedProcess.stdout.on("data", (data) => console.log(data.toString()));
    spawedProcess.on("error", (data) => console.error(data.toString()));
  });

const startIpfs = async () => {
  const ipfsFileName = "ipfs";
  const rootPath = path.dirname(fileURLToPath(import.meta.url));
  const ipfsFolderPath = path.resolve(rootPath, "bin");
  const ipfsPath = path.resolve(ipfsFolderPath, ipfsFileName);
  const ipfsDataPath = path.resolve(rootPath, ".ipfs");

  // download or upgrade
  if (!fs.pathExistsSync(ipfsPath)) {
    await downloadAndExtract(ipfsClientUrl, ipfsFolderPath);
  }
  const versionMessage = spawnSync(ipfsPath, ["version"]).stdout.toString().trim();
  if (!versionMessage.includes(ipfsClientVersion)) {
    console.log(`${versionMessage}, downloading version ${ipfsClientVersion}`);
    fs.removeSync(ipfsPath);
    fs.removeSync(ipfsDataPath);
    await downloadAndExtract(ipfsClientUrl, ipfsFolderPath);
  }

  console.log({ ipfsPath, ipfsDataPath });

  fs.ensureDirSync(ipfsDataPath);
  const env = { IPFS_PATH: ipfsDataPath };
  // init ipfs client on first launch
  try {
    await spawnAsync(ipfsPath, ["init"], { env, hideWindows: true });
  } catch (e) {}

  // make sure repo is migrated
  try {
    await spawnAsync(ipfsPath, ["repo", "migrate"], { env, hideWindows: true });
  } catch (e) {}

  // set gateway port
  await spawnAsync(
    ipfsPath,
    ["config", "--json", "Addresses.Gateway", `"/ip4/127.0.0.1/tcp/${ipfsGatewayPort}"`],
    {
      env,
      hideWindows: true,
    },
  );

  // set api port
  await spawnAsync(ipfsPath, ["config", "Addresses.API", `/ip4/127.0.0.1/tcp/${ipfsApiPort}`], {
    env,
    hideWindows: true,
  });

  // create http routers config
  const httpRoutersConfig = {
    HttpRoutersParallel: { Type: "parallel", Parameters: { Routers: [] } },
    HttpRouterNotSupported: { Type: "http", Parameters: { Endpoint: "http://kubonotsupported" } },
  };
  for (const [i, httpRouterUrl] of httpRouterUrls.entries()) {
    const RouterName = `HttpRouter${i + 1}`;
    httpRoutersConfig[RouterName] = {
      Type: "http",
      Parameters: {
        Endpoint: httpRouterUrl,
        // MaxProvideBatchSize: 1000, // default 100
        // MaxProvideConcurrency: 1 // default GOMAXPROCS
      },
    };
    httpRoutersConfig.HttpRoutersParallel.Parameters.Routers[i] = {
      RouterName: RouterName,
      IgnoreErrors: true, // If any of the routers fails, the output will be an error by default. To avoid any error at the output, you must ignore all router errors.
      Timeout: "10s",
    };
  }

  const httpRoutersMethodsConfig = {
    "find-providers": { RouterName: "HttpRoutersParallel" },
    provide: { RouterName: "HttpRoutersParallel" },
    // not supported by the current delegated routers we use here
    "find-peers": { RouterName: "HttpRouterNotSupported" },
    "get-ipns": { RouterName: "HttpRouterNotSupported" },
    "put-ipns": { RouterName: "HttpRouterNotSupported" },
  };
  await spawnAsync(ipfsPath, ["config", "Routing.Type", "custom"], { env, hideWindows: true });
  await spawnAsync(
    ipfsPath,
    ["config", "--json", "Routing.Routers", JSON.stringify(httpRoutersConfig)],
    { env, hideWindows: true },
  );
  await spawnAsync(
    ipfsPath,
    ["config", "--json", "Routing.Methods", JSON.stringify(httpRoutersMethodsConfig)],
    { env, hideWindows: true },
  );

  // debug
  await spawnAsync(ipfsPath, ["config", "show"], { env, hideWindows: true });
  await spawnAsync(ipfsPath, ["id"], { env, hideWindows: true });

  const startIpfsDaemon = () =>
    new Promise((resolve, reject) => {
      const ipfsProcess = spawn(
        ipfsPath,
        ["daemon", "--migrate", "--enable-pubsub-experiment", "--enable-namesys-pubsub"],
        { env, hideWindows: true },
      );
      console.log(`ipfs daemon process started with pid ${ipfsProcess.pid}`);
      let lastError;
      ipfsProcess.stderr.on("data", (data) => {
        lastError = data.toString();
        console.error(data.toString());
      });
      ipfsProcess.stdin.on("data", (data) => console.log(data.toString()));
      ipfsProcess.stdout.on("data", (data) => {
        data = data.toString();
        console.log(data);
        if (data.includes("Daemon is ready")) {
          resolve();
        }
      });
      ipfsProcess.on("error", (data) => console.error(data.toString()));
      ipfsProcess.on("exit", () => {
        console.error(`ipfs process with pid ${ipfsProcess.pid} exited`);
        reject(Error(lastError));
      });
      const tryKill = () => {
        try {
          ps.kill(ipfsProcess.pid);
        } catch (e) {
          console.log(e);
        }
        try {
          // sometimes ipfs doesnt exit unless we kill pid +1
          ps.kill(ipfsProcess.pid + 1);
        } catch (e) {
          console.log(e);
        }
      };
      process.on("exit", () => {
        tryKill();
      });

      // healthcheck on kubo rpc, sometimes stops working and needs restart, dont know why
      setInterval(async () => {
        let res;
        try {
          res = await fetch(`http://127.0.0.1:${ipfsApiPort}/api/v0/config/show`, {
            method: "POST",
          }).then((res) => res.json());
        } catch (e) {}
        if (!res?.Identity) {
          console.log(
            `kubo rpc healthcheck failed, response '${JSON.stringify(res)}', killing ipfs...`,
          );
          tryKill();
        }
      }, 1000 * 60);
    });
  await startIpfsDaemon();
};

const startIpfsAutoRestart = async () => {
  let pendingStart = false;
  const start = async () => {
    if (pendingStart) {
      return;
    }
    pendingStart = true;
    try {
      const started = await tcpPortUsed.check(ipfsApiPort, "127.0.0.1");
      if (!started) {
        await startIpfs();
      }
    } catch (e) {
      console.log("failed starting ipfs", e);
    }
    pendingStart = false;
  };

  // retry starting ipfs every 1 second,
  // in case it was started by another client that shut down and shut down ipfs with it
  start();
  setInterval(() => {
    start();
  }, 1000);
};
startIpfsAutoRestart();

const proxyTarget = new URL(`http://127.0.0.1:${ipfsApiPort}`);
const proxy = (req, res) => {
  const reqHeaders = { ...req.headers };

  // delete proxying related headers
  delete reqHeaders["host"];
  delete reqHeaders["connection"];

  // remove headers that could potentially cause an ipfs 403 error
  delete reqHeaders["cf-ipcountry"];
  delete reqHeaders["cf-ray"];
  delete reqHeaders["x-forwarded-proto"];
  delete reqHeaders["cf-visitor"];
  delete reqHeaders["sec-ch-ua"];
  delete reqHeaders["sec-ch-ua-mobile"];
  delete reqHeaders["user-agent"];
  delete reqHeaders["origin"];
  delete reqHeaders["sec-fetch-site"];
  delete reqHeaders["sec-fetch-mode"];
  delete reqHeaders["sec-fetch-dest"];
  delete reqHeaders["referer"];
  delete reqHeaders["cf-connecting-ip"];
  delete reqHeaders["cdn-loop"];

  const requestOptions = {
    hostname: proxyTarget.hostname,
    port: proxyTarget.port,
    path: req.url,
    method: req.method,
    headers: reqHeaders,
  };
  const proxyReq = http.request(requestOptions, (proxyRes) => {
    proxyRes.on("error", (e) => {
      console.log("proxy res error:", e.message);
      res.writeHead(502);
      res.end(`Bad Gateway: ${e.message}`);
    });

    // fix error 'has been blocked by CORS policy'
    const resHeaders = { ...proxyRes.headers };
    resHeaders["access-control-allow-origin"] = "*";

    res.writeHead(proxyRes.statusCode, resHeaders);
    res.flushHeaders(); // send http headers right away, without it kubo.pubsub.subscribe onError not triggered
    proxyRes.pipe(res, { end: true });
  });
  proxyReq.on("error", (e) => {
    console.log("proxy req error:", e.message);
    res.writeHead(500);
    res.end(`Internal Server Error: ${e.message}`);
  });
  req.pipe(proxyReq);
};

// start server
const startServer = (port) => {
  const server = http.createServer();

  // never timeout the keep alive connection
  server.keepAliveTimeout = 0;

  server.on("request", async (req, res) => {
    // unrelated endpoints
    if (
      req.url === "/service-worker.js" ||
      req.url === "/manifest.json" ||
      req.url === "/favicon.ico"
    ) {
      res.statusCode = 404;
      res.end();
      return;
    }

    // start of pubsub related endpoints
    console.log(req.method, req.url, req.rawHeaders);

    // don't let the upstream client call shutdown or change config
    if (req.url === "/api/v0/shutdown" || req.url.startsWith("/api/v0/config")) {
      res.statusCode = 403;
      res.end();
      return;
    }

    // optional basic auth
    let reqHasBasicAuth = false;
    const reqBasicAuthHeader = (req.headers.authorization || "").split(" ")[1] || "";
    const [reqBasicAuthUsername, reqBasicAuthPassword] = Buffer.from(reqBasicAuthHeader, "base64")
      .toString()
      .split(":");
    if (
      basicAuthUsername &&
      basicAuthPassword &&
      basicAuthUsername === reqBasicAuthUsername &&
      basicAuthPassword === reqBasicAuthPassword
    ) {
      reqHasBasicAuth = true;
    }
    if ((basicAuthUsername || basicAuthPassword) && !reqHasBasicAuth) {
      res.setHeader("WWW-Authenticate", "Basic");
      res.statusCode = 401;
      res.end();
      return;
    }

    proxy(req, res);
  });
  server.on("error", console.error);
  server.listen(port);
  console.log(`proxy server listening on port ${port}`);
};
startServer(proxyIpfsApiPort);
