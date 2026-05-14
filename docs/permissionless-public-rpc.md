---
title: Permissionless Public RPC
description: Proposed design for a public Bitsocial RPC service with isolated users, scoped permissions, and community ownership.
---

# Permissionless Public RPC

This page frames public RPC as a product-level Bitsocial proposal instead of a wall of
implementation detail.

## Plain-language goal

[Bitsocial Forge](https://bitsocialforge.com) can run a public RPC service that lets many users manage their own Bitsocial
communities remotely, without turning the operator into a custodian of those communities.

The service should make mobile and lightweight clients practical while preserving three constraints:

1. Users stay isolated from one another by default.
2. Permissions stay explicit and granular.
3. Compatibility with the current RPC request and response shape can be preserved during rollout.

## What problem it solves

Today, the simplest RPC model is usually all-or-nothing: one auth key, one authority domain, full
access. That works for a single operator but not for a public multi-user service.

A permissionless public RPC needs a stronger model:

- one service can host many users
- each user gets their own communities and limits
- operator-defined policies can prevent abuse
- the user can still move away or self-host later

## Core model

### Users

Each user gets an auth credential plus a permission bundle.

### Communities

Communities created through the service are assigned to an owner record. Ownership is tracked
explicitly so that management methods can be scoped to the right user.

### Permissions

Permissions are capability-based. Instead of one boolean for “can use the RPC,” the server can
control:

- how many communities a user can create
- which management methods are available
- what publish operations are allowed
- what rate limits apply
- what admin surfaces are visible

### Admin surface

The public RPC itself should stay focused on user-facing RPC behavior. Administrative tasks such as
user creation, ownership transfer, and audit review belong in a separate operator API and dashboard.

## Compatibility stance

User-facing documentation should use Bitsocial terms such as **community** and **profile**.

At the wire level, the first rollout can still preserve the current JSON-RPC transport and payload
shape where that is useful for compatibility. In other words: the docs can stay Bitsocial-native
even if the transition period keeps some compatibility-oriented method names or request shapes
behind the scenes.

## Proposed permission bundle

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchCid: boolean;
    resolveAuthorName: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communitiesSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

The exact method names are illustrative. The important part is the shape of the policy: individual
capabilities are independently controlled instead of bundled into one superuser token.

## Connection flow

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Permission awareness should stay optional. A client that ignores the notification can still behave
correctly by handling standard authorization failures from the server.

## Ownership enforcement

When the service creates a community, it should automatically assign ownership to the calling user.
From there:

- community start, stop, edit, and delete actions are owner-scoped
- list and subscription responses default to the caller’s own communities
- broader visibility is an explicit admin permission, not a default

One edge case matters a lot: if a user subscribes to a community they do **not** own, the server
must only expose the public state that any outside observer should see. Owner-only configuration or
internal runtime data should never leak through a subscription API.

## Suggested operator surface

The admin API can stay boring and explicit:

- list users
- inspect one user
- create or update users
- delete users
- transfer community ownership
- inspect audit logs

Authentication for this operator API should be completely separate from end-user RPC auth.

## Implementation milestones

### Milestone 1

- establish the public RPC project structure
- add user records and ownership tracking
- fork or extend the current RPC server

### Milestone 2

- implement permission bundles
- enforce them at the RPC method layer
- return permissions metadata on connect

### Milestone 3

- add the operator API
- add audit logging
- add admin authentication

### Milestone 4

- ship the admin dashboard
- test abuse controls
- tighten rate limiting and storage quotas

## Open questions

### Auth credential spam

If auth creation is cheap, public services may need a challenge layer before issuing credentials.
One possible route is to reuse the community challenge model itself so credential issuance inherits
the same anti-abuse philosophy as the rest of the network.

### Migration details

Some early implementations may still expose compatibility-oriented method names internally. That
should be treated as a migration detail, not as the permanent public vocabulary of Bitsocial docs.

## Summary

This proposal is really about one thing: making public RPC infrastructure useful without making it
custodial. A good public Bitsocial RPC should feel like optional assistance for running communities,
not like a new central platform that reclaims ownership through the back door.
