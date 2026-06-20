---
title: Voucher Challenge
description: Anti-spam challenge that gates publishing behind unique voucher codes distributed by community owners.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge gates content publication behind unique voucher codes distributed by the community owner. Rather than relying on automated scoring, it shifts trust to a manual invite flow where known people receive codes through a channel the owner controls.

- **Source code and current README:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge#readme)
- **npm package:** [`@bitsocial/voucher-challenge`](https://www.npmjs.com/package/@bitsocial/voucher-challenge)

## Installation

```bash
npm install @bitsocial/voucher-challenge
```

## How It Works

1. A community owner generates one or more unique voucher codes.
2. The owner distributes those codes to trusted authors through a channel of their choice (direct message, email, in-person, etc.).
3. When an author attempts to publish, the challenge system prompts them for a voucher code.
4. The code is validated -- if it is genuine and has not already been used, the publication is accepted.

Each voucher code is tied to a specific author once redeemed, preventing reuse by others.

## Current Package Reference

This page is intentionally an overview, not a mirrored setup guide. The package README is the source of truth for current challenge names, Bitsocial CLI examples, pkc-js registration, supported options, and redemption behavior:

- [Voucher Challenge README](https://github.com/bitsocialnet/voucher-challenge#readme)

Prefer the upstream README when configuring a live community, because voucher options and install flows are versioned with that package rather than this website.

## When to Use It

Voucher Challenge is best suited for:

- **Invite-only communities** where membership is intentionally restricted.
- **Curated spaces** where the owner personally vets every participant.
- **High-trust environments** where automated spam scoring is unnecessary or undesirable.

Because it requires manual code distribution, it does not scale to large open communities. For those scenarios, consider [Spam Blocker](./spam-blocker.md) or [EVM Contract Call Challenge](./evm-contract-call.md) instead.
