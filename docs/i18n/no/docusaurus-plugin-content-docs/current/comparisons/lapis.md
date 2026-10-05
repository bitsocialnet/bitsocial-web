---
title: Bitsocial og Lapis Net
description: Hvordan Lapis Net, en sosial peer-to-peer-protokoll i Kotlin med tillitspoeng per seer og synlighet støttet av Bitcoin, står seg mot Bitsocial.
---

# Bitsocial og Lapis Net

[Lapis Net](https://net.lapisproject.dev/) er en peer-to-peer-protokoll for sosiale nettverk, skrevet
i Kotlin for JVM. Den kom uavhengig frem til et grunnlag som ligger nær Bitsocials: identiteter
basert på nøkkelpar, innholdslagring i IPFS-stil og libp2p-gossipsub. De to skiller seg i hvor de
plasserer spamfiltrering og kuratering. Lapis gir hver seer en personlig tillitsgraf og lar Bitcoin-
og Lightning-betalinger øke synligheten; Bitsocial lar hvert fellesskap bestemme hva som kan
publiseres.

Lapis er en fungerende prototype. I oktober 2026 hadde den ennå ikke noe offentlig nettverk, og å
koble sammen to noder var et manuelt steg, ifølge
[repositoriet](https://github.com/lapisproject-dev/Lapis-Net).

## Hvordan Lapis fungerer

- **Identiteter.** Hver identitet er et secp256k1-nøkkelpar, kompatibelt med Bitcoin-nøkler, med en
  Ed25519-nøkkel knyttet til seg for libp2p-peer-ID-en.
- **Lagring og spredning.** Innhold lagres med Nabu, en IPFS-implementasjon på libp2p (DHT og
  Bitswap), og spres med libp2p-gossipsub.
- **Poeng.** Fire valgfrie poengsystemer ligger oppå en kjerne som forholder seg nøytral til
  kuratering:
  - Veritas, et tillitsnett (web of trust) beregnet fra hver seers egen tillitsgraf
  - Virtus, synlighet støttet av betalingsbevis på kjeden eller via Lightning som svekkes over tid
  - Karma, gratis likes vektet etter Veritas
  - Madli, et omdømmepoeng som noder holder om hverandres oppførsel
- **Meldinger.** Ende-til-ende-krypterte direktemeldinger, taleanrop en-til-en og et asynkront
  meldingssystem som ligner e-post, er en del av prosjektet.
- **Klienter.** Hver bruker kjører en JVM-node. Referanseklienten er et webgrensesnitt som serveres
  av den lokale noden.

## Hvor de skiller seg

### Hvem som filtrerer spam

Lapis filtrerer hos seeren. Innholdet spres, og deretter avgjør hver seers tillitsgraf og
betalingsreglene i appen vedkommende bruker, hva som kommer til overflaten. Bitsocial filtrerer i
fellesskapet: et innlegg må bestå fellesskapets utfordring før fellesskapsnoden godtar det, så
avvist spam blir aldri en del av fellesskapet. Se
[Tilpassede utfordringer mot spam](/custom-challenges/).

### Hvem som har makten

I Lapis bestemmer hver seer hvem de stoler på, og operatøren av hver app bestemmer hvordan betalt
synlighet fungerer der. I Bitsocial setter en fellesskapseier reglene for akkurat det fellesskapet,
og apper velger hva de viser. Ingen av dem har en administrator på protokollnivå.

### Økonomi

Lapis bygger Bitcoin- og Lightning-betalingsbevis inn i synlighetspoengene sine. Bitsocial har ikke
noe betalingslag i protokollen; et fellesskap kan kreve en betaling eller et token gjennom
utfordringen sin.

### Nettleser

Bitsocial-apper kan kjøre en peer-to-peer-node i en vanlig nettleserfane. Se
[Peer-to-peer i nettleseren](/browser-p2p/). Lapis' nettlesergrensesnitt er en lokal side som
serveres av brukerens JVM-node.

### Omfang

Lapis samler direktemeldinger, taleanrop og e-post. Bitsocial fokuserer på offentlige fellesskap og
har ennå ingen innebygde direktemeldinger.

## Sammenligning

| Spørsmål               | Lapis Net                                                                      | Bitsocial                                                                               |
| ---------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Kategori               | Sosial peer-to-peer-protokoll (prototype)                                      | Peer-to-peer-nettverk av fellesskap                                                     |
| Identitet              | secp256k1-nøkkelpar med en tilknyttet Ed25519-peer-ID                          | Ed25519-nøkkelpar for brukere og fellesskap                                             |
| Hvor innleggene ligger | Nabu-lagring (IPFS på libp2p) på deltakende noder                              | Noden til fellesskapets eier og peerne som leser og seeder det                          |
| Fellesskap             | Ikke noe fellesskapsobjekt; kuratering skjer per seer og per app               | Førsteklasses objekter der noden godtar eller avviser innlegg                           |
| Spamkontroll           | Seerens tillitsgraf, betalt synlighet, Lightning-innskudd for første meldinger | Hvert fellesskaps utfordring før et innlegg godtas                                      |
| Moderering             | Hver seers tillitsgraf; appoperatører setter reglene for betalt synlighet      | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser                   |
| Økonomi                | Bitcoin- og Lightning-betalingsbevis i poengberegningen                        | Ingen i protokollen; en utfordring kan kreve en betaling eller et token                 |
| Nettleser              | Lokalt webgrensesnitt servert av en JVM-node                                   | Peer-to-peer-node i en vanlig nettleserfane                                             |
| Nettverk               | Prototype uten offentlig nettverk                                              | Nettverk i drift med apper som [5chan](/apps/5chan/) og [Seedit](/apps/seedit/)         |
| Viktigste avveining    | Rikt innebygd omdømme og meldinger, men ennå ikke noe offentlig nettverk       | Mindre kjerne som kjører i nettlesere, men uten innebygd omdømme eller direktemeldinger |

## Kan de fungere sammen?

Bitsocial-utfordringer er vilkårlig kode, så et tillitspoeng i Lapis-stil kunne blitt en av dem. Den
innebygde utfordringen `whitelist` kan allerede lese lister over tillatte adresser fra URL-er. En
tjeneste som publiserte Bitsocial-adressene en Veritas-graf stoler på, kunne latt disse forfatterne
hoppe over en CAPTCHA i et fellesskap. Det ville kreve en måte å koble en Lapis-identitet til en
Bitsocial-adresse på, og noe slikt finnes ikke i dag.
