---
title: Bitsocial e Secure Scuttlebutt
description: Come Secure Scuttlebutt (SSB) e la sua app Manyverse si confrontano con Bitsocial, dai feed a sola aggiunta e dalla replica basata sul grafo dei follow fino a comunità, controllo dello spam e sincronizzazione offline.
---

# Bitsocial e Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) è un protocollo social peer-to-peer creato da
Dominic Tarr nel 2014. [Manyverse](https://www.manyver.se/) è la sua app più nota, per Android, iOS
e desktop; [Patchwork](https://github.com/ssbc/patchwork) era il principale client desktop prima di
essere archiviato. Tra i sistemi confrontati in questa documentazione, SSB è il più vicino a
Bitsocial nello spirito: nessun server nel percorso dei dati, nessuna blockchain, nessun ordinamento
globale e chiavi Ed25519 per l'identità. I due hanno fatto scelte opposte su cosa memorizza ciascun
peer e su dove viene fermato lo spam.

## Come funziona Scuttlebutt

- **Feed.** Ogni identità è una coppia di chiavi Ed25519, scritta come `@<public key>.ed25519`.
  Tutto ciò che un utente pubblica finisce nel suo feed, un log a sola aggiunta (append-only) in cui
  ogni messaggio firmato contiene un numero di sequenza e l'hash del messaggio precedente. Secondo
  la [guida al protocollo](https://ssbc.github.io/scuttlebutt-protocol-guide/), una volta pubblicato
  un messaggio non può più essere modificato.
- **Replica.** I peer copiano feed interi, non singoli post, e il grafo dei follow decide quali feed
  conserva un peer. Patchwork, per esempio, mostrava i feed fino a due hop di distanza e replicava i
  feed fino a tre hop di distanza. Con gli epidemic broadcast trees (EBT), i peer confrontano
  l'ultimo numero di sequenza che possiedono per ciascun feed e inviano solo ciò che manca.
- **Connessioni.** I peer si autenticano con il secret handshake e cifrano il traffico con
  box stream. L'handshake usa come chiave un identificatore di rete, quindi i peer di una rete SSB
  separata con un identificatore diverso non possono connettersi a quella principale.
- **Trovare i peer.** I peer si annunciano sulla rete locale tramite broadcast UDP e si
  sincronizzano via LAN; Manyverse si sincronizza anche via Bluetooth. Su internet, gli utenti si
  affidano ai **pub**, peer sempre online che ti seguono a loro volta dopo che hai riscattato un
  codice di invito e poi memorizzano e servono il tuo feed, e alle **room**, che non memorizzano
  feed ma instradano in tunnel le connessioni tra i loro membri.
- **Blob e messaggi privati.** Immagini e altri file sono blob indirizzati per contenuto e
  recuperati dai peer, con un limite di dimensione predefinito di 5 MB nelle implementazioni
  attuali. I messaggi privati sono cifrati per un massimo di sette destinatari e pubblicati come
  testo cifrato nel feed dell'autore.

## Dove differiscono

### Cosa memorizza un peer

Un peer SSB conserva una copia completa di ogni feed nel suo raggio di replica, dal primo messaggio
di ciascun feed, e serve quei feed agli altri. È questo che permette a SSB di funzionare offline, ma
lo spazio occupato cresce con ogni messaggio nel raggio, e una nuova installazione deve scaricare
quei feed prima di mostrare granché. Un client Bitsocial recupera l'ultimo stato delle comunità che
apre dal nodo della comunità e dai peer che ne fanno il seeding, e la rete conserva solo
quell'ultimo stato. Vedi [Protocollo peer-to-peer](/peer-to-peer-protocol/).

### Cancellazione e dispositivi

Poiché un feed è una catena di hash, SSB non ha una cancellazione valida per tutta la rete: un peer
può eliminare messaggi dal proprio database, ma non può ritirarli dalle copie degli altri peer.
Pubblicare con la stessa chiave da due dispositivi, o da un backup ripristinato, crea un fork del
feed, quindi la soluzione abituale è un'identità per dispositivo. PZP, il protocollo successore del
team di Manyverse, elenca la cancellazione, più dispositivi per account e feed tolleranti ai fork
tra i suoi principali cambiamenti rispetto a SSB
([post di lancio](https://www.manyver.se/blog/2024-07-03/)). Un nodo di comunità Bitsocial pubblica
una nuova versione dello stato della comunità a ogni aggiornamento, quindi i contenuti rimossi dai
suoi moderatori escono dall'ultimo stato.

### Chi puoi sentire

Il raggio di replica di SSB funge anche da filtro anti-spam. Il feed di uno sconosciuto ti raggiunge
solo se qualcuno entro i tuoi hop lo segue, e bloccare un feed fa sì che il tuo nodo smetta di
replicarlo. Lo spam resta fuori, ma lo stesso vale per i nuovi arrivati, finché qualcuno non li
segue. Bitsocial permette a chiunque di pubblicare in una comunità, e il nodo della comunità decide
tramite la propria sfida se un post viene accettato. Vedi
[Sfide anti-spam personalizzate](/custom-challenges/).

### Comunità

SSB non ha un oggetto comunità. Canali e hashtag sono etichette sui singoli post, le risposte in un
thread vivono nei feed di chi le ha scritte, e quanta parte di un thread vedi dipende da quali di
quei feed ha il tuo nodo. Le room possono avere moderatori ed elenchi di membri, ma controllano chi
può connettersi attraverso la room, non cosa viene pubblicato. Una comunità Bitsocial è un oggetto
di prima classe con la propria coppia di chiavi, le proprie regole, i propri moderatori e la propria
sfida.

### Infrastruttura

Entrambi tengono i server fuori dal percorso dei dati, ed entrambi si appoggiano a degli aiutanti. I
pub sono ciò che in SSB si avvicina di più a un servizio in hosting: memorizzano e servono i feed di
tutti coloro che seguono. Le room sono più vicine ai router HTTP di Bitsocial perché nessuno dei due
memorizza contenuti, ma una room inoltra la connessione tra i suoi membri, mentre un router
restituisce solo indirizzi dei fornitori e non ha alcun ruolo nel trasferimento. Come un peer SSB,
un nodo di comunità Bitsocial gira su hardware consumer, e deve essere online per accettare nuovi
post.

### Offline e reti locali

Qui SSB è più forte. Due peer SSB sulla stessa rete Wi-Fi, o via Bluetooth in Manyverse, possono
sincronizzarsi senza connessione a internet, e tutto ciò che è già stato replicato resta leggibile
offline. L'obiettivo primario dichiarato di Manyverse è rendere i social network indipendenti dalla
connettività internet. Bitsocial ha bisogno di una connessione a internet per trovare i peer e per
pubblicare.

### Browser

Le principali app SSB includono un nodo SSB completo: Manyverse ne integra uno nelle sue app mobile
e desktop. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) eseguiva SSB dentro un
browser con replica parziale e connessioni tramite le room, ed è stato archiviato nel 2022. Le app
Bitsocial eseguono un nodo peer-to-peer dentro una normale scheda del browser. Vedi
[Peer-to-peer nel browser](/browser-p2p/).

### Messaggi privati

SSB ha messaggi privati cifrati integrati. Bitsocial si concentra sulle comunità pubbliche e non ha
ancora messaggi diretti nativi.

## Stato del progetto

André Staltz, che ha creato Manyverse, si è allontanato da SSB, da Manyverse e dal loro successore
previsto nell'aprile 2024 ([il suo ultimo aggiornamento](https://www.manyver.se/blog/2024-04-05/)).
Nel luglio 2024 Jacob Karlsson ha lanciato quel successore con il nome di [PZP](https://pzp.wiki/) e
ha scritto che non avrebbe più lavorato su Manyverse e che non conosceva nessun altro che intendesse
farlo. A ottobre 2026 i repository di PZP su [Codeberg](https://codeberg.org/pzp) non avevano
aggiornamenti successivi a dicembre 2024. Il repository di Patchwork è archiviato con la v3.18.1
come ultima release, e il team dietro Planetary, un'app SSB per iOS, è passato a Nostr con la sua
app Nos nel 2023. La rete SSB funziona ancora grazie ai peer e ai pub che le persone mantengono
online, ma le sue app principali non vengono più sviluppate.

## Confronto

| Domanda                | Secure Scuttlebutt                                                                                            | Bitsocial                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Categoria              | Protocollo gossip peer-to-peer                                                                                | Rete di comunità peer-to-peer                                                                      |
| Identità               | Una coppia di chiavi Ed25519 per dispositivo                                                                  | Coppie di chiavi Ed25519 per utenti e comunità                                                     |
| Dove risiedono i post  | Il feed a sola aggiunta dell'autore, copiato da ogni peer che lo replica                                      | Il nodo del proprietario della comunità e i peer che la leggono e ne fanno il seeding              |
| Cosa conserva un peer  | La cronologia completa di ogni feed nel suo raggio di follow                                                  | L'ultimo stato delle comunità che legge o di cui fa il seeding                                     |
| Comunità               | Nessun oggetto comunità; canali e hashtag etichettano i post                                                  | Oggetti di prima classe il cui nodo accetta o rifiuta i post                                       |
| Controllo dello spam   | Raggio di replica basato sul grafo dei follow, più i blocchi                                                  | La sfida di ciascuna comunità prima che un post venga accettato                                    |
| Moderazione            | I follow e i blocchi di ciascun utente                                                                        | I proprietari moderano la propria comunità; le app scelgono cosa mostrare                          |
| Server di supporto     | I pub memorizzano e servono i feed; le room instradano le connessioni in tunnel                               | I router HTTP restituiscono i peer fornitori e non memorizzano contenuti                           |
| Offline                | Sincronizzazione via LAN e Bluetooth senza internet                                                           | Richiede una connessione a internet                                                                |
| Browser                | Le app includono un nodo SSB completo                                                                         | Nodo peer-to-peer dentro una normale scheda del browser                                            |
| Rete                   | In funzione, ma le sue app principali non vengono più sviluppate                                              | Rete attiva con app come [5chan](/apps/5chan/) e [Seedit](/apps/seedit/)                           |
| Compromesso principale | Funziona offline e non richiede hosting, ma i feed crescono all'infinito e gli sconosciuti restano invisibili | Pubblicazione aperta e supporto per i browser, ma richiede internet e conserva solo l'ultimo stato |
