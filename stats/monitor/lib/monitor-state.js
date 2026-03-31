import fs from "fs";
import config from "../config.js";

// no initial state, the app state is set by importing this file and adding props to this object
let monitorState = {
  subplebbits: {},
  subplebbitsMonitoring: undefined, // keep undefined until monitor.js fetches multisubs to monitor
  ipfsGateways: {},
  pubsubProviders: {},
  httpRouters: {},
  plebbitPreviewers: {},
  chainProviders: {},
  webpages: {},
  nfts: {},
};

// try to load state from disk on startup
try {
  monitorState = JSON.parse(fs.readFileSync("monitorState.json", "utf8"));
} catch (e) {}

// migrate to new schema: make ipfsGateway commentFetchHistory a property
for (const ipfsGatewayUrl in monitorState.ipfsGateways) {
  if (Array.isArray(monitorState.ipfsGateways[ipfsGatewayUrl])) {
    monitorState.ipfsGateways[ipfsGatewayUrl] = {
      ...monitorState.ipfsGateways[ipfsGatewayUrl][
        monitorState.ipfsGateways[ipfsGatewayUrl].length - 1
      ],
      commentFetchHistory: monitorState.ipfsGateways[ipfsGatewayUrl],
    };
  }
}

// migrate to new schema: add http routers
if (!monitorState.httpRouters) {
  monitorState.httpRouters = {};
}

// migrate to new schema: add plebbit previewers
if (!monitorState.plebbitPreviewers) {
  monitorState.plebbitPreviewers = {};
}

// migrate to new schema: remove ipfsGateway commentFetchHistory
for (const ipfsGatewayUrl in monitorState.ipfsGateways) {
  if (monitorState.ipfsGateways[ipfsGatewayUrl].commentFetchHistory) {
    delete monitorState.ipfsGateways[ipfsGatewayUrl];
  }
}

// migrate to new schema: add chain providers
if (!monitorState.chainProviders) {
  monitorState.chainProviders = {};
}

// migrate to new schema: add webpages
if (!monitorState.webpages) {
  monitorState.webpages = {};
}

// migrate to new schema: add nfts
if (!monitorState.nfts) {
  monitorState.nfts = {};
}

// migrate to new schema: add pubsub providers
if (!monitorState.pubsubProviders) {
  monitorState.pubsubProviders = {};
}

// migrate to new schema: add plebbit seeders
if (!monitorState.plebbitSeeders) {
  monitorState.plebbitSeeders = {};
}

export default monitorState;

// save state to disk every 1min
setInterval(() => {
  if (config.monitorState?.writeFile !== false) {
    fs.writeFileSync("monitorState.json", JSON.stringify(monitorState, null, 2));
  }
}, 1000 * 60);
