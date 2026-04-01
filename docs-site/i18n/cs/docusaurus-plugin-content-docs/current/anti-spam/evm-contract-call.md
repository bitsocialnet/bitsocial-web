---
title: Výzva na smluvní volání EVM
description: Anti-spamová výzva, která ověřuje podmínky v řetězci voláním inteligentní smlouvy EVM.
sidebar_position: 4
---

# Výzva na smluvní volání EVM

:::warning Legacy Naming
Tento balíček byl původně publikován v rozsahu `@plebbit`. Byl přejmenován na `@bitsocial/evm-contract-challenge`. Odkazy na starý název se mohou stále objevovat ve starší dokumentaci nebo kódových základnách.
:::

EVM Contract Call Challenge je antispamový mechanismus, který před povolením zveřejnění ověřuje podmínky v řetězci. Původně byl extrahován ze `plebbit-js` jako samostatný balíček a umožňuje vlastníkům komunity vyžadovat, aby autoři splnili kritéria definovaná inteligentní smlouvou – například držení minimálního zůstatku tokenů – aby mohli zveřejňovat příspěvky.

**Zdrojový kód:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Požadavky

- **Node.js** >= 22
- **Pouze ESM** – tento balíček nedodává sestavení CommonJS.
- **Závislost na druhém běhovém prostředí:** `@plebbit/plebbit-js` (migrace na `@pkc/pkc-js`)

## Instalace

```bash
npm install @bitsocial/evm-contract-challenge
```

## Možnosti konfigurace

| Možnost       | Typ      | Popis                                                                          |
| ------------- | -------- | ------------------------------------------------------------------------------ |
| `chainTicker` | `string` | Řetězec, který se má dotazovat (např. `eth`, `matic`, `avax`).                 |
| `address`     | `string` | Adresa chytré smlouvy, na kterou chcete zavolat.                               |
| `abi`         | `string` | Fragment ABI pro volanou funkci.                                               |
| `condition`   | `string` | Porovnávací výraz vyhodnocený oproti vrácené hodnotě smlouvy (např. `> 1000`). |
| `error`       | `string` | Chybová zpráva zobrazená autorům, kteří nesplňují podmínku.                    |

## Příklad

Vlastník komunity, který chce omezit zveřejňování příspěvků na autory, kteří vlastní více než 1 000 konkrétního tokenu ERC-20, by výzvu nakonfiguroval takto:

- `chainTicker`: `"eth"`
- `address`: adresa smlouvy o tokenu
- `abi`: ABI pro `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Když se autor pokusí publikovat, výzva zavolá `balanceOf` s adresou autora a zkontroluje, zda vrácená hodnota splňuje podmínku. Pokud ano, publikace pokračuje; jinak se vrátí nakonfigurovaná chybová zpráva.

## Kdy ji použít

EVM Contract Call Challenge je ideální pro:

- **Komunity chráněné tokeny**, které omezují odesílání příspěvků na držitele tokenů.
- **Přístup s bránou NFT**, kde je vyžadováno vlastnictví konkrétního NFT.
- **Prostory řízení DAO**, kde je účast omezena na držitele tokenu řízení.

Pro komunity, které se nespoléhají na on-chain identitu, zvažte místo toho [Blokátor spamu](./spam-blocker.md) nebo [Voucherová výzva](./voucher-challenge.md).
