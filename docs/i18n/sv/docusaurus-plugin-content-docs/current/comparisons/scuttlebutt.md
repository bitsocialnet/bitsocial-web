---
title: Bitsocial och Secure Scuttlebutt
description: Hur Secure Scuttlebutt (SSB) och dess app Manyverse står sig mot Bitsocial, från append-only-flöden och replikering via följargrafen till communityer, spamskydd och synkronisering offline.
---

# Bitsocial och Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) är ett socialt peer-to-peer-protokoll som
skapades av Dominic Tarr 2014. [Manyverse](https://www.manyver.se/) är dess mest kända app, för
Android, iOS och dator; [Patchwork](https://github.com/ssbc/patchwork) var den viktigaste
skrivbordsklienten innan den arkiverades. Av de system som jämförs i den här dokumentationen är det
SSB som till andan ligger närmast Bitsocial: inga servrar i datavägen, ingen blockkedja, ingen
global ordning och Ed25519-nycklar för identitet. De två har gjort motsatta val när det gäller vad
varje peer lagrar och var spam stoppas.

## Hur Scuttlebutt fungerar

- **Flöden.** Varje identitet är ett Ed25519-nyckelpar, skrivet som `@<public key>.ed25519`. Allt en
  användare publicerar hamnar i användarens eget flöde, en append-only-logg där varje signerat
  meddelande bär ett sekvensnummer och hashen av föregående meddelande. När ett meddelande väl har
  publicerats kan det inte ändras, enligt
  [protokollguiden](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replikering.** Peers kopierar hela flöden, inte enskilda inlägg, och följargrafen avgör vilka
  flöden en peer behåller. Patchwork visade till exempel flöden upp till två hopp bort och
  replikerade flöden upp till tre hopp bort. Med epidemic broadcast trees (EBT) jämför peers det
  senaste sekvensnummer de har för varje flöde och skickar bara det som saknas.
- **Anslutningar.** Peers autentiserar sig med en hemlig handskakning (secret handshake) och
  krypterar trafiken med box stream. Handskakningen är knuten till en nätverksidentifierare, så
  peers i ett separat SSB-nätverk med en annan identifierare kan inte ansluta till huvudnätverket.
- **Att hitta peers.** Peers annonserar sig i det lokala nätverket via UDP-broadcast och
  synkroniserar över LAN; Manyverse synkroniserar även över Bluetooth. Över internet förlitar sig
  användarna på **pubs**, alltid uppkopplade peers som följer dig tillbaka när du har löst in en
  inbjudningskod och sedan lagrar och levererar ditt flöde, och på **rooms**, som inte lagrar några
  flöden men tunnlar anslutningar mellan sina medlemmar.
- **Blobbar och privata meddelanden.** Bilder och andra filer är innehållsadresserade blobbar som
  hämtas från peers, med en standardgräns på 5 MB i nuvarande implementationer. Privata meddelanden
  krypteras för upp till sju mottagare och publiceras som chiffertext i författarens flöde.

## Där de skiljer sig åt

### Vad en peer lagrar

En SSB-peer behåller en fullständig kopia av varje flöde inom sitt replikeringsområde, från varje
flödes första meddelande, och levererar de flödena till andra. Det är det som gör att SSB fungerar
offline, men lagringen växer med varje meddelande inom området, och en ny installation måste ladda
ner de flödena innan den visar särskilt mycket. En Bitsocial-klient hämtar det senaste tillståndet
för de communityer den öppnar från communityns nod och de peers som seedar den, och nätverket
behåller bara det senaste tillståndet. Se [Peer-to-peer-protokoll](/peer-to-peer-protocol/).

### Radering och enheter

Eftersom ett flöde är en hashkedja har SSB ingen radering i hela nätverket: en peer kan ta bort
meddelanden ur sin egen databas men kan inte dra tillbaka dem ur kopiorna hos andra peers. Att
publicera med samma nyckel från två enheter, eller från en återställd säkerhetskopia, förgrenar
flödet, så den vanliga lösningen är en identitet per enhet. PZP, efterföljarprotokollet från
Manyverse-teamet, räknar radering, flera enheter per konto och flöden som tål förgreningar till sina
viktigaste förändringar jämfört med SSB
([lanseringsinlägg](https://www.manyver.se/blog/2024-07-03/)). En Bitsocial-communitynod publicerar
en ny version av communityns tillstånd vid varje uppdatering, så innehåll som communityns
moderatorer tar bort försvinner ur det senaste tillståndet.

### Vem du kan höra från

SSB:s replikeringsområde fungerar samtidigt som dess spamfilter. En främlings flöde når dig bara om
någon inom dina hopp följer personen, och om du blockerar ett flöde slutar din nod att replikera
det. Spam hålls ute, men det gör även nykomlingar tills någon följer dem. Bitsocial låter vem som
helst publicera till en community, och communityns nod avgör genom sin utmaning om ett inlägg
accepteras. Se [Anpassade anti-spam-utmaningar](/custom-challenges/).

### Communityer

SSB har inget community-objekt. Kanaler och hashtaggar är etiketter på enskilda inlägg, svaren i en
tråd ligger i flödena hos dem som skrev dem, och hur mycket av en tråd du ser beror på vilka av de
flödena din nod har. Rooms kan ha moderatorer och medlemslistor, men de styr vem som får ansluta
genom dem, inte vad som publiceras. En Bitsocial-community är ett förstklassigt objekt med eget
nyckelpar, egna regler, egna moderatorer och en egen utmaning.

### Infrastruktur

Båda håller servrar utanför datavägen, och båda förlitar sig på hjälpare. Pubs är det närmaste SSB
kommer en hostad tjänst: de lagrar och levererar flödena för alla som de följer. Rooms ligger
närmare Bitsocials HTTP-routrar eftersom varken rooms eller routrar lagrar innehåll, men rooms
vidarebefordrar anslutningen mellan sina medlemmar, medan en router bara returnerar
leverantörsadresser och inte deltar i överföringen. Precis som en SSB-peer körs en
Bitsocial-communitynod på vanlig konsumenthårdvara, och den måste vara online för att kunna ta emot
nya inlägg.

### Offline och lokala nätverk

Här är SSB starkare. Två SSB-peers i samma Wi-Fi-nätverk, eller över Bluetooth i Manyverse, kan
synkronisera utan internetanslutning, och allt som redan har replikerats förblir läsbart offline.
Manyverses uttalade huvudmål är att göra sociala nätverk oberoende av internetuppkoppling. Bitsocial
behöver en internetanslutning för att hitta peers och för att publicera.

### Webbläsare

De viktigaste SSB-apparna levereras med en fullständig SSB-nod: Manyverse paketerar en i sina mobil-
och datorappar. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) körde SSB i en
webbläsare med partiell replikering och anslutningar via rooms, och arkiverades 2022.
Bitsocial-appar kör en peer-to-peer-nod i en vanlig webbläsarflik. Se
[Peer-to-peer i webbläsaren](/browser-p2p/).

### Privata meddelanden

SSB har inbyggda krypterade privata meddelanden. Bitsocial fokuserar på offentliga communityer och
har ännu inga inbyggda direktmeddelanden.

## Projektstatus

André Staltz, som byggde Manyverse, lämnade SSB, Manyverse och deras planerade efterföljare i april
2024 ([hans sista uppdatering](https://www.manyver.se/blog/2024-04-05/)). I juli 2024 lanserade
Jacob Karlsson den efterföljaren som [PZP](https://pzp.wiki/) och skrev att han inte skulle arbeta
mer med Manyverse och inte kände till någon annan som planerade att göra det. I oktober 2026 hade
PZP-kodförråden på [Codeberg](https://codeberg.org/pzp) inga uppdateringar efter december 2024.
Patchworks kodförråd är arkiverat med v3.18.1 som sista version, och teamet bakom Planetary, en
SSB-app för iOS, gick 2023 över till Nostr med sin app Nos. SSB-nätverket körs fortfarande på de
peers och pubs som folk håller online, men dess viktigaste appar utvecklas inte längre.

## Jämförelse

| Fråga                  | Secure Scuttlebutt                                                                                      | Bitsocial                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Kategori               | Peer-to-peer-protokoll baserat på gossip                                                                | Peer-to-peer-nätverk av communityer                                                                      |
| Identitet              | Ett Ed25519-nyckelpar per enhet                                                                         | Ed25519-nyckelpar för användare och communityer                                                          |
| Var inläggen finns     | Författarens append-only-flöde, kopierat av varje peer som replikerar det                               | Communityägarens nod och de peers som läser och seedar den                                               |
| Vad en peer behåller   | Hela historiken för varje flöde inom dess följarområde                                                  | Det senaste tillståndet för de communityer den läser eller seedar                                        |
| Communityer            | Inget community-objekt; kanaler och hashtaggar märker inlägg                                            | Förstklassiga objekt vars nod accepterar eller avvisar inlägg                                            |
| Spamskydd              | Replikeringsområde utifrån följargrafen samt blockeringar                                               | Varje communitys utmaning innan ett inlägg accepteras                                                    |
| Moderering             | Varje användares följningar och blockeringar                                                            | Communityägare modererar sin community; appar väljer vad de visar                                        |
| Hjälpservrar           | Pubs lagrar och levererar flöden; rooms tunnlar anslutningar                                            | HTTP-routrar returnerar peers som är leverantörer och lagrar inget innehåll                              |
| Offline                | Synkronisering över LAN och Bluetooth utan internet                                                     | Kräver en internetanslutning                                                                             |
| Webbläsare             | Apparna paketerar en fullständig SSB-nod                                                                | Peer-to-peer-nod i en vanlig webbläsarflik                                                               |
| Nätverk                | I drift, men dess viktigaste appar utvecklas inte längre                                                | Live-nätverk med appar som [5chan](/apps/5chan/) och [Seedit](/apps/seedit/)                             |
| Viktigaste avvägningen | Fungerar offline och kräver ingen hosting, men flödena växer för alltid och främlingar förblir osynliga | Öppen publicering och stöd för webbläsare, men kräver internet och behåller bara det senaste tillståndet |
