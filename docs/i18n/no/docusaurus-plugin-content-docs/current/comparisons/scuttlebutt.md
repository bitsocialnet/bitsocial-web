---
title: Bitsocial og Secure Scuttlebutt
description: Hvordan Secure Scuttlebutt (SSB) og appen Manyverse står seg mot Bitsocial, fra append-only-feeder og replikering via følgegrafen til fellesskap, spamkontroll og synkronisering uten nett.
---

# Bitsocial og Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) er en sosial peer-to-peer-protokoll som Dominic
Tarr laget i 2014. [Manyverse](https://www.manyver.se/) er den mest kjente appen, for Android, iOS
og skrivebord; [Patchwork](https://github.com/ssbc/patchwork) var den viktigste skrivebordsklienten
før den ble arkivert. Av systemene som sammenlignes i denne dokumentasjonen, er SSB det som ligger
nærmest Bitsocial i ånden: ingen servere i dataveien, ingen blokkjede, ingen global rekkefølge og
Ed25519-nøkler for identitet. De to tok motsatte valg om hva hver peer lagrer, og om hvor spam
stoppes.

## Hvordan Scuttlebutt fungerer

- **Feeder.** Hver identitet er et Ed25519-nøkkelpar, skrevet som `@<public key>.ed25519`. Alt en
  bruker publiserer, havner i brukerens egen feed, en logg som bare kan utvides (append-only), der
  hver signerte melding har et sekvensnummer og hashen til forrige melding. Når en melding først er
  postet, kan den ikke endres, ifølge
  [protokollguiden](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replikering.** Peers kopierer hele feeder, ikke enkeltinnlegg, og følgegrafen avgjør hvilke
  feeder en peer beholder. Patchwork viste for eksempel feeder opptil to hopp unna og replikerte
  feeder opptil tre hopp unna. Med epidemic broadcast trees (EBT) sammenligner peers det siste
  sekvensnummeret de har for hver feed, og sender bare det som mangler.
- **Forbindelser.** Peers autentiserer hverandre med en secret handshake og krypterer trafikken med
  box stream. Håndtrykket er knyttet til en nettverksidentifikator, så peers på et separat
  SSB-nettverk med en annen identifikator kan ikke koble seg til hovednettverket.
- **Finne peers.** Peers kunngjør seg selv på det lokale nettverket via UDP-kringkasting og
  synkroniserer over LAN; Manyverse synkroniserer også over Bluetooth. Over internett er brukerne
  avhengige av **pubs**, peers som alltid er på nett, som følger deg tilbake når du løser inn en
  invitasjonskode, og som deretter lagrer og serverer feeden din, og av **rooms**, som ikke lagrer
  noen feeder, men tunnelerer forbindelser mellom medlemmene sine.
- **Blobber og private meldinger.** Bilder og andre filer er innholdsadresserte blobber som hentes
  fra peers, med en standard størrelsesgrense på 5 MB i dagens implementasjoner. Private meldinger
  krypteres for opptil sju mottakere og publiseres som chiffertekst i forfatterens feed.

## Hvor de skiller seg

### Hva en peer lagrer

En SSB-peer har en fullstendig kopi av hver feed innenfor replikeringsrekkevidden sin, fra den
første meldingen i hver feed, og serverer disse feedene til andre. Det er dette som lar SSB fungere
uten nett, men lagringsbehovet vokser med hver melding innenfor rekkevidden, og en ny installasjon
må laste ned disse feedene før den viser særlig mye. En Bitsocial-klient henter den nyeste
tilstanden til fellesskapene den åpner, fra fellesskapets node og peerne som seeder det, og
nettverket beholder bare denne nyeste tilstanden. Se
[Peer-to-peer-protokoll](/peer-to-peer-protocol/).

### Sletting og enheter

Fordi en feed er en hashkjede, har SSB ingen sletting på tvers av nettverket: en peer kan fjerne
meldinger fra sin egen database, men kan ikke trekke dem tilbake fra kopiene til andre peers. Å
poste med samme nøkkel fra to enheter, eller fra en gjenopprettet sikkerhetskopi, forgrener feeden
(en fork), så den vanlige løsningen er én identitet per enhet. PZP, etterfølgerprotokollen fra
Manyverse-teamet, nevner sletting, flere enheter per konto og feeder som tåler forgreninger blant de
viktigste endringene fra SSB ([lanseringsinnlegget](https://www.manyver.se/blog/2024-07-03/)). En
Bitsocial-fellesskapsnode publiserer en ny versjon av fellesskapets tilstand ved hver oppdatering,
så innhold som moderatorene fjerner, faller ut av den nyeste tilstanden.

### Hvem du kan høre fra

SSBs replikeringsrekkevidde fungerer også som spamfilter. En fremmeds feed når deg bare hvis noen
innenfor hoppene dine følger vedkommende, og blokkerer du en feed, slutter noden din å replikere
den. Spam holdes ute, men det gjør også nykommere, helt til noen følger dem. Bitsocial lar hvem som
helst publisere til et fellesskap, og fellesskapets node avgjør gjennom utfordringen sin om et
innlegg godtas. Se [Tilpassede utfordringer mot spam](/custom-challenges/).

### Fellesskap

SSB har ikke noe fellesskapsobjekt. Kanaler og emneknagger er merkelapper på enkeltinnlegg, svarene
i en tråd ligger i feedene til dem som skrev dem, og hvor mye av en tråd du ser, avhenger av hvilke
av disse feedene noden din har. Rooms kan ha moderatorer og medlemslister, men de bestemmer hvem som
kan koble seg til via et room, ikke hva som publiseres. Et Bitsocial-fellesskap er et førsteklasses
objekt med eget nøkkelpar, egne regler, moderatorer og utfordring.

### Infrastruktur

Begge holder servere utenfor dataveien, og begge støtter seg på hjelpere. Pubs er det nærmeste SSB
kommer en driftet tjeneste: de lagrer og serverer feedene til alle de følger. Rooms ligner mer på
Bitsocials HTTP-rutere, fordi ingen av dem lagrer innhold, men et room videreformidler forbindelsen
mellom medlemmene sine, mens en ruter bare returnerer adresser til tilbydere og ikke spiller noen
rolle i overføringen. I likhet med en SSB-peer kjører en Bitsocial-fellesskapsnode på
forbrukermaskinvare, og den må være på nett for å godta nye innlegg.

### Uten nett og på lokale nettverk

Her er SSB sterkere. To SSB-peers på samme Wi-Fi-nettverk, eller over Bluetooth i Manyverse, kan
synkronisere uten internettforbindelse, og alt som allerede er replikert, forblir lesbart uten nett.
Manyverses uttalte hovedmål er å gjøre sosiale nettverk uavhengige av internettilgang. Bitsocial
trenger en internettforbindelse for å finne peers og for å publisere.

### Nettleser

De viktigste SSB-appene leveres med en full SSB-node: Manyverse bygger en inn i mobil- og
skrivebordsappene sine. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) kjørte SSB i
en nettleser med delvis replikering og forbindelser gjennom rooms, og ble arkivert i 2022.
Bitsocial-apper kjører en peer-to-peer-node i en vanlig nettleserfane. Se
[Peer-to-peer i nettleseren](/browser-p2p/).

### Private meldinger

SSB har innebygde krypterte private meldinger. Bitsocial fokuserer på offentlige fellesskap og har
ennå ingen innebygde direktemeldinger.

## Prosjektstatus

André Staltz, som laget Manyverse, trakk seg i april 2024 fra SSB, Manyverse og den planlagte
etterfølgeren deres ([hans siste oppdatering](https://www.manyver.se/blog/2024-04-05/)). I juli 2024
lanserte Jacob Karlsson denne etterfølgeren som [PZP](https://pzp.wiki/) og skrev at han ikke ville
jobbe mer med Manyverse og ikke kjente til noen andre som planla å gjøre det. I oktober 2026 hadde
PZP-repositoriene på [Codeberg](https://codeberg.org/pzp) ingen oppdateringer etter desember 2024.
Patchworks repositorium er arkivert med v3.18.1 som siste utgivelse, og teamet bak Planetary, en
SSB-app for iOS, gikk over til Nostr med appen Nos i 2023. SSB-nettverket kjører fortsatt på de
peers og pubs som folk holder på nett, men de viktigste appene utvikles ikke lenger.

## Sammenligning

| Spørsmål               | Secure Scuttlebutt                                                                                      | Bitsocial                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Kategori               | Gossip-protokoll for peer-to-peer                                                                       | Peer-to-peer-nettverk av fellesskap                                                               |
| Identitet              | Ett Ed25519-nøkkelpar per enhet                                                                         | Ed25519-nøkkelpar for brukere og fellesskap                                                       |
| Hvor innleggene ligger | Forfatterens append-only-feed, kopiert av hver peer som replikerer den                                  | Noden til fellesskapets eier og peerne som leser og seeder det                                    |
| Hva en peer beholder   | Full historikk for hver feed innenfor følgerekkevidden                                                  | Den nyeste tilstanden til fellesskapene den leser eller seeder                                    |
| Fellesskap             | Ikke noe fellesskapsobjekt; kanaler og emneknagger merker innlegg                                       | Førsteklasses objekter der noden godtar eller avviser innlegg                                     |
| Spamkontroll           | Replikeringsrekkevidde styrt av følgegrafen, pluss blokkeringer                                         | Hvert fellesskaps utfordring før et innlegg godtas                                                |
| Moderering             | Hvem hver bruker følger og blokkerer                                                                    | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser                             |
| Hjelpeservere          | Pubs lagrer og serverer feeder; rooms tunnelerer forbindelser                                           | HTTP-rutere returnerer peers som tilbyr innholdet, og lagrer ikke noe innhold                     |
| Uten nett              | Synkronisering over LAN og Bluetooth uten internett                                                     | Trenger en internettforbindelse                                                                   |
| Nettleser              | Appene har en full SSB-node innebygd                                                                    | Peer-to-peer-node i en vanlig nettleserfane                                                       |
| Nettverk               | I drift, men de viktigste appene utvikles ikke lenger                                                   | Nettverk i drift med apper som [5chan](/apps/5chan/) og [Seedit](/apps/seedit/)                   |
| Viktigste avveining    | Fungerer uten nett og trenger ingen hosting, men feedene vokser for alltid og fremmede forblir usynlige | Åpen publisering og nettleserstøtte, men trenger internett og beholder bare den nyeste tilstanden |
