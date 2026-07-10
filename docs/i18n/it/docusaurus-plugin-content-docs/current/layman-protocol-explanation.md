---
title: Una spiegazione completa per i non addetti ai lavori del protocollo Bitsocial
description: Una panoramica in inglese semplice delle community Bitsocial, della ricerca tra pari, della pubblicazione, delle sfide anti-spam, della moderazione e delle app.
---

# Una spiegazione completa per i non addetti ai lavori del protocollo Bitsocial

Questa pagina spiega Bitsocial senza dare per scontato che tu comprenda già il networking peer-to-peer, le chiavi crittografiche, IPFS o pubsub.

Alcuni dettagli sono volutamente semplificati. Per la versione più tecnica, leggere la pagina [Protocollo peer-to-peer](./peer-to-peer-protocol.md).

## La versione breve

Bitsocial è un protocollo per app social in cui le comunità sono possedute da chiavi anziché da un database aziendale.

Una comunità Bitsocial ha un indirizzo. Le app utilizzano quell'indirizzo per trovare colleghi che servono la comunità, recuperare i post più recenti da tali colleghi e pubblicare nuovi post attraverso un canale di messaggi peer-to-peer. Prima che un post venga accettato, la community può richiedere una verifica anti-spam come un captcha, un codice di invito, un pagamento, un controllo dei token, un controllo della moderazione dell'intelligenza artificiale, una lista consentita o qualsiasi altra regola che possa essere codificata.

Questa è l'idea centrale:

1. Una comunità è controllata da una chiave privata.
2. La chiave pubblica fornisce alla comunità un indirizzo stabile.
3. I peer aiutano i lettori a trovare e recuperare la comunità.
4. Un nodo della comunità accetta o rifiuta nuovi post.
5. La politica anti-spam appartiene a ciascuna comunità, non a un'unica piattaforma globale.

## Perché gli hash sono importanti

Un hash è una breve impronta digitale per i dati.

Se due persone eseguono l'hashing dello stesso file, ottengono la stessa impronta digitale. Se il file cambia, cambia anche l'impronta digitale. Ciò rende gli hash utili per trovare e controllare i dati senza fidarsi di un'azienda per dirti quale sia il file.

I sistemi peer-to-peer utilizzano costantemente questa idea. Invece di chiedere a un sito web "il file denominato photo.png", un peer può chiedere alla rete i dati con un'impronta digitale specifica. Se un altro peer restituisce dati errati, il controllo hash fallisce.

Bitsocial utilizza hash e identificatori di contenuto per i dati dei post e altri elementi dello stato della comunità. Il punto importante è semplice: i dati possono essere gestiti in base a ciò che sono, non solo in base al luogo in cui l’azienda li ha ospitati.

## Perché le chiavi pubbliche sono importanti

Una chiave pubblica e una chiave privata sono una coppia corrispondente.

La chiave privata è segreta. È la cosa che dà il controllo. La chiave pubblica è sicura da condividere. Consente a tutti gli altri di verificare che un messaggio, un aggiornamento o un'azione di moderazione provenga realmente dalla chiave privata corrispondente.

È così che Bitsocial evita i normali account della piattaforma. Una società non ha bisogno di rilasciare l'identità. Non è necessario che una riga del database definisca il proprietario. La coppia di chiavi è l'autorità.

In parole povere:

- la chiave privata è l'handle di controllo del proprietario
- la chiave pubblica è l'identità o l'indirizzo pubblico
- le firme dimostrano che l'azione è venuta dal proprietario

## Cos'è una comunità Bitsocial

Una comunità Bitsocial non è solo una pagina in un'app.

Ha la propria coppia di chiavi. La chiave pubblica fornisce alla comunità un indirizzo di rete stabile. La chiave privata controlla gli aggiornamenti allo stato della comunità, come metadati, regole, elenco dei moderatori, configurazione delle sfide e puntatori agli ultimi contenuti accettati.

Ciò significa che una comunità può sopravvivere a un'interfaccia. Un'app può mostrarlo come una bacheca. Un'altra app può mostrarlo come forum. Una futura app potrà mostrarlo in un feed basato sul profilo. L'app può cambiare, ma l'indirizzo della community punta ancora alla stessa community di proprietà.

## Come funziona la lettura

Quando un utente apre una comunità Bitsocial, l'app non richiede la pagina a un database centrale.

Il flusso è più vicino a questo:

1. L'app conosce già l'indirizzo della community o lo ottiene da un elenco, collegamento, superficie di ricerca o
   nome leggibile dall'uomo.
2. L'app chiede ai router leggeri quali peer attualmente forniscono quell'indirizzo della comunità.
3. I router restituiscono solo indirizzi peer. Non restituiscono post, regole, profili o community
   metadati.
4. L'app si connette ai peer e recupera lo stato più recente della comunità.
5. Tale stato contiene puntatori per pubblicare contenuti.
6. L'app recupera il contenuto del post dai colleghi e lo visualizza in una normale interfaccia social.

Il router è solo un assistente di ricerca. È più vicino a chiedere "chi ha questo?" che chiedere "per favore servimi l'intero sito web".

Per maggiori dettagli su questa suddivisione, leggi [Scoperta dei contenuti](./content-discovery.md).

## Come funziona la pubblicazione

Pubblicare è diverso da leggere perché le reti peer-to-peer aperte possono essere oggetto di spam.

Bitsocial gestisce la pubblicazione attraverso un flusso di sfida-risposta:

1. L'utente scrive un post o una risposta.
2. L'app si unisce all'argomento del messaggio peer-to-peer della community.
3. L'app richiede una sfida al nodo della community.
4. Il nodo della comunità rimanda la sfida.
5. L'utente o l'app completa la sfida.
6. L'app invia il post più la risposta alla sfida.
7. Il nodo della community controlla la risposta e il post.
8. Se passa, il nodo della comunità accetta il post nel prossimo aggiornamento della comunità.
9. Altri lettori recuperano lo stato aggiornato della comunità dai peer.

La sfida avviene prima che il posto diventi parte dello stato comunitario accettato. Questa è l'importante differenza rispetto ai sistemi in cui lo spam viene prima accettato e poi nascosto.

## Perché le sfide anti-spam sono importanti

La maggior parte delle piattaforme social trasforma l'anti-spam in una politica della piattaforma. Una società decide cosa conta come account valido, post valido, copertura valida o utente valido.

Bitsocial separa queste cose. Il protocollo offre alle comunità la possibilità di richiedere una sfida prima di accettare un post, ma non obbliga ogni comunità a utilizzare la stessa sfida.

Una comunità potrebbe utilizzare un captcha. Un altro potrebbe utilizzare i codici di invito. Un altro potrebbe richiedere un controllo via SMS, un pagamento, un NFT, un saldo token, un punteggio di moderazione AI, una prova di reputazione, una lista consentita specifica della comunità o una regola personalizzata.

Questa flessibilità è importante perché lo spam cambia. Una regola di posta indesiderata a livello di protocollo diventa obsoleta. Una sfida a livello di comunità può evolversi senza migrare l’intera rete.

Per una spiegazione mirata, leggere [Sfide anti-spam personalizzate](./custom-challenges.md).

## Come funziona la moderazione

Bitsocial non è esente da moderazione. È moderazione senza un super amministratore globale.

Una comunità può avere proprietari e moderatori. Gli indirizzi dei moderatori fanno parte dello stato della comunità. Quando un moderatore esegue un'azione, tale azione può essere firmata. Il nodo della comunità e i client possono verificare la firma rispetto all'elenco dei moderatori.

Ciò conferisce alla moderazione un ambito locale:

- un proprietario della comunità controlla quella comunità
- i moderatori agiscono attraverso chiavi riconosciute dalla comunità
- le app possono comunque scegliere cosa indicizzare, classificare, nascondere o evidenziare
- nessun account aziendale a livello di protocollo può cancellare ogni identità o impadronirsi di ogni comunità

In pratica, ciò significa che una comunità può rimuovere lo spam o imporre regole all'interno del proprio spazio senza trasformare le proprie regole in legge per l'intera rete.

Per la visualizzazione della politica, leggi [Moderazione locale, non divieti globali](./local-moderation.md).

## Quali app aggiungono

Il protocollo non decide come dovrebbe essere l'intero prodotto.

Un'app aggiunge l'esperienza umana attorno al protocollo:

- elenchi di comunità predefiniti
- ricerca e scoperta
- feed e classifica
- layout e interfaccia di pubblicazione
- gestione dei media
- strumenti di moderazione
- packaging per dispositivi mobili, desktop o browser
- modello di business e default

Ecco perché Bitsocial può supportare diversi stili di app. 5chan può sembrare un imageboard. Seedit può sembrare una discussione in stile forum. Altri clienti possono creare diverse superfici di scoperta, sistemi di classificazione, visualizzazioni di moderazione o impostazioni predefinite della comunità pur utilizzando comunità Bitsocial compatibili sottostanti.

Il protocollo mantiene la proprietà e la pubblicazione portatili. Le app competono sulla qualità del prodotto.

## Cosa aggiunge l'RPC pubblico

Eseguire direttamente un nodo di comunità peer-to-peer è potente, ma non tutti vogliono gestire una macchina sempre attiva.

RPC pubblico è il livello di servizio che può rendere Bitsocial più conveniente. Un fornitore RPC pubblico può aiutare gli utenti a gestire le comunità da un telefono o da un client leggero, mentre il modello di proprietà a lungo termine dovrebbe comunque consentire agli utenti di trasferirsi, ospitarsi autonomamente o scegliere un fornitore concorrente.

La distinzione è importante:

- RPC può aiutarti con tempi di attività e comodità
- L'RPC non dovrebbe diventare custodia permanente
- la relazione con il proprietario dovrebbe rimanere legata alle chiavi, non al database di un fornitore

## Ciò che Bitsocial non è

Bitsocial non è un social network blockchain. I social media non hanno bisogno che ogni post diventi una transazione in un registro globale.

Bitsocial non è una federazione nel senso di ActivityPub. Non è necessario che una comunità sia un account su un server con un dominio, un amministratore e un database del server.

Anche Bitsocial non è un'app. È un livello di protocollo condiviso per app, comunità, nodi, router, provider RPC, servizi di rilevamento, moduli anti-spam e strumenti di moderazione.

Il punto non è che ogni utente debba comprendere tutto questo prima di pubblicare. Il punto è che il prodotto può sembrare normale mentre il modello di proprietà sottostante è diverso.

## Dove andare dopo

- [Protocollo peer-to-peer](./peer-to-peer-protocol.md) spiega il flusso tecnico.
- [Scoperta dei contenuti](./content-discovery.md) spiega la ricerca nella rete e la gestione delle app.
- [Sfide anti-spam personalizzate](./custom-challenges.md) spiega il sistema di sfida.
- [Identità e proprietà della comunità](./identity-and-ownership.md) spiega il controllo tramite chiave
  proprietà.
- [Crea il tuo client](/build-your-own-client/) spiega come le app indipendenti possono basarsi
  la stessa rete.
