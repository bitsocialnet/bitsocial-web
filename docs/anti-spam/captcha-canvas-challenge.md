---
title: Captcha Canvas Challenge
description: Standalone image-based captcha generator with configurable characters, dimensions, and colors.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Legacy Naming
This package was originally published under the `@plebbit` scope. It has been renamed to `@bitsocial/captcha-canvas-challenge`. References to the old name may still appear in older documentation or codebases.
:::

Captcha Canvas Challenge is a standalone image captcha generator originally extracted from `plebbit-js`. It renders randomized text onto an HTML canvas and returns the resulting image, which communities can present to authors as a spam challenge.

**Source code:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Requirements

- **Node.js** >= 22
- **ESM-only** -- this package does not ship CommonJS builds.
- **Runtime peer dependency:** `@plebbit/plebbit-js` (migrating to `@pkc/pkc-js`)

## Installation

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Configuration Options

| Option | Type | Default | Description |
|---|---|---|---|
| `characters` | `number` | `6` | Number of random characters rendered in the captcha image. |
| `height` | `number` | `100` | Height of the generated image in pixels. |
| `width` | `number` | `300` | Width of the generated image in pixels. |
| `colors` | `string` | `#32cf7e` | Primary color used for the captcha text. |

## How It Works

1. The generator picks a random string of the configured length.
2. The string is rendered onto a canvas with visual noise to resist OCR.
3. The resulting image (and the expected answer) are returned so the calling application can present the challenge and later verify the response.

Because the package is a pure image generator, it does not handle networking or session management on its own. It is intended to be integrated into a larger challenge flow -- for example, as one of the challenge types supported by [Spam Blocker](./spam-blocker.md).
