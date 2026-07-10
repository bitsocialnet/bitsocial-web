---
title: En komplett lekmannaförklaring av Bitsocial-protokollet
description: En vanlig engelsk genomgång av Bitsocial-gemenskaper, peer lookup, publicering, anti-spam-utmaningar, moderering och appar.
---

# En komplett lekmannaförklaring av Bitsocial-protokollet

Den här sidan förklarar Bitsocial utan att anta att du redan förstår peer-to-peer-nätverk, kryptografiska nycklar, IPFS eller pubsub.

Vissa detaljer förenklas med avsikt. För den mer tekniska versionen, läs sidan [Peer-to-Peer-protokoll](./peer-to-peer-protocol.md).

## Den korta versionen

Bitsocial är ett protokoll för sociala appar där gemenskaper ägs av nycklar istället för av en företagsdatabas.

En Bitsocial-gemenskap har en adress. Appar använder den adressen för att hitta kamrater som betjänar gemenskapen, hämta de senaste inläggen från dessa kamrater och publicera nya inlägg via en peer-to-peer-meddelandekanal. Innan ett inlägg accepteras kan communityn kräva en antispam-utmaning som en captcha, inbjudningskod, betalning, tokencheck, AI-modereringskontroll, godkännandelista eller någon annan regel som kan kodas.

Det är kärntanken:

1. En gemenskap styrs av en privat nyckel.
2. Den publika nyckeln ger samhället en stabil adress.
3. Peers hjälper läsare att hitta och hämta communityn.
4. En communitynod accepterar eller avvisar nya inlägg.
5. Anti-spam policy tillhör varje gemenskap, inte till en global plattform.

## Varför hash spelar roll

En hash är ett kort fingeravtryck för data.

Om två personer hash exakt samma fil får de samma fingeravtryck. Om filen ändras ändras fingeravtrycket. Det gör hash användbara för att hitta och kontrollera data utan att lita på att ett företag berättar vad filen är.

Peer-to-peer-system använder denna idé konstant. Istället för att be en webbplats om "filen med namnet photo.png", kan en peer be nätverket om data med ett specifikt fingeravtryck. Om en annan peer returnerar fel data misslyckas hashkontrollen.

Bitsocial använder hash- och innehållsidentifierare för inläggsdata och andra delar av gemenskapstillstånd. Den viktiga punkten är enkel: data kan adresseras utifrån vad det är, inte bara var ett företag var värd för det.

## Varför offentliga nycklar är viktiga

En offentlig nyckel och en privat nyckel är ett matchat par.

Den privata nyckeln är hemlig. Det är det som ger kontroll. Den offentliga nyckeln är säker att dela. Det låter alla andra kontrollera att ett meddelande, uppdatering eller moderering verkligen kom från den matchande privata nyckeln.

Så här undviker Bitsocial vanliga plattformskonton. Ett företag behöver inte utfärda identiteten. En databasrad behöver inte definiera ägaren. Nyckelparet är auktoriteten.

I klartext:

- den privata nyckeln är ägarens kontrollhandtag
- den publika nyckeln är den offentliga identiteten eller adressen
- underskrifter bevisar att en åtgärd kom från ägaren

## Vad en Bitsocial-gemenskap är

En Bitsocial-gemenskap är inte bara en sida i en app.

Den har ett eget nyckelpar. Den publika nyckeln ger gemenskapen en stabil nätverksadress. Den privata nyckeln styr uppdateringar av gemenskapens tillstånd, såsom metadata, regler, moderatorlista, utmaningskonfiguration och pekarna till det senaste accepterade innehållet.

Det betyder att en gemenskap kan överleva ett gränssnitt. En app kan visa den som en tavla. En annan app kan visa den som ett forum. En framtida app kan visa det i ett profilbaserat flöde. Appen kan ändras, men communityadressen pekar fortfarande på samma ägda community.

## Hur läsning fungerar

När en användare öppnar en Bitsocial-gemenskap frågar appen inte en central databas för sidan.

Flödet är närmare detta:

1. Appen känner redan till communityadressen eller hämtar den från en lista, länk, sökyta eller
   mänskligt läsbart namn.
2. Appen frågar lättviktsroutrar vilka kamrater som för närvarande tillhandahåller den communityadressen.
3. Routrarna returnerar endast peer-adresser. De returnerar inte inlägg, regler, profiler eller community
   metadata.
4. Appen ansluter till kamrater och hämtar den senaste gemenskapsstatusen.
5. Det tillståndet innehåller pekare för att lägga upp innehåll.
6. Appen hämtar inläggets innehåll från kamrater och renderar det i ett normalt socialt gränssnitt.

Routern är bara en uppslagshjälp. Det är närmare att fråga "vem har det här?" än att fråga "vänligen servera mig hela webbplatsen."

För mer detaljer om denna uppdelning, läs [Innehållsupptäckt](./content-discovery.md).

## Hur inlägg fungerar

Inlägg skiljer sig från att läsa eftersom öppna peer-to-peer-nätverk kan spammas.

Bitsocial hanterar publicering genom ett utmaning-svar-flöde:

1. Användaren skriver ett inlägg eller svar.
2. Appen ansluter sig till gemenskapens peer-to-peer-meddelandeämne.
3. Appen ber communitynoden om en utmaning.
4. Communitynoden skickar tillbaka utmaningen.
5. Användaren eller appen slutför utmaningen.
6. Appen skickar inlägget plus utmaningssvaret.
7. Communitynoden kontrollerar svaret och inlägget.
8. Om den godkänns accepterar communitynoden inlägget till nästa uppdatering av communityn.
9. Andra läsare hämtar det uppdaterade gemenskapstillståndet från kamrater.

Utmaningen sker innan tjänsten blir en del av den accepterade samhällsstaten. Det är den viktiga skillnaden från system där skräppost accepteras först och döljs senare.

## Varför anti-spam-utmaningar är viktiga

De flesta sociala plattformar förvandlar anti-spam till plattformspolicy. Ett företag bestämmer vad som räknas som ett giltigt konto, giltigt inlägg, giltig räckvidd eller giltig användare.

Bitsocial skiljer dessa saker åt. Protokollet ger gemenskaper ett sätt att kräva en utmaning innan de accepterar ett inlägg, men det tvingar inte alla gemenskaper att använda samma utmaning.

En grupp kan använda en captcha. En annan kan använda inbjudningskoder. En annan kan kräva en sms-check, en betalning, en NFT, ett tokensaldo, en AI-modereringspoäng, ett bevis på rykte, en communityspecifik godkännandelista eller en anpassad regel.

Den flexibiliteten är viktig eftersom skräpposten ändras. En skräppostregel på protokollnivå blir inaktuell. En utmaning på gemenskapsnivå kan utvecklas utan att migrera hela nätverket.

För den fokuserade förklaringen, läs [Anpassade anti-spam-utmaningar](./custom-challenges.md).

## Hur moderering fungerar

Bitsocial är inte modereringsfritt. Det är moderering utan en global superadmin.

En grupp kan ha ägare och moderatorer. Moderatoradresser är en del av samhällsstaten. När en moderator vidtar en åtgärd kan den åtgärden signeras. Gemenskapsnoden och klienterna kan kontrollera signaturen mot moderatorlistan.

Det ger moderering en lokal räckvidd:

- en gemenskapsägare kontrollerar denna gemenskap
- moderatorer agerar genom nycklar som communityn känner igen
- appar kan fortfarande välja vad de indexerar, rangordnar, döljer eller markerar
- inget företagskonto på protokollnivå kan radera varje identitet eller beslagta varje gemenskap

I praktiken innebär detta att en community kan ta bort skräppost eller genomdriva regler i sitt eget utrymme utan att förvandla dess regler till lag för hela nätverket.

För policysynen, läs [Lokal moderation, inte globala förbud](./local-moderation.md).

## Vilka appar lägger till

Protokollet bestämmer inte hur hela produkten ska se ut.

En app lägger till den mänskliga upplevelsen kring protokollet:

- standardgrupplistor
- sökning och upptäckt
- flöden och rangordning
- layout och inläggsgränssnitt
- mediehantering
- modereringsverktyg
- mobil-, dator- eller webbläsarpaket
- affärsmodell och standarder

Det är därför Bitsocial kan stödja olika appstilar. 5chan kan kännas som en bildtavla. Seedit kan kännas som diskussion i forumstil. Andra klienter kan bygga olika upptäcktsytor, rankningssystem, modereringsvyer eller gemenskapsstandarder medan de fortfarande använder kompatibla Bitsocial-gemenskaper under.

Protokollet håller ägande och publicering portabel. Appar konkurrerar om produktkvalitet.

## Vad offentlig RPC lägger till

Att köra en peer-to-peer-gemenskapsnod direkt är kraftfullt, men alla vill inte hantera en alltid-på-maskin.

Public RPC är tjänsteskiktet som kan göra Bitsocial bekvämare. En offentlig RPC-leverantör kan hjälpa användare att hantera gemenskaper från en telefon eller lättviktsklient, medan den långsiktiga ägarmodellen fortfarande bör låta användare flytta bort, vara värd eller välja en konkurrerande leverantör.

Distinktionen spelar roll:

- RPC kan hjälpa till med drifttid och bekvämlighet
- RPC ska inte bli permanent vårdnad
- Ägarförhållandet bör förbli knutet till nycklar, inte till en leverantörs databas

## Vad Bitsocial inte är

Bitsocial är inte ett socialt blockchain-nätverk. Sociala medier behöver inte varje inlägg för att bli en transaktion i en global reskontra.

Bitsocial är inte federation i ActivityPub-bemärkelsen. En gemenskap behöver inte vara ett konto på en server med en domän, en admin och en serverdatabas.

Bitsocial är inte heller en app. Det är ett delat protokolllager för appar, gemenskaper, noder, routrar, RPC-leverantörer, upptäcktstjänster, anti-spam-moduler och modereringsverktyg.

Poängen är inte att alla användare behöver förstå allt detta innan de postar. Poängen är att produkten kan kännas normal medan ägarmodellen under är annorlunda.

## Vart ska man gå härnäst

- [Peer-to-Peer-protokoll](./peer-to-peer-protocol.md) förklarar det tekniska flödet.
- [Innehållsupptäckt](./content-discovery.md) förklarar nätverkssökning kontra appkurering.
- [Anpassade anti-spam-utmaningar](./custom-challenges.md) förklarar utmaningssystemet.
- [Identitet och gemenskapsägande](./identity-and-ownership.md) förklarar nyckelkontrollerad
  ägande.
- [Bygg din egen kund](/build-your-own-client/) förklarar hur oberoende appar kan bygga vidare på
  samma nätverk.
