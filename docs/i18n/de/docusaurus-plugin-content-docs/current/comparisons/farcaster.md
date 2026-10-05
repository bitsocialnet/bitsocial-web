---
title: Bitsocial und Farcaster
description: Wie sich Farcaster, mit On-Chain-Konten, Speichermiete und dem Validator-Netzwerk Snapchain, von den Peer-to-Peer-Communities von Bitsocial unterscheidet.
---

# Bitsocial und Farcaster

[Farcaster](https://docs.farcaster.xyz/) hält die Identität auf einer Blockchain und die sozialen
Daten außerhalb davon. Konten, App-Schlüssel und Speicherzahlungen liegen in Contracts auf OP
Mainnet, einem Ethereum-Layer-2. Beiträge, sogenannte Casts, sowie Follows und Reaktionen sind
signierte Nachrichten, die von [Snapchain](https://snapchain.farcaster.xyz/) gespeichert werden,
einem blockchainähnlichen Netzwerk, das 2025 das frühere Hub-Netzwerk von Farcaster abgelöst hat.

## Wie Farcaster funktioniert

- **Konten.** Ein Konto ist eine numerische Farcaster-ID im Besitz einer Ethereum-Adresse, die
  außerdem eine Wiederherstellungsadresse festlegen kann. Apps posten mit delegierten
  App-Schlüsseln, die On-Chain registriert sind; ein App-Schlüssel kann das Konto nicht übernehmen.
- **Speichermiete.** Jedes Konto mietet Speichereinheiten, derzeit für 0,20 US-Dollar pro Einheit
  und Jahr. Eine seit Juli 2025 gemietete Einheit fasst 100 Casts; darüber hinaus werden die
  ältesten Casts entfernt. Ratenlimits skalieren mit dem gemieteten Speicher.
- **Snapchain.** Validatoren ordnen Nachrichten mit Konsens im Stil von Tendermint in Blöcke, und
  jeder Full Node hält die Daten des gesamten Netzwerks. Nodes brauchen laut
  [Node-Leitfaden](https://snapchain.farcaster.xyz/getting-started) etwa 16 GB RAM und 2 TB
  Speicher.
- **Namen.** Standard-Benutzernamen, sogenannte fnames, sind kostenlos und werden vom eigenen
  Namensserver von Farcaster vergeben, der
  [sie widerrufen kann](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Nutzer können
  stattdessen einen auf Ethereum registrierten `.eth`-Namen verwenden.
- **Channels.** Themen-Channels sind eine experimentelle Funktion des Farcaster-Clients. Casts in
  einem Channel sind Protokolldaten, aber Channel-Metadaten, Follows und Moderation werden
  [im Client gespeichert](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Lesen.** Apps lesen über einen selbst betriebenen Snapchain-Node oder einen verwalteten
  Anbieter, meist Neynar.

## Wo sie sich unterscheiden

### Blockchains und Validatoren

Farcaster ist für Konten und Zahlungen auf OP Mainnet angewiesen und für die Ordnung aller sozialen
Daten auf Snapchain, ein blockchainähnliches Netzwerk. Die Validatorenmenge von Snapchain ist
zugangsbeschränkt. Laut dem Whitepaper von Snapchain wird Zensur mit etwa zehn global verteilten
Validatoren schwierig; im Oktober 2026 war die
[Validatorenliste](https://snapchain.farcaster.xyz/validators) kleiner, und die meisten Schlüssel
gehörten Neynar, das im Januar 2026
[Farcaster übernommen hat](https://neynar.com/blog/neynar-is-acquiring-farcaster). Bitsocial hat
weder Chain noch Validatoren oder Konsens.

### Bezahlen fürs Posten

Jedes Farcaster-Konto zahlt Speichermiete, und der Speicher begrenzt, wie viel vom Verlauf eines
Kontos das Netzwerk aufbewahrt. Bei Bitsocial kostet das Posten auf Protokollebene nichts; jede
Community entscheidet, ob sie ein Captcha, eine Zahlung, einen Token oder etwas anderes verlangt.
Siehe [Benutzerdefinierte Anti-Spam-Herausforderungen](/custom-challenges/).

### Communities

Farcaster-Channels sind eine Client-Funktion: Der Client speichert ihre Metadaten und setzt die
Channel-Moderation durch, sodass ein in einem Channel blockierter Cast im Netzwerk gültig und in
anderen Apps sichtbar bleiben kann. Bei Bitsocial sind Communities Protokollobjekte mit eigenem
Schlüsselpaar, und der Node der Community nimmt Beiträge an oder lehnt sie ab.

### Betrieb der Infrastruktur

Ein Farcaster-Node hält das gesamte Netzwerk, sein Speicherbedarf wächst also mit jeder Aktivität;
Farcaster rechnet mit einem Wachstum bis an die Grenze der größten Cloud-Festplatten. Ein
Bitsocial-Community-Node hält nur seine eigenen Communities und läuft auf Consumer-Hardware.

### Browser

Eine Farcaster-Browser-App ist ein HTTP-Client eines Nodes oder Anbieters. Eine Bitsocial-Web-App
kann einen Peer-to-Peer-Node im Tab betreiben. Siehe [Browser-Peer-to-Peer](/browser-p2p/).

## Vergleich

| Frage                  | Farcaster                                                                                   | Bitsocial                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Kategorie              | On-Chain-Identität mit von Validatoren geordneten sozialen Daten                            | Peer-to-Peer-Community-Netzwerk                                                                               |
| Identität              | Farcaster-ID im Besitz einer Ethereum-Adresse, mit delegierten App-Schlüsseln               | Ed25519-Schlüsselpaare für Nutzer und Communities                                                             |
| Wo Beiträge liegen     | Snapchain, auf jeden Full Node repliziert, innerhalb bezahlter Speichergrenzen              | Der Node des Community-Eigentümers und die Peers, die sie lesen und seeden                                    |
| Wer hält es online     | Snapchain-Validatoren und Node-Betreiber                                                    | Node des Community-Eigentümers plus helfende Seeder                                                           |
| Communities            | Experimentelle Channels, vom Farcaster-Client verwaltet                                     | Vollwertige Objekte, deren Node Beiträge annimmt oder ablehnt                                                 |
| Spam-Abwehr            | Speichermiete und Ratenlimits, plus Spam-Labels auf App-Ebene                               | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird                                     |
| Moderation             | Channel-Hosts im Client, App-Filter, Zensurrisiko auf Validator-Ebene                       | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen                            |
| Namen                  | Kostenlose fnames, die Farcaster widerrufen kann, oder `.eth`-Namen                         | `.bso`- und `.eth`-Namen, die zu Schlüsseln auflösen                                                          |
| Browser                | HTTP-Client eines Nodes oder Anbieters                                                      | Peer-to-Peer-Node in einem normalen Browser-Tab                                                               |
| Wichtigster Kompromiss | Ein konsistenter globaler Datenbestand, aber Miete, Chains und eine kleine Validatorenmenge | Keine Gebühren oder Chains, aber kein globaler Datenbestand, und alte Inhalte sind nicht dauerhaft garantiert |
