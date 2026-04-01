---
title: Roskapostin esto
description: Keskitetty roskapostin tunnistuspalvelu, jossa on riskipisteet, OAuth-haasteet ja määritettävissä olevat tason kynnykset.
sidebar_position: 1
---

# Roskapostin esto

:::warning Legacy Naming
Tämä paketti julkaistiin alun perin `@plebbit`-alueella. Se on nimetty uudelleen `@bitsocial/spam-blocker-server` ja `@bitsocial/spam-blocker-challenge`. Viittauksia vanhoihin nimiin saattaa edelleen esiintyä vanhemmissa dokumentaatioissa tai koodikantoissa.
:::

Roskapostin esto on keskitetty roskapostin tunnistuspalvelu, joka arvioi saapuvat julkaisut ja antaa riskipisteitä. Se koostuu kahdesta paketista:

- **`@bitsocial/spam-blocker-server`** – HTTP-palvelin, joka isännöi arviointi- ja haastesovellusliittymiä.
- **`@bitsocial/spam-blocker-challenge`** – kevyt asiakaspaketti, jonka yhteisöt integroivat lähettääkseen julkaisuja arvioitavaksi.

**Lähdekoodi:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Miten riskipisteytys toimii

Jokainen `/evaluate`-päätepisteeseen lähetetty julkaisu saa numeerisen riskipisteen. Pisteet on useiden signaalien painotettu yhdistelmä:

| Signaali        | Kuvaus                                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Tilin ikä       | Uudemmat tilit saavat korkeammat riskipisteet.                                                                                           |
| Karma           | Kertynyt yhteisökarma vähentää riskiä.                                                                                                   |
| Tekijän maine   | Taustaverkon indeksoijan keräämät mainetiedot.                                                                                           |
| Sisältöanalyysi | Tekstitason heuristiikka (linkin tiheys, tunnetut roskapostimallit jne.).                                                                |
| Nopeus          | Nopeat peräkkäiset viestit samalta kirjoittajalta lisäävät riskiä.                                                                       |
| IP-tiedustelu   | Maatason maantieteellinen sijainti ja uhkasyötteen haut. Vain maakoodit tallennetaan – raaka-IP-osoitteita ei koskaan jaeta yhteisöille. |

## Tason kynnykset

Riskipisteet kartoitetaan yhteen neljästä konfiguroitavasta tasosta, jotka määrittävät, mitä seuraavaksi tapahtuu:

1. **Hyväksy automaattisesti** -- pisteet ovat tarpeeksi alhaiset, jotta julkaisu hyväksytään ilman haasteita.
2. **OAuth-sufficient** – kirjoittajan on suoritettava OAuth-vahvistus jatkaakseen.
3. **OAuth-plus-more** - Pelkkä OAuth ei riitä; lisävahvistus (esim. CAPTCHA) vaaditaan.
4. **Automaattinen hylkääminen** -- pisteet ovat liian korkeat; julkaisu hylätään suoraan.

Kaikki kynnysarvot ovat määritettävissä yhteisökohtaisesti.

## Challenge Flow

Kun julkaisu joutuu tasolle, joka vaatii vahvistusta, haastekulku alkaa:

1. Kirjoittajaa pyydetään ensin todentamaan **OAuthin** kautta (GitHub, Google, Twitter ja muut tuetut palveluntarjoajat).
2. Jos pelkkä OAuth ei riitä (taso 3), näytetään **CAPTCHA-varavaihtoehto**, joka toimii Cloudflare Turnstilen avulla.
3. OAuth-identiteettiä käytetään vain vahvistamiseen – sitä **ei koskaan jaeta** yhteisön tai muiden käyttäjien kanssa.

## API-päätepisteet

### `POST /evaluate`

Lähetä julkaisu riskinarviointia varten. Palauttaa lasketun riskipisteen ja vaaditun haastetason.

### `POST /challenge/verify`

Lähetä suoritetun haasteen tulos (OAuth-tunnus, CAPTCHA-ratkaisu tai molemmat) tarkistettavaksi.

### `GET /iframe/:sessionId`

Palauttaa upotettavan HTML-sivun, joka hahmontaa sopivan haastekäyttöliittymän tietylle istunnolle.

## Rate Limiting

Hintarajoituksia sovelletaan dynaamisesti tekijän iän ja maineen perusteella. Uudemmat tai heikomman maineet kirjoittajat kohtaavat tiukemmat rajat, kun taas vakiintuneet kirjoittajat nauttivat anteliaammista kynnyksistä. Tämä estää roskapostitulvia rankaisematta luotettavia osallistujia.

## Taustaverkko-indeksoija

Palvelin käyttää tausta-indeksoijaa, joka indeksoi jatkuvasti verkkoa luodakseen ja ylläpitääkseen tekijän mainetietoja. Nämä tiedot syötetään suoraan riskien pisteytysputkiin, jolloin järjestelmä voi tunnistaa toistuvia hyvässä uskossa toimivia osallistujia yhteisöissä.

## Yksityisyys

Roskapostin esto on suunniteltu yksityisyyttä ajatellen:

- OAuth-identiteettejä käytetään vain haasteen vahvistamiseen, eikä niitä **ei koskaan paljasteta** yhteisöille.
- IP-osoitteet määritetään **vain maakoodeiksi**; raaka-IP-osoitteita ei tallenneta tai jaeta.

## Tietokanta

Palvelin käyttää **SQLitea** (`better-sqlite3`:n kautta) mainetietojen, istunnon tilan ja määritysten paikalliseen säilymiseen.
