---
title: Seedit
description: Palvelimeton, hajautettu Reddit-tyylinen foorumi, joka on rakennettu Bitsocial-protokollalle, jossa kuka tahansa voi luoda ja omistaa yhteisöjä.
sidebar_position: 2
---

# Seedit

Seedit on palvelimeton, järjestelmänvalvojaton ja täysin hajautettu vaihtoehto vanhanaikaiselle Redditille, joka on rakennettu Bitsocial-protokollalle. Se antaa käyttäjille täyden omistusoikeuden yhteisöihinsä – kuka tahansa voi luoda sellaisen, ja useat yhteisöt voivat kilpailla samasta lyhyestä reitistä, kuten `/s/funny`.

## Lataukset

| Alusta    | Linkki                                                  |
| --------- | ------------------------------------------------------- |
| Web       | [seedit.app](https://seedit.app)                        |
| Web (ENS) | `seedit.eth` Brave-selaimen tai IPFS Companionin kautta |
| Työpöytä  | Saatavilla Macille, Windowsille ja Linuxille            |
| Mobiili   | Saatavilla Androidille                                  |

## Miten yhteisöt toimivat

Seedit järjestää sisällön subreddittien kaltaisiin yhteisöihin. Jokainen yhteisö on luojansa omistama ja toimii ilman keskitettyä hallintoa. Useat yhteisöt voivat kilpailla samasta [hakemiston](/directories/) reitistä, kuten `/s/funny`, joka avaa nykyisen voittajan. Tilaukset ja viestilinkit osoittavat aina tarkasti yksilöityyn yhteisöön.

### Yhteisön luominen

On kaksi tapaa luoda uusi yhteisö:

1. **Työpöytäasiakas** — Käytä työpöytäsovelluksen sisäänrakennettua käyttöliittymää yhteisön määrittämiseen ja määrittämiseen.
2. **bitsocial-cli** — Suorita CLI-työkalu luodaksesi ja hallitaksesi yhteisöjä komentoriviltä.

### Oletusyhteisöluettelo

Uudet tilit tilaavat oletusluettelon yhteisöt, jotka on määritetty tarkkoina osoitteina `seedit-default-subscriptions.json`-tiedostossa [bitsocialnet/lists](https://github.com/bitsocialnet/lists)-repositoriossa. Hakemistojen ehdokkaat luetellaan samassa repositoriossa olevissa `seedit-directories/seedit-<code>-directory.json`-tiedostoissa. Jos haluat lisätä yhteisösi jompaankumpaan luetteloon, lähetä vetopyyntö, joka sisältää yhteisön tiedot.

## Linkit

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Sähköposti**: [t.me/seeditreact](https://t.me/seeditreact)
- **Lisenssi**: vain GPL-2.0
