---
title: Flagship Bitsocial App
description: The profile-based Bitsocial client proposed for Phase 3 of the master plan.
---

# Flagship Bitsocial App

The flagship Bitsocial app is the proposed first profile-based client for the network. 5chan proves
anonymous communities can work. Seedit moves toward persistent discussion. The flagship app would
add profiles, follows, replies, feeds, communities, and a broader public conversation surface while
keeping the protocol replaceable underneath.

## What it should prove

The app should prove that a profile-based social network can avoid becoming a custodial platform:

- users can own identities and profiles
- communities and profile nodes can stay peer-to-peer
- communities can carry network effects across Bitsocial clients
- RPC providers can make the app convenient without taking custody
- feed algorithms can be optional services instead of platform law
- other clients can still compete for the same network

The point is not to make the only Bitsocial client. The point is to make the first broad client that
shows how far the protocol can stretch.

## Familiar by default, replaceable by design

The default experience should be competitive with mainstream public conversation apps: a fast feed,
follows, replies, repost-style distribution, communities, notifications, and a ranked For You view
that works immediately.

The difference is that the default should not become the prison. A user should be able to switch
RPCs, feeds, instances, ranking systems, ads, and discovery providers, or remove ranking entirely.
The app can be opinionated at first launch while keeping every major service replaceable.

Bitsocial Forge can run the first default RPC and feed service. If that service earns enough revenue,
it can fund stronger infrastructure and richer feed features without making those features mandatory
for everyone.

## Cross-client communities

Communities should be much more important than isolated groups inside one app.

A Bitsocial community can be created, hosted, discovered, and used through different clients. That
means the flagship app can show communities and posts from the wider Bitsocial network, not only from
users who started inside the flagship app.

That is the core network-effect advantage: one client can feel familiar to mainstream users while
still pulling value from many clients, community nodes, RPC providers, and independent services.

## Optional feed algorithms

The flagship app should not force one global ranking system on everyone.

Feed algorithms should be opt-in. A user could choose an algorithm from a marketplace, switch
providers, use an algorithm from a company, use one run by an anonymous operator, use one built by a
community, run a personal one, or use no algorithm at all.

Public RPC providers are a natural place for these services to compete. They can index, rank, and
recommend content, but they should not own the user or the profile.

Those services can also compete on the shape of the app itself. One RPC might provide a ranked feed
with ads. Another might provide an unranked chronological feed. Another might specialize in privacy,
translation, moderation, community discovery, or a niche social graph.

If the economics work, RPC-backed feed services could add AI translations, summaries, bot-assisted
replies, or community-note style context. Those features should be service choices, not protocol
requirements.

## Non-custodial RPC

Each user should be able to participate as a full peer-to-peer node through RPC without giving the
RPC provider ownership over their identity or profile.

The hosted path matters because most users will not start by running a server. The exit path matters
just as much: a user should be able to move to their own profile node on low-spec hardware, including
a Raspberry Pi, whenever they want.

That is the difference between convenience and custody.

## Why it can become an everything-app

If Bitsocial Network gives apps durable naming, payments, tipping, awards, and other financial
rails, the flagship app could become much more than a feed client.

The important constraint is that the app should not become the new owner of the network. It can be a
large client, maybe even the most popular client, while still leaving room for competing apps,
competing RPCs, competing feed algorithms, and self-hosted profile nodes.
