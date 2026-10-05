---
title: Bitsocial e ActivityPub
description: Come il Fediverse, con Mastodon per il microblogging e Lemmy per le comunità in stile Reddit, si confronta con le comunità peer-to-peer di Bitsocial.
---

# Bitsocial e ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) è lo standard W3C alla base del Fediverse. Gli
utenti scelgono un server, chiamato istanza, che ospita il loro account, e i server si scambiano i
post tra loro. [Mastodon](https://joinmastodon.org/) è il suo software di microblogging più noto;
[Lemmy](https://join-lemmy.org/) è un aggregatore di link e forum in stile Reddit costruito attorno
a comunità tematiche, il che lo rende l'equivalente più vicino, nel Fediverse, ad app Bitsocial come
[Seedit](/apps/seedit/).

## Come funziona ActivityPub

- **Inbox e outbox.** Ogni account ha una inbox e una outbox. I server consegnano le attività nelle
  inbox di altri server, e ogni server ricevente conserva una propria copia di ciò che seguono i
  suoi utenti.
- **Identità di proprietà del server.** Gli ID di account e post sono indirizzi HTTPS sul dominio
  del server di origine. Un handle Mastodon ha la forma `@user@domain`, viene risolto con WebFinger,
  e il server firma i messaggi di federazione per conto dell'utente.
- **Client.** App e browser comunicano solo con il server dell'utente, tramite l'API di quel server.
- **Comunità di Lemmy.** Una comunità è un attore di gruppo ospitato su un'istanza. Gli utenti
  inviano i post alla comunità, che li ritrasmette ai suoi follower; secondo lo standard condiviso
  per i forum ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md))
  una comunità può prima convalidare i post, fino all'approvazione manuale da parte dei moderatori.
- **Moderazione.** La moderazione è locale a ciascun server. Gli amministratori possono sospendere
  account, bloccare interi server o federarsi solo con quelli di una allowlist; Lemmy prevede anche
  moderatori per ogni comunità.
- **Controllo dello spam.** ActivityPub non definisce alcun meccanismo anti-spam. Mastodon e Lemmy
  filtrano le iscrizioni con approvazione, inviti, domande di ammissione, captcha e verifiche
  dell'email, poi si affidano a limiti di frequenza, segnalazioni e moderazione.

## Dove differiscono

### L'identità appartiene a un dominio

Un account del Fediverse appartiene al dominio del suo server. Mastodon può reindirizzare i follower
verso un nuovo account, ma [i post non si spostano](https://docs.joinmastodon.org/user/moving/), il
trasferimento deve partire dal vecchio server e c'è un periodo di attesa di 30 giorni. In Bitsocial
profili e comunità sono coppie di chiavi, quindi cambiare host o app non cambia l'identità. Vedi
[Identità e proprietà della comunità](/identity-and-ownership/).

### Dove vive una comunità

Una comunità di Lemmy è strutturalmente vicina a una comunità Bitsocial: i post vanno alla comunità,
che può controllarli prima di ritrasmetterli. La differenza sta in dove vive. Una comunità di Lemmy
può essere creata solo sull'istanza di appartenenza del suo creatore, l'amministratore dell'istanza
ne ha il [controllo completo](https://join-lemmy.org/docs/users/05-censorship-resistance.html) e non
esiste un modo documentato per spostarla su un'altra istanza. Una comunità Bitsocial è una coppia di
chiavi a sé stante: il proprietario può eseguirne il nodo ovunque, e nessun amministratore di server
sta al di sopra di essa.

### Controllo dello spam

I server del Fediverse fermano lo spam soprattutto al momento dell'iscrizione e moderano in seguito.
Una comunità Bitsocial esegue una sfida su ogni post prima di accettarlo, e ogni comunità sceglie la
propria: captcha, allowlist, pagamento o qualsiasi altro codice. Vedi
[Sfide anti-spam personalizzate](/custom-challenges/).

### Gestire l'infrastruttura

Gestire un'istanza significa avere un server sempre acceso con dominio, TLS ed email. Mastodon
richiede anche PostgreSQL, Redis e worker in background; Lemmy è più leggero, con circa 150 MB di
RAM secondo i dati del progetto stesso. Ogni istanza conserva copie dei contenuti remoti seguiti dai
suoi utenti. Un nodo di comunità Bitsocial non ha bisogno di dominio né di certificato e gira
dall'app desktop o da `bitsocial-cli`.

### Cosa offrono in cambio i server

I server del Fediverse conservano l'intera cronologia e la servono in modo affidabile, e Mastodon
dispone di strumenti di moderazione maturi, sviluppati nel corso degli anni. Bitsocial non
garantisce i vecchi contenuti per sempre, e i suoi strumenti di moderazione si trovano nelle singole
app.

## Confronto

| Domanda                | ActivityPub (Mastodon, Lemmy)                                                               | Bitsocial                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Categoria              | Server federati                                                                             | Rete di comunità peer-to-peer                                                           |
| Identità               | Account sul dominio di un server, firmato dal server                                        | Coppie di chiavi Ed25519 per utenti e comunità                                          |
| Dove risiedono i post  | Il server di origine, più le copie su ogni server che lo segue                              | Il nodo del proprietario della comunità e i peer che la leggono e ne fanno il seeding   |
| Chi lo tiene online    | Amministratori delle istanze                                                                | Nodo del proprietario della comunità più i seeder di supporto                           |
| Comunità               | Comunità di Lemmy ospitate su un'unica istanza                                              | Oggetti di prima classe il cui nodo accetta o rifiuta i post                            |
| Controllo dello spam   | Filtri all'iscrizione, limiti di frequenza, segnalazioni e moderazione                      | La sfida di ciascuna comunità prima che un post venga accettato                         |
| Moderazione            | Amministratori dei server e moderatori delle comunità, locali a ciascun server              | I proprietari moderano la propria comunità; le app scelgono cosa mostrare               |
| Nomi                   | Handle `@user@domain` e `!community@domain`                                                 | Nomi `.bso` e `.eth` che si risolvono in chiavi                                         |
| Browser                | Client del server dell'utente                                                               | Nodo peer-to-peer dentro una normale scheda del browser                                 |
| Compromesso principale | Cronologia affidabile e moderazione matura, ma identità e comunità appartengono a un server | Nessun server o dominio necessario, ma i vecchi contenuti non sono garantiti per sempre |
