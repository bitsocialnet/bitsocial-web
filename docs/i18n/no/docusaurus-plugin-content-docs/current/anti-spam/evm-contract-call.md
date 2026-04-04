---
title: EVM Contract Call Challenge
description: Anti-spam-utfordring som verifiserer forhold i kjeden ved å ringe en EVM-smartkontrakt.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Legacy navngivning
Denne pakken ble opprinnelig publisert under `@plebbit`-omfanget. Den har fått nytt navn til `@bitsocial/evm-contract-challenge`. Referanser til det gamle navnet kan fortsatt forekomme i eldre dokumentasjon eller kodebaser.
:::

EVM Contract Call Challenge er en anti-spam-mekanisme som verifiserer kjedeforhold før en publisering tillates. Opprinnelig hentet fra `plebbit-js` som en frittstående pakke, lar den fellesskapseiere kreve at forfattere oppfyller smartkontrakt-definerte kriterier – for eksempel å ha en minimum token-saldo – for å kunne poste.

**Kildekode:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Krav

- **Node.js** >= 22
- **Kun ESM** -- denne pakken sender ikke CommonJS-bygg.
- **Runtime peer-avhengighet:** `@plebbit/plebbit-js` (migrerer til `@pkc/pkc-js`)

## Installasjon

```bash
npm install @bitsocial/evm-contract-challenge
```

## Konfigurasjonsalternativer

| Alternativ    | Skriv inn | Beskrivelse                                                                     |
| ------------- | --------- | ------------------------------------------------------------------------------- |
| `chainTicker` | `string`  | Kjeden som skal forespørres (f.eks. `eth`, `matic`, `avax`).                    |
| `address`     | `string`  | Den smarte kontraktsadressen å ringe.                                           |
| `abi`         | `string`  | ABI-fragmentet for funksjonen som kalles.                                       |
| `condition`   | `string`  | Et sammenligningsuttrykk evaluert mot kontraktens returverdi (f.eks. `> 1000`). |
| `error`       | `string`  | Feilmeldingen vises til forfattere som ikke oppfyller betingelsen.              |

## Eksempel

En fellesskapseier som ønsker å begrense innlegg til forfattere som har mer enn 1000 av et bestemt ERC-20-token, vil konfigurere utfordringen med:

- `chainTicker`: `"eth"`
- `address`: tokenkontraktsadressen
- `abi`: ABI for `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Når en forfatter prøver å publisere, kaller utfordringen `balanceOf` med forfatterens adresse og sjekker om den returnerte verdien tilfredsstiller betingelsen. Hvis den gjør det, fortsetter publiseringen; ellers returneres den konfigurerte feilmeldingen.

## Når du skal bruke den

EVM Contract Call Challenge er ideell for:

- **Token-gatede fellesskap** som begrenser publisering til token-innehavere.
- **NFT-gated tilgang** der eierskap av en spesifikk NFT kreves.
- **DAO-styringsrom** der deltakelse er begrenset til innehavere av styringstokener.

For fellesskap som ikke er avhengig av kjedeidentitet, bør du vurdere [Spam Blocker](./spam-blocker.md) eller [Voucher Challenge](./voucher-challenge.md) i stedet.
