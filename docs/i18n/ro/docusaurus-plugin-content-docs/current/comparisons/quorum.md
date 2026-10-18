---
title: Bitsocial și Quorum
description: Cum se compară Quorum, aplicația de mesagerie de grup criptată end-to-end a Quilibrium, cu Space-uri în stilul Discord, cu comunitățile peer-to-peer publice ale Bitsocial.
---

# Bitsocial și Quorum

[Quorum](https://www.quorummessenger.com/) este o aplicație de mesagerie de grup construită de
Quilibrium Inc. pe propria sa rețea, [Quilibrium](https://quilibrium.com/). Quorum este organizat ca
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
  dispozitiv primește propriile chei X448 și Ed448. În browser, cheile sunt protejate de o cheie de
  acces (passkey). Adresele sunt hashuri care încep cu `Qm`, iar utilizatorii pot afișa un nume de
  utilizator din serviciul de nume al Quilibrium.
- **Criptare.** Mesajele directe folosesc Double Ratchet între dispozitive. Un Space împarte o
  singură sesiune Triple Ratchet între membrii săi, care își semnează mesajele cu chei specifice
  Space-ului. Fiecare Space este criptat, iar Quorum spune că modul său de intermediere a mesajelor
  împiedică serviciul care retransmite mesajele să lege expeditorii de destinatari.
- **Aderare.** În Space-uri se intră prin linkuri de invitație. Un link de unică folosință conține
  în URL cheile necesare pentru aderare; un link public le preia din serviciul Quorum, iar
  Space-urile publice pot fi listate într-un director în care se poate căuta.
- **Transport.** Clienții web, desktop și mobil se conectează toți prin HTTPS și un WebSocket la un
  singur serviciu,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Acesta retransmite mesajele criptate în inboxul fiecărui membru și stochează înregistrările
  utilizatorilor, manifestul criptat al fiecărui Space (canale, roluri, emoji), materialele de
  invitație, directorul public și sincronizarea opțională, criptată, a setărilor. Software-ul de nod
  al Quilibrium are un serviciu de inbox și hub cu aceeași formă, dar nici clienții, nici
  documentația Quilibrium nu spun cum corespunde acest serviciu rețelei.
- **Istoric.** Clientul fiecărui membru își păstrează propria copie a Space-ului în stocarea locală.
  Clientul web și desktop completează istoricul cerându-i unui membru online să sincronizeze;
  clientul mobil redă un jurnal pe care serviciul îl păstrează pentru fiecare Space, așa că poate
  recupera din urmă chiar și când niciun alt membru nu este online.
- **Moderare.** Rolurile acordă drepturi de ștergere, fixare, amuțire și mențiuni `@everyone`.
  Clientul fiecărui membru verifică semnătura fiecărei acțiuni de moderare și o aplică doar dacă
  semnatarul are rolul potrivit. Proprietarul poate da afară un membru, ceea ce rotește cheile
  Space-ului, astfel încât membrul eliminat să nu poată citi mesajele noi. Un Space poate cere
  mesaje semnate sau le poate permite membrilor să posteze mesaje nesemnate, care pot fi negate
  (deniable).
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

Un Space Quorum nu are un nod gazdă. Membrii trimit mesaje prin serviciul Quorum, clientul fiecărui
membru păstrează o copie, iar proprietarul nu trebuie să fie online pentru ca ceilalți să poată
vorbi. O comunitate Bitsocial se află pe nodul proprietarului ei, care acceptă sau respinge fiecare
postare și publică cea mai recentă stare a comunității. Comunitatea rămâne lizibilă cât timp peerii
o seedează, dar nu poate accepta postări noi cât timp nodul ei este offline. Consultați
[Protocolul peer-to-peer](/peer-to-peer-protocol/).

### Cine aplică regulile

În Quorum, regulile se aplică la margine. Clientul fiecărui membru decide, pe baza rolului
semnatarului, dacă aplică o ștergere, o fixare sau o amuțire, iar eliminarea unui membru
funcționează prin mutarea tuturor celorlalți pe chei noi. În Bitsocial, regulile se aplică la nodul
comunității: o postare care nu trece de provocarea sau de regulile comunității nu devine niciodată
parte din comunitate. Consultați [Moderare locală, nu interdicții globale](/local-moderation/).

### Controlul spamului

Quorum ține spamul afară în principal prin invitații. Un link de unică folosință admite o singură
persoană, un link public admite pe oricine îl deține, iar proprietarul poate elimina membri și
schimba cheile ulterior; clientul își limitează și propria rată de trimitere. Identitățile Bitsocial
sunt perechi de chei gratuite, așa că fiecare comunitate alege o provocare pe care o rulează înainte
de a accepta o postare, cum ar fi un captcha, o plată, un sold de tokenuri sau o listă de
permisiuni. Consultați [Provocări personalizate anti-spam](/custom-challenges/).

### Clientul și rețeaua

O aplicație Quorum este un client al serviciului Quorum, pe care îl operează Quilibrium Inc.
Aplicațiile nu se alătură ele însele unei rețele peer-to-peer, așa că accesul la un Space depinde de
acel unic endpoint. În spatele lui, Quilibrium este o rețea de sine stătătoare: în octombrie 2026,
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
cu forward secrecy, iar conținutul mesajelor ajunge la serviciul Quorum doar ca text cifrat.
Bitsocial se concentrează pe comunități publice și nu are încă mesaje directe native. O postare
Bitsocial este criptată pentru cheia nodului comunității cât timp circulă prin pubsub, dar odată
acceptată devine publică.

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
[rutarea prin mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), dar în
nodul 2.1.0.25 serviciul mixnet este un
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
care acceptă mesajele fără să le amestece.

## Comparație

| Întrebare                    | Quorum                                                                                         | Bitsocial                                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Categorie                    | Aplicație de mesagerie de grup criptată end-to-end, în rețeaua Quilibrium                      | Rețea de comunități peer-to-peer                                                                             |
| Identitate                   | Set principal de chei Ed448 plus chei pentru fiecare dispozitiv, protejate de o cheie de acces | Perechi de chei Ed25519 pentru utilizatori și comunități                                                     |
| Cine poate citi              | Membrii care dețin cheile unui Space                                                           | Oricine, din orice aplicație                                                                                 |
| Unde se află mesajele        | Dispozitivul fiecărui membru; clientul mobil redă și un jurnal păstrat de serviciul Quorum     | Nodul proprietarului comunității și peerii care o citesc și o seedează                                       |
| La ce se conectează clienții | Serviciul Quorum de la `api.quorummessenger.com`                                               | Peeri prin libp2p, inclusiv dintr-o filă de browser                                                          |
| Comunități                   | Space-uri cu canale, roluri și linkuri de invitație                                            | Obiecte de prim rang, al căror nod acceptă sau respinge postări                                              |
| Controlul spamului           | Linkuri de invitație, eliminări cu schimbarea cheilor, limitarea ratei în client               | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                                        |
| Moderare                     | Roluri aplicate de clientul fiecărui membru; proprietarul elimină membri                       | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează                           |
| Mesaje private               | Mesaje directe criptate end-to-end                                                             | Comunități publice; încă fără mesaje directe native                                                          |
| Economie                     | Tokenul de rețea QUIL; abonament opțional Apex de $5 pe lună                                   | Nimic în protocol; o provocare poate cere o plată sau un token                                               |
| Compromisul principal        | Grupuri private, criptate, dar fiecare client depinde de un singur serviciu                    | Identități gratuite și acces din browser, dar fără mesaje private și se păstrează doar cea mai recentă stare |
