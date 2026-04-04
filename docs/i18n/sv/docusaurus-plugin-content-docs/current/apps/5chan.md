---
title: 5chan
description: Ett serverlöst, decentraliserat bildkort byggt på Bitsocial-protokollet där vem som helst kan skapa och äga kort.
sidebar_position: 1
---

:::warning[Äldre namngivning]
Detta projekts kodbas använder fortfarande det äldre "plebbit"-namnet från före Bitsocial-omvarumärket. Paketnamn, API-referenser och viss intern terminologi kommer att uppdateras i en framtida version. Funktionen som beskrivs här är aktuell — endast namngivningen är föråldrad.
:::

# 5chan

5chan är ett serverlöst, adminlöst och helt decentraliserat bildkort som körs på Bitsocial-protokollet. Den följer den välbekanta imageboard-katalogstrukturen samtidigt som den introducerar decentraliserat ägande - vem som helst kan skapa en styrelse, och flera styrelser kan tävla om samma katalogplats genom en omröstningsmekanism.

## Nedladdningar

| Plattform | Länk                                   |
| --------- | -------------------------------------- |
| Webb      | [5chan.app](https://5chan.app)         |
| Desktop   | Tillgänglig för Mac, Windows och Linux |
| Mobil     | Tillgänglig för Android                |

## Hur styrelser fungerar

5chan organiserar innehåll i anslagstavlor med en klassisk kataloglayout (t.ex. `/b/`, `/g/`). Till skillnad från traditionella imageboards där en central administratör kontrollerar varje board, tillåter 5chan alla användare att skapa och helt äga sin egen board. När flera styrelser riktar sig mot samma katalogplats, konkurrerar de om den positionen genom att rösta.

### Att skapa en tavla

För att skapa ett nytt kort måste du köra `bitsocial-cli` som en peer-to-peer-nod. Detta säkerställer att ditt kort är värd på ett decentraliserat sätt utan att förlita sig på någon central server.

### Kataloguppdrag

Katalogplatstilldelningar (vilket kort visas på vilken sökväg) hanteras för närvarande genom GitHub pull-förfrågningar till `5chan-directories.json`-filen. Detta är en tillfällig process – framtida utgåvor kommer att stödja skapande av tavlor i appar och pubsub-baserad röstning för att hantera katalogtilldelningar automatiskt.

## Interner

Under huven använder 5chan plebbit-js API-lagret för sina protokollinteraktioner. Som noterats i varningen ovan har dessa interna referenser fortfarande äldre namn som går före Bitsocial-omvarumärket.

## Länkar

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licens**: Endast GPL-2.0
