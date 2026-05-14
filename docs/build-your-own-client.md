---
title: Build your own client
description: Builder guide for shipping independent Bitsocial clients, from imageboards and forums to niche social apps.
---

# Build your own client

Bitsocial does not win by having one official app for every use case. It wins when many clients can
share the same protocol while competing on interface, culture, discovery, defaults, and business
model.

5chan and Seedit are early proof points, not a ceiling. A builder should be able to ship a new
imageboard, a forum, a profile client, a mobile-first social app, a niche community tool, or a
centralized client that uses Bitsocial underneath without asking permission from a platform owner.

## What builders can change

A Bitsocial client can compete on product decisions without forking the whole network:

- interface and visual language
- onboarding flow
- community defaults
- moderation surfaces
- discovery model
- media experience
- mobile, desktop, or low-bandwidth constraints
- monetization and business model

The common layer is the protocol. The product layer is open to competition.

## Fastest way to learn

Start with the apps that already exist:

- Try [5chan](https://5chan.app) for anonymous imageboard communities.
- Try [Seedit](https://seedit.app) for Reddit-style discussion.
- Read the [Bitsocial React hooks](/developer-tools/react-hooks/) docs for client-side integration.
- Read the [Bitsocial CLI](/developer-tools/cli/) docs for node and community operations.

If you want to move quickly, contribute to an existing app first. If the interface, culture, or
community model you want does not fit, build a separate client.

## Pick a narrow first version

The best first version is not a universal social app. It is a client with one clear audience and one
strong reason to exist.

Good starting points include:

- a cleaner imageboard client for one specific culture
- a mobile-first forum client
- a single-community app with strict defaults
- a creator community client
- a read-only discovery client
- a moderation or operator console
- a client optimized for a language, region, or device class

Small clients are useful because Bitsocial lets them grow into the same network instead of trapping
their users in a private database.

## Implementation paths

There are three practical paths:

1. Fork an existing client when your idea is close to 5chan or Seedit.
2. Build a new React client with Bitsocial React hooks.
3. Build your own integration on top of node APIs and public RPC infrastructure.

Public RPC should make the third path much more practical. A user can start through a hosted,
non-custodial RPC provider, then move to self-hosting or a competing provider later.

## Design principle

Do not wait for one flagship app to solve every category. Build the client that should exist for
your community, then let compatible clients compete in public.
