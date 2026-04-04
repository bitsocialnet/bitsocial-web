---
title: EVM Contract Call Challenge
description: Roskapostin vastainen haaste, joka tarkistaa ketjun olosuhteet soittamalla EVM-älysopimukseen.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Legacy nimeäminen
Tämä paketti julkaistiin alun perin `@plebbit`-alueella. Se on nimetty uudelleen nimellä `@bitsocial/evm-contract-challenge`. Viittauksia vanhaan nimeen saattaa silti esiintyä vanhemmissa dokumentaatioissa tai koodikantoissa.
:::

EVM Contract Call Challenge on roskapostin estomekanismi, joka tarkistaa ketjun olosuhteet ennen julkaisun sallimista. Alun perin `plebbit-js`:sta erillisenä pakettina purettu se antaa yhteisön omistajille mahdollisuuden vaatia kirjoittajia täyttämään älykkäissä sopimuksissa määritellyt kriteerit – esimerkiksi vähintään token-saldo – voidakseen julkaista.

**Lähdekoodi:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Vaatimukset

- **Node.js** >= 22
- **Vain ESM** – tämä paketti ei toimita CommonJS-koontiversioita.
- **Suorituksenaikainen vertaisriippuvuus:** `@plebbit/plebbit-js` (siirretään malliin `@pkc/pkc-js`)

## Asennus

```bash
npm install @bitsocial/evm-contract-challenge
```

## Kokoonpanoasetukset

| Vaihtoehto    | Tyyppi   | Kuvaus                                                                                  |
| ------------- | -------- | --------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Kyselyketju (esim. `eth`, `matic`, `avax`).                                             |
| `address`     | `string` | Älykäs sopimusosoite, johon soittaa.                                                    |
| `abi`         | `string` | Kutsuttavan funktion ABI-fragmentti.                                                    |
| `condition`   | `string` | Vertailulauseke, joka on arvioitu suhteessa sopimuksen palautusarvoon (esim. `> 1000`). |
| `error`       | `string` | Virheilmoitus näytetään kirjoittajille, jotka eivät täytä ehtoa.                        |

## Esimerkki

Yhteisön omistaja, joka haluaa rajoittaa lähettämisen kirjoittajiin, joilla on enemmän kuin 1 000 tietystä ERC-20-tunnusta, määrittää haasteen seuraavasti:

- `chainTicker`: `"eth"`
- `address`: Token-sopimuksen osoite
- `abi`: ABI mallille `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Kun tekijä yrittää julkaista, haaste kutsuu `balanceOf` kirjoittajan osoitteen kanssa ja tarkistaa, täyttääkö palautettu arvo ehdon. Jos näin tapahtuu, julkaisu jatkuu; muussa tapauksessa palautetaan määritetty virhesanoma.

## Milloin käyttää sitä

EVM Contract Call Challenge on ihanteellinen:

- **Token-gated-yhteisöt**, jotka rajoittavat lähettämisen tunnuksen haltijoille.
- **NFT-porteilla varustettu pääsy**, jossa vaaditaan tietyn NFT:n omistus.
- **DAO-hallintatilat**, joihin osallistuminen on rajoitettu hallintotunnuksen haltijoihin.

Jos yhteisö ei ole riippuvainen ketjun identiteetistä, harkitse sen sijaan [Spam Blocker](./spam-blocker.md) tai [Voucher Challenge](./voucher-challenge.md).
