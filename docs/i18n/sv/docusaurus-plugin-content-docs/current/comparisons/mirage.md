---
title: Bitsocial och Mirage
description: Hur Mirage, ett forum i Reddit-stil på en egen Cosmos SDK-blockkedja, står sig mot Bitsocial och dess Reddit-liknande app Seedit.
---

# Bitsocial och Mirage

[Mirage](https://mirage.foundation/) är ett diskussionsnätverk i Reddit-stil med communityer,
trådade inlägg och röster. I stället för ett företags databas körs det på en egen blockkedja, en
Cosmos SDK-kedja med CometBFT-konsensus. Bitsocials närmaste produkt är [Seedit](/apps/seedit/), en
app i Reddit-stil på Bitsocial-nätverket, så jämförelsen handlar mest om hur var och en är värd för,
äger och modererar communityer.

## Hur Mirage fungerar

- **Noder.** En Mirage-nod är en enda Docker-container som rymmer en validator, en
  PostgreSQL-databas, en indexerare, ett HTTP-API och webbgränssnittet. Varje nod är också en
  validator. För att driva en krävs en Ubuntu-server på amd64 och 10 000 000 MIRAGE-tokens på
  operatörens konto, enligt
  [driftsättningsguiden](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Publicering.** Webbläsaren signerar varje handling med användarens secp256k1-nyckel, och
  gratisanvändare beräknar dessutom ett litet proof of work. Noden lägger in handlingen i en
  kedjetransaktion och betalar avgiften.
- **Läsning.** Varje nods indexerare kopierar kedjedata till sin egen databas och levererar flöden
  över ett HTTP-API. Noder behåller ungefär en veckas block, så den långsiktiga inläggshistoriken
  finns i varje nods databas, och en ny nod startar utan historiken från tiden före sin
  synkroniseringspunkt.
- **Konton.** Ett konto är en nyckel som härleds från en seed-fras på 12 ord, och samma seed
  fungerar på vilken nod som helst. Användarnamn registreras på kedjan och är unika i hela
  nätverket.
- **Communityer.** Varje giltigt namn är redan en community, och ingen äger det. Betalda kuratorteam
  på upp till tio användare var underhåller var sin modererad vy av en community; läsarna väljer ett
  teams vy, nodens standardvy eller en ocensurerad vy. Se [Mirage FAQ](https://mirage.talk/faq).
- **Token.** MIRAGE-token betalar för prenumerationer, belönar författare och noder och ger
  validatorer röstvikt i styrningen. Prenumeranter slipper proof of work och får högre gränser.

## Där de skiljer sig åt

### Vem som äger en community

I Seedit har den som skapar en community dess nyckelpar, kör eller delegerar dess nod och modererar
den. I Mirage äger ingen en community: konkurrerande kuratorteam erbjuder modererade vyer av samma
namn, och standardvyn är det team som flest betalande prenumeranter har valt.

### Spamskydd

Mirage tillämpar en och samma regel i hela nätverket: gratisanvändare betalar med proof of work vars
svårighetsgrad anpassas efter den inkommande volymen, och prenumeranter slipper det. I Bitsocial
väljer varje community sin egen utmaning, från captchor till tillåtelselistor och betalningar. Se
[Anpassade anti-spam-utmaningar](/custom-challenges/).

### Infrastruktur

Mirage behöver en blockkedja. Validatorer når konsensus om varje handling, och varje nod kör en
fullständig serverstack och måste hålla en stor stake i tokens. Bitsocial har ingen kedja: en
communitynod körs på vanlig konsumenthårdvara från skrivbordsappen eller `bitsocial-cli`, och läsare
kan hjälpa till att dela innehåll.

### Kontroll över hela nätverket

Mirage har styrning på kedjan som viktas efter validatorernas stake. Den kan ändra svårighetsgrad,
priser och tokenutgivning, skapa eller bränna tokens och utse administratörer vars raderingar
referensindexeraren tillämpar på vilket inlägg som helst. Kedjekoden låter också styrningen
[radera konton](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
och
[skicka tokens från vilken adress som helst](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
I oktober 2026 producerades kedjans block av fyra validatorer, och projektets egna driftrutiner
hanterade alla fyra.

Bitsocial har ingen administratör på protokollnivå. Communityägare modererar sina egna communityer
och appar väljer vad de visar. Se [Lokal moderation, inte globala förbud](/local-moderation/).

### Webbläsare

Mirages webbklient är en HTTP-klient till en nod: webbläsaren signerar handlingar men ansluter inte
till ett peer-to-peer-nätverk. Bitsocial-appar kan köra en peer-to-peer-nod i webbläsarfliken. Se
[Peer-to-peer i webbläsaren](/browser-p2p/).

## Jämförelse

| Fråga                  | Mirage                                                                                                                                     | Bitsocial                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Kategori               | Forum på en egen blockkedja (Cosmos SDK)                                                                                                   | Peer-to-peer-nätverk av communityer                                                                      |
| Identitet              | secp256k1-nyckel från en seed-fras på 12 ord, med ett användarnamn på kedjan                                                               | Ed25519-nyckelpar för användare och communityer                                                          |
| Var inläggen finns     | Kedjetransaktioner, därefter varje nods PostgreSQL-databas                                                                                 | Communityägarens nod och de peers som läser och seedar den                                               |
| Vem håller det uppe    | Validatornoder som var och en håller 10 000 000 MIRAGE                                                                                     | Communityns ägarnod plus hjälpande seeders                                                               |
| Communityer            | Namn utan ägare med konkurrerande betalda kuratorteam                                                                                      | Ägs av ett nyckelpar; ägarens nod accepterar eller avvisar inlägg                                        |
| Spamskydd              | Proof of work i hela nätverket; prenumeranter slipper det                                                                                  | Varje communitys utmaning innan ett inlägg accepteras                                                    |
| Moderering             | Kuratorteamens vyer, personliga filter, administratörer utsedda av styrningen                                                              | Communityägare modererar sin community; appar väljer vad de visar                                        |
| Ekonomi                | MIRAGE-token för prenumerationer, belöningar och validatorernas stake                                                                      | Ingen i protokollet; en utmaning kan kräva en betalning eller token                                      |
| Webbläsare             | HTTP-klient till en nod                                                                                                                    | Peer-to-peer-nod i en vanlig webbläsarflik                                                               |
| Viktigaste avvägningen | Ett gemensamt, ordnat tillstånd och enkel registrering, men en liten uppsättning validatorer och styrningsbefogenheter över hela nätverket | Ingen kedja eller stake behövs, men ingen global ordning och gammalt innehåll garanteras inte för alltid |
