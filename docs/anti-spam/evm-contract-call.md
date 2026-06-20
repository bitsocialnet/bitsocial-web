---
title: EVM Contract Call Challenge
description: Anti-spam challenge that verifies on-chain conditions by calling an EVM smart contract.
sidebar_position: 4
---

# EVM Contract Call Challenge

EVM Contract Call Challenge verifies an author's on-chain state before allowing a publication. Community owners can require a wallet or resolved identity to satisfy a read-only smart-contract condition, such as holding a minimum token balance, before posting.

- **Source code and current README:** [github.com/bitsocialnet/evm-contract-challenge](https://github.com/bitsocialnet/evm-contract-challenge#readme)
- **npm package:** [`@bitsocial/evm-contract-challenge`](https://www.npmjs.com/package/@bitsocial/evm-contract-challenge)

## Installation

```bash
npm install @bitsocial/evm-contract-challenge
```

## Where It Fits

Use this challenge for communities where participation should depend on an external EVM signal: token ownership, NFT ownership, proof-of-personhood scores, governance membership, or another contract-readable condition.

The challenge is automatic from the author's perspective once configured. It checks eligible wallet or identity sources, calls the configured contract method, and compares the returned value against the community's condition.

## Current Package Reference

This page is intentionally an overview, not a mirrored configuration reference. The package README is the source of truth for challenge names, Bitsocial CLI examples, pkc-js registration, option defaults, ABI examples, RPC behavior, and supported wallet sources:

- [EVM Contract Challenge README](https://github.com/bitsocialnet/evm-contract-challenge#readme)

Prefer the upstream README when configuring a live community, because contract options and examples are versioned with that package rather than this website.

## When to Use It

EVM Contract Call Challenge is ideal for:

- **Token-gated communities** that restrict posting to token holders.
- **NFT-gated access** where ownership of a specific NFT is required.
- **DAO governance spaces** where participation is limited to governance token holders.

For communities that do not rely on on-chain identity, consider [Spam Blocker](./spam-blocker.md) or [Voucher Challenge](./voucher-challenge.md) instead.
