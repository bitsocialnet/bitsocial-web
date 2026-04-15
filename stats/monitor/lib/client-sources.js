import fs from "fs";
import path from "path";
import { fetchJson } from "./utils.js";
import { resolveCommunityTargetAddress } from "./community-addresses.js";

const readJsonSource = async (source) => {
  if (source.startsWith("http")) {
    return fetchJson(source);
  }

  const sourcePath = path.resolve(process.cwd(), source);
  return JSON.parse(fs.readFileSync(sourcePath, "utf8"));
};

const normalizeDirectory = async (clientId, directory) => {
  const communityAddress = directory?.communityAddress || directory?.name;
  if (typeof communityAddress !== "string") {
    throw Error(`client '${clientId}' directory is missing communityAddress/name`);
  }

  let targetAddress = communityAddress;
  let resolutionError;
  try {
    targetAddress = await resolveCommunityTargetAddress(communityAddress);
  } catch (error) {
    resolutionError = error?.message || String(error);
  }

  return {
    address: communityAddress,
    communityAddress,
    targetAddress,
    title: directory.title,
    directoryCode: directory.directoryCode,
    clientId,
    resolutionError,
  };
};

export const fetchClientCommunities = async (client) => {
  if (typeof client?.id !== "string") {
    throw Error(`invalid monitoring client config: missing id`);
  }
  if (!Array.isArray(client?.sources) || client.sources.length === 0) {
    throw Error(`client '${client.id}' is missing monitoring sources`);
  }

  const sourceResponses = await Promise.allSettled(
    client.sources.map((source) => readJsonSource(source)),
  );
  const communities = [];
  const errors = [];

  for (const [index, response] of sourceResponses.entries()) {
    if (response.status === "rejected") {
      errors.push(`source ${index + 1}: ${response.reason?.message || response.reason}`);
      continue;
    }

    const directoryList = response.value;
    if (!Array.isArray(directoryList?.directories)) {
      errors.push(`source ${index + 1}: missing directories array`);
      continue;
    }

    const resolvedDirectories = await Promise.all(
      directoryList.directories.map((directory) => normalizeDirectory(client.id, directory)),
    );
    for (const community of resolvedDirectories) {
      if (community.resolutionError) {
        errors.push(
          `source ${index + 1}: failed resolving '${community.communityAddress}' (${community.resolutionError})`,
        );
      }
      communities.push(community);
    }
  }

  if (communities.length === 0) {
    throw Error(`failed fetching monitoring communities for '${client.id}' (${errors.join("; ")})`);
  }

  return { clientId: client.id, communities, errors };
};
