---
title: Bitsocial Chain
description: Phase 2 of the master plan, covering the proposed Ethereum L2 appchain economic layer for Bitsocial apps.
---

# Bitsocial Chain

Bitsocial Chain is the proposed Ethereum L2 appchain economic layer for Bitsocial apps. The current
chain-specific site is [chain.bitsocial.net](https://chain.bitsocial.net).

The peer-to-peer social layer lets communities, identities, and content move outside a central
platform database. Bitsocial Chain is meant to add the shared naming, monetization, and payment
primitives that make those apps harder to starve financially.

## What it is meant to power

- decentralized Bitsocial domains such as `.bso`
- awards and tipping
- durable monetization rails
- shared liquidity across apps
- financial structures that are harder for banks or platforms to choke off
- network effects that do not depend on one company owning the whole stack

The goal is not to lead with token mechanics. The goal is to make useful social apps more durable,
more fundable, and less dependent on centralized payment or naming providers.

## Current proof of concept

The first Bitsocial Chain proof of concept focuses on native `.bso` names. It proves that a name
registry can be derived from Ethereum L1 history without placing social content on-chain:

- users submit register, update, transfer, and revoke intents through plain Ethereum L1 transactions
- anyone can run the derivation node and reconstruct the same `.bso` registry state
- a resolver maps a `.bso` name to the Bitsocial public key that clients already use over the
  peer-to-peer protocol
- posts, votes, moderation, feeds, and community content stay off-chain and peer-to-peer

That proof of concept is not a production Stage 2 launch. It has no proof system, challenge game,
audited code, live deployment, final pricing, or final governance yet. Its long-term posture is
transparent by default and privacy-compatible by design: the core chain is public, while future
tipping, payments, awards, and liquidity should avoid forcing permanent links between social
identity and wallet history.

## Why it matters

Decentralizing communities and identities is necessary, but it is not enough to decentralize all of
social media.

If social apps still depend on a few centralized economic rails, they remain easy to pressure,
deplatform, or starve financially. Bitsocial Chain is the proposed answer to that second layer of
dependency.

## Relationship to apps

Bitsocial Chain should sit under Bitsocial apps, not replace them.

The public-facing result should be:

- communities stay peer-to-peer
- apps stay differentiated
- users get practical naming and monetization features
- creators and communities can receive support across clients
- value can move across the ecosystem without recreating a centralized platform owner

## Why this sits early

The current master plan places Bitsocial Chain immediately after the first wedge categories:
imageboards, forums, and the public RPC layer that makes those apps practical for more users.

That timing matters because social apps need strong network effects. If naming, support, awards,
tipping, and monetization arrive too late, centralized competitors keep their biggest advantage for
too long.

## Design principles

Because Bitsocial Chain is still proposed infrastructure rather than a launched product, the plan
should stay disciplined:

- Apps and communities first. The network layer should make real social products stronger.
- Practical features first. Names, awards, tipping, and payments are easier to explain than abstract
  financial architecture.
- Real contribution over hype. Economic primitives should reward participation, building, and
  community support.
- Curation is allowed. Apps can shape rankings, defaults, and discovery to favor durable
  communities.
- Exact mechanics are still open. This page explains the role of Bitsocial Chain, not a locked
  promise about final economics.
