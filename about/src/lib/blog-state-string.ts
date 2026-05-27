// Builds a human-readable loading state string for the blog feed.
//
// Adapted from 5chan's `src/hooks/use-state-string.ts` but specialised for the
// blog page's single community. We surface lifecycle states like
// "Resolving address" / "Downloading blog" / "Downloading post" with a
// "from peers" suffix because the page runs as a browser-libp2p client.

import { useMemo } from "react";
import { useClientsStates } from "@bitsocial/bitsocial-react-hooks";

type CommentOrCommunity =
  | {
      state?: string;
      publishingState?: string;
      updatingState?: string;
    }
  | undefined;

const FRIENDLY_STATE_NAMES: Record<string, string> = {
  "fetching-ipns": "downloading blog",
  "fetching-ipfs": "downloading post",
  "fetching-community-ipns": "downloading blog",
  "fetching-community-ipfs": "downloading blog",
  "fetching-update-ipfs": "downloading update",
  "resolving-address": "resolving address",
  "resolving-community-address": "resolving blog address",
  "resolving-author-address": "resolving author address",
};

const INACTIVE_LIFECYCLE_STATES = new Set(["failed", "ready", "stopped", "succeeded"]);

function getFriendlyStateName(state: string): string {
  return (
    FRIENDLY_STATE_NAMES[state] ??
    state
      .split("-")
      .join(" ")
      .replace("ipfs", "post")
      .replace("ipns", "blog")
      .replace("fetching", "downloading")
  );
}

function getActiveLifecycleState(commentOrCommunity: CommentOrCommunity): string | undefined {
  if (!commentOrCommunity || commentOrCommunity.state === "succeeded") return undefined;
  const candidates = [
    commentOrCommunity.publishingState,
    commentOrCommunity.updatingState,
    commentOrCommunity.state,
  ];
  return candidates.find((state) => state && !INACTIVE_LIFECYCLE_STATES.has(state));
}

const isBrowserLibp2pClient = (clientUrl: string) => clientUrl === "libp2pjs";

function getSourceSuffix(clientUrls: string[]): string {
  if (clientUrls.length === 0) return " from peers";
  return clientUrls.every(isBrowserLibp2pClient) ? " from peers" : " via IPFS";
}

export function useBlogLoadingState(community: CommentOrCommunity): string | undefined {
  const { states } = useClientsStates({ comment: community }) as {
    states: Record<string, string[]>;
  };

  return useMemo(() => {
    const resolvingParts: string[] = [];
    const downloadingParts: string[] = [];
    const downloadingClientUrls: string[] = [];

    for (const stateName in states) {
      if (!states[stateName] || states[stateName].length === 0) continue;
      const friendly = getFriendlyStateName(stateName);
      if (stateName.includes("resolving")) {
        resolvingParts.push(friendly);
      } else {
        downloadingParts.push(friendly);
        downloadingClientUrls.push(...states[stateName]);
      }
    }

    let stateString = "";
    if (resolvingParts.length > 0) stateString = resolvingParts.join(", ");
    if (downloadingParts.length > 0) {
      if (stateString) stateString += ", ";
      stateString += downloadingParts.join(", ") + getSourceSuffix(downloadingClientUrls);
    }

    if (!stateString) {
      const lifecycle = getActiveLifecycleState(community);
      if (lifecycle) {
        const isIpfsRelated = lifecycle.includes("ipfs") || lifecycle.includes("ipns");
        stateString = getFriendlyStateName(lifecycle);
        if (isIpfsRelated) stateString += getSourceSuffix([]);
      }
    }

    if (!stateString) return undefined;
    return stateString.charAt(0).toUpperCase() + stateString.slice(1);
  }, [states, community]);
}
