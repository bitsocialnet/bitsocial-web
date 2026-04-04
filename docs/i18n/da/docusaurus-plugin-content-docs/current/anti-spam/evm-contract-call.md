---
title: EVM Contract Call Challenge
description: Anti-spam-udfordring, der verificerer on-chain-forhold ved at kalde en EVM smart kontrakt.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Ældre navngivning
Denne pakke blev oprindeligt udgivet under `@plebbit`-omfanget. Det er blevet omdøbt til `@bitsocial/evm-contract-challenge`. Referencer til det gamle navn kan stadig forekomme i ældre dokumentation eller kodebaser.
:::

EVM Contract Call Challenge er en anti-spam-mekanisme, der verificerer on-chain-forhold, før en udgivelse tillades. Oprindeligt udvundet fra `plebbit-js` som en selvstændig pakke, lader det fællesskabsejere kræve, at forfattere opfylder smart-kontrakt-definerede kriterier - for eksempel at have en minimum token-saldo - for at kunne poste.

**Kildekode:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Krav

- **Node.js** >= 22
- **Kun ESM** -- denne pakke sender ikke CommonJS builds.
- **Runtime peer-afhængighed:** `@plebbit/plebbit-js` (migrerer til `@pkc/pkc-js`)

## Installation

```bash
npm install @bitsocial/evm-contract-challenge
```

## Konfigurationsmuligheder

| Mulighed      | Skriv    | Beskrivelse                                                                               |
| ------------- | -------- | ----------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Kæden, der skal forespørges (f.eks. `eth`, `matic`, `avax`).                              |
| `address`     | `string` | Den smarte kontraktadresse at ringe til.                                                  |
| `abi`         | `string` | ABI-fragmentet for den funktion, der kaldes.                                              |
| `condition`   | `string` | Et sammenligningsudtryk evalueret i forhold til kontraktens returværdi (f.eks. `> 1000`). |
| `error`       | `string` | Fejlmeddelelsen vist til forfattere, der ikke opfylder betingelsen.                       |

## Eksempel

En fællesskabsejer, der ønsker at begrænse opslag til forfattere, der har mere end 1.000 af et bestemt ERC-20-token, ville konfigurere udfordringen med:

- `chainTicker`: `"eth"`
- `address`: token-kontraktadressen
- `abi`: ABI for `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Når en forfatter forsøger at publicere, kalder udfordringen `balanceOf` med forfatterens adresse og tjekker, om den returnerede værdi opfylder betingelsen. Hvis det gør det, fortsætter udgivelsen; ellers returneres den konfigurerede fejlmeddelelse.

## Hvornår skal man bruge det

EVM Contract Call Challenge er ideel til:

- **Token-gated communities**, der begrænser udsendelse til token-indehavere.
- **NFT-gated adgang** hvor ejerskab af en specifik NFT er påkrævet.
- **DAO-styringsrum**, hvor deltagelse er begrænset til indehavere af governance-tokens.

For fællesskaber, der ikke er afhængige af on-chain-identitet, skal du overveje [Spam Blocker](./spam-blocker.md) eller [Voucher Challenge](./voucher-challenge.md) i stedet.
