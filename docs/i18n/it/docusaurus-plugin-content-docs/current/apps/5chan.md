---
title: 5chan
description: Un imageboard serverless e decentralizzato, costruito sul protocollo Bitsocial, in cui chiunque può creare e possedere board.
sidebar_position: 1
---

# 5chan

5chan è un imageboard serverless, senza amministrazione e completamente decentralizzato, che gira sul protocollo Bitsocial. Mantiene la familiare struttura a directory degli imageboard, introducendo però la proprietà decentralizzata: chiunque può creare una board, e più board possono competere per lo stesso slot di directory attraverso un meccanismo di voto.

## Download

| Piattaforma | Collegamento                         |
| ----------- | ------------------------------------ |
| Web         | [5chan.app](https://5chan.app)       |
| Desktop     | Disponibile per Mac, Windows e Linux |
| Mobile      | Disponibile per Android              |

## Come funzionano le board

5chan organizza i contenuti in board seguendo il classico schema a directory (ad esempio `/b/`, `/g/`). A differenza degli imageboard tradizionali, dove un amministratore centrale controlla ogni board, 5chan permette a qualsiasi utente di creare e possedere interamente la propria board. Quando più board puntano allo stesso slot di directory, competono per quella posizione; vedi [Directory](/directories/).

### Creare una board

Per creare una nuova board devi eseguire `bitsocial-cli` come nodo peer-to-peer. In questo modo la tua board è ospitata in maniera decentralizzata, senza dipendere da alcun server centrale.

### Assegnazione delle directory

Le board candidate di ogni directory sono elencate in un file `5chan-directories/5chan-<code>-directory.json` nel repository [bitsocialnet/lists](https://github.com/bitsocialnet/lists), e una board entra in una directory tramite una pull request a quel file. 5chan gestisce anche una votazione per ogni directory con [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting): ogni titolare di un 5chan Pass ha diritto a un voto, e votare per una board non in elenco equivale a candidarla. Le votazioni si svolgono attualmente sulla testnet Base Sepolia, dove i conteggi vengono mostrati ma non riordinano l'elenco.

## Funzionamento interno

Sotto il cofano, 5chan usa il livello client condiviso del protocollo Bitsocial per le sue
interazioni di rete. La web app su 5chan.app esegue per impostazione predefinita un nodo Helia nel
browser, quindi una normale scheda entra nella rete come peer: carica le board dagli altri peer e
pubblica tramite pubsub, senza alcun gateway IPFS centralizzato nel percorso dei contenuti. Vedi
[Peer-to-peer nel browser](/browser-p2p/) per capire che cosa comporta e che cosa un nodo nel
browser ancora non riesce a fare.

## Link

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licenza**: GPL-2.0-only
