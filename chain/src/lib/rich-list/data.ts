/**
 * Curated facts behind chain.bitsocial.net/rich-list/. Balances come from the generated holder
 * snapshot (`yarn rich-list:snapshot`); everything here is research that does not change between
 * snapshots: who the team is, which wallets are linked and why, and the 2022 launch figures.
 *
 * Every link cites a transaction or address so a reader can check it on an explorer. Amounts on
 * Avalanche are PLEB (Gen 1), amounts on Ethereum before 2026 are old BSO (Gen 2); both convert to
 * today's BSO at PLEB_PER_BSO.
 */

export type Chain = "avalanche" | "ethereum";

export type TxRef = { chain: Chain; hash: string };

/** How sure the link is. Team wallets and the pool are known, so they carry no confidence. */
export type Confidence = "confirmed" | "likely" | "possible";

export type EntityKind = "team" | "pool" | "linked";

export type EntityWallet = {
  address: string;
  /** i18n key suffix under `richList.walletRoles`, e.g. the Safe or one of its owners. */
  role?: string;
  /** For linked groups mixing proof types: wallets tied only by buying pattern. */
  patternOnly?: boolean;
};

export type EvidenceItem = {
  /** i18n key under `richList.entities.<entityId>.evidence`. */
  id: string;
  txs?: TxRef[];
  addresses?: { chain: Chain; address: string }[];
};

/** How a holder is drawn and labelled: team, pool, the confidence of a link, or unlinked. */
export type Category = "team" | "pool" | Confidence | "other";

export type Entity = {
  id: string;
  kind: EntityKind;
  confidence?: Confidence;
  wallets: EntityWallet[];
  evidence: EvidenceItem[];
};

export function entityCategory(entity: Entity): Category {
  return entity.kind === "linked" ? (entity.confidence ?? "possible") : entity.kind;
}

/** Both migrations kept this ratio for every holder: 7,114.596 PLEB became 1 BSO. */
export const PLEB_PER_BSO = 7114.596;

const avax = (hash: string): TxRef => ({ chain: "avalanche", hash });
const eth = (hash: string): TxRef => ({ chain: "ethereum", hash });

export const ENTITIES: Entity[] = [
  {
    id: "esteban",
    kind: "team",
    wallets: [
      { address: "0x4a09b1efef421055fee00cd79894df71f175853d", role: "deployer" },
      { address: "0x5bc4ff33f86e0272be53fa25861294489ab2fe2a", role: "estebanEns" },
    ],
    evidence: [],
  },
  {
    id: "rinse12",
    kind: "team",
    wallets: [{ address: "0xced7e65e1da560bbda16d308a63d12f91a4ca6b2" }],
    evidence: [],
  },
  {
    id: "tom",
    kind: "team",
    wallets: [{ address: "0x89e768ddf3696eb79112734fb0755ab27f8c5620" }],
    evidence: [],
  },
  {
    id: "pool",
    kind: "pool",
    wallets: [{ address: "0xae8d1a28c8fa6b71c4099ede2d7924672dc51e32" }],
    evidence: [],
  },
  {
    id: "holderA",
    kind: "linked",
    confidence: "confirmed",
    wallets: [
      { address: "0x7e499756dcc8137a528938882bb9ef5dddddae6c" },
      { address: "0x6b188de65e5cc554a4fcb763ccc4e99eb5d15ea5" },
      { address: "0xe1ef88df537ebfcd811db00ea1ff70f9c5d6807a" },
      { address: "0x9ce4f6ba18bd5a89402f4d66983409178d099377" },
      { address: "0xd99c6e4705f18b09f5eb6288fc0a4cc5d10bb507" },
      { address: "0xc5d1c20fa18ab967474b21b28722ccb2a6928161", patternOnly: true },
      { address: "0xccd7c97b8a4259f143aedcff1d6156bd47a333e7", patternOnly: true },
      { address: "0x0436d1718ea3f7148c518022b06db3df30318688", patternOnly: true },
      { address: "0x75daa39abeb236863c28eefff8800a7358918a59", patternOnly: true },
      { address: "0x4917532eb87205e35521f52511e05a6c91b5e910", patternOnly: true },
      { address: "0x641479cb068e77bd2908d547d057f1defcd9e485", patternOnly: true },
      { address: "0x343e1400008f08694e923b30d1a8fe20c1dbb6ef", patternOnly: true },
    ],
    evidence: [
      {
        id: "transfersToLpWallet",
        txs: [
          avax("0x838b006b0327d952b6c8aeb45a80e7efafa3ae5a6fe384119124236d5ace6b49"),
          avax("0x5717eb561d4155ca022a48bb4134d67f7ddebfc73c858836d4a1a27ed26bbeb3"),
          avax("0xcccc2e29c3435b392faf2267a4c5c939f767a1d45e281039a979837678b97c41"),
          avax("0x3324ebcf9c68e8335a34cf3528ce937aed894b4c773bed2678a24ead84e80319"),
          avax("0xf364674b4a9cd21f49c4ccd1a376eb4160d92db072b23d1c2e692eac1b1842fb"),
          avax("0x8c8ed20a79cf1178cd4098d13830abb0fbc2a3912055ce89c1b479b641eab2d3"),
          avax("0xf08cb6f7e861966b624f3aa2a7bc5d567e2081abf2c86192c733dfb184decc24"),
        ],
      },
      {
        id: "sharedFunder",
        txs: [
          avax("0x9a07e15d75f37d148aaea6c62b19be8b97b2c389b509e3780fff6fb300ff09e3"),
          avax("0xb32a2366b3f698fb935b5c6166e5fc3d77c7c79c2a3f18946027cfd559916b4c"),
          avax("0xa4d113ff58304aecc4c03c3ad9806e41844217836f1b575ae6fa7991f1cbd40e"),
        ],
        addresses: [{ chain: "avalanche", address: "0x187b9379d9b4f333a59f35eb5db89a61daab425e" }],
      },
      { id: "buyingPattern" },
      { id: "neverSold" },
    ],
  },
  {
    id: "holderB",
    kind: "linked",
    confidence: "confirmed",
    wallets: [
      { address: "0x8eb1a66e06af821203ee9d648032af164ccbc14d", role: "safe" },
      { address: "0x5121cda4f41246d6d488598ca08c0d46d5b6d2fd", role: "safeOwner" },
    ],
    evidence: [
      { id: "owners" },
      {
        id: "consolidation",
        txs: [
          eth("0x18c9e018514e7ca06057656fb40b8b2f079e0df0b92f3b23cb67558f048c68a1"),
          eth("0x7588c27dbf3f26dd3ebff3e4f3b85eecc695694f62b153befe0ab34a020ef745"),
          eth("0xe6a5aa8307530e6b8b3deef4105bf4b30b5bbcdccf5bc8a8a214b8b8c5167500"),
        ],
      },
      {
        id: "vesting",
        txs: [eth("0x13450c13f8949d69dab95e8713aa10ecb51f3a6b5c364a9cc58395e9451ad70f")],
      },
      {
        id: "commonSender",
        txs: [
          eth("0xe252fb80fddbcc349921c04dfd5c6954f098a11c202a71f1dd69e0486a227574"),
          eth("0x9e0425bbe5c98d1dd877476de34d971855282e3fa97bbcf19ab870ff3400d9f4"),
        ],
      },
    ],
  },
  {
    id: "holderF",
    kind: "linked",
    confidence: "likely",
    wallets: [
      { address: "0xb5c3f2515e135de263903fc14ac0a150fd832c64" },
      { address: "0x310d6b410ff9c1472040af416ac0f2368bfb6d0a" },
      { address: "0x4df5531a047a02f212fb339bccdc3e25adfeeffb" },
      { address: "0x3a5e101c03efdb93e71e0bf4632903ea3103b7c7" },
    ],
    evidence: [
      {
        id: "split",
        txs: [
          eth("0x43174cc168f1a525b57a03dee7bb97d9894291026d02722e694ad31f096c563b"),
          eth("0x334ee7560ae0382a846d4faa6505158f9b4ecc262ae033b9e5d23cafa8513db3"),
          eth("0x8c3946ab19baf714f2f7467753dde3b10f8506ea23536bd57642070feb291625"),
        ],
      },
    ],
  },
  {
    id: "holderE",
    kind: "linked",
    confidence: "likely",
    wallets: [
      { address: "0xcea33702d7468fa6c5dfe2f6f35270ce2c799a34" },
      { address: "0xa274cd872b05dbd01a1b132cbf75c76bae5aba02" },
    ],
    evidence: [
      {
        id: "commonSender",
        txs: [
          eth("0x88cf4fbe42d78f977f358c2221807bbce13261e8ad71a860042bdd6f3bbdc364"),
          eth("0xb965254b3e59ae5251e6281f34fbb3cc2c9d60e02e1060e06aa7a3977b41b1a6"),
          eth("0xb8a9804b458c0176d5d8cd6baca004ed225aaaf413c16984d34ab189d8d0fecc"),
        ],
      },
    ],
  },
  {
    id: "holderI",
    kind: "linked",
    confidence: "likely",
    wallets: [
      { address: "0x2e93db4d3a397fb9f18dbdc11695c563f6728586" },
      { address: "0x4874e8166dbff69e72f0441f0e86ae7236235c60" },
    ],
    evidence: [
      {
        id: "directTransfers",
        txs: [
          eth("0x3181a7c39cf655c010701972f1fe80d3a88f00550f5b4f27a506c4e51bec3ade"),
          eth("0x9c67996e4b3380d4d8c1a25804510ebd293bae82faa25572b4f58162cfc3c4fb"),
        ],
      },
    ],
  },
  {
    id: "holderC",
    kind: "linked",
    confidence: "possible",
    wallets: [
      { address: "0x4bcb68fdf8ef791a392195b952c541087505f8e2" },
      { address: "0x9c36d1e6d6c6d6871062dc7dd3494f884eb1798b" },
    ],
    evidence: [
      {
        id: "commonSender",
        txs: [
          eth("0xb5ce89e5fb7e4eace119f383c58450400d0b28be2be510601bf88c7e81e2649d"),
          eth("0xc87982482f3bdfb737b60c054a7aa548fe83faac23bee6ae06ed4bfcd5b9deb3"),
        ],
      },
    ],
  },
  {
    id: "holderH",
    kind: "linked",
    confidence: "possible",
    wallets: [
      { address: "0x61c343f13284a69151ffc2dc73d2b292656000d1" },
      { address: "0x929e618df51f8c34ccf1f8e8b724363e7293ab2d" },
    ],
    evidence: [
      {
        id: "directTransfer",
        txs: [avax("0x117c632f8e6be2a3e11cd29a43dc888b09bcfc0b6b361ed81742a8486c97d03e")],
      },
    ],
  },
  {
    id: "holderG",
    kind: "linked",
    confidence: "possible",
    wallets: [
      { address: "0x9f4704ce47f9b361174c5eea3103f3f74aec3a28" },
      { address: "0x4aeb56386b14e3816908c84833ca1744d0782c4e" },
    ],
    evidence: [
      {
        id: "commonSender",
        txs: [
          avax("0xa54d088ce606c51003b8ba281b6a6062f9ee4baff7b1dac98fe01429dfff3736"),
          avax("0xeffa729dd0532e6445d621fa71ec54b87981fb069dd81710f331f75b16d9705e"),
          eth("0x404c9f87a86f6424ccd1565ede97962071e37a5fa76ab0b552b45051b9b32060"),
        ],
      },
    ],
  },
  {
    id: "holderD",
    kind: "linked",
    confidence: "possible",
    wallets: [
      { address: "0xa539e2494a331cecd69f10934b723769575d4ce9" },
      { address: "0xb14c37d62f6dddba576e924b69bf082735c7cd73" },
      { address: "0x798ecc9c631deac58018104c00464ee77874a618" },
    ],
    evidence: [
      {
        id: "sharedRecipient",
        txs: [
          avax("0x516b7a04680c43f3cd0f5393063e8d337f0db8ce22a876c9f49e886b43f81d2d"),
          avax("0x114c118b905bad7906c020764e830178694fa834fba2a0eb1db46606e670c679"),
          avax("0x50f489a70e6808dbe76df1cab63fcc03b1355a525f13c03a38e49a231e920988"),
        ],
      },
    ],
  },
];

export type AirdropRound = {
  id: "telegram" | "twitter" | "reddit";
  /** Sign-ups as announced in the Telegram group; many were bots. */
  signups: number;
  claimers: number;
  plebClaimed: number;
  medianClaimPleb: number;
  largestClaimPleb: number;
  /** Telegram group messages that document the round. */
  sourceMessageIds: number[];
  link?: string;
};

/** Counted from the claimAirdrop, claimAirdrop2 and claimAirdrop3 mints on the Gen 1 contract. */
export const AIRDROP_ROUNDS: AirdropRound[] = [
  {
    id: "telegram",
    signups: 3312,
    claimers: 767,
    plebClaimed: 769_913_229_550,
    medianClaimPleb: 14_505_377,
    largestClaimPleb: 20_700_000_000,
    sourceMessageIds: [697, 8398],
  },
  {
    id: "twitter",
    signups: 1500,
    claimers: 508,
    plebClaimed: 50_067_600_000,
    medianClaimPleb: 7_000_000,
    largestClaimPleb: 3_260_000_000,
    sourceMessageIds: [48111, 53984],
  },
  {
    id: "reddit",
    signups: 2200,
    claimers: 553,
    plebClaimed: 95_750_600_000,
    medianClaimPleb: 6_600_000,
    largestClaimPleb: 2_200_000_000,
    sourceMessageIds: [61829, 66498],
    link: "https://www.reddit.com/r/plebbitairdrop/comments/so2peq/experimental_reddit_airdrop/",
  },
];

/** Addresses that claimed in at least one round. */
export const DISTINCT_CLAIMERS = 1510;

/** Every PLEB ever minted on the Gen 1 contract, by how it was minted. */
export const PLEB_MINTS = {
  airdropClaims: 915_731_429_550,
  liquidityMining: 490_231_305_646,
  liquiditySeed: 50_091_276_220,
} as const;

/** The launch-day liquidity: minted to the deployer and added to both pools within seven minutes. */
export const LIQUIDITY_SEED_TXS: TxRef[] = [
  avax("0xea159bf3048f07246613959ecbcef25103c54737f6851d0afd432b419137e9df"),
  avax("0x7c379f215876889c9a09acbd023c4b81e8da0f34d1d2a5875e2722a3470cb012"),
  avax("0xdd7f0b272e4756e0dd7c4f2466bed0e6952ced954d3ba42f13bddc959833e375"),
];

/** Founder statements in the Telegram group, oldest first. */
export const TEAM_STATEMENT_MESSAGE_IDS = [253, 294332, 331576] as const;

export type HistoryEvent = {
  id: string;
  /** ISO date; `precision` limits what is shown when the exact day is not known. */
  date: string;
  precision?: "day" | "month" | "year";
  txs?: TxRef[];
  messageIds?: number[];
  link?: string;
};

export const HISTORY: HistoryEvent[] = [
  { id: "groupOpens", date: "2021-12-25" },
  { id: "telegramRound", date: "2022-01-07", messageIds: [697, 8398] },
  { id: "launch", date: "2022-01-14", txs: LIQUIDITY_SEED_TXS, messageIds: [9374] },
  { id: "twitterRound", date: "2022-02-02", messageIds: [48111] },
  {
    id: "redditRound",
    date: "2022-02-09",
    messageIds: [61829],
    link: "https://www.reddit.com/r/plebbitairdrop/comments/so2peq/experimental_reddit_airdrop/",
  },
  { id: "claimsClose", date: "2022-02-21", messageIds: [77224] },
  { id: "farm", date: "2022-02-28", messageIds: [94366] },
  { id: "ethereum", date: "2023-05-17", messageIds: [363424, 372233] },
  { id: "rebrand", date: "2026-03-01", precision: "month" },
  { id: "rebase", date: "2026-05-02" },
  {
    id: "immutable",
    date: "2026-07-02",
    txs: [eth("0x484af845fd8335b6963f38787f34ace516286667e1ce2399aae990e2a160d8db")],
  },
];

export const GEN1_TOKEN_ADDRESS = "0x625fc9bb971bb305a2ad63252665dcfe9098bee9" as const;
export const GEN2_TOKEN_ADDRESS = "0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f" as const;
