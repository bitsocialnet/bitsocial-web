---
title: RPC pubblico senza autorizzazione
description: Progettazione proposta per un servizio RPC Bitsocial pubblico con utenti isolati, autorizzazioni con ambito e proprietà della comunità.
---

# RPC pubblico senza autorizzazione

La proposta RPC pubblica originale viveva come un problema di GitHub scritto nella vecchia terminologia plebbit. Questa pagina riscrive quell'idea nel linguaggio Bitsocial e la inquadra come una proposta a livello di prodotto invece che come un muro di dettagli di implementazione.

## Obiettivo in linguaggio semplice

Bitsocial Forge può eseguire un servizio RPC pubblico che consente a molti utenti di gestire le proprie comunità Bitsocial da remoto, senza trasformare l'operatore in un custode di tali comunità.

Il servizio dovrebbe rendere pratici i client mobili e leggeri preservando tre vincoli:

1. Utenti rimangono isolati l'uno dall'altro per impostazione predefinita.
2. Le autorizzazioni rimangono esplicite e granulari.
3. La compatibilità con la forma di richiesta e risposta RPC corrente può essere preservata durante l'implementazione.

## Quale problema risolve

Oggi, il modello RPC più semplice è solitamente tutto o niente: una chiave di autenticazione, un dominio di autorità, accesso completo. Funziona per un singolo operatore ma non per un servizio pubblico multiutente.

Un RPC pubblico senza autorizzazione necessita di un modello più forte:

- un servizio può ospitare molti utenti
- ogni utente ha le proprie comunità e limiti
- le policy definite dall'operatore possono prevenire gli abusi
- l'utente può comunque allontanarsi o ospitarsi autonomamente in seguito

## Core modello

### Utenti

Ogni utente riceve una credenziale di autenticazione più un pacchetto di autorizzazioni.

### Comunità

Le comunità create tramite il servizio vengono assegnate a un record del proprietario. La proprietà viene monitorata in modo esplicito in modo che i metodi di gestione possano essere limitati all'utente giusto.

### Autorizzazioni

Le autorizzazioni sono basate sulle capacità. Invece di un valore booleano per "può utilizzare l'RPC", il server può controllare:

- quante comunità può creare un utente
- quali metodi di gestione sono disponibili
- quali operazioni di pubblicazione sono consentite
- quali limiti di velocità si applicano
- quali superfici di amministrazione sono visibili

### superficie di amministrazione

L'RPC pubblico stesso dovrebbe rimanere concentrato sul comportamento RPC rivolto agli utenti. Le attività amministrative come la creazione dell'utente, il trasferimento della proprietà e la revisione dell'audit appartengono a un'API e a un dashboard dell'operatore separati.

## Posizione di compatibilità

La documentazione rivolta all'utente dovrebbe utilizzare termini Bitsocial come **comunità** e **profilo**.

A livello di rete, la prima implementazione può comunque preservare l'attuale trasporto JSON-RPC e la forma del carico utile laddove ciò sia utile per la compatibilità. In altre parole: i documenti non hanno più bisogno di parlare come i vecchi documenti Plebbit, anche se il periodo di transizione mantiene alcuni nomi di metodi legacy o forme di richiesta dietro le quinte.

## Bundle di permessi proposto

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

I nomi esatti dei metodi sono illustrativi. La parte importante è la forma della policy: le capacità individuali sono controllate in modo indipendente anziché raggruppate in un token superutente.

## Flusso di connessione

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

La consapevolezza delle autorizzazioni dovrebbe rimanere facoltativa. Un client che ignora la notifica può comunque comportarsi correttamente gestendo gli errori di autorizzazione standard dal server.

## Applicazione della proprietà

Quando il servizio crea una comunità, dovrebbe assegnare automaticamente la proprietà all'utente chiamante. Da lì:

- le azioni di avvio, arresto, modifica ed eliminazione della comunità sono limitate al proprietario
- elenco e risposte di sottoscrizione predefinite per le comunità del chiamante
- una visibilità più ampia è un'autorizzazione di amministratore esplicita, non un'impostazione predefinita

Un caso limite è molto importante: se un utente si iscrive a una comunità di cui **non** è proprietario, il server deve esporre solo lo stato pubblico che qualsiasi osservatore esterno dovrebbe vedere. La configurazione riservata al solo proprietario o i dati di runtime interni non dovrebbero mai trapelare attraverso un'API di abbonamento.

## Superficie operatore suggerita

L'API di amministrazione può rimanere noiosa ed esplicita:

- elencare gli utenti
- controllare un utente
- creare o aggiornare utenti
- eliminare utenti
- trasferire la proprietà della comunità
- controllare il controllo logs

L'autenticazione per questa API dell'operatore deve essere completamente separata dall'autenticazione RPC dell'utente finale.

## Fasi di implementazione

### Fase 1

- stabilire la struttura del progetto RPC pubblico
- aggiungere record utente e monitoraggio della proprietà
- bilanciare o estendere il server RPC corrente

### Fase 2

- implementare pacchetti di autorizzazioni
- applicarli a livello del metodo RPC
- restituire i metadati delle autorizzazioni alla connessione

### Fase 3

- aggiungere l'API dell'operatore
- aggiungere la registrazione di controllo
- aggiungere l'autenticazione dell'amministratore

### Fase 4

- fornire il dashboard di amministrazione
- testare i controlli sugli abusi
- rafforzare i limiti di velocità e le quote di archiviazione

## Domande aperte

### Spam delle credenziali di autenticazione

Se la creazione dell'autenticazione è economica, i servizi pubblici potrebbero aver bisogno di un livello di sfida prima di rilasciare le credenziali. Un percorso possibile è riutilizzare il modello di sfida della comunità stesso in modo che l'emissione di credenziali erediti la stessa filosofia anti-abuso del resto della rete.

### Nominazione legacy

Alcune prime implementazioni potrebbero ancora esporre internamente i nomi dei metodi legacy per compatibilità. Questo dovrebbe essere trattato come un dettaglio della migrazione, non come il vocabolario pubblico permanente dei documenti Bitsocial.

## Riepilogo

Questa proposta riguarda in realtà una cosa: rendere utile l'infrastruttura RPC pubblica senza renderla di custodia. Un buon Bitsocial RPC pubblico dovrebbe sembrare un'assistenza opzionale per le comunità in esecuzione, non come una nuova piattaforma centrale che rivendica la proprietà attraverso la porta di servizio.
