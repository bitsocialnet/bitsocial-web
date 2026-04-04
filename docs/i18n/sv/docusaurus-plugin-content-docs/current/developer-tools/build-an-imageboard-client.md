---
title: Bygg en imageboard-klient
description: Fas 1-bidragsguide för byggare som vill skicka nya imageboard-upplevelser på Bitsocial.
sidebar_position: 1
---

# Bygg en imageboard-klient

Fas 1 handlar inte om en officiell app som täcker hela kategorin. 5chan är den första bevispunkten, men det faktiska målet är ett brett imageboard-ekosystem: flera Bitsocial-klienter med olika visuella språk, modereringsstandarder, katalogmodeller och målgemenskaper.

## Vad Fas 1 behöver

- Bekanta klienter i 4chan-stil för vanliga onboarding
- Altchan-inspirerade kunder med olika kulturer och kartongpaket
- Mobile-first eller klienter med låg bandbredd
- Enskilda gemenskapskunder eller nischkunder med starka påstådda standarder
- Bättre moderering, media, onboarding eller upptäcktsflöden än den första appen levereras med

## Snabbaste sättet att hjälpa

Om du vill ha den kortaste vägen till frakt, bidra till 5chan direkt först:

- Utforska liveappen på [5chan.app](https://5chan.app)
- Granska källan på [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Gå med i byggarchatten på [t.me/fivechandev](https://t.me/fivechandev)

## Bygg din egen kund

Om 5chan inte matchar communityn eller gränssnittet du vill, bygg en separat klient istället. Kompatibla Bitsocial-klienter kan dela samma nätverk utan att dela samma produktbeslut.

1. Lär dig verktygen för protokollet:
   - [Bitsocial React krokar](../react-hooks/)
   - [Bitsocial CLI](../cli/)
2. Bestäm vilken typ av bildtavla du faktiskt bygger.
Välj först styrelsestruktur, identitetsantaganden, modereringsmodell, upptäcktsflöde och visuellt språk.
3. Välj den implementeringsväg som passar projektet.
Fork 5chan om du vill röra dig snabbt med en välbekant bildboardbas. Börja om på nytt om användargränssnittet eller interaktionsmodellen behöver vara radikalt annorlunda.
4. Skicka en smal första version.
En klient som tjänar en verklig gemenskap väl är mer värdefull än en vag klon som är avsedd att tillfredsställa alla.
5. Publicera resultatet och låt gemenskaper testa det.
Bitsocial förbättras när externa byggare skickar opinionsbildande kunder som konkurrerar om produktkvalitet istället för att vänta på att en officiell app ska göra allt.

## Designprincip

Bitsocial vinner inte på att ha en välsignad kund. Det vinner när många kunder kan samexistera, dela sig, specialisera sig och tillgodose behov som den första appen aldrig kommer att göra.
