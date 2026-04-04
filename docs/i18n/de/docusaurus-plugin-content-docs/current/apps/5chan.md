---
title: 5chan
description: Ein serverloses, dezentrales Imageboard, das auf dem Bitsocial-Protokoll basiert und auf dem jeder Boards erstellen und besitzen kann.
sidebar_position: 1
---

:::warning[Legacy-Benennung]
Die Codebasis dieses Projekts verwendet immer noch die alte Benennung „plebbit“ aus der Zeit vor der Umbenennung von Bitsocial. Paketnamen, API-Referenzen und einige interne Terminologie werden in einer zukünftigen Version aktualisiert. Die hier beschriebene Funktionalität ist aktuell – nur die Benennung ist veraltet.
:::

# 5chan

5chan ist ein serverloses, administriertes und vollständig dezentralisiertes Imageboard, das auf dem Bitsocial-Protokoll läuft. Es folgt der bekannten Imageboard-Verzeichnisstruktur und führt gleichzeitig eine dezentrale Eigentümerschaft ein – jeder kann ein Board erstellen, und mehrere Boards können über einen Abstimmungsmechanismus um denselben Verzeichnisplatz konkurrieren.

## Downloads

| Plattform | Link                                 |
| --------- | ------------------------------------ |
| Web       | [5chan.app](https://5chan.app)       |
| Desktop   | Verfügbar für Mac, Windows und Linux |
| Mobile    | Verfügbar für Android                |

## So funktionieren Boards

5chan organisiert Inhalte in Boards mithilfe eines klassischen Verzeichnislayouts (z. B. `/b/`, `/g/`). Im Gegensatz zu herkömmlichen Imageboards, bei denen ein zentraler Administrator jedes Board kontrolliert, ermöglicht 5chan jedem Benutzer, sein eigenes Board zu erstellen und vollständig zu besitzen. Wenn mehrere Boards auf denselben Verzeichnisplatz abzielen, konkurrieren sie durch Abstimmung um diese Position.

### Erstellen eines Boards

Um ein neues Board zu erstellen, müssen Sie `bitsocial-cli` als Peer-to-Peer-Knoten ausführen. Dadurch wird sichergestellt, dass Ihr Board dezentral gehostet wird, ohne auf einen zentralen Server angewiesen zu sein.

### Verzeichniszuweisungen

Zuweisungen von Verzeichnisslots (welches Board in welchem ​​Pfad angezeigt wird) werden derzeit über GitHub-Pull-Requests an die Datei `5chan-directories.json` verwaltet. Dies ist ein vorübergehender Prozess – zukünftige Versionen werden die Erstellung von In-App-Boards und Pubsub-basierte Abstimmungen unterstützen, um Verzeichniszuweisungen automatisch zu handhaben.

## Internals

Unter der Haube verwendet 5chan die plebbit-js-API-Schicht für seine Protokollinteraktionen. Wie in der Warnung oben erwähnt, tragen diese internen Referenzen immer noch alte Namen, die vor der Umbenennung von Bitsocial entstanden sind.

## Links

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lizenz**: GPL-2.0-only
