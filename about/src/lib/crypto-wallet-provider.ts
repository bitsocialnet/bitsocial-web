import { useSyncExternalStore } from "react";
import type { AppLink } from "@/lib/apps-data";

const ETH_LIMO_SUFFIX = ".eth.limo";
const WALLET_PROVIDER_RECHECK_DELAYS_MS = [250, 1000];

interface Eip1193Provider {
  request?: unknown;
}

interface Eip6963ProviderDetail {
  provider?: Eip1193Provider;
}

interface EthereumWindow extends Window {
  ethereum?: Eip1193Provider;
}

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent<Eip6963ProviderDetail>;
  }
}

let walletProviderDetected = false;
let walletProviderDetectionStarted = false;

const subscribers = new Set<() => void>();

export function useHasCryptoWalletProvider(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function filterCryptoWalletGatedLinks<TLink extends AppLink>(
  links: TLink[],
  hasCryptoWalletProvider: boolean,
): TLink[] {
  return hasCryptoWalletProvider ? links : links.filter((link) => !isCryptoWalletGatedLink(link));
}

function isCryptoWalletGatedLink(link: AppLink): boolean {
  if (link.kind !== "mirror") {
    return false;
  }

  try {
    return new URL(link.url).hostname
      .replace(/^www\./, "")
      .toLowerCase()
      .endsWith(ETH_LIMO_SUFFIX);
  } catch {
    return false;
  }
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  startWalletProviderDetection();

  return () => {
    subscribers.delete(callback);
  };
}

function getSnapshot() {
  return walletProviderDetected || hasInjectedEthereumProvider();
}

function getServerSnapshot() {
  return false;
}

function startWalletProviderDetection() {
  if (walletProviderDetectionStarted || typeof window === "undefined") {
    return;
  }

  walletProviderDetectionStarted = true;
  window.addEventListener("eip6963:announceProvider", handleEip6963ProviderAnnouncement);
  detectInjectedEthereumProvider();
  requestEip6963Providers();

  for (const delay of WALLET_PROVIDER_RECHECK_DELAYS_MS) {
    window.setTimeout(() => {
      detectInjectedEthereumProvider();
      requestEip6963Providers();
    }, delay);
  }
}

function handleEip6963ProviderAnnouncement(event: WindowEventMap["eip6963:announceProvider"]) {
  if (event.detail?.provider) {
    markWalletProviderDetected();
  }
}

function requestEip6963Providers() {
  window.dispatchEvent(new Event("eip6963:requestProvider"));
}

function detectInjectedEthereumProvider() {
  if (hasInjectedEthereumProvider()) {
    markWalletProviderDetected();
  }
}

function hasInjectedEthereumProvider() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean((window as EthereumWindow).ethereum);
}

function markWalletProviderDetected() {
  if (walletProviderDetected) {
    return;
  }

  walletProviderDetected = true;
  subscribers.forEach((subscriber) => subscriber());
}
