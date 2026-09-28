---
title: Peer-to-peer i webbläsaren
description: Hur en Bitsocial-webbapp kör en riktig libp2p-nod i webbläsarfliken, vilka transporter den använder och uppströmsfixen från 2026 som fick publicering från en flik att fungera.
---

# Peer-to-peer i webbläsaren

En Bitsocial-webbapp behöver inte vara klient till någon annans server. Den kan köra en
[Helia](https://helia.io/)-nod inuti webbläsarfliken, ansluta till samma peer-to-peer-nätverk som
skrivbords- och CLI-noder, hämta community-innehåll från andra peers och publicera via pubsub.

Den här sidan förklarar vad det faktiskt innebär, vilka transporter som används, vad det fortfarande
inte går att göra och varför publicering från en flik började fungera först 2026.

För den bredare nätverksdesignen, se [Peer-to-Peer-protokoll](/peer-to-peer-protocol/).

## Vad som körs i fliken

När webbläsar-P2P är aktivt håller sidan en riktig libp2p-nod:

- den ringer upp andra peers över säkra WebSockets
- den hämtar och verifierar community-innehåll från de peerna, inte från en IPFS-gateway
- den deltar i gossipsub, så att publicering av ett inlägg inte kräver en driftad pubsub-leverantör
- den använder samma protokollklientstack (`pkc-js`) som alla andra Bitsocial-appar

Den praktiska följden är att ingen gateway-operatör står mellan en läsare i webbläsaren och en
community. Det finns ingen enskild HTTPS-slutpunkt som kan pressas till att släppa en community för
alla webbläsaranvändare på en gång.

## Hur webbläsarnoder ansluter

`pkc-js` ringer upp peers över **säkra WebSockets**. Uppringning via WebRTC och WebTransport nekas
som standard genom en connection gater, eftersom de i webbläsaren lägger till långa och ofta
misslyckade vägar för att etablera anslutningar — STUN/ICE-förhandling, rotation av certhash — som
gör sidladdningar långsammare, medan WebSockets ger en direkt och pålitlig transport. Anropare som
uttryckligen vill ha WebRTC eller WebTransport kan åsidosätta denna gater via
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Den praktiska följden är att en peer i webbläsaren ansluter till noder som exponerar en
WSS-slutpunkt, vilket betyder att de noderna behöver en domän och ett CA-signerat certifikat. Peers
bakom vanliga konsumentanslutningar utan detta nås indirekt i stället för att ringas upp från fliken.

## Varför publicering från webbläsaren började fungera först 2026

Peer-to-peer i webbläsaren är ingen ny idé. Det som ändrades 2026 är att en webbläsarnods _inlägg_
nu når resten av nätverket.

Pubsub-specifikationen för libp2p kräver att ett meddelandes `seqno` är ett linjärt växande
64-bitars big endian-heltal. `js-libp2p-gossipsub` genererade i stället 8 slumpmässiga byte, medan
go-libp2p-pubsub och rust-libp2p båda använde en räknare. Kubo 0.40+ aktiverar
`BasicSeqnoValidator` som standard, vilket förkastar varje meddelande vars seqno inte är större än
det högsta som redan setts från den peeren.

Effekten blev att de flesta meddelanden som publicerades av en JavaScript-nod — inklusive en
webbläsarnod — tyst kastades bort av Kubo-peers. En reproduktion mätte att 2 till 8 av 30
meddelanden kom fram.

Detta diagnostiserades i
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) och åtgärdades
i **`@libp2p/gossipsub` 15.0.21** i maj 2026. Fram till dess kunde en webbläsarnod ansluta och läsa,
men dess inlägg försvann för det mesta på vägen till Go-peers. `pkc-js` levererar
`@libp2p/gossipsub` 16.0.4, alltså efter den fixen.

## Vad en webbläsarnod fortfarande inte kan göra

En webbläsarnod är en riktig peer, inte en server. Den har andra begränsningar än en skrivbordsnod
eller en nod som är igång dygnet runt:

- den kan oftast inte ta emot godtyckliga inkommande anslutningar från det öppna internet
- den fungerar bara så länge fliken är öppen, så den är ingen långlivad värd för en communitys data
- den kan inte ansluta till en libp2p-DHT, vilket är skälet till att upptäckt går via HTTP-routrar
- den passar dåligt för seedning i stor skala

Att vara värd för en hel community sköts fortfarande bäst av en skrivbordsapp, `bitsocial-cli` eller
en annan nod som är igång dygnet runt. Webbläsar-P2P ändrar vilka som kan _läsa och posta_ utan en
gateway; det tar inte bort behovet av peers som stannar online.

## HTTP-routrar är inte gateways

Webbläsarklienter frågar fortfarande
[HTTP-routrar](/peer-to-peer-protocol/#public-key-based-addressing) för att ta reda på vilka peers
som just nu tillhandahåller en communitys adress. Det är den ärliga asterisken vid "ren peer-to-peer
i webbläsaren", och det är värt att vara precis med:

- en router lagrar bara peer-adresser för en innehållsadress
- den lagrar inte, levererar inte och känner inte ens till communityns innehåll
- klienter frågar flera routrar parallellt och slår ihop resultaten
- vem som helst kan driva en, och att byta router är en konfigurationsändring utan datamigrering

Efter upptäckten går innehållsöverföring och pubsub-trafik peer-to-peer. En router som försvinner
kostar dig en uppslagsväg, inte dina data. En IPFS-gateway ligger däremot mitt i innehållsvägen.

## Var detta körs i dag

- [5chan](/apps/5chan/) kör som standard ren webbläsar-P2P i webbappen på
  [5chan.app](https://5chan.app).

## Gateway-fallback

Gateway-baserad åtkomst finns kvar som kompatibilitetsväg för webbläsare eller nätverk som inte kan
ansluta direkt. Se [Gateway-fallback](/peer-to-peer-protocol/#gateway-fallback). Målarkitekturen är
webbläsar-P2P i första hand, med gateways som ett valfritt reservalternativ i stället för den
självklara flaskhalsen.
