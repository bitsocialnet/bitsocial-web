---
title: Bitsocial ja Secure Scuttlebutt
description: Miten Secure Scuttlebutt (SSB) ja sen Manyverse-sovellus vertautuvat Bitsocialiin vain lisättävistä syötteistä ja seurantagraafiin perustuvasta replikoinnista yhteisöihin, roskapostin torjuntaan ja offline-synkronointiin.
---

# Bitsocial ja Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) on Dominic Tarrin vuonna 2014 luoma sosiaalinen
vertaisverkkoprotokolla. [Manyverse](https://www.manyver.se/) on sen tunnetuin sovellus, ja se on
saatavilla Androidille, iOS:lle ja työpöydälle; [Patchwork](https://github.com/ssbc/patchwork) oli
tärkein työpöytäasiakas ennen kuin se arkistoitiin. Näissä ohjeissa vertailluista järjestelmistä SSB
on hengeltään lähimpänä Bitsocialia: datapolulla ei ole palvelimia, ei lohkoketjua eikä globaalia
järjestystä, ja identiteetti perustuu Ed25519-avaimiin. Ne tekivät päinvastaiset valinnat siinä,
mitä kukin vertainen tallentaa ja missä roskaposti pysäytetään.

## Miten Scuttlebutt toimii

- **Syötteet.** Jokainen identiteetti on Ed25519-avainpari, joka kirjoitetaan muodossa
  `@<public key>.ed25519`. Kaikki, mitä käyttäjä julkaisee, menee hänen omaan syötteeseensä: vain
  lisättävään lokiin, jossa jokainen allekirjoitettu viesti sisältää järjestysnumeron ja edellisen
  viestin tiivisteen. [Protokollaoppaan](https://ssbc.github.io/scuttlebutt-protocol-guide/) mukaan
  julkaistua viestiä ei voi enää muuttaa.
- **Replikointi.** Vertaiset kopioivat kokonaisia syötteitä eivätkä yksittäisiä julkaisuja, ja
  seurantagraafi ratkaisee, mitkä syötteet vertainen säilyttää. Esimerkiksi Patchwork näytti
  syötteet kahden hypyn päähän asti ja replikoi syötteet kolmen hypyn päähän asti. Epideemisten
  lähetyspuiden (epidemic broadcast trees, EBT) avulla vertaiset vertaavat kunkin syötteen uusinta
  järjestysnumeroa, joka niillä on, ja lähettävät vain sen, mitä puuttuu.
- **Yhteydet.** Vertaiset tunnistautuvat secret handshake -kättelyllä ja salaavat liikenteen
  box stream -protokollalla. Kättely käyttää avaimenaan verkon tunnistetta, joten erillisen
  SSB-verkon vertaiset, joilla on eri tunniste, eivät voi yhdistää pääverkkoon.
- **Vertaisten löytäminen.** Vertaiset ilmoittavat itsestään paikallisessa verkossa
  UDP-yleislähetyksillä ja synkronoivat LAN-verkon yli; Manyverse synkronoi myös Bluetoothin kautta.
  Internetin yli käyttäjät turvautuvat **pub**-solmuihin eli aina verkossa oleviin vertaisiin, jotka
  seuraavat sinua takaisin, kun olet lunastanut kutsukoodin, ja sen jälkeen tallentavat ja
  tarjoilevat syötettäsi, sekä **room**-solmuihin, jotka eivät tallenna syötteitä vaan tunneloivat
  yhteyksiä jäsentensä välillä.
- **Blobit ja yksityisviestit.** Kuvat ja muut tiedostot ovat sisältöosoitettuja blobeja, jotka
  haetaan vertaisilta, ja nykyisissä toteutuksissa niiden oletuskokoraja on 5 MB. Yksityisviestit
  salataan enintään seitsemälle vastaanottajalle ja julkaistaan salatekstinä kirjoittajan
  syötteessä.

## Missä ne eroavat

### Mitä vertainen tallentaa

SSB-vertainen säilyttää täyden kopion jokaisesta replikointialueensa syötteestä kunkin syötteen
ensimmäisestä viestistä alkaen ja tarjoilee näitä syötteitä muille. Juuri tämä mahdollistaa SSB:n
toiminnan ilman verkkoyhteyttä, mutta tallennustilan tarve kasvaa jokaisen alueella olevan viestin
myötä, ja uuden asennuksen on ladattava nuo syötteet ennen kuin se näyttää juuri mitään.
Bitsocial-asiakas hakee avaamiensa yhteisöjen uusimman tilan yhteisön solmulta ja vertaisilta, jotka
jakavat sitä, ja verkko säilyttää vain tämän uusimman tilan. Katso
[Vertaisverkkoprotokolla](/peer-to-peer-protocol/).

### Poistaminen ja laitteet

Koska syöte on tiivisteketju, SSB:ssä ei ole koko verkon kattavaa poistamista: vertainen voi
pudottaa viestejä omasta tietokannastaan, mutta se ei voi vetää niitä takaisin muiden vertaisten
kopioista. Julkaiseminen samalla avaimella kahdelta laitteelta tai palautetusta varmuuskopiosta
haarauttaa syötteen, joten tavallinen ratkaisu on yksi identiteetti laitetta kohden. PZP,
Manyverse-tiimin seuraajaprotokolla, mainitsee poistamisen, useat laitteet tiliä kohden ja
haarautumista sietävät syötteet tärkeimpien SSB:hen tehtyjen muutostensa joukossa
([julkistuskirjoitus](https://www.manyver.se/blog/2024-07-03/)). Bitsocialin yhteisösolmu julkaisee
yhteisön tilasta uuden version jokaisen päivityksen yhteydessä, joten sisältö, jonka yhteisön
moderaattorit poistavat, putoaa pois uusimmasta tilasta.

### Keneltä kuulet

SSB:n replikointialue toimii samalla sen roskapostisuodattimena. Tuntemattoman syöte tavoittaa sinut
vain, jos joku hyppyalueellasi seuraa häntä, ja syötteen estäminen lopettaa sen replikoinnin
solmullesi. Roskaposti pysyy poissa, mutta niin pysyvät myös uudet tulokkaat, kunnes joku seuraa
heitä. Bitsocial antaa kenen tahansa julkaista yhteisöön, ja yhteisön solmu ratkaisee haasteensa
avulla, hyväksytäänkö julkaisu. Katso
[Mukautetut roskapostin torjuntahaasteet](/custom-challenges/).

### Yhteisöt

SSB:ssä ei ole yhteisöobjektia. Kanavat ja aihetunnisteet ovat yksittäisiin julkaisuihin liitettyjä
merkintöjä, ketjun vastaukset ovat niiden kirjoittajien syötteissä, ja se, kuinka paljon ketjusta
näet, riippuu siitä, mitkä näistä syötteistä solmullasi on. Room-solmuilla voi olla moderaattoreita
ja jäsenlistoja, mutta ne määräävät, kuka saa yhdistää room-solmun kautta, eivät sitä, mitä
julkaistaan. Bitsocial-yhteisö on ensiluokkainen objekti, jolla on oma avainpari, säännöt,
moderaattorit ja haaste.

### Infrastruktuuri

Kumpikin pitää palvelimet poissa datapolulta, ja kumpikin nojaa apureihin. Pub-solmut ovat lähinnä
isännöityä palvelua, mitä SSB:llä on: ne tallentavat ja tarjoilevat kaikkien seuraamiensa käyttäjien
syötteet. Room-solmut ovat lähempänä Bitsocialin HTTP-reitittimiä, koska kumpikaan ei tallenna
sisältöä, mutta room-solmu välittää yhteyden jäsentensä välillä, kun taas reititin vain palauttaa
tarjoajien osoitteet eikä osallistu siirtoon. SSB-vertaisen tavoin Bitsocialin yhteisösolmu toimii
kuluttajalaitteistolla, ja sen on oltava verkossa voidakseen hyväksyä uusia julkaisuja.

### Offline-käyttö ja paikalliset verkot

Tässä SSB on vahvempi. Kaksi SSB-vertaista samassa Wi-Fi-verkossa, tai Manyversessa Bluetoothin
kautta, voi synkronoida ilman internetyhteyttä, ja kaikki jo replikoitu pysyy luettavana ilman
verkkoyhteyttä. Manyversen ilmoitettu ensisijainen tavoite on tehdä sosiaalisesta verkostoitumisesta
riippumatonta internetyhteydestä. Bitsocial tarvitsee internetyhteyden vertaisten löytämiseen ja
julkaisemiseen.

### Selain

Tärkeimmät SSB-sovellukset sisältävät täyden SSB-solmun: Manyverse paketoi sellaisen mobiili- ja
työpöytäsovelluksiinsa. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) ajoi SSB:tä
selaimessa osittaisella replikoinnilla ja room-solmujen kautta kulkevilla yhteyksillä, ja se
arkistoitiin vuonna 2022. Bitsocial-sovellukset ajavat vertaisverkkosolmua tavallisessa
selainvälilehdessä. Katso [Selaimen peer-to-peer](/browser-p2p/).

### Yksityisviestit

SSB:ssä on sisäänrakennetut salatut yksityisviestit. Bitsocial keskittyy julkisiin yhteisöihin, eikä
siinä ole vielä natiiveja yksityisviestejä.

## Projektin tila

Manyversen rakentanut André Staltz vetäytyi SSB:stä, Manyversesta ja niiden suunnitellusta
seuraajasta huhtikuussa 2024
([hänen viimeinen päivityksensä](https://www.manyver.se/blog/2024-04-05/)). Heinäkuussa 2024 Jacob
Karlsson julkaisi tämän seuraajan nimellä [PZP](https://pzp.wiki/) ja kirjoitti, ettei hän tekisi
enää työtä Manyversen parissa eikä tiennyt kenenkään muun aikovan tehdä niin. Lokakuussa 2026 PZP:n
repositorioihin [Codeberg](https://codeberg.org/pzp)-palvelussa ei ollut tullut päivityksiä
joulukuun 2024 jälkeen. Patchworkin repositorio on arkistoitu, ja sen viimeinen julkaisu on v3.18.1.
Planetaryn, iOS:lle tehdyn SSB-sovelluksen, takana ollut tiimi siirtyi vuonna 2023 Nostriin
Nos-sovelluksellaan. SSB-verkko toimii yhä niiden vertaisten ja pub-solmujen varassa, joita ihmiset
pitävät verkossa, mutta sen tärkeimpiä sovelluksia ei enää kehitetä.

## Vertailu

| Kysymys                  | Secure Scuttlebutt                                                                                                                 | Bitsocial                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Kategoria                | Vertaisverkkopohjainen gossip-protokolla                                                                                           | Vertaisverkkopohjainen yhteisöverkko                                                                  |
| Identiteetti             | Yksi Ed25519-avainpari laitetta kohden                                                                                             | Ed25519-avainparit käyttäjille ja yhteisöille                                                         |
| Missä julkaisut ovat     | Kirjoittajan vain lisättävässä syötteessä, jonka jokainen sitä replikoiva vertainen kopioi                                         | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä                           |
| Mitä vertainen säilyttää | Jokaisen seurantapiirinsä syötteen koko historian                                                                                  | Lukemiensa tai jakamiensa yhteisöjen uusimman tilan                                                   |
| Yhteisöt                 | Ei yhteisöobjektia; kanavat ja aihetunnisteet merkitsevät julkaisuja                                                               | Ensiluokkaiset objektit, joiden solmu hyväksyy tai hylkää julkaisut                                   |
| Roskapostin torjunta     | Seurantagraafiin perustuva replikointialue ja estot                                                                                | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                                |
| Moderointi               | Kunkin käyttäjän seuraamiset ja estot                                                                                              | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät                 |
| Apupalvelimet            | Pub-solmut tallentavat ja tarjoilevat syötteitä; room-solmut tunneloivat yhteyksiä                                                 | HTTP-reitittimet palauttavat tarjoajavertaiset eivätkä tallenna sisältöä                              |
| Offline-käyttö           | LAN- ja Bluetooth-synkronointi ilman internetiä                                                                                    | Tarvitsee internetyhteyden                                                                            |
| Selain                   | Sovellukset sisältävät täyden SSB-solmun                                                                                           | Vertaisverkkosolmu tavallisessa selainvälilehdessä                                                    |
| Verkko                   | Toiminnassa, mutta sen tärkeimpiä sovelluksia ei enää kehitetä                                                                     | Toiminnassa oleva verkko, jossa on sovelluksia kuten [5chan](/apps/5chan/) ja [Seedit](/apps/seedit/) |
| Tärkein kompromissi      | Toimii ilman verkkoyhteyttä eikä tarvitse isännöintiä, mutta syötteet kasvavat loputtomasti ja tuntemattomat pysyvät näkymättöminä | Avoin julkaiseminen ja selaintuki, mutta tarvitsee internetin ja säilyttää vain uusimman tilan        |
