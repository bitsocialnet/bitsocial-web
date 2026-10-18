---
title: Wo Beiträge leben und wie lange sie bleiben
description: Warum Bitsocial-Beiträge signiert und inhaltsadressiert sind, aber nicht von jedem Node für immer gespeichert werden, wer sie online hält und wie Archive alte Inhalte lesbar halten.
---

# Wo Beiträge leben und wie lange sie bleiben

Bitsocial speichert nicht jeden Beitrag auf einer Blockchain oder in einer Unternehmensdatenbank. Der
Node jeder Community hält ihre Beiträge vor, Leser und Seeder helfen bei der Auslieferung, und wer ein
permanentes Archiv will, kann eines führen. Beiträge für immer zu behalten ist **optional, nicht
verpflichtend**: Das Protokoll zwingt keinen Teilnehmer, den Verlauf des ganzen Netzwerks zu speichern.

Diese Seite erklärt, was das praktisch bedeutet, denn „nicht für immer gespeichert“ lässt sich leicht
als „verschwindet“ oder „vertrau mir“ missverstehen.

## Authentizität und Verfügbarkeit sind getrennte Fragen

Zu einem Beitrag gibt es zwei verschiedene Fragen:

1. **Ist er echt?** Hat dieser Autor ihn geschrieben, und hat diese Community ihn angenommen?
2. **Ist er noch online?** Kann ihn heute jemand abrufen?

Bitsocial beantwortet die erste Frage mit Kryptografie, nicht mit Vertrauen. Jeder Beitrag wird mit dem
Schlüsselpaar seines Autors signiert und nach seiner Annahme durch eine Community unter einer
Content-Identifier (CID) gespeichert: einem Hash seiner exakten Bytes. Wer einen Beitrag abruft, kann
Signatur und Hash selbst prüfen. Ein Node, Router, Gateway oder Archiv kann den Text eines Beitrags
nicht ändern oder einen Beitrag im Namen anderer fälschen, ohne dass die Prüfung fehlschlägt.

Die zweite Frage betrifft, wer eine Kopie behält; nur dieser Teil ist nicht garantiert.

## Wer Beiträge online hält

- **Der Node der Community.** Der Node des Eigentümers nimmt Beiträge an und bewahrt sie so lange in
  seiner Datenbank auf, wie die Community sie behält. Das ist die eine Kopie, die immer existiert,
  solange die Community läuft. Siehe [Peer-to-Peer-Protokoll](/peer-to-peer-protocol/).
- **Leser.** Desktop-Apps wie die 5chan-Electron-App seeden Communities, die sie laden, solange sie
  laufen. Beliebte Communities werden dadurch von vielen Peers ausgeliefert, wie beliebte Torrents.
  Ein Browser-Tab kann Inhalte zwischenspeichern und prüfen, während er geöffnet ist, ist aber kein
  langlebiger Host.
- **Seeder.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) ermöglicht jedem,
  auf einem VPS oder einem freien Rechner dauerhaft Kapazität bereitzustellen. Er pinnt die neuesten
  Seiten und Beitragsupdates von Communities; so lassen sich Communities hinter Heimroutern auch aus
  Browsern laden.
- **Archivare.** Jeder kann Communities crawlen und alles aufbewahren, was er sieht. Archive sind
  gewöhnliche Dienste auf dem Netzwerk, keine besondere Rolle im Protokoll.

## Communities bestimmen ihre eigene Aufbewahrung

Wie lange eine Community alte Beiträge behält, entscheidet ihr Eigentümer, nicht das Protokoll. Manche
Communities wollen jahrelange Verläufe. Andere sind darauf ausgelegt zu vergessen: 5chan-Boards
funktionieren wie ein Imageboard, auf dem Threads vom Board fallen, in ein Archiv wandern und nach
einer festgelegten Zeit (standardmäßig 48 Stunden) vom Node des Boards gelöscht werden. Eine Community
kann das Archiv auch ganz weglassen.

Beides unterstützt dasselbe Protokoll, weil Aufbewahrung eine Richtlinie jeder Community ist und keine
Kosten, die jeder Node tragen muss.

## Warum nicht alles für immer speichern?

Ein Netzwerk, das von jedem Node verlangt, jeden Beitrag für immer zu behalten, muss dafür irgendwie
bezahlen:

- **Blockchains** lassen jeden Full Node den gesamten Verlauf speichern; damit steigen die
  Node-Anforderungen mit jeder Aktivität, und das Veröffentlichen kostet meist eine Gebühr.
- **Bezahlter Speicher**, etwa die Storage-Rent von Farcaster, lässt Nutzer für ihren Verlauf zahlen
  und entfernt die ältesten Beiträge, die über das Bezahle hinausgehen. Siehe
  [Bitsocial und Farcaster](/comparisons/farcaster/).
- **Zentrale Server** behalten alles, aber nur solange es ein Unternehmen will und nach dessen Regeln.

Soziale Medien brauchen kein globales Ledger. Es spielt keine Rolle, ob Beitrag A eine Millisekunde vor
Beitrag B angenommen wurde, und die meisten alten Beiträge werden selten gelesen. Bitsocial lässt jeden
Community-Node nur seine eigenen Communities halten; dadurch bleibt Hosting günstig genug für einen
Laptop, einen Raspberry Pi oder einen kleinen VPS. Siehe
[Warum keine Blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Der Kompromiss

Wenn niemand eine Kopie eines Beitrags behält, kann er nicht mehr verfügbar sein. Die CID eines Beitrags
ändert sich nie, aber eine CID ist nur eine Adresse: Inhalte bleiben nur abrufbar, solange mindestens ein
Node sie ausliefert. Geht der Node einer Community dauerhaft offline und hat kein Leser, Seeder oder
Archiv ihre Beiträge behalten, sind diese Beiträge verloren.

Das sind die ehrlichen Kosten, kein globales Ledger vorzuschreiben. Es sind auch die Kosten, die jede
große Plattform bereits hat: Alte Beiträge verschwinden, wenn Accounts, Server oder Unternehmen
verschwinden. Der Unterschied ist, dass es auf Bitsocial keine Erlaubnis braucht, etwas zu behalten.

## Was wichtig ist, bewahren

- **Den Community-Node selbst betreiben.** Ein Community-Eigentümer, der den Node weiter betreibt,
  bewahrt den Verlauf der Community, solange deren Einstellungen ihn vorsehen.
- **Seeden.** Eine geöffnete Desktop-App oder `bitsocial-seeder` hält Communities für andere verfügbar.
- **Archivieren.** Unabhängige Archive halten alte Threads lesbar und durchsuchbar, nachdem eine
  Community sie entfernt hat. [5archive.org](https://5archive.org) archiviert 5chan-Boards und
  [seeditarchive.org](https://seeditarchive.org) archiviert Seedit-Communities. Beide sind Open
  Source, sodass jeder einen Spiegel oder ein konkurrierendes Archiv betreiben kann.

Da jeder archivierte Beitrag weiterhin signiert ist, kann ein Archiv nicht unbemerkt verändern, was
jemand gesagt hat: Leser können die Signatur eines archivierten Beitrags genau wie die eines aktuellen
Beitrags prüfen.
