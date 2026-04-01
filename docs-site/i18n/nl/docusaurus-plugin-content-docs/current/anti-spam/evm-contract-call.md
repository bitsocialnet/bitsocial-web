---
title: EVM Contract Call Challenge
description: Antispam-uitdaging die de omstandigheden in de keten verifieert door een EVM smart contract aan te roepen.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Legacy Naming
Dit pakket is oorspronkelijk gepubliceerd onder het bereik `@plebbit`. De naam is gewijzigd in `@bitsocial/evm-contract-challenge`. Verwijzingen naar de oude naam kunnen nog steeds voorkomen in oudere documentatie of codebases.
:::

EVM Contract Call Challenge is een antispammechanisme dat de omstandigheden in de keten verifieert voordat een publicatie wordt toegestaan. Oorspronkelijk geëxtraheerd uit `plebbit-js` als een op zichzelf staand pakket, kunnen community-eigenaren eisen dat auteurs voldoen aan door smart-contract gedefinieerde criteria (bijvoorbeeld een minimaal token-saldo aanhouden) om te kunnen posten.

**Broncode:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Vereisten

- **Node.js** >= 22
- **Alleen ESM** -- dit pakket verzendt geen CommonJS-builds.
- **Runtime peer-afhankelijkheid:** `@plebbit/plebbit-js` (migreert naar `@pkc/pkc-js`)

## Installatie

```bash
npm install @bitsocial/evm-contract-challenge
```

## Configuratieopties

| Optie         | Type       | Beschrijving                                                                           |
| ------------- | ---------- | -------------------------------------------------------------------------------------- |
| `chainTicker` | `string`   | The chain to query (e.g., `eth`, `matic`, `avax`).                                     |
| `address`     | `string`   | The smart contract address to call.                                                    |
| `abi`         | `string`   | The ABI fragment for the function being called.                                        |
| `condition`   | `string`   | A comparison expression evaluated against the contract return value (e.g., `> 1000`).  |
| `error`       | . `string` | . Het foutbericht dat wordt weergegeven aan auteurs die niet aan de voorwaarde voldoen |

## Voorbeeld

Een community-eigenaar die het posten wil beperken tot auteurs die meer dan 1.000 van een bepaald ERC-20-token bezitten, zou de uitdaging configureren met:

- `chainTicker`: `"eth"`
- `address`: het tokencontractadres
- `abi`: de ABI voor `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Wanneer een auteur probeert te publiceren, roept de uitdaging `balanceOf` aan met het adres van de auteur en wordt gecontroleerd of de geretourneerde waarde voldoet aan de Als dit het geval is, gaat de publicatie verder; anders wordt het geconfigureerde foutbericht geretourneerd.

## Wanneer moet u het gebruiken

EVM Contract Call Challenge is ideaal voor:

- **Token-gated communities** die het posten beperken tot tokenhouders.
- **NFT-gated toegang** waarbij eigendom van een specifieke NFT vereist is.
- **DAO-beheerruimten** waar deelname beperkt is. aan houders van governance-tokens.

Voor community's die niet afhankelijk zijn van identiteit in de keten, kunt u in plaats daarvan [Spam blokkeren](./spam-blocker.md) of [Voucher-uitdaging](./voucher-challenge.md) overwegen.
