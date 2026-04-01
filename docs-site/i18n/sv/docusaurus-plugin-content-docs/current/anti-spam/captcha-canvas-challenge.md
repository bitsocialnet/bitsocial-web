---
title: Captcha Canvas Challenge
description: Fristående bildbaserad captcha-generator med konfigurerbara tecken, dimensioner och färger.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Legacy Naming
Detta paket publicerades ursprungligen under `@plebbit`-omfånget. Den har bytt namn till `@bitsocial/captcha-canvas-challenge`. Referenser till det gamla namnet kan fortfarande förekomma i äldre dokumentation eller kodbaser.
:::

Captcha Canvas Challenge är en fristående bild captcha-generator som ursprungligen extraherades från `plebbit-js`. Den återger randomiserad text på en HTML-duk och returnerar den resulterande bilden, som gemenskaper kan presentera för författare som en skräppostutmaning.

**Källkod:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Krav

- **Node.js** >= 22
- **Endast ESM** -- det här paketet skickar inte CommonJS-versioner.
- **Runtime peer-beroende:** `@plebbit/plebbit-js` (migrerar till `@pkc/pkc-js`)

## Installation

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Konfigurationsalternativ

| Alternativ   | Skriv    | Standard  | Beskrivning                                             |
| ------------ | -------- | --------- | ------------------------------------------------------- |
| `characters` | `number` | `6`       | Antal slumpmässiga tecken som återges i captcha-bilden. |
| `height`     | `number` | `100`     | Höjd på den genererade bilden i pixlar.                 |
| `width`      | `number` | `300`     | Bredden på den genererade bilden i pixlar.              |
| `colors`     | `string` | `#32cf7e` | Primärfärg som används för captcha-texten.              |

## Hur det fungerar

1. Generatorn väljer en slumpmässig sträng med den konfigurerade längden.
2. Strängen återges på en duk med visuellt brus för att motstå OCR.
3. Den resulterande bilden (och det förväntade svaret) returneras så att den anropande applikationen kan presentera utmaningen och senare verifiera svaret.

Eftersom paketet är en ren bildgenerator, hanterar det inte nätverk eller sessionshantering på egen hand. Det är tänkt att integreras i ett större utmaningsflöde -- till exempel som en av utmaningstyperna som stöds av [Spamblockerare](./spam-blocker.md).
