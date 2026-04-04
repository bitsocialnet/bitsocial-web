---
title: BSO Resolver
description: Risolvi i nomi di dominio .bso in chiavi pubbliche utilizzando i record ENS TXT, con memorizzazione nella cache integrata e supporto multipiattaforma.
sidebar_position: 1
---

# BSO Resolver

Il risolutore BSO traduce i nomi di dominio `.bso` nelle chiavi pubbliche corrispondenti leggendo i record TXT Bitsocial archiviati su ENS. Fornisce un client viem condiviso, memorizzazione nella cache persistente e funziona sia in ambienti Node.js che browser.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licenza**: solo GPL-2.0

## Installazione

```bash
npm install @bitsocial/bso-resolver
```

## Creazione di un risolutore

Istanzia il risolutore passando un oggetto di configurazione al costruttore:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parametro  | Obbligatorio | Descrizione                                         |
| ---------- | ------------ | --------------------------------------------------- |
| `key`      | Yes          | Identifier for the resolver instance.               |
| `provider` | Yes          | Transport configuration (see below).                |
| `dataPath` | No           | Directory for the SQLite cache file (Node.js only). |

### Provider Opzioni

Il parametro `provider` accetta tre formati:

- **`"viem"`** -- Utilizza il trasporto pubblico predefinito fornito da viem.
- **URL HTTP(S)** -- Si connette tramite un endpoint JSON-RPC (ad esempio, `https://mainnet.infura.io/v3/YOUR_KEY`).
- **URL WebSocket** -- Si connette tramite un endpoint RPC WebSocket (ad esempio, `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Metodi

### `resolve({ name, abortSignal? })`

Cerca un nome `.bso` e restituisce la chiave pubblica associata. È possibile passare un `AbortSignal` opzionale per annullare le richieste a lunga esecuzione.

### `canResolve({ name })`

Restituisce un valore booleano che indica se il risolutore è in grado di gestire il nome specificato. Utilizzalo per verificare il supporto prima di tentare una risoluzione completa.

### `destroy()`

Abbatte il risolutore, chiudendo le connessioni al database e liberando risorse. Chiamalo quando il risolutore non è più necessario.

## Memoria nella cache

I nomi risolti vengono memorizzati nella cache automaticamente per ridurre le ricerche di rete ridondanti. Il backend di memorizzazione nella cache viene scelto in base all'ambiente di runtime:

| Ambiente   | Backend          | Note                                                                        |
| ---------- | ---------------- | --------------------------------------------------------------------------- |
| Node.js    | SQLite           | Conservato a `dataPath`. Utilizza la modalità WAL per l'accesso simultaneo. |
| Navigatore | DB indicizzato   | Utilizza transazioni IndexedDB native.                                      |
| Ripiego    | In memoria `Map` | Utilizzato quando non sono disponibili né SQLite né IndexedDB.              |

Tutte le voci della cache hanno un **TTL di un'ora** e vengono automaticamente rimosse dopo la scadenza.

## Integrazione con pkc-js

Il risolutore può essere collegato direttamente a pkc-js tramite l'opzione `nameResolvers`, abilitando la risoluzione trasparente del nome `.bso` durante la chiave ricerche:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Concorrenza

Il risolutore è progettato per essere sicuro nell'uso simultaneo:

- Un singolo client viem condiviso evita connessioni ridondanti.
- SQLite opera in modalità WAL (Write-Ahead Logging), consentendo letture simultanee senza blocchi.
- La memorizzazione nella cache del browser si basa su transazioni native IndexedDB per isolamento.

## Punti di ingresso della piattaforma

Il pacchetto fornisce punti di ingresso separati per Node.js e build del browser. I bundler che supportano il campo `exports` in `package.json` selezioneranno automaticamente quello corretto.
