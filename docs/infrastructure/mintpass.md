---
title: Mintpass
description: NFT-based authentication system that helps Bitsocial communities verify users and reduce sybil attacks.
sidebar_position: 2
---

# Mintpass

Mintpass is an NFT-based authentication system for Bitsocial communities. Users mint a non-transferable verification NFT after completing a challenge (such as SMS OTP), and communities can check NFT ownership to guard against sybil attacks like fake votes, ban evasion, and spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **License**: MIT

## How It Works

The verification flow has four steps:

1. **Request** -- The user visits `mintpass.org/request` to begin the process.
2. **Challenge** -- The user completes an SMS one-time-password verification.
3. **Mint** -- Upon successful verification, a non-transferable NFT is minted to the user's wallet.
4. **Verify** -- Communities query NFT ownership to confirm the user has been verified.

Because the NFT is non-transferable, it stays bound to the wallet that completed verification, preventing users from trading or selling their verified status.

## Project Structure

The repository is organized into three main areas:

| Directory     | Purpose |
|---------------|---------|
| `contracts/`  | Solidity smart contracts for the verification NFT. |
| `challenge/`  | Integration layer for the Bitsocial challenge system. |
| `web/`        | Next.js and React frontend for the minting flow. |

## Privacy and Data Handling

Mintpass takes a minimal-data approach:

- **Operational data** (OTP codes, session tokens) is stored in Redis with short TTLs and automatically expires.
- **Mint association** (the link between a verified identity and a wallet) is the only persistent record.

No phone numbers or personal details are retained after the verification window closes.

## Optional Security Layers

Community operators can enable additional protections depending on their threat model:

- **IP reputation checks** -- Score incoming requests against known abuse databases.
- **Phone-risk assessment** -- Flag disposable or VoIP numbers before issuing a challenge.
- **Geoblocking** -- Restrict verification to specific regions.
- **Per-IP cooldowns** -- Rate-limit repeated verification attempts from the same address.

## Technology Stack

| Layer       | Technology |
|-------------|------------|
| Contracts   | Solidity, deployed with Hardhat and Foundry |
| Frontend    | Next.js + React |
| Network     | Base (Ethereum L2) |

Deploying on Base keeps gas costs low while inheriting Ethereum's security guarantees.

## Roadmap

Planned improvements include:

- **Pay-to-mint option** -- Allow communities to require a small fee for minting, adding an economic sybil barrier.
- **Additional verification signals** -- Expand beyond SMS to other identity signals.
- **Expanded admin tooling** -- Richer dashboards and controls for community operators.
