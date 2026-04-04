---
title: EVM Contract Call Challenge
description: Anti-spam-utmaning som verifierar villkoren i kedjan genom att anropa ett EVM-smart kontrakt.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Äldre namngivning
Detta paket publicerades ursprungligen under `@plebbit`-omfånget. Den har bytt namn till `@bitsocial/evm-contract-challenge`. Referenser till det gamla namnet kan fortfarande förekomma i äldre dokumentation eller kodbaser.
:::

EVM Contract Call Challenge är en anti-spam-mekanism som verifierar villkoren i kedjan innan en publicering tillåts. Ursprungligen extraherad från `plebbit-js` som ett fristående paket, låter det gemenskapsägare kräva att författare uppfyller smarta kontraktsdefinierade kriterier - till exempel att ha ett minsta tokensaldo - för att kunna posta.

**Källkod:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Krav

- **Node.js** >= 22
- **Endast ESM** -- det här paketet skickar inte CommonJS-versioner.
- **Runtime peer-beroende:** `@plebbit/plebbit-js` (migrerar till `@pkc/pkc-js`)

## Installation

```bash
npm install @bitsocial/evm-contract-challenge
```

## Konfigurationsalternativ

| Alternativ    | Skriv    | Beskrivning                                                                   |
| ------------- | -------- | ----------------------------------------------------------------------------- |
| `chainTicker` | `string` | Kedjan som ska frågas (t.ex. `eth`, `matic`, `avax`).                         |
| `address`     | `string` | Den smarta kontraktsadressen att ringa.                                       |
| `abi`         | `string` | ABI-fragmentet för funktionen som anropas.                                    |
| `condition`   | `string` | Ett jämförelseuttryck utvärderat mot kontraktets returvärde (t.ex. `> 1000`). |
| `error`       | `string` | Felmeddelandet som visas för författare som inte uppfyller villkoret.         |

## Exempel

En gemenskapsägare som vill begränsa inlägg till författare som har mer än 1 000 av en viss ERC-20-token skulle konfigurera utmaningen med:

- `chainTicker`: `"eth"`
- `address`: tokenkontraktets adress
- `abi`: ABI för `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

När en författare försöker publicera anropar utmaningen `balanceOf` med författarens adress och kontrollerar om det returnerade värdet uppfyller villkoret. Om den gör det fortsätter publiceringen; annars returneras det konfigurerade felmeddelandet.

## När du ska använda den

EVM Contract Call Challenge är idealisk för:

- **Token-gated communities** som begränsar inlägg till tokeninnehavare.
- **NFT-gated access** där ägande av en specifik NFT krävs.
- **DAO-styrningsutrymmen** där deltagandet är begränsat till innehavare av styrningstoken.

För gemenskaper som inte förlitar sig på kedjans identitet, överväg [Spam Blocker](./spam-blocker.md) eller [Voucher Challenge](./voucher-challenge.md) istället.
