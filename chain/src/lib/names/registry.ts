import {
  type Address,
  type Chain,
  createPublicClient,
  defineChain,
  encodeAbiParameters,
  fallback,
  type Hex,
  http,
  keccak256,
  parseAbi,
  toHex,
} from "viem";
import { mainnet } from "viem/chains";
import { namehash } from "viem/ens";
import { BSO_FEE_SAFE_ADDRESS } from "@/lib/site";

/**
 * The BSIP-13 registry once it is deployed: its address and the block it was deployed in, where
 * the activity feed starts reading. Null until then, and the page says registration opens soon.
 */
const DEPLOYED_REGISTRY: { address: Address; fromBlock: bigint } | null = null;

// The dev server can point the page at a local test chain instead (see chain/README.md,
// "Testing the Names Page Against a Local Chain").
const env = import.meta.env;
const devRpcUrl = import.meta.env.DEV ? env.VITE_NAMES_RPC_URL : undefined;
const devRegistry = import.meta.env.DEV ? env.VITE_NAMES_REGISTRY : undefined;

export const NAMES_CHAIN: Chain = devRpcUrl
  ? defineChain({
      id: Number(env.VITE_NAMES_CHAIN_ID ?? 31337),
      name: "Local test chain",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: [devRpcUrl] } },
    })
  : mainnet;

export const REGISTRY = devRegistry
  ? { address: devRegistry as Address, fromBlock: BigInt(env.VITE_NAMES_FROM_BLOCK ?? 0) }
  : DEPLOYED_REGISTRY;

export const publicClient = createPublicClient({
  chain: NAMES_CHAIN,
  transport: devRpcUrl
    ? http(devRpcUrl)
    : fallback([
        http("https://ethereum-rpc.publicnode.com"),
        http("https://eth.llamarpc.com"),
        http("https://eth.drpc.org"),
      ]),
});

/** The upstream NameNFT functions the page uses, plus the fork's opening gate (BSIP-13). */
export const REGISTRY_ABI = parseAbi([
  "function records(uint256 tokenId) view returns (string label, uint256 parent, uint64 expiresAt, uint64 epoch, uint64 parentEpoch)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function text(uint256 tokenId, string key) view returns (string)",
  "function getPremium(uint256 tokenId) view returns (uint256)",
  "function commit(bytes32 commitment)",
  "function reveal(string label, bytes32 secret) payable returns (uint256)",
  "function renew(uint256 tokenId) payable",
  "function setText(uint256 tokenId, string key, string value)",
  "function openAt() view returns (uint256)",
  "function SEED_END() view returns (uint256)",
  "event NameRegistered(uint256 indexed tokenId, string label, address indexed owner, uint256 expiresAt)",
  "error Expired()",
  "error Unauthorized()",
  "error InsufficientFee()",
  "error AlreadyCommitted()",
  "error CommitmentTooNew()",
  "error CommitmentTooOld()",
  "error AlreadyRegistered()",
  "error CommitmentNotFound()",
  "error InvalidName()",
  "error InvalidLength()",
]);

const SAFE_ABI = parseAbi([
  "function getThreshold() view returns (uint256)",
  "function getOwners() view returns (address[])",
]);

export const DAY = 86_400;
export const YEAR = 365 * DAY;
export const GRACE_PERIOD = 90 * DAY;
export const MIN_COMMITMENT_AGE = 60;
export const MAX_COMMITMENT_AGE = DAY;
export const RECORD_KEY = "bitsocial";

const ETHER = 10n ** 18n;

/** Price per 365 days by UTF-8 byte length, as the registry's `getFee` computes it. */
export function feeForLength(bytes: number): bigint {
  if (bytes === 1) return ETHER / 2n;
  if (bytes === 2) return ETHER / 10n;
  if (bytes === 3) return ETHER / 20n;
  if (bytes === 4) return ETHER / 100n;
  return ETHER / 2000n;
}

export function tokenIdFor(label: string): bigint {
  return BigInt(namehash(`${label}.bso`));
}

export type NameState =
  | { status: "available"; premium: bigint }
  | { status: "premium"; premium: bigint; releasedAt: number }
  | { status: "grace"; owner: Address; expiresAt: number }
  | { status: "taken"; owner: Address; expiresAt: number; record: string };

export async function lookupName(label: string): Promise<NameState> {
  const registry = requireRegistry();
  const tokenId = tokenIdFor(label);
  const read = { address: registry.address, abi: REGISTRY_ABI } as const;
  const [record, premium, block] = await Promise.all([
    publicClient.readContract({ ...read, functionName: "records", args: [tokenId] }),
    publicClient.readContract({ ...read, functionName: "getPremium", args: [tokenId] }),
    publicClient.getBlock(),
  ]);
  const [storedLabel, , expiresAtRaw] = record;
  const now = Number(block.timestamp);
  const expiresAt = Number(expiresAtRaw);

  if (!storedLabel || now > expiresAt + GRACE_PERIOD) {
    return premium > 0n
      ? { status: "premium", premium, releasedAt: expiresAt + GRACE_PERIOD }
      : { status: "available", premium };
  }

  const owner = await publicClient.readContract({
    ...read,
    functionName: "ownerOf",
    args: [tokenId],
  });
  if (now > expiresAt) return { status: "grace", owner, expiresAt };

  const value = await publicClient.readContract({
    ...read,
    functionName: "text",
    args: [tokenId, RECORD_KEY],
  });
  return { status: "taken", owner, expiresAt, record: value };
}

/**
 * When public registration opens: `openAt` once the last seed sets it, otherwise `SEED_END`
 * (BSIP-13, Seeding). Null when neither can be read, which the page treats as already open.
 */
export async function readOpening(): Promise<number | null> {
  const registry = requireRegistry();
  const read = { address: registry.address, abi: REGISTRY_ABI } as const;
  const [openAt, seedEnd] = await Promise.all([
    publicClient.readContract({ ...read, functionName: "openAt" }).catch(() => null),
    publicClient.readContract({ ...read, functionName: "SEED_END" }).catch(() => null),
  ]);
  const candidates = [openAt, seedEnd].filter((value): value is bigint => !!value && value > 0n);
  if (candidates.length === 0) return null;
  return Number(candidates.reduce((a, b) => (a < b ? a : b)));
}

export type Registration = {
  tokenId: bigint;
  label: string;
  owner: Address;
  registeredAt: number;
  txHash: Hex;
};

const LOG_WINDOW = 50_000n;

/** The newest registrations, read backwards from the head in windows public RPCs accept. */
export async function readRecentRegistrations(limit: number): Promise<Registration[]> {
  const registry = requireRegistry();
  const head = await publicClient.getBlockNumber();
  const found: Registration[] = [];

  for (let to = head; to >= registry.fromBlock && found.length < limit; to -= LOG_WINDOW) {
    const from =
      to - LOG_WINDOW + 1n > registry.fromBlock ? to - LOG_WINDOW + 1n : registry.fromBlock;
    const logs = await publicClient.getContractEvents({
      address: registry.address,
      abi: REGISTRY_ABI,
      eventName: "NameRegistered",
      fromBlock: from,
      toBlock: to,
    });
    for (const log of logs.reverse()) {
      const { tokenId, label, owner, expiresAt } = log.args;
      if (tokenId === undefined || !label || !owner || expiresAt === undefined) continue;
      // Every top-level registration runs 365 days, so its time needs no block lookup.
      found.push({
        tokenId,
        label,
        owner,
        registeredAt: Number(expiresAt) - YEAR,
        txHash: log.transactionHash,
      });
    }
    if (from === registry.fromBlock) break;
  }
  return found.slice(0, limit);
}

export async function readFeeSafe(): Promise<{ threshold: number; owners: number }> {
  const read = { address: BSO_FEE_SAFE_ADDRESS, abi: SAFE_ABI } as const;
  const [threshold, owners] = await Promise.all([
    publicClient.readContract({ ...read, functionName: "getThreshold" }),
    publicClient.readContract({ ...read, functionName: "getOwners" }),
  ]);
  return { threshold: Number(threshold), owners: owners.length };
}

/**
 * The commitment `reveal` checks: keccak256(abi.encode(label, owner, secret)), computed here
 * rather than through `makeCommitment` so the label never reaches an RPC before it is committed.
 */
export function makeCommitment(label: string, owner: Address, secret: Hex): Hex {
  return keccak256(
    encodeAbiParameters(
      [{ type: "bytes" }, { type: "address" }, { type: "bytes32" }],
      [toHex(new TextEncoder().encode(label)), owner, secret],
    ),
  );
}

export function randomSecret(): Hex {
  return toHex(crypto.getRandomValues(new Uint8Array(32)));
}

function requireRegistry() {
  if (!REGISTRY) throw new Error("The .bso registry is not deployed yet.");
  return REGISTRY;
}

export function etherscanUrl(kind: "address" | "tx" | "token", value: string): string | null {
  if (NAMES_CHAIN.id !== mainnet.id) return null;
  return `https://etherscan.io/${kind}/${value}`;
}
