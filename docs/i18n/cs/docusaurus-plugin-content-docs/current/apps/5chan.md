---
title: 5chan
description: Decentralizovaný imageboard bez serveru postavený na protokolu Bitsocial, kde může kdokoli vytvářet a vlastnit desky.
sidebar_position: 1
---

:::warning[Starší pojmenování]
Kódová základna tohoto projektu stále používá starší pojmenování „plebbit“ z doby před přejmenováním Bitsocial. Názvy balíčků, odkazy na API a některá interní terminologie budou aktualizovány v budoucí verzi. Zde popsaná funkčnost je aktuální — pouze pojmenování je zastaralé.
:::

# 5chan

5chan je bezserverový, bezadministrátorský a plně decentralizovaný imageboard, který běží na protokolu Bitsocial. Řídí se známou adresářovou strukturou imageboard a zavádí decentralizované vlastnictví – kdokoli může vytvořit nástěnku a více nástěnek může soutěžit o stejný adresářový slot prostřednictvím mechanismu hlasování.

## Stahování

| Platforma | Odkaz                                |
| --------- | ------------------------------------ |
| Web       | [5chan.app](https://5chan.app)       |
| Desktop   | K dispozici pro Mac, Windows a Linux |
| Mobilní   | K dispozici pro Android              |

## Jak nástěnky fungují

5chan organizuje obsah do nástěnek pomocí klasického rozložení adresářů (např. `/b/`, `/g/`). Na rozdíl od tradičních imageboardů, kde centrální admin řídí každou desku, 5chan umožňuje každému uživateli vytvořit a plně vlastnit svou vlastní desku. Když se na stejný adresářový slot zaměřuje více desek, soutěží o tuto pozici prostřednictvím hlasování.

### Vytvoření nástěnky

Chcete-li vytvořit novou nástěnku, musíte spustit `bitsocial-cli` jako uzel peer-to-peer. To zajišťuje, že vaše deska je hostována decentralizovaným způsobem, aniž by se spoléhala na jakýkoli centrální server.

### Přiřazení adresářů

Přiřazení adresářových slotů (která deska se objeví na které cestě) jsou aktuálně spravována prostřednictvím požadavků GitHub na stažení do souboru `5chan-directories.json`. Toto je dočasný proces – budoucí verze budou podporovat vytváření nástěnek v aplikaci a hlasování na základě pubsub, aby se automaticky zpracovávalo přiřazení adresářů.

## Internals

Pod pokličkou 5chan používá pro své protokolové interakce vrstvu API plebbit-js. Jak je uvedeno ve výše uvedeném varování, tyto interní odkazy stále nesou starší názvy, které předcházejí rebrandu Bitsocial.

## Odkazy

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licence**: GPL-2.0-only
