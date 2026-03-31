const targetAddressCache = new Map();
const COMMUNITY_ALIAS_SUFFIX = ".bso";
const COMMUNITY_TARGET_SUFFIX = ".eth";

export const resolveCommunityTargetAddress = async (communityAddress) => {
  const cachedTargetAddress = targetAddressCache.get(communityAddress);
  if (cachedTargetAddress) {
    return cachedTargetAddress;
  }

  let targetAddress = communityAddress;
  if (communityAddress?.endsWith(COMMUNITY_ALIAS_SUFFIX)) {
    targetAddress =
      communityAddress.slice(0, -COMMUNITY_ALIAS_SUFFIX.length) + COMMUNITY_TARGET_SUFFIX;
  }

  targetAddressCache.set(communityAddress, targetAddress);
  return targetAddress;
};
