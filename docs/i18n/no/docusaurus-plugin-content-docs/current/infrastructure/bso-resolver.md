---
title: BSO Resolver
description: Løs .bso-domenenavn til offentlige nøkler ved hjelp av ENS TXT-poster, med innebygd caching og støtte på tvers av plattformer.
sidebar_position: 1
---

# BSO Resolver

BSO Resolver oversetter `.bso` domenenavn til deres tilsvarende offentlige nøkler ved å lese Bitsocial TXT-poster lagret på ENS. Det gir en delt viem-klient, vedvarende caching og fungerer i både Node.js og nettlesermiljøer.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Lisens**: Kun GPL-2.0

## Installasjon

```bash
npm install @bitsocial/bso-resolver
```

## Opprette en resolver

Instantier resolveren ved å sende et konfigurasjonsobjekt til konstruktøren:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parameter  | Påkrevd | Beskrivelse                                   |
| ---------- | ------- | --------------------------------------------- |
| `key`      | Ja      | Identifikator for resolver-forekomsten.       |
| `provider` | Ja      | Transportkonfigurasjon (se nedenfor).         |
| `dataPath` | Nei     | Katalog for SQLite-bufferfilen (kun Node.js). |

### Leverandøralternativer

`provider`-parameteren godtar tre formater:

- **`"viem"`** -- Bruker standard offentlig transport levert av viem.
- **HTTP(S) URL** -- Kobler til via et JSON-RPC-endepunkt (f.eks. `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** -- Kobler til via et WebSocket RPC-endepunkt (f.eks. `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Metoder

### `resolve({ name, abortSignal? })`

Slår opp et `.bso`-navn og returnerer den tilhørende offentlige nøkkelen. En valgfri `AbortSignal` kan sendes for å kansellere langvarige forespørsler.

### `canResolve({ name })`

Returnerer en boolsk verdi som indikerer om resolveren er i stand til å håndtere det gitte navnet. Bruk denne for å sjekke støtten før du prøver en full oppløsning.

### `destroy()`

river ned resolveren, stenger databaseforbindelser og frigjør ressurser. Kall dette når resolveren ikke lenger er nødvendig.

## Buffer

Løste navn bufres automatisk for å redusere redundante nettverksoppslag. Buffer-backend er valgt basert på kjøretidsmiljøet:

| Miljø       | Backend        | Merknader                                                    |
| ----------- | -------------- | ------------------------------------------------------------ |
| Node.js     | SQLite         | Lagret på `dataPath`. Bruker WAL-modus for samtidig tilgang. |
| Nettleser   | IndeksertDB    | Bruker native IndexedDB-transaksjoner.                       |
| Tilbakeslag | I minnet `Map` | Brukes når verken SQLite eller IndexedDB er tilgjengelig.    |

Alle cache-oppføringer har en **en-times TTL** og blir automatisk kastet ut etter utløp.

## Integrasjon med pkc-js

Resolveren kan kobles direkte til pkc-js gjennom alternativet `nameResolvers`, noe som muliggjør transparent `.bso` navneoppløsning under nøkkeloppslag:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Samtidighet

Resolveren er designet for å være sikker ved samtidig bruk:

- En enkelt delt viem-klient unngår redundante tilkoblinger.
- SQLite opererer i WAL (Write-Ahead Logging)-modus, og tillater samtidig lesing uten blokkering.
- Nettleserbufring er avhengig av native IndexedDB-transaksjoner for isolasjon.

## Plattforminngangspunkter

Pakken sender separate inngangspunkter for Node.js og nettleserbygg. Forhandlere som støtter `exports`-feltet i `package.json` vil automatisk velge den riktige.
