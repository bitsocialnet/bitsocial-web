---
title: Spam Blocker
description: Servizio centralizzato di rilevamento dello spam con punteggi di rischio, sfide OAuth e soglie di livello configurabili.
sidebar_position: 1
---

# Spam Blocker

Spam Blocker è un servizio centralizzato di rilevamento dello spam che valuta le pubblicazioni in arrivo e assegna loro un punteggio di rischio. È composto da due pacchetti:

- **`@bitsocial/spam-blocker-server`** -- il server HTTP che ospita le API di valutazione e di sfida.
- **`@bitsocial/spam-blocker-challenge`** -- un pacchetto client leggero che le comunità integrano per inviare le pubblicazioni alla valutazione.

**Codice sorgente:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Come funziona il punteggio di rischio

Ogni pubblicazione inviata all'endpoint `/evaluate` riceve un punteggio di rischio numerico. Il punteggio è una combinazione ponderata di più segnali:

| Segnale                 | Descrizione                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Anzianità dell'account  | Gli account più recenti ricevono punteggi di rischio più alti.                                                                              |
| Karma                   | Il karma accumulato nella comunità riduce il rischio.                                                                                       |
| Reputazione dell'autore | Dati di reputazione raccolti dall'indicizzatore di rete in background.                                                                      |
| Analisi del contenuto   | Euristiche sul testo (densità di link, schemi di spam noti e simili).                                                                       |
| Frequenza               | Pubblicazioni ravvicinate dallo stesso autore aumentano il rischio.                                                                         |
| Informazioni sull'IP    | Geolocalizzazione a livello di paese e consultazione di feed sulle minacce. Gli indirizzi IP grezzi non sono mai condivisi con le comunità. |

## Soglie dei livelli

Il punteggio di rischio corrisponde a uno di quattro livelli configurabili che determinano cosa succede dopo:

1. **Accettazione automatica** -- il punteggio è abbastanza basso da approvare la pubblicazione senza alcuna sfida.
2. **OAuth sufficiente** -- l'autore deve completare una verifica OAuth per procedere.
3. **OAuth più verifica aggiuntiva** -- OAuth da solo non basta; serve una verifica ulteriore (ad esempio un CAPTCHA).
4. **Rifiuto automatico** -- il punteggio è troppo alto e la pubblicazione viene respinta senz'altro.

Tutti i valori di soglia sono configurabili per singola comunità.

## Flusso della sfida

Quando una pubblicazione ricade in un livello che richiede una verifica, parte il flusso della sfida:

1. All'autore viene chiesto per prima cosa di autenticarsi tramite **OAuth** (GitHub, Google, Twitter e altri provider supportati).
2. Se OAuth da solo non basta (livello 3), viene proposto un **CAPTCHA di riserva** basato su Cloudflare Turnstile.
3. L'identità OAuth serve unicamente alla verifica e non viene **mai condivisa** con la comunità né con altri utenti.

## Endpoint dell'API

### `POST /evaluate`

Invia una pubblicazione alla valutazione del rischio. Restituisce il punteggio di rischio calcolato e il livello di sfida richiesto.

### `POST /challenge/verify`

Invia il risultato di una sfida completata (token OAuth, soluzione del CAPTCHA o entrambi) per la verifica.

### `GET /iframe/:sessionId`

Restituisce una pagina HTML incorporabile che mostra l'interfaccia di sfida adatta alla sessione indicata.

## Limitazione della frequenza

I limiti di frequenza vengono applicati dinamicamente in base all'anzianità e alla reputazione dell'autore. Gli autori più recenti o con reputazione più bassa incontrano limiti più stringenti, mentre quelli consolidati hanno soglie più generose. Così si evitano le ondate di spam senza penalizzare i partecipanti affidabili.

## Indicizzatore di rete in background

Il server esegue un indicizzatore in background che analizza di continuo la rete per costruire e mantenere aggiornati i dati di reputazione degli autori. Questi dati alimentano direttamente il calcolo del punteggio di rischio e permettono al sistema di riconoscere chi partecipa in buona fede in modo ricorrente nelle varie comunità.

## Privacy

Spam Blocker è progettato tenendo conto della privacy:

- Le identità OAuth servono solo alla verifica delle sfide e non vengono **mai divulgate** alle comunità.
- L'operatore del servizio conserva gli indirizzi IP grezzi per rilevare gli abusi e li invia a un fornitore esterno di informazioni sugli IP per classificarli.
- Le comunità ricevono solo il codice paese, il rischio dell'IP e una stima del tipo di connessione, mai l'IP grezzo.

## Database

Il server usa **SQLite** (tramite `better-sqlite3`) per la persistenza locale dei dati di reputazione, dello stato delle sessioni e della configurazione.
