---
title: Bitsocial og Reticulum
description: Hvordan Reticulum, den kryptografiske nettverksstakken for LoRa og andre forbindelser med lav båndbredde, står seg mot Bitsocial, og om Bitsocial kunne kjørt over den.
---

# Bitsocial og Reticulum

[Reticulum](https://reticulum.network/) er en kryptografibasert nettverksstakk for å bygge nettverk
over de bærerne som er tilgjengelige: LoRa-radioer, pakkeradio, serielle forbindelser, Wi-Fi,
Ethernet, TCP, UDP eller I2P. Den nevnes ofte sammen med Bitsocial fordi begge fjerner selskapet i
midten. De gjør det på forskjellige lag, så de utfyller hverandre i stedet for å konkurrere.

## Forskjellige lag

Reticulum erstatter nettverkslaget. Den gir applikasjoner krypterte, rutbare endepunkter uten
IP-adresser, DNS, sertifikatutstedere eller kontoer, og er laget for å fortsette å virke på
forbindelser helt ned i 5 bit per sekund med en MTU på 500 byte. Den definerer ikke innlegg,
fellesskap eller moderering; applikasjoner som bygges oppå den, legger til dette.

Bitsocial er en sosial protokoll. Den kjører på IPFS/libp2p-stakken over vanlige
internettforbindelser, også fra en nettleserfane, og definerer fellesskap, publikasjoner og
anti-spam-utfordringer per fellesskap. Se [Peer-to-Peer-protokoll](/peer-to-peer-protocol/) og
[Peer-to-peer i nettleseren](/browser-p2p/).

I Bitsocials stakk ville Reticulum ligget omtrent der libp2p ligger, ikke der Bitsocial-protokollen
ligger.

## Hvordan Reticulum fungerer

- **Identiteter.** En Reticulum-identitet er et nøkkelsett på 512 bit: en X25519-nøkkel for
  kryptering og en Ed25519-nøkkel for signaturer.
- **Destinasjoner.** Applikasjoner oppretter destinasjoner, adressert med en SHA-256-hash avkortet
  til 16 byte. Pakker har ingen kildeadresse.
- **Announces.** En destinasjon blir nåbar ved å sende en announce (kunngjøring). Transportnoder
  videresender den og husker neste hopp tilbake, slik at ingen node trenger et kart over hele
  nettverket.
- **Kryptering.** Trafikk er kryptert som standard, med flyktige nøkler og forward secrecy.
- **LXMF.** Meldingslaget [LXMF](https://github.com/markqvist/LXMF) legger til signerte meldinger,
  direkte levering og lagre-og-videresend via propageringsnoder for mottakere som er frakoblet.

Applikasjoner bygget på denne måten inkluderer [Sideband](https://github.com/markqvist/Sideband) for
meldinger og [Nomad Network](https://github.com/markqvist/NomadNet) for meldinger og hostede sider.
Reticulum-manualen har en [liste over programmer](https://reticulum.network/manual/software.html).

## Sammenligning

| Spørsmål           | Reticulum                                                                                                       | Bitsocial                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Hva det er         | Nettverksstakk                                                                                                  | Sosial peer-to-peer-protokoll og apper                                                                        |
| Laget for          | Alle bærere, helt ned til trege radioforbindelser                                                               | Internettforbindelser, inkludert nettleserfaner                                                               |
| Identitet          | Nøkkelsett med X25519 og Ed25519                                                                                | Ed25519-nøkkelpar for brukere og fellesskap                                                                   |
| Adresser           | Hash av en identitet og et applikasjonsnavn                                                                     | Hash av et fellesskaps offentlige nøkkel                                                                      |
| Finne en peer      | Announces spredt av transportnoder                                                                              | HTTP-rutere returnerer peers som tilbyr innholdet                                                             |
| Sosiale funksjoner | Lagt til av applikasjoner som Nomad Network                                                                     | Fellesskap, innlegg, svar og moderering i protokollen                                                         |
| Spamkontroll       | Grenser for announce-frekvens per grensesnitt; LXMF-proof-of-work-stempler som en mottaker eller node kan kreve | Hvert fellesskaps utfordring før et innlegg godtas                                                            |
| Levering uten nett | LXMF-propageringsnoder lagrer og videresender meldinger                                                         | Peers fortsetter å servere et fellesskaps siste tilstand; publisering krever at fellesskapets node er på nett |

## Kan Bitsocial kjøre over Reticulum?

Ikke i dag. Bitsocial har ingen Reticulum-transport, og datamodellen forutsetter internettbåndbredde:
en klient henter fellesskapsmetadata og innleggsinnhold fra peers og utveksler pubsub-meldinger, noe
som passer dårlig på forbindelser bygget rundt pakker på 500 byte og gjennomstrømning målt i bit
eller kilobit per sekund.

Den realistiske veien er smalere: en klient som fungerer over et lokalt mesh mens den er frakoblet,
og som så synkroniserer med det bredere Bitsocial-nettverket når en peer eller gateway med
internettilgang er innen rekkevidde. Det ville vært en ny klient og bro snarere enn en endring i
protokollen, og det står ikke på det nåværende veikartet.

## For utviklere

Reticulum er publisert under
[Reticulum License](https://reticulum.network/manual/license.html): MIT-lignende vilkår pluss to
begrensninger. Programvaren må ikke brukes i systemer som er laget for å skade mennesker, eller til å
lage treningsdatasett for KI eller maskinlæring. Les lisensen før du pakker Reticulum-kode inn i en
Bitsocial-app.

Referanseimplementasjonen er [skrevet i Python](https://github.com/markqvist/Reticulum).
Vedlikeholderne av Reticulum advarer om at flere uoffisielle porteringer av Reticulum og LXMF er
maskingenererte og har lisenspåstander de anser som ugyldige, så foretrekk referanseimplementasjonen
eller programmer som er oppført i manualen.
