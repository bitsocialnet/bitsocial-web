---
title: Bitsocial and Farcaster
description: How Farcaster, with onchain accounts, storage rent and the Snapchain validator network, compares with Bitsocial's peer-to-peer communities.
---

# Bitsocial and Farcaster

[Farcaster](https://docs.farcaster.xyz/) keeps identity on a blockchain and social data off it.
Accounts, app keys and storage payments live in contracts on OP Mainnet, an Ethereum layer 2. Posts,
called casts, along with follows and reactions, are signed messages stored by
[Snapchain](https://snapchain.farcaster.xyz/), a blockchain-like network that replaced Farcaster's
earlier Hub network in 2025.

## How Farcaster works

- **Accounts.** An account is a numeric Farcaster ID owned by an Ethereum address, which can also
  set a recovery address. Apps post with delegated app keys registered onchain; an app key cannot
  take over the account.
- **Storage rent.** Every account rents storage units, currently $0.20 per unit per year. A unit
  rented since July 2025 holds 100 casts; beyond that, the oldest casts are pruned. Rate limits scale
  with rented storage.
- **Snapchain.** Validators order messages into blocks with Tendermint-style consensus, and every
  full node keeps the whole network's data. Nodes need about 16 GB of RAM and 2 TB of storage, per
  the [node guide](https://snapchain.farcaster.xyz/getting-started).
- **Names.** Default usernames, called fnames, are free and issued by Farcaster's own name server,
  which [can revoke them](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Users can
  instead use a `.eth` name registered on Ethereum.
- **Channels.** Topic channels are an experimental feature of the Farcaster client. Casts in a
  channel are protocol data, but channel metadata, follows and moderation are
  [stored in the client](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Reading.** Apps read through a Snapchain node they run or a managed provider, usually Neynar.

## Where they differ

### Blockchains and validators

Farcaster depends on OP Mainnet for accounts and payments, and on Snapchain, a blockchain-like
network, for ordering all social data. Snapchain's validator set is permissioned. Its whitepaper says
censorship becomes hard with about ten globally distributed validators; in October 2026 its
[validator list](https://snapchain.farcaster.xyz/validators) was smaller, and most keys belonged to
Neynar, which [acquired Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) in January 2026. Bitsocial has no chain, validators or consensus.

### Paying to post

Every Farcaster account pays storage rent, and storage caps how much of an account's history the
network keeps. In Bitsocial, posting costs nothing at the protocol level; each community decides
whether to require a captcha, a payment, a token or something else. See
[Custom Anti-Spam Challenges](/custom-challenges/).

### Communities

Farcaster channels are a client feature: the client stores their metadata and enforces channel
moderation, so a cast blocked in a channel can remain valid on the network and visible in other apps.
In Bitsocial, communities are protocol objects with their own keypair, and the community's node
accepts or rejects posts.

### Running the infrastructure

A Farcaster node holds the entire network, so its storage grows with all activity; Farcaster
projects growth toward the largest cloud disks. A Bitsocial community node holds only its own
communities and runs on consumer hardware.

### Browser

A Farcaster browser app is an HTTP client of a node or provider. A Bitsocial web app can run a
peer-to-peer node inside the tab. See [Browser Peer-to-Peer](/browser-p2p/).

## Comparison

| Question            | Farcaster                                                                 | Bitsocial                                                                          |
| ------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Category            | Onchain identity with validator-ordered social data                       | Peer-to-peer community network                                                     |
| Identity            | Farcaster ID owned by an Ethereum address, with delegated app keys        | Ed25519 keypairs for users and communities                                         |
| Where posts live    | Snapchain, replicated on every full node, within paid storage limits      | The community owner's node and the peers that read and seed it                     |
| Who keeps it online | Snapchain validators and node operators                                   | Community owner node plus helper seeders                                           |
| Communities         | Experimental channels managed by the Farcaster client                     | First-class objects whose node accepts or rejects posts                            |
| Spam control        | Storage rent and rate limits, plus app-level spam labels                  | Each community's challenge before a post is accepted                               |
| Moderation          | Channel hosts in the client, app filters, validator-level censorship risk | Community owners moderate their community; apps choose what they show              |
| Names               | Free fnames revocable by Farcaster, or `.eth` names                       | `.bso` and `.eth` names that resolve to keys                                       |
| Browser             | HTTP client of a node or provider                                         | Peer-to-peer node inside a normal browser tab                                      |
| Main tradeoff       | One consistent global dataset, but rent, chains and a small validator set | No fees or chains, but no global dataset and old content is not guaranteed forever |
