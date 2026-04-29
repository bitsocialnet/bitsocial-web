---
title: EVM Contract Call Challenge
description: Anti-spam challenge that verifies on-chain conditions by calling an EVM smart contract.
sidebar_position: 4
---

# EVM Contract Call Challenge

EVM Contract Call Challenge is an anti-spam mechanism that verifies on-chain conditions before allowing a publication. It lets community owners require authors to meet smart-contract-defined criteria -- for example, holding a minimum token balance -- in order to post.

**Source code:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Requirements

- **Node.js** >= 22
- **ESM-only** -- this package does not ship CommonJS builds.

## Installation

```bash
npm install @bitsocial/evm-contract-challenge
```

## Configuration Options

| Option        | Type     | Description                                                                                                       |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | The chain to query (e.g., `eth`, `matic`, `avax`).                                                                |
| `rpcUrls`     | `string` | Optional comma-separated JSON-RPC URLs for the chain (e.g., `https://eth.llamarpc.com,https://rpc.ankr.com/eth`). |
| `address`     | `string` | The smart contract address to call.                                                                               |
| `abi`         | `string` | The ABI fragment for the function being called.                                                                   |
| `condition`   | `string` | A comparison expression evaluated against the contract return value (e.g., `> 1000`).                             |
| `error`       | `string` | The error message shown to authors who do not meet the condition.                                                 |

## Example

A community owner who wants to restrict posting to authors holding more than 1,000 of a particular ERC-20 token would configure the challenge with:

- `chainTicker`: `"eth"`
- `address`: the token contract address
- `abi`: the ABI for `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

When an author attempts to publish, the challenge calls `balanceOf` with the author's address and checks whether the returned value satisfies the condition. If it does, the publication proceeds; otherwise, the configured error message is returned.

## When to Use It

EVM Contract Call Challenge is ideal for:

- **Token-gated communities** that restrict posting to token holders.
- **NFT-gated access** where ownership of a specific NFT is required.
- **DAO governance spaces** where participation is limited to governance token holders.

For communities that do not rely on on-chain identity, consider [Spam Blocker](./spam-blocker.md) or [Voucher Challenge](./voucher-challenge.md) instead.
