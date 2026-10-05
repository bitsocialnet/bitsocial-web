---
title: Bitsocial und Bluesky
description: Wie sich Bluesky und das AT Protocol mit Personal Data Servers, Relays und AppViews von den Peer-to-Peer-Communities von Bitsocial unterscheiden.
---

# Bitsocial und Bluesky

[Bluesky](https://bsky.app/) ist eine Microblogging-App auf Basis des
[AT Protocol](https://atproto.com/), das Bluesky Social PBC entworfen hat. Das Protokoll teilt ein
soziales Netzwerk in getrennte Dienste auf: Personal Data Servers hosten Konten, Relays bündeln sie
zu einem einzigen Datenstrom, und AppViews indexieren diesen Strom zu den Timelines und Threads, die
Menschen sehen. Seine Dokumentation beschreibt Kontodaten als auf Host-Servern gespeichert, „im
Gegensatz zu einem Peer-to-Peer-Modell“ ([Überblick](https://atproto.com/guides/overview)).

## Wie das AT Protocol funktioniert

- **Repositories auf Servern.** Jeder Beitrag, jedes Like und jedes Folgen ist ein Datensatz im
  signierten Repository des Autors, das auf einem Personal Data Server (PDS) gehostet wird. Bluesky
  betreibt die Standardserver, und jeder kann einen eigenen hosten.
- **Relays.** Relays abonnieren jeden PDS und senden Änderungen als einen einzigen Strom weiter, den
  Firehose. Seit einem Protokoll-Update im Jahr 2025 archivieren sie nicht mehr jedes Repository,
  was ihren Betrieb deutlich günstiger gemacht hat
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** Ein AppView indexiert den gesamten Firehose und liefert Timelines, vollständige
  Antwort-Threads, Zähler und Suche aus. Er ist der ressourcenintensivste Teil des Netzwerks.
- **Identität.** Ein Konto ist eine DID: meist `did:plc`, registriert in einem einzigen globalen
  Verzeichnis, oder `did:web`, gebunden an eine Domain. Das DID-Dokument führt Handle,
  Signaturschlüssel und aktuellen Server des Kontos auf. Der PDS hält den Signaturschlüssel;
  `did:plc` erlaubt Nutzern außerdem, Rotationsschlüssel zu halten, damit sie ohne Hilfe des alten
  Hosts umziehen können ([Identitätsleitfaden](https://atproto.com/guides/identity)).
- **Handles.** Handles sind DNS-Namen wie `alice.bsky.social` oder eine Domain, die dem Nutzer
  gehört, und werden gegen die DID verifiziert.
- **Moderation.** Hosting und Reichweite sind getrennte Ebenen. Jeder kann einen Labeler betreiben,
  und Nutzer können mehrere davon kombinieren
  ([Moderationsleitfaden](https://atproto.com/guides/moderation)), aber die Bluesky-App wendet immer
  Blueskys eigene Moderation an. Autoren können einschränken, wer auf ihre Beiträge antworten darf,
  und Antworten ausblenden.

## Wo sie sich unterscheiden

### Server oder Peers

Die Daten von Bluesky liegen auf Servern: Ein PDS hostet jedes Konto, Relays transportieren den
Firehose, und AppViews liefern aus, was Clients anzeigen. Ein Browser ist ein HTTP-Client dieser
Dienste, nie ein Peer. Bei Bitsocial liefern der Node der Community und die Peers, die sie lesen,
die Inhalte aus, und eine Web-App kann ihren eigenen Peer-to-Peer-Node betreiben. Siehe
[Browser-Peer-to-Peer](/browser-p2p/).

### Eine globale Sicht oder Communities

Das AT Protocol ist auf eine einzige globale Sicht ausgelegt: Ein AppView sieht jede Antwort, daher
sind Threads und Suche vollständig. Bitsocial hat keinen globalen Index; jede Community
veröffentlicht ihren eigenen Stand, und Apps bauen die Auffindbarkeit darauf auf. Siehe
[Entdeckung von Inhalten](/content-discovery/).

Bluesky hat derzeit kein Community-Objekt für öffentliche Beiträge. Im Juni 2026
[kündigte es native Communities an](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k), bei
denen das Posten auf einigen Privatsphärestufen eine Freigabe erfordert; bis Oktober 2026 waren sie
noch nicht gestartet. Bei Bitsocial sind Communities das zentrale Objekt, und der Node einer
Community nimmt Beiträge an oder lehnt sie ab.

### Spam-Abwehr

Bluesky bekämpft Spam mit Ratenlimits auf seinen Servern, Beschränkungen für neue Hosts am Relay,
automatischer Erkennung, menschlicher Prüfung und Labels, und Autoren können Antworten einschränken.
Es gibt keine Hürde auf Community-Ebene, die festlegt, was ein Beitrag bestehen muss, bevor er
angenommen wird. Bei Bitsocial wählt jede Community ihre eigene Challenge. Siehe
[Benutzerdefinierte Anti-Spam-Herausforderungen](/custom-challenges/).

### Wer die Schlüssel hält

Konten auf Blueskys eigenen Servern melden sich mit einem Passwort an, und diese Server verwahren
ihre Signaturschlüssel treuhänderisch ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)). Laut
einem Protokollingenieur von Bluesky
[haben die meisten Konten keine unabhängig kontrollierten Rotationsschlüssel](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Eine Bitsocial-Identität ist ein Schlüsselpaar, das die App des Nutzers erzeugt und hält.

### Betrieb der Infrastruktur

Ein persönlicher Server ist günstig: Der [Referenz-PDS](https://github.com/bluesky-social/pds)
empfiehlt 1 GB RAM für bis zu 20 Nutzer. Ein unabhängiger AppView für das gesamte Netzwerk ist ein
großes Projekt; einer, der 2025 gebaut wurde,
[kostete etwa 200 US-Dollar im Monat](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), vor allem für 16
TB Speicher. Bitsocial hat keinen globalen Index, der repliziert werden müsste, und ein
Community-Node läuft auf Consumer-Hardware.

## Vergleich

| Frage                  | Bluesky (AT Protocol)                                                               | Bitsocial                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Kategorie              | Föderierte Server mit globalem Index                                                | Peer-to-Peer-Community-Netzwerk                                                    |
| Identität              | DID, Signaturschlüssel meist beim Server                                            | Ed25519-Schlüsselpaare für Nutzer und Communities                                  |
| Wo Beiträge liegen     | Das Repository des Autors auf einem Personal Data Server                            | Der Node des Community-Eigentümers und die Peers, die sie lesen und seeden         |
| Wer hält es online     | PDS-Hosts, Relays und AppViews, standardmäßig von Bluesky betrieben                 | Node des Community-Eigentümers plus helfende Seeder                                |
| Communities            | Für öffentliche Beiträge noch keine (2026 angekündigt)                              | Vollwertige Objekte, deren Node Beiträge annimmt oder ablehnt                      |
| Spam-Abwehr            | Server-Ratenlimits, automatische Erkennung, Labels, Antwortkontrollen               | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird          |
| Moderation             | Kombinierbare Labeler; die Bluesky-App wendet immer Blueskys Moderation an          | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen |
| Namen                  | DNS-Handles, gegen die DID verifiziert                                              | `.bso`- und `.eth`-Namen, die zu Schlüsseln auflösen                               |
| Browser                | HTTP-Client eines PDS und eines AppView                                             | Peer-to-Peer-Node in einem normalen Browser-Tab                                    |
| Wichtigster Kompromiss | Vollständige globale Threads und Suche, aber die Aggregation braucht schwere Server | Kein schwerer globaler Index, aber keine vollständige netzwerkweite Sicht          |
