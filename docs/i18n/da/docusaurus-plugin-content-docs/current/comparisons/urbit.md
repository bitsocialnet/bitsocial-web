---
title: Bitsocial og Urbit
description: Hvordan Urbit, et netværk af personlige servere med Ethereum-baserede Urbit ID'er og værtsdrevne grupper i Tlon Messenger, adskiller sig fra Bitsocials peer-to-peer-fællesskaber.
---

# Bitsocial og Urbit

[Urbit](https://urbit.org/) er et netværk af personlige servere. Hver bruger har en computer, der
altid er tændt, kaldet et skib (ship), som kører Urbits eget styresystem (Arvo), skrevet i Urbits
egne sprog (Nock og Hoon), og som identificeres med et Urbit ID. Den vigtigste sociale app er
[Tlon Messenger](https://tlon.io/), bygget af Tlon, firmaet der blev grundlagt i 2013 for at udvikle
Urbit.

Urbit sigter mod at erstatte hele computerstakken, så det er et langt bredere projekt end Bitsocial.
Det sociale lag bruger dog en model, der ligger tæt på Bitsocials: et fællesskab lever på ejerens
node, og den node afgør, hvad der slipper ind. De to adskiller sig i, hvem der skal køre en server,
og hvordan spam holdes ude.

## Sådan fungerer Urbit

- **Urbit ID'er.** Hvert skib har et Urbit ID: et tal, der vises som et navn, man kan udtale, for
  eksempel `~sampel-palnet`. Layer 1-ID'er er NFT'er, hvis ejerskab og offentlige netværksnøgler er
  registreret i Azimuth-kontrakterne på Ethereum. Layer 2-ID'er, der blev tilføjet i 2021 for at
  sænke gebyrerne, bruger en "naive rollup": deres transaktioner publiceres på Ethereum i batches,
  men deres ejerskab gemmes ikke i Azimuth-kontrakten, og hvert skib beregner det lokalt. Tlon
  driver en roller, som offentligheden kan bruge gratis, ifølge
  [Urbit ID-dokumentationen](https://docs.urbit.org/urbit-id/what-is-urbit-id) og
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Et fast hierarki.** Adresserummet har 256 galakser, 65.536 stjerner og omkring 4 milliarder
  planeter til hverdagsbrug. Galakser udsteder stjerner, stjerner udsteder planeter, og hver planet
  kan udstede måner til sine egne enheder. Kometer er gratis ID'er, som et skib genererer til sig
  selv, og som aldrig rører blockchainen. Galakseejerne udgør Galactic Senate, som stemmer om
  opgraderinger af Azimuth-kontrakterne og vælger Urbit Foundations bestyrelse.
- **Netværk.** Skibe udveksler krypterede pakker peer-to-peer. Siden juli 2026 har
  netværksprotokollen været [Directed Messaging](https://urbit.org/blog/directed-messaging), en
  indholdscentreret omskrivning af den ældre Ames-protokol. Galakserne står for peer-opdagelse: hver
  af dem holder styr på, hvor skibene under den befinder sig, og videresender pakker til dem, indtil
  de to skibe kan nå hinanden direkte, eller så længe en firewall forhindrer det, ifølge
  [artiklen om Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Grupper.** I Tlon Messenger hostes en gruppe af skaberens skib. Medlemmer sender beskeder til
  værten, som distribuerer dem til hvert medlems skib, og hvert medlems skib beholder sin egen kopi,
  ifølge [Tlons FAQ](https://tlon.io/posts/faq). Værten styrer roller, kanaler og optagelse. En
  gruppe kan være offentlig, privat eller hemmelig, og den kan
  [udelukke enkelte skibe eller hele rangtrin af ID'er](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanaler er chats, notesbøger eller samlinger af billeder og links.
- **Hosting.** Når en ny bruger tilmelder sig hos Tlon, får vedkommende et skib, som Tlon driver,
  med nøgler, som Tlon har i forvaring. En bruger kan eksportere skibet og dets master ticket og
  køre det et andet sted: på en enhed fra [Native Planet](https://www.nativeplanet.io/) eller med
  Vere-runtimen på Linux, macOS eller Windows. Skibe kan endnu ikke gemme store filer direkte, så
  Tlon Messenger lægger billeder og andre medier i S3-kompatibel cloudlagring.

## Hvor de adskiller sig

### Hvem der skal køre en server

På Urbit er hver deltager en server. Tlons apps er frontends til brugerens eget skib, og selv det at
læse en gruppe går gennem det. Folk, der ikke selv kører et skib, lejer et, og dermed kommer en
hostingudbyder ind i billedet igen: Tlon har hostede brugeres nøgler og bevarer en begrænset adgang
til vedligeholdelse, selv om brugerne kan forlade Tlon med hele deres skib.

På Bitsocial er det kun fællesskabsejere, der har brug for en node, der altid er tændt. Læsere og
skribenter kan køre en peer-to-peer-node i en browserfane, og deres konto er et nøglepar, som appen
opbevarer. Se [Peer-to-peer i browseren](/browser-p2p/). Når nogen alligevel bruger en hostet node,
er Bitsocials design beregnet på at lade dem uddelegere oppetiden uden at overdrage forvaringen af
identiteten. Se [Identitet og fællesskabsejerskab](/identity-and-ownership/).

### Fællesskabets vært

Her er de to tættest på hinanden. En Tlon-gruppe og et Bitsocial-fællesskab lever begge på ejerens
node. Værten afgør, hvem der må poste, udøver moderering og distribuerer resultatet, og ingen af
protokollerne placerer en moderator over værten. I begge tilfælde skal værten være online. Tlons FAQ
siger, at hvis værten går offline, "går gruppen ned med den", og et Bitsocial-fællesskab kan ikke
modtage nye indlæg, mens dets node er offline.

De gemmer indhold forskelligt. Hvert medlems skib beholder en kopi af gruppens historik, så
medlemmerne stadig kan læse det, de allerede har modtaget, mens værten er nede. En Bitsocial-læser
henter fællesskabets seneste tilstand fra fællesskabets node eller fra peers, der seeder det, så et
offline fællesskab forbliver læsbart, så længe peers har det, men netværket bevarer kun den seneste
tilstand.

En Tlon-gruppe har også en medlemsliste, og dens vært kan gøre den invitationsbaseret. Et
Bitsocial-fællesskab har intet medlemskab: alle kan læse det, og alle kan forsøge at poste, med
forbehold for dets udfordring.

### Spam og identitet

Urbit bekæmper spam ved at gøre identitet knap. Udbuddet af planeter er fast, og hver eneste
udstedes af en stjerne. Gratis kometer omgår den knaphed, så grupper, der vil have den til at holde,
afviser dem: Urbits dokumentation bemærker, at nogle grupper afviser kometer, og en Tlon-gruppe kan
udelukke hele rangtrinnet for kometer med én indstilling. Når kometer først er lukket ude, skal en
udelukket bruger have en anden planet fra ejeren af en stjerne for at komme tilbage. Omdømme kan
også følge hierarkiet: Azimuth indeholder en Censures-kontrakt, som lader galakser og stjerner
markere ID'er. Fordi knapheden er indbygget i adresserummet, virker den på samme måde i alle
grupper, der afviser kometer.

Bitsocial-identiteter er gratis nøglepar. Hvert fællesskab vælger sin egen udfordring, før det
accepterer et indlæg, for eksempel en captcha, en betaling, en tokenbeholdning eller en
tilladelsesliste, og andre fællesskaber kan vælge anderledes. Se
[Brugerdefinerede anti-spam-udfordringer](/custom-challenges/).

### Blockchain og styring

Urbits identitetslag er afhængigt af Ethereum. Azimuth-kontrakterne registrerer ejerskab og
netværksnøgler på layer 1, layer 2-transaktioner publiceres på Ethereum i batches, og Galactic
Senate kan opgradere den kontrakt, der styrer Azimuth. De samme 256 galakser står også for
peer-opdagelse og videresendelse, så et fast sæt identiteter bærer både styringen og en del af
netværkets routing.

Bitsocial-identiteter er nøglepar, der ikke kræver nogen registrering. `.bso`- og `.eth`-navne er
valgfrie aliasser, der oversættes til dem. Peer-opdagelse går gennem HTTP-routere, som kun
returnerer udbyderadresser; alle kan køre en, og klienter kan skifte router ved at ændre deres
konfiguration.

### Omfang

Urbit er en computer til generelle formål. Et skib kan hoste et Git-remote, en personlig vidensbase
eller AI-agenter, og Tlon Messenger er ét program blandt mange. At bygge til Urbit betyder for det
meste at skrive Hoon-apps til Arvo. Bitsocial er en protokol for offentlige fællesskaber med apps
som [5chan](/apps/5chan/) og [Seedit](/apps/seedit/). Den kører på den eksisterende stak (libp2p,
IPFS og browseren) i stedet for at erstatte den, og dens klienter bygges med almindelige
webværktøjer. Se [Byg din egen klient](/build-your-own-client/).

### Private beskeder

Her er Urbit stærkere. Direkte beskeder går fra ét skib direkte til et andet, al trafik mellem skibe
er krypteret, og grupper kan være private eller hemmelige. Tlon bemærker, at beskeder er krypteret
under overførslen, men gemmes ukrypteret på skibet. Bitsocial fokuserer på offentlige fællesskaber
og har endnu ingen indbyggede direkte beskeder.

## Projektstatus

Urbit har været igennem store omvæltninger. I august 2024 fyrede Urbit Foundation, den
nonprofitorganisation, der styrer kerneudviklingen, sin administrerende direktør; grundlæggeren
Curtis Yarvin vendte tilbage for at lede strategien uden en formel titel, flere kerneudviklere
forlod projektet, og Urbit Foundations økonomiske råderum blev målt i måneder,
[rapporterede CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin foreslog at flytte Azimuth til et eksisterende Ethereum-layer 2, sandsynligvis Base, og at
udstede ombyttelige "visum"-tokens, der kan konverteres til planeter. I oktober 2026 beskriver
Urbits [ID-dokumentation](https://docs.urbit.org/urbit-id/what-is-urbit-id) stadig Azimuth på
Ethereum med dens naive rollup. I oktober 2025 udskiftede Galactic Senate Urbit Foundations
bestyrelse, og den nye bestyrelse udnævnte en ny administrerende direktør
([meddelelse](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Udviklingen fortsætter. Directed Messaging gik live med udgivelse 408k den 14. juli 2026. I juni
2026 åbnede Tlon Messenger
[for offentlig tilmelding uden venteliste](https://urbit.org/blog/this-month-in-urbit-june-2026), og
Tlon præsenterer sig nu som et sted, hvor mennesker og AI-agenter arbejder sammen.

## Sammenligning

| Spørgsmål            | Urbit                                                                                                | Bitsocial                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Kategori             | Netværk af personlige servere og styresystem                                                         | Peer-to-peer-fællesskabsnetværk                                                                             |
| Identitet            | Urbit ID'er: omkring 4 milliarder planeter på Ethereum eller dets layer 2-rollup plus gratis kometer | Ed25519-nøglepar til brugere og fællesskaber                                                                |
| Hvem kører en server | Hver bruger, på sit eget skib eller et hostet                                                        | Fællesskabsejere; læsere og skribenter kan bruge en browserfane                                             |
| Hvor indlæg ligger   | Gruppeværtens skib og en kopi på hvert medlems skib                                                  | Fællesskabsejerens node og de peers, der læser og seeder det                                                |
| Fællesskaber         | Grupper hostet af skaberens skib, med medlemslister                                                  | Førsteklasses objekter, hvis node accepterer eller afviser indlæg                                           |
| Spamkontrol          | Knappe ID'er udstedt af stjerner; grupper udelukker skibe eller hele rangtrin                        | Hvert fællesskabs udfordring, før et indlæg accepteres                                                      |
| Moderering           | Gruppeværtens roller og udelukkelser                                                                 | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser                                |
| Peer-opdagelse       | Galakser holder styr på skibene under sig og videresender for dem                                    | HTTP-routere returnerer udbyder-peers og gemmer intet indhold                                               |
| Styring              | Galactic Senate med 256 galakser stemmer om Azimuth-opgraderinger                                    | Ingen autoritet på protokolniveau over identiteter eller fællesskaber                                       |
| Private beskeder     | Krypterede direkte beskeder og grupper kun for inviterede                                            | Offentlige fællesskaber; endnu ingen indbyggede direkte beskeder                                            |
| Vigtigste afvejning  | En hel personlig computer med private grupper, men hver bruger skal have et skib, der altid er tændt | Gratis identiteter og adgang via browseren, men ingen private beskeder, og kun den seneste tilstand bevares |
