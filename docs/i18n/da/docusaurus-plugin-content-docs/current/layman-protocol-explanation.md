---
title: En komplet lægmandsforklaring af Bitsocial-protokollen
description: En almindelig engelsk gennemgang af Bitsocial-fællesskaber, peer-opslag, publicering, anti-spam-udfordringer, moderation og apps.
---

# En komplet lægmandsforklaring af Bitsocial-protokollen

Denne side forklarer Bitsocial uden at antage, at du allerede forstår peer-to-peer-netværk, kryptografiske nøgler, IPFS eller pubsub.

Nogle detaljer er forenklet med vilje. For den mere tekniske version, læs siden [Peer-to-Peer-protokol](./peer-to-peer-protocol.md).

## Den korte version

Bitsocial er en protokol til sociale apps, hvor fællesskaber ejes af nøgler i stedet for af en virksomhedsdatabase.

Et Bitsocial-fællesskab har en adresse. Apps bruger denne adresse til at finde peers, der tjener fællesskabet, hente de seneste indlæg fra disse peers og udgive nye indlæg via en peer-to-peer-meddelelseskanal. Før et indlæg accepteres, kan fællesskabet kræve en anti-spam-udfordring, såsom en captcha, invitationskode, betaling, tokencheck, AI-modereringstjek, tilladelsesliste eller enhver anden regel, der kan kodes.

Det er kerneideen:

1. Et fællesskab styres af en privat nøgle.
2. Den offentlige nøgle giver samfundet en stabil adresse.
3. Peers hjælper læserne med at finde og hente fællesskabet.
4. En fællesskabsknude accepterer eller afviser nye indlæg.
5. Anti-spampolitik tilhører hvert fællesskab, ikke én global platform.

## Hvorfor hash betyder noget

En hash er et kort fingeraftryk for data.

Hvis to personer hash nøjagtig den samme fil, får de det samme fingeraftryk. Hvis filen ændres, ændres fingeraftrykket. Det gør hashes nyttige til at finde og kontrollere data uden at stole på, at en virksomhed fortæller dig, hvad filen er.

Peer-to-peer-systemer bruger denne idé konstant. I stedet for at bede et websted om "filen med navnet photo.png", kan en peer bede netværket om dataene med et specifikt fingeraftryk. Hvis en anden peer returnerer de forkerte data, mislykkes hashkontrollen.

Bitsocial bruger hashes og indholdsidentifikatorer til postdata og andre dele af fællesskabstilstanden. Den vigtige pointe er enkel: data kan adresseres efter, hvad de er, ikke kun efter, hvor en virksomhed hostede dem.

## Hvorfor offentlige nøgler betyder noget

En offentlig nøgle og en privat nøgle er et matchet par.

Den private nøgle er hemmelig. Det er det, der giver kontrol. Den offentlige nøgle er sikker at dele. Det lader alle andre kontrollere, at en besked, opdatering eller modereringshandling virkelig kom fra den matchende private nøgle.

Sådan undgår Bitsocial normale platformskonti. En virksomhed behøver ikke at udstede identiteten. En databaserække behøver ikke at definere ejeren. Nøgleparret er autoriteten.

I klare vendinger:

- den private nøgle er ejerens kontrolhåndtag
- den offentlige nøgle er den offentlige identitet eller adresse
- underskrifter beviser, at en handling kom fra ejeren

## Hvad er et Bitsocial-fællesskab

Et Bitsocial-fællesskab er ikke bare en side i én app.

Den har sit eget nøglepar. Den offentlige nøgle giver fællesskabet en stabil netværksadresse. Den private nøgle styrer opdateringer af fællesskabets tilstand, såsom metadata, regler, moderatorliste, udfordringskonfiguration og pejlemærkerne til det seneste accepterede indhold.

Det betyder, at et fællesskab kan overleve én grænseflade. Én app kan vise den som en tavle. En anden app kan vise det som et forum. En fremtidig app kan vise det i et profilbaseret feed. Appen kan ændres, men fællesskabsadressen peger stadig på det samme ejede fællesskab.

## Sådan fungerer læsning

Når en bruger åbner et Bitsocial-fællesskab, beder appen ikke én central database om siden.

Strømmen er tættere på dette:

1. Appen kender allerede fællesskabsadressen eller henter den fra en liste, et link, en søgeflade eller
   navn, der kan læses af mennesker.
2. Appen spørger letvægtsroutere, hvilke peers, der i øjeblikket leverer denne fællesskabsadresse.
3. Routerne returnerer kun peer-adresser. De returnerer ikke opslag, regler, profiler eller fællesskaber
   metadata.
4. Appen opretter forbindelse til jævnaldrende og henter den seneste fællesskabstilstand.
5. Denne tilstand indeholder henvisninger til indlægsindhold.
6. Appen henter indlægsindholdet fra jævnaldrende og gengiver det i en normal social grænseflade.

Routeren er kun en opslagshjælper. Det er tættere på at spørge "hvem har det her?" end at spørge "vær venlig at servere mig hele hjemmesiden."

For flere detaljer om denne opdeling, læs [Opdagelse af indhold](./content-discovery.md).

## Sådan fungerer opslag

Postering er anderledes end læsning, fordi åbne peer-to-peer-netværk kan blive spammet.

Bitsocial håndterer publicering gennem et udfordring-svar-flow:

1. Brugeren skriver et indlæg eller svar.
2. Appen slutter sig til fællesskabets peer-to-peer beskedemne.
3. Appen beder fællesskabsknuden om en udfordring.
4. Fællesskabsknuden sender udfordringen tilbage.
5. Brugeren eller appen fuldfører udfordringen.
6. Appen sender opslaget plus udfordringssvaret.
7. Fællesskabsknuden tjekker svaret og indlægget.
8. Hvis det går igennem, accepterer fællesskabsknuden indlægget i fællesskabets næste opdatering.
9. Andre læsere henter den opdaterede fællesskabstilstand fra jævnaldrende.

Udfordringen sker, før stillingen bliver en del af den accepterede samfundsstat. Det er den vigtige forskel fra systemer, hvor spam accepteres først og skjules senere.

## Hvorfor anti-spam udfordringer betyder noget

De fleste sociale platforme gør anti-spam til platformspolitik. Én virksomhed bestemmer, hvad der tæller som en gyldig konto, gyldigt indlæg, gyldig rækkevidde eller gyldig bruger.

Bitsocial adskiller disse ting. Protokollen giver fællesskaber en måde at kræve en udfordring, før de accepterer et indlæg, men den tvinger ikke alle fællesskaber til at bruge den samme udfordring.

Et fællesskab kan bruge en captcha. En anden bruger muligvis invitationskoder. En anden kan kræve en sms-check, en betaling, en NFT, en token-saldo, en AI-moderationsscore, et bevis på omdømme, en fællesskabsspecifik tilladelsesliste eller en tilpasset regel.

Den fleksibilitet betyder noget, fordi spam ændrer sig. En spamregel på protokolniveau bliver forældet. En udfordring på fællesskabsniveau kan udvikle sig uden at migrere hele netværket.

For den fokuserede forklaring, læs [Tilpassede anti-spam udfordringer](./custom-challenges.md).

## Hvordan moderering virker

Bitsocial er ikke moderationsfri. Det er moderation uden én global superadministrator.

Et fællesskab kan have ejere og moderatorer. Moderatoradresser er en del af samfundsstaten. Når en moderator udfører en handling, kan denne handling underskrives. Fællesskabets node og klienter kan kontrollere signaturen mod moderatorlisten.

Det giver moderation et lokalt omfang:

- en fællesskabsejer kontrollerer dette fællesskab
- moderatorer handler gennem nøgler, som fællesskabet genkender
- apps kan stadig vælge, hvad de indekserer, rangerer, skjuler eller fremhæver
- ingen virksomhedskonto på protokolniveau kan slette enhver identitet eller beslaglægge ethvert fællesskab

I praksis betyder det, at et fællesskab kan fjerne spam eller håndhæve regler i sit eget rum uden at gøre dets regler til lov for hele netværket.

For politikvisningen, læs [Lokal moderation, ikke globalt forbud](./local-moderation.md).

## Hvilke apps tilføjer

Protokollen bestemmer ikke, hvordan hele produktet skal se ud.

En app tilføjer den menneskelige oplevelse omkring protokollen:

- standard fællesskabslister
- søgning og opdagelse
- feeds og rangering
- layout og opslagsgrænseflade
- mediehåndtering
- moderationsværktøjer
- mobil-, desktop- eller browserpakke
- forretningsmodel og standarder

Derfor kan Bitsocial understøtte forskellige app-stile. 5chan kan føles som et imageboard. Seedit kan føles som diskussion i forumstil. Andre klienter kan bygge forskellige opdagelsesflader, rangordningssystemer, moderationsvisninger eller fællesskabsstandarder, mens de stadig bruger kompatible Bitsocial-fællesskaber nedenunder.

Protokollen holder ejerskab og publicering bærbar. Apps konkurrerer på produktkvalitet.

## Hvad offentlig RPC tilføjer

Det er effektivt at køre en peer-to-peer-fællesskabsknude direkte, men det er ikke alle, der ønsker at administrere en altid tændt maskine.

Offentlig RPC er servicelaget, der kan gøre Bitsocial mere bekvemt. En offentlig RPC-udbyder kan hjælpe brugere med at administrere fællesskaber fra en telefon eller letvægtsklient, mens den langsigtede ejerskabsmodel stadig skal lade brugere flytte væk, selv hoste eller vælge en konkurrerende udbyder.

Forskellen er vigtig:

- RPC kan hjælpe med oppetid og bekvemmelighed
- RPC bør ikke blive permanent forældremyndighed
- ejerforholdet skal forblive bundet til nøgler, ikke til én udbyders database

## Hvad Bitsocial ikke er

Bitsocial er ikke et socialt blockchain-netværk. Sociale medier behøver ikke hvert indlæg for at blive en transaktion i én global hovedbog.

Bitsocial er ikke føderation i ActivityPub-forstand. Et fællesskab behøver ikke at være en konto på én server med ét domæne, én admin og én serverdatabase.

Bitsocial er heller ikke én app. Det er et delt protokollag for apps, fællesskaber, noder, routere, RPC-udbydere, opdagelsestjenester, anti-spam-moduler og moderationsværktøjer.

Pointen er ikke, at alle brugere skal forstå alt dette, før de poster. Pointen er, at produktet kan føles normalt, mens ejerskabsmodellen nedenunder er anderledes.

## Hvor skal man hen næste gang

- [Peer-to-Peer-protokol](./peer-to-peer-protocol.md) forklarer det tekniske flow.
- [Opdagelse af indhold](./content-discovery.md) forklarer netværksopslag versus appkuration.
- [Tilpassede anti-spam udfordringer](./custom-challenges.md) forklarer udfordringssystemet.
- [Identitet og fællesskabsejerskab](./identity-and-ownership.md) forklarer nøglestyret
  ejerskab.
- [Byg din egen klient](/build-your-own-client/) forklarer, hvordan uafhængige apps kan bygge videre på
  det samme netværk.
