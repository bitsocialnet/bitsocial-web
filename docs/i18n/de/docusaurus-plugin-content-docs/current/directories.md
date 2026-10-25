---
title: Verzeichnisse
description: Wie Bitsocial-Apps Communities um einen Themennamen konkurrieren lassen, statt ihn dauerhaft demjenigen zu überlassen, der ihn zuerst beansprucht hat.
---

# Verzeichnisse

Auf Reddit kann ein Name wie `r/opensource` nur einer einzigen Community gehören, und wer sie kontrolliert, behält ihn. Treffen die Moderatoren Entscheidungen, die den Nutzern missfallen, bleibt als einzige Alternative, `r/opensource2` zu gründen. Die neue Community startet mit null Abonnenten, obwohl es den meisten Abonnenten von `r/opensource` um Open Source ging und nicht um dieses bestimmte Moderationsteam.

Bitsocial-Apps vermeiden das mit **Verzeichnissen**. Ein Verzeichnis ist ein Themenname wie `opensource`, um den Communities konkurrieren. Die kurze Route für diesen Namen öffnet die Community, die gerade auf Platz eins liegt, sodass eine bessere Community den Namen übernehmen kann, ohne jemanden um Erlaubnis zu fragen.

## So funktioniert es

1. **Ein Verzeichniscode ist ein Themenname.** Seedit verwendet Routen wie `/s/funny`. 5chan verwendet Imageboard-Pfade wie `/g/`.
2. **Communities treten als Kandidaten an.** Jedes Verzeichnis hat eine Liste von Kandidaten-Communities, jede mit ihrer eigenen exakten Adresse, etwa `funny-posting.bso`.
3. **Der bestplatzierte Kandidat gewinnt die Route.** Wer `/s/funny` öffnet, sieht den aktuellen Gewinner.
4. **Verlieren löscht nichts.** Eine Community, die nicht gewinnt, behält ihre Adresse, ihre Beiträge und ihre Abonnenten, und jeder kann sie weiterhin direkt öffnen.

## Der Name ist der Eingang, nicht die Identität

Ein Verzeichniscode ist nur eine Route zum Entdecken. Alles Dauerhafte verweist auf eine exakte Community:

- Wer über `/s/funny` abonniert, abonniert die exakte Adresse des aktuellen Gewinners. Der Verzeichniscode selbst wird nie als Abonnement gespeichert.
- Beitragslinks verwenden immer die exakte Adresse der Community, sodass ein alter Link nach einem Gewinnerwechsel nicht plötzlich auf eine andere Community zeigen kann.
- Wechselt der Gewinner, lässt Seedit bestehende Abonnements unangetastet und fragt jeden Abonnenten, ob er zum neuen Gewinner wechseln, beide behalten oder bei der aktuellen Community bleiben möchte. Automatisches Wechseln lässt sich pro Verzeichnis optional aktivieren, und ein automatischer Wechsel zeigt einen Hinweis mit Rückgängig-Option an.

Eine konkurrierende Community nimmt also niemandem Abonnements weg. Sie gewinnt den Namen: Neue Besucher landen bei ihr, und bestehende Abonnenten bekommen eine Auswahl mit einem Klick. Wer die alte Community bevorzugt, behält sie.

## Warum keine Namensvergabe nach dem Windhundprinzip

- **Kein Squatting.** Einen guten Namen zu besetzen reicht nicht. Eine Community muss der beste Kandidat dafür bleiben.
- **Kein Admin vergibt Namen.** Eine Vergabe durch einen Administrator würde das zentrale Veto wiederherstellen, das Bitsocial gerade abschaffen soll.
- **Konkurrenten behalten einen Weg zum Publikum.** Eine rivalisierende Community zielt auf denselben Namen, statt unter einem schlechteren von vorn anzufangen.
- **Clients sind sich über den Gewinner einig.** Seedit ordnet Kandidaten deterministisch, sodass jeder Client, der denselben finalisierten Snapshot des Verzeichnisses liest, denselben Gewinner anzeigt. Seedit setzt keinen anderen Kandidaten ein, nur weil der Gewinner über die Verbindung eines einzelnen Nutzers vorübergehend nicht erreichbar ist.

## Wie Gewinner heute bestimmt werden

Kandidaten werden als JSON-Dateien im Repository [bitsocialnet/lists](https://github.com/bitsocialnet/lists) veröffentlicht, eine Datei pro Verzeichnis, und eine Community tritt einem Verzeichnis per Pull-Request an dessen Datei bei. Das ist eine Übergangslösung für den Anfang. Ziel ist, dass Abstimmungen die Pull-Requests als Verfahren zur Bestimmung der Gewinner ablösen.

- **Seedit** ordnet die Kandidaten eines Verzeichnisses nach Punktzahl, dann nach dem Zeitpunkt ihrer Aufnahme und dann nach Adresse. Jede Verzeichnisdatei trägt eine Revisionsnummer, und jede Änderung an ihren Kandidaten oder ihrem Gewinner veröffentlicht eine neue Revision.
- **5chan** führt pro Verzeichnis eine Abstimmung mit [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting) durch. Clients tauschen signierte Stimmzettel über libp2p gossipsub aus und berechnen das Ergebnis selbst, ohne dass ein Server Stimmen zählt. Zum Abstimmen braucht man einen 5chan Pass, ein nicht übertragbares Token, und jeder Inhaber hat eine Stimme. Wer für ein noch nicht gelistetes Board stimmt, nominiert es damit. Die Abstimmungen laufen derzeit im Testnet Base Sepolia, und solange sie das Testnet nicht verlassen haben, werden die Ergebnisse zwar angezeigt, verändern aber nicht die Reihenfolge der Liste.

## Protokoll oder App?

Verzeichnisse sind nicht Teil von PKC, der Peer-to-Peer-Schicht, die Communities speichert und überträgt. Sie sind eine Konvention, die Clients darüber anwenden, neben Standardlisten und Suche; siehe [Entdeckung von Inhalten](./content-discovery.md). Ein Client kann dieselben Verzeichnisdateien lesen, eigene veröffentlichen oder ganz auf Verzeichnisse verzichten, und Nutzer können jede Community weiterhin über ihre Adresse öffnen.
