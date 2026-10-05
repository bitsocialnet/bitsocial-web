---
title: Bitsocial and Nostr
description: How Nostr's relay-based model compares with Bitsocial's peer-to-peer communities, from data path and identity to groups, spam control and moderation.
---

# Bitsocial and Nostr

Nostr does not fit cleanly into the federated or blockchain buckets. Users are not issued accounts
by instances, and there is no chain, consensus, gas or global ordering. Nostr is better described as
**relay-based social media**: users hold keypairs, sign events, and publish them to relays, which
are ordinary servers that store and serve them
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Nostr's own
[README](https://github.com/nostr-protocol/nostr) says it does not rely on peer-to-peer techniques.

That puts Nostr closer to Bitsocial than federated or blockchain systems in one important way:
identity is cryptographic and portable. The differences are the data layer and who holds the gate.

## How Nostr works

- **Events and relays.** Every post, profile or reaction is a signed JSON event. Clients publish
  events to relays over WebSockets and subscribe with filters; relays store events and serve them
  back. Relays do not talk to each other.
- **Replication.** Users usually publish to several relays. A study of 712 relays in 2023 found the
  average post on 34.6 of them ([Wei and Tyson](https://arxiv.org/abs/2402.05709)).
- **Finding someone's posts.** Users publish a list of the relays they write to and read from
  ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), and clients fetch a user's
  posts from that user's write relays.
- **Identity.** Each user is a secp256k1 key that signs with Schnorr signatures. The specs define no
  key rotation or recovery, so a lost key is a lost account. Optional `name@domain` identifiers
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) are checked against a file on
  that domain's web server.
- **Groups.** The recommended community mechanism is relay-based groups
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): a relay hosts a group,
  enforces its membership and posting rules before accepting a post, and signs its metadata. The
  older moderator-approved communities
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) are now marked unrecommended
  in favour of NIP-29.
- **Spam control.** Each relay chooses its gate: proof of work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), authentication and allowlists
  ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), payment or rate limits.
  Clients add mute lists and trust scores.
- **Media.** Images and video are uploaded to separate HTTP file servers.

## Where they differ

### Who stores and serves posts

In Nostr, relays are the storage and delivery layer: a server has to keep each post online. In
Bitsocial, HTTP routers only help clients find peers. They do not store posts, profiles, community
metadata or moderation state; clients fetch content from the community's node and the peers that
seed it. See [Peer-to-Peer Protocol](/peer-to-peer-protocol/).

### Who holds the gate

Nostr's write gates belong to relay operators. Outside NIP-29 groups, a key rejected by one relay can
publish the same event to any relay that accepts it, and what readers see depends on which relays
their client reads. A NIP-29 group is closer to a Bitsocial community: its host relay accepts or
rejects posts. The relay still defines what group roles can do, and the group's history stays tied to
that relay unless another relay agrees to take it over.

In Bitsocial, a community is a cryptographic object with its own keypair. The community's node runs
whatever challenge the owner chooses and publishes the accepted state into the peer-to-peer network.
See [Custom Anti-Spam Challenges](/custom-challenges/).

### Running the infrastructure

A relay is a server with a domain and a WebSocket endpoint, and popular relays carry the storage and
bandwidth cost of what they serve. The 2023 study estimated that about 95% of free relays could not
cover their costs from donations. A Bitsocial community node runs on consumer hardware, and peers
that read a community can help share it.

### Browser

A Nostr web client opens WebSocket connections straight to relays, so no app server is needed. A
Bitsocial web app runs a peer-to-peer node in the tab and fetches content from peers. See
[Browser Peer-to-Peer](/browser-p2p/).

### Old content

Nostr posts are widely replicated across relays, which helps old posts survive. Bitsocial keeps the
latest community state and does not guarantee old content forever.

## Comparison

| Question            | Nostr                                                                                | Bitsocial                                                             |
| ------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Category            | Relay-based protocol                                                                 | Peer-to-peer community network                                        |
| Identity            | secp256k1 user key, with no rotation in the specs                                    | Ed25519 keypairs for users and communities                            |
| Where posts live    | Relays chosen by the author, often many                                              | The community owner's node and the peers that read and seed it        |
| Who keeps it online | Relay operators                                                                      | Community owner node plus helper seeders                              |
| Communities         | Relay-hosted groups (NIP-29)                                                         | First-class objects whose node accepts or rejects posts               |
| Spam control        | Each relay's policy: proof of work, authentication, payment, allowlists, rate limits | Each community's challenge before a post is accepted                  |
| Moderation          | Relay policies, client mute lists, labels and reports                                | Community owners moderate their community; apps choose what they show |
| Names               | Optional `name@domain` identifiers checked over HTTPS                                | `.bso` and `.eth` names that resolve to keys                          |
| Browser             | WebSocket client of relays                                                           | Peer-to-peer node inside a normal browser tab                         |
| Main tradeoff       | Portable identity and wide replication, but relay-dependent availability and policy  | Less relay dependence, but old content is not guaranteed forever      |
