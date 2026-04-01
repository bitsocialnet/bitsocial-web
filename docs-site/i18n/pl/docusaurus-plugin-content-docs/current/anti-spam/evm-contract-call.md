---
title: Wyzwanie wywołania kontraktu EVM
description: Wyzwanie antyspamowe, które weryfikuje warunki w łańcuchu poprzez wywołanie inteligentnego kontraktu EVM.
sidebar_position: 4
---

# Wyzwanie wywołania kontraktu EVM

:::warning Legacy Naming
Ten pakiet został pierwotnie opublikowany w zakresie `@plebbit`. Jego nazwa została zmieniona na `@bitsocial/evm-contract-challenge`. Odniesienia do starej nazwy mogą nadal pojawiać się w starszej dokumentacji lub bazach kodów.
:::

EVM Contract Call Challenge to mechanizm antyspamowy, który weryfikuje warunki w łańcuchu przed zezwoleniem na publikację. Oryginalnie wyodrębniony z `plebbit-js` jako samodzielny pakiet, pozwala właścicielom społeczności wymagać od autorów spełnienia kryteriów zdefiniowanych w inteligentnych kontraktach – na przykład posiadania minimalnego salda tokenów – aby móc publikować.

**Kod źródłowy:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Wymagania

- **Node.js** >= 22
- **Tylko ESM** — ten pakiet nie zawiera kompilacji CommonJS.
- **Zależność równorzędna w czasie wykonywania:** `@plebbit/plebbit-js` (migracja do `@pkc/pkc-js`)

## Instalacja

```bash
npm install @bitsocial/evm-contract-challenge
```

## Opcje konfiguracji

| Opcja         | Wpisz    | Opis                                                                                     |
| ------------- | -------- | ---------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Łańcuch do zapytania (np. `eth`, `matic`, `avax`).                                       |
| `address`     | `string` | Adres inteligentnej umowy, pod który należy zadzwonić.                                   |
| `abi`         | `string` | Fragment ABI wywoływanej funkcji.                                                        |
| `condition`   | `string` | Wyrażenie porównawcze oceniane na podstawie wartości zwracanej kontraktu (np. `> 1000`). |
| `error`       | `string` | Komunikat o błędzie wyświetlany autorom, którzy nie spełniają warunku.                   |

## Przykład

Właściciel społeczności, który chce ograniczyć publikowanie do autorów posiadających ponad 1000 tokenów ERC-20, mógłby skonfigurować wyzwanie w następujący sposób:

- `chainTicker`: `"eth"`
- `address`: adres kontraktu tokena
- `abi`: ABI dla `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Gdy autor próbuje opublikować, wyzwanie wywołuje `balanceOf` z adresem autora i sprawdza, czy zwrócona wartość spełnia warunek. Jeśli tak, publikacja będzie kontynuowana; w przeciwnym razie zwracany jest skonfigurowany komunikat o błędzie.

## Kiedy go używać

Wyzwanie wywołania kontraktu EVM jest idealne dla:

- **Społeczności z bramką tokenową**, które ograniczają publikowanie do posiadaczy tokenów.
- **Dostęp bramkowany NFT**, gdzie wymagane jest posiadanie określonego NFT.
- **Przestrzenie zarządzania DAO**, w których udział jest ograniczony do posiadaczy tokenów zarządzania.

W przypadku społeczności, które nie polegają na tożsamości w łańcuchu, zamiast tego rozważ opcję [Blokada spamu](./spam-blocker.md) lub [Wyzwanie kuponowe](./voucher-challenge.md).
