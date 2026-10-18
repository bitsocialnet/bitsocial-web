---
title: Where Posts Live and How Long They Last
description: Why Bitsocial posts are signed and content-addressed but not stored forever by every node, who keeps them online, and how archivers keep old content readable.
---

# Where Posts Live and How Long They Last

Bitsocial does not store every post on a blockchain or in a company database. Each community's own
node keeps its posts, readers and seeders help serve them, and anyone who wants a permanent record
can keep one. Keeping posts forever is **optional, not mandatory**: the protocol does not force every
participant to store the whole network's history.

This page explains what that means in practice, because "not stored forever" is easy to misread as
"disappears" or "trust me".

## Authenticity and availability are separate questions

There are two different questions about a post:

1. **Is it real?** Did this author write it, and was it accepted by this community?
2. **Is it still online?** Can someone fetch it today?

Bitsocial answers the first question with cryptography, not trust. Every post is signed by its
author's keypair, and once a community accepts it, the post is stored under a content identifier
(CID): a hash of its exact bytes. Anyone who fetches a post can check the signature and the hash
themselves. A node, router, gateway or archive cannot change a post's text or forge a post from
someone else without the check failing.

The second question is about who keeps a copy, and that is the only part that is not guaranteed.

## Who keeps posts online

- **The community's node.** The owner's node accepts posts and keeps them in its database for as long
  as the community keeps them. This is the one copy that always exists while the community is
  running. See [Peer-to-Peer Protocol](/peer-to-peer-protocol/).
- **Readers.** Desktop apps such as the 5chan Electron app seed the communities they load while they
  are running, so popular communities are served by many peers, the same way popular torrents are.
  A browser tab can cache and validate content while it is open, but it is not a long-lived host.
- **Seeders.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) lets anyone
  contribute always-on capacity from a VPS or a spare machine. It pins communities' latest pages and
  post updates, which also makes communities hosted behind home routers loadable from browsers.
- **Archivers.** Anyone can crawl communities and keep everything they see. Archives are ordinary
  services built on top of the network, not a special role in the protocol.

## Communities choose their own retention

How long a community keeps old posts is its owner's decision, not a protocol rule. Some communities
want years of history. Others are designed to forget: 5chan boards work like an imageboard, where
threads fall off the board, move to an archive and are purged from the board's node after a set
time (48 hours by default). A community can also skip the archive entirely.

The same protocol supports both because retention is a policy each community sets, not a cost every
node has to pay.

## Why not store everything forever?

A network that requires every node to keep every post forever has to pay for it somehow:

- **Blockchains** make every full node store the whole history, so node requirements grow with all
  activity, and posting usually costs a fee.
- **Paid storage**, as in Farcaster's storage rent, makes users pay to keep their history and prunes
  the oldest posts beyond what they pay for. See [Bitsocial and Farcaster](/comparisons/farcaster/).
- **Central servers** keep everything, but only as long as one company wants to, under that company's
  rules.

Social media does not need a global ledger. It does not matter whether post A was accepted one
millisecond before post B, and most old posts are rarely read. Bitsocial lets each community node
hold only its own communities, which keeps hosting cheap enough for a laptop, a Raspberry Pi or a
small VPS. See [Why not a blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## The tradeoff

If nobody keeps a copy of a post, it can become unavailable. A post's CID never changes, but a CID is
only an address: content stays fetchable only while at least one node is serving it. If a community's
node goes offline for good and no reader, seeder or archive kept its posts, those posts are gone.

That is the honest cost of not requiring a global ledger. It is also the cost every major platform
already has: old posts vanish from them when accounts, servers or companies disappear. The difference
is that on Bitsocial, keeping something does not need anyone's permission.

## Keeping what matters

- **Run the community node yourself.** A community owner who keeps the node running keeps the
  community's history, for as long as the community's settings retain it.
- **Seed.** Leaving a desktop app open or running `bitsocial-seeder` keeps communities available to
  others.
- **Archive.** Independent archives keep old threads readable and searchable after a community drops
  them. [5archive.org](https://5archive.org) archives 5chan boards and
  [seeditarchive.org](https://seeditarchive.org) archives Seedit communities. Both are open source, so
  anyone can run a mirror or a competing archive.

Because every archived post is still signed, an archive cannot quietly rewrite what someone said: a
reader can verify an archived post's signature the same way as a live one.
