---
title: Captcha Canvas Challenge
description: Standalone billedbaseret captcha-generator med konfigurerbare tegn, dimensioner og farver.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Ældre navngivning
Denne pakke blev oprindeligt udgivet under `@plebbit`-omfanget. Det er blevet omdøbt til `@bitsocial/captcha-canvas-challenge`. Referencer til det gamle navn kan stadig forekomme i ældre dokumentation eller kodebaser.
:::

Captcha Canvas Challenge er en selvstændig billed-captcha-generator, der oprindeligt er udvundet fra `plebbit-js`. Den gengiver randomiseret tekst på et HTML-lærred og returnerer det resulterende billede, som fællesskaber kan præsentere for forfattere som en spam-udfordring.

**Kildekode:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Krav

- **Node.js** >= 22
- **Kun ESM** -- denne pakke sender ikke CommonJS builds.
- **Runtime peer-afhængighed:** `@plebbit/plebbit-js` (migrerer til `@pkc/pkc-js`)

## Installation

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Konfigurationsmuligheder

| Mulighed     | Skriv    | Standard  | Beskrivelse                                        |
| ------------ | -------- | --------- | -------------------------------------------------- |
| `characters` | `number` | `6`       | Antal tilfældige tegn gengivet i captcha-billedet. |
| `height`     | `number` | `100`     | Højden af det genererede billede i pixels.         |
| `width`      | `number` | `300`     | Bredden af det genererede billede i pixels.        |
| `colors`     | `string` | `#32cf7e` | Primærfarve brugt til captcha-teksten.             |

## Hvordan det virker

1. Generatoren vælger en tilfældig streng med den konfigurerede længde.
2. Strengen gengives på et lærred med visuel støj for at modstå OCR.
3. Det resulterende billede (og det forventede svar) returneres, så den kaldende applikation kan præsentere udfordringen og senere bekræfte svaret.

Fordi pakken er en ren billedgenerator, håndterer den ikke netværk eller sessionsstyring alene. Det er beregnet til at blive integreret i et større udfordringsflow -- for eksempel som en af udfordringstyperne, der understøttes af [Spam Blocker](./spam-blocker.md).
