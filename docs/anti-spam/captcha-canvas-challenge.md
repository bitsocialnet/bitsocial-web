---
title: Captcha Canvas Challenge
description: Standalone image-based captcha challenge for Bitsocial communities.
sidebar_position: 2
---

# Captcha Canvas Challenge

Captcha Canvas Challenge is a standalone image captcha package for Bitsocial communities. It renders randomized text onto a canvas and lets a community ask authors to solve the image before a publication is accepted.

- **Source code and current README:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge#readme)
- **npm package:** [`@bitsocial/captcha-canvas-challenge`](https://www.npmjs.com/package/@bitsocial/captcha-canvas-challenge)

## Installation

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Where It Fits

Captcha challenges are useful when a community wants a simple interactive gate for low-stakes spam resistance. This package is intentionally narrow: it provides the challenge implementation, while the community or Bitsocial node decides when and how to present it.

For stronger protection, combine it with broader moderation or risk-scoring systems instead of treating a captcha as a complete anti-spam strategy.

## Current Package Reference

This page is intentionally an overview, not a mirrored setup guide. The package README is the source of truth for current challenge names, registration examples, CLI examples, supported options, requirements, and security notes:

- [Captcha Canvas Challenge README](https://github.com/bitsocialnet/captcha-canvas-challenge#readme)

Prefer the upstream README when configuring a live community, because package options and install flows are versioned with that package rather than this website.
