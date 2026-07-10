---
title: A complete layman explanation of the Bitsocial protocol
description: A plain-English walkthrough of Bitsocial communities, peer lookup, publishing, anti-spam challenges, moderation, and apps.
---

# A complete layman explanation of the Bitsocial protocol

This page explains Bitsocial without assuming you already understand peer-to-peer networking,
cryptographic keys, IPFS, or pubsub.

Some details are simplified on purpose. For the more technical version, read the
[Peer-to-Peer Protocol](./peer-to-peer-protocol.md) page.

## The short version

Bitsocial is a protocol for social apps where communities are owned by keys instead of by a
company database.

A Bitsocial community has an address. Apps use that address to find peers that are serving the
community, fetch the latest posts from those peers, and publish new posts through a peer-to-peer
message channel. Before a post is accepted, the community can require an anti-spam challenge such
as a captcha, invite code, payment, token check, AI moderation check, allowlist, or any other rule
that can be coded.

That is the core idea:

1. A community is controlled by a private key.
2. The public key gives the community a stable address.
3. Peers help readers find and fetch the community.
4. A community node accepts or rejects new posts.
5. Anti-spam policy belongs to each community, not to one global platform.

## Why hashes matter

A hash is a short fingerprint for data.

If two people hash the exact same file, they get the same fingerprint. If the file changes, the
fingerprint changes. That makes hashes useful for finding and checking data without trusting a
company to tell you what the file is.

Peer-to-peer systems use this idea constantly. Instead of asking one website for "the file named
photo.png", a peer can ask the network for the data with a specific fingerprint. If another peer
returns the wrong data, the hash check fails.

Bitsocial uses hashes and content identifiers for post data and other pieces of community state.
The important point is simple: data can be addressed by what it is, not only by where a company
hosted it.

## Why public keys matter

A public key and a private key are a matched pair.

The private key is secret. It is the thing that gives control. The public key is safe to share. It
lets everyone else check that a message, update, or moderation action really came from the matching
private key.

This is how Bitsocial avoids normal platform accounts. A company does not need to issue the
identity. A database row does not need to define the owner. The keypair is the authority.

In plain terms:

- the private key is the owner's control handle
- the public key is the public identity or address
- signatures prove that an action came from the owner

## What a Bitsocial community is

A Bitsocial community is not just a page in one app.

It has its own keypair. The public key gives the community a stable network address. The private key
controls updates to the community's state, such as metadata, rules, moderator list, challenge
configuration, and the pointers to the latest accepted content.

That means a community can outlive one interface. One app can show it as a board. Another app can
show it as a forum. A future app can show it in a profile-based feed. The app can change, but the
community address still points to the same owned community.

## How reading works

When a user opens a Bitsocial community, the app does not ask one central database for the page.

The flow is closer to this:

1. The app already knows the community address, or gets it from a list, link, search surface, or
   human-readable name.
2. The app asks lightweight routers which peers currently provide that community address.
3. The routers return peer addresses only. They do not return posts, rules, profiles, or community
   metadata.
4. The app connects to peers and fetches the latest community state.
5. That state contains pointers to post content.
6. The app fetches the post content from peers and renders it in a normal social interface.

The router is only a lookup helper. It is closer to asking "who has this?" than asking "please
serve me the whole website."

For more detail on this split, read [Content Discovery](./content-discovery.md).

## How posting works

Posting is different from reading because open peer-to-peer networks can be spammed.

Bitsocial handles publishing through a challenge-response flow:

1. The user writes a post or reply.
2. The app joins the community's peer-to-peer message topic.
3. The app asks the community node for a challenge.
4. The community node sends back the challenge.
5. The user or app completes the challenge.
6. The app sends the post plus the challenge answer.
7. The community node checks the answer and the post.
8. If it passes, the community node accepts the post into the community's next update.
9. Other readers fetch the updated community state from peers.

The challenge happens before the post becomes part of the accepted community state. That is the
important difference from systems where spam is accepted first and hidden later.

## Why anti-spam challenges matter

Most social platforms turn anti-spam into platform policy. One company decides what counts as a
valid account, valid post, valid reach, or valid user.

Bitsocial separates those things. The protocol gives communities a way to require a challenge
before accepting a post, but it does not force every community to use the same challenge.

One community might use a captcha. Another might use invite codes. Another might require an SMS
check, a payment, an NFT, a token balance, an AI moderation score, a proof of reputation, a
community-specific allowlist, or a custom rule.

That flexibility matters because spam changes. A protocol-level spam rule becomes stale. A
community-level challenge can evolve without migrating the whole network.

For the focused explanation, read [Custom Anti-Spam Challenges](./custom-challenges.md).

## How moderation works

Bitsocial is not moderation-free. It is moderation without one global super-admin.

A community can have owners and moderators. Moderator addresses are part of the community state.
When a moderator takes an action, that action can be signed. The community node and clients can
check the signature against the moderator list.

That gives moderation a local scope:

- a community owner controls that community
- moderators act through keys the community recognizes
- apps can still choose what they index, rank, hide, or highlight
- no protocol-level company account can erase every identity or seize every community

In practice, this means a community can remove spam or enforce rules inside its own space without
turning its rules into law for the entire network.

For the policy view, read [Local Moderation, Not Global Bans](./local-moderation.md).

## What apps add

The protocol does not decide what the whole product should look like.

An app adds the human experience around the protocol:

- default community lists
- search and discovery
- feeds and ranking
- layout and posting interface
- media handling
- moderation tools
- mobile, desktop, or browser packaging
- business model and defaults

That is why Bitsocial can support different app styles. 5chan can feel like an imageboard. Seedit
can feel like forum-style discussion. Other clients can build different discovery surfaces,
ranking systems, moderation views, or community defaults while still using compatible Bitsocial
communities underneath.

The protocol keeps ownership and publishing portable. Apps compete on product quality.

## What public RPC adds

Running a peer-to-peer community node directly is powerful, but not everyone wants to manage an
always-on machine.

Public RPC is the service layer that can make Bitsocial more convenient. A public RPC provider can
help users manage communities from a phone or lightweight client, while the long-term ownership
model should still let users move away, self-host, or choose a competing provider.

The distinction matters:

- RPC can help with uptime and convenience
- RPC should not become permanent custody
- the owner relationship should remain tied to keys, not to one provider's database

The first service built on this model is Forge RPC by [Bitsocial Forge](https://bitsocialforge.com/#forge-rpc), which builds on the [Delegated IPNS](https://github.com/pkcprotocol/pkc-js/blob/master/docs/protocol/delegated-ipns.md) protocol design.

## What Bitsocial is not

Bitsocial is not a blockchain social network. Social media does not need every post to become a
transaction in one global ledger.

Bitsocial is not federation in the ActivityPub sense. A community does not need to be an account on
one server with one domain, one admin, and one server database.

Bitsocial is also not one app. It is a shared protocol layer for apps, communities, nodes, routers,
RPC providers, discovery services, anti-spam modules, and moderation tools.

The point is not that every user needs to understand all of this before posting. The point is that
the product can feel normal while the ownership model underneath is different.

## Where to go next

- [Peer-to-Peer Protocol](./peer-to-peer-protocol.md) explains the technical flow.
- [Content Discovery](./content-discovery.md) explains network lookup versus app curation.
- [Custom Anti-Spam Challenges](./custom-challenges.md) explains the challenge system.
- [Identity and Community Ownership](./identity-and-ownership.md) explains key-controlled
  ownership.
- [Build your own client](/build-your-own-client/) explains how independent apps can build on
  the same network.
