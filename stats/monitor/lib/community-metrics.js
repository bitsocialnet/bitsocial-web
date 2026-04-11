import monitorState from "./monitor-state.js";

const sharedCommunityMetricLabelNames = ["client_id", "community_address"];

export const getCommunityMetricLabelNames = (additionalLabelNames = []) => [
  ...additionalLabelNames,
  ...sharedCommunityMetricLabelNames,
];

export const getCommunityMetricLabels = (communityAddress, additionalLabels = {}) => ({
  ...additionalLabels,
  client_id: monitorState.communities[communityAddress]?.clientId || "unknown",
  community_address: communityAddress,
});
