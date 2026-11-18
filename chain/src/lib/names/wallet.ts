import { useSyncExternalStore } from "react";
import {
  type Address,
  BaseError,
  ContractFunctionRevertedError,
  createWalletClient,
  custom,
  type EIP1193Provider,
  getAddress,
  type Hash,
  numberToHex,
  UserRejectedRequestError,
} from "viem";
import { NAMES_CHAIN, publicClient, REGISTRY, REGISTRY_ABI } from "./registry";

export type WalletOption = {
  id: string;
  name: string;
  icon: string | null;
  provider: EIP1193Provider;
};

type Announcement = {
  info: { uuid: string; name: string; icon: string; rdns: string };
  provider: EIP1193Provider;
};

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent<Announcement>;
  }
}

// Wallets announce themselves through EIP-6963; `window.ethereum` covers wallets that predate it.
let announced: WalletOption[] = [];
let snapshot: WalletOption[] = [];
const listeners = new Set<() => void>();
let listening = false;

function rebuildSnapshot() {
  const legacy = typeof window !== "undefined" ? window.ethereum : undefined;
  snapshot =
    announced.length > 0 || !legacy
      ? announced
      : [{ id: "injected", name: "", icon: null, provider: legacy }];
  for (const listener of listeners) listener();
}

function startListening() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("eip6963:announceProvider", (event) => {
    const { info, provider } = event.detail;
    if (announced.some((wallet) => wallet.id === info.uuid)) return;
    // Icons are data URIs the wallet supplies; anything else is dropped rather than fetched.
    const icon = info.icon.startsWith("data:image/") ? info.icon : null;
    announced = [...announced, { id: info.uuid, name: info.name, icon, provider }];
    rebuildSnapshot();
  });
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  rebuildSnapshot();
}

function subscribe(listener: () => void) {
  startListening();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The wallets in this browser, refreshed as they announce themselves. */
export function useWallets(): WalletOption[] {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => [],
  );
}

/** Asks the wallet for an account and moves it to the registry's chain. */
export async function connectWallet(wallet: WalletOption): Promise<Address> {
  const accounts = (await wallet.provider.request({ method: "eth_requestAccounts" })) as string[];
  const account = accounts[0];
  if (!account) throw new Error("The wallet returned no account.");
  await ensureChain(wallet.provider);
  return getAddress(account);
}

async function ensureChain(provider: EIP1193Provider) {
  const current = Number(await provider.request({ method: "eth_chainId" }));
  if (current === NAMES_CHAIN.id) return;
  const chainId = numberToHex(NAMES_CHAIN.id);
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId }] });
  } catch (error) {
    // 4902: the wallet does not know the chain. Only the local test chain can be missing.
    if ((error as { code?: number }).code !== 4902) throw error;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId,
          chainName: NAMES_CHAIN.name,
          nativeCurrency: NAMES_CHAIN.nativeCurrency,
          rpcUrls: [...NAMES_CHAIN.rpcUrls.default.http],
        },
      ],
    });
  }
}

type RegistryCall =
  | { functionName: "commit"; args: readonly [`0x${string}`] }
  | { functionName: "reveal"; args: readonly [string, `0x${string}`]; value: bigint }
  | { functionName: "renew"; args: readonly [bigint]; value: bigint }
  | { functionName: "setText"; args: readonly [bigint, string, string] };

export type TransactionProblem =
  | { kind: "rejected" }
  | { kind: "revert"; error: string }
  | { kind: "other"; message: string };

/**
 * A registry call that is known not to have run: it was stopped before sending, it reverted, or
 * the wallet cancelled or replaced it. Anything it reserved can be let go.
 */
export class RegistryCallFailed extends Error {
  constructor(readonly problem: TransactionProblem) {
    super(problem.kind === "revert" ? problem.error : "The registry call did not run.");
    this.name = "RegistryCallFailed";
  }
}

/**
 * Simulates the call against the public RPC first, so a revert is explained before the wallet
 * asks for a signature, then sends it from the wallet and waits for it to be mined. A wallet can
 * speed up a pending transaction (accepted: the same call at a higher fee) or cancel or replace it
 * (rejected: the receipt would be for a different transaction).
 */
export async function sendRegistryCall(
  wallet: WalletOption,
  account: Address,
  call: RegistryCall,
  onSent: (hash: Hash) => void,
) {
  if (!REGISTRY) throw new Error("The .bso registry is not deployed yet.");
  await ensureChain(wallet.provider);
  const { request } = await publicClient.simulateContract({
    ...call,
    address: REGISTRY.address,
    abi: REGISTRY_ABI,
    account,
  } as Parameters<typeof publicClient.simulateContract>[0]);
  const walletClient = createWalletClient({
    account,
    chain: NAMES_CHAIN,
    transport: custom(wallet.provider),
  });
  const hash = await walletClient.writeContract(request);
  onSent(hash);
  let replaced = false;
  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    onReplaced: ({ reason }) => {
      replaced = reason !== "repriced";
    },
  });
  if (replaced) throw new RegistryCallFailed({ kind: "revert", error: "Replaced" });
  if (receipt.status !== "success") {
    throw new RegistryCallFailed({ kind: "other", message: "The transaction reverted." });
  }
  return receipt;
}

/** Sorts a wallet or contract error into what the page can explain. */
export function describeError(error: unknown): TransactionProblem {
  if (error instanceof RegistryCallFailed) return error.problem;
  if (error instanceof BaseError) {
    if (error.walk((cause) => cause instanceof UserRejectedRequestError))
      return { kind: "rejected" };
    const revert = error.walk((cause) => cause instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError && revert.data?.errorName) {
      return { kind: "revert", error: revert.data.errorName };
    }
    return { kind: "other", message: error.shortMessage };
  }
  if ((error as { code?: number })?.code === 4001) return { kind: "rejected" };
  return { kind: "other", message: error instanceof Error ? error.message : String(error) };
}
