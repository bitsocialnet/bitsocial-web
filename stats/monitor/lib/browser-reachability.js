// Alerts when browsers lose their only path to the peers that provide community records. The
// per-community browser-dialable gauges show that on a dashboard; on 2026-10-31 nobody was looking
// (issue #55). Each run dials every listed provider again, the way a browser does.
import dns from "node:dns/promises";
import { getBrowserWssUrls, probeWss } from "./browser-dialable.js";

// one run every 5 minutes, so an alert lands about 15 minutes after the path breaks
const defaultFailuresBeforeAlert = 3;

const resolvesInDns = async (hostname) => {
  try {
    await dns.lookup(hostname);
    return true;
  } catch {
    return false;
  }
};

export const createBrowserReachabilityMonitor = ({
  getCommunities,
  getSeederPeerIds = () => [],
  notify,
  probe = probeWss,
  resolveHost = resolvesInDns,
  failuresBeforeAlert = defaultFailuresBeforeAlert,
}) => {
  const consecutiveFailures = new Map();
  const countFailure = (id, failing) => {
    const count = failing ? (consecutiveFailures.get(id) || 0) + 1 : 0;
    consecutiveFailures.set(id, count);
    return count;
  };
  // A failure count under the threshold reports nothing, so the alert keeps its state. That state
  // survives a restart in monitorState and these counts don't: reporting "up" there would send a
  // false recovery for an outage that is still going.
  const report = (failures, notification) =>
    failures > 0 && failures < failuresBeforeAlert
      ? undefined
      : notify({ ...notification, ok: failures === 0 });

  return async () => {
    // the providers the routers listed for each community's latest record, merged per peer
    const peers = new Map();
    const communityPeerIds = [];
    for (const [address, community] of Object.entries(getCommunities() || {})) {
      // undefined until the routers answered for this community's record
      if (!Array.isArray(community?.ipnsCidHttpRoutersPeers)) {
        continue;
      }
      const providers = community.ipnsCidHttpRoutersPeers.filter((peer) => peer?.ID);
      communityPeerIds.push({ address, peerIds: providers.map((peer) => peer.ID) });
      for (const provider of providers) {
        const peer = peers.get(provider.ID) || { urls: new Set(), communities: 0 };
        for (const url of getBrowserWssUrls(provider.Addrs)) {
          peer.urls.add(url);
        }
        peer.communities++;
        peers.set(provider.ID, peer);
      }
    }
    // no router has answered for any record yet (startup); routers that answer with no provider
    // at all are a failed check, not a skipped one
    if (!communityPeerIds.length) {
      return;
    }

    const urls = [...new Set([...peers.values()].flatMap((peer) => [...peer.urls]))];
    const dialed = new Map(
      await Promise.all(urls.map(async (url) => [url, await probe(url).catch(() => false)])),
    );
    const isDialable = (peerId) =>
      [...(peers.get(peerId)?.urls || [])].some((url) => dialed.get(url));
    const describeFailedUrls = async (failedUrls) =>
      Promise.all(
        failedUrls.map(async (url) => {
          const resolves = await resolveHost(new URL(url).hostname);
          return `${url} ${resolves ? "dial failed" : "name does not resolve"}`;
        }),
      );

    const reachableCommunities = communityPeerIds.filter(({ peerIds }) => peerIds.some(isDialable));
    const networkFailures = countFailure("network", reachableCommunities.length === 0);
    const failedUrls = urls.filter((url) => !dialed.get(url));
    let networkFailureReason = "Every secure WebSocket address failed";
    if (!peers.size) {
      networkFailureReason = "The routers list no provider for any of their records";
    } else if (!urls.length) {
      networkFailureReason = "No provider lists a secure WebSocket address";
    }
    await report(networkFailures, {
      id: "browserReachability:network",
      label: "Browser reachability of community records",
      summary: networkFailures
        ? `No browser can reach a provider of any of the ${communityPeerIds.length} monitored communities. ${networkFailureReason}, ${networkFailures} checks in a row.`
        : `Browsers can reach a provider for ${reachableCommunities.length} of ${communityPeerIds.length} monitored communities.`,
      details: networkFailures
        ? (await describeFailedUrls(failedUrls.slice(0, 10))).join("\n")
        : "",
    });

    for (const peerId of getSeederPeerIds() || []) {
      const peer = peers.get(peerId);
      const dialable = isDialable(peerId);
      const failures = countFailure(`seeder:${peerId}`, !dialable);
      let summary = `Browsers can dial the seeder, which provides ${peer?.communities} community records.`;
      let details = "";
      if (!peer) {
        summary = `No HTTP router lists the seeder as a provider of any monitored community record, ${failures} checks in a row. It stopped providing or its records expired.`;
      } else if (!peer.urls.size) {
        summary = `The routers list the seeder with no secure WebSocket address, so no browser can dial it, ${failures} checks in a row.`;
      } else if (!dialable) {
        summary = `No browser can dial the seeder: all ${peer.urls.size} secure WebSocket addresses failed, ${failures} checks in a row.`;
        details = (await describeFailedUrls([...peer.urls])).join("\n");
      }
      await report(failures, {
        id: `browserReachability:seeder:${peerId}`,
        label: `Seeder ${peerId}`,
        summary,
        details,
      });
    }
  };
};
