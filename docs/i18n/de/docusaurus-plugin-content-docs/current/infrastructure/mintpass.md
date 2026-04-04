---
title: Mintpass
description: NFT-basiertes Authentifizierungssystem, das Bitsocial-Communitys dabei hilft, Benutzer zu verifizieren und Sybil-Angriffe zu reduzieren.
sidebar_position: 2
---

# Mintpass

Mintpass ist ein NFT-basiertes Authentifizierungssystem für Bitsocial-Communitys. Benutzer prägen einen nicht übertragbaren Verifizierungs-NFT, nachdem sie eine Herausforderung (z. B. SMS-OTP) abgeschlossen haben, und Communities können den NFT-Eigentum überprüfen, um sich vor Sybil-Angriffen wie Fake-Votes, Ban-Umgehung und Spam zu schützen.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Lizenz**: MIT

## Wie es funktioniert

Der Verifizierungsablauf besteht aus vier Schritten:

1. **Anfrage** – Der Benutzer besucht `mintpass.org/request`, um den Prozess zu starten.
2. **Herausforderung** – Der Benutzer führt eine SMS-Einmalkennwortüberprüfung durch.
3. **Mint** – Nach erfolgreicher Verifizierung wird ein nicht übertragbarer NFT auf das Wallet des Benutzers geprägt.
4. **Verifizieren** – Communities fragen den NFT-Inhaber ab, um zu bestätigen, dass der Benutzer verifiziert wurde.

Da der NFT nicht übertragbar ist, bleibt er an die Wallet gebunden, die die Verifizierung abgeschlossen hat, wodurch Benutzer daran gehindert werden, ihren verifizierten Status zu handeln oder zu verkaufen.

## Projektstruktur

Das Repository ist in drei Hauptbereiche unterteilt:

| Verzeichnis  | Zweck                                                   |
| ------------ | ------------------------------------------------------- |
| `contracts/` | Solidity Smart Contracts für die Verifizierung von NFT. |
| `challenge/` | Integrationsschicht für das Bitsocial-Challenge-System. |
| `web/`       | Next.js und React-Frontend für den Minting-Flow.        |

## Datenschutz und Datenverarbeitung

Mintpass verfolgt einen Ansatz mit minimalen Daten:

- **Betriebsdaten** (OTP-Codes, Sitzungstoken) werden in Redis mit kurzen TTLs gespeichert und laufen automatisch ab.
- **Mint Association** (die Verbindung zwischen einer verifizierten Identität und einer Wallet) ist der einzige dauerhafte Datensatz.

Nach dem Schließen des Verifizierungsfensters werden keine Telefonnummern oder persönlichen Daten gespeichert.

## Optionale Sicherheitsebenen

Community-Betreiber können abhängig von ihrem Bedrohungsmodell zusätzliche Schutzmaßnahmen aktivieren:

- **IP-Reputationsprüfungen** – Vergleichen Sie eingehende Anfragen mit Datenbanken mit bekanntem Missbrauch.
- **Beurteilung des Telefonrisikos** – Markieren Sie Einweg- oder VoIP-Nummern, bevor Sie eine Anfechtung aussprechen.
- **Geoblocking** – Beschränken Sie die Überprüfung auf bestimmte Regionen.
- **Abklingzeiten pro IP** – Ratenbegrenzung wiederholter Verifizierungsversuche von derselben Adresse aus.

## Technologie-Stack

| Schicht  | Technologie                                       |
| -------- | ------------------------------------------------- |
| Verträge | Solidität, bereitgestellt mit Hardhat und Foundry |
| Frontend | Next.js + Reagieren                               |
| Network  | Basis (Ethereum L2)                               |

Der Einsatz auf Base hält die Gaskosten niedrig und übernimmt gleichzeitig die Sicherheitsgarantien von Ethereum.

## Roadmap

Zu den geplanten Verbesserungen gehören:

- **Pay-to-Mint-Option** – Erlauben Sie Gemeinden, eine geringe Gebühr für die Prägung zu verlangen, was eine wirtschaftliche Barriere darstellt.
- **Zusätzliche Verifizierungssignale** – Erweitern Sie über SMS hinaus auf andere Identitätssignale.
- **Erweiterte Admin-Tools** – Umfangreichere Dashboards und Steuerelemente für Community-Betreiber.
