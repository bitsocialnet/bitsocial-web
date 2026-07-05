export const BSO_TOKEN_ADDRESS = "0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A" as const;

export const BSO_TOKEN_ADDRESS_SHORT = "0xB50c…DaB5A";

export const ETHERSCAN_TOKEN_URL = `https://etherscan.io/token/${BSO_TOKEN_ADDRESS}` as const;

export const DOCS_TOKEN_HISTORY_URL = "https://docs.bitsocial.net/token-history" as const;

export const UNISWAP_TOKEN_URL =
  `https://app.uniswap.org/explore/tokens/ethereum/${BSO_TOKEN_ADDRESS}` as const;

export const DEXSCREENER_PAIR_ADDRESS = "0xae8d1a28c8fa6b71c4099ede2d7924672dc51e32" as const;

export const DEXSCREENER_TOKEN_URL =
  `https://dexscreener.com/ethereum/${DEXSCREENER_PAIR_ADDRESS}` as const;

export const COINGECKO_URL = "https://coingecko.com/coins/bitsocial" as const;

export const BITSOCIAL_URL = "https://bitsocial.net" as const;

export const ABOUT_URL = "https://bitsocial.net/about" as const;

export const BLOG_URL = "https://bitsocial.net/blog" as const;

export const PROOF_OF_CONCEPT_URL = "https://github.com/bitsocialnet/bitsocial-chain" as const;

export const GITHUB_URL = "https://github.com/bitsocialnet" as const;

export const TWITTER_URL = "https://twitter.com/bitsocialnet" as const;

export const TELEGRAM_URL = "https://t.me/bitsocialnet" as const;

export const CONTRIBUTE_URL =
  "https://github.com/bitsocialnet/bitsocial-web/tree/master/chain" as const;

export type ExternalLink = {
  label: string;
  href: string;
  icon?: "etherscan" | "coingecko" | "uniswap" | "dexscreener";
};

export const TOPBAR_LINKS: ExternalLink[] = [
  { label: "Etherscan", href: ETHERSCAN_TOKEN_URL },
  { label: "CoinGecko", href: COINGECKO_URL },
  { label: "Uniswap", href: UNISWAP_TOKEN_URL },
  { label: "Main Site", href: BITSOCIAL_URL },
];

export const FOOTER_TOKEN_LINKS: ExternalLink[] = [
  { label: "Etherscan", href: ETHERSCAN_TOKEN_URL, icon: "etherscan" },
  { label: "CoinGecko", href: COINGECKO_URL, icon: "coingecko" },
  { label: "Uniswap", href: UNISWAP_TOKEN_URL, icon: "uniswap" },
  { label: "DEX Screener", href: DEXSCREENER_TOKEN_URL, icon: "dexscreener" },
];
