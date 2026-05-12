---
title: 5 chan
description: Et serverløst, decentraliseret imageboard bygget på Bitsocial-protokollen, hvor alle kan oprette og eje boards.
sidebar_position: 1
---

# 5 chan

5chan er et serverløst, adminløst og fuldt decentraliseret imageboard, der kører på Bitsocial-protokollen. Den følger den velkendte imageboard-biblioteksstruktur, mens den introducerer decentraliseret ejerskab - alle kan oprette en bestyrelse, og flere bestyrelser kan konkurrere om den samme mappeplads gennem en afstemningsmekanisme.

## Downloads

| Platform | Link                                  |
| -------- | ------------------------------------- |
| Web      | [5chan.app](https://5chan.app)        |
| Desktop  | Tilgængelig til Mac, Windows og Linux |
| Mobil    | Tilgængelig til Android               |

## Hvordan tavler fungerer

5chan organiserer indhold i tavler ved hjælp af et klassisk bibliotekslayout (f.eks. `/b/`, `/g/`). I modsætning til traditionelle imageboards, hvor en central administrator kontrollerer hvert board, giver 5chan enhver bruger mulighed for at oprette og fuldt ud eje deres eget board. Når flere boards målretter mod den samme mappeplads, konkurrerer de om denne position ved at stemme.

### Oprettelse af en tavle

For at oprette en ny tavle skal du køre `bitsocial-cli` som en peer-to-peer node. Dette sikrer, at dit board hostes på en decentral måde uden at være afhængig af nogen central server.

### Directory opgaver

Katalogslottildelinger (hvilket bord vises på hvilken sti) administreres i øjeblikket gennem GitHub pull-anmodninger til `5chan-directories.json`-filen. Dette er en midlertidig proces - fremtidige udgivelser vil understøtte oprettelse af tavler i appen og pubsub-baseret afstemning for at håndtere mappetildelinger automatisk.

## Internaler

Under hætten bruger 5chan det delte Bitsocial-protokol-klientlag til sine netværksinteraktioner. Webappen på 5chan.app kan også køre en Helia-node i browseren, når browseren P2P er aktiveret fra Avancerede indstillinger, så læsere kan indlæse fra peers uden en centraliseret IPFS-gateway. Se browserens P2P-sektion i peer-to-peer-protokollen.

## Links

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licens**: Kun GPL-2.0
