---
title: Bitsocial und Secure Scuttlebutt
description: Wie sich Secure Scuttlebutt (SSB) und seine App Manyverse von Bitsocial unterscheiden, von Append-only-Feeds und Replikation entlang des Follow-Graphen bis zu Communities, Spam-Abwehr und Offline-Synchronisation.
---

# Bitsocial und Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) ist ein soziales Peer-to-Peer-Protokoll, das
Dominic Tarr 2014 geschaffen hat. [Manyverse](https://www.manyver.se/) ist seine bekannteste App,
für Android, iOS und Desktop; [Patchwork](https://github.com/ssbc/patchwork) war der wichtigste
Desktop-Client, bevor es archiviert wurde. Von den in dieser Dokumentation verglichenen Systemen
steht SSB Bitsocial im Geiste am nächsten: keine Server im Datenpfad, keine Blockchain, keine
globale Reihenfolge und Ed25519-Schlüssel als Identität. Die beiden haben gegensätzliche
Entscheidungen darüber getroffen, was jeder Peer speichert und wo Spam aufgehalten wird.

## Wie Scuttlebutt funktioniert

- **Feeds.** Jede Identität ist ein Ed25519-Schlüsselpaar, geschrieben als `@<public key>.ed25519`.
  Alles, was ein Nutzer veröffentlicht, landet in seinem eigenen Feed, einem Append-only-Log, in dem
  jede signierte Nachricht eine Sequenznummer und den Hash der vorherigen Nachricht trägt. Laut dem
  [Protokollleitfaden](https://ssbc.github.io/scuttlebutt-protocol-guide/) lässt sich eine Nachricht
  nach dem Veröffentlichen nicht mehr ändern.
- **Replikation.** Peers kopieren ganze Feeds, keine einzelnen Beiträge, und der Follow-Graph
  entscheidet, welche Feeds ein Peer vorhält. Patchwork zum Beispiel zeigte Feeds bis zu zwei Hops
  entfernt an und replizierte Feeds bis zu drei Hops entfernt. Mit Epidemic Broadcast Trees (EBT)
  vergleichen Peers die neueste Sequenznummer, die sie für jeden Feed haben, und senden nur, was
  fehlt.
- **Verbindungen.** Peers authentifizieren sich per Secret Handshake und verschlüsseln den
  Datenverkehr mit Box Stream. Der Handshake ist an eine Netzwerkkennung gebunden, sodass sich Peers
  in einem separaten SSB-Netzwerk mit anderer Kennung nicht mit dem Hauptnetzwerk verbinden können.
- **Peers finden.** Peers kündigen sich im lokalen Netzwerk per UDP-Broadcast an und synchronisieren
  über LAN; Manyverse synchronisiert zusätzlich über Bluetooth. Über das Internet hinweg setzen
  Nutzer auf **Pubs**, ständig erreichbare Peers, die einem Nutzer zurückfolgen, nachdem er einen
  Einladungscode eingelöst hat, und dann seinen Feed speichern und ausliefern, sowie auf **Rooms**,
  die keine Feeds speichern, aber Verbindungen zwischen ihren Mitgliedern tunneln.
- **Blobs und private Nachrichten.** Bilder und andere Dateien sind inhaltsadressierte Blobs, die
  von Peers abgerufen werden; aktuelle Implementierungen begrenzen ihre Größe standardmäßig auf
  5 MB. Private Nachrichten werden für bis zu sieben Empfänger verschlüsselt und als Chiffretext im
  Feed des Autors veröffentlicht.

## Wo sie sich unterscheiden

### Was ein Peer speichert

Ein SSB-Peer hält eine vollständige Kopie jedes Feeds in seinem Replikationsbereich vor, ab der
ersten Nachricht jedes Feeds, und liefert diese Feeds an andere aus. Dadurch funktioniert SSB
offline, aber der Speicherbedarf wächst mit jeder Nachricht im Bereich, und eine neue Installation
muss diese Feeds herunterladen, bevor sie viel anzeigt. Ein Bitsocial-Client holt den neuesten Stand
der Communities, die er öffnet, vom Node der Community und von den Peers, die sie seeden, und das
Netzwerk bewahrt nur diesen neuesten Stand. Siehe [Peer-to-Peer-Protokoll](/peer-to-peer-protocol/).

### Löschen und Geräte

Weil ein Feed eine Hash-Kette ist, gibt es bei SSB kein netzwerkweites Löschen: Ein Peer kann
Nachrichten aus seiner eigenen Datenbank entfernen, sie aber nicht aus den Kopien anderer Peers
zurückziehen. Wer mit demselben Schlüssel von zwei Geräten oder von einem wiederhergestellten Backup
aus postet, erzeugt einen Fork des Feeds, daher lautet die übliche Antwort: eine Identität pro
Gerät. PZP, das Nachfolgeprotokoll des Manyverse-Teams, nennt Löschen, mehrere Geräte pro Konto und
forktolerante Feeds unter seinen wichtigsten Änderungen gegenüber SSB
([Ankündigungsbeitrag](https://www.manyver.se/blog/2024-07-03/)). Ein Bitsocial-Community-Node
veröffentlicht bei jeder Aktualisierung eine neue Version des Stands der Community, sodass Inhalte,
die ihre Moderatoren entfernen, aus dem neuesten Stand herausfallen.

### Von wem man etwas mitbekommt

Der Replikationsbereich von SSB dient zugleich als Spamfilter. Der Feed eines Fremden erreicht einen
Nutzer nur, wenn jemand innerhalb seiner Hops dem Fremden folgt, und wer einen Feed blockiert, sorgt
dafür, dass der eigene Node ihn nicht mehr repliziert. Spam bleibt draußen, Neulinge aber auch, bis
ihnen jemand folgt. Bei Bitsocial kann jeder in einer Community veröffentlichen, und der Node der
Community entscheidet über ihre Challenge, ob ein Beitrag angenommen wird. Siehe
[Benutzerdefinierte Anti-Spam-Herausforderungen](/custom-challenges/).

### Communities

SSB hat kein Community-Objekt. Kanäle und Hashtags sind Labels an einzelnen Beiträgen, die Antworten
in einem Thread liegen in den Feeds derer, die sie geschrieben haben, und wie viel man von einem
Thread sieht, hängt davon ab, welche dieser Feeds der eigene Node hat. Rooms können Moderatoren und
Mitgliederlisten haben, doch diese steuern, wer sich über den Room verbinden darf, nicht, was
veröffentlicht wird. Eine Bitsocial-Community ist ein vollwertiges Objekt mit eigenem Schlüsselpaar,
eigenen Regeln, Moderatoren und eigener Challenge.

### Infrastruktur

Beide halten Server aus dem Datenpfad heraus, und beide stützen sich auf Helfer. Pubs kommen bei SSB
einem gehosteten Dienst am nächsten: Sie speichern die Feeds aller, denen sie folgen, und liefern
sie aus. Rooms ähneln eher den HTTP-Routern von Bitsocial, weil keiner von beiden Inhalte speichert,
doch ein Room leitet die Verbindung zwischen seinen Mitgliedern weiter, während ein Router nur
Provider-Adressen zurückgibt und an der Übertragung nicht beteiligt ist. Wie ein SSB-Peer läuft ein
Bitsocial-Community-Node auf Consumer-Hardware, und er muss online sein, um neue Beiträge
anzunehmen.

### Offline und lokale Netzwerke

Hier ist SSB stärker. Zwei SSB-Peers im selben Wi-Fi-Netzwerk oder, bei Manyverse, über Bluetooth
können ohne Internetverbindung synchronisieren, und alles bereits Replizierte bleibt offline lesbar.
Das erklärte Hauptziel von Manyverse ist, soziale Netzwerke unabhängig von einer Internetverbindung
zu machen. Bitsocial braucht eine Internetverbindung, um Peers zu finden und um zu veröffentlichen.

### Browser

Die wichtigsten SSB-Apps liefern einen vollständigen SSB-Node mit: Manyverse bündelt einen in seinen
Mobil- und Desktop-Apps. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) ließ SSB in
einem Browser laufen, mit partieller Replikation und Verbindungen über Rooms, und wurde 2022
archiviert. Bitsocial-Apps betreiben einen Peer-to-Peer-Node in einem normalen Browser-Tab. Siehe
[Browser-Peer-to-Peer](/browser-p2p/).

### Private Nachrichten

SSB hat verschlüsselte private Nachrichten eingebaut. Bitsocial konzentriert sich auf öffentliche
Communities und hat noch keine nativen Direktnachrichten.

## Projektstatus

André Staltz, der Manyverse entwickelt hat, zog sich im April 2024 von SSB, Manyverse und ihrem
geplanten Nachfolger zurück ([sein letztes Update](https://www.manyver.se/blog/2024-04-05/)). Im
Juli 2024 veröffentlichte Jacob Karlsson diesen Nachfolger als [PZP](https://pzp.wiki/) und schrieb,
dass er nicht mehr an Manyverse arbeiten werde und von niemandem wisse, der das vorhabe. Im Oktober
2026 hatten die PZP-Repositorys auf [Codeberg](https://codeberg.org/pzp) nach Dezember 2024 keine
Aktualisierungen mehr erhalten. Das Repository von Patchwork ist archiviert, mit v3.18.1 als letztem
Release, und das Team hinter Planetary, einer SSB-App für iOS, wechselte 2023 mit seiner App Nos zu
Nostr. Das SSB-Netzwerk läuft weiterhin auf den Peers und Pubs, die Menschen online halten, aber
seine wichtigsten Apps werden nicht mehr weiterentwickelt.

## Vergleich

| Frage                  | Secure Scuttlebutt                                                                                         | Bitsocial                                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Kategorie              | Peer-to-Peer-Gossip-Protokoll                                                                              | Peer-to-Peer-Community-Netzwerk                                                                             |
| Identität              | Ein Ed25519-Schlüsselpaar pro Gerät                                                                        | Ed25519-Schlüsselpaare für Nutzer und Communities                                                           |
| Wo Beiträge liegen     | Der Append-only-Feed des Autors, kopiert von jedem Peer, der ihn repliziert                                | Der Node des Community-Eigentümers und die Peers, die sie lesen und seeden                                  |
| Was ein Peer vorhält   | Vollständiger Verlauf jedes Feeds in seinem Follow-Bereich                                                 | Der neueste Stand der Communities, die er liest oder seedet                                                 |
| Communities            | Kein Community-Objekt; Kanäle und Hashtags kennzeichnen Beiträge                                           | Vollwertige Objekte, deren Node Beiträge annimmt oder ablehnt                                               |
| Spam-Abwehr            | Replikationsbereich entlang des Follow-Graphen und Blockierungen                                           | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird                                   |
| Moderation             | Follows und Blockierungen jedes Nutzers                                                                    | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen                          |
| Hilfsserver            | Pubs speichern Feeds und liefern sie aus; Rooms tunneln Verbindungen                                       | HTTP-Router liefern Provider-Peers und speichern keine Inhalte                                              |
| Offline                | Synchronisation über LAN und Bluetooth ohne Internet                                                       | Braucht eine Internetverbindung                                                                             |
| Browser                | Apps bündeln einen vollständigen SSB-Node                                                                  | Peer-to-Peer-Node in einem normalen Browser-Tab                                                             |
| Netzwerk               | Läuft, aber die wichtigsten Apps werden nicht mehr weiterentwickelt                                        | Live-Netzwerk mit Apps wie [5chan](/apps/5chan/) und [Seedit](/apps/seedit/)                                |
| Wichtigster Kompromiss | Funktioniert offline und braucht kein Hosting, aber Feeds wachsen unbegrenzt und Fremde bleiben unsichtbar | Offenes Veröffentlichen und Browser-Unterstützung, braucht aber Internet und bewahrt nur den neuesten Stand |
