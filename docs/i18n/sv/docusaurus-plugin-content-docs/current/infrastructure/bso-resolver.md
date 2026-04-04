---
title: BSO Resolver
description: Lös .bso-domännamn till publika nycklar med hjälp av ENS TXT-poster, med inbyggd cachning och plattformsoberoende stöd.
sidebar_position: 1
---

# BSO Resolver

BSO Resolver översätter `.bso`-domännamn till deras motsvarande publika nycklar genom att läsa Bitsocial TXT-poster lagrade på ENS. Den tillhandahåller en delad viem-klient, beständig cachning och fungerar i både Node.js och webbläsarmiljöer.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licens**: Endast GPL-2.0

## Installation

```bash
npm install @bitsocial/bso-resolver
```

## Skapa en resolver

Instantiera resolvern genom att skicka ett konfigurationsobjekt till konstruktorn:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parameter  | Krävs | Beskrivning                                     |
| ---------- | ----- | ----------------------------------------------- |
| `key`      | Ja    | Identifierare för resolver-instansen.           |
| `provider` | Ja    | Transportkonfiguration (se nedan).              |
| `dataPath` | Nej   | Katalog för SQLite-cachefilen (endast Node.js). |

### Leverantörsalternativ

Parametern `provider` accepterar tre format:

- **`"viem"`** -- Använder standard kollektivtrafik som tillhandahålls av viem.
- **HTTP(S) URL** -- Ansluter via en JSON-RPC-slutpunkt (t.ex. `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** -- Ansluter via en WebSocket RPC-slutpunkt (t.ex. `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Metoder

### `resolve({ name, abortSignal? })`

Slår upp ett `.bso`-namn och returnerar den tillhörande publika nyckeln. En valfri `AbortSignal` kan skickas för att avbryta långvariga förfrågningar.

### `canResolve({ name })`

Returnerar en boolean som indikerar om resolvern kan hantera det angivna namnet. Använd detta för att kontrollera support innan du försöker en full upplösning.

### `destroy()`

Rivrar resolvern, stänger databasanslutningar och frigör resurser. Ring detta när resolvern inte längre behövs.

## Cachning

Lösta namn cachelagras automatiskt för att minska redundanta nätverkssökningar. Backend för cachning väljs baserat på runtime-miljön:

| Miljö      | Backend        | Anteckningar                                                  |
| ---------- | -------------- | ------------------------------------------------------------- |
| Node.js    | SQLite         | Lagrat på `dataPath`. Använder WAL-läge för samtidig åtkomst. |
| Webbläsare | IndexeradDB    | Använder inbyggda IndexedDB-transaktioner.                    |
| Fallback   | I minnet `Map` | Används när varken SQLite eller IndexedDB är tillgängliga.    |

Alla cacheposter har en **en timmes TTL** och vräkas automatiskt efter utgången.

## Integration med pkc-js

Resolvern kan anslutas direkt till pkc-js genom alternativet `nameResolvers`, vilket möjliggör transparent `.bso` namnupplösning under nyckelsökningar:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Samtidighet

Resolvern är designad för att vara säker vid samtidig användning:

- En enda delad viem-klient undviker redundanta anslutningar.
- SQLite fungerar i WAL-läge (Write-Ahead Logging), vilket tillåter samtidiga läsningar utan att blockera.
- Webbläsarcache förlitar sig på inbyggda IndexedDB-transaktioner för isolering.

## Ingångspunkter för plattformar

Paketet levererar separata ingångspunkter för Node.js och webbläsarbyggen. Samlare som stöder fältet `exports` i `package.json` kommer automatiskt att välja rätt.
