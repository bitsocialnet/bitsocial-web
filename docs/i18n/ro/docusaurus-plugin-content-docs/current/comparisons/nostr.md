---
title: Bitsocial și Nostr
description: Cum se compară modelul bazat pe relee al Nostr cu comunitățile peer-to-peer ale Bitsocial, de la calea datelor și identitate până la grupuri, controlul spamului și moderare.
---

# Bitsocial și Nostr

Nostr nu se încadrează clar nici în categoria federației, nici în cea a blockchainului.
Utilizatorilor nu li se emit conturi de către instanțe și nu există lanț, consens, gas sau ordine
globală. Nostr este descris mai bine ca **rețea socială bazată pe relee**: utilizatorii dețin perechi
de chei, semnează evenimente și le publică către relee, adică servere obișnuite care le stochează și
le servesc ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Propriul
[README](https://github.com/nostr-protocol/nostr) al Nostr spune că acesta nu se bazează pe tehnici
peer-to-peer.

Asta apropie Nostr de Bitsocial mai mult decât sistemele federate sau cele bazate pe blockchain
într-o privință importantă: identitatea este criptografică și portabilă. Diferențele țin de stratul
de date și de cine păzește poarta.

## Cum funcționează Nostr

- **Evenimente și relee.** Fiecare postare, profil sau reacție este un eveniment JSON semnat.
  Clienții publică evenimente către relee prin WebSockets și se abonează cu filtre; releele stochează
  evenimentele și le servesc înapoi. Releele nu comunică între ele.
- **Replicare.** De obicei, utilizatorii publică pe mai multe relee. Un studiu din 2023 asupra a 712
  relee a găsit postarea medie pe 34,6 dintre ele ([Wei și Tyson](https://arxiv.org/abs/2402.05709)).
- **Găsirea postărilor cuiva.** Utilizatorii publică o listă a releelor pe care scriu și de pe care
  citesc ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), iar clienții preiau
  postările unui utilizator de pe releele lui de scriere.
- **Identitate.** Fiecare utilizator este o cheie secp256k1 care semnează cu semnături Schnorr.
  Specificațiile nu definesc rotirea sau recuperarea cheilor, așa că o cheie pierdută înseamnă un
  cont pierdut. Identificatorii opționali de forma `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) sunt verificați pe baza unui
  fișier de pe serverul web al domeniului respectiv.
- **Grupuri.** Mecanismul recomandat pentru comunități îl reprezintă grupurile bazate pe relee
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): un releu găzduiește un grup,
  aplică regulile de apartenență și de postare înainte de a accepta o postare și semnează metadatele
  grupului. Comunitățile mai vechi aprobate de moderatori
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) sunt acum marcate ca
  nerecomandate, în favoarea NIP-29.
- **Controlul spamului.** Fiecare releu își alege propria barieră: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autentificare și liste de
  permisiuni ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), plată sau limite
  de rată. Clienții adaugă liste de conturi ignorate și scoruri de încredere.
- **Media.** Imaginile și videoclipurile sunt încărcate pe servere de fișiere HTTP separate.

## Unde diferă

### Cine stochează și servește postările

În Nostr, releele sunt stratul de stocare și livrare: un server trebuie să țină fiecare postare
online. În Bitsocial, routerele HTTP doar ajută clienții să găsească peeri. Ele nu stochează postări,
profiluri, metadate de comunitate sau stare de moderare; clienții preiau conținutul de la nodul
comunității și de la peerii care o seedează. Consultați
[Protocolul peer-to-peer](/peer-to-peer-protocol/).

### Cine păzește poarta

În Nostr, porțile de scriere aparțin operatorilor de relee. În afara grupurilor NIP-29, o cheie
respinsă de un releu poate publica același eveniment pe orice releu care îl acceptă, iar ceea ce văd
cititorii depinde de releele pe care le citește clientul lor. Un grup NIP-29 seamănă mai mult cu o
comunitate Bitsocial: releul gazdă acceptă sau respinge postări. Totuși, releul definește în
continuare ce pot face rolurile din grup, iar istoricul grupului rămâne legat de acel releu, cu
excepția cazului în care un alt releu acceptă să îl preia.

În Bitsocial, o comunitate este un obiect criptografic cu propria pereche de chei. Nodul comunității
rulează provocarea aleasă de proprietar și publică starea acceptată în rețeaua peer-to-peer.
Consultați [Provocări personalizate anti-spam](/custom-challenges/).

### Operarea infrastructurii

Un releu este un server cu un domeniu și un endpoint WebSocket, iar releele populare suportă costul
de stocare și de lățime de bandă pentru ceea ce servesc. Studiul din 2023 a estimat că aproximativ
95% dintre releele gratuite nu își puteau acoperi costurile din donații. Un nod de comunitate
Bitsocial rulează pe hardware de consum, iar peerii care citesc o comunitate pot ajuta la
distribuirea ei.

### Browser

Un client web Nostr deschide conexiuni WebSocket direct către relee, așa că nu este nevoie de un
server de aplicație. O aplicație web Bitsocial rulează un nod peer-to-peer în filă și preia
conținutul de la peeri. Consultați [Peer-to-peer în browser](/browser-p2p/).

### Conținutul vechi

Postările Nostr sunt replicate pe scară largă între relee, ceea ce ajută postările vechi să
supraviețuiască. Bitsocial păstrează cea mai recentă stare a comunității și nu garantează conținutul
vechi pentru totdeauna.

## Comparație

| Întrebare              | Nostr                                                                                             | Bitsocial                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Categorie              | Protocol bazat pe relee                                                                           | Rețea de comunități peer-to-peer                                                     |
| Identitate             | Cheie de utilizator secp256k1, fără rotire în specificații                                        | Perechi de chei Ed25519 pentru utilizatori și comunități                             |
| Unde se află postările | Relee alese de autor, adesea multe                                                                | Nodul proprietarului comunității și peerii care o citesc și o seedează               |
| Cine îl ține online    | Operatorii de relee                                                                               | Nodul proprietarului comunității, plus seederi ajutători                             |
| Comunități             | Grupuri găzduite pe relee (NIP-29)                                                                | Obiecte de prim rang, al căror nod acceptă sau respinge postări                      |
| Controlul spamului     | Politica fiecărui releu: proof-of-work, autentificare, plată, liste de permisiuni, limite de rată | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                |
| Moderare               | Politicile releelor, liste de conturi ignorate în clienți, etichete și raportări                  | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează   |
| Nume                   | Identificatori opționali de forma `name@domain`, verificați prin HTTPS                            | Nume `.bso` și `.eth` care se rezolvă în chei                                        |
| Browser                | Client WebSocket al releelor                                                                      | Nod peer-to-peer într-o filă obișnuită de browser                                    |
| Compromisul principal  | Identitate portabilă și replicare largă, dar disponibilitate și politici dependente de relee      | Dependență mai mică de relee, dar conținutul vechi nu este garantat pentru totdeauna |
