---
title: 5chan
description: Et serverløst, decentraliseret imageboard bygget på Bitsocial-protokollen, hvor alle kan oprette og eje boards.
sidebar_position: 1
---

:::warning[Ældre navngivning]
Dette projekts kodebase bruger stadig den gamle "plebbit"-navngivning fra før Bitsocial-ommærket. Pakkenavne, API-referencer og noget intern terminologi vil blive opdateret i en fremtidig udgivelse. Funktionaliteten beskrevet her er aktuel - kun navngivningen er forældet.
:::

# 5chan

5chan er et serverløst, adminløst og fuldt decentraliseret imageboard, der kører på Bitsocial-protokollen. Den følger den velkendte imageboard-mappestruktur, mens den introducerer decentralt ejerskab - alle kan oprette en bestyrelse, og flere boards kan konkurrere om den samme mappeplads gennem en afstemningsmekanisme.

## Downloads

| Platform | Forbindelse                           |
| -------- | ------------------------------------- |
| Web      | [5chan.app](https://5chan.app)        |
| Desktop  | Tilgængelig til Mac, Windows og Linux |
| Mobil    | Tilgængelig til Android               |

## Sådan fungerer boards

5chan organiserer indhold i tavler ved hjælp af et klassisk bibliotekslayout (f.eks. `/b/`, `/g/`). I modsætning til traditionelle imageboards, hvor en central administrator kontrollerer hvert board, giver 5chan enhver bruger mulighed for at oprette og fuldt ud eje deres eget board. Når flere boards målretter mod den samme mappeplads, konkurrerer de om denne position ved at stemme.

### Oprettelse af en tavle

For at oprette en ny tavle skal du køre `bitsocial-cli` som en peer-to-peer node. Dette sikrer, at dit board hostes på en decentral måde uden at være afhængig af nogen central server.

### Mappetildelinger

Directory slot tildelinger (hvilket board vises på hvilken sti) administreres i øjeblikket gennem GitHub pull-anmodninger til `5chan-directories.json` filen. Dette er en midlertidig proces — fremtidige udgivelser vil understøtte oprettelse af boards i appen og pubsub-baseret afstemning for at håndtere mappetildelinger automatisk.

## Internals

Under hætten bruger 5chan plebbit-js API-laget til sine protokolinteraktioner. Som nævnt i advarslen ovenfor, bærer disse interne referencer stadig ældre navngivning, der går forud for Bitsocial-omlægningen.

## Links

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **License.**0: GPL-only-2.
