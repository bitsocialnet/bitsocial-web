---
title: BSO-Resolver
description: Lösen Sie .bso-Domänennamen mithilfe von ENS-TXT-Einträgen in öffentliche Schlüssel auf, mit integriertem Caching und plattformübergreifender Unterstützung.
sidebar_position: 1
---

# BSO-Resolver

Der BSO-Resolver übersetzt `.bso`-Domänennamen in ihre entsprechenden öffentlichen Schlüssel, indem er auf ENS gespeicherte Bitsocial-TXT-Datensätze liest. Es bietet einen gemeinsam genutzten Viem-Client, dauerhaftes Caching und funktioniert sowohl in Node.js- als auch in Browserumgebungen.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Lizenz**: nur GPL-2.0

## Installation

```bash
npm install @bitsocial/bso-resolver
```

## Erstellen eines Resolvers

Instanziieren Sie den Resolver, indem Sie ein Konfigurationsobjekt an den Konstruktor übergeben:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parameter  | Erforderlich | Beschreibung                                          |
| ---------- | ------------ | ----------------------------------------------------- |
| `key`      | Ja           | Bezeichner für die Resolver-Instanz.                  |
| `provider` | Ja           | Transportkonfiguration (siehe unten).                 |
| `dataPath` | Nein         | Verzeichnis für die SQLite-Cache-Datei (nur Node.js). |

### Anbieteroptionen

Der Parameter `provider` akzeptiert drei Formate:

- **`"viem"`** – Verwendet den standardmäßigen öffentlichen Transport, der von viem bereitgestellt wird.
- **HTTP(S)-URL** – Stellt eine Verbindung über einen JSON-RPC-Endpunkt her (z. B. `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket-URL** – Stellt eine Verbindung über einen WebSocket-RPC-Endpunkt her (z. B. `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Methoden

### `resolve({ name, abortSignal? })`

Sucht nach einem `.bso`-Namen und gibt den zugehörigen öffentlichen Schlüssel zurück. Ein optionaler `AbortSignal` kann übergeben werden, um lang laufende Anforderungen abzubrechen.

### `canResolve({ name })`

Gibt einen booleschen Wert zurück, der angibt, ob der Resolver den angegebenen Namen verarbeiten kann. Verwenden Sie dies, um die Unterstützung zu prüfen, bevor Sie eine vollständige Lösung versuchen.

### `destroy()`

Zerstört den Resolver, schließt Datenbankverbindungen und gibt Ressourcen frei. Rufen Sie dies auf, wenn der Resolver nicht mehr benötigt wird.

## Caching

Aufgelöste Namen werden automatisch zwischengespeichert, um redundante Netzwerksuchen zu reduzieren. Das Caching-Backend wird basierend auf der Laufzeitumgebung ausgewählt:

| Umwelt   | Backend           | Notizen                                                                           |
| -------- | ----------------- | --------------------------------------------------------------------------------- |
| Node.js  | SQLite            | Gespeichert unter `dataPath`. Verwendet den WAL-Modus für gleichzeitigen Zugriff. |
| Browser  | IndexedDB         | Verwendet native IndexedDB-Transaktionen.                                         |
| Rückfall | Im Speicher `Map` | Wird verwendet, wenn weder SQLite noch IndexedDB verfügbar sind.                  |

Alle Cache-Einträge haben eine **einstündige TTL** und werden nach Ablauf automatisch entfernt.

## Integration mit pkc-js

Der Resolver kann über die Option `nameResolvers` direkt in pkc-js eingebunden werden, wodurch eine transparente `.bso`-Namensauflösung bei Schlüsselsuchen ermöglicht wird:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Parallelität

Der Resolver ist so konzipiert, dass er bei gleichzeitiger Verwendung sicher ist:

- Ein einzelner gemeinsam genutzter Viem-Client vermeidet redundante Verbindungen.
- SQLite arbeitet im WAL-Modus (Write-Ahead Logging) und ermöglicht gleichzeitige Lesevorgänge ohne Blockierung.
- Das Browser-Caching basiert zur Isolierung auf nativen IndexedDB-Transaktionen.

## Plattformeinstiegspunkte

Das Paket enthält separate Einstiegspunkte für Node.js und Browser-Builds. Bundler, die das Feld `exports` in `package.json` unterstützen, wählen automatisch das richtige Feld aus.
