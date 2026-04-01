---
title: 5chan
description: Una imageboard serverless e decentralizzata costruita sul protocollo Bitsocial in cui chiunque può creare e possedere bacheche.
sidebar_position: 1
---

:::warning[Legacy naming]
La base di codice di questo progetto utilizza ancora la denominazione "plebbit" ereditata prima del rebranding di Bitsocial. I nomi dei pacchetti, i riferimenti API e parte della terminologia interna verranno aggiornati in una versione futura. La funzionalità qui descritta è attuale, solo la denominazione è obsoleta.
:::

# 5chan

5chan è un imageboard serverless, adminless e completamente decentralizzato che funziona sul protocollo Bitsocial. Segue la struttura familiare delle directory delle imageboard introducendo la proprietà decentralizzata: chiunque può creare una bacheca e più bacheche possono competere per lo stesso spazio nella directory attraverso un meccanismo di votazione.

## Download

| Piattaforma | Collegamento                         |
| ----------- | ------------------------------------ |
| Rete        | [5chan.app](https://5chan.app)       |
| Desktop     | Disponibile per Mac, Windows e Linux |
| Mobile      | Disponibile per Android              |

## Come funzionano le schede

5chan organizza i contenuti in schede utilizzando un layout di directory classico (ad esempio, `/b/`, `/g/`). A differenza delle imageboard tradizionali in cui L'amministratore centrale controlla ogni bacheca, 5chan consente a qualsiasi utente di creare e possedere completamente la propria bacheca. Quando più bacheche prendono di mira lo stesso slot di directory, competono per quella posizione attraverso il voto.

### Creazione di una bacheca

Per creare una nuova bacheca, è necessario eseguire `bitsocial-cli` come nodo peer-to-peer. Ciò garantisce che la tua bacheca sia ospitata in modo decentralizzato senza fare affidamento su alcun server centrale.

### Directory. assegnazioni

Le assegnazioni degli slot delle directory (quale scheda appare in quale percorso) sono attualmente gestite tramite richieste pull di GitHub al file `5chan-directories.json`. Si tratta di un processo temporaneo: le versioni future supporteranno la creazione di schede in-app e il voto basato su pubsub per gestire automaticamente le assegnazioni delle directory.

## Interni

Nel contesto, 5chan utilizza il livello API plebbit-js per le interazioni del protocollo As notato nell'avviso sopra, questi riferimenti interni portano ancora nomi legacy che precedono il rebranding di Bitsocial.

## Link

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licenza**: solo GPL-2.0
