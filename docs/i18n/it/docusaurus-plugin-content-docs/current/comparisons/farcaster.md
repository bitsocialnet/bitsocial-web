---
title: Bitsocial e Farcaster
description: Come Farcaster, con account onchain, affitto dello spazio di archiviazione e la rete di validatori Snapchain, si confronta con le comunità peer-to-peer di Bitsocial.
---

# Bitsocial e Farcaster

[Farcaster](https://docs.farcaster.xyz/) tiene l'identità su una blockchain e i dati social fuori da
essa. Account, chiavi delle app e pagamenti per lo spazio di archiviazione risiedono in contratti su
OP Mainnet, un layer 2 di Ethereum. I post, chiamati cast, insieme a follow e reazioni, sono
messaggi firmati archiviati da [Snapchain](https://snapchain.farcaster.xyz/), una rete simile a una
blockchain che nel 2025 ha sostituito la precedente rete di Hub di Farcaster.

## Come funziona Farcaster

- **Account.** Un account è un Farcaster ID numerico posseduto da un indirizzo Ethereum, che può
  anche impostare un indirizzo di recupero. Le app pubblicano tramite chiavi delegate registrate
  onchain; una chiave di app non può impadronirsi dell'account.
- **Affitto dello spazio.** Ogni account affitta unità di spazio di archiviazione, attualmente a
  0,20 dollari per unità all'anno. Un'unità affittata da luglio 2025 contiene 100 cast; oltre questa
  soglia, i cast più vecchi vengono eliminati. I limiti di frequenza crescono con lo spazio
  affittato.
- **Snapchain.** I validatori ordinano i messaggi in blocchi con un consenso in stile Tendermint, e
  ogni nodo completo conserva i dati dell'intera rete. Secondo la
  [guida ai nodi](https://snapchain.farcaster.xyz/getting-started), i nodi richiedono circa 16 GB di
  RAM e 2 TB di spazio di archiviazione.
- **Nomi.** I nomi utente predefiniti, chiamati fname, sono gratuiti e vengono emessi dal name
  server di Farcaster stessa, che
  [può revocarli](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). In alternativa gli
  utenti possono usare un nome `.eth` registrato su Ethereum.
- **Canali.** I canali tematici sono una funzionalità sperimentale del client Farcaster. I cast in
  un canale sono dati di protocollo, ma metadati, follow e moderazione del canale sono
  [archiviati nel client](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Lettura.** Le app leggono tramite un nodo Snapchain gestito in proprio o tramite un fornitore
  gestito, di solito Neynar.

## Dove differiscono

### Blockchain e validatori

Farcaster dipende da OP Mainnet per account e pagamenti, e da Snapchain, una rete simile a una
blockchain, per ordinare tutti i dati social. L'insieme dei validatori di Snapchain è permissioned.
Il suo whitepaper afferma che la censura diventa difficile con circa dieci validatori distribuiti a
livello globale; a ottobre 2026 il suo
[elenco dei validatori](https://snapchain.farcaster.xyz/validators) era più corto, e la maggior
parte delle chiavi apparteneva a Neynar, che ha
[acquisito Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) a gennaio 2026.
Bitsocial non ha catena, validatori né consenso.

### Pagare per pubblicare

Ogni account Farcaster paga l'affitto dello spazio di archiviazione, e lo spazio limita quanta parte
della cronologia di un account la rete conserva. In Bitsocial pubblicare non costa nulla a livello
di protocollo; ogni comunità decide se richiedere un captcha, un pagamento, un token o altro. Vedi
[Sfide anti-spam personalizzate](/custom-challenges/).

### Comunità

I canali di Farcaster sono una funzionalità del client: il client ne archivia i metadati e applica
la moderazione dei canali, quindi un cast bloccato in un canale può restare valido sulla rete e
visibile in altre app. In Bitsocial le comunità sono oggetti di protocollo con una propria coppia di
chiavi, e il nodo della comunità accetta o rifiuta i post.

### Gestire l'infrastruttura

Un nodo Farcaster contiene l'intera rete, quindi il suo spazio di archiviazione cresce con tutta
l'attività; Farcaster prevede una crescita che si avvicina ai dischi cloud più grandi disponibili.
Un nodo di comunità Bitsocial contiene solo le proprie comunità e gira su hardware consumer.

### Browser

Un'app Farcaster nel browser è un client HTTP di un nodo o di un fornitore. Un'app web Bitsocial può
eseguire un nodo peer-to-peer dentro la scheda. Vedi [Peer-to-peer nel browser](/browser-p2p/).

## Confronto

| Domanda                | Farcaster                                                                                   | Bitsocial                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Categoria              | Identità onchain con dati social ordinati dai validatori                                    | Rete di comunità peer-to-peer                                                                                       |
| Identità               | Farcaster ID posseduto da un indirizzo Ethereum, con chiavi delegate per le app             | Coppie di chiavi Ed25519 per utenti e comunità                                                                      |
| Dove risiedono i post  | Snapchain, replicata su ogni nodo completo, entro i limiti dello spazio pagato              | Il nodo del proprietario della comunità e i peer che la leggono e ne fanno il seeding                               |
| Chi lo tiene online    | Validatori di Snapchain e gestori dei nodi                                                  | Nodo del proprietario della comunità più i seeder di supporto                                                       |
| Comunità               | Canali sperimentali gestiti dal client Farcaster                                            | Oggetti di prima classe il cui nodo accetta o rifiuta i post                                                        |
| Controllo dello spam   | Affitto dello spazio e limiti di frequenza, più etichette antispam a livello di app         | La sfida di ciascuna comunità prima che un post venga accettato                                                     |
| Moderazione            | Gestori dei canali nel client, filtri delle app, rischio di censura a livello di validatori | I proprietari moderano la propria comunità; le app scelgono cosa mostrare                                           |
| Nomi                   | Fname gratuiti revocabili da Farcaster, oppure nomi `.eth`                                  | Nomi `.bso` e `.eth` che si risolvono in chiavi                                                                     |
| Browser                | Client HTTP di un nodo o di un fornitore                                                    | Nodo peer-to-peer dentro una normale scheda del browser                                                             |
| Compromesso principale | Un unico insieme di dati globale e coerente, ma affitto, catene e pochi validatori          | Nessuna commissione né catena, ma nessun insieme di dati globale e i vecchi contenuti non sono garantiti per sempre |
