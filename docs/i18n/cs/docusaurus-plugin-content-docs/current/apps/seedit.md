---
title: Seedit
description: Bezserverové decentralizované fórum ve stylu Reddit postavené na protokolu Bitsocial, kde může kdokoli vytvářet a vlastnit komunity.
sidebar_position: 2
---

# Seedit

Seedit je bezserverová, správná a plně decentralizovaná alternativa ke starému Redditu, postavená na protokolu Bitsocial. Poskytuje uživatelům úplné vlastnictví jejich komunit – kdokoli může jednu vytvořit a několik komunit může soutěžit o stejnou krátkou cestu, například `/s/funny`.

## Stahování

| Platforma | Odkaz                                                 |
| --------- | ----------------------------------------------------- |
| Web       | [seedit.app](https://seedit.app)                      |
| Web (ENS) | `seedit.eth` přes prohlížeč Brave nebo IPFS Companion |
| Desktop   | K dispozici pro Mac, Windows a Linux                  |
| Mobil     | K dispozici pro Android                               |

## Jak fungují komunity

Seedit organizuje obsah do komunit podobně jako subreddits. Každá komunita je vlastněna jejím tvůrcem a funguje bez centralizované správy. O stejnou cestu [adresáře](/directories/), například `/s/funny`, může soutěžit více komunit; tato cesta otevře aktuálního vítěze. Odběry a odkazy na příspěvky vždy směřují na konkrétní komunitu.

### Vytváření komunity

Existují dva způsoby, jak vytvořit novou komunitu:

1. **Klient pro stolní počítače** — K nastavení a konfiguraci komunity použijte vestavěné grafické uživatelské rozhraní v desktopové aplikaci.
2. **bitsocial-cli** — Spusťte nástroj CLI pro vytváření a správu komunit z příkazového řádku.

### Výchozí seznam komunit

Nové účty se automaticky přihlásí k odběru výchozího seznamu konkrétních komunit, který je definován v `seedit-default-subscriptions.json` v repozitáři [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Kandidáti adresářů jsou uvedeni v souborech `seedit-directories/seedit-<code>-directory.json` ve stejném repozitáři. Chcete-li přidat svou komunitu do některého z těchto seznamů, odešlete pull request s podrobnostmi o své komunitě.

## Odkazy

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licence**: pouze GPL-2.0
