---
title: Captcha Canvas Challenge
description: Itsenäinen kuvapohjainen captcha-generaattori, jossa on määritettävissä olevat merkit, mitat ja värit.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Legacy Naming
Tämä paketti julkaistiin alun perin `@plebbit`-alueella. Se on nimetty uudelleen nimellä `@bitsocial/captcha-canvas-challenge`. Viittauksia vanhaan nimeen saattaa silti esiintyä vanhemmissa dokumentaatioissa tai koodikantoissa.
:::

Captcha Canvas Challenge on itsenäinen captcha-kuvageneraattori, joka on alun perin purettu `plebbit-js`:sta. Se hahmontaa satunnaista tekstiä HTML-kankaalle ja palauttaa tuloksena olevan kuvan, jonka yhteisöt voivat esittää kirjoittajille roskapostihaasteena.

**Lähdekoodi:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Vaatimukset

- **Node.js** >= 22
- **Vain ESM** – tämä paketti ei toimita CommonJS-koontiversioita.
- **Suorituksenaikainen vertaisriippuvuus:** `@plebbit/plebbit-js` (siirretään malliin `@pkc/pkc-js`)

## Asennus

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Kokoonpanoasetukset

| Vaihtoehto   | Tyyppi   | Oletus    | Kuvaus                                                   |
| ------------ | -------- | --------- | -------------------------------------------------------- |
| `characters` | `number` | `6`       | Captcha-kuvassa näytettyjen satunnaisten merkkien määrä. |
| `height`     | `number` | `100`     | Luodun kuvan korkeus pikseleinä.                         |
| `width`      | `number` | `300`     | Luodun kuvan leveys pikseleinä.                          |
| `colors`     | `string` | `#32cf7e` | Captcha-tekstin pääväri.                                 |

## Miten se toimii

1. Generaattori valitsee konfiguroidun pituisen satunnaisen merkkijonon.
2. Merkkijono renderöidään kankaalle visuaalisella kohinalla, joka vastustaa tekstintunnistusta.
3. Tuloksena oleva kuva (ja odotettu vastaus) palautetaan, jotta kutsuva sovellus voi esittää haasteen ja myöhemmin tarkistaa vastauksen.

Koska paketti on pelkkä kuvageneraattori, se ei käsittele verkottumista tai istunnonhallintaa yksinään. Se on tarkoitettu integroitavaksi suurempaan haastevirtaan – esimerkiksi yhtenä [Roskapostin eston](./spam-blocker.md) tukemista haastetyypeistä.
