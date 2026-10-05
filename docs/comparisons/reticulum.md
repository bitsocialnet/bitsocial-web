---
title: Bitsocial and Reticulum
description: How Reticulum, the cryptographic networking stack for LoRa and other low-bandwidth links, compares with Bitsocial, and whether Bitsocial could run over it.
---

# Bitsocial and Reticulum

[Reticulum](https://reticulum.network/) is a cryptography-based networking stack for building
networks over whatever carriers are available: LoRa radios, packet radio, serial links, Wi-Fi,
Ethernet, TCP, UDP or I2P. It comes up next to Bitsocial because both remove the company in the
middle. They do it at different layers, so they are complements rather than competitors.

## Different layers

Reticulum replaces the network layer. It gives applications encrypted, routable endpoints without IP
addresses, DNS, certificate authorities or accounts, and it is designed to keep working on links as
slow as 5 bits per second with a 500-byte MTU. It does not define posts, communities or moderation;
applications built on top add those.

Bitsocial is a social protocol. It runs on the IPFS/libp2p stack over ordinary internet connections,
including from a browser tab, and defines communities, publications and per-community anti-spam
challenges. See [Peer-to-Peer Protocol](/peer-to-peer-protocol/) and
[Browser Peer-to-Peer](/browser-p2p/).

In Bitsocial's stack, Reticulum would sit roughly where libp2p sits, not where the Bitsocial
protocol sits.

## How Reticulum works

- **Identities.** A Reticulum identity is a 512-bit keyset: an X25519 key for encryption and an
  Ed25519 key for signatures.
- **Destinations.** Applications create destinations, addressed by a SHA-256 hash truncated to 16
  bytes. Packets carry no source address.
- **Announces.** A destination becomes reachable by sending an announce. Transport nodes forward it
  and remember the next hop back, so no node needs a map of the whole network.
- **Encryption.** Traffic is encrypted by default, with ephemeral keys and forward secrecy.
- **LXMF.** The [LXMF](https://github.com/markqvist/LXMF) messaging layer adds signed messages,
  direct delivery, and store-and-forward through propagation nodes for recipients who are offline.

Applications built this way include [Sideband](https://github.com/markqvist/Sideband) for messaging
and [Nomad Network](https://github.com/markqvist/NomadNet) for messaging and hosted pages. The
Reticulum manual keeps a [list of programs](https://reticulum.network/manual/software.html).

## Comparison

| Question         | Reticulum                                                                                     | Bitsocial                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| What it is       | Networking stack                                                                              | Peer-to-peer social protocol and apps                                           |
| Designed for     | Any carrier, down to slow radio links                                                         | Internet connections, including browser tabs                                    |
| Identity         | X25519 and Ed25519 keyset                                                                     | Ed25519 keypairs for users and communities                                      |
| Addresses        | Hash of an identity and application name                                                      | Hash of a community's public key                                                |
| Finding a peer   | Announces spread by transport nodes                                                           | HTTP routers return provider peers                                              |
| Social features  | Added by applications such as Nomad Network                                                   | Communities, posts, replies and moderation in the protocol                      |
| Spam control     | Announce rate limits per interface; LXMF proof-of-work stamps a recipient or node can require | Each community's challenge before a post is accepted                            |
| Offline delivery | LXMF propagation nodes store and forward messages                                             | Peers keep serving a community's latest state; publishing needs its node online |

## Could Bitsocial run over Reticulum?

Not today. Bitsocial has no Reticulum transport, and its data model assumes internet bandwidth: a
client fetches community metadata and post content from peers and exchanges pubsub messages, which
fits poorly on links built around 500-byte packets and throughput measured in bits or kilobits per
second.

The realistic path is narrower: a client that works over a local mesh while disconnected, then syncs
with the wider Bitsocial network when a peer or gateway with internet access is reachable. That
would be a new client and bridge rather than a change to the protocol, and it is not on the current
roadmap.

## For builders

Reticulum is published under the
[Reticulum License](https://reticulum.network/manual/license.html): MIT-style terms plus two
restrictions. The software may not be used in systems designed to harm people, or in creating AI or
machine-learning training datasets. Read it before bundling Reticulum code into a Bitsocial app.

The reference implementation is [written in Python](https://github.com/markqvist/Reticulum). The
Reticulum maintainers warn that several unofficial ports of Reticulum and LXMF are machine-generated
and carry license claims they consider void, so prefer the reference implementation or programs
listed in the manual.
