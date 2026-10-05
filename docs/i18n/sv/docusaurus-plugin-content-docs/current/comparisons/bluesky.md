---
title: Bitsocial och Bluesky
description: Hur Bluesky och AT Protocol, med personliga dataservrar, reläer och AppViews, står sig mot Bitsocials peer-to-peer-communityer.
---

# Bitsocial och Bluesky

[Bluesky](https://bsky.app/) är en mikrobloggapp byggd på [AT Protocol](https://atproto.com/), som
Bluesky Social PBC har utformat. Protokollet delar upp ett socialt nätverk i separata tjänster:
personliga dataservrar är värdar för konton, reläer samlar dem i en enda ström och AppViews
indexerar den strömmen till de flöden och trådar som folk ser. Dokumentationen beskriver kontodata
som lagrade på värdservrar, ”i motsats till en peer-to-peer-modell”
([översikt](https://atproto.com/guides/overview)).

## Hur AT Protocol fungerar

- **Arkiv på servrar.** Varje inlägg, gillamarkering eller följning är en post i författarens
  signerade arkiv (repository), som ligger på en personlig dataserver (PDS). Bluesky driver
  standardservrarna, och vem som helst kan vara värd för sin egen.
- **Reläer.** Reläer prenumererar på varje PDS och sänder vidare ändringarna som en enda ström,
  firehose. Sedan en protokolluppdatering 2025 arkiverar de inte längre varje arkiv, vilket gjorde
  dem mycket billigare att driva ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** En AppView indexerar hela firehose-strömmen och levererar flöden, fullständiga
  svarstrådar, räknare och sökning. Det är den mest resurskrävande delen av nätverket.
- **Identitet.** Ett konto är en DID: oftast `did:plc`, registrerad i en enda global katalog, eller
  `did:web`, knuten till en domän. DID-dokumentet anger kontots handle, signeringsnyckel och
  nuvarande server. PDS:en har signeringsnyckeln; `did:plc` låter också användare ha egna
  rotationsnycklar så att de kan flytta utan hjälp från den gamla värden
  ([identitetsguide](https://atproto.com/guides/identity)).
- **Handles.** Handles är DNS-namn, som `alice.bsky.social` eller en domän som användaren äger, och
  verifieras mot DID:en.
- **Moderering.** Hosting och räckvidd är separata lager. Vem som helst kan driva en
  etiketteringstjänst (labeler) och användare kan kombinera flera
  ([modereringsguide](https://atproto.com/guides/moderation)), men Bluesky-appen tillämpar alltid
  Blueskys egen moderering. Författare kan begränsa vem som får svara på deras inlägg och dölja
  svar.

## Där de skiljer sig åt

### Servrar eller peers

Blueskys data finns på servrar: en PDS är värd för varje konto, reläer för vidare firehose-strömmen
och AppViews levererar det som klienterna visar. En webbläsare är en HTTP-klient till de tjänsterna,
aldrig en peer. I Bitsocial levereras innehållet av communityns nod och de peers som läser den, och
en webbapp kan köra en egen peer-to-peer-nod. Se [Peer-to-peer i webbläsaren](/browser-p2p/).

### En global vy eller communityer

AT Protocol är utformat för en enda global vy: en AppView ser varje svar, så trådar och sökning är
fullständiga. Bitsocial har inget globalt index; varje community publicerar sitt eget tillstånd, och
appar bygger upptäckt ovanpå det. Se [Innehållsupptäckt](/content-discovery/).

Bluesky har i dag inget community-objekt för offentliga inlägg. I juni 2026
[tillkännagav företaget inbyggda communityer](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k)
där publicering kräver godkännande på vissa sekretessnivåer; de hade inte lanserats i oktober 2026.
I Bitsocial är communityer det centrala objektet, och en communitys nod accepterar eller avvisar
inlägg.

### Spamskydd

Bluesky hanterar spam med frekvensbegränsningar på sina servrar, begränsningar för nya värdar i
reläet, automatisk upptäckt, manuell granskning och etiketter, och författare kan begränsa svar. Det
finns ingen spärr på community-nivå som avgör vad ett inlägg måste klara innan det accepteras. I
Bitsocial väljer varje community sin egen utmaning. Se
[Anpassade anti-spam-utmaningar](/custom-challenges/).

### Vem som har nycklarna

Konton på Blueskys egna servrar loggar in med lösenord, och de servrarna har kontonas
signeringsnycklar i sitt förvar ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)). Enligt en
protokollingenjör på Bluesky
[har de flesta konton inga självständigt kontrollerade rotationsnycklar](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
En Bitsocial-identitet är ett nyckelpar som genereras och förvaras av användarens app.

### Att driva infrastrukturen

En personlig server är billig: [referens-PDS:en](https://github.com/bluesky-social/pds)
rekommenderar 1 GB RAM för upp till 20 användare. En oberoende AppView för hela nätverket är ett
stort projekt; en som byggdes 2025
[kostade omkring 200 dollar i månaden](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), mest för 16 TB
lagring. Bitsocial har inget globalt index att replikera, och en communitynod körs på vanlig
konsumenthårdvara.

## Jämförelse

| Fråga                  | Bluesky (AT Protocol)                                                                  | Bitsocial                                                               |
| ---------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Kategori               | Federerade servrar med ett globalt index                                               | Peer-to-peer-nätverk av communityer                                     |
| Identitet              | DID, där signeringsnycklarna oftast förvaras av servern                                | Ed25519-nyckelpar för användare och communityer                         |
| Var inläggen finns     | Författarens arkiv på en personlig dataserver                                          | Communityägarens nod och de peers som läser och seedar den              |
| Vem håller det uppe    | PDS-värdar, reläer och AppViews, som standard drivna av Bluesky                        | Communityns ägarnod plus hjälpande seeders                              |
| Communityer            | Inga för offentliga inlägg ännu (tillkännagivna 2026)                                  | Förstklassiga objekt vars nod accepterar eller avvisar inlägg           |
| Spamskydd              | Frekvensbegränsningar på servrar, automatisk upptäckt, etiketter, svarskontroller      | Varje communitys utmaning innan ett inlägg accepteras                   |
| Moderering             | Kombinerbara etiketteringstjänster; Bluesky-appen tillämpar alltid Blueskys moderering | Communityägare modererar sin community; appar väljer vad de visar       |
| Namn                   | DNS-handles som verifieras mot DID:en                                                  | `.bso`- och `.eth`-namn som löses upp till nycklar                      |
| Webbläsare             | HTTP-klient till en PDS och en AppView                                                 | Peer-to-peer-nod i en vanlig webbläsarflik                              |
| Viktigaste avvägningen | Fullständiga globala trådar och sökning, men aggregeringen kräver tunga servrar        | Inget tungt globalt index, men ingen fullständig vy över hela nätverket |
