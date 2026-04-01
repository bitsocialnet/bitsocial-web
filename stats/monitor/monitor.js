import util from "util";
util.inspect.defaultOptions.depth = process.env.DEBUG_DEPTH;
import dotenv from "dotenv";
dotenv.config();
import yargs from "yargs/yargs";
import { getCliArgs } from "./lib/cli-args.js";
const argv = yargs(getCliArgs(process.argv)).parseSync();
console.log({ argv });
import fs from "fs-extra";
import fetch from "node-fetch";
import Debug from "debug";
Debug.enable("bitsocial-stats-monitor:*");

import { fetchClientCommunities } from "./lib/client-sources.js";
import config from "./config.js";
import monitorState from "./lib/monitor-state.js";
import { monitorSubplebbitsIpns } from "./lib/subplebbit-ipns.js";
import { monitorSubplebbitsPubsub } from "./lib/subplebbit-pubsub.js";
import { monitorIpfsGateways } from "./lib/ipfs-gateway.js";
import { monitorPubsubProviders } from "./lib/pubsub-provider.js";
import { monitorHttpRouters } from "./lib/http-router.js";
import { monitorPlebbitPreviewers } from "./lib/plebbit-previewer.js";
import { monitorChainProviders } from "./lib/chain-provider.js";
import { monitorWebpages } from "./lib/webpage.js";
import { monitorNfts } from "./lib/nft.js";
import { monitorPlebbitSeeders } from "./lib/plebbit-seeder.js";

// start server on port 3000
import "./lib/server.js";

if (!config?.monitoring?.clients?.length) {
  console.log(`missing config.js 'monitoring.clients'`);
  process.exit();
}

const multisubsIntervalMs = 1000 * 60 * 60;
const subplebbitsIpnsIntervalMs = 1000 * 60 * 10;
const subplebbitsPubsubIntervalMs = 1000 * 60 * 10;
const ipfsGatewaysIntervalMs = 1000 * 60 * 10;
const pubsubProvidersIntervalMs = 1000 * 60 * 10;
const httpRoutersIntervalMs = 1000 * 60 * 10;
const plebbitPreviewersIntervalMs = 1000 * 60 * 10;
const chainProvidersIntervalMs = 1000 * 60;
const webpagesIntervalMs = 1000 * 60 * 10;
const nftsIntervalMs = 1000 * 60 * 10;
const plebbitSeedersIntervalMs = 1000 * 60 * 10;
const monitoringNameAliases = {
  previewers: "plebbitPreviewers",
  seeders: "plebbitSeeders",
};

// fetch communities to monitor every hour
const getCommunitiesMonitoring = async () => {
  const communitiesMap = new Map();
  const promises = await Promise.allSettled(
    config.monitoring.clients.map((client) => fetchClientCommunities(client)),
  );
  for (const [i, response] of promises.entries()) {
    if (response.status !== "fulfilled") {
      console.log(
        `failed getting communities to monitor (${i + 1} of ${promises.length}): ${response.reason}`,
      );
      continue;
    }

    const { clientId, communities, errors } = response.value;
    for (const error of errors) {
      console.log(`warning loading '${clientId}' communities: ${error}`);
    }

    for (const community of communities) {
      if (!communitiesMap.has(community.address)) {
        communitiesMap.set(community.address, community);
      }
    }
  }

  // set initial state
  if (communitiesMap.size > 0) {
    monitorState.subplebbitsMonitoring = [...communitiesMap.values()];
    for (const community of monitorState.subplebbitsMonitoring) {
      monitorState.subplebbits[community.address] = {
        ...monitorState.subplebbits[community.address],
        address: community.address,
        communityAddress: community.communityAddress,
        targetAddress: community.targetAddress,
        clientId: community.clientId,
        directoryCode: community.directoryCode,
        resolutionError: community.resolutionError,
        title: community.title,
      };
    }
  }
};
setInterval(
  () => getCommunitiesMonitoring().catch((e) => console.log(e.message)),
  multisubsIntervalMs,
);

// refresh monitored communities at startup even if monitorState.json restored an older snapshot
await getCommunitiesMonitoring();

// fetch communities to monitor at least once before starting
while (!monitorState.subplebbitsMonitoring) {
  await getCommunitiesMonitoring();
  if (!monitorState.subplebbitsMonitoring) {
    console.log("retrying getting communities to monitor in 10 seconds");
    await new Promise((r) => setTimeout(r, 10000));
  }
}

const getMonitoringNames = (name) => [name, monitoringNameAliases[name]].filter(Boolean);
const isMonitoring = (name) => {
  const matchingNames = getMonitoringNames(name);
  return (
    matchingNames.includes(argv.only) ||
    (argv.only?.length || 0) < 1 ||
    argv.only.find?.((_name) => matchingNames.includes(_name))
  );
};
const isMonitoringOnly = (name) => {
  const matchingNames = getMonitoringNames(name);
  return (
    matchingNames.includes(argv.only) ||
    (argv.only?.length === 1 && matchingNames.includes(argv.only[0]))
  );
};

// fetch subplebbits ipns every 10min
if (isMonitoring("subplebbitsIpns")) {
  monitorSubplebbitsIpns().catch((e) => console.log(e.message));
  setInterval(
    () => monitorSubplebbitsIpns().catch((e) => console.log(e.message)),
    subplebbitsIpnsIntervalMs,
  );
}

// rejoin pubsub every 10min
if (isMonitoring("subplebbitsPubsub")) {
  setTimeout(
    () => {
      monitorSubplebbitsPubsub().catch((e) => console.log(e.message));
      setInterval(
        () => monitorSubplebbitsPubsub().catch((e) => console.log(e.message)),
        subplebbitsPubsubIntervalMs,
      );
    },
    isMonitoringOnly("subplebbitsPubsub") ? 1 : 1000 * 180,
  ); // wait for some pubsub topics to be fetched
}

// fetch ipfs gateways every 10min
if (isMonitoring("ipfsGateways")) {
  setTimeout(
    () => {
      monitorIpfsGateways().catch((e) => console.log(e.message));
      setInterval(
        () => monitorIpfsGateways().catch((e) => console.log(e.message)),
        ipfsGatewaysIntervalMs,
      );
    },
    isMonitoringOnly("ipfsGateways") ? 1 : 1000 * 60,
  ); // wait to not ddos ipfs gateways from monitorSubplebbitsIpns
}

// publish to pubsub providers every 10min
if (isMonitoring("pubsubProviders")) {
  monitorPubsubProviders().catch((e) => console.log(e.message));
  setInterval(
    () => monitorPubsubProviders().catch((e) => console.log(e.message)),
    pubsubProvidersIntervalMs,
  );
}

// fetch http routers every 10min
if (isMonitoring("httpRouters")) {
  setTimeout(
    () => {
      monitorHttpRouters().catch((e) => console.log(e.message));
      setInterval(
        () => monitorHttpRouters().catch((e) => console.log(e.message)),
        httpRoutersIntervalMs,
      );
    },
    isMonitoringOnly("httpRouters") ? 1 : 1000 * 120,
  ); // wait to not ddos http routers from monitorSubplebbitsIpns
}

// fetch plebbit seeders every 10min
if (isMonitoring("seeders")) {
  monitorPlebbitSeeders().catch((e) => console.log(e.message));
  setInterval(
    () => monitorPlebbitSeeders().catch((e) => console.log(e.message)),
    plebbitSeedersIntervalMs,
  );
}

// fetch plebbit previewers every 10min
if (isMonitoring("previewers")) {
  setTimeout(
    () => {
      monitorPlebbitPreviewers().catch((e) => console.log(e.message));
      setInterval(
        () => monitorPlebbitPreviewers().catch((e) => console.log(e.message)),
        plebbitPreviewersIntervalMs,
      );
    },
    isMonitoringOnly("previewers") ? 1 : 1000 * 60,
  ); // wait for some subplebbit.lastPostCid to be fetched
}

// fetch chain providers every 1min
if (isMonitoring("chainProviders")) {
  monitorChainProviders().catch((e) => console.log(e.message));
  setInterval(
    () => monitorChainProviders().catch((e) => console.log(e.message)),
    chainProvidersIntervalMs,
  );
}

// fetch webpages every 10min
if (isMonitoring("webpages")) {
  monitorWebpages().catch((e) => console.log(e.message));
  setInterval(() => monitorWebpages().catch((e) => console.log(e.message)), webpagesIntervalMs);
}

// fetch nfts every 10min
if (isMonitoring("nfts")) {
  monitorNfts().catch((e) => console.log(e.message));
  setInterval(() => monitorNfts().catch((e) => console.log(e.message)), nftsIntervalMs);
}
