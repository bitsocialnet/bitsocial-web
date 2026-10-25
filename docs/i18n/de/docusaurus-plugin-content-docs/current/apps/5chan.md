---
title: 5chan
description: Ein serverloses, dezentrales Imageboard auf Basis des Bitsocial-Protokolls, auf dem jeder Boards erstellen und besitzen kann.
sidebar_position: 1
---

# 5chan

5chan ist ein serverloses, adminloses und vollständig dezentrales Imageboard, das auf dem Bitsocial-Protokoll läuft. Es folgt der vertrauten Verzeichnisstruktur klassischer Imageboards und führt zugleich dezentrale Eigentümerschaft ein: Jeder kann ein Board erstellen, und mehrere Boards können über eine Abstimmung um denselben Verzeichnisplatz konkurrieren.

## Downloads

| Plattform | Link                                 |
| --------- | ------------------------------------ |
| Web       | [5chan.app](https://5chan.app)       |
| Desktop   | Verfügbar für Mac, Windows und Linux |
| Mobil     | Verfügbar für Android                |

## Wie Boards funktionieren

5chan organisiert Inhalte in Boards mit einem klassischen Verzeichnislayout (z. B. `/b/`, `/g/`). Anders als bei herkömmlichen Imageboards, bei denen ein zentraler Administrator jedes Board kontrolliert, kann bei 5chan jeder Nutzer ein eigenes Board erstellen und vollständig besitzen. Streben mehrere Boards denselben Verzeichnisplatz an, konkurrieren sie um diese Position; siehe [Verzeichnisse](/directories/).

### Ein Board erstellen

Um ein neues Board zu erstellen, müssen Sie `bitsocial-cli` als Peer-to-Peer-Knoten betreiben. So wird sichergestellt, dass Ihr Board dezentral gehostet wird, ohne von einem zentralen Server abzuhängen.

### Verzeichniszuweisungen

Die Kandidaten-Boards jedes Verzeichnisses sind in einer Datei `5chan-directories/5chan-<code>-directory.json` im Repository [bitsocialnet/lists](https://github.com/bitsocialnet/lists) aufgeführt, und ein Board tritt einem Verzeichnis per Pull-Request an diese Datei bei. Zusätzlich führt 5chan für jedes Verzeichnis eine Abstimmung mit [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting) durch: Jeder Inhaber eines 5chan Pass hat eine Stimme, und wer für ein noch nicht gelistetes Board stimmt, nominiert es damit. Die Abstimmungen laufen derzeit im Testnet Base Sepolia, wo die Ergebnisse zwar angezeigt werden, die Reihenfolge der Liste aber nicht verändern.

## Interna

Intern nutzt 5chan die gemeinsame Client-Schicht des Bitsocial-Protokolls für seine
Netzwerkinteraktionen. Die Web-App unter 5chan.app betreibt standardmäßig einen Helia-Knoten im
Browser, sodass ein gewöhnlicher Tab dem Netzwerk als Peer beitritt: Er lädt Boards von anderen
Peers und veröffentlicht über pubsub, ohne zentralisiertes IPFS-Gateway im Pfad der Inhalte. Unter
[Browser-Peer-to-Peer](/browser-p2p/) steht, was das mit sich bringt und was ein Browser-Knoten
weiterhin nicht leisten kann.

## Links

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lizenz**: GPL-2.0-only
