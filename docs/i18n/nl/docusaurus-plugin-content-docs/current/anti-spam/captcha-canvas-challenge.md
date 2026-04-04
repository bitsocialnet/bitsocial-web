---
title: Captcha Canvas Challenge
description: Zelfstandige, op afbeeldingen gebaseerde captcha-generator met configureerbare tekens, afmetingen en kleuren.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Oude naamgeving
Dit pakket is oorspronkelijk gepubliceerd onder het bereik `@plebbit`. De naam is gewijzigd in `@bitsocial/captcha-canvas-challenge`. Verwijzingen naar de oude naam kunnen nog steeds voorkomen in oudere documentatie of codebases.
:::

Captcha Canvas Challenge is een zelfstandige captcha-generator voor afbeeldingen, oorspronkelijk geëxtraheerd uit `plebbit-js`. Het geeft willekeurige tekst weer op een HTML-canvas en retourneert de resulterende afbeelding, die communities aan auteurs kunnen presenteren als een spamuitdaging.

**Broncode:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Vereisten

- **Node.js** >= 22
- **Alleen ESM** -- dit pakket verzendt geen CommonJS-builds.
- **Runtime peer-afhankelijkheid:** `@plebbit/plebbit-js` (migreert naar `@pkc/pkc-js`)

## Installatie

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Configuratieopties

| Optie        |          |
| ------------ | -------- | --------- | ---------------------------------------------------------- |
| `characters` | `number` | `6`       | Number of random characters rendered in the captcha image. |
| `height`     | `number` | `100`     | Height of the generated image in pixels.                   |
| `width`      | `number` | `300`     | Width of the generated image in pixels.                    |
| `colors`     | `string` | `#32cf7e` | Primary color used for the captcha text.                   |

## Hoe het werkt

1. De generator kiest een willekeurige tekenreeks met de geconfigureerde lengte.
2. De tekenreeks wordt weergegeven op een canvas met visuele ruis om OCR te weerstaan.
3. De resulterende afbeelding (en het verwachte antwoord) wordt geretourneerd, zodat de aanroepende toepassing de uitdaging kan presenteren en later het antwoord kan verifiëren.

Omdat het pakket een pure afbeeldingsgenerator is, wordt er geen netwerk- of sessiebeheer op zijn systeem uitgevoerd own Het is bedoeld om te worden geïntegreerd in een grotere uitdagingsstroom, bijvoorbeeld als een van de uitdagingstypen die worden ondersteund door [Spam Blocker](./spam-blocker.md).
