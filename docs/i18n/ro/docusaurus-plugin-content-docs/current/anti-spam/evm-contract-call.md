---
title: EVM Contract Call Challenge
description: Provocare anti-spam care verifică condițiile în lanț apelând un contract inteligent EVM.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Denumire moștenită
Acest pachet a fost publicat inițial în domeniul de aplicare `@plebbit`. A fost redenumit în `@bitsocial/evm-contract-challenge`. Referințele la vechiul nume pot apărea în continuare în documentația sau bazele de coduri mai vechi.
:::

EVM Contract Call Challenge este un mecanism anti-spam care verifică condițiile în lanț înainte de a permite o publicare. Extras inițial din `plebbit-js` ca pachet autonom, acesta permite proprietarilor de comunități să solicite autorilor să îndeplinească criterii definite de contracte inteligente -- de exemplu, să dețină un sold minim de simboluri -- pentru a posta.

**Cod sursă:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Cerințe

- **Node.js** >= 22
- **Numai ESM** -- acest pachet nu include versiuni CommonJS.
- **Dependență de peertime de execuție:** `@plebbit/plebbit-js` (migrează la `@pkc/pkc-js`)

## Instalare

```bash
npm install @bitsocial/evm-contract-challenge
```

## Opțiuni de configurare

| Opțiune       | Tip      | Descriere                                                                             |
| ------------- | -------- | ------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Lanțul de interogat (de ex. `matic`, `avax`).                                         |
| `address`     | `string` | The smart contract address to call.                                                   |
| `abi`         | `string` | The ABI fragment for the function being called.                                       |
| `condition`   | `string` | A comparison expression evaluated against the contract return value (e.g., `> 1000`). |
| `error`       | `string` | The error message shown to authors who do not meet the condition.                     |

## Exemplu

A community owner who wants to restrict posting to authors holding more than 1,000 of a particular ERC-20 token would configure the challenge with:

- `chainTicker`: `"eth"`
- `address`: the token contract adresa
- `abi`: ABI pentru `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Când un autor încearcă să publice, provocarea apelează `balanceOf` cu adresa autorului și verifică dacă valoarea returnată îndeplinește condiția, se configurează mesajul de eroare returnate.

## Când să-l utilizați

EVM Contract Call Challenge este ideală pentru:

- **comunități cu jetoane** care restricționează postarea la deținătorii de jetoane.
- **acces cu acces NFT** acolo unde este necesară deținerea unui anumit NFT.
- ** participarea limitată la guvernanța ken/>** deținători.

Pentru comunitățile care nu se bazează pe identitatea în lanț, luați în considerare [Spam Blocker](./spam-blocker.md) sau [Voucher Challenge](./voucher-challenge.md).
