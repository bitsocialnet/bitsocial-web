---
title: Content Discovery
description: How Bitsocial separates peer discovery from app-level curation.
---

# Content Discovery

Bitsocial does not put one global feed, search index, or ranking algorithm in the protocol. It
separates content discovery into two layers:

1. **Network lookup** finds the peers currently serving a known community.
2. **App curation** decides which communities, boards, lists, or posts a product shows first.

This keeps the protocol small while leaving room for many discovery experiences to compete.

## Network lookup

Every community has a stable address derived from its public key. When a client already knows that
address, it queries lightweight HTTP routers to find peers that announced themselves as providers
for it.

The routers only return provider peer addresses. They do not store posts, metadata, user lists, or a
human-readable directory of communities. After the client receives peer addresses, it connects to
those peers and fetches the latest community metadata plus content pointers, then fetches the actual
post data by hash.

This answers the protocol question: "Where can I fetch the latest state for this community?"

## App curation

The separate product question is: "Which communities should a user see first?"

Bitsocial leaves that to apps, lists, and users instead of baking one answer into the network.
Examples include:

- a client showing communities the user already follows
- a curated default list for a Reddit-style app
- directory slots for an imageboard-style app
- search or ranking indexes maintained by a specific app
- direct links shared by users

Apps can index, rank, filter, or highlight different things without turning those choices into
protocol law. If one app's discovery surface is not useful, another app can build a different one on
the same underlying communities.

## Current apps

5chan currently uses familiar directory paths such as `/b/` or `/g/`. Directory assignments are
managed through a public list today, with future versions expected to support in-app board creation
and voting for directory slots.

Seedit uses default community lists for its front page. Communities can still be created and shared
outside that default list.

In both cases, the app-level list helps users find something to open, and the protocol-level lookup
then resolves the chosen community to peers.

## Why this split matters

A single decentralized network still needs good discovery, but the discovery layer should be
replaceable. Bitsocial's core protocol focuses on addressability, peer lookup, publishing, and
anti-spam. Curation lives above that layer, where apps can experiment with directories, default
lists, feeds, search, voting, and moderation policies without requiring a network-wide migration.
