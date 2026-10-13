import { CID } from "multiformats/cid";
import { equals as uint8ArrayEquals } from "uint8arrays/equals";

export const readJsonFromKubo = async (kubo, path, options) => {
  const chunks = [];
  for await (const chunk of kubo.cat(path, options)) {
    chunks.push(Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

// Some communities' stats blocks are provided only by peers this kubo node can't reach, while
// gateways serve them, as they do for the apps. A gateway's raw block is put into kubo, which
// hashes it, and is used only when that hash is the CID's, so a gateway can't alter the stats.
// kubo keys blocks by hash, so reading the CID then finds the block locally.
export const readCommunityStats = async (
  statsCid,
  {
    kubo,
    ipfsGatewayUrls = [],
    log,
    // kubo answers at once from its blockstore, but keeps searching for a block no reachable peer
    // provides until the client gives up
    kuboReadTimeoutMs = 1000 * 60,
    gatewayFetchTimeoutMs = 1000 * 30,
  },
) => {
  try {
    return await readJsonFromKubo(kubo, statsCid, {
      signal: AbortSignal.timeout(kuboReadTimeoutMs),
    });
  } catch (kuboError) {
    const { multihash } = CID.parse(statsCid);
    for (const ipfsGatewayUrl of ipfsGatewayUrls) {
      try {
        const response = await fetch(`${ipfsGatewayUrl}/ipfs/${statsCid}?format=raw`, {
          headers: { accept: "application/vnd.ipld.raw" },
          signal: AbortSignal.timeout(gatewayFetchTimeoutMs),
        });
        if (!response.ok) {
          throw Error(`status ${response.status}`);
        }
        const block = new Uint8Array(await response.arrayBuffer());
        const blockCid = await kubo.block.put(block);
        if (!uint8ArrayEquals(blockCid.multihash.bytes, multihash.bytes)) {
          throw Error(`got a block with a different hash (${blockCid})`);
        }
        return await readJsonFromKubo(kubo, statsCid, {
          signal: AbortSignal.timeout(kuboReadTimeoutMs),
        });
      } catch (e) {
        log?.(`failed to read stats '${statsCid}' from '${ipfsGatewayUrl}': ${e.message}`);
      }
    }
    throw kuboError;
  }
};
