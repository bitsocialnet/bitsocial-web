---
title: 5chan
description: Palvelimeton, hajautettu kuvalauta, joka on rakennettu Bitsocial-protokollan päälle ja jossa kuka tahansa voi luoda ja omistaa lautoja.
sidebar_position: 1
---

# 5chan

5chan on palvelimeton, ylläpitäjätön ja täysin hajautettu kuvalauta, joka toimii Bitsocial-protokollan päällä. Se noudattaa tuttua kuvalautojen hakemistorakennetta, mutta tuo mukaan hajautetun omistajuuden — kuka tahansa voi luoda laudan, ja useampi lauta voi kilpailla samasta hakemistopaikasta äänestyksen kautta.

## Lataukset

| Alusta   | Linkki                                       |
| -------- | -------------------------------------------- |
| Web      | [5chan.app](https://5chan.app)               |
| Työpöytä | Saatavilla Macille, Windowsille ja Linuxille |
| Mobiili  | Saatavilla Androidille                       |

## Miten laudat toimivat

5chan järjestää sisällön laudoiksi klassisen hakemistorakenteen avulla (esimerkiksi `/b/`, `/g/`). Toisin kuin perinteisillä kuvalaudoilla, joissa keskitetty ylläpitäjä hallitsee jokaista lautaa, 5chanissa kuka tahansa käyttäjä voi luoda oman lautansa ja omistaa sen kokonaan. Kun useampi lauta tavoittelee samaa hakemistopaikkaa, ne kilpailevat siitä; katso [Hakemistot](/directories/).

### Laudan luominen

Uuden laudan luominen edellyttää, että ajat `bitsocial-cli`-ohjelmaa vertaisverkkosolmuna. Näin lautaasi isännöidään hajautetusti ilman riippuvuutta keskitetystä palvelimesta.

### Hakemistopaikkojen jako

Kunkin hakemiston ehdokaslaudat luetellaan `5chan-directories/5chan-<code>-directory.json`-tiedostossa [bitsocialnet/lists](https://github.com/bitsocialnet/lists)-repositoriossa, ja lauta liittyy hakemistoon pull requestilla kyseiseen tiedostoon. Lisäksi 5chan järjestää jokaiselle hakemistolle äänestyskilpailun [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting)-kirjaston avulla: jokainen 5chan Passin haltija saa yhden äänen, ja ääni luettelon ulkopuoliselle laudalle asettaa sen ehdolle. Kilpailut käydään tällä hetkellä Base Sepolia -testiverkossa, jossa tulokset näytetään, mutta ne eivät muuta luettelon järjestystä.

## Sisäinen toteutus

Konepellin alla 5chan käyttää verkkoliikenteeseensä Bitsocial-protokollan yhteistä asiakaskerrosta.
Osoitteessa 5chan.app toimiva verkkosovellus ajaa oletuksena Helia-solmua selaimessa, joten
tavallinen välilehti liittyy verkkoon vertaisena: se lataa lautoja muilta vertaisilta ja julkaisee
pubsubin kautta ilman keskitettyä IPFS-yhdyskäytävää sisältöpolussa. Katso
[Selaimen vertaisverkko](/browser-p2p/), niin näet mitä se edellyttää ja mihin selainsolmu ei
edelleenkään pysty.

## Linkit

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lisenssi**: GPL-2.0-only
