---
title: Bitsocial and Lapis Net
description: How Lapis Net, a Kotlin peer-to-peer social protocol with per-viewer trust scores and Bitcoin-backed visibility, compares with Bitsocial.
---

# Bitsocial and Lapis Net

[Lapis Net](https://net.lapisproject.dev/) is a peer-to-peer social network protocol written in
Kotlin for the JVM. It arrived independently at foundations close to Bitsocial's: keypair
identities, IPFS-style content storage and libp2p gossipsub. The two differ in where they put spam
filtering and curation. Lapis gives each viewer a personal trust graph and lets Bitcoin and
Lightning payments raise visibility; Bitsocial lets each community decide what may be published.

Lapis is a working prototype. In October 2026 it had no public network yet, and connecting two
nodes was a manual step, according to its
[repository](https://github.com/lapisproject-dev/Lapis-Net).

## How Lapis works

- **Identities.** Each identity is a secp256k1 keypair, compatible with Bitcoin keys, with an
  Ed25519 key bound to it for the libp2p peer ID.
- **Storage and propagation.** Content is stored with Nabu, an IPFS implementation on libp2p (DHT
  and Bitswap), and spread with libp2p gossipsub.
- **Scoring.** Four optional scores sit on top of a core that stays neutral about curation:
  - Veritas, a web of trust computed from each viewer's own trust graph
  - Virtus, visibility backed by on-chain or Lightning payment proofs that decay over time
  - Karma, free likes weighted by Veritas
  - Madli, a reputation score that nodes keep about each other's behaviour
- **Messaging.** End-to-end encrypted direct messages, one-to-one voice calls and an e-mail-like
  asynchronous message system are part of the project.
- **Clients.** Each user runs a JVM node. The reference client is a web interface served by that
  local node.

## Where they differ

### Who filters spam

Lapis filters at the viewer. Content propagates, then each viewer's trust graph and the payment
rules of the app they use decide what surfaces. Bitsocial filters at the community: a post has to
pass the community's challenge before the community node accepts it, so rejected spam never becomes
part of the community. See [Custom Anti-Spam Challenges](/custom-challenges/).

### Who holds power

In Lapis, each viewer decides whom they trust, and the operator of each app decides how paid
visibility works there. In Bitsocial, a community owner sets the rules for that one community, and
apps choose what they show. Neither has a protocol-level administrator.

### Economics

Lapis builds Bitcoin and Lightning payment proofs into its visibility score. Bitsocial has no payment
layer in the protocol; a community can require a payment or a token through its challenge.

### Browser

Bitsocial apps can run a peer-to-peer node inside a normal browser tab. See
[Browser Peer-to-Peer](/browser-p2p/). Lapis's browser interface is a local page served by the
user's JVM node.

### Scope

Lapis bundles direct messages, voice calls and mail. Bitsocial focuses on public communities and has
no native direct messages yet.

## Comparison

| Question         | Lapis Net                                                                  | Bitsocial                                                                        |
| ---------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Category         | Peer-to-peer social protocol (prototype)                                   | Peer-to-peer community network                                                   |
| Identity         | secp256k1 keypair with a bound Ed25519 peer ID                             | Ed25519 keypairs for users and communities                                       |
| Where posts live | Nabu (IPFS on libp2p) storage on participating nodes                       | The community owner's node and the peers that read and seed it                   |
| Communities      | No community object; curation happens per viewer and per app               | First-class objects whose node accepts or rejects posts                          |
| Spam control     | Viewer trust graph, paid visibility, Lightning deposits for first messages | Each community's challenge before a post is accepted                             |
| Moderation       | Each viewer's trust graph; app operators set paid-visibility rules         | Community owners moderate their community; apps choose what they show            |
| Economics        | Bitcoin and Lightning payment proofs in scoring                            | None in the protocol; a challenge can require a payment or token                 |
| Browser          | Local web interface served by a JVM node                                   | Peer-to-peer node inside a normal browser tab                                    |
| Network          | Prototype without a public network                                         | Live network with apps such as [5chan](/apps/5chan/) and [Seedit](/apps/seedit/) |
| Main tradeoff    | Rich built-in reputation and messaging, but no public network yet          | Smaller core that runs in browsers, but no built-in reputation or DMs            |

## Could they work together?

Bitsocial challenges are arbitrary code, so a Lapis-style trust score could become one. The built-in
`whitelist` challenge can already read lists of allowed addresses from URLs. A service that published
the Bitsocial addresses a Veritas graph trusts could let those authors skip a CAPTCHA in a community.
That would need a way to link a Lapis identity to a Bitsocial address, and nothing like it exists
today.
