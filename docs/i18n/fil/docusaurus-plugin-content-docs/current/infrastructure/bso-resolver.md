---
title: BSO Resolver
description: Lutasin ang .bso domain name sa mga pampublikong key gamit ang ENS TXT record, na may built-in na caching at cross-platform na suporta.
sidebar_position: 1
---

# BSO Resolver

Isinasalin ng BSO Resolver ang `.bso` domain name sa kanilang kaukulang mga pampublikong key sa pamamagitan ng pagbabasa ng mga tala ng Bitsocial TXT na nakaimbak sa ENS. Nagbibigay ito ng shared viem client, patuloy na pag-cache, at gumagana sa parehong Node.js at mga kapaligiran ng browser.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Lisensya**: GPL-2.0-lamang

## Pag-install

```bash
npm install @bitsocial/bso-resolver
```

## Paglikha ng isang Resolver

I-instantiate ang resolver sa pamamagitan ng pagpasa ng configuration object sa constructor:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parameter  | Kinakailangan | Paglalarawan                                         |
| ---------- | ------------- | ---------------------------------------------------- |
| `key`      | Oo            | Identifier para sa instance ng solver.               |
| `provider` | Oo            | Configuration ng transportasyon (tingnan sa ibaba).  |
| `dataPath` | Hindi         | Direktoryo para sa SQLite cache file (Node.js lang). |

### Mga Opsyon sa Provider

Ang parameter na `provider` ay tumatanggap ng tatlong format:

- **`"viem"`** -- Gumagamit ng default na pampublikong sasakyang ibinibigay ng viem.
- **HTTP(S) URL** -- Kumokonekta sa pamamagitan ng JSON-RPC endpoint (hal., `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** -- Kumokonekta sa pamamagitan ng WebSocket RPC endpoint (hal., `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Pamamaraan

### `resolve({ name, abortSignal? })`

Naghahanap ng pangalan ng `.bso` at ibinabalik ang nauugnay na pampublikong key. Maaaring ipasa ang isang opsyonal na `AbortSignal` upang kanselahin ang mga matagal nang kahilingan.

### `canResolve({ name })`

Nagbabalik ng boolean na nagsasaad kung kaya ng solver na pangasiwaan ang ibinigay na pangalan. Gamitin ito upang suriin ang suporta bago subukan ang isang buong resolusyon.

### `destroy()`

Pinihit ang solver, pagsasara ng mga koneksyon sa database at pagpapalabas ng mga mapagkukunan. Tawagan ito kapag hindi na kailangan ang solver.

## Pag-cache

Awtomatikong naka-cache ang mga nalutas na pangalan upang mabawasan ang mga paulit-ulit na paghahanap sa network. Ang caching backend ay pinili batay sa runtime environment:

| Kapaligiran | Backend               | Mga Tala                                                                           |
| ----------- | --------------------- | ---------------------------------------------------------------------------------- |
| Node.js     | SQLite                | Naka-imbak sa `dataPath`. Gumagamit ng WAL mode para sa sabay-sabay na pag-access. |
| Browser     | IndexedDB             | Gumagamit ng mga katutubong transaksyon ng IndexedDB.                              |
| Fallback    | Nasa memorya na `Map` | Ginagamit kapag hindi available ang SQLite o IndexedDB.                            |

Ang lahat ng mga entry sa cache ay may **isang oras na TTL** at awtomatikong pinaalis pagkatapos mag-expire.

## Pagsasama sa pkc-js

Maaaring direktang isaksak ang solver sa pkc-js sa pamamagitan ng opsyong `nameResolvers`, na nagpapagana ng transparent na `.bso` na resolution ng pangalan sa panahon ng mga key lookup:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Concurrency

Ang solver ay idinisenyo upang maging ligtas sa ilalim ng sabay-sabay na paggamit:

- Ang isang nakabahaging kliyente ng viem ay umiiwas sa mga paulit-ulit na koneksyon.
- Gumagana ang SQLite sa mode na WAL (Write-Ahead Logging), na nagpapahintulot sa mga sabay-sabay na pagbabasa nang hindi nakaharang.
- Ang pag-cache ng browser ay umaasa sa mga katutubong transaksyon ng IndexedDB para sa paghihiwalay.

## Mga Puntos sa Pagpasok sa Platform

Nagpapadala ang package ng magkakahiwalay na entry point para sa Node.js at mga build ng browser. Ang mga bundler na sumusuporta sa field na `exports` sa `package.json` ay awtomatikong pipili ng tama.
