---
title: 5chan
description: Ein serverloses, dezentrales Imageboard, das auf dem Bitsocial-Protokoll basiert und auf dem jeder Boards erstellen und besitzen kann.
sidebar_position: 1
---

# 5chan

5chan ist ein serverloses, verwaltungsloses und vollständig dezentralisiertes Imageboard, das auf dem Bitsocial-Protokoll läuft. Es folgt der bekannten Imageboard-Verzeichnisstruktur und führt gleichzeitig eine dezentrale Eigentümerschaft ein – jeder kann ein Board erstellen, und mehrere Boards können über einen Abstimmungsmechanismus um denselben Verzeichnisplatz konkurrieren.

## Downloads

| Plattform | Link                                 |
| --------- | ------------------------------------ |
| Web       | [5chan.app](https://5chan.app)       |
| Desktop   | Verfügbar für Mac, Windows und Linux |
| Mobil     | Verfügbar für Android                |

## Wie Boards funktionieren

5chan organisiert Inhalte in Boards mithilfe eines klassischen Verzeichnislayouts (z. B. `/b/`, `/g/`). Im Gegensatz zu herkömmlichen Imageboards, bei denen ein zentraler Administrator jedes Board kontrolliert, ermöglicht 5chan jedem Benutzer, sein eigenes Board zu erstellen und vollständig zu besitzen. Wenn mehrere Boards denselben Verzeichnisplatz anstreben, konkurrieren sie durch Abstimmung um diese Position.

### Ein Board erstellen

Um ein neues Board zu erstellen, müssen Sie `bitsocial-cli` als Peer-to-Peer-Knoten ausführen. Dadurch wird sichergestellt, dass Ihr Board dezentral gehostet wird, ohne auf einen zentralen Server angewiesen zu sein.

### Verzeichniszuweisungen

Zuweisungen von Verzeichnissteckplätzen (welches Board in welchem Pfad angezeigt wird) werden derzeit über GitHub-Pull-Anfragen an die Datei `5chan-directories.json` verwaltet. Dies ist ein vorübergehender Prozess – zukünftige Versionen werden die Erstellung von In-App-Boards und Pubsub-basierte Abstimmungen unterstützen, um Verzeichniszuweisungen automatisch durchzuführen.

## Interna

Unter der Haube nutzt 5chan die gemeinsame Bitsocial-Protokoll-Client-Schicht für seine Netzwerkinteraktionen. Die Web-App bei 5chan.app kann auch einen Helia-Knoten im Browser ausführen, wenn Browser-P2P in den erweiterten Einstellungen aktiviert ist, sodass Leser von Peers ohne ein zentrales IPFS-Gateway laden können. Weitere Informationen finden Sie im Abschnitt „Browser-P2P“ in den Hinweisen zum Peer-to-Peer-Protokoll.

## Links

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegramm**: [t.me/fünfchandev](https://t.me/fivechandev)
- **Lizenz**: nur GPL-2.0
