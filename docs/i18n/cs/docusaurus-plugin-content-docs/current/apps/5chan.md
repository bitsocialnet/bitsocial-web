---
title: 5kanál
description: Decentralizovaný imageboard bez serveru postavený na protokolu Bitsocial, kde může kdokoli vytvářet a vlastnit desky.
sidebar_position: 1
---

# 5kanál

5chan je bezserverový, administrátorský a plně decentralizovaný imageboard, který běží na protokolu Bitsocial. Řídí se známou adresářovou strukturou imageboard a zároveň zavádí decentralizované vlastnictví – kdokoli může vytvořit desku a několik desek může soutěžit o stejný adresářový slot prostřednictvím mechanismu hlasování.

## Stahování

| Platforma | Odkaz                                |
| --------- | ------------------------------------ |
| Web       | [5chan.app](https://5chan.app)       |
| Desktop   | K dispozici pro Mac, Windows a Linux |
| Mobil     | K dispozici pro Android              |

## Jak desky fungují

5chan organizuje obsah do nástěnek pomocí klasického rozložení adresářů (např. `/b/`, `/g/`). Na rozdíl od tradičních imageboardů, kde centrální admin řídí každou desku, 5chan umožňuje každému uživateli vytvořit a plně vlastnit svou vlastní desku. Když se na stejný adresářový slot zaměřuje více desek, soutěží o tuto pozici prostřednictvím hlasování.

### Vytvoření desky

Chcete-li vytvořit novou desku, musíte spustit `bitsocial-cli` jako uzel typu peer-to-peer. To zajišťuje, že vaše deska je hostována decentralizovaným způsobem, aniž by se spoléhala na jakýkoli centrální server.

### Přiřazení adresáře

Přiřazení adresářových slotů (která deska se na které cestě objeví) se aktuálně spravují prostřednictvím požadavků GitHub na vyžádání do souboru `5chan-directories.json`. Toto je dočasný proces – budoucí vydání budou podporovat vytváření nástěnek v aplikaci a hlasování na základě pubsub, aby se automaticky zpracovávalo přiřazení adresářů.

## Vnitřnosti

Pod kapotou 5chan používá sdílenou vrstvu klienta protokolu Bitsocial pro své síťové interakce. Webová aplikace na 5chan.app může také spouštět uzel Helia v prohlížeči, když je v prohlížeči povoleno P2P z pokročilých nastavení, takže čtenáři mohou načítat od kolegů bez centralizované brány IPFS. Viz část P2P prohlížeče v poznámkách k protokolu peer-to-peer.

## Odkazy

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licence**: pouze GPL-2.0
