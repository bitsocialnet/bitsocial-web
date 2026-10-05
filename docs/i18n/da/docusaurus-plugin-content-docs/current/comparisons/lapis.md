---
title: Bitsocial og Lapis Net
description: Hvordan Lapis Net, en peer-to-peer social protokol skrevet i Kotlin med tillidsscorer pr. læser og Bitcoin-understøttet synlighed, adskiller sig fra Bitsocial.
---

# Bitsocial og Lapis Net

[Lapis Net](https://net.lapisproject.dev/) er en protokol til et socialt peer-to-peer-netværk,
skrevet i Kotlin til JVM'en. Den er uafhængigt nået frem til fundamenter, der ligger tæt på
Bitsocials: nøgleparbaserede identiteter, indholdslagring i IPFS-stil og libp2p gossipsub. De to
adskiller sig i, hvor de placerer spamfiltrering og kuratering. Lapis giver hver læser en personlig
tillidsgraf og lader Bitcoin- og Lightning-betalinger øge synligheden; Bitsocial lader hvert
fællesskab bestemme, hvad der må publiceres.

Lapis er en fungerende prototype. I oktober 2026 havde den endnu intet offentligt netværk, og at
forbinde to noder var et manuelt trin, ifølge projektets
[repository](https://github.com/lapisproject-dev/Lapis-Net).

## Sådan fungerer Lapis

- **Identiteter.** Hver identitet er et secp256k1-nøglepar, kompatibelt med Bitcoin-nøgler, med en
  tilknyttet Ed25519-nøgle til libp2p-peer-id'et.
- **Lagring og udbredelse.** Indhold lagres med Nabu, en IPFS-implementering på libp2p (DHT og
  Bitswap), og spredes med libp2p gossipsub.
- **Scoring.** Fire valgfrie scorer ligger oven på en kerne, der forholder sig neutralt til
  kuratering:
  - Veritas, et tillidsnetværk beregnet ud fra hver læsers egen tillidsgraf
  - Virtus, synlighed understøttet af onchain- eller Lightning-betalingsbeviser, der aftager over tid
  - Karma, gratis likes vægtet efter Veritas
  - Madli, en omdømmescore, som noder fører over hinandens adfærd
- **Beskeder.** End-to-end-krypterede direkte beskeder, taleopkald mellem to personer og et
  asynkront beskedsystem, der minder om e-mail, er en del af projektet.
- **Klienter.** Hver bruger kører en JVM-node. Referenceklienten er en webgrænseflade, som den
  lokale node leverer.

## Hvor de adskiller sig

### Hvem filtrerer spam

Lapis filtrerer hos læseren. Indholdet spredes, og derefter afgør hver læsers tillidsgraf og
betalingsreglerne i den app, læseren bruger, hvad der kommer frem. Bitsocial filtrerer i
fællesskabet: et indlæg skal bestå fællesskabets udfordring, før fællesskabsnoden accepterer det, så
afvist spam bliver aldrig en del af fællesskabet. Se
[Brugerdefinerede anti-spam-udfordringer](/custom-challenges/).

### Hvem har magten

I Lapis bestemmer hver læser, hvem de stoler på, og operatøren af hver app bestemmer, hvordan betalt
synlighed fungerer der. I Bitsocial fastsætter en fællesskabsejer reglerne for netop det ene
fællesskab, og apps vælger, hvad de viser. Ingen af dem har en administrator på protokolniveau.

### Økonomi

Lapis bygger Bitcoin- og Lightning-betalingsbeviser ind i sin synlighedsscore. Bitsocial har intet
betalingslag i protokollen; et fællesskab kan kræve en betaling eller en token via sin udfordring.

### Browser

Bitsocial-apps kan køre en peer-to-peer-node i en almindelig browserfane. Se
[Peer-to-peer i browseren](/browser-p2p/). Lapis' browsergrænseflade er en lokal side, som brugerens
JVM-node leverer.

### Omfang

Lapis samler direkte beskeder, taleopkald og mail. Bitsocial fokuserer på offentlige fællesskaber og
har endnu ingen indbyggede direkte beskeder.

## Sammenligning

| Spørgsmål           | Lapis Net                                                                     | Bitsocial                                                                    |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Kategori            | Social peer-to-peer-protokol (prototype)                                      | Peer-to-peer-fællesskabsnetværk                                              |
| Identitet           | secp256k1-nøglepar med et tilknyttet Ed25519-peer-id                          | Ed25519-nøglepar til brugere og fællesskaber                                 |
| Hvor indlæg ligger  | Nabu-lagring (IPFS på libp2p) på deltagende noder                             | Fællesskabsejerens node og de peers, der læser og seeder det                 |
| Fællesskaber        | Intet fællesskabsobjekt; kuratering sker pr. læser og pr. app                 | Førsteklasses objekter, hvis node accepterer eller afviser indlæg            |
| Spamkontrol         | Læserens tillidsgraf, betalt synlighed, Lightning-indskud for første beskeder | Hvert fællesskabs udfordring, før et indlæg accepteres                       |
| Moderering          | Hver læsers tillidsgraf; appoperatører fastsætter regler for betalt synlighed | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser |
| Økonomi             | Bitcoin- og Lightning-betalingsbeviser i scoringen                            | Ingen i protokollen; en udfordring kan kræve en betaling eller en token      |
| Browser             | Lokal webgrænseflade leveret af en JVM-node                                   | Peer-to-peer-node i en almindelig browserfane                                |
| Netværk             | Prototype uden offentligt netværk                                             | Live netværk med apps som [5chan](/apps/5chan/) og [Seedit](/apps/seedit/)   |
| Vigtigste afvejning | Rigt indbygget omdømme og beskeder, men endnu intet offentligt netværk        | Mindre kerne, der kører i browsere, men intet indbygget omdømme eller DM'er  |

## Kunne de arbejde sammen?

Bitsocial-udfordringer kan være vilkårlig kode, så en tillidsscore i Lapis-stil kunne blive én af
dem. Den indbyggede `whitelist`-udfordring kan allerede læse lister over tilladte adresser fra
URL'er. En tjeneste, der publicerede de Bitsocial-adresser, som en Veritas-graf stoler på, kunne
lade de forfattere springe en CAPTCHA over i et fællesskab. Det ville kræve en måde at knytte en
Lapis-identitet til en Bitsocial-adresse, og intet af den slags findes i dag.
