---
title: EVM Contract Call Challenge
description: Sfida anti-spam che verifica le condizioni on-chain chiamando uno smart contract EVM.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Legacy Naming
Questo pacchetto è stato originariamente pubblicato nell'ambito `@plebbit`. È stato rinominato in `@bitsocial/evm-contract-challenge`. I riferimenti al vecchio nome potrebbero ancora apparire nella documentazione o nelle basi di codice precedenti.
:::

EVM Contract Call Challenge è un meccanismo anti-spam che verifica le condizioni on-chain prima di consentire una pubblicazione. Originariamente estratto da `plebbit-js` come pacchetto autonomo, consente ai proprietari della comunità di richiedere agli autori di soddisfare criteri definiti dallo smart contract, ad esempio il mantenimento di un saldo minimo di token, per poter pubblicare.

**Codice sorgente:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Requisiti

- **Node.js** >= 22
- **Solo ESM** -- questo pacchetto non fornisce build CommonJS.
- **Dipendenza peer runtime:** `@plebbit/plebbit-js` (migrazione a `@pkc/pkc-js`)

## Installazione

```bash
npm install @bitsocial/evm-contract-challenge
```

## Opzioni di configurazione

| Opzione       | Tipo       | Descrizione                                                                           |
| ------------- | ---------- | ------------------------------------------------------------------------------------- |
| `chainTicker` | `string`   | The chain to query (e.g., `eth`, `matic`, `avax`).                                    |
| `address`     | `string`   | The smart contract address to call.                                                   |
| `abi`         | `string`   | The ABI fragment for the function being called.                                       |
| `condition`   | `string`   | A comparison expression evaluated against the contract return value (e.g., `> 1000`). |
| `error`       | . `string` | . Il messaggio di errore mostrato agli autori che non soddisfano la condizione        |

## Esempio

Un proprietario di comunità che desidera limitare la pubblicazione agli autori che possiedono più di 1.000 token ERC-20 configurerebbe la sfida con:

- `chainTicker`: `"eth"`
- `address`: l'indirizzo del contratto del token
- `abi`: l'ABI per `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Quando un autore tenta di pubblicare, la sfida chiama `balanceOf` con l'indirizzo dell'autore e controlla se il valore restituito soddisfa la condizione If it in caso contrario, viene restituito il messaggio di errore configurato.

## Quando utilizzarlo

EVM Contract Call Challenge è ideale per:

- **Comunità protette da token** che limitano la pubblicazione ai titolari di token.
- **Accesso controllato da NFT** dove è richiesta la proprietà di un NFT specifico.
- **Spazi di governance DAO** in cui la partecipazione è limitata al token di governance. titolari.

Per le comunità che non si affidano all'identità on-chain, considerare invece [Blocco spam](./spam-blocker.md) o [Sfida dei buoni](./voucher-challenge.md).
