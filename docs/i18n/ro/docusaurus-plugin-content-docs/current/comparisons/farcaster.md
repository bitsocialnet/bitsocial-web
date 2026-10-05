---
title: Bitsocial și Farcaster
description: Cum se compară Farcaster, cu conturi onchain, chirie pentru stocare și rețeaua de validatori Snapchain, cu comunitățile peer-to-peer ale Bitsocial.
---

# Bitsocial și Farcaster

[Farcaster](https://docs.farcaster.xyz/) ține identitatea pe un blockchain, iar datele sociale în
afara lui. Conturile, cheile de aplicație și plățile pentru stocare se află în contracte pe OP
Mainnet, un layer 2 al Ethereum. Postările, numite casturi, împreună cu urmăririle și reacțiile, sunt
mesaje semnate stocate de [Snapchain](https://snapchain.farcaster.xyz/), o rețea asemănătoare unui
blockchain care a înlocuit în 2025 vechea rețea de Huburi a Farcaster.

## Cum funcționează Farcaster

- **Conturi.** Un cont este un Farcaster ID numeric deținut de o adresă Ethereum, care poate stabili
  și o adresă de recuperare. Aplicațiile postează cu chei de aplicație delegate, înregistrate
  onchain; o cheie de aplicație nu poate prelua contul.
- **Chirie pentru stocare.** Fiecare cont închiriază unități de stocare, în prezent cu 0,20 USD pe
  unitate pe an. O unitate închiriată din iulie 2025 cuprinde 100 de casturi; peste acest prag, cele
  mai vechi casturi sunt eliminate. Limitele de rată cresc odată cu stocarea închiriată.
- **Snapchain.** Validatorii ordonează mesajele în blocuri printr-un consens în stilul Tendermint,
  iar fiecare nod complet păstrează datele întregii rețele. Nodurile au nevoie de aproximativ 16 GB
  de RAM și 2 TB de stocare, potrivit
  [ghidului pentru noduri](https://snapchain.farcaster.xyz/getting-started).
- **Nume.** Numele de utilizator implicite, numite fnames, sunt gratuite și emise de serverul de nume
  propriu al Farcaster, care
  [le poate revoca](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Utilizatorii pot
  folosi în schimb un nume `.eth` înregistrat pe Ethereum.
- **Canale.** Canalele tematice sunt o funcție experimentală a clientului Farcaster. Casturile dintr-un
  canal sunt date de protocol, dar metadatele canalului, urmăririle și moderarea sunt
  [stocate în client](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Citire.** Aplicațiile citesc printr-un nod Snapchain pe care îl rulează singure sau printr-un
  furnizor administrat, de obicei Neynar.

## Unde diferă

### Blockchainuri și validatori

Farcaster depinde de OP Mainnet pentru conturi și plăți, și de Snapchain, o rețea asemănătoare unui
blockchain, pentru ordonarea tuturor datelor sociale. Setul de validatori Snapchain este
permisionat. Whitepaperul său spune că cenzura devine dificilă la aproximativ zece validatori
distribuiți global; în octombrie 2026,
[lista de validatori](https://snapchain.farcaster.xyz/validators) era mai scurtă, iar majoritatea
cheilor aparțineau Neynar, care a
[achiziționat Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) în ianuarie 2026.
Bitsocial nu are lanț, validatori sau consens.

### Plata pentru postare

Fiecare cont Farcaster plătește chirie pentru stocare, iar stocarea limitează cât din istoricul unui
cont păstrează rețeaua. În Bitsocial, postarea nu costă nimic la nivelul protocolului; fiecare
comunitate decide dacă cere un captcha, o plată, un token sau altceva. Consultați
[Provocări personalizate anti-spam](/custom-challenges/).

### Comunități

Canalele Farcaster sunt o funcție a clientului: clientul le stochează metadatele și aplică moderarea
canalelor, așa că un cast blocat într-un canal poate rămâne valid în rețea și vizibil în alte
aplicații. În Bitsocial, comunitățile sunt obiecte de protocol cu propria pereche de chei, iar nodul
comunității acceptă sau respinge postări.

### Operarea infrastructurii

Un nod Farcaster conține întreaga rețea, așa că stocarea lui crește odată cu toată activitatea;
Farcaster estimează o creștere spre cele mai mari discuri din cloud. Un nod de comunitate Bitsocial
conține doar propriile comunități și rulează pe hardware de consum.

### Browser

O aplicație Farcaster de browser este un client HTTP al unui nod sau furnizor. O aplicație web
Bitsocial poate rula un nod peer-to-peer în filă. Consultați [Peer-to-peer în browser](/browser-p2p/).

## Comparație

| Întrebare              | Farcaster                                                                                      | Bitsocial                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Categorie              | Identitate onchain cu date sociale ordonate de validatori                                      | Rețea de comunități peer-to-peer                                                                              |
| Identitate             | Farcaster ID deținut de o adresă Ethereum, cu chei de aplicație delegate                       | Perechi de chei Ed25519 pentru utilizatori și comunități                                                      |
| Unde se află postările | Snapchain, replicat pe fiecare nod complet, în limitele stocării plătite                       | Nodul proprietarului comunității și peerii care o citesc și o seedează                                        |
| Cine îl ține online    | Validatorii Snapchain și operatorii de noduri                                                  | Nodul proprietarului comunității, plus seederi ajutători                                                      |
| Comunități             | Canale experimentale gestionate de clientul Farcaster                                          | Obiecte de prim rang, al căror nod acceptă sau respinge postări                                               |
| Controlul spamului     | Chirie pentru stocare și limite de rată, plus etichete de spam la nivelul aplicației           | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                                         |
| Moderare               | Gazdele canalelor în client, filtre ale aplicațiilor, risc de cenzură la nivelul validatorilor | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează                            |
| Nume                   | Fnames gratuite pe care Farcaster le poate revoca sau nume `.eth`                              | Nume `.bso` și `.eth` care se rezolvă în chei                                                                 |
| Browser                | Client HTTP al unui nod sau furnizor                                                           | Nod peer-to-peer într-o filă obișnuită de browser                                                             |
| Compromisul principal  | Un singur set de date global și consecvent, dar chirie, lanțuri și un set mic de validatori    | Fără taxe sau lanțuri, dar fără un set de date global, iar conținutul vechi nu este garantat pentru totdeauna |
