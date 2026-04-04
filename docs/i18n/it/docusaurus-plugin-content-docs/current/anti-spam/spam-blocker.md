---
title: Spam Blocker
description: Servizio di rilevamento dello spam centralizzato con punteggio di rischio, sfide OAuth e soglie di livello configurabili.
sidebar_position: 1
---

# Spam Blocker

:::warning Denominazione legacy
Questo pacchetto è stato originariamente pubblicato nell'ambito `@plebbit`. È stato rinominato `@bitsocial/spam-blocker-server` e `@bitsocial/spam-blocker-challenge`. Riferimenti ai vecchi nomi potrebbero essere ancora presenti nella documentazione o nei codici base precedenti.
:::

Spam Blocker è un servizio di rilevamento spam centralizzato che valuta le pubblicazioni in arrivo e assegna punteggi di rischio. È composto da due pacchetti:

- **`@bitsocial/spam-blocker-server`** -- il server HTTP che ospita le API di valutazione e sfida.
- **`@bitsocial/spam-blocker-challenge`** -- un pacchetto client leggero che le comunità integrano per inviare pubblicazioni per la valutazione.

**Codice sorgente:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Come funziona il punteggio di rischio

Ogni pubblicazione inviata all'endpoint `/evaluate` riceve un punteggio di rischio numerico. Il punteggio è una combinazione ponderata di diversi segnali:

| Segnale                 | Descrizione                                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Età dell'account        | Gli account più recenti ricevono punteggi di rischio più elevati.                                                                                                                      |
| Karma                   | Il karma accumulato dalla community riduce il rischio.                                                                                                                                 |
| Reputazione dell'autore | I dati di reputazione raccolti dall'indicizzatore di rete in background.                                                                                                               |
| Analisi dei contenuti   | Euristiche a livello di testo (densità dei link, modelli di spam noti, ecc.).                                                                                                          |
| Velocità                | Post successivi rapidi dello stesso autore aumentano il rischio.                                                                                                                       |
| Intelligence IP         | Geolocalizzazione a livello di paese e ricerche nei feed di minacce. Vengono archiviati solo i codici paese: gli indirizzi IP non elaborati non vengono mai condivisi con le comunità. |

## Soglie di livello

Il punteggio di rischio viene mappato su uno dei quattro livelli configurabili che determinano cosa succede dopo:

1. **Accetta automaticamente**: il punteggio è sufficientemente basso da consentire l'approvazione della pubblicazione senza alcuna verifica.
2. **OAuth sufficiente**: l'autore deve completare una verifica OAuth per procedere.
3. **OAuth e altro** -- OAuth da solo non è sufficiente; è richiesta un'ulteriore verifica (ad esempio, CAPTCHA).
4. **Rifiuto automatico** -- il punteggio è troppo alto; la pubblicazione viene rifiutata completamente.

Tutti i valori di soglia sono configurabili per comunità.

## Flusso di sfida

Quando una pubblicazione rientra in un livello che richiede la verifica, il flusso di sfida inizia:

1. All'autore viene innanzitutto richiesto di autenticarsi tramite **OAuth** (GitHub, Google, Twitter e altri provider supportati).
2. Se OAuth da solo non è sufficiente (livello 3), viene presentato un **CAPTCHA fallback** gestito da Cloudflare Turnstile.
3. L'identità OAuth viene utilizzata esclusivamente per la verifica: non viene **mai condivisa** con la community o altri utenti.

## API Endpoint

### `POST /evaluate`

Invia una pubblicazione per la valutazione del rischio. Restituisce il punteggio di rischio calcolato e il livello di sfida richiesto.

### `POST /challenge/verify`

Invia il risultato di una sfida completata (token OAuth, soluzione CAPTCHA o entrambi) per la verifica.

### `GET /iframe/:sessionId`

Restituisce una pagina HTML incorporabile che visualizza l'interfaccia utente di sfida appropriata per la sessione specifica.

## Limitazione della velocità

I limiti di tariffa vengono applicati dinamicamente in base all'età e alla reputazione dell'autore. Gli autori più nuovi o con una reputazione inferiore devono affrontare limiti più severi, mentre gli autori affermati godono di soglie più generose. Ciò impedisce inondazioni di spam senza penalizzare i partecipanti fidati.

## Indicizzatore di rete in background

Il server esegue un indicizzatore in background che esegue la scansione continua della rete per creare e mantenere i dati sulla reputazione dell'autore. Questi dati vengono inseriti direttamente nella pipeline di valutazione del rischio, consentendo al sistema di riconoscere i partecipanti in buona fede ripetuti nelle comunità.

## Privacy

Spam Blocker è progettato pensando alla privacy:

- Le identità OAuth vengono utilizzate solo per la verifica delle sfide e non vengono **mai divulgate** alle comunità.
- Gli indirizzi IP vengono risolti in **solo codici paese**; gli IP grezzi non vengono archiviati o condivisi.

## Banca dati

Il server utilizza **SQLite** (tramite `better-sqlite3`) per la persistenza locale dei dati di reputazione, stato della sessione e configurazione.
