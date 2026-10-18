---
title: Dove vivono i post e per quanto tempo restano disponibili
description: Perché i post di Bitsocial sono firmati e indirizzati in base al contenuto ma non conservati per sempre da ogni nodo, chi li mantiene online e come gli archivi mantengono leggibili i contenuti vecchi.
---

# Dove vivono i post e per quanto tempo restano disponibili

Bitsocial non salva ogni post su una blockchain o nel database di un'azienda. Il nodo di ogni
comunità conserva i suoi post, lettori e seeder aiutano a servirli, e chiunque voglia un archivio
permanente può tenerne uno. Conservare i post per sempre è **facoltativo, non obbligatorio**: il
protocollo non costringe ogni partecipante a conservare l'intera storia della rete.

Questa pagina spiega cosa significa in pratica, perché "non conservato per sempre" è facile da
fraintendere come "sparisce" o "fidati di me".

## Autenticità e disponibilità sono due domande diverse

Su un post ci sono due domande diverse:

1. **È autentico?** L'ha scritto questo autore, ed è stato accettato da questa comunità?
2. **È ancora online?** Qualcuno può recuperarlo oggi?

Bitsocial risponde alla prima domanda con la crittografia, non con la fiducia. Ogni post è firmato
dalla coppia di chiavi del suo autore e, una volta accettato da una comunità, viene salvato sotto un
identificatore di contenuto (CID): l'hash dei suoi byte esatti. Chiunque recuperi un post può
verificare da sé la firma e l'hash. Un nodo, un router, un gateway o un archivio non può modificare
il testo di un post o falsificare un post a nome di qualcun altro senza che la verifica fallisca.

La seconda domanda riguarda chi conserva una copia, ed è l'unica parte che non è garantita.

## Chi mantiene i post online

- **Il nodo della comunità.** Il nodo del proprietario accetta i post e li conserva nel suo database
  finché la comunità li mantiene. È l'unica copia che esiste sempre finché la comunità è attiva. Vedi
  [Protocollo peer-to-peer](/peer-to-peer-protocol/).
- **I lettori.** Le app desktop come l'app Electron di 5chan fanno da seed per le comunità che
  caricano mentre sono aperte, quindi le comunità popolari sono servite da molti peer, come succede
  con i torrent popolari. Una scheda del browser può memorizzare e verificare i contenuti mentre è
  aperta, ma non è un host di lunga durata.
- **I seeder.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) permette a
  chiunque di contribuire capacità sempre attiva da un VPS o da una macchina di riserva. Fissa
  (pin) le pagine più recenti e gli aggiornamenti dei post delle comunità, e questo rende caricabili
  dal browser anche le comunità ospitate dietro un router di casa.
- **Gli archivi.** Chiunque può scansionare le comunità e conservare tutto ciò che vede. Gli archivi
  sono normali servizi costruiti sopra la rete, non un ruolo speciale nel protocollo.

## Ogni comunità sceglie quanto conservare

Per quanto tempo una comunità conserva i post vecchi lo decide il suo proprietario, non una regola
del protocollo. Alcune comunità vogliono anni di storia. Altre sono fatte per dimenticare: le board
di 5chan funzionano come un imageboard, dove i thread scivolano fuori dalla board, finiscono in un
archivio e vengono eliminati dal nodo della board dopo un certo tempo (48 ore per impostazione
predefinita). Una comunità può anche fare a meno dell'archivio.

Lo stesso protocollo supporta entrambe le cose perché la conservazione è una politica che ogni
comunità imposta, non un costo che ogni nodo deve pagare.

## Perché non conservare tutto per sempre?

Una rete che obbliga ogni nodo a conservare ogni post per sempre deve pagarlo in qualche modo:

- **Le blockchain** obbligano ogni nodo completo a conservare tutta la storia, quindi i requisiti dei
  nodi crescono con tutta l'attività, e di solito pubblicare costa una commissione.
- **Lo storage a pagamento**, come l'affitto dello spazio di Farcaster, fa pagare agli utenti la
  conservazione della loro storia ed elimina i post più vecchi oltre lo spazio pagato. Vedi
  [Bitsocial e Farcaster](/comparisons/farcaster/).
- **I server centrali** conservano tutto, ma solo finché un'azienda lo vuole, alle regole di
  quell'azienda.

I social media non hanno bisogno di un registro globale. Non importa se il post A è stato accettato
un millisecondo prima del post B, e la maggior parte dei post vecchi viene letta di rado. Bitsocial
lascia che ogni nodo di comunità ospiti solo le proprie comunità, e questo mantiene l'hosting
abbastanza economico per un portatile, un Raspberry Pi o un piccolo VPS. Vedi
[Perché non una blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Il compromesso

Se nessuno conserva una copia di un post, quel post può diventare irraggiungibile. Il CID di un post
non cambia mai, ma un CID è solo un indirizzo: il contenuto resta recuperabile solo finché almeno un
nodo lo serve. Se il nodo di una comunità va offline per sempre e nessun lettore, seeder o archivio
ne ha conservato i post, quei post sono persi.

È il costo onesto di non imporre un registro globale. Ed è anche lo stesso costo che hanno già tutte
le grandi piattaforme: i post vecchi spariscono quando spariscono account, server o aziende. La
differenza è che su Bitsocial conservare qualcosa non richiede il permesso di nessuno.

## Conservare ciò che conta

- **Esegui tu il nodo della comunità.** Un proprietario che tiene acceso il nodo conserva la storia
  della comunità, per quanto previsto dalle impostazioni di conservazione della comunità.
- **Fai da seed.** Lasciare aperta un'app desktop o eseguire `bitsocial-seeder` mantiene le comunità
  disponibili per gli altri.
- **Archivia.** Gli archivi indipendenti mantengono leggibili e ricercabili i thread vecchi anche
  dopo che una comunità li ha eliminati. [5archive.org](https://5archive.org) archivia le board di
  5chan e [seeditarchive.org](https://seeditarchive.org) archivia le comunità di Seedit. Entrambi
  sono open source, quindi chiunque può gestire un mirror o un archivio concorrente.

Siccome ogni post archiviato resta firmato, un archivio non può riscrivere di nascosto ciò che
qualcuno ha detto: un lettore può verificare la firma di un post archiviato esattamente come quella
di un post dal vivo.
