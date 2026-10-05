---
title: Bitsocial și Bluesky
description: Cum se compară Bluesky și AT Protocol, cu servere personale de date, relee și AppView-uri, cu comunitățile peer-to-peer ale Bitsocial.
---

# Bitsocial și Bluesky

[Bluesky](https://bsky.app/) este o aplicație de microblogging construită pe
[AT Protocol](https://atproto.com/), proiectat de Bluesky Social PBC. Protocolul împarte o rețea
socială în servicii separate: serverele personale de date găzduiesc conturi, releele le agregă
într-un singur flux, iar AppView-urile indexează acest flux în cronologiile și firele de discuție pe
care le văd oamenii. Documentația descrie datele conturilor ca fiind stocate pe servere gazdă,
„spre deosebire de un model peer-to-peer” ([prezentare generală](https://atproto.com/guides/overview)).

## Cum funcționează AT Protocol

- **Depozite pe servere.** Fiecare postare, apreciere sau urmărire este o înregistrare în depozitul
  semnat al autorului, găzduit pe un server personal de date (PDS). Bluesky rulează serverele
  implicite și oricine își poate găzdui propriul server.
- **Relee.** Releele se abonează la fiecare PDS și retransmit modificările ca un singur flux,
  firehose-ul. De la o actualizare a protocolului din 2025, ele nu mai arhivează fiecare depozit,
  ceea ce le-a făcut mult mai ieftin de rulat
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView-uri.** Un AppView indexează întregul firehose și servește cronologii, fire complete de
  răspunsuri, contoare și căutare. Este partea rețelei care consumă cele mai multe resurse.
- **Identitate.** Un cont este un DID: de obicei `did:plc`, înregistrat într-un singur director
  global, sau `did:web`, legat de un domeniu. Documentul DID indică handle-ul contului, cheia de
  semnare și serverul curent. PDS-ul deține cheia de semnare; `did:plc` le permite utilizatorilor și
  să dețină chei de rotire proprii, ca să se poată muta fără ajutorul vechii gazde
  ([ghidul de identitate](https://atproto.com/guides/identity)).
- **Handle-uri.** Handle-urile sunt nume DNS, precum `alice.bsky.social` sau un domeniu deținut de
  utilizator, verificate în raport cu DID-ul.
- **Moderare.** Găzduirea și vizibilitatea sunt straturi separate. Oricine poate rula un labeler, iar
  utilizatorii pot combina mai mulți ([ghidul de moderare](https://atproto.com/guides/moderation)),
  dar aplicația Bluesky aplică întotdeauna moderarea proprie a Bluesky. Autorii pot limita cine le
  poate răspunde la postări și pot ascunde răspunsuri.

## Unde diferă

### Servere sau peeri

Datele Bluesky stau pe servere: un PDS găzduiește fiecare cont, releele transportă firehose-ul, iar
AppView-urile servesc ceea ce afișează clienții. Un browser este un client HTTP al acestor servicii,
niciodată un peer. În Bitsocial, nodul comunității și peerii care o citesc servesc conținutul, iar o
aplicație web își poate rula propriul nod peer-to-peer. Consultați
[Peer-to-peer în browser](/browser-p2p/).

### O vedere globală sau comunități

AT Protocol este proiectat pentru o singură vedere globală: un AppView vede fiecare răspuns, așa că
firele de discuție și căutarea sunt complete. Bitsocial nu are un index global; fiecare comunitate
își publică propria stare, iar aplicațiile construiesc descoperirea peste ea. Consultați
[Descoperirea conținutului](/content-discovery/).

Bluesky nu are în prezent un obiect de comunitate pentru postările publice. În iunie 2026 a
[anunțat comunități native](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k), în care
postarea este condiționată de aprobare la unele niveluri de confidențialitate; până în octombrie 2026
acestea nu fuseseră lansate. În Bitsocial, comunitățile sunt obiectul central, iar nodul unei
comunități acceptă sau respinge postări.

### Controlul spamului

Bluesky gestionează spamul cu limite de rată pe serverele sale, limite pentru gazdele noi la nivelul
releului, detecție automată, verificare umană și etichete, iar autorii pot restricționa răspunsurile.
Nicio barieră la nivel de comunitate nu decide prin ce trebuie să treacă o postare înainte de a fi
acceptată. În Bitsocial, fiecare comunitate își alege propria provocare. Consultați
[Provocări personalizate anti-spam](/custom-challenges/).

### Cine deține cheile

Conturile de pe serverele proprii ale Bluesky se autentifică cu o parolă, iar acele servere le
păstrează cheile de semnare în regim de custodie ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)).
Potrivit unui inginer de protocol de la Bluesky,
[majoritatea conturilor nu au chei de rotire controlate independent](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
O identitate Bitsocial este o pereche de chei generată și păstrată de aplicația utilizatorului.

### Operarea infrastructurii

Un server personal este ieftin: [PDS-ul de referință](https://github.com/bluesky-social/pds)
recomandă 1 GB de RAM pentru până la 20 de utilizatori. Un AppView independent pentru întreaga rețea
este un proiect mare; unul construit în 2025
[costa aproximativ 200 de dolari pe lună](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), mai ales
pentru 16 TB de stocare. Bitsocial nu are un index global de replicat, iar un nod de comunitate
rulează pe hardware de consum.

## Comparație

| Întrebare              | Bluesky (AT Protocol)                                                                  | Bitsocial                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Categorie              | Servere federate cu un index global                                                    | Rețea de comunități peer-to-peer                                                   |
| Identitate             | DID, cu cheile de semnare deținute de obicei de server                                 | Perechi de chei Ed25519 pentru utilizatori și comunități                           |
| Unde se află postările | Depozitul autorului pe un server personal de date                                      | Nodul proprietarului comunității și peerii care o citesc și o seedează             |
| Cine îl ține online    | Gazdele PDS, releele și AppView-urile, rulate implicit de Bluesky                      | Nodul proprietarului comunității, plus seederi ajutători                           |
| Comunități             | Deocamdată niciuna pentru postările publice (anunțate în 2026)                         | Obiecte de prim rang, al căror nod acceptă sau respinge postări                    |
| Controlul spamului     | Limite de rată pe servere, detecție automată, etichete, controlul răspunsurilor        | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată              |
| Moderare               | Labeleri combinabili; aplicația Bluesky aplică întotdeauna moderarea Bluesky           | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează |
| Nume                   | Handle-uri DNS verificate în raport cu DID-ul                                          | Nume `.bso` și `.eth` care se rezolvă în chei                                      |
| Browser                | Client HTTP al unui PDS și al unui AppView                                             | Nod peer-to-peer într-o filă obișnuită de browser                                  |
| Compromisul principal  | Fire de discuție și căutare globale complete, dar agregarea necesită servere puternice | Fără un index global greu, dar și fără o vedere completă a întregii rețele         |
