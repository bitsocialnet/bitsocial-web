---
title: Wyzwanie na płótnie Captcha
description: Samodzielny generator captcha oparty na obrazach z konfigurowalnymi znakami, wymiarami i kolorami.
sidebar_position: 2
---

# Wyzwanie na płótnie Captcha

:::warning Legacy Naming
Ten pakiet został pierwotnie opublikowany w zakresie `@plebbit`. Jego nazwa została zmieniona na `@bitsocial/captcha-canvas-challenge`. Odniesienia do starej nazwy mogą nadal pojawiać się w starszej dokumentacji lub bazach kodów.
:::

Captcha Canvas Challenge to samodzielny generator captcha obrazu, pierwotnie wyodrębniony z `plebbit-js`. Renderuje losowy tekst na kanwie HTML i zwraca powstały obraz, który społeczności mogą przedstawić autorom jako wyzwanie spamowe.

**Kod źródłowy:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Wymagania

- **Node.js** >= 22
- **Tylko ESM** — ten pakiet nie zawiera kompilacji CommonJS.
- **Zależność równorzędna w czasie wykonywania:** `@plebbit/plebbit-js` (migracja do `@pkc/pkc-js`)

## Instalacja

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Opcje konfiguracji

| Opcja        | Wpisz    | Domyślne  | Opis                                                    |
| ------------ | -------- | --------- | ------------------------------------------------------- |
| `characters` | `number` | `6`       | Liczba losowych znaków renderowanych w obrazie captcha. |
| `height`     | `number` | `100`     | Wysokość wygenerowanego obrazu w pikselach.             |
| `width`      | `number` | `300`     | Szerokość wygenerowanego obrazu w pikselach.            |
| `colors`     | `string` | `#32cf7e` | Podstawowy kolor używany w tekście captcha.             |

## Jak to działa

1. Generator wybiera losowy ciąg o skonfigurowanej długości.
2. Ciąg jest renderowany na płótnie z szumem wizualnym odpornym na OCR.
3. Wynikowy obraz (i oczekiwana odpowiedź) są zwracane, aby aplikacja wywołująca mogła przedstawić wyzwanie i później zweryfikować odpowiedź.

Ponieważ pakiet jest czystym generatorem obrazów, nie obsługuje samodzielnie zarządzania siecią ani sesjami. Ma zostać zintegrowany z większym cyklem wyzwań — na przykład jako jeden z typów wyzwań obsługiwanych przez [Blokada spamu](./spam-blocker.md).
