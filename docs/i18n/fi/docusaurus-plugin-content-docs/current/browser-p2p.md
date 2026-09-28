---
title: Selaimen peer-to-peer
description: Kuinka Bitsocial-verkkosovellus ajaa aidon libp2p-solmun selainvälilehdellä, mitä siirtotapoja se käyttää ja mikä vuoden 2026 ylävirran korjaus sai julkaisemisen välilehdeltä toimimaan.
---

# Selaimen peer-to-peer

Bitsocial-verkkosovelluksen ei tarvitse olla kenenkään palvelimen asiakas. Se voi ajaa
[Helia](https://helia.io/)-solmua selainvälilehden sisällä, liittyä samaan peer-to-peer-verkkoon kuin
työpöytä- ja CLI-solmut, hakea yhteisöjen sisältöä vertaisilta ja julkaista pubsubin kautta.

Tällä sivulla kerrotaan, mitä se käytännössä tarkoittaa, mitä siirtotapoja se käyttää, mihin se ei
edelleenkään pysty ja miksi julkaiseminen välilehdeltä alkoi toimia vasta vuonna 2026.

Laajempi verkon rakenne on kuvattu sivulla [Peer-to-Peer-protokolla](/peer-to-peer-protocol/).

## Mitä välilehdellä ajetaan

Kun selaimen P2P on käytössä, sivu ylläpitää aitoa libp2p-solmua:

- se ottaa yhteyden muihin vertaisiin suojattujen WebSocketien yli
- se hakee ja varmentaa yhteisöjen sisällön näiltä vertaisilta, ei IPFS-yhdyskäytävältä
- se osallistuu gossipsubiin, joten julkaisun lähettäminen ei vaadi isännöityä pubsub-palvelua
- se käyttää samaa protokolla-asiakaspinoa (`pkc-js`) kuin kaikki muutkin Bitsocial-sovellukset

Käytännön seuraus on, ettei yhdenkään yhdyskäytävän ylläpitäjä ole verkkolukijan ja yhteisön
välissä. Ei ole yhtä ainoaa HTTPS-päätepistettä, jota painostamalla yhteisö voitaisiin poistaa
kaikilta selainkäyttäjiltä kerralla.

## Miten selainsolmut muodostavat yhteyden

`pkc-js` ottaa yhteyden vertaisiin **suojattujen WebSocketien** yli. WebRTC- ja
WebTransport-yhteydet torjutaan oletuksena yhteysportilla, koska selaimessa ne tuovat mukanaan
pitkiä ja usein epäonnistuvia yhteydenmuodostuspolkuja — STUN/ICE-neuvottelu, certhash-kierrätys —
jotka hidastavat sivujen latautumista, kun taas WebSocket tarjoaa suoran ja luotettavan siirtotien.
Kutsuja, joka nimenomaan haluaa käyttää WebRTC:tä tai WebTransportia, voi ohittaa portin asetuksella
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Käytännön seuraus on, että selainvertainen yhdistää solmuihin, jotka tarjoavat WSS-päätepisteen,
mikä tarkoittaa, että näillä solmuilla on oltava verkkotunnus ja CA:n allekirjoittama varmenne.
Vertaiset, jotka ovat kuluttajayhteyksien takana ilman sellaista, tavoitetaan epäsuorasti sen
sijaan, että niihin otettaisiin yhteys suoraan välilehdeltä.

## Miksi selaimesta julkaiseminen alkoi toimia vasta vuonna 2026

Selaimen peer-to-peer ei ole uusi ajatus. Vuonna 2026 muuttui se, että selainsolmun _julkaisut_
tavoittavat nyt muun verkon.

libp2p:n pubsub-määrittely edellyttää, että viestin `seqno` on lineaarisesti kasvava 64-bittinen
big-endian-kokonaisluku. `js-libp2p-gossipsub` tuotti sen sijaan 8 satunnaista tavua, kun taas
go-libp2p-pubsub ja rust-libp2p käyttivät kumpikin laskuria. Kubo 0.40+ ottaa oletuksena käyttöön
validaattorin `BasicSeqnoValidator`, joka hylkää jokaisen viestin, jonka seqno ei ole suurempi kuin
kyseiseltä vertaiselta jo nähty suurin arvo.

Seurauksena useimmat JavaScript-solmun — myös selainsolmun — julkaisemat viestit päätyivät
Kubo-vertaisilla hiljaisesti roskiin. Toisinnettavassa testissä 30 viestistä perille saapui 2–8.

Ongelma tunnistettiin raportissa
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) ja korjattiin
versiossa **`@libp2p/gossipsub` 15.0.21** toukokuussa 2026. Siihen asti selainsolmu pystyi
muodostamaan yhteyden ja lukemaan, mutta sen julkaisut katosivat useimmiten matkalla Go-vertaisille.
`pkc-js` toimittaa version `@libp2p/gossipsub` 16.0.4, joka on tuota korjausta uudempi.

## Mihin selainsolmu ei edelleenkään pysty

Selainsolmu on aito vertainen, ei palvelin. Sen rajat poikkeavat työpöytäsolmusta tai jatkuvasti
päällä olevasta solmusta:

- se ei yleensä voi ottaa vastaan mielivaltaisia saapuvia yhteyksiä julkisesta internetistä
- se toimii vain niin kauan kuin välilehti on auki, joten se ei ole pitkäikäinen isäntä yhteisön datalle
- se ei voi liittyä libp2p:n DHT-verkkoon, minkä vuoksi löytäminen kulkee HTTP-reitittimien kautta
- se soveltuu huonosti laajamittaiseen jakamiseen

Yhteisön täysimittainen isännöinti hoituu edelleen parhaiten työpöytäsovelluksella,
`bitsocial-cli`-työkalulla tai muulla jatkuvasti päällä olevalla solmulla. Selaimen P2P muuttaa sen,
kuka voi _lukea ja julkaista_ ilman yhdyskäytävää; se ei poista tarvetta vertaisille, jotka pysyvät
verkossa.

## HTTP-reitittimet eivät ole yhdyskäytäviä

Selainasiakkaat kysyvät edelleen [HTTP-reitittimiltä](/peer-to-peer-protocol/#public-key-based-addressing),
mitkä vertaiset tarjoavat parhaillaan yhteisön osoitetta. Tämä on rehellinen tähti ilmaisussa
"puhdas peer-to-peer selaimessa", ja siitä kannattaa puhua täsmällisesti:

- reititin tallentaa vain vertaisosoitteet yhtä sisältöosoitetta kohden
- se ei tallenna eikä tarjoile yhteisön sisältöä, eikä edes tiedä siitä
- asiakkaat kysyvät useilta reitittimiltä rinnakkain ja yhdistävät tulokset
- kuka tahansa voi ylläpitää sellaista, ja reitittimen vaihtaminen on asetusmuutos ilman datan siirtoa

Löytämisen jälkeen sisällönsiirto ja pubsub-liikenne kulkevat vertaiselta vertaiselle. Kadonnut
reititin vie sinulta hakupolun, ei dataasi. IPFS-yhdyskäytävä sen sijaan on sisällön kulkureitillä.

## Missä tämä on käytössä tänään

- [5chan](/apps/5chan/) toimii oletuksena puhtaana selain-P2P:nä verkkosovelluksessa osoitteessa
  [5chan.app](https://5chan.app).

## Yhdyskäytävän varapolku

Yhdyskäytävän kautta tapahtuva pääsy on edelleen olemassa yhteensopivuuspolkuna selaimille ja
verkoille, jotka eivät voi liittyä suoraan. Katso [Yhdyskäytävän varapolku](/peer-to-peer-protocol/#gateway-fallback).
Tavoitearkkitehtuurissa selaimen P2P on ensisijainen ja yhdyskäytävät ovat valinnainen varapolku
oletuspullonkaulan sijaan.
