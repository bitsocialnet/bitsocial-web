---
title: Bitsocial și Quorum
description: Cum se compară Quorum, aplicația de mesagerie de grup criptată end-to-end a Quilibrium, cu Space-uri în stilul Discord, cu comunitățile peer-to-peer publice ale Bitsocial.
---

# Bitsocial și Quorum

[Quorum](https://www.quorummessenger.com/) este o aplicație de mesagerie de grup de la Quilibrium
Inc., compania din spatele rețelei [Quilibrium](https://quilibrium.com/). Quorum este organizat ca
Discord, cu Space-uri, canale, roluri și mesaje directe, iar mesajele sale sunt criptate end-to-end.
Este pomenit alături de Bitsocial pentru că ambele proiecte se descriu ca peer-to-peer și rezistente
la cenzură, cu grupuri care își stabilesc propriile reguli. Țintesc însă lucruri diferite: Quorum,
chatul privat de grup; Bitsocial, comunitățile publice pe care le poate citi oricine.

Quilibrium se descrie ca o alternativă descentralizată la platformele cloud: o rețea de noduri care
păstrează datele într-un hipergraf criptat și cad de acord asupra stării acestuia printr-un consens
pe care îl numește Proof of Meaningful Work. Nodurile câștigă QUIL, tokenul rețelei, cu care se
plătesc taxele de utilizare. Quorum a pornit în 2018 ca Howler, ideea unei alternative private la
Discord, și a devenit prima aplicație lansată pe Quilibrium, potrivit
[poveștii Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc., fondată
de Cassie Heart, dezvoltă protocolul și oferă Quorum ca unul dintre serviciile sale administrate
([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Cum funcționează Quorum

Detaliile de mai jos provin din codul sursă al clienților Quorum,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) pentru aplicațiile web și
desktop și [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), în forma lor din
octombrie 2026.

- **Identități.** Identitatea principală a unui utilizator este un set de chei Ed448, iar fiecare
  dispozitiv primește propriile chei X448 și Ed448. În browser, cheile sunt protejate de obicei de o
  cheie de acces (passkey); aplicația mobilă le derivă dintr-o frază de recuperare. Adresele sunt
  hashuri care încep cu `Qm`, iar utilizatorii pot afișa un nume de utilizator din serviciul de nume
  al Quilibrium.
- **Criptare.** Mesajele directe folosesc Double Ratchet între dispozitive. Un Space împarte o
  singură sesiune Triple Ratchet între membrii săi, care își semnează mesajele cu chei specifice
  Space-ului. Fiecare Space este criptat. Quorum spune că modul său de intermediere a mesajelor
  împiedică legarea expeditorilor de destinatari, dar clientul web și desktop se abonează la toate
  inboxurile unui dispozitiv, inclusiv la cel listat în înregistrarea publică a utilizatorului,
  printr-o
  [singură cerere](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/components/context/MessageDB.tsx#L616-L623)
  către serviciu, care le poate astfel lega de adresa utilizatorului.
- **Aderare.** În Space-uri se intră prin linkuri de invitație. Un link de unică folosință conține
  în URL cheile necesare pentru aderare; un link public le preia din serviciul Quorum, iar
  Space-urile publice pot fi listate într-un director în care se poate căuta.
- **Transport.** Pentru mesagerie, clienții web, desktop și mobil se conectează toți prin HTTPS și
  un WebSocket la un singur serviciu,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Acesta retransmite mesajele criptate în inboxul fiecărui membru și le păstrează până când clientul
  confirmă primirea lor. De asemenea, stochează înregistrările utilizatorilor, profilurile publice
  opționale (opt-in), manifestul criptat al fiecărui Space (canale, roluri, emoji), materialele de
  invitație, directorul public și sincronizarea opțională, criptată, a setărilor. Software-ul de nod
  al Quilibrium are un serviciu de inbox și hub cu aceeași formă, dar nici clienții, nici
  documentația Quilibrium nu spun cum corespunde acest serviciu rețelei.
- **Istoric.** Clientul fiecărui membru își păstrează propria copie a Space-ului în stocarea locală,
  iar ambii clienți preiau din inboxurile lor de pe serviciu mesajele trimise cât timp au fost
  offline. Pentru istoricul mai vechi, clientul web și desktop îi cere unui membru online să
  sincronizeze, în timp ce clientul mobil redă un jurnal durabil pe care serviciul îl păstrează
  pentru fiecare Space.
- **Moderare.** Rolurile acordă drepturi de ștergere, fixare, amuțire și mențiuni `@everyone`.
  Clientul fiecărui membru verifică semnătura fiecărei acțiuni de moderare și o aplică doar dacă
  semnatarul are rolul potrivit. Proprietarul poate da afară un membru, ceea ce rotește cheile
  Space-ului, astfel încât membrul eliminat să nu poată citi mesajele noi. Un Space poate cere
  mesaje semnate sau le poate permite membrilor să posteze mesaje nesemnate, care pot fi negate
  (deniable). Intrările din directorul public au un status de verificare, iar utilizatorii pot
  raporta serviciului Quorum Space-uri și, din aplicația mobilă, mesaje individuale.
- **Cod.** Clientul web și desktop este licențiat sub AGPL-3.0, iar clientul mobil sub GPL-3.0.
  Clientul mobil are și un portofel crypto, integrare cu Farcaster și Apex, un abonament plătit
  descris mai jos.

## Unde diferă

### Grupuri private și comunități publice

Un Space Quorum este un grup de membri: îl pot citi doar cei care îi dețin cheile, iar aderarea
necesită un link de invitație. Un link public lasă pe oricine să intre, dar numai după aderare. O
comunitate Bitsocial nu are membri înscriși. Oricine o poate citi, din orice aplicație, fără să
adere, și oricine poate încerca să posteze, sub rezerva provocării comunității.

### Ce ține un grup online

Un Space Quorum nu are un nod gazdă. Membrii trimit mesaje prin serviciul Quorum, care păstrează o
copie pentru fiecare membru până când clientul acestuia o preia, iar proprietarul nu trebuie să fie
online pentru ca ceilalți să poată vorbi. O comunitate Bitsocial se află pe nodul proprietarului ei,
care acceptă sau respinge fiecare postare și publică cea mai recentă stare a comunității.
Comunitatea rămâne lizibilă cât timp peerii o seedează, dar nu poate accepta postări noi cât timp
nodul ei este offline. Consultați [Protocolul peer-to-peer](/peer-to-peer-protocol/).

### Cine aplică regulile

În Quorum, regulile se aplică la margine. Clientul fiecărui membru decide, pe baza rolului
semnatarului, dacă aplică o ștergere, o fixare sau o amuțire, iar eliminarea unui membru
funcționează prin mutarea tuturor celorlalți pe chei noi. Pe lângă aceasta, operatorul serviciului
primește rapoarte și verifică directorul public. În Bitsocial, regulile se aplică la nodul
comunității: o postare care nu trece de provocarea comunității nu este acceptată niciodată, iar
nodul aplică eliminările făcute de moderatorii săi. Consultați
[Moderare locală, nu interdicții globale](/local-moderation/).

### Controlul spamului

Quorum ține spamul afară în principal prin invitații. Un link de unică folosință admite o singură
persoană, un link public admite pe oricine îl deține, iar proprietarul poate elimina membri și
schimba cheile ulterior. Clienții limitează și cât de repede poate trimite un membru, iar clientul
web și desktop ignoră mesajele din Space-uri ale oricărui expeditor peste 10 în 10 secunde.
Identitățile Bitsocial sunt perechi de chei gratuite, așa că fiecare comunitate alege o provocare pe
care o rulează înainte de a accepta o postare, cum ar fi un captcha, o plată, un sold de tokenuri
sau o listă de permisiuni. Consultați [Provocări personalizate anti-spam](/custom-challenges/).

### Clientul și rețeaua

O aplicație Quorum este un client al serviciului Quorum, pe care îl operează Quilibrium Inc.
Aplicațiile nu se alătură ele însele unei rețele peer-to-peer, așa că accesul la un Space depinde de
acel unic endpoint. Separat, Quilibrium este o rețea de sine stătătoare: în octombrie 2026,
[explorerul](https://dashboard.quilibrium.com/) său arăta 114 peeri accesibili și 181 de proveri
(provers) repartizați pe 99 de sharduri.

O aplicație web Bitsocial poate rula un nod libp2p în filă, poate prelua conținutul comunităților de
la peeri și poate publica prin gossipsub. Descoperirea peerilor trece prin routere HTTP care
returnează doar adresele furnizorilor; oricine poate rula un astfel de router, iar clienții pot
schimba routerul modificându-și configurația. Consultați [Peer-to-peer în browser](/browser-p2p/).

### Economie

Quilibrium are un token în centrul său. QUIL este minat de noduri și plătește taxele rețelei, iar o
versiune împachetată (wrapped), wQUIL, circulă pe Ethereum. Quorum în sine este gratuit și nu
necesită plată sau număr de telefon. Abonamentul său opțional Apex costă
[$5 pe lună](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
care se plătesc în wQUIL, SNAP sau USDC pe Ethereum și se împart între Quilibrium Inc. și patru
Space-uri alese de abonat. Bitsocial nu are un strat de plată în protocol; o comunitate poate cere o
plată sau un token prin provocarea ei.

### Mesaje private

Aici Quorum este mai puternic. Mesajele directe și mesajele din Space-uri sunt criptate end-to-end
cu forward secrecy, iar conținutul mesajelor ajunge la serviciul Quorum doar ca text cifrat, cu
excepția cazului în care un membru raportează un mesaj din aplicația mobilă, care trimite conținutul
acestuia moderatorilor Quorum. Bitsocial se concentrează pe comunități publice și nu are încă mesaje
directe native. O postare Bitsocial este criptată pentru cheia nodului comunității cât timp circulă
prin pubsub, dar odată acceptată devine publică.

## Starea proiectului

În octombrie 2026, depozitul de cod Quorum numea aplicația web o versiune beta, iar site-ul Quorum
încă prezenta aplicațiile pentru Google Play și App Store ca urmând să apară în curând. Cei doi
clienți diferă și ei: aplicația mobilă are funcțiile de portofel, Farcaster și Apex, în timp ce
clientul web și desktop își afișează paginile Wallet și Farcaster ca urmând să apară în curând, iar
cei doi clienți recuperează istoricul Space-urilor în moduri diferite.

Mainnetul Quilibrium a ajuns la versiunea 2.1 pe 30 septembrie 2025, când rețeaua și-a reluat
funcționarea după o oprire ([anunț](https://x.com/QuilibriumInc/status/1973082817236984270)). În
2026, nodul a fost rescris în Rust, cu semnături post-cuantice pentru consens și un protocol de
comunicare pe care nodurile mai vechi nu îl pot vorbi. Unele părți ale documentației descriu
designul, nu codul care rulează efectiv: ele descriu
[rutarea prin mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/).
Nodurile chiar retransmit trafic între ele prin circuite cu rutare de tip onion, dar în nodul
2.1.0.25 serviciul mixnet este un
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
care acceptă mesajele fără să le amestece.

## Comparație

| Întrebare                    | Quorum                                                                                                                      | Bitsocial                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Categorie                    | Aplicație de mesagerie de grup criptată end-to-end, de la Quilibrium Inc.                                                   | Rețea de comunități peer-to-peer                                                                             |
| Identitate                   | Set principal de chei Ed448 plus chei pentru fiecare dispozitiv, protejate de o cheie de acces sau de o frază de recuperare | Perechi de chei Ed25519 pentru utilizatori și comunități                                                     |
| Cine poate citi              | Membrii care dețin cheile unui Space                                                                                        | Oricine, din orice aplicație                                                                                 |
| Unde se află mesajele        | Dispozitivul fiecărui membru; serviciul Quorum păstrează copiile nelivrate și un jurnal per Space pentru mobil              | Nodul proprietarului comunității și peerii care o citesc și o seedează                                       |
| La ce se conectează clienții | Serviciul Quorum de la `api.quorummessenger.com`                                                                            | Peeri prin libp2p, găsiți prin routere HTTP, inclusiv dintr-o filă de browser                                |
| Comunități                   | Space-uri cu canale, roluri și linkuri de invitație                                                                         | Obiecte de prim rang, al căror nod acceptă sau respinge postări                                              |
| Controlul spamului           | Linkuri de invitație, eliminări cu schimbarea cheilor, limitarea ratei în client                                            | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                                        |
| Moderare                     | Roluri aplicate de clientul fiecărui membru; proprietarul elimină membri; rapoartele ajung la operatorul serviciului        | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează                           |
| Mesaje private               | Mesaje directe criptate end-to-end                                                                                          | Comunități publice; încă fără mesaje directe native                                                          |
| Economie                     | Tokenul de rețea QUIL; abonament opțional Apex de $5 pe lună                                                                | Nimic în protocol; o provocare poate cere o plată sau un token                                               |
| Compromisul principal        | Grupuri private, criptate, dar fiecare client depinde de un singur serviciu                                                 | Identități gratuite și acces din browser, dar fără mesaje private și se păstrează doar cea mai recentă stare |
