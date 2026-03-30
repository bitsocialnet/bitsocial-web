---
title: Custom Anti-Spam Challenges
description: Why Bitsocial lets each community define its own anti-spam policy.
---

# Custom Anti-Spam Challenges

Bitsocial does not assume one universal spam defense. Each community can decide what a valid post
or reply requires, and that challenge can be as lightweight or opinionated as the operator wants.

## What a challenge can be

- A captcha
- An account-age or reputation check
- SMS verification
- A small payment
- A token or NFT requirement
- IP-based rules
- An allowlist
- Any other policy that can be expressed in code

## Why this matters

Spam resistance stays local to the community instead of being outsourced to a protocol-wide
moderation authority. The node that hosts the community can communicate the challenge
peer-to-peer, which means communities can adapt their defenses without forcing the entire network
into one policy.

## What this changes

On a centralized platform, anti-spam policy usually becomes product policy. When that happens, one
company decides what counts as a valid account, a valid post, or acceptable reach.

Bitsocial breaks that coupling:

- the protocol stays neutral
- the community chooses the challenge
- apps decide how to present or abstract that challenge

This is a better fit for a network meant to host many kinds of social products rather than one
global default.
