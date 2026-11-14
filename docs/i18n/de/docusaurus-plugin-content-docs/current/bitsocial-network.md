---
title: Bitsocial Chain
description: Phase 3 des Masterplans, mit der vorgeschlagenen Ethereum-L2-Appchain als Wirtschaftsschicht für Bitsocial-Apps.
---

# Bitsocial Chain

Bitsocial Chain ist die vorgeschlagene Wirtschaftsschicht für Bitsocial-Apps, umgesetzt als
Ethereum-L2-Appchain. Die aktuelle Website speziell zur Chain ist
[chain.bitsocial.net](https://chain.bitsocial.net).

Die soziale Peer-to-Peer-Schicht löst Communities, Identitäten und Inhalte aus einer zentralen
Plattformdatenbank heraus. Bitsocial Chain soll die gemeinsamen Bausteine für Namensvergabe,
Monetarisierung und Zahlungen ergänzen, die es schwerer machen, solche Apps finanziell
auszutrocknen.

## Was es ermöglichen soll

- dezentrale Bitsocial-Domains wie `.bso`
- Awards und Trinkgelder
- belastbare Wege zur Monetarisierung
- gemeinsame Liquidität über Apps hinweg
- Finanzstrukturen, die Banken oder Plattformen schwerer abwürgen können
- Netzwerkeffekte, die nicht davon abhängen, dass ein einzelnes Unternehmen den gesamten Stack
  besitzt

Es geht nicht darum, mit Token-Mechanik voranzugehen. Es geht darum, nützliche soziale Apps
belastbarer und leichter finanzierbar zu machen und sie weniger abhängig von zentralisierten
Zahlungs- oder Namensanbietern zu halten.

## Aktueller Proof of Concept

Der erste Proof of Concept von Bitsocial Chain konzentriert sich auf native `.bso`-Namen. Er zeigt,
dass sich ein Namensregister aus der Historie von Ethereum L1 ableiten lässt, ohne soziale Inhalte
on-chain abzulegen:

- Nutzer reichen ihre Absichten zum Registrieren, Aktualisieren, Übertragen und Widerrufen über
  gewöhnliche Ethereum-L1-Transaktionen ein
- jede und jeder kann den Ableitungsknoten betreiben und denselben Registerzustand für `.bso`
  rekonstruieren
- ein Resolver bildet einen `.bso`-Namen auf den öffentlichen Bitsocial-Schlüssel ab, den Clients
  bereits über das Peer-to-Peer-Protokoll verwenden
- Beiträge, Votes, Moderation, Feeds und Community-Inhalte bleiben off-chain und peer-to-peer

Dieser Proof of Concept ist kein produktiver Stage-2-Start. Es gibt bisher weder ein Proof-System
noch ein Challenge-Game, auditierten Code, ein Live-Deployment, endgültige Preise oder eine
endgültige Governance. Die langfristige Ausrichtung ist standardmäßig transparent und von Grund auf
datenschutzverträglich: Die Kern-Chain ist öffentlich, während künftige Trinkgelder, Zahlungen,
Awards und Liquidität keine dauerhafte Verknüpfung zwischen sozialer Identität und Wallet-Historie
erzwingen sollten.

## Warum das wichtig ist

Communities und Identitäten zu dezentralisieren ist notwendig, reicht aber nicht aus, um alle
sozialen Medien zu dezentralisieren.

Wenn soziale Apps weiterhin von einigen wenigen zentralisierten Wirtschaftswegen abhängen, lassen
sie sich nach wie vor leicht unter Druck setzen, von Diensten ausschließen oder finanziell
austrocknen. Bitsocial Chain ist die vorgeschlagene Antwort auf diese zweite Abhängigkeitsebene.

## Verhältnis zu den Apps

Bitsocial Chain soll unter den Bitsocial-Apps liegen und sie nicht ersetzen.

Nach außen sollte das Ergebnis so aussehen:

- Communities bleiben peer-to-peer
- Apps bleiben unterscheidbar
- Nutzer erhalten praktische Funktionen für Namen und Monetarisierung
- Creator und Communities können clientübergreifend unterstützt werden
- Werte können sich im gesamten Ökosystem bewegen, ohne dass ein zentraler Plattformeigentümer neu
  entsteht

## Warum sie nach der Twitter/X-Alternative kommt

Der aktuelle Masterplan setzt Bitsocial Chain hinter die Twitter/X-Alternative, weil diese App die Chain nicht braucht. Profile laufen als Profilknoten über nicht verwahrendes RPC, und `.bso`-Namen können in einem vorläufigen Register im Ethereum-Mainnet starten ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) und später auf die Chain umziehen.

Bitsocial Chain sollte Dezentralisierung nicht gegen einen früheren Start eintauschen. Sie sollte keine Vertrauensannahmen über Ethereum selbst hinaus hinzufügen: keine Upgrade-Schlüssel, keinen Security Council und keinen Betreiber, der sie zensieren oder anhalten kann. Das führende Design dafür, ein nativer Rollup, hängt von einem Ethereum-Upgrade ab, das noch nicht geplant ist. Bis die Chain diesen Maßstab erfüllen kann, baut die Twitter/X-Alternative die Nutzerbasis auf, der die Chain dienen wird.

## Designprinzipien

Da Bitsocial Chain weiterhin vorgeschlagene Infrastruktur und kein gestartetes Produkt ist, sollte
der Plan diszipliniert bleiben:

- Apps und Communities zuerst. Die Netzwerkschicht soll echte soziale Produkte stärker machen.
- Praktische Funktionen zuerst. Namen, Awards, Trinkgelder und Zahlungen lassen sich leichter
  erklären als eine abstrakte Finanzarchitektur.
- Echter Beitrag statt Hype. Ökonomische Bausteine sollen Beteiligung, Aufbauarbeit und
  Community-Unterstützung belohnen.
- Kuratierung ist erlaubt. Apps können Rankings, Voreinstellungen und Discovery so gestalten, dass
  belastbare Communities bevorzugt werden.
- Die genauen Mechaniken bleiben offen. Diese Seite erklärt die Rolle von Bitsocial Chain und ist
  kein festes Versprechen über die endgültige Ökonomie.
