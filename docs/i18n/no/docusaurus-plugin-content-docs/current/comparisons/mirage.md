---
title: Bitsocial og Mirage
description: Hvordan Mirage, et forum i Reddit-stil på sin egen Cosmos SDK-blokkjede, står seg mot Bitsocial og Bitsocials Reddit-lignende app Seedit.
---

# Bitsocial og Mirage

[Mirage](https://mirage.foundation/) er et diskusjonsnettverk i Reddit-stil med fellesskap, trådede
innlegg og stemmer. I stedet for en bedriftsdatabase kjører det på sin egen blokkjede, en Cosmos
SDK-kjede med CometBFT-konsensus. Bitsocials nærmeste produkt er [Seedit](/apps/seedit/), en app i
Reddit-stil på Bitsocial-nettverket, så sammenligningen handler mest om hvordan hver av dem er vert
for, eier og modererer fellesskap.

## Hvordan Mirage fungerer

- **Noder.** En Mirage-node er én Docker-container med en validator, en PostgreSQL-database, en
  indekserer, et HTTP-API og webgrensesnittet. Hver node er også en validator. For å kjøre en trengs
  en Ubuntu-server på amd64 og 10 000 000 MIRAGE-tokens på operatørens konto, ifølge
  [utrullingsguiden](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Publisering.** Nettleseren signerer hver handling med brukerens secp256k1-nøkkel, og
  gratisbrukere beregner i tillegg en liten proof-of-work. Noden pakker handlingen inn i en
  kjedetransaksjon og betaler gebyret.
- **Lesing.** Hver nodes indekserer kopierer kjededata inn i sin egen database og serverer feeder
  over et HTTP-API. Noder beholder omtrent en uke med blokker, så den langsiktige innleggshistorikken
  ligger i hver nodes database, og en ny node starter uten historikken fra før synkroniseringspunktet
  sitt.
- **Kontoer.** En konto er en nøkkel avledet fra en gjenopprettingsfrase på 12 ord, og den samme
  frasen fungerer på alle noder. Brukernavn registreres på kjeden og er unike i hele nettverket.
- **Fellesskap.** Hvert gyldig navn er allerede et fellesskap, og ingen eier det. Betalte
  kuratorteam på opptil ti brukere vedlikeholder hver sin modererte visning av et fellesskap; leserne
  velger et teams visning, nodens standardvisning eller en usensurert visning. Se
  [Mirage-FAQ](https://mirage.talk/faq).
- **Token.** MIRAGE-tokenet betaler for abonnementer, belønner forfattere og noder og gir validatorer
  stemmevekt i styringen. Abonnenter slipper proof-of-work og får høyere grenser.

## Hvor de skiller seg

### Hvem som eier et fellesskap

I Seedit har skaperen av et fellesskap nøkkelparet, kjører eller delegerer noden og modererer
fellesskapet. I Mirage eier ingen et fellesskap: konkurrerende kuratorteam tilbyr modererte visninger
av det samme navnet, og standardvisningen er den til teamet som flest betalende abonnenter har valgt.

### Spamkontroll

Mirage bruker én regel for hele nettverket: gratisbrukere betaler med proof-of-work der
vanskelighetsgraden tilpasses innkommende volum, og abonnenter slipper den. I Bitsocial velger hvert
fellesskap sin egen utfordring, fra captchaer til tillatelseslister til betalinger. Se
[Tilpassede utfordringer mot spam](/custom-challenges/).

### Infrastruktur

Mirage trenger en blokkjede. Validatorer oppnår konsensus om hver handling, og hver node kjører en
full serverstakk og må holde en stor stake i tokens. Bitsocial har ingen kjede: en fellesskapsnode
kjører på forbrukermaskinvare fra skrivebordsappen eller `bitsocial-cli`, og lesere kan hjelpe til
med å dele innhold.

### Kontroll over hele nettverket

Mirage har styring på kjeden, vektet etter validatorenes stake. Styringen kan endre
vanskelighetsgrad, priser og utstedelse av tokens, prege eller brenne tokens og utnevne
administratorer hvis slettinger referanseindekseren anvender på ethvert innlegg. Kjedekoden lar også
styringen
[slette kontoer](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
og
[sende tokens fra hvilken som helst adresse](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
I oktober 2026 produserte fire validatorer kjedens blokker, og prosjektets egne driftshåndbøker
styrte alle fire.

Bitsocial har ingen administrator på protokollnivå. Fellesskapseiere modererer sine egne fellesskap,
og apper velger hva de viser. Se [Lokal moderering, ikke globale forbud](/local-moderation/).

### Nettleser

Mirages webklient er en HTTP-klient for en node: nettleseren signerer handlinger, men blir ikke med i
et peer-to-peer-nettverk. Bitsocial-apper kan kjøre en peer-to-peer-node i nettleserfanen. Se
[Peer-to-peer i nettleseren](/browser-p2p/).

## Sammenligning

| Spørsmål                     | Mirage                                                                                                           | Bitsocial                                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Kategori                     | Forum på egen blokkjede (Cosmos SDK)                                                                             | Peer-to-peer-nettverk av fellesskap                                                                             |
| Identitet                    | secp256k1-nøkkel fra en frase på 12 ord, med et brukernavn på kjeden                                             | Ed25519-nøkkelpar for brukere og fellesskap                                                                     |
| Hvor innleggene ligger       | Kjedetransaksjoner, deretter hver nodes PostgreSQL-database                                                      | Noden til fellesskapets eier og peerne som leser og seeder det                                                  |
| Hvem holder det tilgjengelig | Validatornoder som hver holder 10 000 000 MIRAGE                                                                 | Noden til fellesskapets eier pluss seedere som hjelper til                                                      |
| Fellesskap                   | Navn uten eier, med konkurrerende betalte kuratorteam                                                            | Eid av et nøkkelpar; eierens node godtar eller avviser innlegg                                                  |
| Spamkontroll                 | Proof-of-work for hele nettverket; abonnenter slipper den                                                        | Hvert fellesskaps utfordring før et innlegg godtas                                                              |
| Moderering                   | Visninger fra kuratorteam, personlige filtre, administratorer utnevnt av styringen                               | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser                                           |
| Økonomi                      | MIRAGE-token for abonnementer, belønninger og validatorstake                                                     | Ingen i protokollen; en utfordring kan kreve en betaling eller et token                                         |
| Nettleser                    | HTTP-klient for en node                                                                                          | Peer-to-peer-node i en vanlig nettleserfane                                                                     |
| Viktigste avveining          | Én felles, ordnet tilstand og enkel registrering, men et lite validatorsett og styringsmakt over hele nettverket | Ingen kjede eller stake nødvendig, men ingen global rekkefølge, og gammelt innhold er ikke garantert for alltid |
