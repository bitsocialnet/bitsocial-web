---
title: Build an imageboard client
description: Phase 1 contribution guide for builders who want to ship new imageboard experiences on Bitsocial.
sidebar_position: 1
---

# Build an imageboard client

Phase 1 is not about one official app covering the whole category. 5chan is the first proof point, but the actual goal is a broad imageboard ecosystem: multiple Bitsocial clients with different visual languages, moderation defaults, directory models, and target communities.

## What Phase 1 needs

- Familiar 4chan-style clients for mainstream onboarding
- Altchan-inspired clients with different cultures and board bundles
- Mobile-first or low-bandwidth clients
- Single-community or niche clients with strong opinionated defaults
- Better moderation, media, onboarding, or discovery flows than the first app ships with

## Fastest way to help

If you want the shortest path to shipping, contribute to 5chan directly first:

- Explore the live app at [5chan.app](https://5chan.app)
- Review the source at [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Join the builder chat at [t.me/fivechandev](https://t.me/fivechandev)

## Build your own client

If 5chan does not match the community or interface you want, build a separate client instead. Compatible Bitsocial clients can share the same network without sharing the same product decisions.

1. Learn the protocol-facing tools:
   - [Bitsocial React hooks](../react-hooks/)
   - [Bitsocial CLI](../cli/)
2. Decide what kind of imageboard you are actually building.
   Choose the board structure, identity assumptions, moderation model, discovery flow, and visual language first.
3. Pick the implementation path that fits the project.
   Fork 5chan if you want to move fast with a familiar imageboard base. Start fresh if the UI or interaction model needs to be radically different.
4. Ship a narrow first version.
   One client that serves one real community well is more valuable than a vague clone meant to satisfy everyone.
5. Publish the result and let communities test it.
   Bitsocial improves when outside builders ship opinionated clients that compete on product quality instead of waiting for one official app to do everything.

## Design principle

Bitsocial does not win by having one blessed client. It wins when many clients can coexist, fork, specialize, and serve needs the first app never will.
