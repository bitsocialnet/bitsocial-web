---
title: Captcha Canvas Challenge
description: Önálló képalapú captcha generátor konfigurálható karakterekkel, méretekkel és színekkel.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Legacy Naming
Ezt a csomagot eredetileg a `@plebbit` hatókörben tették közzé. Átnevezték a következőre: `@bitsocial/captcha-canvas-challenge`. A régi névre való hivatkozások továbbra is megjelenhetnek a régebbi dokumentációkban vagy kódbázisokban.
:::

A Captcha Canvas Challenge egy önálló kép-captcha-generátor, amelyet eredetileg a `plebbit-js`-ból kinyertek. Véletlenszerű szöveget jelenít meg egy HTML vászonra, és visszaadja az eredményül kapott képet, amelyet a közösségek spam kihívásként terjeszthetnek a szerzők elé.

**Forráskód:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Követelmények

- **Node.js** >= 22
- **Csak ESM** – ez a csomag nem szállít CommonJS buildeket.
- **Futásidejű társfüggőség:** `@plebbit/plebbit-js` (áttérés a `@pkc/pkc-js`-ra)

## Telepítés

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Konfigurációs lehetőségek

| Opció        | Típus    | Alapértelmezett | Leírás                                                        |
| ------------ | -------- | --------------- | ------------------------------------------------------------- |
| `characters` | `number` | `6`             | A captcha képen megjelenített véletlenszerű karakterek száma. |
| `height`     | `number` | `100`           | Az előállított kép magassága pixelben.                        |
| `width`      | `number` | `300`           | A generált kép szélessége pixelben.                           |
| `colors`     | `string` | `#32cf7e`       | A captcha szöveghez használt elsődleges szín.                 |

## Hogyan működik

1. A generátor véletlenszerűen választ ki egy konfigurált hosszúságú karakterláncot.
2. A karakterlánc egy vászonra kerül megjelenítésre vizuális zajjal, hogy ellenálljon az OCR-nek.
3. Az eredményül kapott kép (és a várt válasz) visszaküldésre kerül, így a hívó alkalmazás bemutathatja a kihívást, és később ellenőrizheti a választ.

Mivel a csomag egy tiszta képgenerátor, nem kezeli önmagában a hálózatkezelést vagy a munkamenet-kezelést. Úgy tervezték, hogy egy nagyobb kihívásfolyamba integrálódjon – például a [Spam Blocker](./spam-blocker.md) által támogatott kihívások egyikeként.
