---
title: Bitsocial ja Nostr
description: Miten Nostrin välityspalvelimiin perustuva malli vertautuu Bitsocialin vertaisverkkoyhteisöihin datapolusta ja identiteetistä ryhmiin, roskapostin torjuntaan ja moderointiin.
---

# Bitsocial ja Nostr

Nostr ei asetu siististi federoitujen eikä lohkoketjupohjaisten järjestelmien lokeroon. Instanssit
eivät myönnä käyttäjille tilejä, eikä ketjua, konsensusta, gasia tai globaalia järjestystä ole.
Nostria kuvaa paremmin **välityspalvelinpohjainen sosiaalinen media**: käyttäjillä on avainparit, he
allekirjoittavat tapahtumia ja julkaisevat ne välityspalvelimille eli tavallisille palvelimille,
jotka tallentavat ja tarjoilevat niitä
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Nostrin oma
[README](https://github.com/nostr-protocol/nostr) toteaa, ettei se nojaa vertaisverkkotekniikoihin.

Yhdessä tärkeässä suhteessa tämä asettaa Nostrin lähemmäs Bitsocialia kuin federoidut tai
lohkoketjupohjaiset järjestelmät: identiteetti on kryptografinen ja siirrettävä. Erot ovat
datakerroksessa ja siinä, kuka hallitsee pääsyä.

## Miten Nostr toimii

- **Tapahtumat ja välityspalvelimet.** Jokainen julkaisu, profiili tai reaktio on allekirjoitettu
  JSON-tapahtuma. Asiakkaat julkaisevat tapahtumia välityspalvelimille WebSocket-yhteyksien kautta
  ja tilaavat niitä suodattimilla; välityspalvelimet tallentavat tapahtumat ja tarjoilevat ne
  takaisin. Välityspalvelimet eivät viesti keskenään.
- **Replikointi.** Käyttäjät julkaisevat yleensä usealle välityspalvelimelle. Vuonna 2023 tehdyssä
  tutkimuksessa 712 välityspalvelimesta keskimääräinen julkaisu löytyi 34,6 välityspalvelimelta
  ([Wei ja Tyson](https://arxiv.org/abs/2402.05709)).
- **Jonkun julkaisujen löytäminen.** Käyttäjät julkaisevat listan välityspalvelimista, joille he
  kirjoittavat ja joilta he lukevat
  ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), ja asiakkaat hakevat
  käyttäjän julkaisut tämän kirjoitusvälityspalvelimilta.
- **Identiteetti.** Jokainen käyttäjä on secp256k1-avain, joka allekirjoittaa
  Schnorr-allekirjoituksilla. Spesifikaatioissa ei määritellä avainten vaihtoa eikä palautusta,
  joten kadonnut avain tarkoittaa kadonnutta tiliä. Valinnaiset `name@domain`-tunnisteet
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) tarkistetaan kyseisen
  verkkotunnuksen verkkopalvelimella olevaa tiedostoa vasten.
- **Ryhmät.** Suositeltu yhteisömekanismi on välityspalvelinpohjaiset ryhmät
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): välityspalvelin isännöi
  ryhmää, valvoo sen jäsenyys- ja julkaisusääntöjä ennen kuin hyväksyy julkaisun ja allekirjoittaa
  ryhmän metatiedot. Vanhemmat moderaattorien hyväksymät yhteisöt
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) on nyt merkitty
  ei-suositelluiksi NIP-29:n hyväksi.
- **Roskapostin torjunta.** Jokainen välityspalvelin valitsee oman porttinsa: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), tunnistautuminen ja
  sallittujen listat ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), maksu tai
  nopeusrajoitukset. Asiakkaat lisäävät mykistyslistoja ja luottamuspisteitä.
- **Media.** Kuvat ja videot ladataan erillisille HTTP-tiedostopalvelimille.

## Missä ne eroavat

### Kuka tallentaa ja tarjoilee julkaisut

Nostrissa välityspalvelimet ovat tallennus- ja jakelukerros: palvelimen on pidettävä jokainen
julkaisu verkossa. Bitsocialissa HTTP-reitittimet vain auttavat asiakkaita löytämään vertaisia. Ne
eivät säilytä julkaisuja, profiileja, yhteisöjen metatietoja tai moderointitilaa; asiakkaat hakevat
sisällön yhteisön solmulta ja vertaisilta, jotka jakavat sitä. Katso
[Vertaisverkkoprotokolla](/peer-to-peer-protocol/).

### Kuka hallitsee pääsyä

Nostrissa kirjoitusportit ovat välityspalvelinten ylläpitäjien hallussa. NIP-29-ryhmien ulkopuolella
avain, jonka yksi välityspalvelin hylkää, voi julkaista saman tapahtuman millä tahansa
välityspalvelimella, joka sen hyväksyy, ja se, mitä lukijat näkevät, riippuu siitä, mitä
välityspalvelimia heidän asiakkaansa lukee. NIP-29-ryhmä on lähempänä Bitsocial-yhteisöä: sen
isäntävälityspalvelin hyväksyy tai hylkää julkaisut. Välityspalvelin kuitenkin määrittelee edelleen,
mitä ryhmän roolit saavat tehdä, ja ryhmän historia pysyy sidottuna kyseiseen välityspalvelimeen,
ellei jokin toinen välityspalvelin suostu ottamaan sitä hoitaakseen.

Bitsocialissa yhteisö on kryptografinen objekti, jolla on oma avainparinsa. Yhteisön solmu ajaa sen
haasteen, jonka omistaja valitsee, ja julkaisee hyväksytyn tilan vertaisverkkoon. Katso
[Mukautetut roskapostin torjuntahaasteet](/custom-challenges/).

### Infrastruktuurin ylläpito

Välityspalvelin on palvelin, jolla on verkkotunnus ja WebSocket-päätepiste, ja suositut
välityspalvelimet kantavat tarjoilemansa sisällön tallennus- ja kaistakustannukset. Vuoden 2023
tutkimuksen arvion mukaan noin 95 % ilmaisista välityspalvelimista ei pystynyt kattamaan kulujaan
lahjoituksilla. Bitsocialin yhteisösolmu toimii kuluttajalaitteistolla, ja yhteisöä lukevat
vertaiset voivat auttaa sen jakamisessa.

### Selain

Nostrin verkkoasiakas avaa WebSocket-yhteydet suoraan välityspalvelimiin, joten sovelluspalvelinta
ei tarvita. Bitsocialin verkkosovellus ajaa vertaisverkkosolmua välilehdessä ja hakee sisällön
vertaisilta. Katso [Selaimen peer-to-peer](/browser-p2p/).

### Vanha sisältö

Nostr-julkaisut replikoituvat laajasti välityspalvelimille, mikä auttaa vanhoja julkaisuja
säilymään. Bitsocial säilyttää yhteisön uusimman tilan eikä takaa vanhan sisällön säilymistä
ikuisesti.

## Vertailu

| Kysymys                 | Nostr                                                                                                            | Bitsocial                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Kategoria               | Välityspalvelinpohjainen protokolla                                                                              | Vertaisverkkopohjainen yhteisöverkko                                                           |
| Identiteetti            | secp256k1-käyttäjäavain, jonka vaihtoa spesifikaatiot eivät määrittele                                           | Ed25519-avainparit käyttäjille ja yhteisöille                                                  |
| Missä julkaisut ovat    | Kirjoittajan valitsemilla välityspalvelimilla, usein monilla                                                     | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä                    |
| Kuka pitää sen verkossa | Välityspalvelinten ylläpitäjät                                                                                   | Yhteisön omistajan solmu sekä avustavat jakajat                                                |
| Yhteisöt                | Välityspalvelinten isännöimät ryhmät (NIP-29)                                                                    | Ensiluokkaiset objektit, joiden solmu hyväksyy tai hylkää julkaisut                            |
| Roskapostin torjunta    | Kunkin välityspalvelimen käytäntö: proof-of-work, tunnistautuminen, maksu, sallittujen listat, nopeusrajoitukset | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                         |
| Moderointi              | Välityspalvelinten käytännöt, asiakkaiden mykistyslistat, merkinnät ja ilmoitukset                               | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät          |
| Nimet                   | Valinnaiset `name@domain`-tunnisteet, jotka tarkistetaan HTTPS:n kautta                                          | `.bso`- ja `.eth`-nimet, jotka ratkeavat avaimiksi                                             |
| Selain                  | Välityspalvelinten WebSocket-asiakas                                                                             | Vertaisverkkosolmu tavallisessa selainvälilehdessä                                             |
| Tärkein kompromissi     | Siirrettävä identiteetti ja laaja replikointi, mutta saatavuus ja käytännöt riippuvat välityspalvelimista        | Vähemmän riippuvuutta välityspalvelimista, mutta vanhan sisällön säilymistä ei taata ikuisesti |
