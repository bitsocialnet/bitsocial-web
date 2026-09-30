---
title: BSO-Token-Historie
description: Die vollständige Generationsgeschichte des BSO-Tokens, vom Ursprung 2021 auf Avalanche bis zum heutigen unveränderlichen, adminlosen Ethereum-Vertrag.
---

# BSO-Token-Historie

BSO ist ein Token, dessen Wert an seiner Herkunft hängt. Das Protokoll hinter Bitsocial ist offen,
und Token wie Chain sind bewusst optional: Jeder kann den Code forken, einen eigenen Client
betreiben oder eine eigene Ökonomie darauf aufbauen. Was sich nicht wegforken lässt, ist die
Herkunft. BSO ist seit dem ersten Tag der offizielle Bitsocial-Token, und jede Migration seitdem ist
on-chain nachprüfbar.

Diese Seite listet jede Generation des Tokens der Reihe nach auf, mit vollständigen
Vertragsadressen, damit jeder die Belege unabhängig prüfen kann.

## Gen 1: der Ursprung, Avalanche, 2021

- **Chain**: Avalanche
- **Jahr**: 2021
- **Adresse**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorer**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Hier hat BSO angefangen. Das Angebot wurde über drei Airdrops und Liquidity-Mining-Belohnungen verschenkt, ohne Presale und ohne Team-Anteil, der vor der Community abgezweigt wurde. Der Vertrag war ein aktualisierbarer Proxy, was
damals gängige Praxis war und dem Team erlaubte, in der Frühphase des Tokens Korrekturen
auszuliefern.

## Gen 2: der Wechsel zu Ethereum, 2024

- **Chain**: Ethereum
- **Jahr**: 2024
- **Adresse**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 brachte BSO von Avalanche zu Ethereum, wo der Rest der Roadmap für Bitsocial Chain entsteht.
Wie schon Gen 1 war auch dieser Vertrag ein aktualisierbarer Proxy, der für eine weitere Generation
beibehalten wurde, während der endgültige, dauerhafte Vertrag vorbereitet wurde.

## Gen 3: vollständig unveränderlich, 2025

- **Chain**: Ethereum
- **Jahr**: 2025
- **Adresse**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 ist der aktuelle und endgültige BSO-Vertrag. Er ist vollständig unveränderlich und ohne Admin:

- keine Mint-Funktion, das Angebot lässt sich also nicht aufblähen
- keine Owner-Adresse, niemand kann also im Alleingang das Verhalten des Vertrags ändern
- keine Pause-Funktion, Transfers lassen sich also nicht einfrieren
- kein Proxy-Muster, die Logik selbst lässt sich also später nicht austauschen

Das ist der Endzustand, auf den die ersten beiden Generationen hingearbeitet haben: ein Token, für
den keine Admin-Schlüssel mehr existieren.

## Wie die Migrationen abliefen

Jede Migration, von Gen 1 zu Gen 2 und von Gen 2 zu Gen 3, war ein passiver Airdrop im Verhältnis
1:1. Halter mussten keinen Anspruch einreichen, keine Nachricht signieren und überhaupt nichts tun.
Die Guthaben des alten Vertrags wurden direkt ausgelesen und 1:1 auf den neuen Vertrag gespiegelt,
sodass die Position eines Halters über die Migration hinweg exakt erhalten blieb.

Da sowohl die alten als auch die neuen Verträge weiterhin öffentlich und on-chain sind, ist jeder
Schritt dieses Vorgangs unabhängig nachprüfbar. Jeder kann historische Halter-Snapshots aus Gen 1
oder Gen 2 mit den heutigen Guthaben aus Gen 3 vergleichen und bestätigen, dass die Migration genau
das getan hat, was sie zu tun beanspruchte. Kein Teil dieser Geschichte beruht darauf, Bitsocial
beim Wort zu nehmen.

## Prüfen Sie alles nach

Nehmen Sie nichts davon auf Treu und Glauben hin. Sehen Sie sich die Belege direkt an:

- Gen 1 auf [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 auf [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 auf [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- die aktuelle Chain-Website unter [chain.bitsocial.net](https://chain.bitsocial.net)

Stimmt eine Adresse nicht mit den hier aufgeführten überein, handelt es sich nicht um den offiziellen
BSO-Token.
