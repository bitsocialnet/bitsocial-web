// Configures @pkcprotocol/pkc-js to run as a pure browser-libp2p client.
// Mirrors the relevant slice of 5chan's `src/lib/p2p-browser-config.ts`.
//
// `defaultPkcOptions` is read by @bitsocial/bitsocial-react-hooks when it
// lazily constructs its first PKC client, so we just attach the options to
// `window` before React mounts — no provider component required.

export const P2P_BROWSER_PKC_OPTIONS = {
  libp2pJsClientsOptions: [{ key: "libp2pjs" }],
  ipfsGatewayUrls: undefined,
  kuboRpcClientsOptions: undefined,
  pubsubHttpClientsOptions: undefined,
  pubsubKuboRpcClientsOptions: undefined,
  httpRoutersOptions: ["https://peers.pleb.bot", "https://peers.forumindex.com"],
} as const;

type P2PBrowserConfigWindow = {
  defaultPkcOptions?: Record<string, unknown>;
};

export function getBrowserPureP2PPkcOptions() {
  return {
    ...P2P_BROWSER_PKC_OPTIONS,
    libp2pJsClientsOptions: P2P_BROWSER_PKC_OPTIONS.libp2pJsClientsOptions.map((options) => ({
      ...options,
    })),
    httpRoutersOptions: [...P2P_BROWSER_PKC_OPTIONS.httpRoutersOptions],
  };
}

export function configureP2PBrowserPkcOptions(
  targetWindow: P2PBrowserConfigWindow | undefined = typeof window === "undefined"
    ? undefined
    : (window as unknown as P2PBrowserConfigWindow),
) {
  if (!targetWindow) return false;
  targetWindow.defaultPkcOptions = {
    ...targetWindow.defaultPkcOptions,
    ...getBrowserPureP2PPkcOptions(),
  };
  return true;
}
