---
title: Bitsocial and Quorum
description: How Quorum, Quilibrium's end-to-end encrypted group messenger with Discord-style Spaces, compares with Bitsocial's public peer-to-peer communities.
---

# Bitsocial and Quorum

[Quorum](https://www.quorummessenger.com/) is a group messenger built by Quilibrium Inc. on its
[Quilibrium](https://quilibrium.com/) network. It is organized like Discord, with Spaces, channels,
roles and direct messages, and its messages are end-to-end encrypted. It comes up next to Bitsocial
because both describe themselves as peer-to-peer and censorship-resistant, with groups that set
their own rules. They aim at different things: Quorum at private group chat, Bitsocial at public
communities that anyone can read.

Quilibrium describes itself as a decentralized alternative to cloud platforms: a network of nodes
that keep data in an encrypted hypergraph and agree on its state through a consensus it calls Proof
of Meaningful Work. Nodes earn QUIL, the network's token, which pays usage fees. Quorum began in
2018 as Howler, an idea for a private Discord alternative, and became the first app to go live on
Quilibrium, according to the [Quilibrium story](https://docs.quilibrium.com/docs/discover/q-story/).
Quilibrium Inc., founded by Cassie Heart, develops the protocol and offers Quorum as one of its
managed services ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## How Quorum works

The details below come from Quorum's client source,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) for the web and desktop apps
and [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), as of October 2026.

- **Identities.** A user's master identity is an Ed448 keyset, and each device gets its own X448 and
  Ed448 keys. In the browser the keys are protected by a passkey. Addresses are hashes that start with
  `Qm`, and users can show a username from Quilibrium's name service.
- **Encryption.** Direct messages use the Double Ratchet between devices. A Space shares one Triple
  Ratchet session among its members, who sign their messages with Space-specific keys. Every Space is
  encrypted, and Quorum says its message brokering keeps the service that relays messages from
  linking senders and recipients.
- **Joining.** Spaces are entered with invite links. A one-time link carries the keys to join in the
  URL; a public link fetches them from the Quorum service, and public Spaces can be listed in a
  searchable directory.
- **Transport.** The web, desktop and mobile clients all connect over HTTPS and a WebSocket to one
  service,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  It relays encrypted messages to each member's inbox, and stores user registrations, each Space's
  encrypted manifest (channels, roles, emoji), invite material, the public directory and optional
  encrypted settings sync. Quilibrium's node software has an inbox and hub service with the same
  shape, but neither the clients nor Quilibrium's docs say how this service maps onto the network.
- **History.** Each member's client keeps its own copy of the Space in local storage. The web and
  desktop client backfills history by asking an online member to sync; the mobile client replays a
  log that the service keeps for each Space, so it can catch up when no other member is online.
- **Moderation.** Roles grant deleting, pinning, muting and `@everyone` mentions. Every member's
  client checks the signature on each moderation action and applies it only if the signer holds the
  right role. The owner can kick a member, which rotates the Space's keys so the kicked member cannot
  read new messages. A Space can require signed messages or let members post unsigned, deniable ones.
- **Code.** The web and desktop client is licensed under the AGPL-3.0 and the mobile client under the
  GPL-3.0. The mobile client also has a crypto wallet, Farcaster integration and Apex, a paid
  subscription described below.

## Where they differ

### Private groups and public communities

A Quorum Space is a group of members: only people holding its keys can read it, and joining takes an
invite link. A public link lets anyone in, but only after joining. A Bitsocial community has no
membership. Anyone can read it, from any app, without joining, and anyone can try to post, subject to
the community's challenge.

### What keeps a group online

A Quorum Space has no host node. Members send messages through the Quorum service, every member's
client keeps a copy, and the owner does not need to be online for others to talk. A Bitsocial
community lives on its owner's node, which accepts or rejects each post and publishes the community's
latest state. The community stays readable while peers seed it, but cannot accept new posts while its
node is offline. See [Peer-to-Peer Protocol](/peer-to-peer-protocol/).

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

A Quorum app is a client of the Quorum service, which Quilibrium Inc. runs. The apps do not join a
peer-to-peer network themselves, so reaching a Space depends on that one endpoint. Behind it,
Quilibrium is a network of its own: in October 2026 its
[explorer](https://dashboard.quilibrium.com/) showed 114 reachable peers and 181 provers across 99
shards.

A Bitsocial web app can run a libp2p node in the tab, fetch community content from peers and publish
over gossipsub. Peer discovery goes through HTTP routers that only return provider addresses; anyone
can run one, and clients can switch routers by changing their configuration. See
[Browser Peer-to-Peer](/browser-p2p/).

### Economics

Quilibrium has a token at its core. QUIL is mined by nodes and pays network fees, and a wrapped
version, wQUIL, circulates on Ethereum. Quorum itself is free and needs no payment or phone number.
Its optional Apex subscription costs
[$5 a month](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
paid in wQUIL, SNAP or USDC on Ethereum and split between Quilibrium Inc. and four Spaces the
subscriber picks. Bitsocial has no payment layer in the protocol; a community can require a payment
or a token through its challenge.

### Private messages

This is where Quorum is stronger. Direct messages and Space messages are end-to-end encrypted with
forward secrecy, and message content reaches the Quorum service only as ciphertext. Bitsocial focuses
on public communities and has no native direct messages yet. A Bitsocial post is encrypted to the
community node's key while it travels over pubsub, but once accepted it is public.

## Project status

In October 2026 the Quorum repository called the web app a beta, and the Quorum website still listed
the Google Play and App Store apps as coming soon. The two clients also diverge: the mobile app has
the wallet, Farcaster and Apex features, while the web and desktop client shows its Wallet and
Farcaster pages as coming soon, and the two catch up on Space history differently.

Quilibrium's mainnet reached version 2.1 on September 30, 2025, when the network resumed after a halt
([announcement](https://x.com/QuilibriumInc/status/1973082817236984270)). In 2026 the node was
rewritten in Rust, with post-quantum signatures for consensus and a wire protocol that older nodes
cannot speak. Parts of the documentation describe the design rather than the running code: they
describe [mixnet routing](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/),
but in node 2.1.0.25 the mixnet service is a
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
that accepts messages without mixing them.

## Comparison

| Question                | Quorum                                                                                | Bitsocial                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Category                | End-to-end encrypted group messenger on the Quilibrium network                        | Peer-to-peer community network                                                                 |
| Identity                | Ed448 master keyset plus per-device keys, protected by a passkey                      | Ed25519 keypairs for users and communities                                                     |
| Who can read            | Members holding a Space's keys                                                        | Anyone, from any app                                                                           |
| Where messages live     | Each member's device; the mobile client also replays a log kept by the Quorum service | The community owner's node and the peers that read and seed it                                 |
| What clients connect to | The Quorum service at `api.quorummessenger.com`                                       | Peers over libp2p, including from a browser tab                                                |
| Communities             | Spaces with channels, roles and invite links                                          | First-class objects whose node accepts or rejects posts                                        |
| Spam control            | Invite links, kicks with rekeying, client-side rate limits                            | Each community's challenge before a post is accepted                                           |
| Moderation              | Roles enforced by every member's client; the owner kicks                              | Community owners moderate their community; apps choose what they show                          |
| Private messages        | End-to-end encrypted direct messages                                                  | Public communities; no native direct messages yet                                              |
| Economics               | QUIL network token; optional $5 monthly Apex subscription                             | None in the protocol; a challenge can require a payment or token                               |
| Main tradeoff           | Private, encrypted groups, but every client depends on one service                    | Free identities and browser access, but no private messaging and only the latest state is kept |
