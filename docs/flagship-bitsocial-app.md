---
title: Decentralize Twitter/X
description: "Phase 3 of the master plan: a focused, decentralized Twitter/X alternative for text-first public conversation with replaceable infrastructure."
---

# Decentralize Twitter/X

Phase 3 is a plan to build a focused, decentralized alternative to Twitter/X. Its center is
text-first public conversation: short posts, replies, reposts, follows, real-time discussion, and
communities, with the platform layer broken open.

Twitter/X is still defined by posts, text, and sharing ideas. The Phase 3 client should compete on
that core experience and make it work exceptionally well.

This page describes product direction, not a locked release spec. The exact interface, default feed,
ad model, AI features, and RPC marketplace can change as the protocol and early apps mature.

## What it should prove

The client should prove that a profile-based social network can avoid becoming a custodial platform:

- users can own identities and profiles
- communities and profile nodes can stay peer-to-peer
- communities can carry network effects across Bitsocial clients
- RPC providers can make the app convenient without taking custody
- feed algorithms can be optional services instead of platform law
- other clients can still compete for the same network

The goal is to build the strongest public-conversation client possible and show how far the protocol
can stretch.

## Familiar in purpose, replaceable by design

The default experience should be competitive with Twitter/X at its core: a fast home feed, text
posts, follows, replies, repost-style distribution, communities, notifications, search, and a ranked
For You view that works immediately.

Bitsocial Forge can run the first default RPC and feed service. That default can include a ranked
feed and ads so the app feels complete on day one instead of asking mainstream users to assemble the
whole stack themselves.

The difference is that the default should not become the prison. A user should be able to switch
RPCs, feeds, instances, ranking systems, ads, and discovery providers, or remove ranking entirely.
The client can be opinionated at first launch while keeping every major service replaceable.

That makes the client more customizable than a conventional platform. One user might keep the default
ranked feed with ads. Another might use a chronological feed with no ranking. Another might choose a
privacy-focused RPC, a community-run discovery service, a paid ad-free feed, or a niche algorithm
built for a specific subculture.

## Cross-client communities

Communities should be much more important than isolated groups inside one app.

On Twitter/X, communities are confined to the product. They can be useful, but they inherit the
limits of one platform, one account system, one recommendation stack, and one product surface.

A Bitsocial community can be created, hosted, discovered, and used through different clients. That
means the Phase 3 client can show communities and posts from the wider Bitsocial network, not only
from users who started inside it. A community could have activity from an imageboard client, a
Reddit-style discussion client, a niche forum client, a mobile app, and the Phase 3 client at the
same time.

That is the core network-effect advantage: one client can feel familiar to mainstream users while
still pulling value from many clients, community nodes, RPC providers, and independent services.

## Optional feed algorithms

The Phase 3 client should not force one global ranking system on everyone.

Feed algorithms should be opt-in. A user could choose an algorithm from a marketplace, switch
providers, use an algorithm from a company, use one run by an anonymous operator, use one built by a
community, run a personal one, or use no algorithm at all.

Public RPC providers are a natural place for these services to compete. They can index, rank, and
recommend content, but they should not own the user or the profile.

Those services can also compete on the shape of the app itself. One RPC might provide a ranked feed
with ads. Another might provide an unranked chronological feed. Another might specialize in privacy,
translation, moderation, community discovery, or a niche social graph.

If the economics work, RPC-backed feed services could add AI features similar to what mainstream
platforms are trying to put into their feeds: automatic translations, summaries, bot-assisted
replies, search answers, moderation assistance, or community-note style context.

Those features should be service choices, not protocol requirements. A default RPC can compete by
offering a richer feed, but users and competing clients should still be able to choose simpler,
private, chronological, ad-free, or community-specific alternatives.

## Non-custodial RPC

Each user should be able to participate as a full peer-to-peer node through RPC without giving the
RPC provider ownership over their identity or profile.

The hosted path matters because most users will not start by running a server. The exit path matters
just as much: a user should be able to move to their own profile node on low-spec hardware, including
a Raspberry Pi, whenever they want.

That is the difference between convenience and custody.

## Public conversation, strengthened by Bitsocial Chain

Bitsocial Chain can bring durable naming, payments, tipping, awards, and other financial rails
directly into public conversation.

The Phase 3 client stays centered on posts, text, sharing ideas, and real-time discussion while
sharing communities and network effects with other Bitsocial clients.
