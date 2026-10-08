---
title: Local Moderation, Not Global Bans
description: What Bitsocial means when it says moderation stays local.
---

# Local Moderation, Not Global Bans

Bitsocial is not moderation-free. It is moderation without a protocol-level super-admin.

Community owners still set rules for their own spaces. Apps still decide what they index, rank, or
highlight. What Bitsocial does not include is a global authority that can confiscate a community or
erase an identity from the network itself.

For a broader plain-English walkthrough of community ownership, publishing, challenges, and
moderator signatures, read
[A complete layman explanation of the Bitsocial protocol](./layman-protocol-explanation.md).

## How moderation works

- A community owner can moderate that community
- An app can choose what it indexes or shows
- A user can move to another community or another app

If one app filters you, another app can still choose to show you. If one community rejects you,
another community can accept you, or you can create your own.

## Community roles and permissions

The `owner`, `admin`, and `moderator` values in `community.roles` grant real permissions within
one community. In pkc-js 0.0.101, the community node applies the following checks to signed
publications received over pubsub:

| Action                                                                                 | Moderator | Admin | Owner |
| -------------------------------------------------------------------------------------- | --------- | ----- | ----- |
| Moderate content, such as removing posts, locking threads, and approving pending posts | Yes       | Yes   | Yes   |
| Edit public properties such as the title, description, rules, and features             | No        | Yes   | Yes   |
| Change `community.roles`                                                               | No        | No    | Yes   |
| Edit the legacy `address` field                                                        | No        | No    | Yes   |
| Edit private `community.settings`, including challenge configuration                   | No        | No    | No    |

Moderation uses `createCommentModeration()`. Public community edits use `createCommunityEdit()`.
Both are signed publications and still go through the community's challenge handshake. A role
does not automatically bypass challenges; the node operator can configure exclusions for
particular roles.

Role checks authenticate the publication's signer. A role entry can use a key-derived author
address or a domain; a domain must match the author's claimed name and resolve to the signing
key. Merely claiming an address does not grant that address's permissions.

### Public roles and hosting control

Private `community.settings` are edited through `community.edit()` on the hosting node, either
locally or through privileged RPC access to that node. This includes the actual challenge
configuration; the public `community.challenges` record only describes the configured challenges.
Even an account with the `owner` role cannot publish a private settings change over pubsub.

An `owner` role entry does not itself give someone the community's private key or access to its
hosting node. Starting, stopping, or deleting the hosted community is also a node-management
operation. The node operator's local editing authority is separate from the selected account's
entry in `community.roles`. See [Identity and Community Ownership](./identity-and-ownership.md)
for the key-control model.

The owner-only rule is field-specific: it does not classify every potentially destructive edit
as owner-only. In 0.0.101, the explicit check covers `roles` and legacy `address`, but not the
newer public `name` field. It should not be read as a guarantee that every identity-related
property is owner-only.

### Implementation and history

The [pkc-js permission checks](https://github.com/pkcprotocol/pkc-js/blob/d7bf2e0a8fd5f26e1d4ead27bbccea0085ea5873/src/runtime/node/community/local-community/publication-validation.ts#L490-L542)
and [community-edit tests](https://github.com/pkcprotocol/pkc-js/blob/d7bf2e0a8fd5f26e1d4ead27bbccea0085ea5873/test/node-and-browser/publications/community-edit/community.edit.publication.test.ts#L105-L265)
define these boundaries. Rinse12's
[December 2024 tests](https://github.com/pkcprotocol/pkc-js/commit/4cb3008ee8215e37bafec9717bf616b08d085d8f)
already distinguish the three roles, and he confirmed remote community editing was implemented
in [issue #39](https://github.com/pkcprotocol/pkc-js/issues/39#issuecomment-2681874445).

## What Bitsocial avoids

Bitsocial avoids the familiar platform choke point where one company controls:

- the social graph
- the moderation database
- the discovery surface
- the account namespace

That central point is what turns a product policy decision into a network-wide ban.

## The practical tradeoff

Local moderation does not mean every app will look identical. It means the consequences of
moderation remain scoped:

- community rules apply inside that community
- app rules apply inside that app
- neither automatically becomes protocol law

That is what “no global bans” is trying to preserve.
