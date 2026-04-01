import monitorState from "./monitor-state.js";
import config from "../config.js";
import fs from "fs-extra";
import express from "express";
import { promClient } from "./prometheus.js";
import yargs from "yargs/yargs";
import { getCliArgs } from "./cli-args.js";
const argv = yargs(getCliArgs(process.argv)).parseSync();
import { getPeerCounts } from "./peers.js"; // must always import ./peers.js to register peers prometheus metrics

const apiPort = argv.apiPort || 3000;
const app = express();
const previewerUrls =
  config.monitoring.previewerUrls || config.monitoring.plebbitPreviewerUrls || [];
const seederPeerIds =
  config.monitoring.seederPeerIds || config.monitoring.plebbitSeederPeerIds || [];
const clientLabels = Object.fromEntries(
  (config.monitoring.clients || []).map((client) => [client.id, client.label || client.id]),
);
app.listen(apiPort, () => {
  console.log(`api listening on port ${apiPort}`);
});

// stats endpoint
app.get("/", (req, res) => {
  const include = req.query.include?.split(",");

  const network = { communityStats: {}, communityCount: 0, ...getPeerCounts() };
  const communities = {};
  const clients = {};
  const communitiesMonitoring = monitorState.subplebbitsMonitoring || [];
  for (const { address: subplebbitAddress } of communitiesMonitoring) {
    const monitoredCommunity = monitorState.subplebbits[subplebbitAddress];
    const clientId = monitoredCommunity?.clientId || "unknown";
    if (!clients[clientId]) {
      clients[clientId] = {
        id: clientId,
        label: clientLabels[clientId] || clientId,
        communityCount: 0,
        communityStats: {},
      };
    }

    communities[subplebbitAddress] = {
      //utils
      address: subplebbitAddress,
      communityAddress: subplebbitAddress,
      targetAddress: monitoredCommunity?.targetAddress,
      title: monitoredCommunity?.title,
      directoryCode: monitoredCommunity?.directoryCode,
      clientId,
      resolutionError: monitoredCommunity?.resolutionError,
      ipnsName: monitoredCommunity?.ipnsName,
      publicKey: monitoredCommunity?.publicKey,
      pubsubTopic: monitoredCommunity?.pubsubTopic,
      pubsubTopicRoutingCid: monitoredCommunity?.pubsubTopicRoutingCid,
      ipnsPubsubTopic: monitoredCommunity?.ipnsPubsubTopic,
      ipnsPubsubTopicRoutingCid: monitoredCommunity?.ipnsPubsubTopicRoutingCid,
      // ipns
      getSubplebbitCount: monitoredCommunity?.getSubplebbitCount,
      lastSubplebbitUpdateTimestamp: monitoredCommunity?.lastSubplebbitUpdateTimestamp,
      ipnsDhtPeerCount: monitoredCommunity?.ipnsDhtPeers?.length,
      ipnsHttpRoutersPeerCount: monitoredCommunity?.ipnsHttpRoutersPeers?.length,
      ipnsCidHttpRoutersPeerCount: monitoredCommunity?.ipnsCidHttpRoutersPeers?.length,
      // pubsub
      pubsubDhtPeerCount: monitoredCommunity?.pubsubDhtPeers?.length,
      pubsubHttpRoutersPeerCount: monitoredCommunity?.pubsubHttpRoutersPeers?.length,
      pubsubPeerCount: monitoredCommunity?.pubsubPeers?.length,
      lastPubsubMessageTimestamp: monitoredCommunity?.lastPubsubMessageTimestamp,
      lastSubplebbitPubsubMessageTimestamp:
        monitoredCommunity?.lastSubplebbitPubsubMessageTimestamp,
      // stats
      communityStats: monitoredCommunity?.subplebbitStats,
      subplebbitStats: monitoredCommunity?.subplebbitStats,
    };

    // add community stats to network + per-client aggregates
    network.communityCount++;
    clients[clientId].communityCount++;
    for (const statsName in monitoredCommunity?.subplebbitStats || {}) {
      if (!network.communityStats[statsName]) {
        network.communityStats[statsName] = 0;
      }
      if (!clients[clientId].communityStats[statsName]) {
        clients[clientId].communityStats[statsName] = 0;
      }
      network.communityStats[statsName] += monitoredCommunity.subplebbitStats[statsName];
      clients[clientId].communityStats[statsName] += monitoredCommunity.subplebbitStats[statsName];
    }
  }
  const ipfsGateways = {};
  for (const ipfsGatewayUrl of config.monitoring.ipfsGatewayUrls || []) {
    ipfsGateways[ipfsGatewayUrl] = {
      url: ipfsGatewayUrl,
      ...monitorState.ipfsGateways[ipfsGatewayUrl],
    };
  }
  const pubsubProviders = {};
  for (const pubsubProviderUrl of config.monitoring.pubsubProviderUrls || []) {
    pubsubProviders[pubsubProviderUrl] = {
      url: pubsubProviderUrl,
      ...monitorState.pubsubProviders[pubsubProviderUrl],
    };
  }
  const httpRouters = {};
  for (const httpRouterUrl of config.monitoring.httpRouterUrls || []) {
    httpRouters[httpRouterUrl] = {
      url: httpRouterUrl,
      ...monitorState.httpRouters[httpRouterUrl],
    };
  }
  const seeders = {};
  for (const plebbitSeederPeerId of seederPeerIds) {
    seeders[plebbitSeederPeerId] = {
      peerId: plebbitSeederPeerId,
      ...monitorState.plebbitSeeders[plebbitSeederPeerId],
    };
  }
  const plebbitSeeders = {};
  for (const plebbitSeederPeerId of seederPeerIds) {
    plebbitSeeders[plebbitSeederPeerId] = {
      peerId: plebbitSeederPeerId,
      ...monitorState.plebbitSeeders[plebbitSeederPeerId],
    };
  }
  const previewers = {};
  for (const plebbitPreviewerUrl of previewerUrls) {
    previewers[plebbitPreviewerUrl] = {
      url: plebbitPreviewerUrl,
      ...monitorState.plebbitPreviewers[plebbitPreviewerUrl],
    };
  }
  const plebbitPreviewers = {};
  for (const plebbitPreviewerUrl of previewerUrls) {
    plebbitPreviewers[plebbitPreviewerUrl] = {
      url: plebbitPreviewerUrl,
      ...monitorState.plebbitPreviewers[plebbitPreviewerUrl],
    };
  }
  const chainProviders = {};
  for (const chainTicker in config.monitoring.chainProviders) {
    for (const chainProviderUrl of config.monitoring.chainProviders[chainTicker].urls) {
      chainProviders[chainProviderUrl] = {
        url: chainProviderUrl,
        ...monitorState.chainProviders[chainProviderUrl],
      };
    }
  }
  const webpages = {};
  for (const { url: webpageUrl } of config.monitoring.webpages || []) {
    webpages[webpageUrl] = {
      url: webpageUrl,
      ...monitorState.webpages[webpageUrl],
    };
  }
  const nfts = {};
  for (const { name: nftName } of config.monitoring.nfts || []) {
    nfts[nftName] = {
      name: nftName,
      ...monitorState.nfts[nftName],
    };
  }
  const subplebbits = communities;
  const plebbit = {
    ...network,
    subplebbitsStats: network.communityStats,
    subplebbitCount: network.communityCount,
  };
  const jsonResponse = {
    communities,
    clients,
    ipfsGateways,
    pubsubProviders,
    httpRouters,
    seeders,
    previewers,
    plebbitSeeders,
    plebbitPreviewers,
    chainProviders,
    webpages,
    nfts,
    network,
    subplebbits,
    plebbit,
  };

  // include
  if (include?.length) {
    for (const propName in jsonResponse) {
      if (!include.includes(propName)) {
        delete jsonResponse[propName];
      }
    }
  }

  res.setHeader("Content-Type", "application/json");
  // cache expires after 1 minutes (60 seconds), must revalidate if expired
  res.setHeader("Cache-Control", "public, max-age=60, must-revalidate");
  res.send(JSON.stringify(jsonResponse, null, 2));
});

// update history every 5 min
const maxTimestamps = 500;
let historyFiles = [];
let historyRecentCache = {};
const updateHistory = async () => {
  await fs.ensureDir("history");
  historyFiles = await fs.readdir("history");

  // add recent cache for faster loading
  const _historyRecentCache = {};
  let cacheCount = 0;
  while (cacheCount++ < maxTimestamps) {
    const historyFilesIndex = historyFiles.length - cacheCount;
    if (historyFilesIndex < 0) {
      break;
    }
    const historyFile = historyFiles[historyFilesIndex];
    _historyRecentCache[historyFile] = JSON.parse(
      await fs.readFile(`history/${historyFile}`, "utf8"),
    );
  }
  historyRecentCache = _historyRecentCache;
};
updateHistory().catch((e) => console.log(e.message));
setInterval(() => updateHistory().catch((e) => console.log(e.message)), 1000 * 60 * 5);

// history endpoint
const toDate = (dateString) => {
  try {
    // all number timestamps in and out, should be in seconds
    // but internally I keep them in ms most of the time
    if (isFinite(dateString)) {
      return new Date(dateString * 1000);
    }
    return new Date(dateString);
  } catch (e) {
    console.log(e);
  }
  return new Date();
};
app.get("/history", async (req, res) => {
  const isPastAndImmutable = req.query.to ? Date.now() > toDate(req.query.to).getTime() : false;
  if (isPastAndImmutable) {
    // if query has a 'to' timestamp, it is in the past, it can never update and is immutable
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    // cache expires after 10 minutes (600 seconds), must revalidate if expired
    res.setHeader("Cache-Control", "public, max-age=600, must-revalidate");
  }

  try {
    const from = req.query.from ? toDate(req.query.from).getTime() : 0; // in seconds
    const to = req.query.to ? toDate(req.query.to).getTime() : Infinity; // in seconds
    const ipfsGatewayUrl = req.query.ipfsGatewayUrl;
    const communityAddress = req.query.communityAddress || req.query.subplebbitAddress;
    const include = req.query.include?.split(",");
    const interval = req.query.interval; // in seconds

    // filter by timestamp
    const historyFilesToRead = [];
    let previousTimestamp;
    for (const historyFile of historyFiles) {
      const timestamp = toDate(historyFile).getTime();
      if (timestamp >= from && timestamp <= to) {
        // interval size
        if (previousTimestamp && interval) {
          const previousTimestampInterval = timestamp - previousTimestamp;
          if (previousTimestampInterval < interval * 1000) {
            continue;
          }
        }
        previousTimestamp = timestamp;
        historyFilesToRead.push(historyFile);
        if (historyFilesToRead.length > maxTimestamps) {
          throw Error(
            `too many results (more than ${maxTimestamps}), add from=timestamp-seconds, to=timestamp-seconds and/or interval=seconds to your query`,
          );
        }
      }
    }

    // filter by url query params
    const promises = [];
    for (const historyFile of historyFilesToRead) {
      const getTimestampAndStats = async () => {
        const stats =
          historyRecentCache[historyFile] ||
          JSON.parse(await fs.readFile(`history/${historyFile}`, "utf8"));

        // filters
        let filteredStats;
        if (ipfsGatewayUrl) {
          filteredStats = {
            ...filteredStats,
            ipfsGateways: { [ipfsGatewayUrl]: stats.ipfsGateways[ipfsGatewayUrl] },
          };
        }
        if (communityAddress) {
          filteredStats = {
            ...filteredStats,
            communities: {
              [communityAddress]:
                stats.communities?.[communityAddress] || stats.subplebbits?.[communityAddress],
            },
            subplebbits: {
              [communityAddress]:
                stats.subplebbits?.[communityAddress] || stats.communities?.[communityAddress],
            },
          };
        }
        if (!filteredStats) {
          filteredStats = stats;
        }

        // include
        if (include?.length) {
          for (const propName in filteredStats) {
            if (!include.includes(propName)) {
              delete filteredStats[propName];
            }
          }
        }

        const timestamp = Math.round(toDate(historyFile).getTime() / 1000);
        return [timestamp, filteredStats];
      };
      promises.push(getTimestampAndStats());
    }
    const filteredHistory = await Promise.all(promises);

    const jsonResponse = JSON.stringify(filteredHistory);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonResponse);
  } catch (e) {
    console.log(e);
    res.status(404);
    res.send(e.message);
  }
});

// save history every 1min
setInterval(async () => {
  const history = await fetch(`http://127.0.0.1:${apiPort}`).then((res) => res.json());
  await fs.ensureDir("history");
  await fs.writeFile(`history/${new Date().toISOString()}`, JSON.stringify(history));
}, 1000 * 60);

// prometheus endpoint
app.get("/metrics/prometheus", async (req, res) => {
  try {
    const metricsResponse = await promClient.register.metrics();
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    res.write(metricsResponse);
  } catch (e) {
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    res.write(e.message);
  }
  res.end();
});
