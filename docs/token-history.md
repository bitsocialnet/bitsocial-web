---
title: BSO Token History
description: The full generation history of the BSO token, from its 2021 Avalanche origin to today's immutable, adminless Ethereum contract.
---

# BSO Token History

BSO is a provenance coin. The protocol behind Bitsocial is open, and the token and chain are
optional by design: anyone can fork the code, run their own client, or build their own economy on
top of it. What cannot be forked away is provenance. BSO has been the official Bitsocial token
since day one, and every migration since then is verifiable on-chain.

This page lists every generation of the token, in order, with full contract addresses so anyone can
check the record independently.

## Gen 1: the origin, Avalanche, 2021

- **Chain**: Avalanche
- **Year**: 2021
- **Address**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorer**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

This is where BSO started. The full supply was airdropped, with no presale and no team allocation
carved out ahead of the community. The contract was an upgradeable proxy, which was standard
practice at the time and let the team ship fixes during the token's early life.

## Gen 2: the move to Ethereum, 2024

- **Chain**: Ethereum
- **Year**: 2024
- **Address**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 moved BSO from Avalanche to Ethereum, where the rest of the Bitsocial Chain roadmap is built.
Like Gen 1, this contract was still an upgradeable proxy, kept for one more generation while the
final, permanent contract was prepared.

## Gen 3: fully immutable, 2025

- **Chain**: Ethereum
- **Year**: 2025
- **Address**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 is the current and final BSO contract. It is fully immutable and adminless:

- no mint function, so supply cannot be inflated
- no owner address, so no one can unilaterally change contract behavior
- no pause function, so transfers cannot be frozen
- no proxy pattern, so the logic itself cannot be swapped out later

This is the end state the first two generations were built toward: a token with no admin keys left
to hold.

## How the migrations worked

Each migration, Gen 1 to Gen 2 and Gen 2 to Gen 3, was a passive 1:1 airdrop. Holders did not need
to submit a claim, sign a message, or take any action at all. Balances on the old contract were
read directly and mirrored 1:1 onto the new contract, so a holder's position was preserved exactly
across the migration.

Because both the old and new contracts remain public and on-chain, every step of this process is
independently verifiable. Anyone can compare historical holder snapshots from Gen 1 or Gen 2 against
current Gen 3 balances and confirm the migration matched what it claimed to do. No part of this
history depends on trusting Bitsocial's word for it.

## Verify everything

Do not take any of this on faith. Check the record directly:

- Gen 1 on [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 on [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 on [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- the current chain site at [chain.bitsocial.net](https://chain.bitsocial.net)

If an address does not match what is listed here, it is not the official BSO token.
