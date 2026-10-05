---
title: Bitsocial and Mirage
description: How Mirage, a Reddit-style forum on its own Cosmos SDK blockchain, compares with Bitsocial and its Reddit-style app Seedit.
---

# Bitsocial and Mirage

[Mirage](https://mirage.foundation/) is a Reddit-style discussion network with communities,
threaded posts and votes. Instead of a company database, it runs on its own blockchain, a Cosmos SDK
chain with CometBFT consensus. Bitsocial's closest product is [Seedit](/apps/seedit/), a
Reddit-style app on the Bitsocial network, so the comparison is mostly about how each one hosts,
owns and moderates communities.

## How Mirage works

- **Nodes.** A Mirage node is one Docker container holding a validator, a PostgreSQL database, an
  indexer, an HTTP API and the web frontend. Every node is also a validator. Running one requires an
  Ubuntu server on amd64 and 10,000,000 MIRAGE tokens in the operator's account, according to the
  [deploy guide](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Posting.** The browser signs each action with the user's secp256k1 key, and free users also
  compute a small proof of work. The node wraps the action in a chain transaction and pays the fee.
- **Reading.** Each node's indexer copies chain data into its own database and serves feeds over an
  HTTP API. Nodes keep about a week of blocks, so long-term post history lives in each node's
  database, and a new node starts without the history before its sync point.
- **Accounts.** An account is a key derived from a 12-word seed phrase, and the same seed works on
  any node. Usernames are recorded on the chain and are unique across the network.
- **Communities.** Every valid name is already a community, and nobody owns it. Paid curator teams
  of up to ten users each maintain a moderated view of a community; readers choose a team's view,
  the node's default or an uncensored view. See the [Mirage FAQ](https://mirage.talk/faq).
- **Token.** The MIRAGE token pays for subscriptions, rewards authors and nodes, and gives
  validators governance weight. Subscribers skip the proof of work and get higher limits.

## Where they differ

### Who owns a community

In Seedit, the creator of a community holds its keypair, runs or delegates its node, and moderates
it. In Mirage, nobody owns a community: competing curator teams offer moderated views of the same
name, and the default view is the team chosen by the most paying subscribers.

### Spam control

Mirage applies one rule to the whole network: free users pay with proof of work whose difficulty
adjusts to incoming volume, and subscribers skip it. In Bitsocial, each community chooses its own challenge,
from captchas to allowlists to payments. See [Custom Anti-Spam Challenges](/custom-challenges/).

### Infrastructure

Mirage needs a blockchain. Validators reach consensus on every action, and each node runs a full
server stack and must hold a large token stake. Bitsocial has no chain: a community node runs on
consumer hardware from the desktop app or `bitsocial-cli`, and readers can help share content.

### Network-wide control

Mirage has on-chain governance weighted by validator stake. It can change difficulty, prices and
token emission, mint or burn tokens, and appoint admins whose deletions the reference indexer
applies to any post. The chain code also lets governance
[delete accounts](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
and
[send tokens from any address](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
In October 2026, four validators produced the chain's blocks, and the project's own runbooks managed
all four.

Bitsocial has no protocol-level administrator. Community owners moderate their own communities and
apps choose what they show. See [Local Moderation, Not Global Bans](/local-moderation/).

### Browser

Mirage's web client is an HTTP client of a node: the browser signs actions but does not join a
peer-to-peer network. Bitsocial apps can run a peer-to-peer node inside the browser tab. See
[Browser Peer-to-Peer](/browser-p2p/).

## Comparison

| Question            | Mirage                                                                                                   | Bitsocial                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Category            | Forum on its own blockchain (Cosmos SDK)                                                                 | Peer-to-peer community network                                                             |
| Identity            | secp256k1 key from a 12-word seed, with an on-chain username                                             | Ed25519 keypairs for users and communities                                                 |
| Where posts live    | Chain transactions, then each node's PostgreSQL database                                                 | The community owner's node and the peers that read and seed it                             |
| Who keeps it online | Validator nodes, each holding 10,000,000 MIRAGE                                                          | Community owner node plus helper seeders                                                   |
| Communities         | Ownerless names with competing paid curator teams                                                        | Owned by a keypair; the owner's node accepts or rejects posts                              |
| Spam control        | Network-wide proof of work; subscribers skip it                                                          | Each community's challenge before a post is accepted                                       |
| Moderation          | Curator-team views, personal filters, governance-appointed admins                                        | Community owners moderate their community; apps choose what they show                      |
| Economics           | MIRAGE token for subscriptions, rewards and validator stake                                              | None in the protocol; a challenge can require a payment or token                           |
| Browser             | HTTP client of a node                                                                                    | Peer-to-peer node inside a normal browser tab                                              |
| Main tradeoff       | One shared, ordered state and easy sign-up, but a small validator set and network-wide governance powers | No chain or stake needed, but no global ordering and old content is not guaranteed forever |
