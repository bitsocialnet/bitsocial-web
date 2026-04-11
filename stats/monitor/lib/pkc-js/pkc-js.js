// import the file to replace node-fetch first so it gets used in kubo and the upstream PKC client
// NOTE: this makes new version of viem not work, so don't do it anymore
// import './use-node-fetch.js'
import config from "../../config.js";
const pubsubKuboRpcUrl = config.pubsubKuboRpcUrl || config.kuboRpcUrl;
import { create as createKubo } from "kubo-rpc-client";
import { Agent as HttpsAgent } from "https";
import { Agent as HttpAgent } from "http";
import createPkcClient from "@plebbit/plebbit-js";

const pkcKuboRpc = await createPkcClient({
  ...config.pkcOptions,
  kuboRpcClientsOptions: [config.kuboRpcUrl],
  pubsubKuboRpcClientsOptions: [config.kuboRpcUrl],
});
pkcKuboRpc.on("error", (error) => {
  // console.log(error) // upstream client errors are only useful for debugging, not production
});
const pkcPubsubKuboRpc = await createPkcClient({
  ...config.pkcOptions,
  kuboRpcClientsOptions: [pubsubKuboRpcUrl],
  pubsubKuboRpcClientsOptions: [pubsubKuboRpcUrl],
});
pkcPubsubKuboRpc.on("error", (error) => {
  // console.log(error) // upstream client errors are only useful for debugging, not production
});

const pkc = await createPkcClient(config.pkcOptions);
pkc.on("error", (error) => {
  // console.log(error) // upstream client errors are only useful for debugging, not production
});

const Agent = config.kuboRpcUrl?.startsWith("https") ? HttpsAgent : HttpAgent;
const kubo = await createKubo({
  url: config.kuboRpcUrl,
  agent: new Agent({ keepAlive: true, maxSockets: Infinity }),
});
const kuboPubsub = await createKubo({
  url: pubsubKuboRpcUrl,
  agent: new Agent({ keepAlive: true, maxSockets: Infinity }),
});

const kuboPubsubProviders = {};
for (const pubsubProviderUrl of config.monitoring.pubsubProviderUrls || []) {
  const Agent = pubsubProviderUrl.startsWith("https") ? HttpsAgent : HttpAgent;
  kuboPubsubProviders[pubsubProviderUrl] = await createKubo({
    url: pubsubProviderUrl,
    agent: new Agent({ keepAlive: true, maxSockets: Infinity }),
  });
}

export {
  kubo,
  kuboPubsub,
  kuboPubsubProviders,
  pkc,
  pkcKuboRpc,
  pkcPubsubKuboRpc,
  pubsubKuboRpcUrl,
};
