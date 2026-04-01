---
title: BSO Resolver
description: Ratkaise .bso-verkkotunnusten nimet julkisiksi avaimille käyttämällä ENS TXT -tietueita, joissa on sisäänrakennettu välimuisti ja eri alustojen tuki.
sidebar_position: 1
---

# BSO Resolver

BSO Resolver kääntää `.bso` verkkotunnusten nimet niitä vastaaviksi julkisiksi avaimille lukemalla ENS:ään tallennetut Bitsocial TXT -tietueet. Se tarjoaa jaetun viem-asiakkaan, jatkuvan välimuistin ja toimii sekä Node.js- että selainympäristöissä.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Lisenssi**: vain GPL-2.0

## Asennus

```bash
npm install @bitsocial/bso-resolver
```

## Ratkaisijan luominen

Instantoi ratkaisija välittämällä konfigurointiobjekti rakentajalle:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parametri  | Pakollinen | Kuvaus                                               |
| ---------- | ---------- | ---------------------------------------------------- |
| `key`      | Kyllä      | Ratkaisijainstanssin tunniste.                       |
| `provider` | Kyllä      | Kuljetusasetukset (katso alla).                      |
| `dataPath` | Ei         | SQLite-välimuistitiedoston hakemisto (vain Node.js). |

### Palveluntarjoajan vaihtoehdot

`provider`-parametri hyväksyy kolme muotoa:

- **`"viem"`** – Käyttää viemin tarjoamaa oletusarvoista julkista liikennettä.
- **HTTP(S) URL** – muodostaa yhteyden JSON-RPC-päätepisteen kautta (esim. `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** – muodostaa yhteyden WebSocket RPC -päätepisteen kautta (esim. `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## menetelmät

### `resolve({ name, abortSignal? })`

Etsii `.bso`-nimen ja palauttaa siihen liittyvän julkisen avaimen. Valinnainen `AbortSignal` voidaan välittää pitkäaikaisten pyyntöjen peruuttamiseksi.

### `canResolve({ name })`

Palauttaa loogisen arvon, joka osoittaa, pystyykö ratkaiseja käsittelemään annettua nimeä. Käytä tätä tarkistaaksesi tuen ennen täyden resoluution yrittämistä.

### `destroy()`

Purkaa ratkaisejan, sulkee tietokantayhteydet ja vapauttaa resursseja. Soita tähän, kun ratkaisijaa ei enää tarvita.

## Välimuisti

Ratkaistut nimet tallennetaan automaattisesti välimuistiin redundanttien verkkohakujen vähentämiseksi. Välimuistin taustaohjelma valitaan ajonaikaisen ympäristön perusteella:

| Ympäristö | Backend               | Huomautuksia                                                                  |
| --------- | --------------------- | ----------------------------------------------------------------------------- |
| Node.js   | SQLite                | Säilytetty osoitteessa `dataPath`. Käyttää WAL-tilaa samanaikaiseen käyttöön. |
| Selain    | IndexedDB             | Käyttää alkuperäisiä IndexedDB-tapahtumia.                                    |
| Varaus    | Muistissa oleva `Map` | Käytetään, kun SQLite tai IndexedDB ei ole saatavilla.                        |

Kaikilla välimuistin tiedoilla on **tunnin TTL**, ja ne häädetään automaattisesti vanhenemisen jälkeen.

## Integrointi pkc-js:n kanssa

Ratkaisin voidaan kytkeä suoraan pkc-js:ään `nameResolvers`-vaihtoehdon kautta, mikä mahdollistaa läpinäkyvän `.bso`-nimen tarkkuuden avainhakujen aikana:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Samanaikaisuus

Resolver on suunniteltu turvalliseksi samanaikaisessa käytössä:

- Yksi jaettu viem-asiakasohjelma välttää ylimääräiset yhteydet.
- SQLite toimii WAL (Write-Ahead Logging) -tilassa, mikä mahdollistaa samanaikaisen lukemisen ilman estoa.
- Selaimen välimuisti perustuu alkuperäisiin IndexedDB-tapahtumiin.

## Alustan sisääntulopisteet

Paketti toimittaa erilliset sisääntulokohdat Node.js:lle ja selainversioille. Niputtimet, jotka tukevat `exports`-kenttää `package.json`:ssa, valitsevat automaattisesti oikean.
