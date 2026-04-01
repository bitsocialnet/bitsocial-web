---
title: EVM Contract Call Challenge
description: Anti-spam kihívás, amely EVM intelligens szerződés lehívásával ellenőrzi a láncon belüli feltételeket.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Legacy Naming
Ezt a csomagot eredetileg a `@plebbit` hatókörben tették közzé. Átnevezték a következőre: `@bitsocial/evm-contract-challenge`. A régi névre való hivatkozások továbbra is megjelenhetnek a régebbi dokumentációkban vagy kódbázisokban.
:::

Az EVM Contract Call Challenge egy spamellenes mechanizmus, amely a közzététel engedélyezése előtt ellenőrzi a láncon belüli feltételeket. Eredetileg a `plebbit-js`-ból különálló csomagként kinyerték, lehetővé teszi a közösségtulajdonosok számára, hogy a közzétételhez megköveteljék a szerzőktől az intelligens szerződésben meghatározott kritériumok teljesítését – például minimális tokenegyenleg birtoklását.

**Forráskód:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Követelmények

- **Node.js** >= 22
- **Csak ESM** – ez a csomag nem szállít CommonJS buildeket.
- **Futásidejű társfüggőség:** `@plebbit/plebbit-js` (áttérés a `@pkc/pkc-js`-ra)

## Telepítés

```bash
npm install @bitsocial/evm-contract-challenge
```

## Konfigurációs lehetőségek

| Opció         | Típus    | Leírás                                                                               |
| ------------- | -------- | ------------------------------------------------------------------------------------ |
| `chainTicker` | `string` | A lekérdezendő lánc (pl. `eth`, `matic`, `avax`).                                    |
| `address`     | `string` | A hívható intelligens szerződés címe.                                                |
| `abi`         | `string` | A hívott függvény ABI-töredéke.                                                      |
| `condition`   | `string` | Összehasonlítási kifejezés a szerződés visszatérési értékéhez képest (pl. `> 1000`). |
| `error`       | `string` | A hibaüzenet azoknak a szerzőknek jelenik meg, akik nem felelnek meg a feltételnek.  |

## Példa

A community owner who wants to restrict posting to authors holding more than 1,000 of a particular ERC-20 token would configure the challenge with:

- `chainTicker`: `"eth"`
- `address`: a jogkivonat-szerződés címe
- `abi`: ABI a `balanceOf(address)` számára
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Amikor egy szerző megpróbálja közzétenni, a kihívás meghívja a `balanceOf`-t a szerző címével, és ellenőrzi, hogy a visszaadott érték megfelel-e a feltételnek. Ha igen, a közzététel folytatódik; ellenkező esetben a konfigurált hibaüzenet jelenik meg.

## Mikor kell használni

Az EVM Contract Call Challenge ideális:

- **Token-kapus közösségek**, amelyek a bejegyzést a token-tulajdonosokra korlátozzák.
- **NFT-kapu hozzáférés**, ahol egy adott NFT tulajdonjogára van szükség.
- **DAO irányítási terek**, ahol a részvétel az irányítási token-tulajdonosokra korlátozódik.

Azon közösségek esetében, amelyek nem támaszkodnak a láncon belüli identitásra, fontolja meg helyette a [Spam Blocker](./spam-blocker.md) vagy az [Utalványkihívás](./voucher-challenge.md) szolgáltatást.
