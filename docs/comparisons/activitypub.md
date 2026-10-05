---
title: Bitsocial and ActivityPub
description: How the Fediverse, with Mastodon for microblogging and Lemmy for Reddit-style communities, compares with Bitsocial's peer-to-peer communities.
---

# Bitsocial and ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) is the W3C standard behind the Fediverse. Users
pick a server, called an instance, which hosts their account, and servers exchange posts with each
other. [Mastodon](https://joinmastodon.org/) is its best-known microblogging software;
[Lemmy](https://join-lemmy.org/) is a Reddit-style link aggregator and forum built from topic
communities, which makes it the closest Fediverse match for Bitsocial apps such as
[Seedit](/apps/seedit/).

## How ActivityPub works

- **Inboxes and outboxes.** Every account has an inbox and an outbox. Servers deliver activities into
  inboxes on other servers, and each receiving server stores its own copy of what its users follow.
- **Server-owned identity.** Account and post IDs are HTTPS addresses on the origin server's domain.
  A Mastodon handle is `@user@domain`, resolved with WebFinger, and the server signs federation
  messages on the user's behalf.
- **Clients.** Apps and browsers talk only to the user's own server, over that server's API.
- **Lemmy communities.** A community is a group actor hosted on one instance. Users send posts to the
  community, which re-broadcasts them to its followers; under the shared forum standard
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) a community
  may validate posts first, up to manual approval by moderators.
- **Moderation.** Moderation is local to each server. Admins can suspend accounts, block whole
  servers or federate only with an allowlist; Lemmy also has moderators for each community.
- **Spam control.** ActivityPub defines no anti-spam mechanism. Mastodon and Lemmy gate signups with
  approval, invites, application questions, captchas and email checks, then rely on rate limits,
  reports and moderation.

## Where they differ

### Identity belongs to a domain

A Fediverse account belongs to its server's domain. Mastodon can redirect followers to a new
account, but [posts do not move](https://docs.joinmastodon.org/user/moving/), the move has to start
from the old server, and there is a 30-day cooldown. In Bitsocial, profiles and communities are
keypairs, so changing hosts or apps does not change the identity. See
[Identity and Community Ownership](/identity-and-ownership/).

### Where a community lives

A Lemmy community is structurally close to a Bitsocial one: posts go to the community, which can
check them before re-broadcasting. The difference is where it lives. A Lemmy community can only be
created on its creator's home instance, the instance admin has
[complete control](https://join-lemmy.org/docs/users/05-censorship-resistance.html) over it, and
there is no documented way to move it to another instance. A Bitsocial community is its own keypair:
the owner can run its node anywhere, and no server admin sits above it.

### Spam control

Fediverse servers mostly stop spam at signup and moderate afterwards. A Bitsocial community runs a
challenge on every post before accepting it, and each community chooses its own: captcha, allowlist,
payment or any other code. See [Custom Anti-Spam Challenges](/custom-challenges/).

### Running the infrastructure

Running an instance means an always-on server with a domain, TLS and email. Mastodon also needs
PostgreSQL, Redis and background workers; Lemmy is lighter, at about 150 MB of RAM by its own
figure. Each instance stores copies of the remote content its users follow. A Bitsocial community
node needs no domain or certificate and runs from the desktop app or `bitsocial-cli`.

### What servers give in return

Fediverse servers keep full history and serve it reliably, and Mastodon has mature moderation tools
built up over years. Bitsocial does not guarantee old content forever, and its moderation tools live
in each app.

## Comparison

| Question            | ActivityPub (Mastodon, Lemmy)                                                           | Bitsocial                                                             |
| ------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Category            | Federated servers                                                                       | Peer-to-peer community network                                        |
| Identity            | Account on a server's domain, signed by the server                                      | Ed25519 keypairs for users and communities                            |
| Where posts live    | The origin server, plus copies on every server that follows                             | The community owner's node and the peers that read and seed it        |
| Who keeps it online | Instance admins                                                                         | Community owner node plus helper seeders                              |
| Communities         | Lemmy communities hosted on one instance                                                | First-class objects whose node accepts or rejects posts               |
| Spam control        | Signup gates, rate limits, reports and moderation                                       | Each community's challenge before a post is accepted                  |
| Moderation          | Server admins and community moderators, local to each server                            | Community owners moderate their community; apps choose what they show |
| Names               | `@user@domain` and `!community@domain` handles                                          | `.bso` and `.eth` names that resolve to keys                          |
| Browser             | Client of the user's own server                                                         | Peer-to-peer node inside a normal browser tab                         |
| Main tradeoff       | Reliable history and mature moderation, but identity and communities belong to a server | No server or domain needed, but old content is not guaranteed forever |
