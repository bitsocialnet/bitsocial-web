---
title: Bitsocial și Mirage
description: Cum se compară Mirage, un forum în stilul Reddit pe propriul blockchain Cosmos SDK, cu Bitsocial și cu aplicația sa în stilul Reddit, Seedit.
---

# Bitsocial și Mirage

[Mirage](https://mirage.foundation/) este o rețea de discuții în stilul Reddit, cu comunități,
postări în fire de discuție și voturi. În loc de baza de date a unei companii, rulează pe propriul
blockchain, un lanț Cosmos SDK cu consens CometBFT. Cel mai apropiat produs Bitsocial este
[Seedit](/apps/seedit/), o aplicație în stilul Reddit din rețeaua Bitsocial, așa că o comparație
privește mai ales felul în care fiecare găzduiește, deține și moderează comunități.

## Cum funcționează Mirage

- **Noduri.** Un nod Mirage este un singur container Docker care conține un validator, o bază de date
  PostgreSQL, un indexer, un API HTTP și frontendul web. Fiecare nod este și validator. Rularea unui
  nod necesită un server Ubuntu pe amd64 și 10.000.000 de tokenuri MIRAGE în contul operatorului,
  potrivit
  [ghidului de implementare](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Postare.** Browserul semnează fiecare acțiune cu cheia secp256k1 a utilizatorului, iar
  utilizatorii gratuiți calculează în plus un mic proof-of-work. Nodul încapsulează acțiunea într-o
  tranzacție pe lanț și plătește taxa.
- **Citire.** Indexerul fiecărui nod copiază datele lanțului în propria bază de date și servește
  fluxuri printr-un API HTTP. Nodurile păstrează blocuri din aproximativ o săptămână, așa că istoricul
  pe termen lung al postărilor se află în baza de date a fiecărui nod, iar un nod nou pornește fără
  istoricul de dinaintea punctului său de sincronizare.
- **Conturi.** Un cont este o cheie derivată dintr-o frază seed de 12 cuvinte, iar aceeași frază
  funcționează pe orice nod. Numele de utilizator sunt înregistrate pe lanț și sunt unice în toată
  rețeaua.
- **Comunități.** Orice nume valid este deja o comunitate și nimeni nu o deține. Echipe plătite de
  curatori, de până la zece utilizatori, întrețin fiecare câte o vedere moderată a unei comunități;
  cititorii aleg vederea unei echipe, vederea implicită a nodului sau o vedere necenzurată.
  Consultați [FAQ-ul Mirage](https://mirage.talk/faq).
- **Token.** Tokenul MIRAGE plătește abonamentele, recompensează autorii și nodurile și le oferă
  validatorilor pondere în guvernanță. Abonații sar peste proof-of-work și au limite mai mari.

## Unde diferă

### Cine deține o comunitate

În Seedit, creatorul unei comunități deține perechea ei de chei, îi rulează sau îi deleagă nodul și o
moderează. În Mirage, nimeni nu deține o comunitate: echipe de curatori concurente oferă vederi
moderate ale aceluiași nume, iar vederea implicită este cea a echipei alese de cei mai mulți abonați
plătitori.

### Controlul spamului

Mirage aplică o singură regulă în toată rețeaua: utilizatorii gratuiți plătesc cu proof-of-work, a
cărui dificultate se ajustează după volumul primit, iar abonații sar peste el. În Bitsocial, fiecare
comunitate își alege propria provocare, de la captcha la liste de permisiuni și plăți. Consultați
[Provocări personalizate anti-spam](/custom-challenges/).

### Infrastructură

Mirage are nevoie de un blockchain. Validatorii ajung la consens asupra fiecărei acțiuni, iar fiecare
nod rulează o stivă completă de server și trebuie să dețină un stake mare în tokenuri. Bitsocial nu
are lanț: un nod de comunitate rulează pe hardware de consum, din aplicația desktop sau din
`bitsocial-cli`, iar cititorii pot ajuta la distribuirea conținutului.

### Controlul asupra întregii rețele

Mirage are o guvernanță on-chain ponderată cu stake-ul validatorilor. Aceasta poate schimba
dificultatea, prețurile și emisiunea de tokenuri, poate crea sau arde tokenuri și poate numi
administratori ale căror ștergeri indexerul de referință le aplică oricărei postări. Codul lanțului
permite guvernanței și să
[șteargă conturi](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
și să
[trimită tokenuri de la orice adresă](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
În octombrie 2026, patru validatori produceau blocurile lanțului, iar runbook-urile proprii ale
proiectului îi gestionau pe toți patru.

Bitsocial nu are un administrator la nivel de protocol. Proprietarii comunităților își moderează
propriile comunități, iar aplicațiile aleg ce afișează. Consultați
[Moderare locală, nu interdicții globale](/local-moderation/).

### Browser

Clientul web Mirage este un client HTTP al unui nod: browserul semnează acțiunile, dar nu se alătură
unei rețele peer-to-peer. Aplicațiile Bitsocial pot rula un nod peer-to-peer în fila browserului.
Consultați [Peer-to-peer în browser](/browser-p2p/).

## Comparație

| Întrebare              | Mirage                                                                                                                        | Bitsocial                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Categorie              | Forum pe propriul blockchain (Cosmos SDK)                                                                                     | Rețea de comunități peer-to-peer                                                                                    |
| Identitate             | Cheie secp256k1 dintr-o frază seed de 12 cuvinte, cu nume de utilizator on-chain                                              | Perechi de chei Ed25519 pentru utilizatori și comunități                                                            |
| Unde se află postările | Tranzacții pe lanț, apoi baza de date PostgreSQL a fiecărui nod                                                               | Nodul proprietarului comunității și peerii care o citesc și o seedează                                              |
| Cine îl ține online    | Noduri validatoare, fiecare deținând 10.000.000 de MIRAGE                                                                     | Nodul proprietarului comunității, plus seederi ajutători                                                            |
| Comunități             | Nume fără proprietar, cu echipe de curatori plătite concurente                                                                | Deținute de o pereche de chei; nodul proprietarului acceptă sau respinge postări                                    |
| Controlul spamului     | Proof-of-work la nivelul întregii rețele; abonații sar peste el                                                               | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                                               |
| Moderare               | Vederi ale echipelor de curatori, filtre personale, administratori numiți prin guvernanță                                     | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează                                  |
| Economie               | Tokenul MIRAGE pentru abonamente, recompense și stake-ul validatorilor                                                        | Niciuna în protocol; o provocare poate cere o plată sau un token                                                    |
| Browser                | Client HTTP al unui nod                                                                                                       | Nod peer-to-peer într-o filă obișnuită de browser                                                                   |
| Compromisul principal  | O stare comună și ordonată și o înscriere ușoară, dar un set mic de validatori și puteri de guvernanță asupra întregii rețele | Nu e nevoie de lanț sau stake, dar nu există ordine globală, iar conținutul vechi nu este garantat pentru totdeauna |
