---
title: Byg din egen Bitsocial-klient
description: Guide til udviklere, der vil udgive uafhængige Bitsocial-klienter, fra imageboards og fora til sociale nicheapps.
---

# Byg din egen Bitsocial-klient

Bitsocial vinder ikke ved at have én officiel app til hvert eneste formål. Det vinder, når mange
klienter kan dele den samme protokol, mens de konkurrerer på brugerflade, kultur, opdagelse,
standardindstillinger og forretningsmodel.

5chan og Seedit er tidlige bevisstykker, ikke et loft. En udvikler skal kunne udgive et nyt
imageboard, et forum, en profilklient, en mobil-først social app, et nicheværktøj til et fællesskab
eller en centraliseret klient med Bitsocial under motorhjelmen uden at spørge en platformsejer om
lov.

## Hvad udviklere kan ændre

En Bitsocial-klient kan konkurrere på produktbeslutninger uden at forgrene hele netværket:

- brugerflade og visuelt sprog
- onboarding-forløb
- standardindstillinger for fællesskaber
- modereringsflader
- opdagelsesmodel
- medieoplevelse
- begrænsninger på mobil, desktop eller lav båndbredde
- monetisering og forretningsmodel

Det fælles lag er protokollen. Produktlaget er åbent for konkurrence.

## Den hurtigste vej til at lære det

Start med de apps, der allerede findes:

- Prøv [5chan](https://5chan.app) til anonyme imageboard-fællesskaber.
- Prøv [Seedit](https://seedit.app) til diskussion i Reddit-stil.
- Læs dokumentationen om [Bitsocial React-hooks](https://hooks.bitsocial.net/docs/quickstart/) til integration på klientsiden.
- Læs dokumentationen om [Bitsocial CLI](/developer-tools/cli/) til drift af noder og fællesskaber.

Vil du hurtigt i gang, så bidrag først til en app, der allerede findes. Passer den brugerflade,
kultur eller fællesskabsmodel, du gerne vil have, ikke ind, så byg en selvstændig klient.

## Vælg en snæver første version

Den bedste første version er ikke en universel social app. Det er en klient med ét klart publikum og
én stærk grund til at eksistere.

Gode udgangspunkter er blandt andet:

- en renere imageboard-klient til én bestemt kultur
- en mobil-først forumklient
- en app til ét enkelt fællesskab med stramme standardindstillinger
- en klient til skaberfællesskaber
- en skrivebeskyttet klient til opdagelse
- en konsol til moderering eller drift
- en klient optimeret til et sprog, en region eller en enhedsklasse

Små klienter er nyttige, fordi Bitsocial lader dem vokse ind i det samme netværk i stedet for at
fange deres brugere i en privat database.

## Veje til implementering

Der er tre praktiske veje:

1. Forgren en eksisterende klient, når din idé ligger tæt på 5chan eller Seedit.
2. Byg en ny React-klient med [Bitsocial React-hooks](https://hooks.bitsocial.net/).
3. Byg din egen integration oven på node-API'er og offentlig RPC-infrastruktur.

Offentlig RPC bør gøre den tredje vej langt mere praktisk. En bruger kan starte hos en hostet
RPC-udbyder uden nøgleforvaring og senere skifte til selvhosting eller en konkurrerende udbyder.

## Designprincip

Byg den klient, der burde findes for dit fællesskab, og lad så kompatible klienter konkurrere i
fuld offentlighed.
