---
title: Bitsocial and Blockchain Social Networks
description: How Lens, DeSo and Steem put social data or rules on a blockchain, and why Bitsocial does not use one.
---

# Bitsocial and Blockchain Social Networks

Lens, DeSo and Steem each put social activity on a blockchain. Accounts, follows, posts or the rules
around them become transactions that validators order and store. Bitsocial uses no blockchain:
social media does not need a global order for every post, so Bitsocial skips consensus, gas and
staking. See [Peer-to-Peer Protocol](/peer-to-peer-protocol/) for that reasoning.

## What they have in common

- **Someone pays for every write.** Lens charges gas, which apps can sponsor; DeSo charges a fee on
  every action; Steem rations actions by staked tokens.
- **The chain sets one spam policy for everyone.** Fees, stake and account costs apply across the
  network instead of being chosen by each community.
- **On-chain records are permanent.** Apps can hide content, but they cannot remove it from the
  chain.
- **Browsers are API clients.** Web apps sign transactions and read through a node, indexer or API
  operated by someone else.

## Lens

[Lens](https://lens.xyz/) runs on Lens Chain, an Ethereum layer 2 built with ZKsync's ZK Stack that
uses Avail for data availability. Mask Network has
[stewarded Lens since January 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **On the chain:** accounts are smart contracts, usernames are NFTs inside namespaces, and graphs,
  groups, feeds and their rules are contracts too.
- **Off the chain:** a post's text and media live in a JSON file at a URI, usually on Grove, Lens's
  storage service in front of IPFS. Reactions and bookmarks are held by the Lens API, and apps read
  through that API.
- **Spam and gates:** transactions need gas in GHO, which apps can sponsor with rate limits. Feed and
  group rules can require token holdings or payments.
- **Chain operation:** [L2BEAT](https://l2beat.com/scaling/projects/lens) rates Lens Chain as a Stage
  0 validium with a centralized operator that can refuse to include transactions.

## DeSo

[DeSo](https://docs.deso.org/) is a layer-1 blockchain built for social apps. It moved from proof
of work to proof of stake in July 2024.

- **On the chain:** profiles, posts, likes, follows and direct messages are all transactions stored
  by every full node. Images and video are hosted off-chain; the reference node uses Google Cloud
  Storage and Cloudflare Stream.
- **Spam:** every action pays a fee in DESO. New users usually get starter DESO from a node after
  phone verification.
- **Moderation:** each node decides what it shows by blacklisting or graylisting, but
  [content stays on-chain](https://docs.deso.org/deso-blockchain/content-moderation).
- **Communities:** the docs describe no community or forum primitive; a "community" is a feed that
  an app curates.
- **Running a node:** validators need at least 32 GB of RAM and 200 GB of disk, according to the
  [validator guide](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) is a social blockchain that pays authors and curators in tokens, with
[Steemit](https://steemit.com/) as its main blogging app. Hive split from Steem in 2020; according
to [Hive's whitepaper](https://hive.io/whitepaper.pdf), the fork followed the sale of Steemit Inc.
to Justin Sun.

- **On the chain:** text posts, comments, votes and their edit history, ordered by 21 elected
  witnesses producing a block every three seconds. Images are hosted off-chain.
- **Spam:** actions consume Resource Credits, which grow with staked STEEM. Creating an account
  costs STEEM; Steemit pays it for users who verify an email address and phone number.
- **Communities:** they are
  [custom operations interpreted by an indexer](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  outside consensus. Moderators can mute posts, which hides them in apps but leaves them on-chain.
- **Rewards:** inflation funds rewards, and stake-weighted votes decide how they are split, so large
  holders shape what earns attention.

## Comparison

| Question      | Lens                                                                       | DeSo                                                           | Steem                                                        | Bitsocial                                                                          |
| ------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Chain         | Ethereum layer 2 (ZK Stack validium)                                       | Own layer 1, proof of stake                                    | Own chain, delegated proof of stake                          | None                                                                               |
| Post content  | Off-chain JSON, usually on Grove                                           | On-chain text; media off-chain                                 | On-chain text; images off-chain                              | On the community owner's node and the peers that read and seed it                  |
| Identity      | Smart-contract account; username NFTs                                      | Keypair with an on-chain profile                               | Named chain account with tiered keys                         | Ed25519 keypairs for users and communities                                         |
| Communities   | Groups and feeds as contracts with rules                                   | No community primitive                                         | Indexer-interpreted communities outside consensus            | First-class objects whose node accepts or rejects posts                            |
| Spam control  | Gas (often sponsored), token or payment rules                              | Fee on every action; starter funds after phone checks          | Resource Credits from stake; paid account creation           | Each community's challenge before a post is accepted                               |
| Moderation    | Group admins, on-chain rules, API-level hiding                             | Each node filters what it shows                                | Community mutes, stake-weighted downvotes, app filters       | Community owners moderate their community; apps choose what they show              |
| Running it    | Chain operator plus the Lens API and Grove                                 | Validators with at least 32 GB RAM                             | Elected witnesses plus API and indexer nodes                 | A community node on consumer hardware, plus helper seeders                         |
| Main tradeoff | Programmable on-chain rules, but content and reads depend on Lens services | Open data pool, but every action costs a fee and stays forever | Built-in rewards, but stake shapes visibility and governance | No fees or stake, but no global ordering and old content is not guaranteed forever |
