---
title: Bitsocial og Secure Scuttlebutt
description: Hvordan Secure Scuttlebutt (SSB) og dets app Manyverse adskiller sig fra Bitsocial, fra append-only-feeds og replikering efter følgegrafen til fællesskaber, spamkontrol og offline-synkronisering.
---

# Bitsocial og Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) er en social peer-to-peer-protokol, som Dominic
Tarr skabte i 2014. [Manyverse](https://www.manyver.se/) er dens bedst kendte app, til Android, iOS
og desktop; [Patchwork](https://github.com/ssbc/patchwork) var den vigtigste desktopklient, før den
blev arkiveret. Af de systemer, der sammenlignes i denne dokumentation, er SSB det, der i ånden
ligger tættest på Bitsocial: ingen servere i datavejen, ingen blockchain, ingen global rækkefølge og
Ed25519-nøgler som identitet. De to har truffet modsatte valg om, hvad hver peer gemmer, og hvor
spam bliver stoppet.

## Sådan fungerer Scuttlebutt

- **Feeds.** Hver identitet er et Ed25519-nøglepar, skrevet som `@<public key>.ed25519`. Alt, hvad
  en bruger publicerer, havner i brugerens eget feed, en append-only-log, hvor hver signeret besked
  bærer et sekvensnummer og hashen af den forrige besked. Når en besked først er publiceret, kan den
  ikke ændres, ifølge [protokolguiden](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replikering.** Peers kopierer hele feeds, ikke enkelte indlæg, og følgegrafen afgør, hvilke
  feeds en peer beholder. Patchwork viste for eksempel feeds op til to hop væk og replikerede feeds
  op til tre hop væk. Med epidemic broadcast trees (EBT) sammenligner peers det seneste
  sekvensnummer, de har for hvert feed, og sender kun det, der mangler.
- **Forbindelser.** Peers autentificerer sig med secret handshake og krypterer trafikken med box
  stream. Handshaket er knyttet til en netværksidentifikator, så peers på et separat SSB-netværk med
  en anden identifikator ikke kan forbinde sig til hovednetværket.
- **At finde peers.** Peers annoncerer sig selv på det lokale netværk via UDP-broadcast og
  synkroniserer over LAN; Manyverse synkroniserer også over Bluetooth. På tværs af internettet er
  brugerne afhængige af **pubs**, altid tilgængelige peers, der følger dig tilbage, når du har
  indløst en invitationskode, og derefter gemmer og leverer dit feed, og af **rooms**, der ikke
  gemmer feeds, men tunnelerer forbindelser mellem deres medlemmer.
- **Blobs og private beskeder.** Billeder og andre filer er indholdsadresserede blobs, der hentes
  fra peers, med en standardgrænse for størrelsen på 5 MB i nuværende implementeringer. Private
  beskeder krypteres til op til syv modtagere og publiceres som krypteret tekst i forfatterens feed.

## Hvor de adskiller sig

### Hvad en peer gemmer

En SSB-peer har en fuld kopi af hvert feed inden for sin replikeringsrækkevidde, fra hvert feeds
første besked, og leverer disse feeds til andre. Det er det, der får SSB til at fungere offline, men
lagerforbruget vokser med hver besked inden for rækkevidden, og en ny installation skal hente disse
feeds, før den viser ret meget. En Bitsocial-klient henter den seneste tilstand af de fællesskaber,
den åbner, fra fællesskabets node og de peers, der seeder det, og netværket bevarer kun den seneste
tilstand. Se [Peer-to-peer-protokol](/peer-to-peer-protocol/).

### Sletning og enheder

Fordi et feed er en hashkæde, har SSB ingen netværksdækkende sletning: en peer kan fjerne beskeder
fra sin egen database, men kan ikke trække dem tilbage fra andre peers' kopier. Hvis man poster med
den samme nøgle fra to enheder eller fra en gendannet backup, forgrener feedet sig (fork), så det
sædvanlige svar er én identitet pr. enhed. PZP, efterfølgerprotokollen fra Manyverse-teamet, nævner
sletning, flere enheder pr. konto og fork-tolerante feeds blandt sine vigtigste ændringer i forhold
til SSB ([lanceringsindlæg](https://www.manyver.se/blog/2024-07-03/)). En Bitsocial-fællesskabsnode
publicerer en ny version af fællesskabets tilstand ved hver opdatering, så indhold, som dets
moderatorer fjerner, forsvinder fra den seneste tilstand.

### Hvem du kan høre fra

SSB's replikeringsrækkevidde fungerer samtidig som spamfilter. En fremmeds feed når kun frem til
dig, hvis nogen inden for dine hop følger vedkommende, og hvis du blokerer et feed, holder din node
op med at replikere det. Spam holdes ude, men det gør nytilkomne også, indtil nogen følger dem.
Bitsocial lader alle publicere i et fællesskab, og fællesskabets node afgør via sin udfordring, om
et indlæg bliver accepteret. Se [Brugerdefinerede anti-spam-udfordringer](/custom-challenges/).

### Fællesskaber

SSB har intet fællesskabsobjekt. Kanaler og hashtags er etiketter på enkelte indlæg, svarene i en
tråd ligger i de feeds, som deres forfattere har, og hvor meget af en tråd du ser, afhænger af,
hvilke af disse feeds din node har. Rooms kan have moderatorer og medlemslister, men de styrer, hvem
der må forbinde sig gennem et room, ikke hvad der bliver publiceret. Et Bitsocial-fællesskab er et
førsteklasses objekt med sit eget nøglepar, sine egne regler, moderatorer og sin egen udfordring.

### Infrastruktur

Begge holder servere ude af datavejen, og begge læner sig op ad hjælpere. Pubs er det tætteste, SSB
har på en hostet tjeneste: de gemmer og leverer feeds for alle, de følger. Rooms minder mere om
Bitsocials HTTP-routere, fordi ingen af dem gemmer indhold, men et room videresender forbindelsen
mellem sine medlemmer, mens en router kun returnerer udbyderadresser og ikke spiller nogen rolle i
overførslen. Ligesom en SSB-peer kører en Bitsocial-fællesskabsnode på forbrugerhardware, og den
skal være online for at kunne acceptere nye indlæg.

### Offline og lokale netværk

Her er SSB stærkere. To SSB-peers på det samme Wi-Fi-netværk, eller via Bluetooth i Manyverse, kan
synkronisere uden internetforbindelse, og alt, der allerede er replikeret, kan stadig læses offline.
Manyverses erklærede hovedmål er at gøre sociale netværk uafhængige af internetforbindelse.
Bitsocial har brug for en internetforbindelse for at finde peers og for at publicere.

### Browser

De vigtigste SSB-apps leveres med en fuld SSB-node: Manyverse indbygger en i sine mobil- og
desktopapps. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) kørte SSB i en browser
med delvis replikering og forbindelser gennem rooms og blev arkiveret i 2022. Bitsocial-apps kører
en peer-to-peer-node i en almindelig browserfane. Se [Peer-to-peer i browseren](/browser-p2p/).

### Private beskeder

SSB har indbyggede krypterede private beskeder. Bitsocial fokuserer på offentlige fællesskaber og
har endnu ingen indbyggede direkte beskeder.

## Projektstatus

André Staltz, som byggede Manyverse, trak sig i april 2024 fra SSB, Manyverse og deres planlagte
efterfølger ([hans sidste opdatering](https://www.manyver.se/blog/2024-04-05/)). I juli 2024
lancerede Jacob Karlsson efterfølgeren som [PZP](https://pzp.wiki/) og skrev, at han ikke ville
arbejde mere på Manyverse og ikke kendte til andre, der planlagde at gøre det. I oktober 2026 havde
PZP-repositorierne på [Codeberg](https://codeberg.org/pzp) ingen opdateringer efter december 2024.
Patchworks repository er arkiveret med v3.18.1 som sidste udgivelse, og teamet bag Planetary, en
SSB-app til iOS, gik over til Nostr med sin app Nos i 2023. SSB-netværket kører stadig på de peers
og pubs, som folk holder online, men de vigtigste apps bliver ikke længere udviklet.

## Sammenligning

| Spørgsmål             | Secure Scuttlebutt                                                                                   | Bitsocial                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Kategori              | Peer-to-peer-gossipprotokol                                                                          | Peer-to-peer-fællesskabsnetværk                                                                    |
| Identitet             | Ét Ed25519-nøglepar pr. enhed                                                                        | Ed25519-nøglepar til brugere og fællesskaber                                                       |
| Hvor indlæg ligger    | Forfatterens append-only-feed, kopieret af hver peer, der replikerer det                             | Fællesskabsejerens node og de peers, der læser og seeder det                                       |
| Hvad en peer beholder | Den fulde historik for hvert feed inden for dens følgerækkevidde                                     | Den seneste tilstand af de fællesskaber, den læser eller seeder                                    |
| Fællesskaber          | Intet fællesskabsobjekt; kanaler og hashtags mærker indlæg                                           | Førsteklasses objekter, hvis node accepterer eller afviser indlæg                                  |
| Spamkontrol           | Replikeringsrækkevidde efter følgegrafen samt blokeringer                                            | Hvert fællesskabs udfordring, før et indlæg accepteres                                             |
| Moderering            | Hver brugers follows og blokeringer                                                                  | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser                       |
| Hjælpeservere         | Pubs gemmer og leverer feeds; rooms tunnelerer forbindelser                                          | HTTP-routere returnerer udbyder-peers og gemmer intet indhold                                      |
| Offline               | Synkronisering over LAN og Bluetooth uden internet                                                   | Kræver en internetforbindelse                                                                      |
| Browser               | Apps indeholder en fuld SSB-node                                                                     | Peer-to-peer-node i en almindelig browserfane                                                      |
| Netværk               | Kører, men de vigtigste apps udvikles ikke længere                                                   | Live netværk med apps som [5chan](/apps/5chan/) og [Seedit](/apps/seedit/)                         |
| Vigtigste afvejning   | Fungerer offline og kræver ingen hosting, men feeds vokser for evigt, og fremmede forbliver usynlige | Åben publicering og browserunderstøttelse, men kræver internet og bevarer kun den seneste tilstand |
