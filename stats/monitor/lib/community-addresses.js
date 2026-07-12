import { BsoResolver } from "@bitsocial/bso-resolver";
import PQueue from "p-queue";
import config from "../config.js";

const bsoResolvers = config.bsoResolverProviders.map(
  (provider) => new BsoResolver({ key: `bso-${provider}`, provider }),
);
const resolutionQueue = new PQueue({ concurrency: 6 });

export const resolveCommunityTargetAddress = async (communityAddress, resolvers = bsoResolvers) => {
  if (!communityAddress?.toLowerCase().endsWith(".bso")) {
    return communityAddress;
  }

  return resolutionQueue.add(async () => {
    const errors = [];
    for (const resolver of resolvers) {
      try {
        const record = await resolver.resolve({ name: communityAddress });
        if (record?.publicKey) {
          return record.publicKey;
        }
        errors.push(`${resolver.provider}: bitsocial text record not found`);
      } catch (error) {
        errors.push(`${resolver.provider}: ${error?.message || String(error)}`);
      }
    }

    throw Error(`all BSO resolvers failed (${errors.join("; ")})`);
  });
};
