// filters one /history snapshot; `stats` can be the cached snapshot other requests read too
export const filterHistoryStats = (stats, { ipfsGatewayUrl, communityAddress, include }) => {
  let filteredStats;
  if (ipfsGatewayUrl) {
    filteredStats = {
      ...filteredStats,
      ipfsGateways: { [ipfsGatewayUrl]: stats.ipfsGateways[ipfsGatewayUrl] },
    };
  }
  if (communityAddress) {
    filteredStats = {
      ...filteredStats,
      communities: {
        [communityAddress]:
          stats.communities?.[communityAddress] || stats.subplebbits?.[communityAddress],
      },
    };
  }
  if (!filteredStats) {
    // a copy, so the include filter below deletes keys from this response only
    filteredStats = { ...stats };
  }

  // include
  if (include?.length) {
    for (const propName in filteredStats) {
      if (!include.includes(propName)) {
        delete filteredStats[propName];
      }
    }
  }
  return filteredStats;
};
