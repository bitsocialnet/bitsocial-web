---
title: React Hooks
description: Libreria React hooks per la creazione di applicazioni social decentralizzate sul protocollo Bitsocial.
sidebar_position: 1
---

# React Hooks

:::warning Legacy Naming
Questo pacchetto attualmente utilizza convenzioni di denominazione legacy ereditate dal suo fork upstream. I riferimenti a "plebbit" nel codice, nelle API e nella configurazione verranno migrati a "bitsocial" in una versione futura. La funzionalità non è influenzata.
:::

Il pacchetto `bitsocial-react-hooks` fornisce un'API familiare di hook React per interagire con il protocollo Bitsocial. Gestisce il recupero di feed, commenti e profili degli autori, la gestione degli account, la pubblicazione di contenuti e l'iscrizione alle comunità, il tutto senza fare affidamento su un server centrale.

Questa libreria è l'interfaccia principale utilizzata da [5chan](/apps/5chan/) e altre applicazioni client Bitsocial.

:::note
`bitsocial-react-hooks` è un fork temporaneo di `plebbit/plebbit-react-hooks` mantenuto per lo sviluppo assistito dall'intelligenza artificiale. Viene consumato direttamente da GitHub anziché pubblicato su npm.
:::

## Installazione

Poiché il pacchetto non è ancora su npm, installalo direttamente da GitHub, aggiungendolo a un hash di commit specifico:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Sostituisci `<commit-hash>` con il commit che desideri scegliere come target.

## Panoramica dell'API

Gli hook sono organizzati in categorie funzionali. Di seguito è riportato un riepilogo degli hook più comunemente utilizzati in ciascuna categoria. Per firme complete, parametri e tipi restituiti, consultare il [riferimento API completo su GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Account

Gestisci account utente locali, identità e impostazioni.

- `useAccount(accountName?)` -- restituisce l'oggetto account attivo (o denominato)
- `useAccounts()` -- restituisce tutto archiviato localmente account
- `useAccountComments(options?)` -- restituisce i commenti pubblicati dall'account attivo

### Commenti

Recupera e interagisce con singoli commenti e thread.

- `useComment(commentCid?)` -- recupera un singolo commento in base al relativo CID
- `useComments(commentCids?)` -- recupera più commenti in batch
- `useEditedComment(comment?)` -- restituisce l'ultima versione modificata di un commento.

### Comunità

Recupera metadati e impostazioni della comunità.

- `useSubplebbit(subplebbitAddress?)` -- recupera una comunità in base all'indirizzo
- `useSubplebbits(subplebbitAddresses?)` -- recupera più comunità
- `useSubplebbitStats(subplebbitAddress?)` -- restituisce il numero di iscritti e di post

### Autori

Cerca i profili e i metadati dell'autore.

- `useAuthor(authorAddress?)` -- recupera un profilo dell'autore
- `useAuthorComments(options?)` -- restituisce i commenti di un autore specifico
- `useResolvedAuthorAddress(authorAddress?)` -- risolve un indirizzo leggibile dall'uomo (ad esempio, ENS) nel suo indirizzo di protocollo

### Feed

Iscriviti e impagina feed di contenuti.

- `useFeed(options?)` -- restituisce un feed impaginato di post da una o più community
- `useBufferedFeeds(feedOptions?)` -- pre-bufferizza più feed per un rendering più veloce
- `useAuthorFeed(authorAddress?)` -- restituisce un feed di post di un autore specifico

### Azioni

Pubblica contenuto ed esegui la scrittura operazioni.

- `usePublishComment(options?)` -- pubblica un nuovo commento o risposta
- `usePublishVote(options?)` -- invia un voto positivo o negativo
- `useSubscribe(options?)` -- iscriviti o annulla l'iscrizione a una comunità

### Stati e RPC

Monitora lo stato della connessione e interagisci con un Bitsocial remoto daemon.

- `useClientsStates(options?)` -- restituisce lo stato di connessione dei client IPFS/pubsub
- `usePlebbitRpcSettings()` -- restituisce la configurazione corrente del demone RPC

## Sviluppo

Per lavorare sulla libreria hook localmente:

**Prerequisiti:** Node.js, Corepack abilitato, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Fare riferimento al file README del repository per i comandi di test e creazione.

## Link

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licenza:** Solo GPL-2.0
