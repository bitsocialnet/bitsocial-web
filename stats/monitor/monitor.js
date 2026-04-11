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
import { monitorCommunitiesIpns } from "./lib/community-ipns.js";
import { monitorCommunitiesPubsub } from "./lib/community-pubsub.js";
import { monitorIpfsGateways } from "./lib/ipfs-gateway.js";
import { monitorPubsubProviders } from "./lib/pubsub-provider.js";
import { monitorHttpRouters } from "./lib/http-router.js";
import { monitorPkcPreviewers } from "./lib/pkc-previewer.js";
import { monitorChainProviders } from "./lib/chain-provider.js";
import { monitorWebpages } from "./lib/webpage.js";
import { monitorNfts } from "./lib/nft.js";
import { monitorPkcSeeders } from "./lib/pkc-seeder.js";

// start server on port 3000
import "./lib/server.js";

if (!config?.monitoring?.clients?.length) {
  console.log(`missing config.js 'monitoring.clients'`);
  process.exit();
}

const multisubsIntervalMs = 1000 * 60 * 60;
const communitiesIpnsIntervalMs = 1000 * 60 * 10;
const communitiesPubsubIntervalMs = 1000 * 60 * 10;
const ipfsGatewaysIntervalMs = 1000 * 60 * 10;
const pubsubProvidersIntervalMs = 1000 * 60 * 10;
const httpRoutersIntervalMs = 1000 * 60 * 10;
const pkcPreviewersIntervalMs = 1000 * 60 * 10;
const chainProvidersIntervalMs = 1000 * 60;
const webpagesIntervalMs = 1000 * 60 * 10;
const nftsIntervalMs = 1000 * 60 * 10;
const pkcSeedersIntervalMs = 1000 * 60 * 10;
const monitoringNameAliases = {
  previewers: "pkcPreviewers",
  seeders: "pkcSeeders",
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
    monitorState.communitiesMonitoring = [...communitiesMap.values()];
    for (const community of monitorState.communitiesMonitoring) {
      monitorState.communities[community.address] = {
        ...monitorState.communities[community.address],
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
while (!monitorState.communitiesMonitoring) {
  await getCommunitiesMonitoring();
  if (!monitorState.communitiesMonitoring) {
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

// fetch communities ipns every 10min
if (isMonitoring("communitiesIpns")) {
  monitorCommunitiesIpns().catch((e) => console.log(e.message));
  setInterval(
    () => monitorCommunitiesIpns().catch((e) => console.log(e.message)),
    communitiesIpnsIntervalMs,
  );
}

// rejoin pubsub every 10min
if (isMonitoring("communitiesPubsub")) {
  setTimeout(
    () => {
      monitorCommunitiesPubsub().catch((e) => console.log(e.message));
      setInterval(
        () => monitorCommunitiesPubsub().catch((e) => console.log(e.message)),
        communitiesPubsubIntervalMs,
      );
    },
    isMonitoringOnly("communitiesPubsub") ? 1 : 1000 * 180,
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
  ); // wait to not ddos ipfs gateways from monitorCommunitiesIpns
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
  ); // wait to not ddos http routers from monitorCommunitiesIpns
}

// fetch pkc seeders every 10min
if (isMonitoring("seeders")) {
  setTimeout(
    () => {
      monitorPkcSeeders().catch((e) => console.log(e.message));
      setInterval(
        () => monitorPkcSeeders().catch((e) => console.log(e.message)),
        pkcSeedersIntervalMs,
      );
    },
    isMonitoringOnly("seeders") ? 1 : 1000 * 30,
  ); // wait for community update cids from monitorCommunitiesIpns
}

// fetch previewers every 10min
if (isMonitoring("previewers")) {
  setTimeout(
    () => {
      monitorPkcPreviewers().catch((e) => console.log(e.message));
      setInterval(
        () => monitorPkcPreviewers().catch((e) => console.log(e.message)),
        pkcPreviewersIntervalMs,
      );
    },
    isMonitoringOnly("previewers") ? 1 : 1000 * 60,
  ); // wait for some community.lastPostCid to be fetched
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
