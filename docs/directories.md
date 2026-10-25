---
title: Directories
description: How Bitsocial apps let communities compete for a topic name instead of keeping it for whoever claimed it first.
---

# Directories

On Reddit, a name like `r/opensource` can belong to only one community, and whoever controls it
keeps it. If its moderators make choices users dislike, the only alternative is to start
`r/opensource2`. The new community starts with zero subscribers, even though most people who
subscribed to `r/opensource` cared about open source, not about that particular moderation team.

Bitsocial apps avoid this with **directories**. A directory is a topic name, such as `opensource`,
that communities compete for. The short route for that name opens whichever community currently
ranks first, so a better community can take over the name without anyone's permission.

## How it works

1. **A directory code is a topic name.** Seedit uses routes like `/s/funny`. 5chan uses
   imageboard paths like `/g/`.
2. **Communities compete as candidates.** Each directory has a list of candidate communities, each
   with its own exact address, such as `funny-posting.bso`.
3. **The highest-ranked candidate wins the route.** Opening `/s/funny` shows the current winner.
4. **Losing deletes nothing.** A community that is not the winner keeps its address, its posts, and
   its subscribers, and anyone can still open it directly.

## The name is a front door, not an identity

A directory code is only a discovery route. Everything durable points at an exact community:

- Subscribing from `/s/funny` subscribes to the current winner's exact address. The directory code
  itself is never stored as a subscription.
- Post links always use the community's exact address, so an old link cannot start pointing to a
  different community after the winner changes.
- When the winner changes, Seedit leaves existing subscriptions alone and asks each subscriber
  whether to switch to the new winner, keep both, or keep the current community. Automatic
  switching is an opt-in setting per directory, and an automatic switch shows a notice with undo.

A competing community therefore does not take anyone's subscriptions. It wins the name: new visitors
land on it, and existing subscribers get a one-click choice. People who preferred the old community
keep it.

## Why not first-come names

- **No squatting.** Holding a good name is not enough. A community has to remain the best candidate
  for it.
- **No admin assigns names.** Allocation by an administrator would recreate the central veto that
  Bitsocial is built to remove.
- **Competitors keep a path to the audience.** A rival community targets the same name instead of
  starting over under a worse one.
- **Clients agree on the winner.** Seedit ranks candidates deterministically, so every client
  reading the same finalized directory snapshot shows the same winner. Seedit does not swap in
  another candidate because the winner is temporarily unreachable on one user's connection.

## How winners are chosen today

Candidates are published as JSON files in the
[bitsocialnet/lists](https://github.com/bitsocialnet/lists) repository, one file per directory, and
a community joins a directory through a pull request to its file. This is a bootstrap step. The goal
is for voting to replace pull requests as the way winners are decided.

- **Seedit** ranks a directory's candidates by score, then by the time they were added, then by
  address. Each directory file carries a revision number, and any change to its candidates or
  winner publishes a new revision.
- **5chan** runs one vote contest per directory with
  [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Clients exchange
  signed ballots over libp2p gossipsub and compute the tally themselves, with no server counting
  votes. Voting requires holding a 5chan Pass, a non-transferable token, and each holder gets one
  vote.
  Voting for a board that is not yet listed nominates it. The contests currently run on the Base
  Sepolia testnet, and until they move off testnet, tallies are shown but do not reorder the list.

## Protocol or app?

Directories are not part of PKC, the peer-to-peer layer that stores and moves communities. They are
a convention that clients apply above it, alongside default lists and search; see
[Content Discovery](./content-discovery.md). A client can read the same directory files, publish its
own, or skip directories entirely, and users can still open any community by its address.
