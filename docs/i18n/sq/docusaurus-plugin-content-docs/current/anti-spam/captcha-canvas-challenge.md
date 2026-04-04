---
title: Captcha Canvas Challenge
description: Gjenerator i pavarur captcha i bazuar në imazhe me karaktere, dimensione dhe ngjyra të konfigurueshme.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Emërtimi i trashëgimisë
Kjo paketë fillimisht u botua nën sferën `@plebbit`. Është riemërtuar në `@bitsocial/captcha-canvas-challenge`. Referencat për emrin e vjetër mund të shfaqen ende në dokumentacionin ose bazat e kodeve më të vjetra.
:::

Captcha Canvas Challenge është një gjenerator i pavarur kaptcha imazhesh i nxjerrë fillimisht nga `plebbit-js`. Ai jep tekst të rastësishëm në një kanavacë HTML dhe kthen imazhin që rezulton, të cilin komunitetet mund t'ua paraqesin autorëve si një sfidë e padëshiruar.

**Kodi burimor:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Kërkesat

- **Nyja.js** >= 22
- **Vetëm për ESM** -- kjo paketë nuk dërgon ndërtime CommonJS.
- **Varësia e bashkëmoshatarëve në kohën e ekzekutimit:** `@plebbit/plebbit-js` (duke migruar në `@pkc/pkc-js`)

## Instalimi

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Opsionet e konfigurimit

| Opsioni      | Lloji    | E parazgjedhur | Përshkrimi                                                           |
| ------------ | -------- | -------------- | -------------------------------------------------------------------- |
| `characters` | `number` | `6`            | Numri i karaktereve të rastësishme të paraqitura në imazhin captcha. |
| `height`     | `number` | `100`          | Lartësia e imazhit të krijuar në pixel.                              |
| `width`      | `number` | `300`          | Gjerësia e imazhit të krijuar në pixel.                              |
| `colors`     | `string` | `#32cf7e`      | Ngjyra kryesore e përdorur për tekstin captcha.                      |

## Si funksionon

1. Gjeneratori zgjedh një varg të rastësishëm të gjatësisë së konfiguruar.
2. Vargu është paraqitur në një kanavacë me zhurmë vizuale për t'i rezistuar OCR.
3. Imazhi që rezulton (dhe përgjigja e pritur) kthehen në mënyrë që aplikacioni thirrës të paraqesë sfidën dhe më vonë të verifikojë përgjigjen.

Për shkak se paketa është një gjenerues i pastër imazhi, ajo nuk trajton vetë rrjetëzimin ose menaxhimin e sesioneve. Ai synohet të integrohet në një rrjedhë sfidash më të madhe -- për shembull, si një nga llojet e sfidave të mbështetura nga [Spam Blocker](./spam-blocker.md).
