---
title: BSO Resolver
description: Resolve .bso domain names to public keys via Bitsocial TXT records, with built-in caching and cross-platform support.
sidebar_position: 1
---

# BSO Resolver

The BSO Resolver translates `.bso` domain names into their corresponding public keys by reading Bitsocial TXT records. It provides a shared viem client, persistent caching, and works in both Node.js and browser environments.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **License**: GPL-3.0-or-later

## Installation

```bash
npm install @bitsocial/bso-resolver
```

## Creating a Resolver

Instantiate the resolver by passing a configuration object to the constructor:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parameter  | Required | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| `key`      | Yes      | Identifier for the resolver instance.               |
| `provider` | Yes      | Transport configuration (see below).                |
| `dataPath` | No       | Directory for the SQLite cache file (Node.js only). |

### Provider Options

The `provider` parameter accepts three formats:

- **`"viem"`** -- Uses the default public transport provided by viem.
- **HTTP(S) URL** -- Connects through a JSON-RPC endpoint (e.g., `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** -- Connects through a WebSocket RPC endpoint (e.g., `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Methods

### `resolve({ name, abortSignal? })`

Looks up a `.bso` name and returns a result object containing the associated `publicKey` (plus any other parsed TXT-record fields), or `undefined` if the name does not resolve. An optional `AbortSignal` can be passed to cancel long-running requests.

### `canResolve({ name })`

Returns a boolean indicating whether the resolver is able to handle the given name. Use this to check support before attempting a full resolution.

### `destroy()`

Tears down the resolver, closing database connections and releasing resources. Call this when the resolver is no longer needed.

## Caching

Resolved names are cached automatically to reduce redundant network lookups. The caching backend is chosen based on the runtime environment:

| Environment | Backend         | Notes                                                      |
| ----------- | --------------- | ---------------------------------------------------------- |
| Node.js     | SQLite          | Stored at `dataPath`. Uses WAL mode for concurrent access. |
| Browser     | IndexedDB       | Uses native IndexedDB transactions.                        |
| Fallback    | In-memory `Map` | Used when neither SQLite nor IndexedDB is available.       |

All cache entries have a **one-hour TTL** and are automatically evicted after expiration.

## Integration with pkc-js

The resolver can be plugged directly into pkc-js through the `nameResolvers` option, enabling transparent `.bso` name resolution during key lookups. `pkc-js` exposes its entry as an async factory, not a constructor:

```js
import PKC from "@pkcprotocol/pkc-js";

const pkc = await PKC({
  nameResolvers: [resolver],
  // ...other options
});
```

## Concurrency

The resolver is designed to be safe under concurrent use:

- A single shared viem client avoids redundant connections.
- SQLite operates in WAL (Write-Ahead Logging) mode, allowing concurrent reads without blocking.
- Browser caching relies on native IndexedDB transactions for isolation.

## Platform Entry Points

The package ships separate entry points for Node.js and browser builds. Bundlers that support the `exports` field in `package.json` will automatically select the correct one.
