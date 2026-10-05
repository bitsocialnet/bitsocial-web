---
title: Bitsocial și rețelele sociale pe blockchain
description: Cum pun Lens, DeSo și Steem datele sau regulile sociale pe un blockchain și de ce Bitsocial nu folosește unul.
---

# Bitsocial și rețelele sociale pe blockchain

Lens, DeSo și Steem pun fiecare activitatea socială pe un blockchain. Conturile, urmăririle,
postările sau regulile din jurul lor devin tranzacții pe care validatorii le ordonează și le
stochează. Bitsocial nu folosește blockchain: rețelele sociale nu au nevoie de o ordine globală
pentru fiecare postare, așa că Bitsocial renunță la consens, gas și staking. Consultați
[Protocolul peer-to-peer](/peer-to-peer-protocol/) pentru acest raționament.

## Ce au în comun

- **Cineva plătește pentru fiecare scriere.** Lens percepe gas, pe care aplicațiile îl pot
  sponsoriza; DeSo percepe o taxă pentru fiecare acțiune; Steem raționalizează acțiunile în funcție
  de tokenurile puse în stake.
- **Lanțul impune o singură politică anti-spam pentru toți.** Taxele, stake-ul și costurile
  conturilor se aplică în toată rețeaua, în loc să fie alese de fiecare comunitate.
- **Înregistrările on-chain sunt permanente.** Aplicațiile pot ascunde conținut, dar nu îl pot
  elimina din lanț.
- **Browserele sunt clienți API.** Aplicațiile web semnează tranzacții și citesc printr-un nod, un
  indexer sau un API operat de altcineva.

## Lens

[Lens](https://lens.xyz/) rulează pe Lens Chain, un layer 2 al Ethereum construit cu ZK Stack de la
ZKsync, care folosește Avail pentru disponibilitatea datelor. Mask Network
[administrează Lens din ianuarie 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Pe lanț:** conturile sunt contracte inteligente, numele de utilizator sunt NFT-uri în spații de
  nume, iar grafurile, grupurile, fluxurile și regulile lor sunt tot contracte.
- **În afara lanțului:** textul și conținutul media al unei postări se află într-un fișier JSON la un
  URI, de obicei pe Grove, serviciul de stocare al Lens care stă în fața IPFS. Reacțiile și marcajele
  sunt păstrate de Lens API, iar aplicațiile citesc prin acest API.
- **Spam și bariere:** tranzacțiile necesită gas în GHO, pe care aplicațiile îl pot sponsoriza cu
  limite de rată. Regulile pentru fluxuri și grupuri pot cere deținerea de tokenuri sau plăți.
- **Operarea lanțului:** [L2BEAT](https://l2beat.com/scaling/projects/lens) clasifică Lens Chain drept
  validium Stage 0, cu un operator centralizat care poate refuza includerea tranzacțiilor.

## DeSo

[DeSo](https://docs.deso.org/) este un blockchain de layer 1 construit pentru aplicații sociale. A
trecut de la proof of work la proof of stake în iulie 2024.

- **Pe lanț:** profilurile, postările, aprecierile, urmăririle și mesajele directe sunt toate
  tranzacții stocate de fiecare nod complet. Imaginile și videoclipurile sunt găzduite în afara
  lanțului; nodul de referință folosește Google Cloud Storage și Cloudflare Stream.
- **Spam:** fiecare acțiune plătește o taxă în DESO. Utilizatorii noi primesc de obicei DESO de
  pornire de la un nod, după verificarea telefonului.
- **Moderare:** fiecare nod decide ce afișează prin liste negre sau liste gri, dar
  [conținutul rămâne on-chain](https://docs.deso.org/deso-blockchain/content-moderation).
- **Comunități:** documentația nu descrie nicio primitivă de comunitate sau forum; o „comunitate”
  este un flux pe care îl curatoriază o aplicație.
- **Rularea unui nod:** validatorii au nevoie de cel puțin 32 GB de RAM și 200 GB de disc, potrivit
  [ghidului pentru validatori](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) este un blockchain social care plătește autorii și curatorii în tokenuri,
cu [Steemit](https://steemit.com/) drept principală aplicație de blogging. Hive s-a desprins din
Steem în 2020; potrivit [whitepaperului Hive](https://hive.io/whitepaper.pdf), forkul a urmat
vânzării Steemit Inc. către Justin Sun.

- **Pe lanț:** postările text, comentariile, voturile și istoricul editărilor lor, ordonate de 21 de
  witnesses aleși, care produc un bloc la fiecare trei secunde. Imaginile sunt găzduite în afara
  lanțului.
- **Spam:** acțiunile consumă Resource Credits, care cresc odată cu STEEM pus în stake. Crearea unui
  cont costă STEEM; Steemit plătește costul pentru utilizatorii care își verifică adresa de e-mail și
  numărul de telefon.
- **Comunități:** acestea sunt
  [operații personalizate interpretate de un indexer](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  în afara consensului. Moderatorii pot marca postările ca ignorate (mute), ceea ce le ascunde în
  aplicații, dar le lasă on-chain.
- **Recompense:** inflația finanțează recompensele, iar voturile ponderate cu stake-ul decid cum sunt
  împărțite, așa că marii deținători influențează ce primește atenție.

## Comparație

| Întrebare             | Lens                                                                              | DeSo                                                                               | Steem                                                                                                 | Bitsocial                                                                                            |
| --------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Lanț                  | Layer 2 al Ethereum (validium ZK Stack)                                           | Layer 1 propriu, proof of stake                                                    | Lanț propriu, delegated proof of stake                                                                | Niciunul                                                                                             |
| Conținutul postărilor | JSON în afara lanțului, de obicei pe Grove                                        | Text on-chain; media în afara lanțului                                             | Text on-chain; imagini în afara lanțului                                                              | Pe nodul proprietarului comunității și la peerii care o citesc și o seedează                         |
| Identitate            | Cont de tip contract inteligent; nume de utilizator ca NFT-uri                    | Pereche de chei cu un profil on-chain                                              | Cont cu nume pe lanț, cu chei pe niveluri                                                             | Perechi de chei Ed25519 pentru utilizatori și comunități                                             |
| Comunități            | Grupuri și fluxuri ca contracte cu reguli                                         | Nicio primitivă de comunitate                                                      | Comunități interpretate de un indexer în afara consensului                                            | Obiecte de prim rang, al căror nod acceptă sau respinge postări                                      |
| Controlul spamului    | Gas (adesea sponsorizat), reguli pentru tokenuri sau plăți                        | Taxă pentru fiecare acțiune; fonduri de pornire după verificarea telefonului       | Resource Credits din stake; crearea contului cu plată                                                 | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                                |
| Moderare              | Administratori de grup, reguli on-chain, ascundere la nivelul API                 | Fiecare nod filtrează ce afișează                                                  | Postări ignorate (mute) în comunități, voturi negative ponderate cu stake-ul, filtre ale aplicațiilor | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează                   |
| Operare               | Operatorul lanțului plus Lens API și Grove                                        | Validatori cu cel puțin 32 GB de RAM                                               | Witnesses aleși plus noduri API și de indexare                                                        | Un nod de comunitate pe hardware de consum, plus seederi ajutători                                   |
| Compromisul principal | Reguli on-chain programabile, dar conținutul și citirea depind de serviciile Lens | Bazin de date deschis, dar fiecare acțiune costă o taxă și rămâne pentru totdeauna | Recompense integrate, dar stake-ul influențează vizibilitatea și guvernanța                           | Fără taxe sau stake, dar fără ordine globală, iar conținutul vechi nu este garantat pentru totdeauna |
