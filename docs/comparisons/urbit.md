---
title: Bitsocial and Urbit
description: How Urbit, a network of personal servers with Ethereum-registered Urbit IDs and host-run groups in Tlon Messenger, compares with Bitsocial's peer-to-peer communities.
---

# Bitsocial and Urbit

[Urbit](https://urbit.org/) is a network of personal servers. Each user has an always-on computer
called a ship, which runs Urbit's own operating system (Arvo), written in its own languages (Nock
and Hoon), and is identified by an Urbit ID. Its main social app is
[Tlon Messenger](https://tlon.io/), built by Tlon, the company founded in 2013 to develop Urbit.

Urbit aims to replace the whole computing stack, so it is a far broader project than Bitsocial. Its
social layer, though, uses a model close to Bitsocial's: a community lives on its owner's node, and
that node decides what gets in. The two differ on who has to run a server and on how spam is kept
out.

## How Urbit works

- **Urbit IDs.** Every ship has an Urbit ID: a number shown as a pronounceable name such as
  `~sampel-palnet`. Ownership and each ID's networking public keys are recorded in the Azimuth
  contracts on Ethereum. A "naive rollup" added in 2021 batches ID transactions to cut fees, and
  Tlon runs a roller that is free for public use, according to the
  [Urbit ID docs](https://docs.urbit.org/urbit-id/what-is-urbit-id).
- **A fixed hierarchy.** The address space has 256 galaxies, 65,536 stars and about 4 billion
  planets for everyday use. Galaxies issue stars, stars issue planets, and each planet can issue
  moons for its own devices. Comets are free IDs that a ship generates for itself and that never
  touch the blockchain. Galaxy owners form the Galactic Senate, which votes on upgrades to the
  Azimuth contracts and elects the Urbit Foundation's board.
- **Networking.** Ships exchange encrypted packets peer to peer. Since July 2026 the network
  protocol has been [Directed Messaging](https://urbit.org/blog/directed-messaging), a
  content-centric rewrite of the older Ames protocol. Galaxies handle peer discovery: each one keeps track of where the ships
  beneath it are, and relays packets to them until the two ships can reach each other directly, or
  for as long as a firewall prevents that, according to the
  [Directed Messaging paper](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Groups.** In Tlon Messenger, a group is hosted by its creator's ship. Members send messages to
  the host, which distributes them to every member's ship, and each member's ship keeps its own copy,
  according to the [Tlon FAQ](https://tlon.io/posts/faq). The host controls roles, channels and
  admission. A group can be public, private or secret, and it can
  [ban individual ships or whole ranks of ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Channels are chats, notebooks or collections of images and links.
- **Hosting.** Signing up with Tlon gives a new user a ship that Tlon runs, with keys that Tlon holds
  in custody. A user can export the ship and its master ticket and run it elsewhere: on a
  [Native Planet](https://www.nativeplanet.io/) device, or with the Vere runtime on Linux, macOS or
  Windows. Ships cannot yet store large files directly, so Tlon Messenger puts images and other
  media in S3-compatible cloud storage.

## Where they differ

### Who has to run a server

On Urbit, every participant is a server. Tlon's apps are front ends for the user's own ship, and
even reading a group goes through it. People who do not run a ship themselves rent one, which brings
a hosting provider back into the picture: Tlon holds hosted users' keys and keeps limited access for
maintenance, although users can leave with their whole ship.

On Bitsocial, only community owners need an always-on node. Readers and posters can run a
peer-to-peer node inside a browser tab, and their account is a keypair that the app keeps. See
[Browser Peer-to-Peer](/browser-p2p/). When someone does use a hosted node, Bitsocial's design aims
to let them delegate uptime without handing over custody of the identity. See
[Identity and Community Ownership](/identity-and-ownership/).

### The community host

This is where the two are closest. A Tlon group and a Bitsocial community both live on their owner's
node. The host decides who may post, applies moderation and distributes the result, and neither
protocol puts a moderator above the host. In both, the host has to be online. Tlon's FAQ says that if
the host goes offline, "the group goes down with them", and a Bitsocial community cannot accept new
posts while its node is offline.

They store content differently. Every member's ship keeps a copy of the group's history, so members
can still read what they already received while the host is down. A Bitsocial reader fetches the
community's latest state from the community's node or from peers that seed it, so an offline
community stays readable while peers have it, but the network keeps only the latest state.

A Tlon group also has a member list, and its host can make it invite-only. A Bitsocial community has
no membership: anyone can read it, and anyone can try to post, subject to its challenge.

### Spam and identity

Urbit fights spam by making identity scarce. The supply of planets is fixed, every one is issued by
a star, and a banned user needs another planet from a star's owner to come back. Reputation can
follow the hierarchy: Azimuth includes a Censures contract that lets galaxies and stars flag IDs, and
a Tlon group can ban a whole rank at once, which shuts out free comets with one setting. Because
scarcity is built into the address space, every group starts from the same baseline.

Bitsocial identities are free keypairs. Each community chooses its own challenge before accepting a
post, such as a captcha, a payment, a token balance or an allowlist, and other communities can choose
differently. See [Custom Anti-Spam Challenges](/custom-challenges/).

### Blockchain and governance

Urbit's identity layer depends on Ethereum. Azimuth records who owns each ID and which networking
keys it uses, and the Galactic Senate can upgrade the contract that governs it. The same 256 galaxies
also handle peer discovery and relaying, so a fixed set of identities carries both governance and
part of the network's routing.

Bitsocial identities are keypairs that need no registration. `.bso` and `.eth` names are optional
aliases that resolve to them. Peer discovery goes through HTTP routers that only return provider
addresses; anyone can run one, and clients can switch routers by changing their configuration.

### Scope

Urbit is a general-purpose computer. A ship can host a Git remote, a personal knowledge base or AI
agents, and Tlon Messenger is one program among many. Building for Urbit mostly means writing Hoon
apps for Arvo. Bitsocial is a protocol for public communities, with apps such as
[5chan](/apps/5chan/) and [Seedit](/apps/seedit/). It runs on the existing stack (libp2p, IPFS and
the browser) instead of replacing it, and its clients are built with ordinary web tooling. See
[Build Your Own Client](/build-your-own-client/).

### Private messages

This is where Urbit is stronger. Direct messages go from one ship straight to another, all traffic
between ships is encrypted, and groups can be private or secret. Tlon notes that messages are
encrypted in transit but stored unencrypted on the ship. Bitsocial focuses on public communities and
has no native direct messages yet.

## Project status

Urbit has been through upheaval. In August 2024 the Urbit Foundation, the nonprofit that steers core
development, fired its executive director; founder Curtis Yarvin returned to lead strategy without a
formal title, several core developers left, and the Foundation's runway was measured in months,
[CoinDesk reported](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin proposed moving Azimuth to an existing Ethereum layer 2, with Base the likely choice, and
issuing fungible "visa" tokens that convert into planets. As of October 2026, Urbit's
[ID documentation](https://docs.urbit.org/urbit-id/what-is-urbit-id) still describes Azimuth on
Ethereum with its naive rollup. In October 2025 the Galactic Senate replaced the Foundation's
board, and the new board appointed a new executive director
([announcement](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Development continues. Directed Messaging went live with the 408k release on July 14, 2026. In June
2026 Tlon Messenger
[opened public sign-ups without a waitlist](https://urbit.org/blog/this-month-in-urbit-june-2026),
and Tlon now presents itself as a place where people and AI agents work together.

## Comparison

| Question          | Urbit                                                                                 | Bitsocial                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Category          | Personal-server network and operating system                                          | Peer-to-peer community network                                                                 |
| Identity          | Urbit IDs: about 4 billion planets registered on Ethereum, plus free comets           | Ed25519 keypairs for users and communities                                                     |
| Who runs a server | Every user, on their own ship or a hosted one                                         | Community owners; readers and posters can use a browser tab                                    |
| Where posts live  | The group host's ship and a copy on every member's ship                               | The community owner's node and the peers that read and seed it                                 |
| Communities       | Groups hosted by their creator's ship, with member lists                              | First-class objects whose node accepts or rejects posts                                        |
| Spam control      | Scarce IDs issued by stars; groups ban ships or whole ranks                           | Each community's challenge before a post is accepted                                           |
| Moderation        | The group host's roles and bans                                                       | Community owners moderate their community; apps choose what they show                          |
| Peer discovery    | Galaxies track and relay for the ships beneath them                                   | HTTP routers return provider peers and store no content                                        |
| Governance        | The Galactic Senate of 256 galaxies votes on Azimuth upgrades                         | No protocol-level authority over identities or communities                                     |
| Private messages  | Encrypted direct messages and invite-only groups                                      | Public communities; no native direct messages yet                                              |
| Main tradeoff     | A whole personal computer with private groups, but every user needs an always-on ship | Free identities and browser access, but no private messaging and only the latest state is kept |
