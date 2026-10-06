---
title: Bitsocial and Secure Scuttlebutt
description: How Secure Scuttlebutt (SSB) and its Manyverse app compare with Bitsocial, from append-only feeds and follow-graph replication to communities, spam control and offline sync.
---

# Bitsocial and Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) is a peer-to-peer social protocol created by
Dominic Tarr in 2014. [Manyverse](https://www.manyver.se/) is its best-known app, for Android, iOS
and desktop; [Patchwork](https://github.com/ssbc/patchwork) was the main desktop client before it
was archived. Of the systems compared in these docs, SSB is the closest to Bitsocial in spirit: no
servers in the data path, no blockchain, no global ordering, and Ed25519 keys for identity. The two
made opposite choices about what each peer stores and where spam is stopped.

## How Scuttlebutt works

- **Feeds.** Each identity is an Ed25519 keypair, written as `@<public key>.ed25519`. Everything a
  user publishes goes into their own feed, an append-only log in which each signed message carries a
  sequence number and the hash of the previous message. Once posted, a message cannot be modified,
  according to the [protocol guide](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replication.** Peers copy whole feeds, not individual posts, and the follow graph decides which
  feeds a peer keeps. Patchwork, for example, displayed feeds up to two hops away and replicated
  feeds up to three hops away. With epidemic broadcast trees (EBT), peers compare the latest
  sequence number they hold for each feed and send only what is missing.
- **Connections.** Peers authenticate with a secret handshake and encrypt traffic with box stream.
  The handshake is keyed to a network identifier, so peers on a separate SSB network with a
  different identifier cannot connect to the main one.
- **Finding peers.** Peers announce themselves on the local network over UDP broadcast and sync over
  LAN; Manyverse also syncs over Bluetooth. Across the internet, users rely on **pubs**,
  always-online peers that follow you back after you redeem an invite code and then store and serve
  your feed, and on **rooms**, which store no feeds but tunnel connections between their members.
- **Blobs and private messages.** Images and other files are content-addressed blobs fetched from
  peers, with a default size limit of 5 MB in current implementations. Private messages are
  encrypted for up to seven recipients and published as ciphertext in the author's feed.

## Where they differ

### What a peer stores

An SSB peer keeps a full copy of every feed in its replication range, from each feed's first
message, and serves those feeds to others. That is what lets SSB work offline, but storage grows
with every message in range, and a new install has to download those feeds before it shows much. A
Bitsocial client fetches the latest state of the communities it opens from the community's node and
the peers that seed it, and the network keeps only that latest state. See
[Peer-to-Peer Protocol](/peer-to-peer-protocol/).

### Deletion and devices

Because a feed is a hash chain, SSB has no network-wide deletion: a peer can drop messages from its
own database but cannot retract them from other peers' copies. Posting with the same key from two
devices, or from a restored backup, forks the feed, so the usual answer is one identity per device.
PZP, the successor protocol from the Manyverse team, lists deletion, several devices per account and
fork-tolerant feeds among its main changes from SSB
([launch post](https://www.manyver.se/blog/2024-07-03/)). A Bitsocial community node publishes a new
version of the community's state on each update, so content its moderators remove drops out of the
latest state.

### Who you can hear from

SSB's replication range doubles as its spam filter. A stranger's feed reaches you only if someone
within your hops follows them, and blocking a feed stops your node replicating it. Spam stays out,
but so do newcomers until someone follows them. Bitsocial lets anyone publish to a community, and
the community's node decides through its challenge whether a post is accepted. See
[Custom Anti-Spam Challenges](/custom-challenges/).

### Communities

SSB has no community object. Channels and hashtags are labels on individual posts, the replies in a
thread live in the feeds of whoever wrote them, and how much of a thread you see depends on which of
those feeds your node has. Rooms can have moderators and member lists, but they control who may
connect through the room, not what is published. A Bitsocial community is a first-class object with
its own keypair, rules, moderators and challenge.

### Infrastructure

Both keep servers out of the data path, and both lean on helpers. Pubs are the closest SSB has to a
hosted service: they store and serve the feeds of everyone they follow. Rooms are closer to
Bitsocial's HTTP routers because neither stores content, but a room relays the connection between
its members, while a router only returns provider addresses and plays no part in the transfer. Like
an SSB peer, a Bitsocial community node runs on consumer hardware, and it has to be online to accept
new posts.

### Offline and local networks

This is where SSB is stronger. Two SSB peers on the same Wi-Fi network, or over Bluetooth in
Manyverse, can sync with no internet connection, and everything already replicated stays readable
offline. Manyverse's stated primary goal is to make social networking independent of internet
connectivity. Bitsocial needs an internet connection to find peers and to publish.

### Browser

The main SSB apps ship a full SSB node: Manyverse bundles one in its mobile and desktop apps.
[ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) ran SSB inside a browser with partial
replication and connections through rooms, and was archived in 2022. Bitsocial apps run a
peer-to-peer node in a normal browser tab. See [Browser Peer-to-Peer](/browser-p2p/).

### Private messages

SSB has encrypted private messages built in. Bitsocial focuses on public communities and has no
native direct messages yet.

## Project status

André Staltz, who built Manyverse, stepped away from SSB, Manyverse and their planned successor in
April 2024 ([his last update](https://www.manyver.se/blog/2024-04-05/)). In July 2024 Jacob Karlsson
launched that successor as [PZP](https://pzp.wiki/) and wrote that he would do no more work on
Manyverse and knew of no one else planning to. In October 2026 the PZP repositories on
[Codeberg](https://codeberg.org/pzp) had no updates after December 2024. Patchwork's repository is
archived with v3.18.1 as its last release, and the team behind Planetary, an SSB app for iOS, moved
to Nostr with its Nos app in 2023. The SSB network still runs on the peers and pubs that people keep
online, but its main apps are no longer developed.

## Comparison

| Question          | Secure Scuttlebutt                                                                      | Bitsocial                                                                               |
| ----------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Category          | Peer-to-peer gossip protocol                                                            | Peer-to-peer community network                                                          |
| Identity          | One Ed25519 keypair per device                                                          | Ed25519 keypairs for users and communities                                              |
| Where posts live  | The author's append-only feed, copied by every peer that replicates it                  | The community owner's node and the peers that read and seed it                          |
| What a peer keeps | Full history of every feed in its follow range                                          | The latest state of the communities it reads or seeds                                   |
| Communities       | No community object; channels and hashtags label posts                                  | First-class objects whose node accepts or rejects posts                                 |
| Spam control      | Follow-graph replication range and blocks                                               | Each community's challenge before a post is accepted                                    |
| Moderation        | Each user's follows and blocks                                                          | Community owners moderate their community; apps choose what they show                   |
| Helper servers    | Pubs store and serve feeds; rooms tunnel connections                                    | HTTP routers return provider peers and store no content                                 |
| Offline           | LAN and Bluetooth sync with no internet                                                 | Needs an internet connection                                                            |
| Browser           | Apps bundle a full SSB node                                                             | Peer-to-peer node inside a normal browser tab                                           |
| Network           | Running, but its main apps are no longer developed                                      | Live network with apps such as [5chan](/apps/5chan/) and [Seedit](/apps/seedit/)        |
| Main tradeoff     | Works offline and needs no hosting, but feeds grow forever and strangers stay invisible | Open publishing and browser support, but needs internet and keeps only the latest state |
