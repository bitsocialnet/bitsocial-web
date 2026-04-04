---
title: Telegram Bots
description: Syötebotit, jotka seuraavat Bitsocial-yhteisöluetteloita ja välittävät viestejä Telegram-kanaville.
sidebar_position: 3
---

# Telegram Bots

Bitsocial Telegram -botit valvovat asiakasyhteisöluetteloita Bitsocial-verkossa ja välittävät automaattisesti uudet viestit Telegram-kanaville. Jokainen edelleenlähetetty viesti sisältää upotetut painikkeet, jotka linkittävät takaisin alkuperäiseen viestiin 5chanissa ja Seeditissä.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Saatavilla olevat botit

| Bot                 | Status      | Kuvaus                                                                   |
| ------------------- | ----------- | ------------------------------------------------------------------------ |
| **5 kanavan syöte** | Aktiivinen  | Valvoo kaikkia 5chan-hakemistoja ja välittää uudet viestit Telegramille. |
| **Seedit-syöte**    | Suunniteltu | Tarjoaa samat toiminnot Seedit-yhteisöille.                              |

## Asennus

### Edellytykset

- Node.js
- Lanka
- Telegram-bottitunnus (luo sellainen käyttämällä [BotFather](https://t.me/BotFather))

### Asennus

Kloonaa arkisto ja asenna riippuvuudet:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Kokoonpano

Luo `.env`-tiedosto projektin juureen robottitunnuksellasi:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Juoksemassa

Käynnistä botti ympäristön määrittämisen jälkeen:

```bash
yarn start
```

## Viestimuoto

Kun botti lähettää viestin edelleen Telegramille, se sisältää kaksi upotettua painiketta:

- **Näytä 5chanissa** – Avaa viestin 5chan-verkkosovelluksessa.
- **Näytä Seeditissä** - Avaa viestin Seedit-verkkosovelluksessa.

Näin Telegram-tilaajat voivat siirtyä suoraan koko keskustelusäikeen haluamansa asiakkaan kohdalla.
