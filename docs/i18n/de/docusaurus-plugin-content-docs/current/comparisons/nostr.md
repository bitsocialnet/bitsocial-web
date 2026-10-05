---
title: Bitsocial und Nostr
description: Wie sich das Relay-basierte Modell von Nostr von den Peer-to-Peer-Communities von Bitsocial unterscheidet, vom Datenpfad und der Identität bis zu Gruppen, Spam-Abwehr und Moderation.
---

# Bitsocial und Nostr

Nostr passt weder sauber in die Schublade der föderierten noch in die der Blockchain-Systeme. Nutzer
bekommen ihre Konten nicht von Instanzen zugeteilt, und es gibt weder Chain noch Konsens, Gas oder
eine globale Reihenfolge. Nostr lässt sich besser als **Relay-basierte soziale Medien** beschreiben:
Nutzer halten Schlüsselpaare, signieren Events und veröffentlichen sie an Relays, also gewöhnliche
Server, die sie speichern und ausliefern
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Die
[README](https://github.com/nostr-protocol/nostr) von Nostr selbst stellt klar, dass es nicht auf
Peer-to-Peer-Techniken setzt.

Damit steht Nostr in einem wichtigen Punkt näher an Bitsocial als föderierte oder
Blockchain-Systeme: Die Identität ist kryptografisch und portabel. Die Unterschiede liegen in der
Datenschicht und darin, wer den Zugang kontrolliert.

## Wie Nostr funktioniert

- **Events und Relays.** Jeder Beitrag, jedes Profil und jede Reaktion ist ein signiertes
  JSON-Event. Clients veröffentlichen Events über WebSockets an Relays und abonnieren sie mit
  Filtern; Relays speichern Events und liefern sie wieder aus. Relays kommunizieren nicht
  miteinander.
- **Replikation.** Nutzer veröffentlichen meist an mehrere Relays. Eine Studie über 712 Relays aus
  dem Jahr 2023 fand den durchschnittlichen Beitrag auf 34,6 davon
  ([Wei und Tyson](https://arxiv.org/abs/2402.05709)).
- **Die Beiträge einer Person finden.** Nutzer veröffentlichen eine Liste der Relays, an die sie
  schreiben und von denen sie lesen
  ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), und Clients holen die
  Beiträge eines Nutzers von dessen Schreib-Relays.
- **Identität.** Jeder Nutzer ist ein secp256k1-Schlüssel, der mit Schnorr-Signaturen signiert. Die
  Spezifikationen definieren weder Schlüsselrotation noch Wiederherstellung, ein verlorener
  Schlüssel bedeutet also ein verlorenes Konto. Optionale `name@domain`-Kennungen
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) werden gegen eine Datei auf
  dem Webserver der jeweiligen Domain geprüft.
- **Gruppen.** Der empfohlene Community-Mechanismus sind Relay-basierte Gruppen
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): Ein Relay hostet eine
  Gruppe, setzt deren Mitgliedschafts- und Posting-Regeln durch, bevor es einen Beitrag annimmt, und
  signiert ihre Metadaten. Die älteren, von Moderatoren freigegebenen Communities
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) sind inzwischen zugunsten von
  NIP-29 als nicht empfohlen markiert.
- **Spam-Abwehr.** Jedes Relay wählt seine eigene Hürde: Proof of Work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), Authentifizierung und
  Allowlists ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), Bezahlung oder
  Ratenlimits. Clients ergänzen Stummschaltlisten und Vertrauenswerte.
- **Medien.** Bilder und Videos werden auf separate HTTP-Dateiserver hochgeladen.

## Wo sie sich unterscheiden

### Wer Beiträge speichert und ausliefert

Bei Nostr sind Relays die Speicher- und Auslieferungsschicht: Ein Server muss jeden Beitrag online
halten. Bei Bitsocial helfen HTTP-Router den Clients nur dabei, Peers zu finden. Sie speichern weder
Beiträge noch Profile, Community-Metadaten oder Moderationszustände; Clients holen Inhalte vom Node
der Community und von den Peers, die sie seeden. Siehe
[Peer-to-Peer-Protokoll](/peer-to-peer-protocol/).

### Wer den Zugang kontrolliert

Bei Nostr liegen die Schreibhürden bei den Relay-Betreibern. Außerhalb von NIP-29-Gruppen kann ein
Schlüssel, den ein Relay ablehnt, dasselbe Event an jedes Relay veröffentlichen, das es annimmt, und
was Leser sehen, hängt davon ab, welche Relays ihr Client liest. Eine NIP-29-Gruppe kommt einer
Bitsocial-Community näher: Ihr Host-Relay nimmt Beiträge an oder lehnt sie ab. Das Relay legt aber
weiterhin fest, was Gruppenrollen dürfen, und der Verlauf der Gruppe bleibt an dieses Relay
gebunden, sofern sich nicht ein anderes Relay bereit erklärt, ihn zu übernehmen.

Bei Bitsocial ist eine Community ein kryptografisches Objekt mit eigenem Schlüsselpaar. Der Node der
Community führt die Challenge aus, die der Eigentümer wählt, und veröffentlicht den akzeptierten
Stand in das Peer-to-Peer-Netzwerk. Siehe
[Benutzerdefinierte Anti-Spam-Herausforderungen](/custom-challenges/).

### Betrieb der Infrastruktur

Ein Relay ist ein Server mit Domain und WebSocket-Endpunkt, und beliebte Relays tragen die Speicher-
und Bandbreitenkosten dessen, was sie ausliefern. Die Studie von 2023 schätzte, dass etwa 95 % der
kostenlosen Relays ihre Kosten nicht aus Spenden decken konnten. Ein Bitsocial-Community-Node läuft
auf Consumer-Hardware, und Peers, die eine Community lesen, können beim Verteilen helfen.

### Browser

Ein Nostr-Webclient öffnet WebSocket-Verbindungen direkt zu Relays, ein App-Server ist also nicht
nötig. Eine Bitsocial-Web-App betreibt einen Peer-to-Peer-Node im Tab und holt Inhalte von Peers.
Siehe [Browser-Peer-to-Peer](/browser-p2p/).

### Alte Inhalte

Nostr-Beiträge sind breit über Relays repliziert, was alten Beiträgen hilft zu überdauern. Bitsocial
bewahrt den jeweils neuesten Stand einer Community und garantiert alte Inhalte nicht für immer.

## Vergleich

| Frage                  | Nostr                                                                                                  | Bitsocial                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Kategorie              | Relay-basiertes Protokoll                                                                              | Peer-to-Peer-Community-Netzwerk                                                    |
| Identität              | secp256k1-Nutzerschlüssel, ohne Rotation in den Spezifikationen                                        | Ed25519-Schlüsselpaare für Nutzer und Communities                                  |
| Wo Beiträge liegen     | Vom Autor gewählte Relays, oft viele                                                                   | Der Node des Community-Eigentümers und die Peers, die sie lesen und seeden         |
| Wer hält es online     | Relay-Betreiber                                                                                        | Node des Community-Eigentümers plus helfende Seeder                                |
| Communities            | Von Relays gehostete Gruppen (NIP-29)                                                                  | Vollwertige Objekte, deren Node Beiträge annimmt oder ablehnt                      |
| Spam-Abwehr            | Richtlinie des jeweiligen Relays: Proof of Work, Authentifizierung, Bezahlung, Allowlists, Ratenlimits | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird          |
| Moderation             | Relay-Richtlinien, Stummschaltlisten in Clients, Labels und Meldungen                                  | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen |
| Namen                  | Optionale `name@domain`-Kennungen, über HTTPS geprüft                                                  | `.bso`- und `.eth`-Namen, die zu Schlüsseln auflösen                               |
| Browser                | WebSocket-Client von Relays                                                                            | Peer-to-Peer-Node in einem normalen Browser-Tab                                    |
| Wichtigster Kompromiss | Portable Identität und breite Replikation, aber relayabhängige Verfügbarkeit und Richtlinien           | Weniger Relay-Abhängigkeit, aber alte Inhalte sind nicht dauerhaft garantiert      |
