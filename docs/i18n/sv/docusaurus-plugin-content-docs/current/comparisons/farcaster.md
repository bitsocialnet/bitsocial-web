---
title: Bitsocial och Farcaster
description: Hur Farcaster, med onchain-konton, lagringshyra och validatornätverket Snapchain, står sig mot Bitsocials peer-to-peer-communityer.
---

# Bitsocial och Farcaster

[Farcaster](https://docs.farcaster.xyz/) håller identiteten på en blockkedja och den sociala datan
utanför. Konton, appnycklar och lagringsbetalningar finns i kontrakt på OP Mainnet, ett lager 2 för
Ethereum. Inlägg, så kallade casts, samt följningar och reaktioner är signerade meddelanden som
lagras av [Snapchain](https://snapchain.farcaster.xyz/), ett blockkedjeliknande nätverk som 2025
ersatte Farcasters tidigare Hub-nätverk.

## Hur Farcaster fungerar

- **Konton.** Ett konto är ett numeriskt Farcaster-ID som ägs av en Ethereum-adress, som också kan
  ange en återställningsadress. Appar publicerar med delegerade appnycklar som registrerats onchain;
  en appnyckel kan inte ta över kontot.
- **Lagringshyra.** Varje konto hyr lagringsenheter, för närvarande 0,20 dollar per enhet och år. En
  enhet som hyrts sedan juli 2025 rymmer 100 casts; utöver det rensas de äldsta casts bort.
  Frekvensbegränsningarna växer med den hyrda lagringen.
- **Snapchain.** Validatorer ordnar meddelanden i block med konsensus i Tendermint-stil, och varje
  fullständig nod behåller hela nätverkets data. Noder behöver omkring 16 GB RAM och 2 TB lagring,
  enligt [nodguiden](https://snapchain.farcaster.xyz/getting-started).
- **Namn.** Standardanvändarnamn, så kallade fnames, är gratis och utfärdas av Farcasters egen
  namnserver, som [kan återkalla dem](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames).
  Användare kan i stället använda ett `.eth`-namn som registrerats på Ethereum.
- **Kanaler.** Ämneskanaler är en experimentell funktion i Farcaster-klienten. Casts i en kanal är
  protokolldata, men kanalmetadata, följningar och moderering
  [lagras i klienten](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Läsning.** Appar läser via en Snapchain-nod som de själva driver eller via en hanterad
  leverantör, oftast Neynar.

## Där de skiljer sig åt

### Blockkedjor och validatorer

Farcaster är beroende av OP Mainnet för konton och betalningar, och av Snapchain, ett
blockkedjeliknande nätverk, för att ordna all social data. Snapchains uppsättning validatorer är
tillståndsbaserad (permissioned). Enligt dess whitepaper blir censur svår med omkring tio globalt
distribuerade validatorer; i oktober 2026 var dess
[validatorlista](https://snapchain.farcaster.xyz/validators) kortare än så, och de flesta nycklarna
tillhörde Neynar, som [förvärvade Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster)
i januari 2026. Bitsocial har varken kedja, validatorer eller konsensus.

### Att betala för att publicera

Varje Farcaster-konto betalar lagringshyra, och lagringen sätter ett tak för hur mycket av kontots
historik nätverket behåller. I Bitsocial kostar det ingenting att publicera på protokollnivå; varje
community bestämmer om den ska kräva en captcha, en betalning, en token eller något annat. Se
[Anpassade anti-spam-utmaningar](/custom-challenges/).

### Communityer

Farcaster-kanaler är en klientfunktion: klienten lagrar deras metadata och upprätthåller
kanalmodereringen, så en cast som blockerats i en kanal kan förbli giltig i nätverket och synlig i
andra appar. I Bitsocial är communityer protokollobjekt med ett eget nyckelpar, och communityns nod
accepterar eller avvisar inlägg.

### Att driva infrastrukturen

En Farcaster-nod rymmer hela nätverket, så dess lagring växer med all aktivitet; Farcaster räknar
med en tillväxt mot de största molndiskarna. En Bitsocial-communitynod rymmer bara sina egna
communityer och körs på vanlig konsumenthårdvara.

### Webbläsare

En Farcaster-app i webbläsaren är en HTTP-klient till en nod eller leverantör. En Bitsocial-webbapp
kan köra en peer-to-peer-nod i fliken. Se [Peer-to-peer i webbläsaren](/browser-p2p/).

## Jämförelse

| Fråga                  | Farcaster                                                                             | Bitsocial                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Kategori               | Onchain-identitet med social data som ordnas av validatorer                           | Peer-to-peer-nätverk av communityer                                                                    |
| Identitet              | Farcaster-ID som ägs av en Ethereum-adress, med delegerade appnycklar                 | Ed25519-nyckelpar för användare och communityer                                                        |
| Var inläggen finns     | Snapchain, replikerat på varje fullständig nod, inom betalda lagringsgränser          | Communityägarens nod och de peers som läser och seedar den                                             |
| Vem håller det uppe    | Snapchain-validatorer och nodoperatörer                                               | Communityns ägarnod plus hjälpande seeders                                                             |
| Communityer            | Experimentella kanaler som hanteras av Farcaster-klienten                             | Förstklassiga objekt vars nod accepterar eller avvisar inlägg                                          |
| Spamskydd              | Lagringshyra och frekvensbegränsningar, plus spametiketter på appnivå                 | Varje communitys utmaning innan ett inlägg accepteras                                                  |
| Moderering             | Kanalvärdar i klienten, appfilter, censurrisk på validatornivå                        | Communityägare modererar sin community; appar väljer vad de visar                                      |
| Namn                   | Gratis fnames som Farcaster kan återkalla, eller `.eth`-namn                          | `.bso`- och `.eth`-namn som löses upp till nycklar                                                     |
| Webbläsare             | HTTP-klient till en nod eller leverantör                                              | Peer-to-peer-nod i en vanlig webbläsarflik                                                             |
| Viktigaste avvägningen | En konsekvent global datamängd, men hyra, kedjor och en liten uppsättning validatorer | Inga avgifter eller kedjor, men ingen global datamängd och gammalt innehåll garanteras inte för alltid |
