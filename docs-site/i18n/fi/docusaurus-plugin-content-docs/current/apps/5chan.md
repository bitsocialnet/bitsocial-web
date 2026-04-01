---
title: 5chan
description: Palvelimeton, Bitsocial-protokollalle rakennettu hajautettu kuvataulu, jolla kuka tahansa voi luoda ja omistaa tauluja.
sidebar_position: 1
---

:::warning[Legacy naming]
Tämän projektin koodikanta käyttää edelleen vanhaa "plebbit" -nimeämistä ennen Bitsocial-uudelleenbrändiä. Pakettien nimet, API-viitteet ja jotkut sisäiset terminologiat päivitetään tulevassa julkaisussa. Tässä kuvattu toiminto on ajankohtainen – vain nimeäminen on vanhentunutta.
:::

# 5chan

5chan on palvelimeton, järjestelmänvalvojaton ja täysin hajautettu kuvataulu, joka toimii Bitsocial-protokollalla. Se noudattaa tuttua imageboard-hakemistorakennetta ja ottaa käyttöön hajautetun omistajuuden – kuka tahansa voi luoda taulun, ja useat taulut voivat kilpailla samasta hakemistopaikasta äänestysmekanismin kautta.

## Lataukset

| Alusta   | Linkki                                       |
| -------- | -------------------------------------------- |
| Web      | [5chan.app](https://5chan.app)               |
| Työpöytä | Saatavilla Macille, Windowsille ja Linuxille |
| Mobiili  | Saatavilla Androidille                       |

## Kuinka laudat toimivat

5chan järjestää sisällön tauluihin käyttämällä klassista hakemistoasettelua (esim. `/b/`, `/g/`). Toisin kuin perinteiset kuvataulut, joissa keskusjärjestelmänvalvoja hallitsee jokaista taulua, 5chan sallii jokaisen käyttäjän luoda ja omistaa oman taulunsa. Kun useat taulut kohdistavat samaan hakemistopaikkaan, ne kilpailevat kyseisestä paikasta äänestämällä.

### Taulun luominen

Uuden levyn luomiseksi sinun on suoritettava `bitsocial-cli` vertaissolmuna. Tämä varmistaa, että lautasi isännöidään hajautetusti ilman, että sinun tarvitsee luottaa mihinkään keskuspalvelimeen.

### Hakemistotehtävät

Hakemistopaikkojen määrityksiä (mikä kortti näkyy missä polussa) hallitaan tällä hetkellä GitHubin vetopyyntöjen kautta `5chan-directories.json`-tiedostoon. Tämä on väliaikainen prosessi – tulevat julkaisut tukevat sovelluslevyjen luomista ja pubipohjaista äänestystä, jotta hakemistomääritykset käsitellään automaattisesti.

## Sisäosat

Konepellin alla 5chan käyttää plebbit-js API-kerrosta protokollavuorovaikutukseensa. Kuten yllä olevassa varoituksessa todettiin, näissä sisäisissä viitteissä on edelleen Bitsocial-uudelleenbrändiä edeltäneitä nimiä.

## Linkit

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Sähköposti**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lisenssi**: vain GPL-2.0
