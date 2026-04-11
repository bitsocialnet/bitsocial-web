import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { stripHtml } from "string-strip-html";
import { HttpsProxyAgent } from "https-proxy-agent";
import config from "../config.js";

export const fetchMultisubUrl = async (multisubUrl) => {
  // if url is a file, try to read the file
  if (!multisubUrl.startsWith("http")) {
    return JSON.parse(fs.readFileSync(multisubUrl, "utf8"));
  }

  console.log(`fetching multisub url '${multisubUrl}'`);
  let multisub;
  try {
    multisub = await fetchJson(multisubUrl);
  } catch (e) {
    throw Error(`failed fetching multisub from url '${multisubUrl}': ${e.message}`);
  }
  if (!Array.isArray(multisub.communities)) {
    throw Error(
      `failed fetching multisub from url '${multisubUrl}' got response '${JSON.stringify(multisub)
        .substring(0, 300)
        .replace(/\s*\n\s*/g, " ")}'`,
    );
  }
  return multisub;
};

export const fetchOptions = {
  agent: process.env.PROXY_URL ? new HttpsProxyAgent(process.env.PROXY_URL) : undefined,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
  },
};

export const fetchJson = async (url, options) => {
  const headers = {
    ...fetchOptions?.headers,
    ...options?.headers,
    "Content-Type": "application/json",
  };
  let textResponse = await fetch(url, { ...fetchOptions, ...options, headers }).then((res) =>
    res.text(),
  );
  try {
    const json = JSON.parse(textResponse);
    return json;
  } catch (e) {
    try {
      textResponse = stripHtml(textResponse).result;
    } catch (e) {}
    throw Error(
      `failed fetching got response '${textResponse.substring(0, 300).replace(/\s*\n\s*/g, " ")}'`,
    );
  }
};

export const fetchKuboRpc = async (url) => {
  let textResponse = await fetch(url, { ...fetchOptions, method: "POST" }).then((res) =>
    res.text(),
  );
  try {
    const json = textResponse
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => JSON.parse(line));
    return json;
  } catch (e) {
    try {
      textResponse = stripHtml(textResponse).result;
    } catch (e) {}
    throw Error(
      `failed fetching got response '${textResponse.substring(0, 300).replace(/\s*\n\s*/g, " ")}'`,
    );
  }
};

export const fetchHtml = async (url, options) => {
  const headers = { ...fetchOptions?.headers, ...options?.headers };
  const textResponse = await fetch(url, { ...fetchOptions, ...options, headers }).then((res) =>
    res.text(),
  );
  return textResponse;
};

export const fetchDhtPeers = async (cid) => {
  if (!cid) {
    throw Error(`can't fetch dht peers cid '${cid}' invalid`);
  }

  const fetchDhtPeersFromProvider = async (providerUrl, cid) => {
    try {
      let jsonResponse;
      let dhtPeers;
      // provider is ipfs api
      if (providerUrl.includes("api/v0")) {
        jsonResponse = await fetchKuboRpc(`${providerUrl}/routing/findprovs?arg=${cid}`);
        const dhtPeersMap = new Map();
        jsonResponse.forEach((line) =>
          line.Responses?.forEach((provider) => dhtPeersMap.set(provider.ID, provider)),
        );
        if (dhtPeersMap.size) {
          dhtPeers = [...dhtPeersMap.values()];
        }
      }
      // provider is ipfs gateway with delegated routing enabled
      else {
        jsonResponse = await fetchJson(`${providerUrl}/routing/v1/providers/${cid}`);
        dhtPeers = jsonResponse?.Providers;
        // no providers gives null, replace to empty array
        if (dhtPeers === null) {
          dhtPeers = [];
        }
      }
      if (!Array.isArray(dhtPeers)) {
        throw Error(
          `failed fetching got response '${JSON.stringify(jsonResponse)?.substring(0, 300)}'`,
        );
      }
      return dhtPeers;
    } catch (e) {
      throw Error(`failed fetching dht peers from url '${providerUrl}': ${e.message}`);
    }
  };

  if (!config.delegatedRoutingUrls?.length) {
    throw Error(`can't fetch dht peers, missing config.delegatedRoutingUrls`);
  }

  for (const [i, delegatedRoutingUrl] of config.delegatedRoutingUrls.entries()) {
    try {
      const dhtPeers = await fetchDhtPeersFromProvider(delegatedRoutingUrl, cid);
      return dhtPeers;
    } catch (e) {
      // if no more providers to try, throw
      if (i === config.delegatedRoutingUrls.length - 1) {
        throw e;
      }
    }
  }
};
// console.log(await fetchDhtPeers('bafkreic2vguwwzo4dddbxjas4pzlpbujxxi7erqfkwhmm2pls6c4q6iizm'))

export const fetchHttpRoutersPeers = async (cid) => {
  if (!cid) {
    throw Error(`can't fetch http routers peers cid '${cid}' invalid`);
  }

  const fetchHttpRouterPeers = async (httpRouterUrl, cid) => {
    try {
      let jsonResponse;
      let httpRouterPeers;
      jsonResponse = await fetchJson(`${httpRouterUrl}/routing/v1/providers/${cid}`);
      httpRouterPeers = jsonResponse?.Providers;
      // no providers gives null, replace to empty array
      if (httpRouterPeers === null) {
        httpRouterPeers = [];
      }
      if (!Array.isArray(httpRouterPeers)) {
        throw Error(
          `failed fetching got response '${JSON.stringify(jsonResponse)?.substring(0, 300)}'`,
        );
      }
      return httpRouterPeers;
    } catch (e) {
      throw Error(`failed fetching http router peers from url '${httpRouterUrl}': ${e.message}`);
    }
  };

  if (!config.pkcOptions?.httpRoutersOptions?.length) {
    throw Error(`can't fetch http routers peers, missing config.pkcOptions.httpRoutersOptions`);
  }

  // fetch all http routers concurrently
  const promises = config.pkcOptions.httpRoutersOptions.map((httpRouterUrl) =>
    fetchHttpRouterPeers(httpRouterUrl, cid),
  );
  const allResponses = await Promise.allSettled(promises);

  // remove duplicates
  const httpRoutersPeersMap = new Map();
  allResponses.forEach((res) =>
    res.value?.map?.((provider) => {
      httpRoutersPeersMap.set(provider.ID, provider);
    }),
  );

  // merge errors if any
  if (httpRoutersPeersMap.size === 0) {
    const httpRouterErrors = allResponses
      .map((res) => res.reason?.message)
      .filter((error) => error !== undefined);
    if (httpRouterErrors.length) {
      throw Error(httpRouterErrors.join(", "));
    }
  }

  return [...httpRoutersPeersMap.values()];
};
// test
// console.log(await fetchHttpRoutersPeers('bafkreic2vguwwzo4dddbxjas4pzlpbujxxi7erqfkwhmm2pls6c4q6iizm'))

import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { create as createMultihash } from "multiformats/hashes/digest";
const protobufPublicKeyPrefix = new Uint8Array([8, 1, 18, 32]);
const multihashIdentityCode = 0;
export const getCommunityIpnsNameFromPublicKey = (publicKeyBase64) => {
  const publicKeyBuffer = uint8ArrayFromString(publicKeyBase64, "base64");
  const publicKeyBufferWithPrefix = new Uint8Array(
    protobufPublicKeyPrefix.length + publicKeyBuffer.length,
  );
  publicKeyBufferWithPrefix.set(protobufPublicKeyPrefix, 0);
  publicKeyBufferWithPrefix.set(publicKeyBuffer, protobufPublicKeyPrefix.length);
  const multihash = createMultihash(multihashIdentityCode, publicKeyBufferWithPrefix).bytes;
  return uint8ArrayToString(multihash, "base58btc");
};

import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import { base32 } from "multiformats/bases/base32";

export const pubsubTopicToDhtKey = async (pubsubTopic) => {
  // pubsub topic dht key used by kubo is a cid of "floodsub:topic" https://github.com/libp2p/go-libp2p-pubsub/blob/3aa9d671aec0f777a7f668ca2b2ceb37218fb6bb/discovery.go#L328
  const string = `floodsub:${pubsubTopic}`;

  // convert string to same cid as kubo https://github.com/libp2p/go-libp2p/blob/024293c77e17794b0dd9dacec3032b4c5a535f64/p2p/discovery/routing/routing.go#L70
  const bytes = new TextEncoder().encode(string);
  const hash = await sha256.digest(bytes);
  const cidVersion = 1;
  const multicodec = 0x55;
  const cid = CID.create(cidVersion, multicodec, hash);
  return cid.toString(base32);
};

import PeerId from "peer-id";
const ipnsNamespaceBytes = new TextEncoder().encode("/ipns/");
export const ipnsNameToIpnsOverPubsubTopic = (ipnsName) => {
  // for ipns over pubsub, the topic is '/record/' + Base64Url(Uint8Array('/ipns/') + Uint8Array('12D...'))
  // https://github.com/ipfs/helia/blob/1561e4a106074b94e421a77b0b8776b065e48bc5/packages/ipns/src/routing/pubsub.ts#L169
  const ipnsNameBytes = PeerId.parse(ipnsName).toBytes(); // accepts base58 (12D...) and base36 (k51...)
  const ipnsNameBytesWithNamespace = new Uint8Array(
    ipnsNamespaceBytes.length + ipnsNameBytes.length,
  );
  ipnsNameBytesWithNamespace.set(ipnsNamespaceBytes, 0);
  ipnsNameBytesWithNamespace.set(ipnsNameBytes, ipnsNamespaceBytes.length);
  const pubsubTopic = "/record/" + uint8ArrayToString(ipnsNameBytesWithNamespace, "base64url");
  return pubsubTopic;
};
// pubsubTopicToDhtKey(ipnsNameToIpnsOverPubsubTopic('k51qzi5uqu5dktu25c6qau4i6tfftjeopmean34ca1db8t6gorp09xbaql0mjc')).then(console.log)
// 12D3KooWNMybS8JqELi38ZBX897PrjWbCrGoMKfw3bgoqzC2n1Dh and k51qzi5uqu5dktu25c6qau4i6tfftjeopmean34ca1db8t6gorp09xbaql0mjc should return bafkreic2vguwwzo4dddbxjas4pzlpbujxxi7erqfkwhmm2pls6c4q6iizm

export const stringToCid = async (string) => {
  const bytes = new TextEncoder().encode(string);
  const hash = await sha256.digest(bytes);
  const cidVersion = 1;
  const multicodec = 0x55;
  const cid = CID.create(cidVersion, multicodec, hash);
  return cid.toString(base32);
};

// the dht key used by libp2p relays (no longer in use, now try to use any known peer as a relay)
// https://github.com/libp2p/go-libp2p/blob/16de44aa7b4a3de2c24f1d966565f36eb69c5316/p2p/host/autorelay/relay_finder.go
const libp2pRelayRendezvous = "/libp2p/relay";
// const libp2pRelayRendezvousRoutingCid = await stringToCid(libp2pRelayRendezvous)
const libp2pRelayRendezvousRoutingCid =
  "bafkreibel3v5edjm2tebwxkkyj6hg5dcph2dnvrph32syrjkg2pg555wca";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");
export const getTimeAgo = (timestampSeconds) =>
  timestampSeconds ? timeAgo.format(timestampSeconds * 1000) : "never";

import net from "net";
let ownIp;
export const getOwnIp = async () => {
  if (ownIp) {
    return ownIp;
  }
  try {
    const res = await fetch("https://www.cloudflare.com/cdn-cgi/trace", fetchOptions).then((res) =>
      res.text(),
    );
    const ip = res.match(/ip=([^\n\r]+)/)[1];
    if (net.isIP(ip) !== 0) {
      ownIp = ip;
      return ownIp;
    }
  } catch (e) {}
  try {
    const res = await fetch("http://checkip.amazonaws.com", fetchOptions).then((res) => res.text());
    const ip = res.trim();
    if (net.isIP(ip) !== 0) {
      ownIp = ip;
      return ownIp;
    }
  } catch (e) {}
  throw Error("getOwnIp() failed");
};

export const createCounter = () => {
  const counts = {};
  const increment = (name) => {
    counts[name] = counts[name] === undefined ? 1 : counts[name] + 1;
    return counts[name];
  };
  return increment;
};
