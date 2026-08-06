---
title: Browser Peer-to-Peer
description: How a Bitsocial web app runs a real libp2p node in the browser tab, which transports it uses, and the 2026 upstream fix that made publishing from a tab work.
---

# Browser Peer-to-Peer

A Bitsocial web app does not have to be a client of somebody's server. It can run a
[Helia](https://helia.io/) node inside the browser tab, join the same peer-to-peer network as
desktop and CLI nodes, fetch community content from peers, and publish over pubsub.

This page explains what that actually means, which transports it uses, what it still cannot do, and
why publishing from a tab only started working in 2026.

For the wider network design, see [Peer-to-Peer Protocol](/peer-to-peer-protocol/).

## What runs in the tab

When browser P2P is active, the page holds a real libp2p node:

- it dials other peers over secure WebSockets
- it fetches and verifies community content from those peers, not from an IPFS gateway
- it participates in gossipsub, so publishing a post does not need a hosted pubsub provider
- it uses the same protocol client stack (`pkc-js`) as every other Bitsocial app

The practical consequence is that no gateway operator sits between a web reader and a community.
There is no single HTTPS endpoint that can be pressured into dropping a community for every browser
user at once.

## How browser nodes connect

`pkc-js` dials peers over **secure WebSockets**. WebRTC and WebTransport dials are denied by default
through a connection gater, because in the browser they add long, often-failing
connection-establishment paths — STUN/ICE negotiation, certhash rotation — that slow page loads,
while WebSocket gives a direct and reliable transport. Callers that specifically want WebRTC or
WebTransport can override the gater through
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

The practical consequence is that a browser peer connects to nodes exposing a WSS endpoint, which
means those nodes need a domain and a CA-signed certificate. Peers behind consumer connections
without one are reached indirectly rather than dialed from the tab.

## Why publishing from the browser only started working in 2026

Browser peer-to-peer is not a new idea. What changed in 2026 is that a browser node's _posts_ now
reach the rest of the network.

The libp2p pubsub spec requires a message `seqno` to be a linearly increasing 64-bit big-endian
integer. `js-libp2p-gossipsub` generated 8 random bytes instead, while go-libp2p-pubsub and
rust-libp2p both used a counter. Kubo 0.40+ enables `BasicSeqnoValidator` by default, which rejects
any message whose seqno is not greater than the highest already seen from that peer.

The effect was that most messages published by a JavaScript node — including a browser node — were
silently discarded by Kubo peers. A reproducer measured 2 to 8 of 30 messages arriving.

This was diagnosed in
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) and fixed in
**`@libp2p/gossipsub` 15.0.21** in May 2026. Until that landed, a browser node could connect and
read, but its posts mostly vanished on the way to Go peers. `pkc-js` ships `@libp2p/gossipsub`
16.0.4, past that fix.

## What a browser node still cannot do

A browser node is a real peer, not a server. It has different limits from a desktop or always-on
node:

- it usually cannot accept arbitrary inbound connections from the public internet
- it only works while the tab is open, so it is not a long-lived host for a community's data
- it cannot join a libp2p DHT, which is why discovery goes through HTTP routers
- it is a poor fit for seeding at scale

Full community hosting is still best handled by a desktop app, `bitsocial-cli`, or another always-on
node. Browser P2P changes who can _read and post_ without a gateway; it does not remove the need for
peers that stay online.

## HTTP routers are not gateways

Browser clients still query [HTTP routers](/peer-to-peer-protocol/#public-key-based-addressing)
to find out which peers currently provide a community's address. This is the honest asterisk on
"pure peer-to-peer in the browser," and it is worth being precise about it:

- a router stores only peer addresses for a content address
- it does not store, serve, or even know the community's content
- clients query several routers in parallel and merge the results
- anyone can run one, and swapping routers is a config change with no data migration

After discovery, content transfer and pubsub traffic move peer-to-peer. A router that disappears
costs you a lookup path, not your data. An IPFS gateway, by contrast, is in the content path.

## Where this runs today

- The [Bitsocial blog](https://bitsocial.net/blog) on this site runs as a browser P2P client by
  default. Its "P2P status" panel shows the live peer list, the transport each connection uses, and
  where those peers are.
- [5chan](/apps/5chan/) runs pure browser P2P by default in the web app at
  [5chan.app](https://5chan.app).

## Gateway fallback

Gateway-backed access still exists as a compatibility path for browsers or networks that cannot join
directly. See [Gateway fallback](/peer-to-peer-protocol/#gateway-fallback). The target
architecture is browser P2P first, with gateways as an optional fallback rather than the default
bottleneck.
