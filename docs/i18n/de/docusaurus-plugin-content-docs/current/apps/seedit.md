---
title: Seedit
description: Ein serverloses, dezentrales Forum im Reddit-Stil, das auf dem Bitsocial-Protokoll basiert und in dem jeder Communities erstellen und besitzen kann.
sidebar_position: 2
---

# Seedit

Seedit ist eine serverlose, verwaltungslose und vollständig dezentrale Alternative zum altmodischen Reddit, die auf dem Bitsocial-Protokoll basiert. Es gibt Benutzern die vollständige Kontrolle über ihre Communities – jeder kann eine erstellen und mehrere Communities können um dieselbe kurze Route konkurrieren, etwa `/s/funny`.

## Downloads

| Plattform | Link                                                    |
| --------- | ------------------------------------------------------- |
| Web       | [seedit.app](https://seedit.app)                        |
| Web (ENS) | `seedit.eth` über den Brave-Browser oder IPFS Companion |
| Desktop   | Verfügbar für Mac, Windows und Linux                    |
| Mobil     | Verfügbar für Android                                   |

## Wie Gemeinschaften funktionieren

Seedit organisiert Inhalte in Communities ähnlich wie Subreddits. Jede Community ist Eigentum ihres Gründers und funktioniert ohne zentrale Verwaltung. Mehrere Communities können um dieselbe Route eines [Verzeichnisses](/directories/) konkurrieren, etwa `/s/funny`, die den aktuellen Gewinner öffnet. Abonnements und Beitragslinks verweisen immer auf die exakte Community.

### Eine Gemeinschaft schaffen

Es gibt zwei Möglichkeiten, eine neue Community zu erstellen:

1. **Desktop-Client** – Verwenden Sie die integrierte GUI in der Desktop-Anwendung, um Ihre Community einzurichten und zu konfigurieren.
2. **bitsocial-cli** – Führen Sie das CLI-Tool aus, um Communities über die Befehlszeile zu erstellen und zu verwalten.

### Standard-Community-Liste

Neue Konten abonnieren eine Standardliste mit exakten Community-Adressen, die in `seedit-default-subscriptions.json` im Repository [bitsocialnet/lists](https://github.com/bitsocialnet/lists) definiert ist. Verzeichniskandidaten sind in den Dateien `seedit-directories/seedit-<code>-directory.json` im selben Repository aufgeführt. Um Ihre Community zu einer der beiden Listen hinzuzufügen, senden Sie einen Pull-Request mit den Details Ihrer Community.

## Links

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegramm**: [t.me/seeditreact](https://t.me/seeditreact)
- **Lizenz**: nur GPL-2.0
