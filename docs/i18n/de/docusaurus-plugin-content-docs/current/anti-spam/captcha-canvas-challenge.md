---
title: Captcha Canvas Challenge
description: Eigenständiger bildbasierter Captcha-Generator mit konfigurierbaren Zeichen, Abmessungen und Farben.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Legacy-Benennung
Dieses Paket wurde ursprünglich unter dem Geltungsbereich `@plebbit` veröffentlicht. Es wurde in `@bitsocial/captcha-canvas-challenge` umbenannt. Verweise auf den alten Namen erscheinen möglicherweise noch in älterer Dokumentation oder Codebasis.
:::

Captcha Canvas Challenge ist ein eigenständiger Bild-Captcha-Generator, der ursprünglich aus `plebbit-js` extrahiert wurde. Es rendert zufälligen Text auf einer HTML-Leinwand und gibt das resultierende Bild zurück, das Communities den Autoren als Spam-Herausforderung präsentieren können.

**Quellcode:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Anforderungen

- **Node.js** >= 22
- **Nur ESM** – dieses Paket liefert keine CommonJS-Builds.
- **Laufzeit-Peer-Abhängigkeit:** `@plebbit/plebbit-js` (Migration nach `@pkc/pkc-js`)

## Installation

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Konfigurationsoptionen

| Option       | Geben Sie | ein Standard | Beschreibung                                               |
| ------------ | --------- | ------------ | ---------------------------------------------------------- |
| `characters` | `number`  | `6`          | Anzahl der im Captcha-Bild gerenderten zufälligen Zeichen. |
| `height`     | `number`  | `100`        | Höhe des generierten Bildes in Pixel.                      |
| `width`      | `number`  | `300`        | Breite des generierten Bildes in Pixel.                    |
| `colors`     | `string`  | `#32cf7e`    | Primärfarbe, die für den Captcha-Text verwendet wird.      |

## Wie es funktioniert

1. Der Generator wählt eine zufällige Zeichenfolge mit der konfigurierten Länge aus.
2. Die Zeichenfolge wird mit visuellem Rauschen auf eine Leinwand gerendert, um OCR zu verhindern.
3. Das resultierende Bild (und die erwartete Antwort) werden zurückgegeben, damit die aufrufende Anwendung die Herausforderung präsentieren und später die Antwort überprüfen kann.

Da es sich bei dem Paket um einen reinen Bildgenerator handelt, übernimmt es weder die Netzwerk- noch die Sitzungsverwaltung alleine. Es soll in einen größeren Challenge-Flow integriert werden – beispielsweise als einer der Challenge-Typen, die von [Spam Blocker](./spam-blocker.md) unterstützt werden.
