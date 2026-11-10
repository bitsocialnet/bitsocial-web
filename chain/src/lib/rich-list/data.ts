import { DEXSCREENER_PAIR_ADDRESS } from "@/lib/site";

/**
 * Curated facts behind chain.bitsocial.net/rich-list/. Balances come from the generated holder
 * snapshot (`yarn rich-list:snapshot`); everything here is research that does not change between
 * snapshots: who the team is, which wallets are linked and why, and the 2022 launch figures.
 *
 * Every link cites a transaction or address so a reader can check it on an explorer. Amounts on
 * Avalanche are PLEB (Gen 1), and so are amounts on Ethereum before the May 2026 rebase (Gen 2,
 * renamed BSO in that rebase); both convert to today's BSO at PLEB_PER_BSO.
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
  /**
   * Emptied wallets whose tokens all went to this holder's wallets: each moved its whole balance,
   * less any sales, to them or to another former wallet. They hold nothing so they are not listed,
   * but they count toward the holder's history line, which then starts at the first purchase or
   * claim instead of when today's wallets were filled.
   */
  formerWallets?: string[];
  evidence: EvidenceItem[];
};

export function entityCategory(entity: Entity): Category {
  return entity.kind === "linked" ? (entity.confidence ?? "possible") : entity.kind;
}

/** Both migrations kept this ratio for every holder: 7,114.596 PLEB became 1 BSO. */
export const PLEB_PER_BSO = 7114.596;

const avax = (hash: string): TxRef => ({ chain: "avalanche", hash });
const eth = (hash: string): TxRef => ({ chain: "ethereum", hash });

/**
 * Ids are stable keys for translations, anchors and colours. On the page, team members and linked
 * holders are named by their current balance rank instead (see `holderLetterById`), so the letter
 * in an id like `holderE` need not match the letter shown.
 */
export const ENTITIES: Entity[] = [
  {
    id: "rinse12",
    kind: "team",
    wallets: [
      { address: "0xced7e65e1da560bbda16d308a63d12f91a4ca6b2" },
      { address: "0x8eb1a66e06af821203ee9d648032af164ccbc14d", role: "safe" },
      { address: "0x5121cda4f41246d6d488598ca08c0d46d5b6d2fd", role: "safeOwner" },
    ],
    formerWallets: [
      "0x4ec92589c7cb12402a930ee44c238804e6197467",
      "0x52b2884b6ea5c5f9ac7d3d44b984d4a3e71ce433",
      "0xc9d5af04e2131a7f4aa07f06699ecec9339c1034",
      "0xdbaad112b55fb0d29febcba8a1d208a62793b444",
      "0x9a72cee219babf88dd39771d286c4d4b494064c1",
      "0xa974af6148ffcf405b29c8670d108fe2a798438f",
      "0x7eed02579e267c1e699dd8eea90a7465694f0061",
      "0xa460299f8a5779f284897fe6fdb692aa2eaafcba",
      "0x990a150c0990c8228a8dcc7c762e0693f217632d",
      "0x07b0292b49495bc17624e0e6b9f5cefa69637b6b",
      "0x98ef6a0a63c3be8cccfa374d26e54d07819eb06c",
      "0xfd909c3af243be48a57eca0716646b687be3ec56",
      "0xd194bc047b94d1e6627df59b7acae2aee2f5ebf7",
      "0xc493b5a4c5d21765dd3cc37b5752d3af063f5ad5",
      "0x6d1613316f1a4aedb7ada7078fb8d0a7efcf777a",
      "0x1c5e7d9f3cdb1dfdeffc0cae1b3e79fe500c2e38",
      "0x782875023f6b6d07e58abbf681acafea0592ad6f",
      "0x0611cf40df920fa426a356dd68013de631617499",
      "0x555cf0815314c5786d855a7cb300062f20e99b88",
      "0x4d8d3ba670be46368afeeb5104c655dcbc0d18b0",
      "0x2577cc9d4f62ab52d32d5ffcdd5d7a1073de0f15",
      "0x7efc07e07d254ab4360eb3c8720ffd132087e4ad",
      "0x5d16f130b5a36ee0a89cdf62cd67daa41d4b3444",
      "0xd4ddb6c826516d72824ee1904e3b28502458f10d",
      "0x6c7f3f2d622a2594cc6bcf8bd2bf8f14cca609d6",
      "0x17dcab19030cb78bb25e565b0e3739d9173c0e5b",
      "0x8c99fced913309ba6333a9e99b7f8f01b671a7c2",
      "0xd57b780f34d96a40eedaa8d57907eb0cc9cfd452",
      "0x290a5b06dbece8b2cddd6fcc9565eb726a78b7e2",
      "0x19ecda49f87aab424fe6ed54ef738ed6d9fde48a",
    ],
    evidence: [],
  },
  {
    id: "tom",
    kind: "team",
    wallets: [
      { address: "0x89e768ddf3696eb79112734fb0755ab27f8c5620" },
      { address: "0x13087d38b78df0345d67c8cee73b215589ae3a1f" },
    ],
    formerWallets: [
      "0x409e67f7124ef439ef83790ade3e81cf7dfc37da",
      "0xb6ef273d546b13d42f6fb3328ab041eab939aadb",
      "0x9b08b69818093a940ff381af8ec079ecdf3076bb",
      "0xb295166ae52850160e2f3d692c6d54c12311b276",
    ],
    evidence: [],
  },
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
    id: "pool",
    kind: "pool",
    wallets: [{ address: DEXSCREENER_PAIR_ADDRESS }],
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
      { id: "neverSold" },
    ],
  },
  {
    id: "holderM",
    kind: "linked",
    confidence: "likely",
    wallets: [
      { address: "0xc5d1c20fa18ab967474b21b28722ccb2a6928161" },
      { address: "0xccd7c97b8a4259f143aedcff1d6156bd47a333e7" },
      { address: "0x0436d1718ea3f7148c518022b06db3df30318688" },
      { address: "0x75daa39abeb236863c28eefff8800a7358918a59" },
      { address: "0x4917532eb87205e35521f52511e05a6c91b5e910" },
      { address: "0x641479cb068e77bd2908d547d057f1defcd9e485" },
      { address: "0x343e1400008f08694e923b30d1a8fe20c1dbb6ef" },
      { address: "0xdccf1af9a9f0ae46942a1b432b007e7823179f5b" },
      { address: "0xb7b8cac031c6d860f2404c5277fe736f9a3d4884" },
      { address: "0x72bcd36157ba54d3800522c222582c34efc08b8a" },
    ],
    evidence: [{ id: "buyingPattern" }, { id: "neverSold" }],
  },
  {
    id: "holderF",
    kind: "linked",
    confidence: "confirmed",
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
      {
        id: "ethBothWays",
        txs: [
          eth("0xfac298ec4f83e8ea7c8598ab8b39ea4561a57657cbfbedd9b6f410b45fc03c51"),
          eth("0x207dc2090b881ceb5aa47e657ac07c298cb7574548a594b0fceab169a9109b15"),
          eth("0xe494bb55d5dbfbc9b76e577e9a5435ff9a7102034cdf7e20b3455fc44bb688c8"),
          eth("0x4d4d6ccf00574b8b64f42308fac3463a46d75527a52091924ebe98a6fc9e00e1"),
          eth("0xd09f3cd7a27ceef01288810be6752c678f7566521d0b45c180642a10fb9957f7"),
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
    formerWallets: ["0x72dc34a1d402972db44e430b9e8c7bcd9b52270d"],
    evidence: [
      {
        id: "commonSender",
        txs: [
          eth("0x88cf4fbe42d78f977f358c2221807bbce13261e8ad71a860042bdd6f3bbdc364"),
          eth("0xb965254b3e59ae5251e6281f34fbb3cc2c9d60e02e1060e06aa7a3977b41b1a6"),
          eth("0xb8a9804b458c0176d5d8cd6baca004ed225aaaf413c16984d34ab189d8d0fecc"),
        ],
        addresses: [{ chain: "ethereum", address: "0x72dc34a1d402972db44e430b9e8c7bcd9b52270d" }],
      },
      {
        id: "onlyEth",
        txs: [
          eth("0xd6cfcf07aa2b59b101c878c0b321541879d3ab45e5f0a763b0fe22c140a9bfc8"),
          eth("0x6b909f04b9cdaa779bd203d844bdbe3ef3de58d0c4adbd596de055de283d24bc"),
        ],
      },
    ],
  },
  {
    id: "holderI",
    kind: "linked",
    confidence: "confirmed",
    wallets: [
      { address: "0x2e93db4d3a397fb9f18dbdc11695c563f6728586" },
      { address: "0x4874e8166dbff69e72f0441f0e86ae7236235c60" },
    ],
    evidence: [
      {
        id: "ethBothWays",
        txs: [
          eth("0xb7f7dd120a58f4ef86c1d4842e7bef4c326c3f623c8eae40e061bd7392a579bf"),
          eth("0xdfb28089bfbfcd9ec8f17f1d7a88541a2c351afa848cd0a366cad24830473b36"),
        ],
      },
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
    confidence: "likely",
    wallets: [
      { address: "0x4bcb68fdf8ef791a392195b952c541087505f8e2" },
      { address: "0x9c36d1e6d6c6d6871062dc7dd3494f884eb1798b" },
    ],
    formerWallets: [
      "0xf6f03c32176a989b76d0c2e991535a07973a1393",
      "0x51a7142b5ddccf34fd8429b4416e19fa0b8a26fe",
    ],
    evidence: [
      {
        id: "commonSender",
        txs: [
          eth("0xb5ce89e5fb7e4eace119f383c58450400d0b28be2be510601bf88c7e81e2649d"),
          eth("0xc03e862fc506ab7f704cde94fdfbc3b2b154319c731ac42f16d9ac9e411edcaf"),
          eth("0xe5e29d9a8ce31cd3a650f7f0a79d2dca4d3915138c72fb6352277b28f5be92b8"),
          eth("0xc87982482f3bdfb737b60c054a7aa548fe83faac23bee6ae06ed4bfcd5b9deb3"),
        ],
        addresses: [{ chain: "ethereum", address: "0x51a7142b5ddccf34fd8429b4416e19fa0b8a26fe" }],
      },
      {
        id: "secondSender",
        txs: [
          eth("0x96702cb5437afacea7d50a28d45a5abd4cde339e4e876e92a63f9741015dfca4"),
          eth("0xc75ce93cfddad4109b63693c522e9117ca2dc4f427be77885a91054cea943bfc"),
          eth("0xae60de829c6cea18a2860b0882c411a8dc9b2b5f1b3e10752de45d4d35bc30f2"),
          eth("0x53dc66716933dc50a435f7bd04246d72bc513cbe03aae4b0b2dd40ebdd8a88e2"),
          eth("0x49d2fb10ce4d8ac0327b85a6bab199f066ea2335dfe591ee1bc4bf5f760fccc7"),
        ],
        addresses: [{ chain: "ethereum", address: "0xf6f03c32176a989b76d0c2e991535a07973a1393" }],
      },
      {
        id: "sendersLinked",
        txs: [
          eth("0x648ca27290790b24922182447462a6070c6b8b1f856a9ad1f7f70ff42bb3358f"),
          eth("0x3af7b2b1a8ca61aba498e08d4b761872ebccb1831c1f81d934f173e413cdd27b"),
          eth("0x418f55da5f0b4976efb955fe7cfca510e76ccce3c463df0b65cdda22aa4bf352"),
        ],
      },
    ],
  },
  {
    id: "holderH",
    kind: "linked",
    confidence: "confirmed",
    wallets: [
      { address: "0x61c343f13284a69151ffc2dc73d2b292656000d1" },
      { address: "0x929e618df51f8c34ccf1f8e8b724363e7293ab2d" },
    ],
    evidence: [
      {
        id: "directTransfer",
        txs: [
          avax("0xf1d3ab0578a3f0cf25e85a84afd452b6291b4be59a96d097862c6a809a32bffb"),
          avax("0x117c632f8e6be2a3e11cd29a43dc888b09bcfc0b6b361ed81742a8486c97d03e"),
        ],
      },
      {
        id: "funding",
        txs: [
          avax("0x9792144558b40d7fab1a0b4560bd7b2dfb07e43b4151682a73abd5e4ff7c54a5"),
          avax("0xc5b424a5fbbd28759302c1288861b133aeafd983cd936a676d9ca632994483fd"),
          avax("0x98ae030b4c4a8ff26818b6fa6bdfad1e96a3b7fedd86ee329013ccafad19d700"),
          avax("0xb55cecd2e15ef7cf8c747cad08d24ffa1b100510f5e96c326a15ff1663c182c4"),
          avax("0x71b73cb05af1ce1788d0bdf227620501e21a26f3905d113220b7df3717c0d39d"),
          avax("0x0f2bb3f0060ed30eee4e4a5a296bb5df2554d3dad00bd88cd308237032904d18"),
        ],
      },
    ],
  },
  {
    id: "holderG",
    kind: "linked",
    confidence: "confirmed",
    wallets: [
      { address: "0x9f4704ce47f9b361174c5eea3103f3f74aec3a28" },
      { address: "0x4aeb56386b14e3816908c84833ca1744d0782c4e" },
      { address: "0x20936c48e010e7ff3701f082b998ef3079b320ff" },
    ],
    formerWallets: [
      "0xbd7e083b1863fc53c7541756aff4966d720588ac",
      "0x502b300c984193e0a80934eb352ab1ab616f59af",
      "0x37139e2ab0cc14b79b3a8458c16c34b127375c00",
      "0xc9be0e27adf30273a931a84a7a45a28d8de7696d",
      "0x19c70a654e7e143093378fcc5f57e289c63cb86e",
      "0xab0d2efc0a2f79cc904c41c7a3a51f64485af94d",
    ],
    evidence: [
      {
        id: "commonSender",
        txs: [
          avax("0xa54d088ce606c51003b8ba281b6a6062f9ee4baff7b1dac98fe01429dfff3736"),
          avax("0xeffa729dd0532e6445d621fa71ec54b87981fb069dd81710f331f75b16d9705e"),
          eth("0x404c9f87a86f6424ccd1565ede97962071e37a5fa76ab0b552b45051b9b32060"),
        ],
        addresses: [{ chain: "avalanche", address: "0x37139e2ab0cc14b79b3a8458c16c34b127375c00" }],
      },
      {
        id: "senderFunded",
        txs: [
          avax("0xc86adcb58bdca238408762cebe137ef29d673b4514e61c7fddacc11670b8f04e"),
          avax("0xe7c5fe884f83e940810af72902f6d34b7cd4f119c306b580bb7969a1a20ebe83"),
          eth("0xdd5d336af17952ba6e8b6b5af3184eadb10d58129ebccc56455fe3fc96c6fbab"),
        ],
      },
      {
        id: "movedOn",
        txs: [
          eth("0x636bd148715b553002ffbf9cb89f67406f1898d57aee544a9358b62cd689faf8"),
          eth("0x2269f80241a4088c2d8dc28b5bb7d44100902a8d5c63caf0b436341ab4b6a550"),
          eth("0xee124f038980e9b26a4b22723e1efc18d39c35ebc48c56f161742162bcbdc8ac"),
        ],
      },
    ],
  },
  {
    id: "holderD",
    kind: "linked",
    confidence: "confirmed",
    wallets: [
      { address: "0xa539e2494a331cecd69f10934b723769575d4ce9" },
      { address: "0x798ecc9c631deac58018104c00464ee77874a618" },
      { address: "0xb14c37d62f6dddba576e924b69bf082735c7cd73" },
      { address: "0xb4fa1b48300e22b41956ccc1a3e4adf2be71496b" },
      { address: "0x18f01a8fe60b0ed580dd945a9049977a7d268059" },
    ],
    evidence: [
      {
        id: "coinsBothWays",
        txs: [
          avax("0x8d18cef56e5ebeb15bf8f4cd4afd8190ba88afb68342b2bd093b95f11d712ff2"),
          avax("0x030e12e7c6f1857dcc534ebc863a1fffe65b69bfb4eaa735086b8088d2a43315"),
          avax("0x30c4bc8b6fcd37fe2194a6d9b98747a7ef02ea7860b9d09ea21f73d5e05d18bb"),
          eth("0x8437337b4d5cfcf4ad16a8a57ba27b6e6f38a79106dec5a97e394ac4c79f2398"),
          eth("0x88fb5e8bcdbc105e5d9e5c075f2e8ecd84d5c45f1df50b1806e7c91783d2b366"),
        ],
      },
      {
        id: "sharedRecipient",
        txs: [
          avax("0x516b7a04680c43f3cd0f5393063e8d337f0db8ce22a876c9f49e886b43f81d2d"),
          avax("0x114c118b905bad7906c020764e830178694fa834fba2a0eb1db46606e670c679"),
          avax("0x106b87d196a85492c9a1cae2f08771f092ed111a4b086146e3e56092243daaa9"),
          avax("0x498cee0e1b0458f17431ba92c99e168a024cba4b269d90582e5bff76620e7b36"),
          avax("0x0ca7ac75f55e634365e9c2ee1b820f5650e3d8231a961b2874280b6c928a3025"),
          avax("0x50f489a70e6808dbe76df1cab63fcc03b1355a525f13c03a38e49a231e920988"),
        ],
      },
      {
        id: "newWallets",
        txs: [
          avax("0x9d129d62ff1d8658de7da9b4c1494db5a7b8603f210f7259f21a52a798d5c5ef"),
          avax("0xce4e93145d0dc8ee1327427001cfe8023a4a5490d61552ada4e1098832d4cf3b"),
          avax("0x0ccc80f7b0968aaeac3959943fc5005374fe720fe7af3401484794ad6825d66c"),
          avax("0x8b08a22b6f3b2597e50e625557be1ee4faa78bfdd950f7dcd206c47cbe5686d8"),
          avax("0x3e1836f87e9fc135e8aa1a65282daaaeb56034163de1e1f337b64bbc36e9732b"),
          avax("0x939dcb39f50758d8f7669618650ffffc157c7a94dbdc8f9982093b1af0a1f265"),
        ],
      },
    ],
  },
  {
    id: "holderK",
    kind: "linked",
    confidence: "confirmed",
    wallets: [
      { address: "0x8eeccf2f3ea9fe05d6906abaa1458be9646d938b" },
      { address: "0x23b33f91420608d4a1ebe5430e3b38dc26da2864" },
    ],
    formerWallets: ["0x4b024b1609e1c3c8335a7396748e9339c671dfa6"],
    evidence: [
      {
        id: "sharedFunder",
        txs: [
          avax("0xede5f7c4309fd3c6cc0cc6bfc5a5d17ac0d6ff3e6655f043cb1f8d43adecfda6"),
          avax("0x98dc5775e6b221e100341c9766f4c778df8d7419ddb8bd3b24298a99cb1f471c"),
          avax("0x76d883ddf67cf64b6be3a6f05fd917e0e49898aa379f67ab51f147ca112297d9"),
          avax("0xbfe3850d51d0d1b15eac75121b58a6f419d0b2e1acd117967d443e6121f8352f"),
          avax("0x73c44a2b95c9b7e88afc4ea98e36fa4383f05b7042025c8516652f66faaeaac6"),
          avax("0xe23852a5aa3fe7d5d66518ea0d032045f45bae8bc20405e65ba3917911429214"),
        ],
        addresses: [{ chain: "avalanche", address: "0x4b024b1609e1c3c8335a7396748e9339c671dfa6" }],
      },
      {
        id: "sharedRecipient",
        txs: [
          avax("0xfd2e70bf63aa1c571665e031d46913ea58349159b11230ea7070eb36bc25943f"),
          avax("0xd1610cca544ddb95ee8929b1592c76b3796e955e6843373f1baf32171e99a3ff"),
          avax("0xcc26c7c68c4ff08b05555a59fbac3ca0bcfbdb1868d9649980c75728dd31348d"),
        ],
        addresses: [{ chain: "avalanche", address: "0xf13b3349c3a1c76ac6d101ee0da4aec152a7256c" }],
      },
    ],
  },
  {
    id: "holderJ",
    kind: "linked",
    confidence: "confirmed",
    wallets: [
      { address: "0x4a7f785a9250f1ee6c3449585e321e6f5191b6d9" },
      { address: "0xc608238743573144c9f1fe77471776f77db90326" },
    ],
    evidence: [
      {
        id: "coinsBothWays",
        txs: [
          avax("0x441481198be0e9d43444ce58a73d21872a67037d457d34b253ce57296b36655a"),
          avax("0x311c386e836758ced3ef09997e6d6e53031237e37020ddb5999c17a11e05a81d"),
          avax("0x84acfeaa8733e19de65fdf8bf7f40f4d93bfa4b7921903c281652167d539fa36"),
          eth("0x5fa835354462a43b9808c099588d92bfe686404fe7360edddf744dbb1e6d6c10"),
          avax("0xf0f478441707597e870b4efa73824c9ca474647484c18afa02d34bc1b1248067"),
        ],
      },
      {
        id: "sameEveningLocks",
        txs: [
          avax("0x42352e75f2e1f66796d7567f8ba0bc121db0a2d895bee262547f9727ba3c39da"),
          avax("0x136940ff481cc78e87bab2b0837ddf0869ffc5e25453ecd54b43045ae7b85ef4"),
        ],
      },
    ],
  },
  {
    id: "holderL",
    kind: "linked",
    confidence: "likely",
    wallets: [
      { address: "0x8d57c54dd3371e54610c30804e6151e293cc1604" },
      { address: "0xd2d8987b8df62c0639be4cb89d65b51e8709b3d8" },
    ],
    formerWallets: [
      "0x8d16b745c2e1aefd102f9743693b2378eae56cdd",
      "0x5739e68e77d45017f616c6dfd15be0e7e4d75ac4",
    ],
    evidence: [
      {
        id: "funderChain",
        txs: [
          avax("0x45dc7343cc7024d7612c386bbf8b2713b47022c6c6125647db2b2e76f1ef1267"),
          avax("0x63a5050dd1aa7589eb30cf7390d056993e24cae0829bcc403fb43a56a0586369"),
          avax("0x911a599550e0f59ec0d77768496b58ded345f77ed1932de04c358b4b8581de6e"),
          avax("0xe84c936bf7136504ea159400cc7dea64792ad3afdbc282eacce544c380c081fc"),
        ],
        addresses: [
          { chain: "avalanche", address: "0x5739e68e77d45017f616c6dfd15be0e7e4d75ac4" },
          { chain: "avalanche", address: "0x8d16b745c2e1aefd102f9743693b2378eae56cdd" },
        ],
      },
      {
        id: "directTransfer",
        txs: [avax("0xc2af8d1950792ee30dfd15457e1696d3ec1f8a68a19f26a0faf891a9c274c31f")],
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

/**
 * Esteban's deployer and ENS wallets sending their Uniswap V2 liquidity tokens to the zero address:
 * 7,208 and 673 of the pair's 9,103.5, so 86.6% of the pool can never be withdrawn.
 */
export const LP_BURN_TXS: TxRef[] = [
  eth("0x5dd335d4a00837717701c701419e398dbb21103c84111e9be9a554a7a0fa8a75"),
  eth("0x0acba8c2f442b679893f1997e052b4ad30c569415a2df0647f68074fa965cb74"),
];

/**
 * The burned LP tokens' share of the pair's supply at the burn. Other providers adding or removing
 * liquidity would move it, along with the 86.6% written in the pool note and the history event.
 */
export const LP_BURNED_SHARE = 7_881 / 9_103.53;

export type HistoryEvent = {
  id: string;
  /** ISO date; `precision` limits what is shown when the exact day is not known. */
  date: string;
  precision?: "day" | "month" | "year";
  txs?: TxRef[];
  messageIds?: number[];
  link?: string;
};

/** The day plebbit announced its new name, Bitsocial, at https://t.me/plebbit/2. */
export const REBRAND_DATE = "2026-03-18";

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
  { id: "rebrand", date: REBRAND_DATE },
  { id: "rebase", date: "2026-05-02" },
  {
    id: "immutable",
    date: "2026-07-02",
    txs: [eth("0x484af845fd8335b6963f38787f34ace516286667e1ce2399aae990e2a160d8db")],
  },
  { id: "liquidityBurned", date: "2026-10-30", txs: LP_BURN_TXS },
];

export const GEN1_TOKEN_ADDRESS = "0x625fc9bb971bb305a2ad63252665dcfe9098bee9" as const;
export const GEN2_TOKEN_ADDRESS = "0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f" as const;
