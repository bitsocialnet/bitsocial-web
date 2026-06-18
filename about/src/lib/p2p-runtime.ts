import {
  canUsePureP2PBrowser,
  getBrowserGatewayPkcOptions,
  getBrowserPureP2PPkcOptions,
  getPureP2PBrowserPreference,
  isElectronRuntime,
  shouldUsePureP2PBrowser,
  type P2PBrowserConfigWindow,
} from "@/lib/p2p-browser-config";

export type P2PRuntimeMode = "browser-libp2p" | "electron-kubo-rpc" | "full-node-rpc";

type AccountProtocolOptions = {
  httpRoutersOptions?: string[];
  ipfsGatewayUrls?: string[];
  kuboRpcClientsOptions?: unknown[];
  libp2pJsClientsOptions?: unknown[];
  pkcRpcClientsOptions?: string[];
  pubsubHttpClientsOptions?: unknown[];
  pubsubKuboRpcClientsOptions?: unknown[];
};

type AccountShape = {
  pkc?: {
    clients?: {
      libp2pJsClients?: Record<string, unknown>;
      pkcRpcClients?: Record<string, unknown>;
    };
  };
  pkcOptions?: AccountProtocolOptions;
};

const toAccountShape = (account: unknown) => account as AccountShape | undefined;

const hasArrayItems = (value: unknown) => Array.isArray(value) && value.length > 0;

const hasObjectItems = (value: unknown) =>
  !!value && typeof value === "object" && Object.keys(value).length > 0;

const hasMixedBrowserPureP2POptions = (protocolOptions: AccountProtocolOptions | undefined) =>
  hasArrayItems(protocolOptions?.libp2pJsClientsOptions) &&
  (hasArrayItems(protocolOptions?.kuboRpcClientsOptions) ||
    hasArrayItems(protocolOptions?.pubsubKuboRpcClientsOptions));

export const getP2PRuntimeMode = (
  account?: unknown,
  targetWindow?: P2PBrowserConfigWindow,
): P2PRuntimeMode | null => {
  const accountShape = toAccountShape(account);
  const protocolOptions = accountShape?.pkcOptions;
  const clients = accountShape?.pkc?.clients;

  if (
    hasArrayItems(protocolOptions?.libp2pJsClientsOptions) ||
    hasObjectItems(clients?.libp2pJsClients)
  ) {
    return "browser-libp2p";
  }

  if (
    hasArrayItems(protocolOptions?.pkcRpcClientsOptions) ||
    hasObjectItems(clients?.pkcRpcClients)
  ) {
    return isElectronRuntime(targetWindow) ? "electron-kubo-rpc" : "full-node-rpc";
  }

  return null;
};

const canConfigureBrowserPureP2P = (targetWindow?: P2PBrowserConfigWindow) =>
  canUsePureP2PBrowser(targetWindow);

export const isBrowserPureP2PEnabled = (
  account?: unknown,
  targetWindow?: P2PBrowserConfigWindow,
) => {
  if (!canConfigureBrowserPureP2P(targetWindow)) return false;
  if (getPureP2PBrowserPreference(targetWindow) === false) return false;
  if (getP2PRuntimeMode(account, targetWindow) === "browser-libp2p") return true;
  return shouldUsePureP2PBrowser(targetWindow);
};

export const getBrowserPureP2PAccountOptions = (account?: unknown) => ({
  ...toAccountShape(account)?.pkcOptions,
  ...getBrowserPureP2PPkcOptions(),
  pkcRpcClientsOptions: undefined,
});

export const shouldUpgradeBrowserPureP2PAccount = (
  account?: unknown,
  targetWindow?: P2PBrowserConfigWindow,
) => {
  if (
    !account ||
    typeof account !== "object" ||
    !canConfigureBrowserPureP2P(targetWindow) ||
    !isBrowserPureP2PEnabled(account, targetWindow)
  ) {
    return false;
  }

  const protocolOptions = toAccountShape(account)?.pkcOptions;
  return (
    getP2PRuntimeMode(account, targetWindow) === null ||
    hasMixedBrowserPureP2POptions(protocolOptions)
  );
};

export const shouldDowngradeBrowserPureP2PAccount = (
  account?: unknown,
  targetWindow?: P2PBrowserConfigWindow,
) =>
  !!account &&
  typeof account === "object" &&
  canConfigureBrowserPureP2P(targetWindow) &&
  getPureP2PBrowserPreference(targetWindow) === false &&
  getP2PRuntimeMode(account, targetWindow) === "browser-libp2p";

export const getBrowserGatewayAccountOptions = (account?: unknown) => {
  const protocolOptions = toAccountShape(account)?.pkcOptions;
  const gatewayOptions = getBrowserGatewayPkcOptions();

  return {
    ...protocolOptions,
    ...gatewayOptions,
    ipfsGatewayUrls: hasArrayItems(protocolOptions?.ipfsGatewayUrls)
      ? protocolOptions?.ipfsGatewayUrls
      : gatewayOptions.ipfsGatewayUrls,
    pubsubKuboRpcClientsOptions: hasArrayItems(protocolOptions?.pubsubKuboRpcClientsOptions)
      ? protocolOptions?.pubsubKuboRpcClientsOptions
      : gatewayOptions.pubsubKuboRpcClientsOptions,
    httpRoutersOptions: hasArrayItems(protocolOptions?.httpRoutersOptions)
      ? protocolOptions?.httpRoutersOptions
      : gatewayOptions.httpRoutersOptions,
    pkcRpcClientsOptions: undefined,
  };
};
