---
title: Telegram Bots
description: Karmij boty, które monitorują listy społeczności Bitsocial i przekazują posty na kanały Telegramu.
sidebar_position: 3
---

# Telegram Bots

Boty Bitsocial Telegram monitorują listy społeczności klientów w sieci Bitsocial i automatycznie przekazują nowe posty do kanałów Telegramu. Każda przekazana wiadomość zawiera wbudowane przyciski, które prowadzą do oryginalnego wpisu na 5chan i Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Dostępne boty

| Bot              | Stan      | Opis                                                                      |
| ---------------- | --------- | ------------------------------------------------------------------------- |
| **Kanał 5chan**  | Aktywny   | Monitoruje wszystkie katalogi 5chan i przekazuje nowe posty do Telegramu. |
| **Kanał nasion** | Planowane | Zapewni tę samą funkcjonalność społecznościom Seedit.                     |

## Organizować coś

### Warunki wstępne

- Node.js
- Przędza
- Token bota Telegramu (utwórz go poprzez [BotFather](https://t.me/BotFather))

### Instalacja

Sklonuj repozytorium i zainstaluj zależności:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Konfiguracja

Utwórz plik `.env` w katalogu głównym projektu za pomocą tokena bota:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Działanie

Uruchom bota po skonfigurowaniu środowiska:

```bash
yarn start
```

## Format postu

Gdy bot przekazuje post do Telegramu, zawiera dwa wbudowane przyciski:

- **Wyświetl na 5chan** -- Otwiera post w kliencie sieciowym 5chan.
- **Wyświetl w Seedit** – otwiera post w kliencie WWW Seedit.

Dzięki temu subskrybenci Telegramu mogą przejść bezpośrednio do pełnego wątku dyskusji na dowolnym kliencie.
