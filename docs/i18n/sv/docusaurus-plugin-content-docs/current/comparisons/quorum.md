---
title: Bitsocial och Quorum
description: Hur Quorum, Quilibriums totalsträckskrypterade gruppmeddelandeapp med Spaces i Discord-stil, står sig mot Bitsocials offentliga peer-to-peer-communityer.
---

# Bitsocial och Quorum

[Quorum](https://www.quorummessenger.com/) är en gruppmeddelandeapp från Quilibrium Inc., företaget
bakom nätverket [Quilibrium](https://quilibrium.com/). Den är organiserad som Discord, med Spaces,
kanaler, roller och direktmeddelanden, och meddelandena är totalsträckskrypterade. Den nämns i samma
sammanhang som Bitsocial eftersom båda beskriver sig som peer-to-peer och censurresistenta, med
grupper som sätter sina egna regler. De siktar på olika saker: Quorum på privat gruppchatt,
Bitsocial på offentliga communityer som vem som helst kan läsa.

Quilibrium beskriver sig som ett decentraliserat alternativ till molnplattformar: ett nätverk av
noder som förvarar data i en krypterad hypergraf och kommer överens om dess tillstånd genom en
konsensus som Quilibrium kallar Proof of Meaningful Work. Noderna tjänar QUIL, nätverkets token, som
betalar användningsavgifter. Quorum började 2018 som Howler, en idé om ett privat alternativ till
Discord, och blev den första appen som gick live på Quilibrium, enligt
[Quilibriums historia](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc., som
grundades av Cassie Heart, utvecklar protokollet och erbjuder Quorum som en av sina hanterade
tjänster ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Hur Quorum fungerar

Uppgifterna nedan kommer från källkoden till Quorums klienter,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) för webb- och skrivbordsapparna
och [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), så som den såg ut i oktober 2026.

- **Identiteter.** En användares huvudidentitet är en Ed448-nyckeluppsättning, och varje enhet får
  egna X448- och Ed448-nycklar. I webbläsaren skyddas nycklarna normalt av en lösennyckel
  (passkey); mobilappen härleder dem från en återställningsfras. Adresser är hashar som börjar med
  `Qm`, och användare kan visa ett användarnamn från Quilibriums namntjänst.
- **Kryptering.** Direktmeddelanden använder Double Ratchet mellan enheter. En Space delar en enda
  Triple Ratchet-session mellan sina medlemmar, som signerar sina meddelanden med nycklar som är
  specifika för just den Spacen. Varje Space är krypterad. Quorum uppger att dess
  meddelandeförmedling förhindrar att avsändare och mottagare kopplas ihop, men webb- och
  skrivbordsklienten prenumererar på alla inkorgar som hör till en enhet, inklusive den som anges i
  användarens offentliga registrering, i
  [en enda begäran](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/components/context/MessageDB.tsx#L616-L623)
  till tjänsten, som därför kan knyta dem till användarens adress.
- **Att gå med.** Man går med i Spaces via inbjudningslänkar. En engångslänk bär nycklarna för att
  gå med i själva URL:en; en offentlig länk hämtar dem från Quorum-tjänsten, och offentliga Spaces
  kan listas i en sökbar katalog.
- **Transport.** För meddelanden ansluter webb-, skrivbords- och mobilklienterna alla via HTTPS och
  en WebSocket till en och samma tjänst,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Den vidarebefordrar krypterade meddelanden till varje medlems inkorg och håller kvar dem tills
  klienten kvitterar dem. Den lagrar också användarregistreringar, offentliga profiler som
  användare själva väljer att aktivera, det krypterade manifestet för varje Space (kanaler, roller,
  emojier), inbjudningsmaterial, den offentliga katalogen och valfri krypterad synkronisering av
  inställningar. Quilibriums nodprogramvara har en inkorgs- och hubbtjänst med samma uppbyggnad,
  men varken klienterna eller Quilibriums dokumentation säger hur den här tjänsten förhåller sig
  till nätverket.
- **Historik.** Varje medlems klient behåller en egen kopia av Spacen i lokal lagring, och båda
  klienterna hämtar meddelanden som skickades medan de var offline från sina inkorgar hos tjänsten.
  För äldre historik ber webb- och skrivbordsklienten en medlem som är online att synkronisera,
  medan mobilklienten spelar upp en beständig logg som tjänsten sparar för varje Space.
- **Moderering.** Roller ger rätt att radera, fästa, tysta och använda `@everyone`-omnämnanden.
  Varje medlems klient kontrollerar signaturen på varje modereringsåtgärd och tillämpar den bara om
  den som signerat har rätt roll. Ägaren kan sparka ut en medlem, vilket roterar Spacens nycklar så
  att den utsparkade medlemmen inte kan läsa nya meddelanden. En Space kan kräva signerade
  meddelanden eller låta medlemmarna publicera osignerade meddelanden som går att förneka.
  Listningar i den offentliga katalogen har en granskningsstatus, och användare kan anmäla Spaces,
  och från mobilappen enskilda meddelanden, till Quorum-tjänsten.
- **Kod.** Webb- och skrivbordsklienten är licensierad under AGPL-3.0 och mobilklienten under
  GPL-3.0. Mobilklienten har också en kryptoplånbok, Farcaster-integration och Apex, en betald
  prenumeration som beskrivs nedan.

## Där de skiljer sig åt

### Privata grupper och offentliga communityer

En Quorum-Space är en grupp medlemmar: bara de som har dess nycklar kan läsa den, och för att gå med
krävs en inbjudningslänk. En offentlig länk släpper in vem som helst, men först efter att man har
gått med. En Bitsocial-community har inget medlemskap. Vem som helst kan läsa den, från vilken app
som helst, utan att gå med, och vem som helst kan försöka publicera, med förbehåll för communityns
utmaning.

### Vad som håller en grupp online

En Quorum-Space har ingen värdnod. Medlemmarna skickar meddelanden via Quorum-tjänsten, som håller
en kopia för varje medlem tills medlemmens klient hämtar den, och ägaren behöver inte vara online
för att andra ska kunna prata. En Bitsocial-community finns på sin ägares nod, som accepterar
eller avvisar varje inlägg och publicerar communityns senaste tillstånd. Communityn förblir läsbar så länge peers seedar den, men
kan inte ta emot nya inlägg medan dess nod är offline. Se
[Peer-to-peer-protokoll](/peer-to-peer-protocol/).

### Vem som upprätthåller reglerna

I Quorum upprätthålls reglerna ute i kanten. Varje medlems klient avgör om en radering, en fästning
eller en tystning ska tillämpas, utifrån den signerandes roll, och en utsparkning fungerar genom att
alla andra flyttas över till nya nycklar. Vid sidan av det tar operatören av tjänsten emot
anmälningar och granskar den offentliga katalogen. I Bitsocial upprätthålls reglerna vid
communitynoden: ett inlägg som inte klarar communityns utmaning accepteras aldrig, och noden
tillämpar sina moderatorers borttagningar. Se
[Lokal moderation, inte globala förbud](/local-moderation/).

### Spamskydd

Quorum håller spam ute främst genom inbjudningar. En engångslänk släpper in en person, en offentlig
länk släpper in vem som helst som har den, och ägaren kan i efterhand sparka ut medlemmar och byta
nycklar. Klienterna begränsar också hur snabbt en medlem kan skicka, och webb- och
skrivbordsklienten förkastar meddelanden i Spaces från varje avsändare som skickar fler än 10 på 10
sekunder. Bitsocial-identiteter är gratis nyckelpar, så varje community väljer en utmaning som
körs innan ett inlägg accepteras, till exempel en captcha, en betalning, ett tokensaldo eller en tillåtelselista. Se
[Anpassade anti-spam-utmaningar](/custom-challenges/).

### Klienten och nätverket

En Quorum-app är en klient till Quorum-tjänsten, som Quilibrium Inc. driver. Apparna ansluter inte
själva till något peer-to-peer-nätverk, så möjligheten att nå en Space hänger på den enda
slutpunkten. Separat från detta är Quilibrium ett eget nätverk: i oktober 2026 visade dess
[utforskare](https://dashboard.quilibrium.com/) 114 nåbara peers och 181 provers fördelade på 99
shards.

En Bitsocial-webbapp kan köra en libp2p-nod i fliken, hämta communityinnehåll från peers och
publicera via gossipsub. Upptäckten av peers går via HTTP-routrar som bara returnerar
leverantörsadresser; vem som helst kan driva en, och klienter kan byta router genom att ändra sin
konfiguration. Se [Peer-to-peer i webbläsaren](/browser-p2p/).

### Ekonomi

Quilibrium har en token i centrum. QUIL utvinns av noder och betalar nätverksavgifter, och en
wrappad version, wQUIL, cirkulerar på Ethereum. Quorum i sig är gratis och kräver varken betalning
eller telefonnummer. Den valfria Apex-prenumerationen kostar
[5 dollar i månaden](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
betalas i wQUIL, SNAP eller USDC på Ethereum och delas mellan Quilibrium Inc. och fyra Spaces som
prenumeranten väljer. Bitsocial har inget betalningslager i protokollet; en community kan kräva en
betalning eller en token genom sin utmaning.

### Privata meddelanden

Här är Quorum starkare. Direktmeddelanden och meddelanden i Spaces är totalsträckskrypterade med
framåtsekretess, och meddelandeinnehållet når Quorum-tjänsten bara som chiffertext, utom när en
medlem anmäler ett meddelande från mobilappen, som då skickar dess innehåll till Quorums
moderatorer. Bitsocial fokuserar på offentliga communityer och har ännu inga inbyggda
direktmeddelanden. Ett Bitsocial-inlägg är krypterat till communitynodens nyckel medan det färdas
över pubsub, men när det väl har accepterats är det offentligt.

## Projektstatus

I oktober 2026 kallade Quorums repository webbappen för en beta, och Quorums webbplats angav
fortfarande att apparna för Google Play och App Store kommer snart. De två klienterna skiljer sig
också åt: mobilappen har funktionerna för plånbok, Farcaster och Apex, medan webb- och
skrivbordsklienten visar sina sidor Wallet och Farcaster som kommer snart, och de två kommer ikapp
med historiken i en Space på olika sätt.

Quilibriums mainnet nådde version 2.1 den 30 september 2025, när nätverket startade igen efter ett
stopp ([tillkännagivande](https://x.com/QuilibriumInc/status/1973082817236984270)). Under 2026
skrevs noden om i Rust, med postkvantsignaturer för konsensus och ett nätverksprotokoll som äldre
noder inte kan tala. Delar av dokumentationen beskriver designen snarare än den kod som faktiskt
körs: de beskriver
[mixnet-routning](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/). Noder
vidarebefordrar visserligen trafik sinsemellan genom lökroutade kretsar, men i nod 2.1.0.25 är
mixnet-tjänsten en
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
som tar emot meddelanden utan att mixa dem.

## Jämförelse

| Fråga                        | Quorum                                                                                                          | Bitsocial                                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Kategori                     | Totalsträckskrypterad gruppmeddelandeapp från Quilibrium Inc.                                                   | Peer-to-peer-nätverk av communityer                                                                                   |
| Identitet                    | Ed448-huvudnyckeluppsättning plus nycklar per enhet, bakom en lösennyckel eller en återställningsfras           | Ed25519-nyckelpar för användare och communityer                                                                       |
| Vem kan läsa                 | Medlemmar som har nycklarna till en Space                                                                       | Vem som helst, från vilken app som helst                                                                              |
| Var meddelandena finns       | Varje medlems enhet; Quorum-tjänsten håller olevererade kopior, och en logg per Space för mobilklienten         | Communityägarens nod och de peers som läser och seedar den                                                            |
| Vad klienterna ansluter till | Quorum-tjänsten på `api.quorummessenger.com`                                                                    | Peers via libp2p, som hittas via HTTP-routrar, även från en webbläsarflik                                             |
| Communityer                  | Spaces med kanaler, roller och inbjudningslänkar                                                                | Förstklassiga objekt vars nod accepterar eller avvisar inlägg                                                         |
| Spamskydd                    | Inbjudningslänkar, utsparkningar med nyckelbyte, hastighetsbegränsningar på klientsidan                         | Varje communitys utmaning innan ett inlägg accepteras                                                                 |
| Moderering                   | Roller som upprätthålls av varje medlems klient; ägaren sparkar ut; anmälningar går till operatören av tjänsten | Communityägare modererar sin community; appar väljer vad de visar                                                     |
| Privata meddelanden          | Totalsträckskrypterade direktmeddelanden                                                                        | Offentliga communityer; ännu inga inbyggda direktmeddelanden                                                          |
| Ekonomi                      | Nätverkstoken QUIL; valfri Apex-prenumeration för 5 dollar i månaden                                            | Ingen i protokollet; en utmaning kan kräva en betalning eller token                                                   |
| Viktigaste avvägningen       | Privata, krypterade grupper, men varje klient är beroende av en enda tjänst                                     | Gratis identiteter och åtkomst via webbläsaren, men inga privata meddelanden och bara det senaste tillståndet behålls |
