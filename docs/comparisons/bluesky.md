---
title: Bitsocial and Bluesky
description: How Bluesky and the AT Protocol, with personal data servers, relays and AppViews, compare with Bitsocial's peer-to-peer communities.
---

# Bitsocial and Bluesky

[Bluesky](https://bsky.app/) is a microblogging app built on the [AT Protocol](https://atproto.com/),
which Bluesky Social PBC designed. The protocol splits a social network into separate services:
personal data servers host accounts, relays aggregate them into one stream, and AppViews index that
stream into the timelines and threads people see. Its docs describe account data as stored on host
servers, "as opposed to a peer-to-peer model"
([overview](https://atproto.com/guides/overview)).

## How the AT Protocol works

- **Repositories on servers.** Every post, like or follow is a record in the author's signed
  repository, hosted on a personal data server (PDS). Bluesky runs the default servers, and anyone
  can host their own.
- **Relays.** Relays subscribe to every PDS and rebroadcast changes as one stream, the firehose.
  Since a 2025 protocol update they no longer archive every repository, which made them much cheaper
  to run ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** An AppView indexes the whole firehose and serves timelines, complete reply threads,
  counts and search. It is the most resource-intensive part of the network.
- **Identity.** An account is a DID: usually `did:plc`, registered in one global directory, or
  `did:web`, tied to a domain. The DID document lists the account's handle, signing key and current
  server. The PDS holds the signing key; `did:plc` also lets users hold rotation keys so they can
  move without the old host's help ([identity guide](https://atproto.com/guides/identity)).
- **Handles.** Handles are DNS names, such as `alice.bsky.social` or a domain the user owns,
  verified against the DID.
- **Moderation.** Hosting and reach are separate layers. Anyone can run a labeler and users can
  stack them ([moderation guide](https://atproto.com/guides/moderation)), but the Bluesky app always
  applies Bluesky's own moderation. Authors can limit who may reply to their posts and hide replies.

## Where they differ

### Servers or peers

Bluesky's data lives on servers: a PDS hosts each account, relays carry the firehose, and AppViews
serve what clients display. A browser is an HTTP client of those services, never a peer. In
Bitsocial, the community's node and the peers that read it serve content, and a web app can run its
own peer-to-peer node. See [Browser Peer-to-Peer](/browser-p2p/).

### A global view or communities

The AT Protocol is designed for one global view: an AppView sees every reply, so threads and search
are complete. Bitsocial has no global index; each community publishes its own state, and apps build
discovery on top. See [Content Discovery](/content-discovery/).

Bluesky has no community object for public posts today. In June 2026 it
[announced native communities](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k) with
approval-gated posting at some privacy levels; they had not launched by October 2026. In Bitsocial,
communities are the core object, and a community's node accepts or rejects posts.

### Spam control

Bluesky handles spam with rate limits on its servers, limits on new hosts at the relay, automated
detection, human review and labels, and authors can restrict replies. No community-level gate decides
what a post must pass before it is accepted. In Bitsocial, each community chooses its own challenge.
See [Custom Anti-Spam Challenges](/custom-challenges/).

### Who holds the keys

Accounts on Bluesky's own servers log in with a password, and those servers hold their signing
keys custodially ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)). According to a Bluesky protocol engineer,
[most accounts have no independently controlled rotation keys](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
A Bitsocial identity is a keypair generated and held by the user's app.

### Running the infrastructure

A personal server is cheap: the [reference PDS](https://github.com/bluesky-social/pds) recommends 1
GB of RAM for up to 20 users. An independent full-network AppView is a large project; one built in
2025 [cost about $200 a month](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), mostly for 16 TB of
storage. Bitsocial has no global index to replicate, and a community node runs on consumer hardware.

## Comparison

| Question            | Bluesky (AT Protocol)                                                   | Bitsocial                                                             |
| ------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Category            | Federated servers with a global index                                   | Peer-to-peer community network                                        |
| Identity            | DID, with signing keys usually held by the server                       | Ed25519 keypairs for users and communities                            |
| Where posts live    | The author's repository on a personal data server                       | The community owner's node and the peers that read and seed it        |
| Who keeps it online | PDS hosts, relays and AppViews, by default run by Bluesky               | Community owner node plus helper seeders                              |
| Communities         | None for public posts yet (announced in 2026)                           | First-class objects whose node accepts or rejects posts               |
| Spam control        | Server rate limits, automated detection, labels, reply controls         | Each community's challenge before a post is accepted                  |
| Moderation          | Stackable labelers; the Bluesky app always applies Bluesky's moderation | Community owners moderate their community; apps choose what they show |
| Names               | DNS handles verified against the DID                                    | `.bso` and `.eth` names that resolve to keys                          |
| Browser             | HTTP client of a PDS and an AppView                                     | Peer-to-peer node inside a normal browser tab                         |
| Main tradeoff       | Complete global threads and search, but aggregation needs heavy servers | No heavy global index, but no complete network-wide view              |
