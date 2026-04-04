---
title: Bygg en imageboard-klient
description: Fase 1-bidragsveiledning for byggherrer som ønsker å sende nye imageboard-opplevelser på Bitsocial.
sidebar_position: 1
---

# Bygg en imageboard-klient

Fase 1 handler ikke om én offisiell app som dekker hele kategorien. 5chan er det første beviset, men det faktiske målet er et bredt imageboard-økosystem: flere Bitsocial-klienter med forskjellige visuelle språk, moderasjonsstandarder, katalogmodeller og målfellesskap.

## Hva fase 1 trenger

- Kjente 4chan-stil klienter for mainstream onboarding
- Altchan-inspirerte kunder med ulike kulturer og brettpakker
- Mobile-first eller lav båndbredde-klienter
- Enkeltfellesskap eller nisjekunder med sterke oppfatninger av mislighold
- Bedre moderering, media, onboarding eller oppdagelsesflyt enn den første appen leveres med

## Raskeste måten å hjelpe på

Hvis du vil ha den korteste veien til frakt, bidra til 5chan direkte først:

- Utforsk live-appen på [5chan.app](https://5chan.app)
- Se gjennom kilden på [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Bli med i byggerchatten på [t.me/fivechandev](https://t.me/fivechandev)

## Bygg din egen klient

Hvis 5chan ikke samsvarer med fellesskapet eller grensesnittet du ønsker, bygg en egen klient i stedet. Kompatible Bitsocial-klienter kan dele det samme nettverket uten å dele de samme produktbeslutningene.

1. Lær de protokollvendte verktøyene:
   - [Bitsocial React kroker](../react-hooks/)
   - [Bitsosial CLI](../cli/)
2. Bestem hva slags bildetavle du faktisk bygger.
Velg styrestruktur, identitetsforutsetninger, moderasjonsmodell, oppdagelsesflyt og visuelt språk først.
3. Velg implementeringsveien som passer til prosjektet.
Fork 5chan hvis du vil bevege deg raskt med en kjent bildetavlebase. Start på nytt hvis brukergrensesnittet eller interaksjonsmodellen må være radikalt annerledes.
4. Send en smal førsteversjon.
En klient som tjener et virkelig fellesskap godt, er mer verdifull enn en vag klon som er ment å tilfredsstille alle.
5. Publiser resultatet og la fellesskap teste det.
Bitsocial forbedres når eksterne byggere sender meningsfulle kunder som konkurrerer på produktkvalitet i stedet for å vente på at én offisiell app skal gjøre alt.

## Designprinsipp

Bitsocial vinner ikke ved å ha én velsignet klient. Det vinner når mange kunder kan sameksistere, fordele seg, spesialisere seg og betjene behov som den første appen aldri vil.
