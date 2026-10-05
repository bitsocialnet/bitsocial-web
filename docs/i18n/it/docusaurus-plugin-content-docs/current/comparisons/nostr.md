---
title: Bitsocial e Nostr
description: Come il modello basato su relay di Nostr si confronta con le comunità peer-to-peer di Bitsocial, dal percorso dei dati e dall'identità fino a gruppi, controllo dello spam e moderazione.
---

# Bitsocial e Nostr

Nostr non rientra pulitamente né tra i sistemi federati né tra quelli su blockchain. Gli utenti non
ricevono account dalle istanze, e non ci sono catena, consenso, gas o ordinamento globale. Nostr si
descrive meglio come **social media basato su relay**: gli utenti detengono coppie di chiavi,
firmano eventi e li pubblicano sui relay, che sono normali server che li memorizzano e li servono
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Il
[README](https://github.com/nostr-protocol/nostr) di Nostr stesso afferma che il protocollo non si
basa su tecniche peer-to-peer.

Questo avvicina Nostr a Bitsocial più di quanto facciano i sistemi federati o blockchain sotto un
aspetto importante: l'identità è crittografica e portabile. Le differenze stanno nel livello dei
dati e in chi controlla l'accesso.

## Come funziona Nostr

- **Eventi e relay.** Ogni post, profilo o reazione è un evento JSON firmato. I client pubblicano
  gli eventi sui relay tramite WebSocket e si iscrivono con dei filtri; i relay memorizzano gli
  eventi e li restituiscono. I relay non comunicano tra loro.
- **Replica.** Di solito gli utenti pubblicano su più relay. Uno studio del 2023 su 712 relay ha
  rilevato che il post medio si trovava su 34,6 di essi
  ([Wei e Tyson](https://arxiv.org/abs/2402.05709)).
- **Trovare i post di qualcuno.** Gli utenti pubblicano un elenco dei relay su cui scrivono e da cui
  leggono ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), e i client
  recuperano i post di un utente dai relay di scrittura di quell'utente.
- **Identità.** Ogni utente è una chiave secp256k1 che firma con firme Schnorr. Le specifiche non
  definiscono alcuna rotazione o recupero delle chiavi, quindi perdere la chiave significa perdere
  l'account. Gli identificatori facoltativi `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) vengono verificati
  confrontandoli con un file presente sul server web di quel dominio.
- **Gruppi.** Il meccanismo raccomandato per le comunità sono i gruppi basati su relay
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): un relay ospita un gruppo,
  ne applica le regole di adesione e di pubblicazione prima di accettare un post e ne firma i
  metadati. Le più vecchie comunità approvate dai moderatori
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) sono ora contrassegnate come
  sconsigliate a favore di NIP-29.
- **Controllo dello spam.** Ogni relay sceglie il proprio filtro d'accesso: proof of work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autenticazione e allowlist
  ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), pagamento o limiti di
  frequenza. I client aggiungono liste di silenziamento e punteggi di fiducia.
- **Media.** Immagini e video vengono caricati su server di file HTTP separati.

## Dove differiscono

### Chi memorizza e serve i post

In Nostr i relay sono il livello di archiviazione e consegna: un server deve mantenere online ogni
post. In Bitsocial i router HTTP aiutano soltanto i client a trovare i peer. Non memorizzano post,
profili, metadati delle comunità o stato di moderazione; i client recuperano i contenuti dal nodo
della comunità e dai peer che ne fanno il seeding. Vedi
[Protocollo peer-to-peer](/peer-to-peer-protocol/).

### Chi controlla l'accesso

In Nostr i filtri di scrittura appartengono ai gestori dei relay. Al di fuori dei gruppi NIP-29, una
chiave rifiutata da un relay può pubblicare lo stesso evento su qualsiasi relay che lo accetti, e
ciò che i lettori vedono dipende dai relay letti dal loro client. Un gruppo NIP-29 è più vicino a
una comunità Bitsocial: il relay che lo ospita accetta o rifiuta i post. È comunque il relay a
definire cosa possono fare i ruoli del gruppo, e la cronologia del gruppo resta legata a quel relay
a meno che un altro relay non accetti di prenderla in carico.

In Bitsocial una comunità è un oggetto crittografico con una propria coppia di chiavi. Il nodo della
comunità esegue la sfida scelta dal proprietario e pubblica lo stato accettato nella rete
peer-to-peer. Vedi [Sfide anti-spam personalizzate](/custom-challenges/).

### Gestire l'infrastruttura

Un relay è un server con un dominio e un endpoint WebSocket, e i relay più popolari sostengono i
costi di archiviazione e di banda di ciò che servono. Lo studio del 2023 ha stimato che circa il 95%
dei relay gratuiti non riusciva a coprire i propri costi con le donazioni. Un nodo di comunità
Bitsocial gira su hardware consumer, e i peer che leggono una comunità possono aiutare a
condividerla.

### Browser

Un client web Nostr apre connessioni WebSocket direttamente verso i relay, quindi non serve alcun
server applicativo. Un'app web Bitsocial esegue un nodo peer-to-peer nella scheda e recupera i
contenuti dai peer. Vedi [Peer-to-peer nel browser](/browser-p2p/).

### Contenuti vecchi

I post di Nostr sono ampiamente replicati sui relay, il che aiuta i vecchi post a sopravvivere.
Bitsocial conserva lo stato più recente della comunità e non garantisce i vecchi contenuti per
sempre.

## Confronto

| Domanda                | Nostr                                                                                                  | Bitsocial                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Categoria              | Protocollo basato su relay                                                                             | Rete di comunità peer-to-peer                                                         |
| Identità               | Chiave utente secp256k1, senza rotazione nelle specifiche                                              | Coppie di chiavi Ed25519 per utenti e comunità                                        |
| Dove risiedono i post  | Relay scelti dall'autore, spesso molti                                                                 | Il nodo del proprietario della comunità e i peer che la leggono e ne fanno il seeding |
| Chi lo tiene online    | Gestori dei relay                                                                                      | Nodo del proprietario della comunità più i seeder di supporto                         |
| Comunità               | Gruppi ospitati dai relay (NIP-29)                                                                     | Oggetti di prima classe il cui nodo accetta o rifiuta i post                          |
| Controllo dello spam   | La politica di ciascun relay: proof of work, autenticazione, pagamento, allowlist, limiti di frequenza | La sfida di ciascuna comunità prima che un post venga accettato                       |
| Moderazione            | Politiche dei relay, liste di silenziamento dei client, etichette e segnalazioni                       | I proprietari moderano la propria comunità; le app scelgono cosa mostrare             |
| Nomi                   | Identificatori facoltativi `name@domain` verificati via HTTPS                                          | Nomi `.bso` e `.eth` che si risolvono in chiavi                                       |
| Browser                | Client WebSocket dei relay                                                                             | Nodo peer-to-peer dentro una normale scheda del browser                               |
| Compromesso principale | Identità portabile e ampia replica, ma disponibilità e politiche dipendenti dai relay                  | Minore dipendenza dai relay, ma i vecchi contenuti non sono garantiti per sempre      |
