---
title: Voucher Challenge
description: Roskapostin vastainen haaste, joka sulkee julkaisemisen yhteisön omistajien jakamien ainutlaatuisten kuponkikoodien taakse.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge on roskapostin estomekanismi, joka sulkee sisällön julkaisemisen ainutlaatuisten kuponkikoodien taakse. Sen sijaan, että luottaisi automaattiseen havaitsemiseen, se siirtää luottamuksen yhteisön omistajalle, joka jakaa koodit manuaalisesti ihmisille, joihin he luottavat.

**Lähdekoodi:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Miten se toimii

1. Yhteisön omistaja luo yhden tai useamman yksilöllisen kuponkikoodin.
2. Omistaja jakaa nämä koodit luotettaville kirjoittajille valitsemansa kanavan kautta (suora viesti, sähköposti, henkilökohtaisesti jne.).
3. Kun kirjoittaja yrittää julkaista, haastejärjestelmä pyytää häntä antamaan kuponkikoodin.
4. Koodi vahvistetaan – jos se on aito eikä sitä ole vielä käytetty, julkaisu hyväksytään.

Jokainen kuponkikoodi on sidottu tiettyyn tekijään, kun se on lunastettu, mikä estää muita käyttämästä sitä uudelleen.

## Milloin käyttää sitä

Voucher Challenge sopii parhaiten:

- **Vain kutsutut yhteisöt**, joissa jäsenyyttä rajoitetaan tarkoituksella.
- **Kuroidut tilat**, joissa omistaja tarkastaa henkilökohtaisesti jokaisen osallistujan.
- **Korkean luotettavuuden omaavat ympäristöt**, joissa automaattinen roskapostin pisteytys on tarpeetonta tai ei-toivottua.

Koska se vaatii manuaalisen koodin jakelun, se ei skaalaudu suuriin avoimiin yhteisöihin. Harkitse näissä skenaarioissa [Spam Blocker](./spam-blocker.md) tai [EVM Contract Call Challenge](./evm-contract-call.md).

## Integrointi

Voucher Challenge liitetään samaan haastekäyttöliittymään, jota muut Bitsocial-ekosysteemin roskapostin estopaketit käyttävät. Yhteisön omistajat ottavat sen käyttöön yhteisöasetuksissaan, ja haaste esitetään automaattisesti kirjoittajille, kun he yrittävät julkaista.
