export const BSO_TOKEN_ADDRESS = "0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A" as const;

export const BSO_TOKEN_ADDRESS_SHORT = "0xB50c…DaB5A";

export const ETHERSCAN_TOKEN_URL = `https://etherscan.io/token/${BSO_TOKEN_ADDRESS}` as const;

export const UNISWAP_TOKEN_URL =
  `https://app.uniswap.org/explore/tokens/ethereum/${BSO_TOKEN_ADDRESS}` as const;

export const COINGECKO_URL = "https://coingecko.com/coins/bitsocial" as const;

export const BITSOCIAL_URL = "https://bitsocial.net" as const;

export const DOCS_URL = "https://bitsocial.net/docs" as const;

export const GITHUB_URL = "https://github.com/bitsocialnet" as const;

export const TWITTER_URL = "https://twitter.com/bitsocialnet" as const;

export const CONTRIBUTE_URL =
  "https://github.com/bitsocialnet/bitsocial-web/tree/master/chain" as const;

export type ExternalLink = {
  label: string;
  href: string;
  icon?: "etherscan" | "coingecko" | "uniswap";
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
];
