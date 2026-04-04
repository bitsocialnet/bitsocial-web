---
title: CLI
description: Komentorivikäyttöliittymä Bitsocial-solmun suorittamiseen, yhteisöjen luomiseen ja protokollatoimintojen hallintaan.
sidebar_position: 2
---

# CLI

:::warning Legacy nimeäminen
Tämä paketti käyttää tällä hetkellä vanhoja nimeämiskäytäntöjä, jotka on peritty sen alkupään riippuvuudesta. Viittaukset "plebbit":iin komentoissa, lähdöissä ja määrityksissä siirretään "bitsocial"-muotoon tulevassa julkaisussa. Toiminnallisuus ei vaikuta.
:::

`bitsocial-cli` on komentorivityökalu vuorovaikutukseen Bitsocial-protokollan taustajärjestelmän kanssa. Sen avulla voit ajaa paikallista P2P-demonia, luoda ja määrittää yhteisöjä sekä julkaista sisältöä – kaikki päätteestä.

Se on rakennettu `plebbit-js`:n päälle, ja sitä käyttävät [5chan](/apps/5chan/) ja [Seedit](/apps/seedit/) yhteisön luomiseen ja solmujen hallintaan.

## Asennus

Valmiiksi rakennetut binaarit ovat saatavilla Windowsille, macOS:lle ja Linuxille. Lataa alustallesi uusin julkaisu GitHubista:

**[Lataa GitHub-julkaisuista](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Latauksen jälkeen tee binaarista suoritettava (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Daemonin ajaminen

CLI:n yleisin käyttötapa on Bitsocial-solmun käyttäminen. Demoni käynnistää P2P-verkkokerroksen ja paljastaa paikallisen API:n, johon asiakkaat voivat muodostaa yhteyden.

```bash
bitsocial-cli daemon
```

Ensimmäisellä käynnistyksellä daemon lähettää linkit **WebUI:hen**, selainpohjaiseen graafiseen käyttöliittymään solmun, yhteisöjen ja asetusten hallintaan. Tämä on hyödyllistä, jos haluat käyttää graafista käyttöliittymää päätekomentojen sijaan.

## Näppäinkomennot

| Komento             | Kuvaus                                                |
| ------------------- | ----------------------------------------------------- |
| `daemon`            | Käynnistä Bitsocial P2P -solmu                        |
| `create subplebbit` | Luo uusi yhteisö                                      |
| `subplebbit edit`   | Päivitä yhteisön asetukset (otsikko, kuvaus, säännöt) |
| `subplebbit list`   | Luettelo tässä solmussa isännöidyistä yhteisöistä     |
| `subplebbit start`  | Aloita tietyn yhteisön palveleminen                   |
| `subplebbit stop`   | Lopeta tietyn yhteisön palveleminen                   |

Suorita mikä tahansa komento `--help` nähdäksesi käytettävissä olevat vaihtoehdot ja liput:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Tyypillinen työnkulku

Yleinen asennuskulku uuden yhteisön isännöimiseksi:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

Yhteisö on nyt livenä Bitsocial-verkossa ja siihen pääsee kaikilta yhteensopivalta asiakkaalta.

## Linkit

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
