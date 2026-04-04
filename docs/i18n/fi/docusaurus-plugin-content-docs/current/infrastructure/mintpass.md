---
title: Mintpass
description: NFT-pohjainen todennusjärjestelmä, joka auttaa Bitsocial-yhteisöjä vahvistamaan käyttäjiä ja vähentämään sybilhyökkäyksiä.
sidebar_position: 2
---

# Mintpass

Mintpass on NFT-pohjainen todennusjärjestelmä Bitsocial-yhteisöille. Käyttäjät luovat ei-siirrettävän NFT-vahvistuksen suoritettuaan haasteen (kuten SMS OTP), ja yhteisöt voivat tarkistaa NFT:n omistajuuden suojautuakseen sybilhyökkäyksiltä, ​​kuten väärennetyiltä ääniltä, ​​kieltääkseen kiertämisen ja roskapostin.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Lisenssi**: MIT

## Miten se toimii

Vahvistusprosessissa on neljä vaihetta:

1. **Pyyntö** – Käyttäjä vierailee osoitteessa `mintpass.org/request` aloittaakseen prosessin.
2. **Haaste** – Käyttäjä suorittaa kertaluonteisen SMS-salasanan vahvistuksen.
3. **Mint** – Onnistuneen vahvistuksen jälkeen ei-siirrettävä NFT lyödään käyttäjän lompakkoon.
4. **Vahvista** – Yhteisöt tiedustelevat NFT:n omistajuutta vahvistaakseen, että käyttäjä on vahvistettu.

Koska NFT ei ole siirrettävissä, se pysyy sidottuna varmennuksen suorittaneeseen lompakkoon, mikä estää käyttäjiä käymästä kauppaa tai myymästä vahvistettua tilaansa.

## Hankkeen rakenne

Arkisto on jaettu kolmeen pääalueeseen:

| Hakemisto    | Tarkoitus                                        |
| ------------ | ------------------------------------------------ |
| `contracts/` | Solidity älykkäät sopimukset NFT-vahvistukseen.  |
| `challenge/` | Integrointikerros Bitsocial-haastejärjestelmään. |
| `web/`       | Next.js ja React-käyttöliittymä lyöntikulkuun.   |

## Yksityisyys ja tietojenkäsittely

Mintpass käyttää mahdollisimman vähän dataa:

- **Toimintatiedot** (OTP-koodit, istuntotunnukset) tallennetaan Redisiin lyhyillä TTL-tunnuksilla ja vanhenevat automaattisesti.
- **Mint-assosiaatio** (linkki vahvistetun henkilöllisyyden ja lompakon välillä) on ainoa pysyvä tietue.

Puhelinnumeroita tai henkilötietoja ei säilytetä vahvistusikkunan sulkemisen jälkeen.

## Valinnaiset suojauskerrokset

Yhteisön operaattorit voivat ottaa käyttöön lisäsuojauksia uhkamallista riippuen:

- **IP-maineen tarkistukset** – Arvioi saapuvat pyynnöt tunnettuja väärinkäyttötietokantoja vastaan.
- **Puhelinriskin arviointi** – Merkitse kertakäyttöiset tai VoIP-numerot ennen haasteen lähettämistä.
- **Geoblocking** – Rajoita vahvistus tietyille alueille.
- **IP-kohtainen jäähtyminen** – Rate-rajoita toistuvia vahvistusyrityksiä samasta osoitteesta.

## Teknologiapino

| Kerros         | Tekniikka                                       |
| -------------- | ----------------------------------------------- |
| Sopimukset     | Solidity, käytössä Hardhatin ja Foundryn kanssa |
| Käyttöliittymä | Next.js + React                                 |
| Verkko         | Pohja (Ethereum L2)                             |

Käyttöönotto Basessa pitää kaasukustannukset alhaisina samalla kun perii Ethereumin turvallisuustakuut.

## Tiekartta

Suunniteltuja parannuksia ovat mm.

- **Pay-to-mint -vaihtoehto** – Salli yhteisöjen vaatia pientä maksua lyömisestä, mikä lisää taloudellisen sybilesteen.
- **Lisävahvistussignaalit** – Laajenna tekstiviestien lisäksi muihin tunnistussignaaleihin.
- **Laajennetut järjestelmänvalvojan työkalut** – monipuolisemmat kojelaudat ja säätimet yhteisön toimijoille.
