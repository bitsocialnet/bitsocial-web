---
title: Voucher Challenge
description: Anti-spam challenge that gates publishing behind unique voucher codes distributed by community owners.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge is an anti-spam mechanism that gates content publication behind unique voucher codes. Rather than relying on automated detection, it shifts trust to the community owner, who manually distributes codes to people they trust.

**Source code:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## How It Works

1. A community owner generates one or more unique voucher codes.
2. The owner distributes those codes to trusted authors through a channel of their choice (direct message, email, in-person, etc.).
3. When an author attempts to publish, the challenge system prompts them for a voucher code.
4. The code is validated -- if it is genuine and has not already been used, the publication is accepted.

Each voucher code is tied to a specific author once redeemed, preventing reuse by others.

## When to Use It

Voucher Challenge is best suited for:

- **Invite-only communities** where membership is intentionally restricted.
- **Curated spaces** where the owner personally vets every participant.
- **High-trust environments** where automated spam scoring is unnecessary or undesirable.

Because it requires manual code distribution, it does not scale to large open communities. For those scenarios, consider [Spam Blocker](./spam-blocker.md) or [EVM Contract Call Challenge](./evm-contract-call.md) instead.

## Integration

Voucher Challenge plugs into the same challenge interface used by other anti-spam packages in the Bitsocial ecosystem. Community owners enable it through their community settings, and the challenge is presented to authors automatically when they attempt to post.
