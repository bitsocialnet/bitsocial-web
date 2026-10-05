---
title: Bitsocial und Mirage
description: Wie sich Mirage, ein Forum im Reddit-Stil auf einer eigenen Cosmos-SDK-Blockchain, von Bitsocial und seiner Reddit-ähnlichen App Seedit unterscheidet.
---

# Bitsocial und Mirage

[Mirage](https://mirage.foundation/) ist ein Diskussionsnetzwerk im Reddit-Stil mit Communities,
Beiträgen mit verschachtelten Antworten und Abstimmungen. Statt auf einer Unternehmensdatenbank
läuft es auf einer eigenen Blockchain, einer Cosmos-SDK-Chain mit CometBFT-Konsens. Das
Bitsocial-Produkt, das Mirage am nächsten kommt, ist [Seedit](/apps/seedit/), eine App im
Reddit-Stil im Bitsocial-Netzwerk; im Vergleich geht es daher vor allem darum, wie beide Communities
hosten, besitzen und moderieren.

## Wie Mirage funktioniert

- **Nodes.** Ein Mirage-Node ist ein einzelner Docker-Container mit einem Validator, einer
  PostgreSQL-Datenbank, einem Indexer, einer HTTP-API und dem Web-Frontend. Jeder Node ist zugleich
  ein Validator. Für den Betrieb braucht man laut
  [Deploy-Leitfaden](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md)
  einen Ubuntu-Server auf amd64 und 10.000.000 MIRAGE-Token im Konto des Betreibers.
- **Posten.** Der Browser signiert jede Aktion mit dem secp256k1-Schlüssel des Nutzers, und
  kostenlose Nutzer berechnen zusätzlich einen kleinen Proof of Work. Der Node verpackt die Aktion
  in eine Chain-Transaktion und zahlt die Gebühr.
- **Lesen.** Der Indexer jedes Nodes kopiert Chain-Daten in seine eigene Datenbank und liefert Feeds
  über eine HTTP-API aus. Nodes bewahren etwa eine Woche an Blöcken auf, daher liegt der
  langfristige Beitragsverlauf in der Datenbank des jeweiligen Nodes, und ein neuer Node startet
  ohne den Verlauf vor seinem Synchronisationspunkt.
- **Konten.** Ein Konto ist ein Schlüssel, der aus einer Seed-Phrase mit 12 Wörtern abgeleitet wird,
  und dieselbe Seed-Phrase funktioniert auf jedem Node. Benutzernamen werden auf der Chain erfasst
  und sind netzwerkweit eindeutig.
- **Communities.** Jeder gültige Name ist bereits eine Community, und niemand besitzt sie. Bezahlte
  Kuratorenteams aus bis zu zehn Nutzern pflegen jeweils eine moderierte Ansicht einer Community;
  Leser wählen die Ansicht eines Teams, die Standardansicht des Nodes oder eine unzensierte Ansicht.
  Siehe die [Mirage-FAQ](https://mirage.talk/faq).
- **Token.** Der MIRAGE-Token bezahlt Abonnements, belohnt Autoren und Nodes und verleiht
  Validatoren Stimmgewicht in der Governance. Abonnenten überspringen den Proof of Work und erhalten
  höhere Limits.

## Wo sie sich unterscheiden

### Wem eine Community gehört

In Seedit hält der Ersteller einer Community deren Schlüsselpaar, betreibt ihren Node oder delegiert
ihn und moderiert sie. In Mirage gehört eine Community niemandem: Konkurrierende Kuratorenteams
bieten moderierte Ansichten desselben Namens an, und die Standardansicht ist die des Teams, das die
meisten zahlenden Abonnenten gewählt haben.

### Spam-Abwehr

Mirage wendet eine einzige Regel auf das gesamte Netzwerk an: Kostenlose Nutzer zahlen mit Proof of
Work, dessen Schwierigkeit sich an das eingehende Volumen anpasst, und Abonnenten überspringen ihn.
Bei Bitsocial wählt jede Community ihre eigene Challenge, von Captchas über Allowlists bis zu
Zahlungen. Siehe [Benutzerdefinierte Anti-Spam-Herausforderungen](/custom-challenges/).

### Infrastruktur

Mirage braucht eine Blockchain. Validatoren erzielen Konsens über jede Aktion, und jeder Node
betreibt einen vollständigen Server-Stack und muss einen großen Token-Stake halten. Bitsocial hat
keine Chain: Ein Community-Node läuft auf Consumer-Hardware über die Desktop-App oder
`bitsocial-cli`, und Leser können beim Verteilen von Inhalten helfen.

### Netzwerkweite Kontrolle

Mirage hat eine On-Chain-Governance, die nach Validator-Stake gewichtet ist. Sie kann Schwierigkeit,
Preise und Token-Emission ändern, Token prägen oder verbrennen und Admins ernennen, deren Löschungen
der Referenz-Indexer auf jeden Beitrag anwendet. Der Chain-Code erlaubt der Governance außerdem,
[Konten zu löschen](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
und
[Token von jeder beliebigen Adresse zu senden](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
Im Oktober 2026 erzeugten vier Validatoren die Blöcke der Chain, und die projekteigenen Runbooks
verwalteten alle vier.

Bitsocial hat keinen Administrator auf Protokollebene. Community-Eigentümer moderieren ihre eigenen
Communities, und Apps entscheiden, was sie anzeigen. Siehe
[Lokale Moderation, keine globalen Sperren](/local-moderation/).

### Browser

Der Web-Client von Mirage ist ein HTTP-Client eines Nodes: Der Browser signiert Aktionen, tritt aber
keinem Peer-to-Peer-Netzwerk bei. Bitsocial-Apps können einen Peer-to-Peer-Node im Browser-Tab
betreiben. Siehe [Browser-Peer-to-Peer](/browser-p2p/).

## Vergleich

| Frage                  | Mirage                                                                                                                                    | Bitsocial                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Kategorie              | Forum auf eigener Blockchain (Cosmos SDK)                                                                                                 | Peer-to-Peer-Community-Netzwerk                                                                                    |
| Identität              | secp256k1-Schlüssel aus einer Seed-Phrase mit 12 Wörtern, mit On-Chain-Benutzernamen                                                      | Ed25519-Schlüsselpaare für Nutzer und Communities                                                                  |
| Wo Beiträge liegen     | Chain-Transaktionen, danach die PostgreSQL-Datenbank jedes Nodes                                                                          | Der Node des Community-Eigentümers und die Peers, die sie lesen und seeden                                         |
| Wer hält es online     | Validator-Nodes, die jeweils 10.000.000 MIRAGE halten                                                                                     | Node des Community-Eigentümers plus helfende Seeder                                                                |
| Communities            | Namen ohne Eigentümer mit konkurrierenden bezahlten Kuratorenteams                                                                        | Im Besitz eines Schlüsselpaars; der Node des Eigentümers nimmt Beiträge an oder lehnt sie ab                       |
| Spam-Abwehr            | Netzwerkweiter Proof of Work; Abonnenten überspringen ihn                                                                                 | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird                                          |
| Moderation             | Ansichten der Kuratorenteams, persönliche Filter, von der Governance ernannte Admins                                                      | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen                                 |
| Ökonomie               | MIRAGE-Token für Abonnements, Belohnungen und Validator-Stake                                                                             | Keine im Protokoll; eine Challenge kann eine Zahlung oder einen Token verlangen                                    |
| Browser                | HTTP-Client eines Nodes                                                                                                                   | Peer-to-Peer-Node in einem normalen Browser-Tab                                                                    |
| Wichtigster Kompromiss | Ein gemeinsamer, geordneter Zustand und einfache Registrierung, aber eine kleine Validatorenmenge und netzwerkweite Governance-Befugnisse | Keine Chain und kein Stake nötig, aber keine globale Reihenfolge, und alte Inhalte sind nicht dauerhaft garantiert |
