---
title: Spam Blocker
description: Centralized spam detection service with risk scoring, OAuth challenges, and configurable tier thresholds.
sidebar_position: 1
---

# Spam Blocker

:::warning Legacy Naming
This package was originally published under the `@plebbit` scope. It has been renamed to `@bitsocial/spam-blocker-server` and `@bitsocial/spam-blocker-challenge`. References to the old names may still appear in older documentation or codebases.
:::

Spam Blocker is a centralized spam detection service that evaluates incoming publications and assigns risk scores. It consists of two packages:

- **`@bitsocial/spam-blocker-server`** -- the HTTP server that hosts the evaluation and challenge APIs.
- **`@bitsocial/spam-blocker-challenge`** -- a lightweight client package that communities integrate to send publications for evaluation.

**Source code:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## How Risk Scoring Works

Every publication submitted to the `/evaluate` endpoint receives a numeric risk score. The score is a weighted combination of several signals:

| Signal | Description |
|---|---|
| Account age | Newer accounts receive higher risk scores. |
| Karma | Accumulated community karma reduces risk. |
| Author reputation | Reputation data gathered by the background network indexer. |
| Content analysis | Text-level heuristics (link density, known spam patterns, etc.). |
| Velocity | Rapid successive posts from the same author increase risk. |
| IP intelligence | Country-level geolocation and threat-feed lookups. Only country codes are stored -- raw IP addresses are never shared with communities. |

## Tier Thresholds

The risk score maps to one of four configurable tiers that determine what happens next:

1. **Auto-accept** -- score is low enough that the publication is approved without any challenge.
2. **OAuth-sufficient** -- the author must complete an OAuth verification to proceed.
3. **OAuth-plus-more** -- OAuth alone is not enough; additional verification (e.g., CAPTCHA) is required.
4. **Auto-reject** -- score is too high; the publication is rejected outright.

All threshold values are configurable per community.

## Challenge Flow

When a publication falls into a tier that requires verification, the challenge flow begins:

1. The author is first prompted to authenticate via **OAuth** (GitHub, Google, Twitter, and other supported providers).
2. If OAuth alone is insufficient (tier 3), a **CAPTCHA fallback** powered by Cloudflare Turnstile is presented.
3. The OAuth identity is used solely for verification -- it is **never shared** with the community or other users.

## API Endpoints

### `POST /evaluate`

Submit a publication for risk evaluation. Returns the computed risk score and the required challenge tier.

### `POST /challenge/verify`

Submit the result of a completed challenge (OAuth token, CAPTCHA solution, or both) for verification.

### `GET /iframe/:sessionId`

Returns an embeddable HTML page that renders the appropriate challenge UI for the given session.

## Rate Limiting

Rate limits are applied dynamically based on author age and reputation. Newer or lower-reputation authors face stricter limits, while established authors enjoy more generous thresholds. This prevents spam floods without penalizing trusted participants.

## Background Network Indexer

The server runs a background indexer that continuously crawls the network to build and maintain author reputation data. This data feeds directly into the risk scoring pipeline, allowing the system to recognize repeat good-faith participants across communities.

## Privacy

Spam Blocker is designed with privacy in mind:

- OAuth identities are used only for challenge verification and are **never disclosed** to communities.
- IP addresses are resolved to **country codes only**; raw IPs are not stored or shared.

## Database

The server uses **SQLite** (via `better-sqlite3`) for local persistence of reputation data, session state, and configuration.
