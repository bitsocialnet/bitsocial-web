---
title: BSO Resolver
description: Resolve .bso-domeinnamen naar openbare sleutels met behulp van ENS TXT-records, met ingebouwde caching en platformonafhankelijke ondersteuning.
sidebar_position: 1
---

# BSO Resolver

De BSO Resolver vertaalt `.bso`-domeinnamen naar hun overeenkomstige openbare sleutels door Bitsocial TXT-records te lezen die zijn opgeslagen op ENS. Het biedt een gedeelde viem-client, permanente caching en werkt in zowel Node.js- als browseromgevingen.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licentie**: alleen GPL-2.0

## Installatie

```bash
npm install @bitsocial/bso-resolver
```

## Een Resolver maken

Instantileer de oplosser door een configuratieobject door te geven aan de constructor:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parameter  | Vereist | Description                                         |
| ---------- | ------- | --------------------------------------------------- |
| `key`      | Yes     | Identifier for the resolver instance.               |
| `provider` | Yes     | Transport configuration (see below).                |
| `dataPath` | No      | Directory for the SQLite cache file (Node.js only). |

### Provider Opties

De parameter `provider` accepteert drie formaten:

- **`"viem"`** -- Gebruikt het standaard openbaar vervoer geleverd door viem.
- **HTTP(S) URL** -- Maakt verbinding via een JSON-RPC-eindpunt (bijv. `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket-URL** -- Maakt verbinding via een WebSocket RPC-eindpunt (bijvoorbeeld `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Methoden

### `resolve({ name, abortSignal? })`

Zoekt een `.bso`-naam op en retourneert de bijbehorende openbare sleutel om langlopende verzoeken te annuleren.

### `canResolve({ name })`

Retourneert een boolean die aangeeft of de oplosser de opgegeven naam kan verwerken. Gebruik dit om de ondersteuning te controleren voordat een volledige oplossing wordt geprobeerd.

### `destroy()`

Verbreekt de oplosser, sluit databaseverbindingen en geeft bronnen vrij wanneer de oplosser niet langer nodig is.

## Caching

Opgeloste namen worden automatisch in de cache opgeslagen om redundante netwerkzoekopdrachten te verminderen backend is chosen based on the runtime environment:

| Environment | Backend         | Notes                                                      |
| ----------- | --------------- | ---------------------------------------------------------- |
| Node.js     | SQLite          | Stored at `dataPath`. Uses WAL mode for concurrent access. |
| Browser     | IndexedDB       | Uses native IndexedDB transactions.                        |
| Fallback    | In-memory `Map` | . Wordt gebruikt als SQLite noch IndexedDB beschikbaar is  |

Alle cache-items hebben een **één-uur TTL** en worden na het verlopen automatisch verwijderd.

## Integratie met pkc-js

De oplosser kan rechtstreeks in pkc-js worden aangesloten via de optie `nameResolvers`, waardoor transparant wordt mogelijk gemaakt. `.bso` naamresolutie tijdens sleutelzoekopdrachten:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Gelijktijdigheid

De oplosser is ontworpen om veilig te zijn bij gelijktijdig gebruik:

- Een enkele gedeelde viem-client vermijdt redundante verbindingen.
- SQLite werkt in WAL-modus (Write-Ahead Logging), waardoor gelijktijdige leesbewerkingen mogelijk zijn zonder te blokkeren.
- Browsercaching is afhankelijk van op native IndexedDB-transacties voor isolatie.

## Platformingangspunten

Het pakket verzendt afzonderlijke ingangspunten voor Node.js en browserbuilds die het veld `exports` in `package.json` ondersteunen, zullen automatisch de juiste selecteren.
