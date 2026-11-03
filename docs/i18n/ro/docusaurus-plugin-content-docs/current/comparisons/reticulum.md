---
title: Bitsocial și Reticulum
description: Cum se compară Reticulum, stiva de rețea criptografică pentru LoRa și alte legături cu lățime de bandă redusă, cu Bitsocial și dacă Bitsocial ar putea rula peste Reticulum.
---

# Bitsocial și Reticulum

[Reticulum](https://reticulum.network/) este o stivă de rețea bazată pe criptografie, cu care se
construiesc rețele peste orice mediu de transmisie disponibil: radiouri LoRa, packet radio, legături
seriale, Wi-Fi, Ethernet, TCP, UDP sau I2P. Este adesea pomenit alături de Bitsocial, pentru că
amândouă elimină compania de la mijloc. O fac însă la straturi diferite, așa că se completează
reciproc, în loc să concureze.

## Straturi diferite

Reticulum înlocuiește stratul de rețea. Oferă aplicațiilor endpointuri criptate și rutabile, fără
adrese IP, DNS, autorități de certificare sau conturi, și este proiectat să funcționeze în continuare
pe legături de doar 5 biți pe secundă, cu un MTU de 500 de octeți. Nu definește postări, comunități
sau moderare; aplicațiile construite deasupra lui le adaugă.

Bitsocial este un protocol social. Rulează pe stiva IPFS/libp2p peste conexiuni obișnuite la
internet, inclusiv dintr-o filă de browser, și definește comunități, publicații și provocări
anti-spam proprii fiecărei comunități. Consultați [Protocolul peer-to-peer](/peer-to-peer-protocol/)
și [Peer-to-peer în browser](/browser-p2p/).

În stiva Bitsocial, Reticulum s-ar situa aproximativ acolo unde se află libp2p, nu acolo unde se află
protocolul Bitsocial.

## Cum funcționează Reticulum

- **Identități.** O identitate Reticulum este un set de chei de 512 biți: o cheie X25519 pentru
  criptare și o cheie Ed25519 pentru semnături.
- **Destinații.** Aplicațiile creează destinații, adresate printr-un hash SHA-256 trunchiat la 16
  octeți. Pachetele nu poartă nicio adresă sursă.
- **Anunțuri.** O destinație devine accesibilă trimițând un anunț. Nodurile de transport îl
  retransmit și rețin următorul hop înapoi, așa că niciun nod nu are nevoie de o hartă a întregii
  rețele.
- **Criptare.** Traficul este criptat implicit, cu chei efemere și forward secrecy.
- **LXMF.** Stratul de mesagerie [LXMF](https://github.com/markqvist/LXMF) adaugă mesaje semnate,
  livrare directă și stocare cu retransmitere ulterioară (store-and-forward) prin noduri de
  propagare, pentru destinatarii care sunt offline.

Printre aplicațiile construite astfel se numără [Sideband](https://github.com/markqvist/Sideband),
pentru mesagerie, și [Nomad Network](https://github.com/markqvist/NomadNet), pentru mesagerie și
pagini găzduite. Manualul Reticulum întreține o
[listă de programe](https://reticulum.network/manual/software.html).

## Comparație

| Întrebare          | Reticulum                                                                                                                       | Bitsocial                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Ce este            | Stivă de rețea                                                                                                                  | Protocol social peer-to-peer și aplicații                                                                           |
| Conceput pentru    | Orice mediu de transmisie, până la legături radio lente                                                                         | Conexiuni la internet, inclusiv file de browser                                                                     |
| Identitate         | Set de chei X25519 și Ed25519                                                                                                   | Perechi de chei Ed25519 pentru utilizatori și comunități                                                            |
| Adrese             | Hash al unei identități și al unui nume de aplicație                                                                            | Hash al cheii publice a unei comunități                                                                             |
| Găsirea unui peer  | Anunțuri răspândite de nodurile de transport                                                                                    | Routerele HTTP returnează peerii furnizori                                                                          |
| Funcții sociale    | Adăugate de aplicații precum Nomad Network                                                                                      | Comunități, postări, răspunsuri și moderare în protocol                                                             |
| Controlul spamului | Limite de rată pentru anunțuri pe fiecare interfață; ștampile proof-of-work LXMF pe care le poate cere un destinatar sau un nod | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                                               |
| Livrare offline    | Nodurile de propagare LXMF stochează și retransmit mesajele                                                                     | Peerii continuă să servească cea mai recentă stare a unei comunități; publicarea necesită ca nodul ei să fie online |

## Ar putea Bitsocial să ruleze peste Reticulum?

Nu în prezent. Bitsocial nu are un transport Reticulum, iar modelul lui de date presupune lățime de
bandă de internet: un client preia de la peeri metadatele comunității și conținutul postărilor și
schimbă mesaje pubsub, ceea ce se potrivește prost cu legături construite în jurul unor pachete de
500 de octeți și al unui debit măsurat în biți sau kilobiți pe secundă.

Calea realistă este mai îngustă: un client care funcționează printr-o rețea mesh locală și ajunge la
rețeaua Bitsocial mai largă printr-un peer sau un gateway cu acces la internet. Cât timp acel
gateway este accesibil în timp real, acesta ar fi un client nou și o punte, nu o modificare a
protocolului.

Postarea cât timp rețeaua mesh este izolată de internet este mai dificilă. Un nod de comunitate
respinge publicațiile și mesajele de provocare al căror marcaj temporal diferă cu mai mult de 5
minute față de propriul său ceas, așa că o postare păstrată pentru livrare ulterioară ar fi refuzată
la sosire. Postarea offline ar funcționa doar pentru comunitățile al căror nod rulează chiar în
rețeaua mesh; pentru a ajunge la comunitățile de pe internet ar fi nevoie de o modificare a
protocolului, de exemplu ca o comunitate să poată alege să accepte publicații întârziate. Nimic din
toate acestea nu se află pe foaia de parcurs actuală.

## Pentru dezvoltatori

Reticulum este publicat sub
[Licența Reticulum](https://reticulum.network/manual/license.html): termeni în stil MIT, plus două
restricții. Software-ul nu poate fi folosit în sisteme concepute pentru a face rău oamenilor și nici
la crearea de seturi de date pentru antrenarea modelelor AI sau de machine learning. Citiți-o înainte
de a include cod Reticulum într-o aplicație Bitsocial.

Implementarea de referință este [scrisă în Python](https://github.com/markqvist/Reticulum).
Întreținătorii Reticulum avertizează că mai multe portări neoficiale pentru Reticulum și LXMF sunt
generate automat și conțin declarații de licență pe care ei le consideră nule, așa că preferați
implementarea de referință sau programele enumerate în manual.
