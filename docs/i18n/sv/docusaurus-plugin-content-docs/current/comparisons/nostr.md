---
title: Bitsocial och Nostr
description: Hur Nostrs reläbaserade modell står sig mot Bitsocials peer-to-peer-communityer, från dataväg och identitet till grupper, spamskydd och moderering.
---

# Bitsocial och Nostr

Nostr passar inte prydligt in i facken för federerade eller blockkedjebaserade system. Användare
tilldelas inte konton av instanser, och det finns varken kedja, konsensus, gas eller global ordning.
Nostr beskrivs bättre som **reläbaserade sociala medier**: användarna har nyckelpar, signerar
händelser och publicerar dem till reläer, som är vanliga servrar som lagrar och levererar dem
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Nostrs egen
[README](https://github.com/nostr-protocol/nostr) säger att protokollet inte bygger på
peer-to-peer-tekniker.

Det placerar Nostr närmare Bitsocial än federerade eller blockkedjebaserade system på en viktig
punkt: identiteten är kryptografisk och portabel. Skillnaderna ligger i datalagret och i vem som
vaktar porten.

## Hur Nostr fungerar

- **Händelser och reläer.** Varje inlägg, profil eller reaktion är en signerad JSON-händelse.
  Klienter publicerar händelser till reläer över WebSockets och prenumererar med filter; reläerna
  lagrar händelserna och levererar dem tillbaka. Reläer kommunicerar inte med varandra.
- **Replikering.** Användare publicerar oftast till flera reläer. En studie av 712 reläer 2023 fann
  att ett genomsnittligt inlägg fanns på 34,6 av dem
  ([Wei and Tyson](https://arxiv.org/abs/2402.05709)).
- **Att hitta någons inlägg.** Användare publicerar en lista över de reläer de skriver till och
  läser från ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), och klienter
  hämtar en användares inlägg från den användarens skrivreläer.
- **Identitet.** Varje användare är en secp256k1-nyckel som signerar med Schnorr-signaturer.
  Specifikationerna definierar varken nyckelrotation eller återställning, så en förlorad nyckel är
  ett förlorat konto. Valfria `name@domain`-identifierare
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) kontrolleras mot en fil på
  domänens webbserver.
- **Grupper.** Den rekommenderade mekanismen för communityer är reläbaserade grupper
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): ett relä är värd för en
  grupp, upprätthåller dess regler för medlemskap och publicering innan det accepterar ett inlägg
  och signerar gruppens metadata. De äldre moderatorgodkända communityerna
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) är nu markerade som inte
  rekommenderade till förmån för NIP-29.
- **Spamskydd.** Varje relä väljer sin egen spärr: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autentisering och
  tillåtelselistor ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), betalning
  eller frekvensbegränsningar. Klienter lägger till ignoreringslistor och förtroendepoäng.
- **Media.** Bilder och video laddas upp till separata HTTP-filservrar.

## Där de skiljer sig åt

### Vem som lagrar och levererar inlägg

I Nostr är reläerna lagrings- och leveranslagret: en server måste hålla varje inlägg online. I
Bitsocial hjälper HTTP-routrar bara klienter att hitta peers. De lagrar varken inlägg, profiler,
community-metadata eller modereringstillstånd; klienterna hämtar innehållet från communityns nod och
de peers som seedar det. Se [Peer-to-peer-protokoll](/peer-to-peer-protocol/).

### Vem som vaktar porten

I Nostr är det reläoperatörerna som bestämmer vad som får skrivas. Utanför NIP-29-grupper kan en
nyckel som avvisas av ett relä publicera samma händelse till vilket relä som helst som accepterar
den, och vad läsarna ser beror på vilka reläer deras klient läser från. En NIP-29-grupp ligger
närmare en Bitsocial-community: dess värdrelä accepterar eller avvisar inlägg. Reläet definierar
ändå vad grupproller får göra, och gruppens historik förblir knuten till det reläet om inte ett
annat relä går med på att ta över den.

I Bitsocial är en community ett kryptografiskt objekt med ett eget nyckelpar. Communityns nod kör
den utmaning som ägaren väljer och publicerar det accepterade tillståndet till
peer-to-peer-nätverket. Se [Anpassade anti-spam-utmaningar](/custom-challenges/).

### Att driva infrastrukturen

Ett relä är en server med en domän och en WebSocket-slutpunkt, och populära reläer bär lagrings- och
bandbreddskostnaden för det de levererar. Studien från 2023 uppskattade att omkring 95 % av de
kostnadsfria reläerna inte kunde täcka sina kostnader med donationer. En Bitsocial-communitynod körs
på vanlig konsumenthårdvara, och peers som läser en community kan hjälpa till att dela den.

### Webbläsare

En webbklient för Nostr öppnar WebSocket-anslutningar direkt till reläer, så ingen appserver behövs.
En Bitsocial-webbapp kör en peer-to-peer-nod i fliken och hämtar innehåll från peers. Se
[Peer-to-peer i webbläsaren](/browser-p2p/).

### Gammalt innehåll

Nostr-inlägg replikeras brett över reläer, vilket hjälper gamla inlägg att överleva. Bitsocial
behåller communityns senaste tillstånd och garanterar inte gammalt innehåll för alltid.

## Jämförelse

| Fråga                  | Nostr                                                                                                | Bitsocial                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Kategori               | Reläbaserat protokoll                                                                                | Peer-to-peer-nätverk av communityer                                  |
| Identitet              | Användarnyckel med secp256k1, utan rotation i specifikationerna                                      | Ed25519-nyckelpar för användare och communityer                      |
| Var inläggen finns     | Reläer som författaren väljer, ofta många                                                            | Communityägarens nod och de peers som läser och seedar den           |
| Vem håller det uppe    | Reläoperatörer                                                                                       | Communityns ägarnod plus hjälpande seeders                           |
| Communityer            | Reläbaserade grupper (NIP-29)                                                                        | Förstklassiga objekt vars nod accepterar eller avvisar inlägg        |
| Spamskydd              | Varje reläs policy: proof-of-work, autentisering, betalning, tillåtelselistor, frekvensbegränsningar | Varje communitys utmaning innan ett inlägg accepteras                |
| Moderering             | Reläpolicyer, ignoreringslistor i klienter, etiketter och rapporter                                  | Communityägare modererar sin community; appar väljer vad de visar    |
| Namn                   | Valfria `name@domain`-identifierare som kontrolleras över HTTPS                                      | `.bso`- och `.eth`-namn som löses upp till nycklar                   |
| Webbläsare             | WebSocket-klient till reläer                                                                         | Peer-to-peer-nod i en vanlig webbläsarflik                           |
| Viktigaste avvägningen | Portabel identitet och bred replikering, men tillgänglighet och policy beror på reläer               | Mindre reläberoende, men gammalt innehåll garanteras inte för alltid |
