---
title: Bitsocial og Urbit
description: Hvordan Urbit, et nettverk av personlige servere med Ethereum-baserte Urbit ID-er og vertsdrevne grupper i Tlon Messenger, står seg mot Bitsocials peer-to-peer-fellesskap.
---

# Bitsocial og Urbit

[Urbit](https://urbit.org/) er et nettverk av personlige servere. Hver bruker har en datamaskin som
alltid er på, kalt et skip (ship). Skipet kjører Urbits eget operativsystem (Arvo), skrevet i Urbits
egne språk (Nock og Hoon), og identifiseres av en Urbit ID. Den viktigste sosiale appen er
[Tlon Messenger](https://tlon.io/), laget av Tlon, selskapet som ble grunnlagt i 2013 for å utvikle
Urbit.

Urbit har som mål å erstatte hele datastakken, så det er et langt bredere prosjekt enn Bitsocial.
Det sosiale laget bruker likevel en modell som ligger nær Bitsocials: et fellesskap ligger på
eierens node, og den noden avgjør hva som slipper inn. De to skiller seg i hvem som må drive en
server, og i hvordan spam holdes ute.

## Hvordan Urbit fungerer

- **Urbit ID-er.** Hvert skip har en Urbit ID: et tall som vises som et uttalbart navn, for eksempel
  `~sampel-palnet`. Lag 1-ID-er er NFT-er der eierskapet og de offentlige nettverksnøklene er
  registrert i Azimuth-kontraktene på Ethereum. Lag 2-ID-er, som ble lagt til i 2021 for å kutte
  gebyrene, bruker en "naive rollup": transaksjonene deres publiseres til Ethereum i bunter, men
  eierskapet lagres ikke i Azimuth-kontrakten, og hvert skip beregner det lokalt. Tlon driver en
  roller som er gratis for alle å bruke, ifølge
  [Urbit ID-dokumentasjonen](https://docs.urbit.org/urbit-id/what-is-urbit-id) og
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Et fast hierarki.** Adresserommet har 256 galakser, 65 536 stjerner og rundt 4 milliarder
  planeter til daglig bruk. Galakser utsteder stjerner, stjerner utsteder planeter, og hver planet
  kan utstede måner til sine egne enheter. Kometer er gratis ID-er som et skip genererer selv, og
  som aldri berører blokkjeden. Eierne av galaksene utgjør Galactic Senate, som stemmer over
  oppgraderinger av Azimuth-kontraktene og velger styret i Urbit Foundation.
- **Nettverk.** Skip utveksler krypterte pakker peer-to-peer. Siden juli 2026 har
  nettverksprotokollen vært [Directed Messaging](https://urbit.org/blog/directed-messaging), en
  innholdssentrert omskriving av den eldre Ames-protokollen. Galaksene står for oppdagelsen av
  peers: hver galakse holder rede på hvor skipene under den befinner seg, og videresender pakker til
  dem til de to skipene kan nå hverandre direkte, eller så lenge en brannmur hindrer det, ifølge
  [artikkelen om Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Grupper.** I Tlon Messenger er skipet til den som opprettet en gruppe, vert for gruppen.
  Medlemmene sender meldinger til verten, som distribuerer dem til hvert medlems skip, og hvert
  medlems skip beholder sin egen kopi, ifølge [Tlons FAQ](https://tlon.io/posts/faq). Verten styrer
  roller, kanaler og opptak. En gruppe kan være offentlig, privat eller hemmelig, og den kan
  [utestenge enkeltskip eller hele ID-ranger](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanaler er chatter, notatbøker eller samlinger av bilder og lenker.
- **Hosting.** Når en ny bruker registrerer seg hos Tlon, får brukeren et skip som Tlon drifter, med
  nøkler som Tlon har i forvaring. En bruker kan eksportere skipet og tilhørende master ticket og
  kjøre det et annet sted: på en enhet fra [Native Planet](https://www.nativeplanet.io/), eller med
  Vere-kjøretiden på Linux, macOS eller Windows. Skip kan ennå ikke lagre store filer direkte, så
  Tlon Messenger legger bilder og andre medier i S3-kompatibel skylagring.

## Hvor de skiller seg

### Hvem som må drive en server

På Urbit er hver deltaker en server. Tlons apper er frontender for brukerens eget skip, og selv
lesing av en gruppe går gjennom det. De som ikke driver et skip selv, leier et, og dermed kommer en
hostingleverandør inn i bildet igjen: Tlon har nøklene til brukerne den drifter skip for, og
beholder begrenset tilgang for vedlikehold, selv om brukerne kan dra med hele skipet sitt.

På Bitsocial trenger bare fellesskapseiere en node som alltid er på. De som leser og poster, kan
kjøre en peer-to-peer-node i en nettleserfane, og kontoen deres er et nøkkelpar som appen tar vare
på. Se [Peer-to-peer i nettleseren](/browser-p2p/). Når noen faktisk bruker en driftet node, er
Bitsocial utformet for at de skal kunne delegere oppetiden uten å gi fra seg forvaringen av
identiteten. Se [Identitet og fellesskapseierskap](/identity-and-ownership/).

### Fellesskapets vert

Her er de to nærmest hverandre. En Tlon-gruppe og et Bitsocial-fellesskap ligger begge på eierens
node. Verten avgjør hvem som kan poste, utøver moderering og distribuerer resultatet, og ingen av
protokollene plasserer en moderator over verten. I begge må verten være på nett. Tlons FAQ sier at
hvis verten går av nett, "går gruppen ned sammen med dem", og et Bitsocial-fellesskap kan ikke godta
nye innlegg mens noden er av nett.

De lagrer innhold forskjellig. Hvert medlems skip har en kopi av gruppens historikk, så medlemmene
kan fortsatt lese det de allerede har mottatt mens verten er nede. En Bitsocial-leser henter
fellesskapets nyeste tilstand fra fellesskapets node eller fra peers som seeder det, så et
fellesskap som er av nett, forblir lesbart så lenge peers har det, men nettverket beholder bare den
nyeste tilstanden.

En Tlon-gruppe har også en medlemsliste, og verten kan gjøre den tilgjengelig kun for inviterte. Et
Bitsocial-fellesskap har ikke noe medlemskap: alle kan lese det, og alle kan prøve å poste, men må
da bestå fellesskapets utfordring.

### Spam og identitet

Urbit bekjemper spam ved å gjøre identitet knapp. Antallet planeter er fast, og hver av dem utstedes
av en stjerne. Gratis kometer omgår denne knappheten, så grupper som vil at den skal holde, avviser
dem: Urbits dokumentasjon nevner at noen grupper nekter kometer, og en Tlon-gruppe kan utestenge
hele kometrangen med én innstilling. Når kometer først er stengt ute, trenger en utestengt bruker en
annen planet fra eieren av en stjerne for å komme tilbake. Omdømme kan også følge hierarkiet:
Azimuth har en Censures-kontrakt som lar galakser og stjerner flagge ID-er. Fordi knappheten er bygd
inn i adresserommet, virker den på samme måte i alle grupper som avviser kometer.

Bitsocial-identiteter er gratis nøkkelpar. Hvert fellesskap velger sin egen utfordring før det
godtar et innlegg, for eksempel en captcha, en betaling, en tokensaldo eller en tillatelsesliste, og
andre fellesskap kan velge annerledes. Se [Tilpassede utfordringer mot spam](/custom-challenges/).

### Blokkjede og styring

Urbits identitetslag er avhengig av Ethereum. Azimuth-kontraktene registrerer eierskap og
nettverksnøkler på lag 1, transaksjoner på lag 2 publiseres til Ethereum i bunter, og Galactic
Senate kan oppgradere kontrakten som styrer Azimuth. De samme 256 galaksene står også for oppdagelse
av peers og videresending, så et fast sett identiteter bærer både styringen og en del av nettverkets
ruting.

Bitsocial-identiteter er nøkkelpar som ikke krever registrering. `.bso`- og `.eth`-navn er valgfrie
aliaser som peker til dem. Oppdagelse av peers går gjennom HTTP-rutere som bare returnerer adresser
til tilbydere; hvem som helst kan drive en slik ruter, og klienter kan bytte ruter ved å endre
konfigurasjonen sin.

### Omfang

Urbit er en datamaskin for generell bruk. Et skip kan være vert for et Git-remote, en personlig
kunnskapsbase eller AI-agenter, og Tlon Messenger er ett program blant mange. Å bygge for Urbit
betyr for det meste å skrive Hoon-apper for Arvo. Bitsocial er en protokoll for offentlige
fellesskap, med apper som [5chan](/apps/5chan/) og [Seedit](/apps/seedit/). Den kjører på den
eksisterende stakken (libp2p, IPFS og nettleseren) i stedet for å erstatte den, og klientene bygges
med vanlige webverktøy. Se [Bygg din egen klient](/build-your-own-client/).

### Private meldinger

Her er Urbit sterkere. Direktemeldinger går rett fra ett skip til et annet, all trafikk mellom skip
er kryptert, og grupper kan være private eller hemmelige. Tlon påpeker at meldinger er kryptert
under overføring, men lagres ukryptert på skipet. Bitsocial fokuserer på offentlige fellesskap og
har ennå ingen innebygde direktemeldinger.

## Prosjektstatus

Urbit har vært gjennom store omveltninger. I august 2024 sparket Urbit Foundation, den ideelle
organisasjonen som styrer kjerneutviklingen, sin daglige leder; grunnleggeren Curtis Yarvin kom
tilbake for å lede strategien uten formell tittel, flere kjerneutviklere sluttet, og Foundation
hadde bare penger til noen få måneder til,
[meldte CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin foreslo å flytte Azimuth til et eksisterende lag 2-nettverk for Ethereum, med Base som det
sannsynlige valget, og å utstede fungible "visum"-tokener som kan gjøres om til planeter. Per
oktober 2026 beskriver Urbits [ID-dokumentasjon](https://docs.urbit.org/urbit-id/what-is-urbit-id)
fortsatt Azimuth på Ethereum med sin naive rollup. I oktober 2025 byttet Galactic Senate ut styret i
Foundation, og det nye styret utnevnte en ny daglig leder
([kunngjøring](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Utviklingen fortsetter. Directed Messaging ble satt i drift med utgivelse 408k 14. juli 2026. I juni
2026
[åpnet Tlon Messenger for offentlig registrering uten venteliste](https://urbit.org/blog/this-month-in-urbit-june-2026),
og Tlon presenterer seg nå som et sted der mennesker og AI-agenter jobber sammen.

## Sammenligning

| Spørsmål               | Urbit                                                                                             | Bitsocial                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Kategori               | Nettverk av personlige servere og operativsystem                                                  | Peer-to-peer-nettverk av fellesskap                                                                                |
| Identitet              | Urbit ID-er: rundt 4 milliarder planeter på Ethereum eller i lag 2-rollupen, pluss gratis kometer | Ed25519-nøkkelpar for brukere og fellesskap                                                                        |
| Hvem driver en server  | Hver bruker, på eget skip eller et driftet skip                                                   | Fellesskapseiere; de som leser og poster, kan bruke en nettleserfane                                               |
| Hvor innleggene ligger | Skipet til gruppens vert og en kopi på hvert medlems skip                                         | Noden til fellesskapets eier og peerne som leser og seeder det                                                     |
| Fellesskap             | Grupper med medlemslister, med skipet til den som opprettet dem som vert                          | Førsteklasses objekter der noden godtar eller avviser innlegg                                                      |
| Spamkontroll           | Knappe ID-er utstedt av stjerner; grupper utestenger skip eller hele ranger                       | Hvert fellesskaps utfordring før et innlegg godtas                                                                 |
| Moderering             | Rollene og utestengingene til gruppens vert                                                       | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser                                              |
| Oppdagelse av peers    | Galakser holder rede på skipene under seg og videresender for dem                                 | HTTP-rutere returnerer peers som tilbyr innholdet, og lagrer ikke noe innhold                                      |
| Styring                | Galactic Senate med 256 galakser stemmer over oppgraderinger av Azimuth                           | Ingen myndighet på protokollnivå over identiteter eller fellesskap                                                 |
| Private meldinger      | Krypterte direktemeldinger og grupper kun for inviterte                                           | Offentlige fellesskap; ennå ingen innebygde direktemeldinger                                                       |
| Viktigste avveining    | En hel personlig datamaskin med private grupper, men hver bruker trenger et skip som alltid er på | Gratis identiteter og tilgang fra nettleseren, men ingen private meldinger, og bare den nyeste tilstanden beholdes |
