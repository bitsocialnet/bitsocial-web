---
title: Bitsocial e Bluesky
description: Come Bluesky e l'AT Protocol, con server di dati personali, relay e AppView, si confrontano con le comunità peer-to-peer di Bitsocial.
---

# Bitsocial e Bluesky

[Bluesky](https://bsky.app/) è un'app di microblogging costruita
sull'[AT Protocol](https://atproto.com/), progettato da Bluesky Social PBC. Il protocollo divide un
social network in servizi separati: i server di dati personali ospitano gli account, i relay li
aggregano in un unico flusso e le AppView indicizzano quel flusso trasformandolo nelle timeline e
nei thread che le persone vedono. La sua documentazione descrive i dati degli account come
archiviati su server host, "anziché secondo un modello peer-to-peer"
([panoramica](https://atproto.com/guides/overview)).

## Come funziona l'AT Protocol

- **Repository sui server.** Ogni post, like o follow è un record nel repository firmato
  dell'autore, ospitato su un server di dati personali (PDS). Bluesky gestisce i server predefiniti,
  e chiunque può ospitarne uno proprio.
- **Relay.** I relay si iscrivono a ogni PDS e ritrasmettono le modifiche come un unico flusso, il
  firehose. Da un aggiornamento del protocollo del 2025 non archiviano più ogni repository, il che
  li ha resi molto più economici da gestire
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView.** Un'AppView indicizza l'intero firehose e fornisce timeline, thread di risposte
  completi, conteggi e ricerca. È la parte della rete che richiede più risorse.
- **Identità.** Un account è un DID: di solito `did:plc`, registrato in un'unica directory globale,
  oppure `did:web`, legato a un dominio. Il documento DID elenca l'handle dell'account, la chiave di
  firma e il server attuale. Il PDS detiene la chiave di firma; `did:plc` permette anche agli utenti
  di detenere chiavi di rotazione, così da potersi spostare senza l'aiuto del vecchio host
  ([guida all'identità](https://atproto.com/guides/identity)).
- **Handle.** Gli handle sono nomi DNS, come `alice.bsky.social` o un dominio di proprietà
  dell'utente, verificati rispetto al DID.
- **Moderazione.** Hosting e diffusione sono livelli separati. Chiunque può gestire un labeler e gli
  utenti possono combinarne diversi
  ([guida alla moderazione](https://atproto.com/guides/moderation)), ma l'app Bluesky applica sempre
  la moderazione di Bluesky stessa. Gli autori possono limitare chi può rispondere ai loro post e
  nascondere le risposte.

## Dove differiscono

### Server o peer

I dati di Bluesky risiedono su server: un PDS ospita ogni account, i relay trasportano il firehose e
le AppView forniscono ciò che i client mostrano. Un browser è un client HTTP di quei servizi, mai un
peer. In Bitsocial i contenuti sono serviti dal nodo della comunità e dai peer che la leggono, e
un'app web può eseguire un proprio nodo peer-to-peer. Vedi
[Peer-to-peer nel browser](/browser-p2p/).

### Una vista globale o le comunità

L'AT Protocol è progettato per un'unica vista globale: un'AppView vede ogni risposta, quindi thread
e ricerca sono completi. Bitsocial non ha un indice globale; ogni comunità pubblica il proprio
stato, e le app costruiscono la scoperta dei contenuti sopra di esso. Vedi
[Scoperta dei contenuti](/content-discovery/).

Oggi Bluesky non ha un oggetto comunità per i post pubblici. A giugno 2026 ha
[annunciato le comunità native](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k), con
pubblicazione soggetta ad approvazione per alcuni livelli di privacy; a ottobre 2026 non erano
ancora state lanciate. In Bitsocial le comunità sono l'oggetto centrale, e il nodo di una comunità
accetta o rifiuta i post.

### Controllo dello spam

Bluesky gestisce lo spam con limiti di frequenza sui propri server, limiti per i nuovi host a
livello di relay, rilevamento automatico, revisione umana ed etichette, e gli autori possono
limitare le risposte. Nessun filtro a livello di comunità stabilisce cosa debba superare un post
prima di essere accettato. In Bitsocial ogni comunità sceglie la propria sfida. Vedi
[Sfide anti-spam personalizzate](/custom-challenges/).

### Chi detiene le chiavi

Gli account sui server di Bluesky accedono con una password, e quei server custodiscono le loro
chiavi di firma per conto degli utenti ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)).
Secondo un ingegnere del protocollo di Bluesky,
[la maggior parte degli account non ha chiavi di rotazione controllate in modo indipendente](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Un'identità Bitsocial è una coppia di chiavi generata e custodita dall'app dell'utente.

### Gestire l'infrastruttura

Un server personale costa poco: il [PDS di riferimento](https://github.com/bluesky-social/pds)
raccomanda 1 GB di RAM per un massimo di 20 utenti. Un'AppView indipendente che copra l'intera rete
è un progetto impegnativo; una costruita nel 2025
[costava circa 200 dollari al mese](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), soprattutto per 16
TB di archiviazione. Bitsocial non ha un indice globale da replicare, e un nodo di comunità gira su
hardware consumer.

## Confronto

| Domanda                | Bluesky (AT Protocol)                                                                       | Bitsocial                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Categoria              | Server federati con un indice globale                                                       | Rete di comunità peer-to-peer                                                         |
| Identità               | DID, con chiavi di firma di solito detenute dal server                                      | Coppie di chiavi Ed25519 per utenti e comunità                                        |
| Dove risiedono i post  | Il repository dell'autore su un server di dati personali                                    | Il nodo del proprietario della comunità e i peer che la leggono e ne fanno il seeding |
| Chi lo tiene online    | Host PDS, relay e AppView, gestiti di default da Bluesky                                    | Nodo del proprietario della comunità più i seeder di supporto                         |
| Comunità               | Ancora nessuna per i post pubblici (annunciate nel 2026)                                    | Oggetti di prima classe il cui nodo accetta o rifiuta i post                          |
| Controllo dello spam   | Limiti di frequenza sui server, rilevamento automatico, etichette, controllo delle risposte | La sfida di ciascuna comunità prima che un post venga accettato                       |
| Moderazione            | Labeler combinabili; l'app Bluesky applica sempre la moderazione di Bluesky                 | I proprietari moderano la propria comunità; le app scelgono cosa mostrare             |
| Nomi                   | Handle DNS verificati rispetto al DID                                                       | Nomi `.bso` e `.eth` che si risolvono in chiavi                                       |
| Browser                | Client HTTP di un PDS e di un'AppView                                                       | Nodo peer-to-peer dentro una normale scheda del browser                               |
| Compromesso principale | Thread e ricerca globali completi, ma l'aggregazione richiede server pesanti                | Nessun indice globale pesante, ma nessuna vista completa dell'intera rete             |
