---
title: Bitsocial and Quorum
description: How Quorum, Quilibrium's end-to-end encrypted group messenger with Discord-style Spaces, compares with Bitsocial's public peer-to-peer communities.
---

# Bitsocial and Quorum

[Quorum](https://www.quorummessenger.com/) is a group messenger built by Quilibrium Inc. on its
[Quilibrium](https://quilibrium.com/) network. It is organized like Discord, with Spaces, channels,
roles and direct messages, and everything in it is end-to-end encrypted. It comes up next to
Bitsocial because both describe themselves as peer-to-peer, self-moderated and censorship-resistant.
They aim at different things: Quorum at private group chat, Bitsocial at public communities that
anyone can read.

<!-- TODO: Quilibrium network paragraph -->

## How Quorum works

The details below come from the Quorum client source
([quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop)) as of October 2026.

- **Identities.** A user's master identity is an Ed448 keyset, and each device gets its own X448 and
  Ed448 keyset. In the browser the keys are protected by a passkey. Addresses are hashes that start
  with `Qm`, and users can show a Quilibrium Name Service name ending in `.q`.
- **Encryption.** Direct messages use the Double Ratchet between devices. A Space shares one Triple
  Ratchet session among its members, who sign their messages with Space-specific keys. Every Space is
  encrypted; Quorum also says its message brokering keeps the relay from linking senders and
  recipients.
- **Joining.** Spaces are entered with invite links. A one-time link carries the key material to join
  in the URL; a public link fetches it from the Quorum server, and public Spaces can be listed in a
  searchable directory.
- **Transport.** The client connects over HTTPS and a WebSocket to `api.quorummessenger.com`, the
  only endpoint in its production configuration. That service relays encrypted messages to each
  member's inbox, and stores user registrations, each Space's encrypted manifest (channels, roles,
  emoji), invite material, the public directory and optional encrypted settings sync.
- **History.** Each member's client keeps its own copy of the Space in local storage. The desktop and
  web client backfills history by asking an online member to sync; the mobile client replays a log
  that the server keeps for each Space, so it can catch up when no other member is online.
- **Moderation.** Roles grant deleting, pinning, muting and `@everyone` mentions. Every member's
  client checks the signature on each moderation action and applies it only if the signer holds the
  right role. The owner can kick a member, which rotates the Space's keys so the kicked member cannot
  read new messages. A Space can require signed messages or let members post unsigned, deniable ones.

## Where they differ

### Private groups and public communities

A Quorum Space is a group of members: only people holding its keys can read it, and joining takes an
invite link. A public link lets anyone in, but only after joining. A Bitsocial community has no
membership. Anyone can read it, from any app, without joining, and anyone can try to post, subject to
the community's challenge.

### What keeps a group online

A Quorum Space has no host. Members post to the Space's inbox on the relay, every member's client
keeps a copy, and the owner does not need to be online for others to talk. A Bitsocial community lives
on its owner's node, which accepts or rejects each post and publishes the community's latest state.
The community stays readable while peers seed it, but cannot accept new posts while its node is
offline. See [Peer-to-Peer Protocol](/peer-to-peer-protocol/).

### Who enforces the rules

In Quorum, enforcement happens at the edge. Each member's client decides whether to apply a deletion,
a pin or a mute, based on the signer's role, and a kick works by moving everyone else to new keys. In
Bitsocial, enforcement happens at the community node: a post that fails the community's challenge or
rules never becomes part of the community. See [Local Moderation, Not Global Bans](/local-moderation/).

### Spam control

Quorum keeps spam out mainly through invitations. A one-time link admits one person, a public link
admits anyone holding it, and the owner can kick and rekey afterwards; the client also rate-limits
its own sending. Bitsocial identities are free keypairs, so each community chooses a challenge to run
before accepting a post, such as a captcha, a payment, a token balance or an allowlist. See
[Custom Anti-Spam Challenges](/custom-challenges/).

### The client and the network

<!-- TODO: refine once Quilibrium network research lands -->

A Quorum client is a client of the Quorum service. The web app, the Electron app and the mobile app
all point at `api.quorummessenger.com`, and the browser does not run a peer-to-peer node of its own. A
Bitsocial web app can run a libp2p node in the tab, fetch community content from peers and publish
over gossipsub. Peer discovery goes through HTTP routers that only return provider addresses, and
clients can switch routers by changing their configuration. See
[Browser Peer-to-Peer](/browser-p2p/).

### Private messages

This is where Quorum is stronger. Direct messages and Space messages are end-to-end encrypted with
forward secrecy, and Quorum's relay is designed so that it cannot read them. Bitsocial focuses on
public communities and has no native direct messages yet. A Bitsocial post is encrypted to the
community node's key while it travels over pubsub, but once accepted it is public.

## Project status

<!-- TODO -->

## Comparison

<!-- TODO -->
