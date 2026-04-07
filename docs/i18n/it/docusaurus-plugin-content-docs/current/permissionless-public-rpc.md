---
title: RPC pubblico senza autorizzazione
description: Progettazione proposta per un servizio RPC Bitsocial pubblico con utenti isolati, autorizzazioni con ambito e proprietà della comunità.
---

# RPC pubblico senza autorizzazione

Questa pagina inquadra l'RPC pubblico come una proposta Bitsocial a livello di prodotto anziché come un muro di dettagli di implementazione.

## Obiettivo in linguaggio semplice

[Bitsocial Forge](https://bitsocialforge.com) può eseguire un servizio RPC pubblico che consente a molti utenti di gestire le proprie comunità Bitsocial da remoto, senza trasformare l'operatore in un custode di tali comunità.

Il servizio dovrebbe rendere pratici i client mobili e leggeri preservando tre vincoli:

1. Gli utenti rimangono isolati gli uni dagli altri per impostazione predefinita.
2. Le autorizzazioni rimangono esplicite e granulari.
3. La compatibilità con la richiesta RPC corrente e la forma della risposta possono essere preservate durante l'implementazione.

## Quale problema risolve

Oggi, il modello RPC più semplice è solitamente tutto o niente: una chiave di autenticazione, un dominio di autorità, accesso completo. Funziona per un singolo operatore ma non per un servizio pubblico multiutente.

Una RPC pubblica senza autorizzazione necessita di un modello più forte:

- un servizio può ospitare molti utenti
- ogni utente ottiene le proprie comunità e limiti
- le politiche definite dall'operatore possono prevenire gli abusi
- l'utente può comunque allontanarsi o ospitarsi autonomamente in un secondo momento

## Modello fondamentale

### Utenti

Ogni utente riceve una credenziale di autenticazione più un pacchetto di autorizzazioni.

### Comunità

Le comunità create tramite il servizio vengono assegnate a un record del proprietario. La proprietà viene monitorata in modo esplicito in modo che i metodi di gestione possano essere limitati all'utente giusto.

### Autorizzazioni

Le autorizzazioni sono basate sulle capacità. Invece di un valore booleano per "può utilizzare RPC", il server può controllare:

- quante comunità può creare un utente
- quali metodi di gestione sono disponibili
- quali operazioni di pubblicazione sono consentite
- quali limiti tariffari si applicano
- quali superfici di amministrazione sono visibili

### Superficie amministrativa

Lo stesso RPC pubblico dovrebbe rimanere concentrato sul comportamento RPC rivolto agli utenti. Le attività amministrative come la creazione degli utenti, il trasferimento della proprietà e la revisione degli audit appartengono a un'API e a un dashboard dell'operatore separati.

## Posizione di compatibilità

La documentazione rivolta all'utente deve utilizzare termini Bitsocial come **community** e **profilo**.

A livello di rete, la prima implementazione può ancora preservare l'attuale forma di trasporto e payload JSON-RPC laddove ciò sia utile per la compatibilità. In altre parole: i documenti possono rimanere nativi di Bitsocial anche se il periodo di transizione mantiene alcuni nomi di metodi orientati alla compatibilità o forme di richiesta dietro le quinte.

## Pacchetto di autorizzazioni proposto

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

I nomi esatti dei metodi sono illustrativi. La parte importante è la forma della politica: le capacità individuali sono controllate in modo indipendente anziché raggruppate in un unico token superutente.

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

- le azioni di avvio, interruzione, modifica ed eliminazione della community hanno come ambito il proprietario
- le risposte agli elenchi e alle iscrizioni sono predefinite per le comunità del chiamante
- una visibilità più ampia è un'autorizzazione amministrativa esplicita, non un'impostazione predefinita

Un caso limite è molto importante: se un utente si iscrive a una comunità di cui **non** è proprietario, il server deve esporre solo lo stato pubblico che qualsiasi osservatore esterno dovrebbe vedere. La configurazione riservata al solo proprietario o i dati di runtime interni non dovrebbero mai fuoriuscire attraverso un'API di sottoscrizione.

## Superficie operatore consigliata

L'API di amministrazione può rimanere noiosa ed esplicita:

- elencare gli utenti
- ispezionare un utente
- creare o aggiornare gli utenti
- eliminare gli utenti
- trasferire la proprietà comunitaria
- ispezionare i registri di controllo

L'autenticazione per questa API dell'operatore deve essere completamente separata dall'autenticazione RPC dell'utente finale.

## Fasi di lancio

### Fase 1

- stabilire la struttura del progetto RPC pubblico
- aggiungere record utente e monitoraggio della proprietà
- eseguire il fork o estendere il server RPC corrente

### Fase 2

- implementare pacchetti di permessi
- applicarli al livello del metodo RPC
- restituire i metadati delle autorizzazioni alla connessione

### Fase 3

- aggiungi l'API dell'operatore
- aggiungere la registrazione di controllo
- aggiungi l'autenticazione dell'amministratore

### Fase 4

- spedire il dashboard di amministrazione
- testare i controlli sugli abusi
- restringere i limiti di velocità e le quote di stoccaggio

## Domande aperte

### Spam delle credenziali di autenticazione

Se la creazione dell’autenticazione è economica, i servizi pubblici potrebbero aver bisogno di un livello di sfida prima di rilasciare le credenziali. Un percorso possibile è riutilizzare il modello di sfida della comunità stesso in modo che l’emissione di credenziali erediti la stessa filosofia antiabuso del resto della rete.

### Dettagli sulla migrazione

Alcune prime implementazioni potrebbero ancora esporre internamente nomi di metodi orientati alla compatibilità. Questo dovrebbe essere trattato come un dettaglio della migrazione, non come il vocabolario pubblico permanente dei documenti Bitsocial.

## Riepilogo

This proposal is really about one thing: making public RPC infrastructure useful without making it custodial. A good public Bitsocial RPC should feel like optional assistance for running communities, not like a new central platform that reclaims ownership through the back door.
