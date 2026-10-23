---
title: Bygg din egen Bitsocial-klient
description: Utviklerguide for å lansere uavhengige Bitsocial-klienter, fra bildetavler og forumer til sosiale nisjeapper.
---

# Bygg din egen Bitsocial-klient

Bitsocial vinner ikke ved å ha én offisiell app for hvert bruksområde. Bitsocial vinner når mange
klienter kan dele den samme protokollen samtidig som de konkurrerer på grensesnitt, kultur,
oppdagelse, standardvalg og forretningsmodell.

5chan og Seedit er tidlige bevis på at det fungerer, ikke et tak. En utvikler skal kunne lansere en
ny bildetavle, et forum, en profilklient, en mobil-først sosial app, et nisjeverktøy for fellesskap
eller en sentralisert klient som bruker Bitsocial under panseret, uten å be en plattformeier om
tillatelse.

## Hva utviklere kan endre

En Bitsocial-klient kan konkurrere på produktvalg uten å forke hele nettverket:

- grensesnitt og visuelt språk
- onboarding-flyt
- standardinnstillinger for fellesskap
- modereringsflater
- oppdagelsesmodell
- medieopplevelse
- begrensninger knyttet til mobil, desktop eller lav båndbredde
- inntektsgenerering og forretningsmodell

Det felles laget er protokollen. Produktlaget er åpent for konkurranse.

## Raskeste vei til å lære

Start med appene som allerede finnes:

- Prøv [5chan](https://5chan.app) for anonyme bildetavlefellesskap.
- Prøv [Seedit](https://seedit.app) for diskusjon i Reddit-stil.
- Les dokumentasjonen for [Bitsocial React hooks](https://hooks.bitsocial.net/docs/quickstart/) for integrasjon på
  klientsiden.
- Les dokumentasjonen for [Bitsocial CLI](/developer-tools/cli/) for node- og
  fellesskapsoperasjoner.

Vil du komme raskt i gang, bidra først til en app som allerede finnes. Hvis grensesnittet, kulturen
eller fellesskapsmodellen du ønsker deg ikke passer der, bygg en egen klient.

## Velg en smal første versjon

Den beste førsteversjonen er ikke en universell sosial app. Det er en klient med ett tydelig
publikum og én sterk grunn til å eksistere.

Gode utgangspunkter er blant annet:

- en renere bildetavleklient for én bestemt kultur
- en forumklient laget for mobil først
- en app for ett enkelt fellesskap med strenge standardinnstillinger
- en klient for skaperfellesskap
- en klient kun for lesing og oppdagelse
- en modererings- eller operatørkonsoll
- en klient tilpasset et språk, en region eller en enhetsklasse

Små klienter er nyttige fordi Bitsocial lar dem vokse inn i det samme nettverket i stedet for å låse
brukerne inne i en privat database.

## Implementeringsveier

Det finnes tre praktiske veier:

1. Fork en eksisterende klient når ideen din ligger tett opp til 5chan eller Seedit.
2. Bygg en ny React-klient med [Bitsocial React hooks](https://hooks.bitsocial.net/).
3. Bygg din egen integrasjon oppå node-API-er og offentlig RPC-infrastruktur.

Offentlig RPC skal gjøre den tredje veien mye mer praktisk. En bruker kan starte hos en driftet,
ikke-forvaltende RPC-leverandør og senere flytte til egen drift eller en konkurrerende leverandør.

## Designprinsipp

Bygg klienten som burde finnes for ditt fellesskap, og la deretter kompatible klienter konkurrere i
det åpne.
