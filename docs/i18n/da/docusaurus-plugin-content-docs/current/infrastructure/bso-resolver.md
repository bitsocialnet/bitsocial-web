---
title: BSO Resolver
description: Løs .bso-domænenavne til offentlige nøgler ved hjælp af ENS TXT-poster med indbygget caching og understøttelse på tværs af platforme.
sidebar_position: 1
---

# BSO Resolver

BSO-resolveren oversætter `.bso`-domænenavne til deres tilsvarende offentlige nøgler ved at læse Bitsocial TXT-poster gemt på ENS. Det giver en delt viem-klient, vedvarende caching og fungerer i både Node.js og browsermiljøer.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licens**: Kun GPL-2.0

## Installation

```bash
npm install @bitsocial/bso-resolver
```

## Oprettelse af en resolver

Instantiér resolveren ved at sende et konfigurationsobjekt til konstruktøren:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parameter  | Påkrævet | Beskrivelse                                  |
| ---------- | -------- | -------------------------------------------- |
| `key`      | Ja       | Identifikator for resolverforekomsten.       |
| `provider` | Ja       | Transportkonfiguration (se nedenfor).        |
| `dataPath` | Nej      | Katalog til SQLite-cachefilen (kun Node.js). |

### Udbyder muligheder

Parameteren `provider` accepterer tre formater:

- **`"viem"`** -- Bruger standard offentlig transport leveret af viem.
- **HTTP(S) URL** -- Opretter forbindelse via et JSON-RPC-slutpunkt (f.eks. `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** -- Opretter forbindelse via et WebSocket RPC-slutpunkt (f.eks. `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Metoder

### `resolve({ name, abortSignal? })`

Slår et `.bso` navn op og returnerer den tilknyttede offentlige nøgle. En valgfri `AbortSignal` kan videregives for at annullere langvarige anmodninger.

### `canResolve({ name })`

Returnerer en boolesk værdi, der angiver, om resolveren er i stand til at håndtere det givne navn. Brug dette til at kontrollere support, før du forsøger en fuld opløsning.

### `destroy()`

Nedbryder resolveren, lukker databaseforbindelser og frigiver ressourcer. Kald dette, når resolveren ikke længere er nødvendig.

## Caching

Løste navne cachelagres automatisk for at reducere redundante netværksopslag. Caching-backend er valgt baseret på runtime-miljøet:

| Miljø    | Backend         | Noter                                                        |
| -------- | --------------- | ------------------------------------------------------------ |
| Node.js  | SQLite          | Gemt på `dataPath`. Bruger WAL-tilstand til samtidig adgang. |
| Browser  | IndekseretDB    | Bruger native IndexedDB-transaktioner.                       |
| Fallback | In-memory `Map` | Bruges, når hverken SQLite eller IndexedDB er tilgængelig.   |

Alle cacheposter har en **en-times TTL** og bliver automatisk smidt ud efter udløb.

## Integration med pkc-js

Resolveren kan tilsluttes direkte til pkc-js gennem `nameResolvers`-indstillingen, hvilket muliggør gennemsigtig `.bso`-navneopløsning under nøgleopslag:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Samtidighed

Resolveren er designet til at være sikker under samtidig brug:

- En enkelt delt viem-klient undgår redundante forbindelser.
- SQLite fungerer i WAL-tilstand (Write-Ahead Logging), hvilket tillader samtidige læsninger uden blokering.
- Browsercaching er afhængig af native IndexedDB-transaktioner til isolering.

## Platformens indgangspunkter

Pakken sender separate indgangspunkter for Node.js og browser builds. Bundlere, der understøtter feltet `exports` i `package.json`, vil automatisk vælge den korrekte.
