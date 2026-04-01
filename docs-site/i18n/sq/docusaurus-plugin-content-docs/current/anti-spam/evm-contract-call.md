---
title: Sfida e thirrjes së kontratës EVM
description: Sfida anti-spam që verifikon kushtet në zinxhir duke thirrur një kontratë inteligjente EVM.
sidebar_position: 4
---

# Sfida e thirrjes së kontratës EVM

:::warning Legacy Naming
Kjo paketë fillimisht u botua nën sferën `@plebbit`. Është riemërtuar në `@bitsocial/evm-contract-challenge`. Referencat për emrin e vjetër mund të shfaqen ende në dokumentacionin ose bazat e kodeve më të vjetra.
:::

EVM Contract Call Challenge është një mekanizëm anti-spam që verifikon kushtet në zinxhir përpara se të lejojë një publikim. E nxjerrë fillimisht nga `plebbit-js` si një paketë e pavarur, ajo u lejon pronarëve të komunitetit të kërkojnë që autorët të plotësojnë kriteret e përcaktuara nga kontrata inteligjente -- për shembull, të mbajnë një bilanc minimal simbolik -- në mënyrë që të postojnë.

**Kodi burimor:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Kërkesat

- **Nyja.js** >= 22
- **Vetëm për ESM** -- kjo paketë nuk dërgon ndërtime CommonJS.
- **Varësia e bashkëmoshatarëve në kohën e ekzekutimit:** `@plebbit/plebbit-js` (duke migruar në `@pkc/pkc-js`)

## Instalimi

```bash
npm install @bitsocial/evm-contract-challenge
```

## Opsionet e konfigurimit

| Opsioni       | Lloji    | Përshkrimi                                                                                    |
| ------------- | -------- | --------------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Zinxhiri për të kërkuar (p.sh., `eth`, `matic`, `avax`).                                      |
| `address`     | `string` | Adresa e kontratës inteligjente për të telefonuar.                                            |
| `abi`         | `string` | Fragmenti ABI për funksionin që thirret.                                                      |
| `condition`   | `string` | Një shprehje krahasimi e vlerësuar kundrejt vlerës së kthimit të kontratës (p.sh., `> 1000`). |
| `error`       | `string` | Mesazhi i gabimit u shfaqet autorëve që nuk e plotësojnë kushtin.                             |

## Shembull

Një pronar i komunitetit që dëshiron të kufizojë postimin tek autorët që mbajnë më shumë se 1000 të një tokeni të veçantë ERC-20, do ta konfiguronte sfidën me:

- `chainTicker`: `"eth"`
- `address`: adresa e kontratës simbolike
- `abi`: ABI për `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Kur një autor përpiqet të publikojë, sfida thërret `balanceOf` me adresën e autorit dhe kontrollon nëse vlera e kthyer e plotëson kushtin. Nëse ndodh, publikimi vazhdon; përndryshe, mesazhi i gabimit të konfiguruar kthehet.

## Kur ta përdorni

Sfida e thirrjes së kontratës EVM është ideale për:

- **Komunitetet e mbyllura me token ** që kufizojnë postimin tek mbajtësit e shenjave.
- **Qasje me porta NFT** ku kërkohet pronësia e një NFT specifike.
- **Hapësirat e qeverisjes DAO** ku pjesëmarrja është e kufizuar për mbajtësit e tokenave të qeverisjes.

Për komunitetet që nuk mbështeten në identitetin e zinxhirit, merrni në vend të tyre [Bllokues i spamit](./spam-blocker.md) ose [Sfida e kuponit](./voucher-challenge.md).
