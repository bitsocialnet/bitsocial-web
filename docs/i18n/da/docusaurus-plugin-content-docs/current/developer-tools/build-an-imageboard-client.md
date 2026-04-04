---
title: Byg en imageboard-klient
description: Fase 1-bidragsvejledning til bygherrer, der ønsker at sende nye imageboard-oplevelser på Bitsocial.
sidebar_position: 1
---

# Byg en imageboard-klient

Fase 1 handler ikke om én officiel app, der dækker hele kategorien. 5chan er det første bevispunkt, men det faktiske mål er et bredt imageboard-økosystem: flere Bitsocial-klienter med forskellige visuelle sprog, modereringsstandarder, katalogmodeller og målfællesskaber.

## Hvad fase 1 har brug for

- Kendte klienter i 4chan-stil til mainstream onboarding
- Altchan-inspirerede kunder med forskellige kulturer og board bundter
- Mobile-first eller lav-båndbredde-klienter
- Enkeltsamfunds- eller nichekunder med stærke holdningsmæssige standarder
- Bedre moderering, medier, onboarding eller opdagelsesflow end den første app leveres med

## Hurtigste måde at hjælpe på

Hvis du vil have den korteste vej til forsendelse, skal du først bidrage til 5chan direkte:

- Udforsk live-appen på [5chan.app](https://5chan.app)
- Gennemgå kilden på [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Deltag i builder-chatten på [t.me/fivechandev](https://t.me/fivechandev)

## Byg din egen klient

Hvis 5chan ikke matcher det fællesskab eller den grænseflade, du ønsker, skal du i stedet bygge en separat klient. Kompatible Bitsocial-klienter kan dele det samme netværk uden at dele de samme produktbeslutninger.

1. Lær de protokolvendte værktøjer:
   - [Bitsocial React kroge](../react-hooks/)
   - [Bitsocial CLI](../cli/)
2. Bestem, hvilken slags imageboard du rent faktisk bygger.
Vælg bestyrelsens struktur, identitetsantagelser, modereringsmodel, opdagelsesflow og visuelt sprog først.
3. Vælg den implementeringsvej, der passer til projektet.
Fork 5chan, hvis du vil bevæge dig hurtigt med en velkendt imageboard-base. Start på en frisk, hvis brugergrænsefladen eller interaktionsmodellen skal være radikalt anderledes.
4. Send en smal første version.
En klient, der tjener et rigtigt samfund godt, er mere værdifuld end en vag klon beregnet til at tilfredsstille alle.
5. Publicer resultatet, og lad fællesskaber teste det.
Bitsocial forbedres, når eksterne bygherrer sender meningsfulde kunder, der konkurrerer på produktkvalitet i stedet for at vente på, at én officiel app gør alt.

## Designprincip

Bitsocial vinder ikke ved at have én velsignet klient. Det vinder, når mange kunder kan sameksistere, fordele sig, specialisere sig og betjene behov, som den første app aldrig vil.
