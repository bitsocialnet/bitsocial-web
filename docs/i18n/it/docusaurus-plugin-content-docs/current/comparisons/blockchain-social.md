---
title: Bitsocial e i social network su blockchain
description: Come Lens, DeSo e Steem mettono dati o regole social su una blockchain, e perché Bitsocial non ne usa una.
---

# Bitsocial e i social network su blockchain

Lens, DeSo e Steem mettono ciascuno l'attività social su una blockchain. Account, follow, post o le
regole che li governano diventano transazioni che i validatori ordinano e archiviano. Bitsocial non
usa alcuna blockchain: i social media non hanno bisogno di un ordine globale per ogni post, quindi
Bitsocial fa a meno di consenso, gas e staking. Vedi
[Protocollo peer-to-peer](/peer-to-peer-protocol/) per le ragioni di questa scelta.

## Cosa hanno in comune

- **Qualcuno paga ogni scrittura.** Lens fa pagare il gas, che le app possono sponsorizzare; DeSo
  applica una commissione a ogni azione; Steem raziona le azioni in base ai token in staking.
- **La catena impone a tutti un'unica politica antispam.** Commissioni, stake e costi degli account
  valgono per tutta la rete invece di essere scelti da ciascuna comunità.
- **I record onchain sono permanenti.** Le app possono nascondere i contenuti, ma non possono
  rimuoverli dalla catena.
- **I browser sono client di API.** Le app web firmano transazioni e leggono tramite un nodo, un
  indexer o un'API gestiti da qualcun altro.

## Lens

[Lens](https://lens.xyz/) gira su Lens Chain, un layer 2 di Ethereum costruito con lo ZK Stack di
ZKsync che usa Avail per la disponibilità dei dati. Mask Network
[guida Lens da gennaio 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Sulla catena:** gli account sono smart contract, i nomi utente sono NFT all'interno di
  namespace, e anche grafi, gruppi, feed e le relative regole sono contratti.
- **Fuori dalla catena:** il testo e i media di un post risiedono in un file JSON a un URI, di
  solito su Grove, il servizio di archiviazione di Lens posto davanti a IPFS. Reazioni e segnalibri
  sono conservati dalla Lens API, e le app leggono tramite quell'API.
- **Spam e filtri d'accesso:** le transazioni richiedono gas in GHO, che le app possono
  sponsorizzare con limiti di frequenza. Le regole di feed e gruppi possono richiedere il possesso
  di token o dei pagamenti.
- **Funzionamento della catena:** [L2BEAT](https://l2beat.com/scaling/projects/lens) classifica Lens
  Chain come un validium di Stage 0 con un operatore centralizzato che può rifiutarsi di includere
  transazioni.

## DeSo

[DeSo](https://docs.deso.org/) è una blockchain di layer 1 costruita per le app social. A luglio
2024 è passata dalla proof of work alla proof of stake.

- **Sulla catena:** profili, post, like, follow e messaggi diretti sono tutti transazioni archiviate
  da ogni nodo completo. Immagini e video sono ospitati offchain; il nodo di riferimento usa Google
  Cloud Storage e Cloudflare Stream.
- **Spam:** ogni azione paga una commissione in DESO. Di solito i nuovi utenti ricevono da un nodo
  una dotazione iniziale di DESO dopo la verifica del numero di telefono.
- **Moderazione:** ogni nodo decide cosa mostrare tramite blacklist o graylist, ma
  [i contenuti restano onchain](https://docs.deso.org/deso-blockchain/content-moderation).
- **Comunità:** la documentazione non descrive alcuna primitiva di comunità o di forum; una
  "comunità" è un feed curato da un'app.
- **Gestire un nodo:** secondo la
  [guida per validatori](https://docs.deso.org/deso-validators/run-a-validator), i validatori
  richiedono almeno 32 GB di RAM e 200 GB di disco.

## Steem

[Steem](https://steem.com/) è una blockchain social che ricompensa autori e curatori in token, con
[Steemit](https://steemit.com/) come principale app di blogging. Hive si è separata da Steem nel
2020; secondo il [whitepaper di Hive](https://hive.io/whitepaper.pdf), il fork è seguito alla
vendita di Steemit Inc. a Justin Sun.

- **Sulla catena:** post testuali, commenti, voti e la loro cronologia delle modifiche, ordinati da
  21 witness eletti che producono un blocco ogni tre secondi. Le immagini sono ospitate offchain.
- **Spam:** le azioni consumano Resource Credits, che crescono con gli STEEM in staking. Creare un
  account costa STEEM; Steemit lo paga per gli utenti che verificano un indirizzo email e un numero
  di telefono.
- **Comunità:** sono
  [operazioni personalizzate interpretate da un indexer](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  al di fuori del consenso. I moderatori possono silenziare i post, il che li nasconde nelle app ma
  li lascia onchain.
- **Ricompense:** l'inflazione finanzia le ricompense, e i voti pesati in base allo stake decidono
  come vengono ripartite, quindi i grandi detentori determinano cosa ottiene attenzione.

## Confronto

| Domanda                | Lens                                                                               | DeSo                                                                         | Steem                                                                       | Bitsocial                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Catena                 | Layer 2 di Ethereum (validium ZK Stack)                                            | Layer 1 proprio, proof of stake                                              | Catena propria, delegated proof of stake                                    | Nessuna                                                                                                        |
| Contenuto dei post     | JSON offchain, di solito su Grove                                                  | Testo onchain; media offchain                                                | Testo onchain; immagini offchain                                            | Sul nodo del proprietario della comunità e sui peer che la leggono e ne fanno il seeding                       |
| Identità               | Account smart contract; nomi utente NFT                                            | Coppia di chiavi con un profilo onchain                                      | Account con nome sulla catena, con chiavi a livelli                         | Coppie di chiavi Ed25519 per utenti e comunità                                                                 |
| Comunità               | Gruppi e feed come contratti con regole                                            | Nessuna primitiva di comunità                                                | Comunità interpretate da un indexer al di fuori del consenso                | Oggetti di prima classe il cui nodo accetta o rifiuta i post                                                   |
| Controllo dello spam   | Gas (spesso sponsorizzato), regole su token o pagamenti                            | Commissione su ogni azione; fondi iniziali dopo la verifica del telefono     | Resource Credits dallo stake; creazione dell'account a pagamento            | La sfida di ciascuna comunità prima che un post venga accettato                                                |
| Moderazione            | Amministratori dei gruppi, regole onchain, occultamento a livello di API           | Ogni nodo filtra ciò che mostra                                              | Silenziamenti delle comunità, downvote pesati sullo stake, filtri delle app | I proprietari moderano la propria comunità; le app scelgono cosa mostrare                                      |
| Infrastruttura         | Operatore della catena più la Lens API e Grove                                     | Validatori con almeno 32 GB di RAM                                           | Witness eletti più nodi API e indexer                                       | Un nodo di comunità su hardware consumer, più i seeder di supporto                                             |
| Compromesso principale | Regole onchain programmabili, ma contenuti e letture dipendono dai servizi di Lens | Pool di dati aperto, ma ogni azione costa una commissione e resta per sempre | Ricompense integrate, ma lo stake condiziona visibilità e governance        | Nessuna commissione né stake, ma nessun ordinamento globale e i vecchi contenuti non sono garantiti per sempre |
