// import the file to replace node-fetch first so it gets used in kubo and plebbit-js
// NOTE: this makes new version of viem not work, so don't do it anymore
// import './use-node-fetch.js'
import config from "../../config.js";
const pubsubKuboRpcUrl = config.pubsubKuboRpcUrl || config.kuboRpcUrl;
import { create as createKubo } from "kubo-rpc-client";
import { Agent as HttpsAgent } from "https";
import { Agent as HttpAgent } from "http";
import Plebbit from "@plebbit/plebbit-js";

const plebbitKuboRpc = await Plebbit({
  ...config.plebbitOptions,
  kuboRpcClientsOptions: [config.kuboRpcUrl],
  pubsubKuboRpcClientsOptions: [config.kuboRpcUrl],
});
plebbitKuboRpc.on("error", (error) => {
  // console.log(error) // logging plebbit errors are only useful for debugging, not production
});
const plebbitPubsubKuboRpc = await Plebbit({
  ...config.plebbitOptions,
  kuboRpcClientsOptions: [pubsubKuboRpcUrl],
  pubsubKuboRpcClientsOptions: [pubsubKuboRpcUrl],
});
plebbitPubsubKuboRpc.on("error", (error) => {
  // console.log(error) // logging plebbit errors are only useful for debugging, not production
});

const plebbit = await Plebbit(config.plebbitOptions);
plebbit.on("error", (error) => {
  // console.log(error) // logging plebbit errors are only useful for debugging, not production
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
  plebbit,
  plebbitKuboRpc,
  plebbitPubsubKuboRpc,
  pubsubKuboRpcUrl,
};
