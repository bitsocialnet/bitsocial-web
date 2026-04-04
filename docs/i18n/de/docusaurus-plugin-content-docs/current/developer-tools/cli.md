---
title: CLI
description: Befehlszeilenschnittstelle zum Ausführen eines Bitsocial-Knotens, zum Erstellen von Communities und zum Verwalten von Protokollvorgängen.
sidebar_position: 2
---

# CLI

:::warning Legacy-Benennung
Dieses Paket verwendet derzeit alte Namenskonventionen, die von seiner Upstream-Abhängigkeit übernommen wurden. Verweise auf „plebbit“ in Befehlen, Ausgabe und Konfiguration werden in einer zukünftigen Version auf „bitsocial“ migriert. Die Funktionalität bleibt davon unberührt.
:::

Das `bitsocial-cli` ist ein Befehlszeilentool für die Interaktion mit dem Bitsocial-Protokoll-Backend. Sie können damit einen lokalen P2P-Daemon ausführen, Communities erstellen und konfigurieren und Inhalte veröffentlichen – alles vom Terminal aus.

Es baut auf `plebbit-js` auf und wird von [5chan](/apps/5chan/) und [Seedit](/apps/seedit/) für die Community-Erstellung und Knotenverwaltung verwendet.

## Installation

Vorgefertigte Binärdateien sind für Windows, macOS und Linux verfügbar. Laden Sie die neueste Version für Ihre Plattform von GitHub herunter:

**[Von GitHub Releases herunterladen](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Erstellen Sie nach dem Herunterladen die binäre ausführbare Datei (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Den Daemon ausführen

Die häufigste Verwendung der CLI ist die Ausführung eines Bitsocial-Knotens. Der Daemon startet die P2P-Netzwerkschicht und stellt eine lokale API bereit, mit der Clients eine Verbindung herstellen können.

```bash
bitsocial-cli daemon
```

Beim ersten Start gibt der Daemon Links zur **WebUI** aus, einer browserbasierten grafischen Oberfläche zur Verwaltung Ihres Knotens, Ihrer Communities und Einstellungen. Dies ist nützlich, wenn Sie eine GUI gegenüber Terminalbefehlen bevorzugen.

## Tastenbefehle

| Befehl              | Beschreibung                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `daemon`            | Starten Sie den Bitsocial P2P-Knoten                                |
| `create subplebbit` | Erstellen Sie eine neue Community                                   |
| `subplebbit edit`   | Community-Einstellungen aktualisieren (Titel, Beschreibung, Regeln) |
| `subplebbit list`   | Auf diesem Knoten gehostete Communities auflisten                   |
| `subplebbit start`  | Beginnen Sie, einer bestimmten Community zu dienen                  |
| `subplebbit stop`   | Hören Sie auf, einer bestimmten Gemeinschaft zu dienen              |

Führen Sie einen beliebigen Befehl mit `--help` aus, um verfügbare Optionen und Flags anzuzeigen:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Typischer Arbeitsablauf

Ein üblicher Setup-Ablauf zum Hosten einer neuen Community:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

Die Community ist jetzt live im Bitsocial-Netzwerk und von jedem kompatiblen Client aus zugänglich.

## Links

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
