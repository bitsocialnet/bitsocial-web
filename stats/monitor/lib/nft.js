import config from "../config.js";
import monitorState from "./monitor-state.js";
import { fetchJson, fetchOptions, createCounter } from "./utils.js";
import prometheus from "./prometheus.js";
import Debug from "debug";
const debug = Debug("bitsocial-stats-monitor:nft");

const initNftMonitorState = (nft) => {
  if (!monitorState.nfts[nft.name]) {
    monitorState.nfts[nft.name] = {};
  }
  if (!monitorState.nfts[nft.name].ipfsGatewayFetches) {
    monitorState.nfts[nft.name].ipfsGatewayFetches = {};
  }
};

export const monitorNfts = async () => {
  debug(
    `monitoring ${config.monitoring.nfts?.length} nfts: ${config.monitoring.nfts?.map((nft) => nft.name).join(" ")}`,
  );
  for (const nft of config.monitoring.nfts || []) {
    initNftMonitorState(nft);

    // nft ipfs gateway fetches
    for (const ipfsGatewayUrl of nft.ipfsGatewayUrls || []) {
      getIpfsGatewayFetchStats(nft, ipfsGatewayUrl)
        .then((stats) => {
          monitorState.nfts[nft.name].ipfsGatewayFetches[ipfsGatewayUrl] = stats;
          prometheusObserveIpfsGatewayFetch(nft, ipfsGatewayUrl, stats);
        })
        .catch((e) => debug(e.message));
    }
  }
};

const getRandomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const countIpfsGatewayFetch = createCounter();
const getIpfsGatewayFetchStats = async (nft, ipfsGatewayUrl) => {
  if (!nft?.baseUri) {
    throw Error(`failed fetching nft '${nft?.name}' from ipfs gateway missing config nft.baseUri`);
  }
  if (!nft?.totalSupply) {
    throw Error(
      `failed fetching nft '${nft?.name}' from ipfs gateway missing config nft.totalSupply`,
    );
  }

  const cid = nft.baseUri.replace("ipfs://", "").replaceAll("/", "");
  let randomTokenId = getRandomNumberBetween(1, nft.totalSupply);
  if (nft.tokenUriSuffix) {
    randomTokenId += nft.tokenUriSuffix;
  }
  const nftMetadataUrl = `${ipfsGatewayUrl}/ipfs/${cid}/${randomTokenId}`;

  let lastIpfsGatewayFetchSuccess = false;
  let lastIpfsGatewayFetchTime;

  const beforeTimestamp = Date.now();
  let nftImageUrl;
  let attempts = 3;
  while (attempts--) {
    try {
      const nftMetadata = await fetchJson(nftMetadataUrl);
      if (!nftMetadata.image) {
        throw Error(
          `failed fetching got response '${JSON.stringify(nftMetadata).substring(0, 300)}'`,
        );
      }
      if (!nftMetadata.image.startsWith?.("ipfs://")) {
        throw Error(
          `failed fetching got response nftMetadata.image '${nftMetadata.image}' is not ipfs`,
        );
      }
      nftImageUrl = `${ipfsGatewayUrl}/${nftMetadata.image.replace("://", "/")}`;
      const time = (Date.now() - beforeTimestamp) / 1000;
      debug(`fetched nft '${nft.name}' metadata from ipfs gateway '${nftMetadataUrl}' in ${time}s`);
      break;
    } catch (e) {
      if (!attempts) {
        debug(
          `failed fetching nft '${nft.name}' metadata from ipfs gateway '${nftMetadataUrl}': ${e.message}`,
        );
      }
    }
  }

  if (nftImageUrl) {
    attempts = 3;
    while (attempts--) {
      try {
        const res = await fetch(nftImageUrl, fetchOptions);
        const textResponse = await res.text(); // always check how long it takes to download
        if (res.status !== 200) {
          throw Error(
            `failed fetching got response '${textResponse.substring(0, 300).replace(/\s*\n\s*/g, " ")}'`,
          );
        }
        lastIpfsGatewayFetchSuccess = true;
        lastIpfsGatewayFetchTime = (Date.now() - beforeTimestamp) / 1000;

        debug(
          `fetched nft '${nft.name}' image from ipfs gateway '${nftImageUrl}' in ${lastIpfsGatewayFetchTime}s`,
        );
        break;
      } catch (e) {
        if (!attempts) {
          debug(
            `failed fetching nft '${nft.name}' image from ipfs gateway '${nftImageUrl}': ${e.message}`,
          );
        }
      }
    }
  }

  return {
    ipfsGatewayFetchCount: countIpfsGatewayFetch(ipfsGatewayUrl + nft.name),
    lastIpfsGatewayFetchSuccess,
    lastIpfsGatewayFetchTime,
  };
};
// test
// debug(await getIpfsGatewayFetchStats({name: 'ExosPlebs', baseUri: 'Qmakn3p9v7EBo2VXkPitPqPMVzdZ1wpghaF5fPCHg1nePa', totalSupply: 10000}, 'https://ipfs.io'))
// debug(await getIpfsGatewayFetchStats({name: 'BoredApeYachtClub', baseUri: 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq', totalSupply: 10000}, 'https://ipfs.io'))

// test
// monitorNfts(); setInterval(() => monitorNfts(), 1000 * 60 * 10)

// prometheus
const ipfsGatewayFetchLabelNames = ["nft_name", "ipfs_gateway_url"];
const counters = {
  ipfsGatewayFetchCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}nft_ipfs_gateway_fetch_count`,
    help: `count of nfts ipfs gateway fetch labeled with: ${ipfsGatewayFetchLabelNames.join(", ")}`,
    labelNames: ipfsGatewayFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  ipfsGatewayFetchDurationSeconds: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}nft_ipfs_gateway_fetch_duration_seconds_sum`,
    help: `count of nfts ipfs gateway fetch duration seconds labeled with: ${ipfsGatewayFetchLabelNames.join(", ")}`,
    labelNames: ipfsGatewayFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  ipfsGatewayFetchSuccessCount: new prometheus.promClient.Counter({
    name: `${prometheus.prefix}nft_ipfs_gateway_fetch_success_count`,
    help: `count of nfts ipfs gateway fetch success labeled with: ${ipfsGatewayFetchLabelNames.join(", ")}`,
    labelNames: ipfsGatewayFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const gauges = {
  lastIpfsGatewayFetchDurationSeconds: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}nft_last_ipfs_gateway_fetch_duration_seconds`,
    help: `duration gauge of last nfts ipfs gateway fetch labeled with: ${ipfsGatewayFetchLabelNames.join(", ")}`,
    labelNames: ipfsGatewayFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
  lastIpfsGatewayFetchSuccess: new prometheus.promClient.Gauge({
    name: `${prometheus.prefix}nft_last_ipfs_gateway_fetch_success`,
    help: `success gauge of last nfts ipfs gateway fetch labeled with: ${ipfsGatewayFetchLabelNames.join(", ")}`,
    labelNames: ipfsGatewayFetchLabelNames,
    registers: [prometheus.promClient.register],
  }),
};
const isNumber = (number) => typeof number === "number" && isFinite(number);
const prometheusObserveIpfsGatewayFetch = (nft, ipfsGatewayUrl, stats) => {
  const labels = { nft_name: nft.name, ipfs_gateway_url: ipfsGatewayUrl };
  // counters
  counters.ipfsGatewayFetchCount.inc(labels, 1);
  if (stats.lastIpfsGatewayFetchSuccess) {
    counters.ipfsGatewayFetchSuccessCount.inc(labels, 1);
  }
  if (isNumber(stats.lastIpfsGatewayFetchTime)) {
    counters.ipfsGatewayFetchDurationSeconds.inc(labels, stats.lastIpfsGatewayFetchTime);
  }
  // gauges
  if (isNumber(stats.lastIpfsGatewayFetchTime)) {
    gauges.lastIpfsGatewayFetchDurationSeconds.set(labels, stats.lastIpfsGatewayFetchTime);
  }
  gauges.lastIpfsGatewayFetchSuccess.set(labels, stats.lastIpfsGatewayFetchSuccess ? 1 : 0);
};
