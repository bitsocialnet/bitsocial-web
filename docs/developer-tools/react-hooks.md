---
title: React Hooks
description: React hooks library for building decentralized social applications on the Bitsocial protocol.
sidebar_position: 1
---

# React Hooks

:::warning Legacy Naming
This package currently uses legacy naming conventions inherited from its upstream fork. References to "plebbit" in code, APIs, and configuration will be migrated to "bitsocial" in a future release. Functionality is unaffected.
:::

The `bitsocial-react-hooks` package provides a familiar React hooks API for interacting with the Bitsocial protocol. It handles fetching feeds, comments, and author profiles, managing accounts, publishing content, and subscribing to communities -- all without relying on a central server.

This library is the primary interface used by [5chan](/apps/5chan/) and other Bitsocial client applications.

:::note
`bitsocial-react-hooks` is a temporary fork of `plebbit/plebbit-react-hooks` maintained for AI-aided development. It is consumed directly from GitHub rather than published to npm.
:::

## Installation

Because the package is not yet on npm, install it directly from GitHub, pinning to a specific commit hash:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Replace `<commit-hash>` with the commit you want to target.

## API Overview

The hooks are organized into functional categories. Below is a summary of the most commonly used hooks in each category. For complete signatures, parameters, and return types, see the [full API reference on GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Accounts

Manage local user accounts, identity, and settings.

- `useAccount(accountName?)` -- returns the active (or named) account object
- `useAccounts()` -- returns all locally stored accounts
- `useAccountComments(options?)` -- returns comments published by the active account

### Comments

Fetch and interact with individual comments and threads.

- `useComment(commentCid?)` -- fetches a single comment by its CID
- `useComments(commentCids?)` -- fetches multiple comments in batch
- `useEditedComment(comment?)` -- returns the latest edited version of a comment

### Communities

Retrieve community metadata and settings.

- `useSubplebbit(subplebbitAddress?)` -- fetches a community by address
- `useSubplebbits(subplebbitAddresses?)` -- fetches multiple communities
- `useSubplebbitStats(subplebbitAddress?)` -- returns subscriber and post counts

### Authors

Look up author profiles and metadata.

- `useAuthor(authorAddress?)` -- fetches an author profile
- `useAuthorComments(options?)` -- returns comments by a specific author
- `useResolvedAuthorAddress(authorAddress?)` -- resolves a human-readable address (e.g., ENS) to its protocol address

### Feeds

Subscribe to and paginate content feeds.

- `useFeed(options?)` -- returns a paginated feed of posts from one or more communities
- `useBufferedFeeds(feedOptions?)` -- pre-buffers multiple feeds for faster rendering
- `useAuthorFeed(authorAddress?)` -- returns a feed of posts by a specific author

### Actions

Publish content and perform write operations.

- `usePublishComment(options?)` -- publish a new comment or reply
- `usePublishVote(options?)` -- cast an upvote or downvote
- `useSubscribe(options?)` -- subscribe or unsubscribe from a community

### States and RPC

Monitor connection state and interact with a remote Bitsocial daemon.

- `useClientsStates(options?)` -- returns the connection state of IPFS/pubsub clients
- `usePlebbitRpcSettings()` -- returns current RPC daemon configuration

## Development

To work on the hooks library locally:

**Prerequisites:** Node.js, Corepack enabled, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Refer to the repository README for test and build commands.

## Links

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **License:** GPL-2.0-only
