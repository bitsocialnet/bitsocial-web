---
title: Reagoi koukut
description: React hooks -kirjasto hajautettujen sosiaalisten sovellusten rakentamiseen Bitsocial-protokollalla.
sidebar_position: 1
---

# Reagoi koukut

:::warning Legacy Naming
Tämä paketti käyttää tällä hetkellä vanhoja nimeämiskäytäntöjä, jotka on peritty sen ylävirran haarasta. Viittaukset "plebbitiin" koodissa, API:issa ja määrityksissä siirretään "bitsocial"-muotoon tulevassa julkaisussa. Toiminnallisuus ei vaikuta.
:::

`bitsocial-react-hooks`-paketti tarjoaa tutun React hooks APIn vuorovaikutukseen Bitsocial-protokollan kanssa. Se hoitaa syötteiden, kommenttien ja kirjoittajaprofiilien noudon, tilien hallinnan, sisällön julkaisemisen ja yhteisöjen tilaamisen – kaikki ilman keskuspalvelinta.

Tämä kirjasto on [5chan](/apps/5chan/) ja muiden Bitsocial-asiakassovellusten ensisijainen käyttöliittymä.

:::note
`bitsocial-react-hooks` on `plebbit/plebbit-react-hooks`:n väliaikainen haarukka, jota ylläpidetään tekoälyn tukemaa kehitystä varten. Se kulutetaan suoraan GitHubista sen sijaan, että se julkaistaan ​​npm:lle.
:::

## Asennus

Koska paketti ei ole vielä npm:ssä, asenna se suoraan GitHubista kiinnittäen tiettyyn vahvistushajaan:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Korvaa `<commit-hash>` sitoumuksella, johon haluat kohdistaa.

## API yleiskatsaus

Koukut on järjestetty toiminnallisiin luokkiin. Alla on yhteenveto kunkin luokan yleisimmin käytetyistä koukuista. Katso täydelliset allekirjoitukset, parametrit ja palautustyypit [täydellinen API-viittaus GitHubissa](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Tilit

Hallinnoi paikallisia käyttäjätilejä, identiteettiä ja asetuksia.

- `useAccount(accountName?)` -- palauttaa aktiivisen (tai nimetyn) tiliobjektin
- `useAccounts()` – palauttaa kaikki paikallisesti tallennetut tilit
- `useAccountComments(options?)` -- palauttaa aktiivisen tilin julkaisemat kommentit

### Kommentit

Hae ja käytä yksittäisiä kommentteja ja viestiketjuja.

- `useComment(commentCid?)` -- hakee yksittäisen kommentin CID-tunnuksellaan
- `useComments(commentCids?)` -- hakee useita kommentteja erässä
- `useEditedComment(comment?)` -- palauttaa kommentin viimeisimmän muokatun version

### yhteisöt

Hae yhteisön metatiedot ja asetukset.

- `useSubplebbit(subplebbitAddress?)` -- hakee yhteisön osoitteen perusteella
- `useSubplebbits(subplebbitAddresses?)` -- hakee useita yhteisöjä
- `useSubplebbitStats(subplebbitAddress?)` -- palauttaa tilaaja- ja viestimäärät

### Tekijät

Etsi tekijäprofiilit ja metatiedot.

- `useAuthor(authorAddress?)` -- hakee tekijäprofiilin
- `useAuthorComments(options?)` -- palauttaa tietyn kirjoittajan kommentit
- `useResolvedAuthorAddress(authorAddress?)` – ratkaisee ihmisen luettavissa olevan osoitteen (esim. ENS) protokollaosoitteekseen

### Syötteet

Tilaa ja sivuuta sisältösyötteitä.

- `useFeed(options?)` – palauttaa sivutetun syötteen yhdestä tai useammasta yhteisöstä
- `useBufferedFeeds(feedOptions?)` – esipuskuroi useita syötteitä nopeuttaakseen hahmontamista
- `useAuthorFeed(authorAddress?)` -- palauttaa syötteen tietyn kirjoittajan viesteistä

### Toiminnot

Julkaise sisältöä ja suorita kirjoitustoimintoja.

- `usePublishComment(options?)` -- julkaise uusi kommentti tai vastaus
- `usePublishVote(options?)` -- anna plus- tai miinusäänestys
- `useSubscribe(options?)` -- tilaa yhteisö tai peruuta sen tilaus

### osavaltiot ja RPC

Tarkkaile yhteyden tilaa ja ole vuorovaikutuksessa Bitsocial-etädemonin kanssa.

- `useClientsStates(options?)` – palauttaa IPFS-/pubsub-asiakkaiden yhteystilan
- `usePlebbitRpcSettings()` -- palauttaa nykyisen RPC-daemon-kokoonpanon

## Kehitys

Hooks-kirjaston työskentely paikallisesti:

**Edellytykset:** Node.js, Corepack käytössä, Lanka 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Katso testi- ja rakennuskomennot arkistosta README.

## Linkit

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Lisenssi:** Vain GPL-2.0
