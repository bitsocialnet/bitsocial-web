---
title: Bitsocial și Lapis Net
description: Cum se compară cu Bitsocial Lapis Net, un protocol social peer-to-peer scris în Kotlin, cu scoruri de încredere pentru fiecare cititor și vizibilitate susținută de Bitcoin.
---

# Bitsocial și Lapis Net

[Lapis Net](https://net.lapisproject.dev/) este un protocol peer-to-peer pentru rețele sociale, scris
în Kotlin pentru JVM. A ajuns independent la fundații apropiate de cele ale Bitsocial: identități
bazate pe perechi de chei, stocarea conținutului în stilul IPFS și gossipsub din libp2p. Cele două
diferă prin locul în care plasează filtrarea spamului și curatoriatul. Lapis îi oferă fiecărui
cititor un graf personal de încredere și lasă plățile Bitcoin și Lightning să crească vizibilitatea;
Bitsocial lasă fiecare comunitate să decidă ce poate fi publicat.

Lapis este un prototip funcțional. În octombrie 2026 nu avea încă o rețea publică, iar conectarea a
două noduri era un pas manual, potrivit
[depozitului](https://github.com/lapisproject-dev/Lapis-Net) său.

## Cum funcționează Lapis

- **Identități.** Fiecare identitate este o pereche de chei secp256k1, compatibilă cu cheile
  Bitcoin, cu o cheie Ed25519 legată de ea pentru ID-ul de peer libp2p.
- **Stocare și propagare.** Conținutul este stocat cu Nabu, o implementare IPFS pe libp2p (DHT și
  Bitswap), și răspândit prin gossipsub din libp2p.
- **Scoruri.** Patru scoruri opționale se află peste un nucleu care rămâne neutru față de
  curatoriat:
  - Veritas, o rețea de încredere (web of trust) calculată din graful de încredere propriu al
    fiecărui cititor
  - Virtus, vizibilitate susținută de dovezi de plată on-chain sau Lightning, care se diminuează în
    timp
  - Karma, aprecieri gratuite ponderate cu Veritas
  - Madli, un scor de reputație pe care nodurile îl țin despre comportamentul celorlalte
- **Mesagerie.** Mesajele directe criptate end-to-end, apelurile vocale unu-la-unu și un sistem de
  mesaje asincrone asemănător e-mailului fac parte din proiect.
- **Clienți.** Fiecare utilizator rulează un nod JVM. Clientul de referință este o interfață web
  servită de acel nod local.

## Unde diferă

### Cine filtrează spamul

Lapis filtrează la nivelul cititorului. Conținutul se propagă, apoi graful de încredere al fiecărui
cititor și regulile de plată ale aplicației pe care o folosește decid ce iese la suprafață.
Bitsocial filtrează la nivelul comunității: o postare trebuie să treacă de provocarea comunității
înainte ca nodul comunității să o accepte, așa că spamul respins nu devine niciodată parte a
comunității. Consultați [Provocări personalizate anti-spam](/custom-challenges/).

### Cine deține puterea

În Lapis, fiecare cititor decide în cine are încredere, iar operatorul fiecărei aplicații decide cum
funcționează acolo vizibilitatea plătită. În Bitsocial, proprietarul unei comunități stabilește
regulile pentru acea comunitate, iar aplicațiile aleg ce afișează. Niciunul nu are un administrator
la nivel de protocol.

### Economie

Lapis integrează dovezile de plată Bitcoin și Lightning în scorul său de vizibilitate. Bitsocial nu
are un strat de plăți în protocol; o comunitate poate cere o plată sau un token prin provocarea ei.

### Browser

Aplicațiile Bitsocial pot rula un nod peer-to-peer într-o filă obișnuită de browser. Consultați
[Peer-to-peer în browser](/browser-p2p/). Interfața de browser a Lapis este o pagină locală servită
de nodul JVM al utilizatorului.

### Domeniu de aplicare

Lapis include mesaje directe, apeluri vocale și e-mail. Bitsocial se concentrează pe comunități
publice și nu are încă mesaje directe native.

## Comparație

| Întrebare              | Lapis Net                                                                                                 | Bitsocial                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Categorie              | Protocol social peer-to-peer (prototip)                                                                   | Rețea de comunități peer-to-peer                                                          |
| Identitate             | Pereche de chei secp256k1 cu un ID de peer Ed25519 legat de ea                                            | Perechi de chei Ed25519 pentru utilizatori și comunități                                  |
| Unde se află postările | Stocare Nabu (IPFS pe libp2p) pe nodurile participante                                                    | Nodul proprietarului comunității și peerii care o citesc și o seedează                    |
| Comunități             | Niciun obiect de comunitate; curatoriatul se face per cititor și per aplicație                            | Obiecte de prim rang, al căror nod acceptă sau respinge postări                           |
| Controlul spamului     | Graful de încredere al cititorului, vizibilitate plătită, depozite Lightning pentru primele mesaje        | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                     |
| Moderare               | Graful de încredere al fiecărui cititor; operatorii aplicațiilor stabilesc regulile vizibilității plătite | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează        |
| Economie               | Dovezi de plată Bitcoin și Lightning în scoruri                                                           | Niciuna în protocol; o provocare poate cere o plată sau un token                          |
| Browser                | Interfață web locală servită de un nod JVM                                                                | Nod peer-to-peer într-o filă obișnuită de browser                                         |
| Rețea                  | Prototip fără rețea publică                                                                               | Rețea activă, cu aplicații precum [5chan](/apps/5chan/) și [Seedit](/apps/seedit/)        |
| Compromisul principal  | Reputație și mesagerie integrate bogate, dar încă fără rețea publică                                      | Nucleu mai mic, care rulează în browsere, dar fără reputație sau mesaje directe integrate |

## Ar putea funcționa împreună?

Provocările Bitsocial sunt cod arbitrar, așa că un scor de încredere în stilul Lapis ar putea deveni
una dintre ele. Provocarea integrată `whitelist` poate deja citi liste de adrese permise de la
URL-uri. Un serviciu care ar publica adresele Bitsocial în care are încredere un graf Veritas le-ar
putea permite acelor autori să sară peste un CAPTCHA într-o comunitate. Pentru asta ar fi nevoie de o
modalitate de a lega o identitate Lapis de o adresă Bitsocial, iar așa ceva nu există astăzi.
