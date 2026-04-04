---
title: Captcha Canvas Challenge
description: Frittstående bildebasert captcha-generator med konfigurerbare tegn, dimensjoner og farger.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Legacy navngivning
Denne pakken ble opprinnelig publisert under `@plebbit`-omfanget. Den har fått nytt navn til `@bitsocial/captcha-canvas-challenge`. Referanser til det gamle navnet kan fortsatt forekomme i eldre dokumentasjon eller kodebaser.
:::

Captcha Canvas Challenge er en frittstående bilde-captcha-generator opprinnelig hentet fra `plebbit-js`. Den gjengir randomisert tekst på et HTML-lerret og returnerer det resulterende bildet, som fellesskap kan presentere for forfattere som en spam-utfordring.

**Kildekode:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Krav

- **Node.js** >= 22
- **Kun ESM** -- denne pakken sender ikke CommonJS-bygg.
- **Runtime peer-avhengighet:** `@plebbit/plebbit-js` (migrerer til `@pkc/pkc-js`)

## Installasjon

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Konfigurasjonsalternativer

| Alternativ   | Skriv inn | Standard  | Beskrivelse                                       |
| ------------ | --------- | --------- | ------------------------------------------------- |
| `characters` | `number`  | `6`       | Antall tilfeldige tegn gjengitt i captcha-bildet. |
| `height`     | `number`  | `100`     | Høyden på det genererte bildet i piksler.         |
| `width`      | `number`  | `300`     | Bredden på det genererte bildet i piksler.        |
| `colors`     | `string`  | `#32cf7e` | Primærfarge brukt for captcha-teksten.            |

## Hvordan det fungerer

1. Generatoren velger en tilfeldig streng med den konfigurerte lengden.
2. Strengen gjengis på et lerret med visuell støy for å motstå OCR.
3. Det resulterende bildet (og det forventede svaret) returneres slik at den anropende applikasjonen kan presentere utfordringen og senere bekrefte svaret.

Fordi pakken er en ren bildegenerator, håndterer den ikke nettverksbygging eller øktadministrasjon alene. Den er ment å integreres i en større utfordringsflyt -- for eksempel som en av utfordringstypene som støttes av [Spam Blocker](./spam-blocker.md).
