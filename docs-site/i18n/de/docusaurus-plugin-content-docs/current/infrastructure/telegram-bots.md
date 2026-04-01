---
title: Telegram-Bots
description: Feed-Bots, die Bitsocial-Community-Listen überwachen und Beiträge an Telegram-Kanäle weiterleiten.
sidebar_position: 3
---

# Telegram-Bots

Die Bitsocial Telegram-Bots überwachen Kunden-Community-Listen im Bitsocial-Netzwerk und leiten neue Beiträge automatisch an Telegram-Kanäle weiter. Jede weitergeleitete Nachricht enthält Inline-Schaltflächen, die auf den ursprünglichen Beitrag auf 5chan und Seedit zurückführen.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Verfügbare Bots

| Bot            | Status  | Beschreibung                                                                    |
| -------------- | ------- | ------------------------------------------------------------------------------- |
| **5chan-Feed** | Aktiv   | Überwacht alle 5chan-Verzeichnisse und leitet neue Beiträge an Telegram weiter. |
| **Seed-Feed**  | Geplant | Bietet die gleiche Funktionalität für Seedit-Communitys.                        |

## Einrichtung

### Voraussetzungen

- Node.js
- Garn
- Ein Telegram-Bot-Token (erstellen Sie eines über [BotFather](https://t.me/BotFather))

### Installation

Klonen Sie das Repository und installieren Sie Abhängigkeiten:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Konfiguration

Erstellen Sie eine `.env`-Datei im Projektstammverzeichnis mit Ihrem Bot-Token:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Laufen

Starten Sie den Bot, nachdem Sie Ihre Umgebung konfiguriert haben:

```bash
yarn start
```

## Beitragsformat

Wenn der Bot einen Beitrag an Telegram weiterleitet, enthält er zwei Inline-Schaltflächen:

- **Auf 5chan ansehen** – Öffnet den Beitrag im 5chan-Webclient.
- **Auf Seedit anzeigen** – Öffnet den Beitrag im Seedit-Webclient.

Dadurch können Telegram-Abonnenten direkt zum vollständigen Diskussionsthread auf dem von ihnen bevorzugten Client springen.
