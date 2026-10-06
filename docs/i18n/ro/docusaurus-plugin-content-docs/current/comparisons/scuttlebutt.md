---
title: Bitsocial și Secure Scuttlebutt
description: Cum se compară cu Bitsocial Secure Scuttlebutt (SSB) și aplicația sa Manyverse, de la feed-uri append-only și replicarea după graful de urmăriri până la comunități, controlul spamului și sincronizarea offline.
---

# Bitsocial și Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) este un protocol social peer-to-peer creat de
Dominic Tarr în 2014. [Manyverse](https://www.manyver.se/) este cea mai cunoscută aplicație a sa,
pentru Android, iOS și desktop; [Patchwork](https://github.com/ssbc/patchwork) a fost principalul
client desktop până când a fost arhivat. Dintre sistemele comparate în această documentație, SSB
este cel mai apropiat de Bitsocial ca spirit: niciun server pe calea datelor, niciun blockchain,
nicio ordine globală și chei Ed25519 pentru identitate. Cele două au făcut alegeri opuse în privința
a ceea ce stochează fiecare peer și a locului în care este oprit spamul.

## Cum funcționează Scuttlebutt

- **Feed-uri.** Fiecare identitate este o pereche de chei Ed25519, scrisă ca
  `@<public key>.ed25519`. Tot ce publică un utilizator ajunge în propriul feed, un jurnal
  append-only (la care se poate doar adăuga), în care fiecare mesaj semnat conține un număr de
  secvență și hash-ul mesajului anterior. Odată postat, un mesaj nu mai poate fi modificat, potrivit
  [ghidului protocolului](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replicare.** Peerii copiază feed-uri întregi, nu postări individuale, iar graful de urmăriri
  decide ce feed-uri păstrează un peer. Patchwork, de exemplu, afișa feed-urile aflate la cel mult
  două salturi distanță și replica feed-urile aflate la cel mult trei salturi. Cu arborii de
  difuzare epidemică (EBT), peerii compară cel mai recent număr de secvență pe care îl au pentru
  fiecare feed și trimit doar ce lipsește.
- **Conexiuni.** Peerii se autentifică printr-un secret handshake și criptează traficul cu box
  stream. Handshake-ul este legat de un identificator de rețea, așa că peerii dintr-o rețea SSB
  separată, cu un alt identificator, nu se pot conecta la rețeaua principală.
- **Găsirea peerilor.** Peerii se anunță în rețeaua locală prin broadcast UDP și se sincronizează
  prin LAN; Manyverse se sincronizează și prin Bluetooth. Pe internet, utilizatorii se bazează pe
  noduri de tip **pub**, peeri mereu online care te urmăresc înapoi după ce folosești un cod de
  invitație și apoi îți stochează și îți servesc feed-ul, și pe noduri de tip **room**, care nu
  stochează feed-uri, dar creează tuneluri pentru conexiunile dintre membrii lor.
- **Bloburi și mesaje private.** Imaginile și alte fișiere sunt bloburi adresate prin conținut,
  preluate de la peeri, cu o limită implicită de dimensiune de 5 MB în implementările actuale.
  Mesajele private sunt criptate pentru cel mult șapte destinatari și publicate ca text cifrat în
  feed-ul autorului.

## Unde diferă

### Ce stochează un peer

Un peer SSB păstrează o copie completă a fiecărui feed din aria sa de replicare, de la primul mesaj
al fiecărui feed, și servește aceste feed-uri altora. Asta îi permite lui SSB să funcționeze
offline, dar spațiul de stocare crește cu fiecare mesaj din această arie, iar o instalare nouă
trebuie să descarce aceste feed-uri înainte să afișeze mare lucru. Un client Bitsocial preia cea mai
recentă stare a comunităților pe care le deschide de la nodul comunității și de la peerii care o
seedează, iar rețeaua păstrează doar această stare cea mai recentă. Consultați
[Protocolul peer-to-peer](/peer-to-peer-protocol/).

### Ștergere și dispozitive

Deoarece un feed este un lanț de hash-uri, SSB nu are ștergere la nivelul întregii rețele: un peer
poate elimina mesaje din propria bază de date, dar nu le poate retrage din copiile altor peeri.
Postarea cu aceeași cheie de pe două dispozitive sau dintr-o copie de rezervă restaurată bifurcă
feed-ul (un fork), așa că soluția obișnuită este o identitate per dispozitiv. PZP, protocolul
succesor creat de echipa Manyverse, enumeră ștergerea, mai multe dispozitive per cont și feed-urile
tolerante la bifurcări printre principalele schimbări față de SSB
([articolul de lansare](https://www.manyver.se/blog/2024-07-03/)). Un nod de comunitate Bitsocial
publică o nouă versiune a stării comunității la fiecare actualizare, așa că un conținut eliminat de
moderatorii ei dispare din cea mai recentă stare.

### Pe cine poți auzi

Aria de replicare a SSB servește și drept filtru de spam. Feed-ul unui străin ajunge la tine doar
dacă cineva aflat în salturile tale îl urmărește, iar blocarea unui feed face ca nodul tău să nu-l
mai replice. Spamul rămâne afară, dar la fel și nou-veniții, până când cineva îi urmărește.
Bitsocial permite oricui să publice într-o comunitate, iar nodul comunității decide prin provocarea
sa dacă o postare este acceptată. Consultați
[Provocări personalizate anti-spam](/custom-challenges/).

### Comunități

SSB nu are un obiect de comunitate. Canalele și hashtagurile sunt etichete pe postări individuale,
răspunsurile dintr-un fir de discuție se află în feed-urile celor care le-au scris, iar cât de mult
vezi dintr-un fir depinde de care dintre aceste feed-uri le are nodul tău. Nodurile de tip room pot
avea moderatori și liste de membri, dar aceștia controlează cine se poate conecta prin nodul
respectiv, nu ce se publică. O comunitate Bitsocial este un obiect de prim rang, cu propria pereche
de chei, reguli, moderatori și provocare.

### Infrastructură

Amândouă țin serverele în afara căii datelor și amândouă se sprijină pe ajutoare. Nodurile de tip
pub sunt cel mai apropiat lucru pe care SSB îl are de un serviciu găzduit: stochează și servesc
feed-urile tuturor celor pe care îi urmăresc. Nodurile de tip room sunt mai apropiate de routerele
HTTP ale Bitsocial, pentru că niciunele nu stochează conținut, dar un nod de tip room retransmite
conexiunea dintre membrii săi, în timp ce un router doar returnează adresele furnizorilor și nu
joacă niciun rol în transfer. La fel ca un peer SSB, un nod de comunitate Bitsocial rulează pe
hardware de consum și trebuie să fie online pentru a accepta postări noi.

### Offline și rețele locale

Aici SSB este mai puternic. Doi peeri SSB din aceeași rețea Wi-Fi sau conectați prin Bluetooth în
Manyverse se pot sincroniza fără conexiune la internet, iar tot ce a fost deja replicat rămâne
lizibil offline. Obiectivul principal declarat al Manyverse este să facă rețelele sociale
independente de conectivitatea la internet. Bitsocial are nevoie de o conexiune la internet pentru a
găsi peeri și pentru a publica.

### Browser

Principalele aplicații SSB vin cu un nod SSB complet: Manyverse include unul în aplicațiile sale
mobile și desktop. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) rula SSB într-un
browser, cu replicare parțială și conexiuni prin noduri de tip room, și a fost arhivat în 2022.
Aplicațiile Bitsocial rulează un nod peer-to-peer într-o filă obișnuită de browser. Consultați
[Peer-to-peer în browser](/browser-p2p/).

### Mesaje private

SSB are mesaje private criptate integrate. Bitsocial se concentrează pe comunități publice și nu are
încă mesaje directe native.

## Starea proiectului

André Staltz, care a creat Manyverse, s-a retras în aprilie 2024 din SSB, din Manyverse și din
succesorul planificat al acestora
([ultima sa actualizare](https://www.manyver.se/blog/2024-04-05/)). În iulie 2024, Jacob Karlsson a
lansat acel succesor sub numele [PZP](https://pzp.wiki/) și a scris că nu va mai lucra la Manyverse
și că nu știe pe nimeni altcineva care să plănuiască asta. În octombrie 2026, depozitele PZP de pe
[Codeberg](https://codeberg.org/pzp) nu mai primiseră actualizări după decembrie 2024. Depozitul
Patchwork este arhivat, cu v3.18.1 ca ultimă versiune, iar echipa din spatele Planetary, o aplicație
SSB pentru iOS, a trecut în 2023 la Nostr cu aplicația sa Nos. Rețeaua SSB încă funcționează pe
peerii și nodurile de tip pub pe care oamenii le țin online, dar principalele sale aplicații nu mai
sunt dezvoltate.

## Comparație

| Întrebare              | Secure Scuttlebutt                                                                                             | Bitsocial                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Categorie              | Protocol gossip peer-to-peer                                                                                   | Rețea de comunități peer-to-peer                                                                           |
| Identitate             | O pereche de chei Ed25519 per dispozitiv                                                                       | Perechi de chei Ed25519 pentru utilizatori și comunități                                                   |
| Unde se află postările | Feed-ul append-only al autorului, copiat de fiecare peer care îl replică                                       | Nodul proprietarului comunității și peerii care o citesc și o seedează                                     |
| Ce păstrează un peer   | Istoricul complet al fiecărui feed din aria sa de urmăriri                                                     | Cea mai recentă stare a comunităților pe care le citește sau le seedează                                   |
| Comunități             | Niciun obiect de comunitate; canalele și hashtagurile etichetează postările                                    | Obiecte de prim rang, al căror nod acceptă sau respinge postări                                            |
| Controlul spamului     | Aria de replicare dată de graful de urmăriri, plus blocări                                                     | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                                      |
| Moderare               | Urmăririle și blocările fiecărui utilizator                                                                    | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează                         |
| Servere ajutătoare     | Nodurile de tip pub stochează și servesc feed-uri; nodurile de tip room creează tuneluri pentru conexiuni      | Routerele HTTP returnează peerii furnizori și nu stochează conținut                                        |
| Offline                | Sincronizare prin LAN și Bluetooth, fără internet                                                              | Are nevoie de o conexiune la internet                                                                      |
| Browser                | Aplicațiile includ un nod SSB complet                                                                          | Nod peer-to-peer într-o filă obișnuită de browser                                                          |
| Rețea                  | Funcționează, dar principalele aplicații nu mai sunt dezvoltate                                                | Rețea activă, cu aplicații precum [5chan](/apps/5chan/) și [Seedit](/apps/seedit/)                         |
| Compromisul principal  | Funcționează offline și nu necesită găzduire, dar feed-urile cresc la nesfârșit, iar străinii rămân invizibili | Publicare deschisă și suport pentru browser, dar necesită internet și păstrează doar cea mai recentă stare |
