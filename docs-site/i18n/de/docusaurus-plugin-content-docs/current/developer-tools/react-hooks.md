---
title: Reagieren Sie auf Hooks
description: React-Hooks-Bibliothek zum Aufbau dezentraler sozialer Anwendungen auf dem Bitsocial-Protokoll.
sidebar_position: 1
---

# Reagieren Sie auf Hooks

:::warning Legacy Naming
Dieses Paket verwendet derzeit alte Namenskonventionen, die von seinem Upstream-Zweig übernommen wurden. Verweise auf „plebbit“ in Code, APIs und Konfiguration werden in einer zukünftigen Version zu „bitsocial“ migriert. Die Funktionalität bleibt davon unberührt.
:::

Das `bitsocial-react-hooks`-Paket bietet eine bekannte React-Hooks-API für die Interaktion mit dem Bitsocial-Protokoll. Es übernimmt das Abrufen von Feeds, Kommentaren und Autorenprofilen, das Verwalten von Konten, das Veröffentlichen von Inhalten und das Abonnieren von Communities – und das alles, ohne auf einen zentralen Server angewiesen zu sein.

Diese Bibliothek ist die primäre Schnittstelle, die von [5chan](/apps/5chan/) und anderen Bitsocial-Clientanwendungen verwendet wird.

:::note
`bitsocial-react-hooks` ist eine temporäre Abzweigung von `plebbit/plebbit-react-hooks`, die für die KI-gestützte Entwicklung gepflegt wird. Es wird direkt von GitHub genutzt und nicht auf npm veröffentlicht.
:::

## Installation

Da sich das Paket noch nicht auf npm befindet, installieren Sie es direkt von GitHub und pinnen Sie es an einen bestimmten Commit-Hash an:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Ersetzen Sie `<commit-hash>` durch den Commit, auf den Sie abzielen möchten.

## API-Übersicht

Die Haken sind in funktionale Kategorien unterteilt. Nachfolgend finden Sie eine Zusammenfassung der am häufigsten verwendeten Haken in jeder Kategorie. Vollständige Signaturen, Parameter und Rückgabetypen finden Sie in der [vollständigen API-Referenz auf GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Konten

Verwalten Sie lokale Benutzerkonten, Identitäten und Einstellungen.

- `useAccount(accountName?)` – gibt das aktive (oder benannte) Kontoobjekt zurück
- `useAccounts()` – gibt alle lokal gespeicherten Konten zurück
- `useAccountComments(options?)` – gibt vom aktiven Konto veröffentlichte Kommentare zurück

### Kommentare

Rufen Sie einzelne Kommentare und Threads ab und interagieren Sie mit ihnen.

- `useComment(commentCid?)` – ruft einen einzelnen Kommentar anhand seiner CID ab
- `useComments(commentCids?)` – ruft mehrere Kommentare im Stapel ab
- `useEditedComment(comment?)` – gibt die zuletzt bearbeitete Version eines Kommentars zurück

### Gemeinschaften

Rufen Sie Community-Metadaten und -Einstellungen ab.

- `useSubplebbit(subplebbitAddress?)` – ruft eine Community nach Adresse ab
- `useSubplebbits(subplebbitAddresses?)` – ruft mehrere Communities ab
- `useSubplebbitStats(subplebbitAddress?)` – gibt Abonnenten- und Beitragszahlen zurück

### Autoren

Suchen Sie nach Autorenprofilen und Metadaten.

- `useAuthor(authorAddress?)` – ruft ein Autorenprofil ab
- `useAuthorComments(options?)` – gibt Kommentare eines bestimmten Autors zurück
- `useResolvedAuthorAddress(authorAddress?)` – löst eine für Menschen lesbare Adresse (z. B. ENS) in ihre Protokolladresse auf

### Feeds

Abonnieren und paginieren Sie Content-Feeds.

- `useFeed(options?)` – gibt einen paginierten Feed mit Beiträgen aus einer oder mehreren Communities zurück
- `useBufferedFeeds(feedOptions?)` – puffert mehrere Feeds für schnelleres Rendern vor
- `useAuthorFeed(authorAddress?)` – gibt einen Feed mit Beiträgen eines bestimmten Autors zurück

### Aktionen

Veröffentlichen Sie Inhalte und führen Sie Schreibvorgänge durch.

- `usePublishComment(options?)` – einen neuen Kommentar oder eine neue Antwort veröffentlichen
- `usePublishVote(options?)` – Geben Sie eine positive oder negative Bewertung ab
- `useSubscribe(options?)` – Abonnieren oder Abmelden von einer Community

### Staaten und RPC

Überwachen Sie den Verbindungsstatus und interagieren Sie mit einem Remote-Bitsocial-Daemon.

- `useClientsStates(options?)` – gibt den Verbindungsstatus von IPFS/Pubsub-Clients zurück
- `usePlebbitRpcSettings()` – gibt die aktuelle RPC-Daemon-Konfiguration zurück

## Entwicklung

So arbeiten Sie lokal an der Hooks-Bibliothek:

**Voraussetzungen:** Node.js, Corepack aktiviert, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Informationen zu Test- und Build-Befehlen finden Sie in der README-Datei des Repositorys.

## Links

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Lizenz:** Nur GPL-2.0
