---
title: Bitsocial und Blockchain-basierte soziale Netzwerke
description: Wie Lens, DeSo und Steem soziale Daten oder Regeln auf eine Blockchain legen und warum Bitsocial keine verwendet.
---

# Bitsocial und Blockchain-basierte soziale Netzwerke

Lens, DeSo und Steem legen soziale Aktivität jeweils auf eine Blockchain. Konten, Follows, Beiträge
oder die Regeln dafür werden zu Transaktionen, die Validatoren ordnen und speichern. Bitsocial
verwendet keine Blockchain: Soziale Medien brauchen keine globale Reihenfolge für jeden Beitrag,
deshalb verzichtet Bitsocial auf Konsens, Gas und Staking. Die Begründung steht unter
[Peer-to-Peer-Protokoll](/peer-to-peer-protocol/).

## Was sie gemeinsam haben

- **Für jeden Schreibvorgang zahlt jemand.** Lens verlangt Gas, das Apps sponsern können; DeSo
  erhebt bei jeder Aktion eine Gebühr; Steem rationiert Aktionen über gestakte Token.
- **Die Chain legt eine Spam-Richtlinie für alle fest.** Gebühren, Stake und Kontokosten gelten
  netzwerkweit, statt von jeder Community selbst gewählt zu werden.
- **On-Chain-Einträge sind dauerhaft.** Apps können Inhalte ausblenden, aber nicht von der Chain
  entfernen.
- **Browser sind API-Clients.** Web-Apps signieren Transaktionen und lesen über einen Node, einen
  Indexer oder eine API, die jemand anderes betreibt.

## Lens

[Lens](https://lens.xyz/) läuft auf Lens Chain, einem mit dem ZK Stack von ZKsync gebauten
Ethereum-Layer-2, das Avail für die Datenverfügbarkeit nutzt. Mask Network
[betreut Lens seit Januar 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Auf der Chain:** Konten sind Smart Contracts, Benutzernamen sind NFTs innerhalb von Namespaces,
  und Graphen, Gruppen, Feeds und ihre Regeln sind ebenfalls Contracts.
- **Außerhalb der Chain:** Text und Medien eines Beitrags liegen in einer JSON-Datei unter einer
  URI, meist auf Grove, dem Speicherdienst von Lens vor IPFS. Reaktionen und Lesezeichen verwaltet
  die Lens API, und Apps lesen über diese API.
- **Spam und Hürden:** Transaktionen brauchen Gas in GHO, das Apps mit Ratenlimits sponsern können.
  Feed- und Gruppenregeln können Token-Bestände oder Zahlungen verlangen.
- **Betrieb der Chain:** [L2BEAT](https://l2beat.com/scaling/projects/lens) stuft Lens Chain als
  Validium der Stage 0 mit einem zentralisierten Betreiber ein, der die Aufnahme von Transaktionen
  verweigern kann.

## DeSo

[DeSo](https://docs.deso.org/) ist eine Layer-1-Blockchain, die für soziale Apps gebaut wurde. Im
Juli 2024 wechselte sie von Proof of Work zu Proof of Stake.

- **Auf der Chain:** Profile, Beiträge, Likes, Follows und Direktnachrichten sind allesamt
  Transaktionen, die jeder Full Node speichert. Bilder und Videos werden Off-Chain gehostet; der
  Referenz-Node nutzt Google Cloud Storage und Cloudflare Stream.
- **Spam:** Jede Aktion kostet eine Gebühr in DESO. Neue Nutzer erhalten meist nach einer
  Telefonverifizierung Start-DESO von einem Node.
- **Moderation:** Jeder Node entscheidet per Blacklisting oder Graylisting, was er anzeigt, aber
  [die Inhalte bleiben On-Chain](https://docs.deso.org/deso-blockchain/content-moderation).
- **Communities:** Die Dokumentation beschreibt kein Community- oder Forenprimitiv; eine „Community“
  ist ein Feed, den eine App kuratiert.
- **Node-Betrieb:** Validatoren brauchen laut
  [Validator-Leitfaden](https://docs.deso.org/deso-validators/run-a-validator) mindestens 32 GB RAM
  und 200 GB Festplattenspeicher.

## Steem

[Steem](https://steem.com/) ist eine soziale Blockchain, die Autoren und Kuratoren in Token bezahlt,
mit [Steemit](https://steemit.com/) als wichtigster Blogging-App. Hive spaltete sich 2020 von Steem
ab; laut [Hives Whitepaper](https://hive.io/whitepaper.pdf) folgte die Abspaltung auf den Verkauf
von Steemit Inc. an Justin Sun.

- **Auf der Chain:** Textbeiträge, Kommentare, Stimmen und ihr Bearbeitungsverlauf, geordnet von 21
  gewählten Witnesses, die alle drei Sekunden einen Block erzeugen. Bilder werden Off-Chain
  gehostet.
- **Spam:** Aktionen verbrauchen Resource Credits, die mit gestaktem STEEM wachsen. Das Anlegen
  eines Kontos kostet STEEM; Steemit übernimmt diese Kosten für Nutzer, die eine E-Mail-Adresse und
  eine Telefonnummer verifizieren.
- **Communities:** Sie sind
  [benutzerdefinierte Operationen, die ein Indexer interpretiert](https://github.com/steemit/hivemind/blob/master/docs/communities.md),
  außerhalb des Konsenses. Moderatoren können Beiträge stummschalten, was sie in Apps ausblendet,
  aber On-Chain belässt.
- **Belohnungen:** Inflation finanziert die Belohnungen, und nach Stake gewichtete Stimmen
  entscheiden über ihre Aufteilung, sodass große Halter prägen, was Aufmerksamkeit bekommt.

## Vergleich

| Frage                  | Lens                                                                                       | DeSo                                                                                 | Steem                                                                   | Bitsocial                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Chain                  | Ethereum-Layer-2 (ZK-Stack-Validium)                                                       | Eigene Layer 1, Proof of Stake                                                       | Eigene Chain, Delegated Proof of Stake                                  | Keine                                                                                                           |
| Beitragsinhalte        | Off-Chain-JSON, meist auf Grove                                                            | Text On-Chain; Medien Off-Chain                                                      | Text On-Chain; Bilder Off-Chain                                         | Auf dem Node des Community-Eigentümers und bei den Peers, die sie lesen und seeden                              |
| Identität              | Smart-Contract-Konto; Benutzernamen als NFTs                                               | Schlüsselpaar mit On-Chain-Profil                                                    | Benanntes Chain-Konto mit abgestuften Schlüsseln                        | Ed25519-Schlüsselpaare für Nutzer und Communities                                                               |
| Communities            | Gruppen und Feeds als Contracts mit Regeln                                                 | Kein Community-Primitiv                                                              | Vom Indexer interpretierte Communities außerhalb des Konsenses          | Vollwertige Objekte, deren Node Beiträge annimmt oder ablehnt                                                   |
| Spam-Abwehr            | Gas (oft gesponsert), Token- oder Zahlungsregeln                                           | Gebühr für jede Aktion; Startguthaben nach Telefonprüfung                            | Resource Credits aus Stake; kostenpflichtige Kontoerstellung            | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird                                       |
| Moderation             | Gruppen-Admins, On-Chain-Regeln, Ausblenden auf API-Ebene                                  | Jeder Node filtert, was er anzeigt                                                   | Community-Stummschaltungen, nach Stake gewichtete Downvotes, App-Filter | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen                              |
| Betrieb                | Chain-Betreiber plus Lens API und Grove                                                    | Validatoren mit mindestens 32 GB RAM                                                 | Gewählte Witnesses plus API- und Indexer-Nodes                          | Ein Community-Node auf Consumer-Hardware, plus helfende Seeder                                                  |
| Wichtigster Kompromiss | Programmierbare On-Chain-Regeln, aber Inhalte und Lesezugriffe hängen von Lens-Diensten ab | Offener Datenpool, aber jede Aktion kostet eine Gebühr und bleibt für immer erhalten | Eingebaute Belohnungen, aber Stake prägt Sichtbarkeit und Governance    | Keine Gebühren und kein Stake, aber keine globale Reihenfolge, und alte Inhalte sind nicht dauerhaft garantiert |
