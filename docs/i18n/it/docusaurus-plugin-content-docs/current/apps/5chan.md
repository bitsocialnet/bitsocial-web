---
title: 5chan
description: Una imageboard serverless e decentralizzata costruita sul protocollo Bitsocial in cui chiunque può creare e possedere bacheche.
sidebar_position: 1
---

# 5chan

5chan è un imageboard serverless, adminless e completamente decentralizzato che funziona sul protocollo Bitsocial. Segue la struttura familiare delle directory dell'imageboard introducendo la proprietà decentralizzata: chiunque può creare una bacheca e più bacheche possono competere per lo stesso spazio nella directory attraverso un meccanismo di voto.

## Download

| Piattaforma | Collegamento                         |
| ----------- | ------------------------------------ |
| Rete        | [5chan.app](ZXQPLACEholder0ZXQ       |
| Scrivania   | Disponibile per Mac, Windows e Linux |
| Cellulare   | Disponibile per Android              |

## Come funzionano le schede

5chan organizza i contenuti in schede utilizzando un layout di directory classico (ad esempio, `/b/`, ZXQPLACEholder1ZXQ). A differenza delle imageboard tradizionali in cui un amministratore centrale controlla ogni scheda, 5chan consente a qualsiasi utente di creare e possedere completamente la propria scheda. Quando più consigli di amministrazione prendono di mira lo stesso spazio nella directory, competono per quella posizione attraverso il voto.

### Creazione di una tavola

Per creare una nuova scheda, è necessario eseguire `bitsocial-cli` come nodo peer-to-peer. Ciò garantisce che la tua scheda sia ospitata in modo decentralizzato senza fare affidamento su alcun server centrale.

### Assegnazioni di directory

Le assegnazioni degli slot di directory (quale scheda appare in quale percorso) sono attualmente gestite tramite richieste pull GitHub al file `5chan-directories.json`. Si tratta di un processo temporaneo: le versioni future supporteranno la creazione di bacheche in-app e la votazione basata su pubsub per gestire automaticamente le assegnazioni delle directory.

## Interni

Sotto il cofano, 5chan utilizza il livello client del protocollo Bitsocial condiviso per le sue interazioni di rete. L'app Web su 5chan.app può anche eseguire un nodo Helia nel browser quando il P2P del browser è abilitato da Impostazioni avanzate, in modo che i lettori possano caricare da peer senza un gateway IPFS centralizzato. Vedi la sezione P2P del browser nelle note sul protocollo peer-to-peer.

## Collegamenti

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegramma**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licenza**: solo GPL-2.0
