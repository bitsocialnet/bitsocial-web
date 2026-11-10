---
title: Hardware Requirements
description: What hardware a Bitsocial full node needs, from a profile or a few boards on a Raspberry Pi to a community with a million comments.
---

# Hardware Requirements

A Bitsocial full node is two processes: a [Kubo](https://github.com/ipfs/kubo) (IPFS) daemon and a
Node.js process that runs the protocol. [`bitsocial-cli`](/developer-tools/cli/) runs them, and so do
the [5chan](/apps/5chan/) and [Seedit](/apps/seedit/) desktop apps, whether the node hosts one
profile, a few boards or a large community.

It needs much less than a typical IPFS node. Bitsocial content is text only, each node stores only its
own communities, and nodes find each other through HTTP trackers instead of the IPFS DHT.

## Quick reference

| What the node hosts                                                   | RAM   | CPU             | Storage                                    | Example hardware                                     |
| --------------------------------------------------------------------- | ----- | --------------- | ------------------------------------------ | ---------------------------------------------------- |
| A [profile](#profiles-and-desktop-apps) or a few small communities    | 2 GB  | 2 cores, 64-bit | 16 GB, SSD preferred                       | Raspberry Pi 4 or 5 (2 GB or more), the smallest VPS |
| Dozens of boards, or one community with tens of thousands of comments | 4 GB  | 4 cores         | 64 GB SSD                                  | Raspberry Pi 5 (4 or 8 GB) with an SSD, a small VPS  |
| One community with hundreds of thousands to a million comments        | 16 GB | 4 or more cores | NVMe SSD, about 20 GB per million comments | Desktop, mini PC or mid-size VPS                     |

The [desktop apps](#profiles-and-desktop-apps) run the same node, so the same rows apply to the
communities they host. These are recommendations, not hard limits. They come from the measurements
below, with headroom for the operating system and for the first publish after a restart, which is
the most demanding moment for a node.

## Why it is lighter than a typical IPFS node

Kubo's own README recommends at least 6 GB of RAM and 2 CPU cores. Much of that goes to the Amino
DHT: keeping a routing table and re-announcing every stored block to the DHT, which Kubo estimates at
about 1 GiB of RAM per 20 million items. A Bitsocial node does not use the DHT at all:

- **Trackers instead of the DHT.** Bitsocial configures Kubo with custom routing that sends content
  lookups and announcements only to HTTP trackers (`bitsocial-cli` ships six by default), and
  community records travel over pubsub. There is no DHT routing table and no DHT reprovide sweep.
  Trackers keep an announcement for 24 hours, so the node re-announces what it serves. See
  [Peer-to-Peer Protocol](/peer-to-peer-protocol/).
- **Text only.** A post is signed text capped at 40 KB. Images and videos are links to other
  hosts, so a node never stores or serves media.
- **Only its own communities.** A node keeps the communities it hosts, not the whole network. How
  long it keeps old posts is the community's own [retention policy](/content-persistence/).
- **Old pages are collected.** Every update rewrites a community's pages, and `bitsocial-cli` runs
  Kubo's garbage collection every hour to delete the old ones.

## Measured numbers

The recommendations above come from two sources: the Bitsocial team's main node, and the
large-board benchmark in [pkc-js](https://github.com/pkcprotocol/pkc-js), the protocol library every
node runs. A Raspberry Pi has not been benchmarked directly yet; the Pi rows follow from these memory
and disk figures.

| Node                                                            | Node.js memory                          | Kubo memory  | Disk                                             |
| --------------------------------------------------------------- | --------------------------------------- | ------------ | ------------------------------------------------ |
| Main node, 75 communities, three days after a restart           | about 630 MB, plus about 115 MB in swap | about 205 MB | not measured                                     |
| Benchmark, 2,000 threads and 62,298 comments, first publish     | 1.66 GB peak                            | 210 MB peak  | not measured                                     |
| Benchmark, 33,000 threads and 1,020,719 comments, first publish | 6.4 GB peak                             | 914 MB peak  | 1.9 GB SQLite, Kubo repo up to 15.5 GB before GC |

The benchmark used Kubo 0.43.1 and Node.js 22 in October 2026. In the 62,298-comment run, the first
publish cycle took 19.7 seconds and the next one 3.7 seconds. In the million-comment run they took
18.9 minutes and about 5 minutes. The first publish after a start is the peak because the node
re-adds every stored comment to Kubo and rebuilds every page; memory settles lower afterwards.

## CPU

Two 64-bit cores are enough for small nodes, because Kubo and the Node.js process work in parallel.
A faster CPU mostly shortens the publish cycle, which is how long a new post takes to show up for
readers. That matters for a large community: a million comments took minutes per cycle in the benchmark, so
run that size on a desktop, mini PC or VPS rather than a Raspberry Pi.

## Storage

Disk use grows with the number of comments a node keeps:

- **SQLite.** Each community has its own database, about 2 KB per comment.
- **Kubo repo.** Comments, the community's current pages, and the previous pages until the next
  hourly garbage collection.

Budget about 20 GB per million stored comments, peaks included. A board that purges old threads,
like 5chan's 48-hour default, stays small however busy it is.

Use an SSD. SQLite and Kubo write constantly, and microSD cards are slow at small random writes and
wear out under them. On a Raspberry Pi, boot from or attach a USB 3 SSD, or use an NVMe HAT on a
Pi 5.

## Network and uptime

- **Bandwidth.** Any always-on broadband connection works. Traffic is text: signed posts, votes and
  pages of posts. Upload matters more than download, because readers fetch pages from your node,
  and readers and [seeders](/content-persistence/#who-keeps-posts-online) share that load as a
  community grows.
- **Uptime.** A community accepts new posts only while its node is online, because the node answers
  challenges and accepts posts. Run a community's node on a machine that stays on.
- **Reachability.** Run `bitsocial reachability status` (`bitsocial-cli` 0.19.123 or later) to see
  whether desktop nodes and browsers can connect to your node, and `bitsocial reachability setup`
  to fix it: it forwards ports through UPnP when the node is behind a router and gets a certificate
  browsers trust. Seeders also make communities behind home routers loadable from browsers.

## Operating system

- 64-bit Linux, macOS or Windows. On a Raspberry Pi, use the 64-bit Raspberry Pi OS.
- `bitsocial-cli` installs with npm and needs Node.js 22.19 or later. Its Docker image is published
  for `linux/amd64` and `linux/arm64`. See [Bitsocial CLI](/developer-tools/cli/).

## Profiles and desktop apps

- **Profiles.** An author community, or profile, is an ordinary community that only its author
  posts to, as defined in the draft [BSIP-14](https://bsips.bitsocial.net/bsip-14/). It is the
  smallest thing a node can host, so a profile node fits the first row of the table, and moving
  from a hosted RPC to your own profile node on a Raspberry Pi is the
  [exit path](/flagship-bitsocial-app/#non-custodial-rpc) Bitsocial is designed around.
- **Desktop apps.** The 5chan and Seedit desktop apps bundle Kubo and run the same node, with the
  same tracker routing, inside the app. They seed the communities you open while the app is
  running, and need a little more memory than `bitsocial-cli` for the app window. A community hosted
  from a desktop app is online only while the app is open, so for a community others rely on, use
  `bitsocial-cli` on a machine that stays on.
