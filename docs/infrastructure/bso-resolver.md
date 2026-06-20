---
title: BSO Resolver
description: Resolve .bso domain names to public keys via Bitsocial TXT records.
sidebar_position: 1
---

# BSO Resolver

BSO Resolver translates `.bso` domain names into their corresponding public keys by reading Bitsocial TXT records. It is the resolver package used by Bitsocial tooling when a user-facing `.bso` name needs to become the key material understood by the peer-to-peer stack.

- **Source code and current README:** [github.com/bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver#readme)
- **npm package:** [`@bitsocial/bso-resolver`](https://www.npmjs.com/package/@bitsocial/bso-resolver)

## Installation

```bash
npm install @bitsocial/bso-resolver
```

## Where It Fits

Bitsocial names are meant to be human-readable entry points for communities and authors. The resolver keeps that naming layer separate from application code, so clients can ask whether a name is supported and then resolve it through the package's runtime-specific entry point.

Use it when you are integrating a Bitsocial-aware client, command-line tool, or service that needs to accept `.bso` names instead of only raw public keys.

## Current Package Reference

This page is intentionally an overview, not a mirrored API reference. The package README is the source of truth for constructor options, return types, caching behavior, entry points, provider examples, and supported shutdown semantics:

- [BSO Resolver README](https://github.com/bitsocialnet/bso-resolver#readme)

Prefer the upstream README when copying code into a project, because resolver behavior is versioned with that package rather than this website.
