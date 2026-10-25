---
title: Seedit
description: Ett serverlöst, decentraliserat forum i Reddit-stil byggt på Bitsocial-protokollet där vem som helst kan skapa och äga gemenskaper.
sidebar_position: 2
---

# Seedit

Seedit är ett serverlöst, adminlöst och helt decentraliserat alternativ till gammaldags Reddit, byggt på Bitsocial-protokollet. Det ger användarna fullständigt ägande över sina gemenskaper - vem som helst kan skapa en, och flera gemenskaper kan konkurrera om samma korta sökväg, till exempel `/s/funny`.

## Nedladdningar

| Plattform  | Länk                                                   |
| ---------- | ------------------------------------------------------ |
| Webb       | [seedit.app](https://seedit.app)                       |
| Webb (ENS) | `seedit.eth` via Brave webbläsare eller IPFS Companion |
| Desktop    | Tillgänglig för Mac, Windows och Linux                 |
| Mobil      | Tillgänglig för Android                                |

## Hur samhällen fungerar

Seedit organiserar innehåll i gemenskaper som liknar subreddits. Varje community ägs av dess skapare och fungerar utan centraliserad administration. Flera gemenskaper kan konkurrera om samma [katalogsökväg](/directories/), till exempel `/s/funny`, som öppnar den nuvarande vinnaren. Prenumerationer och inläggslänkar pekar alltid på en specifik gemenskap.

### Skapa en gemenskap

Det finns två sätt att skapa en ny gemenskap:

1. **Skrivbordsklient** — Använd det inbyggda gränssnittet i skrivbordsapplikationen för att konfigurera och konfigurera din community.
2. **bitsocial-cli** — Kör CLI-verktyget för att skapa och hantera gemenskaper från kommandoraden.

### Standardgrupplista

Nya konton prenumererar på en standardlista med specifika gemenskaper som definieras i `seedit-default-subscriptions.json` i repositoriet [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Katalogkandidater listas i `seedit-directories/seedit-<code>-directory.json`-filer i samma repositorium. För att lägga till din gemenskap i någon av listorna skickar du en pull request med din gemenskaps uppgifter.

## Länkar

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licens**: Endast GPL-2.0
