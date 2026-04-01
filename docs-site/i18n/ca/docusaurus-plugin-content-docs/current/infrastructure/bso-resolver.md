---
title: Resolvedor BSO
description: Resol els noms de domini .bso a claus públiques mitjançant registres ENS TXT, amb memòria cau integrada i suport multiplataforma.
sidebar_position: 1
---

# Resolvedor BSO

El BSO Resolver tradueix els noms de domini `.bso` a les seves claus públiques corresponents llegint els registres TXT de Bitsocial emmagatzemats a ENS. Proporciona un client Viem compartit, memòria cau persistent i funciona tant en entorns Node.js com en navegador.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Llicència**: només GPL-2.0

## Instal·lació

```bash
npm install @bitsocial/bso-resolver
```

## Creació d'un resolutor

Instanciï el resolutor passant un objecte de configuració al constructor:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Paràmetre  | Obligatori | Descripció                                                     |
| ---------- | ---------- | -------------------------------------------------------------- |
| `key`      | Sí         | Identificador de la instància de resolució.                    |
| `provider` | Sí         | Configuració del transport (vegeu més avall).                  |
| `dataPath` | No         | Directori per al fitxer de memòria cau SQLite (només Node.js). |

### Opcions del proveïdor

El paràmetre `provider` accepta tres formats:

- **`"viem"`** -- Utilitza el transport públic predeterminat proporcionat per viem.
- **URL HTTP(S)**: es connecta mitjançant un punt final JSON-RPC (p. ex., `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL**: es connecta mitjançant un punt final de WebSocket RPC (p. ex., `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Mètodes

### `resolve({ name, abortSignal? })`

Busca un nom `.bso` i retorna la clau pública associada. Es pot passar un `AbortSignal` opcional per cancel·lar les sol·licituds de llarga durada.

### `canResolve({ name })`

Retorna un booleà que indica si el resolutor és capaç de gestionar el nom donat. Utilitzeu-ho per comprovar el suport abans d'intentar una resolució completa.

### `destroy()`

Destrueix el resolutor, tanca les connexions de la base de dades i allibera recursos. Truqueu-ho quan el resolutor ja no sigui necessari.

## Emmagatzematge a la memòria cau

Els noms resolts s'emmagatzemen a la memòria cau automàticament per reduir les cerques de xarxa redundants. El backend de la memòria cau es tria en funció de l'entorn d'execució:

| Medi ambient | Backend                | Notes                                                                     |
| ------------ | ---------------------- | ------------------------------------------------------------------------- |
| Node.js      | SQLite                 | Emmagatzemat a `dataPath`. Utilitza el mode WAL per a l'accés simultània. |
| Navegador    | Base de dades indexada | Utilitza transaccions natives IndexedDB.                                  |
| Fallback     | A la memòria `Map`     | S'utilitza quan ni SQLite ni IndexedDB estan disponibles.                 |

Totes les entrades de memòria cau tenen un **TTL d'una hora** i es desallotgen automàticament després de caducar.

## Integració amb pkc-js

El resolutor es pot connectar directament a pkc-js mitjançant l'opció `nameResolvers`, permetent la resolució de nom transparent `.bso` durant les cerques de clau:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Concurrència

El resolutor està dissenyat per ser segur en ús simultània:

- Un sol client Viem compartit evita connexions redundants.
- SQLite funciona en mode WAL (Registre d'escriptura anticipada), permetent lectures concurrents sense bloquejar.
- La memòria cau del navegador es basa en transaccions natives IndexedDB per aïllar-les.

## Punts d'entrada a la plataforma

El paquet inclou punts d'entrada separats per a Node.js i compilacions del navegador. Els agrupadors que admeten el camp `exports` de `package.json` seleccionaran automàticament el correcte.
