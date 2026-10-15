---
title: Bitsocial och Urbit
description: Hur Urbit, ett nätverk av personliga servrar med Ethereum-baserade Urbit ID:n och grupper som drivs av sin värd i Tlon Messenger, står sig mot Bitsocials peer-to-peer-communityer.
---

# Bitsocial och Urbit

[Urbit](https://urbit.org/) är ett nätverk av personliga servrar. Varje användare har en ständigt
påslagen dator som kallas skepp (ship). Den kör Urbits eget operativsystem (Arvo), som är skrivet i
Urbits egna språk (Nock och Hoon), och identifieras av ett Urbit ID. Den viktigaste sociala appen är
[Tlon Messenger](https://tlon.io/), byggd av Tlon, företaget som grundades 2013 för att utveckla
Urbit.

Urbit vill ersätta hela datorstacken och är därför ett betydligt bredare projekt än Bitsocial. Dess
sociala lager använder ändå en modell som ligger nära Bitsocials: en community finns på sin ägares
nod, och den noden avgör vad som släpps in. De två skiljer sig åt i frågan om vem som måste driva en
server och hur spam hålls ute.

## Hur Urbit fungerar

- **Urbit ID:n.** Varje skepp har ett Urbit ID: ett nummer som visas som ett uttalbart namn, till
  exempel `~sampel-palnet`. ID:n på lager 1 är NFT:er vars ägande och publika nätverksnycklar
  registreras i Azimuth-kontrakten på Ethereum. ID:n på lager 2, som tillkom 2021 för att sänka
  avgifterna, använder en ”naiv rollup”: deras transaktioner publiceras på Ethereum i batchar, men
  ägandet lagras inte i Azimuth-kontraktet, utan varje skepp beräknar det lokalt. Tlon driver en
  roller som är gratis för alla att använda, enligt
  [Urbit ID-dokumentationen](https://docs.urbit.org/urbit-id/what-is-urbit-id) och guiden
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **En fast hierarki.** Adressrymden har 256 galaxer, 65 536 stjärnor och omkring 4 miljarder
  planeter för vardagligt bruk. Galaxer utfärdar stjärnor, stjärnor utfärdar planeter, och varje
  planet kan utfärda månar för sina egna enheter. Kometer är gratis ID:n som ett skepp genererar åt
  sig självt och som aldrig berör blockkedjan. Galaxägarna utgör Galactic Senate, som röstar om
  uppgraderingar av Azimuth-kontrakten och väljer Urbit Foundations styrelse.
- **Nätverk.** Skeppen utbyter krypterade paket peer-to-peer. Sedan juli 2026 är nätverksprotokollet
  [Directed Messaging](https://urbit.org/blog/directed-messaging), en innehållscentrerad omskrivning
  av det äldre protokollet Ames. Galaxerna sköter upptäckten av peers: var och en håller reda på var
  skeppen under den finns och vidarebefordrar paket till dem tills de två skeppen kan nå varandra
  direkt, eller så länge en brandvägg hindrar det, enligt
  [artikeln om Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Grupper.** I Tlon Messenger hostas en grupp av skaparens skepp. Medlemmarna skickar meddelanden
  till värden, som distribuerar dem till varje medlems skepp, och varje medlems skepp behåller en
  egen kopia, enligt [Tlons FAQ](https://tlon.io/posts/faq). Värden styr roller, kanaler och vem som
  släpps in. En grupp kan vara offentlig, privat eller hemlig, och den kan
  [bannlysa enskilda skepp eller hela rangnivåer av ID:n](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanaler är chattar, anteckningsböcker eller samlingar av bilder och länkar.
- **Hosting.** Den som registrerar sig hos Tlon får ett skepp som Tlon driver, med nycklar som Tlon
  har i förvar. En användare kan exportera skeppet och dess huvudnyckel (master ticket) och köra det
  någon annanstans: på en enhet från [Native Planet](https://www.nativeplanet.io/), eller med
  körmiljön Vere på Linux, macOS eller Windows. Skepp kan ännu inte lagra stora filer direkt, så
  Tlon Messenger lägger bilder och andra medier i S3-kompatibel molnlagring.

## Där de skiljer sig åt

### Vem som måste driva en server

På Urbit är varje deltagare en server. Tlons appar är gränssnitt mot användarens eget skepp, och
även läsningen av en grupp går via det. Den som inte själv driver ett skepp hyr ett, vilket för
tillbaka en hostingleverantör in i bilden: Tlon har nycklarna till de användare vars skepp Tlon
hostar och behåller begränsad åtkomst för underhåll, även om användarna kan lämna med hela sitt
skepp.

På Bitsocial behöver bara communityägare en ständigt påslagen nod. Läsare och de som skriver inlägg
kan köra en peer-to-peer-nod i en webbläsarflik, och deras konto är ett nyckelpar som appen
förvarar. Se [Peer-to-peer i webbläsaren](/browser-p2p/). När någon ändå använder en hostad nod är
Bitsocials design tänkt att låta hen delegera drifttiden utan att lämna över identiteten i någon
annans förvar. Se [Identitet och gemenskapsägande](/identity-and-ownership/).

### Communityns värd

Här ligger de två närmast varandra. En Tlon-grupp och en Bitsocial-community finns båda på sin
ägares nod. Värden avgör vem som får publicera, tillämpar modereringen och distribuerar resultatet,
och inget av protokollen placerar en moderator över värden. I båda fallen måste värden vara online.
Tlons FAQ säger att om värden går offline ”går gruppen ner tillsammans med dem”, och en
Bitsocial-community kan inte ta emot nya inlägg medan dess nod är offline.

De lagrar innehåll på olika sätt. Varje medlems skepp behåller en kopia av gruppens historik, så
medlemmarna kan fortfarande läsa det de redan har tagit emot medan värden är nere. En
Bitsocial-läsare hämtar communityns senaste tillstånd från communityns nod eller från peers som
seedar den, så en community som är offline förblir läsbar så länge peers har den, men nätverket
behåller bara det senaste tillståndet.

En Tlon-grupp har också en medlemslista, och dess värd kan göra gruppen tillgänglig endast för
inbjudna. En Bitsocial-community har inget medlemskap: vem som helst kan läsa den, och vem som helst
kan försöka publicera, med förbehåll för communityns utmaning.

### Spam och identitet

Urbit bekämpar spam genom att göra identitet till en bristvara. Utbudet av planeter är fast, och
varje planet utfärdas av en stjärna. Gratis kometer kringgår den knappheten, så grupper som vill att
knappheten ska bestå visar bort dem: Urbits dokumentation påpekar att vissa grupper vägrar kometer,
och en Tlon-grupp kan bannlysa hela kometrangen med en enda inställning. När kometer väl är
utestängda behöver en bannlyst användare en annan planet från en stjärnas ägare för att komma
tillbaka. Rykte kan också följa hierarkin: Azimuth innehåller ett Censures-kontrakt som låter
galaxer och stjärnor flagga ID:n. Eftersom knappheten är inbyggd i adressrymden fungerar den på
samma sätt i varje grupp som visar bort kometer.

Bitsocial-identiteter är gratis nyckelpar. Varje community väljer sin egen utmaning innan den
accepterar ett inlägg, till exempel en captcha, en betalning, ett tokensaldo eller en
tillåtelselista, och andra communityer kan välja annorlunda. Se
[Anpassade anti-spam-utmaningar](/custom-challenges/).

### Blockkedja och styrning

Urbits identitetslager är beroende av Ethereum. Azimuth-kontrakten registrerar ägande och
nätverksnycklar på lager 1, transaktioner på lager 2 publiceras på Ethereum i batchar, och Galactic
Senate kan uppgradera kontraktet som styr Azimuth. Samma 256 galaxer sköter också upptäckten av
peers och vidarebefordringen av paket, så en fast uppsättning identiteter bär både styrningen och en
del av nätverkets routning.

Bitsocial-identiteter är nyckelpar som inte behöver registreras. `.bso`- och `.eth`-namn är valfria
alias som löses upp till dem. Upptäckten av peers går via HTTP-routrar som bara returnerar
leverantörsadresser; vem som helst kan driva en, och klienter kan byta router genom att ändra sin
konfiguration.

### Omfattning

Urbit är en dator för allmänna ändamål. Ett skepp kan vara värd för en Git-remote, en personlig
kunskapsbas eller AI-agenter, och Tlon Messenger är ett program bland många. Att bygga för Urbit
innebär för det mesta att skriva Hoon-appar för Arvo. Bitsocial är ett protokoll för offentliga
communityer, med appar som [5chan](/apps/5chan/) och [Seedit](/apps/seedit/). Det körs på den
befintliga stacken (libp2p, IPFS och webbläsaren) i stället för att ersätta den, och dess klienter
byggs med vanliga webbverktyg. Se [Bygg din egen klient](/build-your-own-client/).

### Privata meddelanden

Här är Urbit starkare. Direktmeddelanden går från ett skepp direkt till ett annat, all trafik mellan
skepp är krypterad, och grupper kan vara privata eller hemliga. Tlon påpekar att meddelanden är
krypterade under överföringen men lagras okrypterade på skeppet. Bitsocial fokuserar på offentliga
communityer och har ännu inga inbyggda direktmeddelanden.

## Projektstatus

Urbit har gått igenom omvälvningar. I augusti 2024 avskedade Urbit Foundation, den ideella
organisation som styr kärnutvecklingen, sin verkställande direktör; grundaren Curtis Yarvin
återvände för att leda strategin utan formell titel, flera kärnutvecklare lämnade, och stiftelsens
pengar räckte bara några månader till,
[rapporterade CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin föreslog att Azimuth skulle flyttas till ett befintligt lager 2 för Ethereum, med Base som
troligt val, och att fungibla ”visum”-tokens som kan omvandlas till planeter skulle ges ut. I
oktober 2026 beskriver Urbits [ID-dokumentation](https://docs.urbit.org/urbit-id/what-is-urbit-id)
fortfarande Azimuth på Ethereum med dess naiva rollup. I oktober 2025 ersatte Galactic Senate
stiftelsens styrelse, och den nya styrelsen utsåg en ny verkställande direktör
([tillkännagivande](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Utvecklingen fortsätter. Directed Messaging togs i drift med versionen 408k den 14 juli 2026. I juni
2026 öppnade Tlon Messenger
[registreringen för alla, utan väntelista](https://urbit.org/blog/this-month-in-urbit-june-2026),
och Tlon presenterar sig nu som en plats där människor och AI-agenter arbetar tillsammans.

## Jämförelse

| Fråga                  | Urbit                                                                                                  | Bitsocial                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Kategori               | Nätverk av personliga servrar och ett operativsystem                                                   | Peer-to-peer-nätverk av communityer                                                                                   |
| Identitet              | Urbit ID:n: omkring 4 miljarder planeter på Ethereum eller dess rollup på lager 2, plus gratis kometer | Ed25519-nyckelpar för användare och communityer                                                                       |
| Vem driver en server   | Varje användare, på sitt eget skepp eller ett hostat                                                   | Communityägare; läsare och skribenter kan använda en webbläsarflik                                                    |
| Var inläggen finns     | Gruppvärdens skepp och en kopia på varje medlems skepp                                                 | Communityägarens nod och de peers som läser och seedar den                                                            |
| Communityer            | Grupper som hostas av skaparens skepp, med medlemslistor                                               | Förstklassiga objekt vars nod accepterar eller avvisar inlägg                                                         |
| Spamskydd              | Knappa ID:n som utfärdas av stjärnor; grupper bannlyser skepp eller hela rangnivåer                    | Varje communitys utmaning innan ett inlägg accepteras                                                                 |
| Moderering             | Gruppvärdens roller och bannlysningar                                                                  | Communityägare modererar sin community; appar väljer vad de visar                                                     |
| Upptäckt av peers      | Galaxer håller reda på och vidarebefordrar åt skeppen under dem                                        | HTTP-routrar returnerar peers som är leverantörer och lagrar inget innehåll                                           |
| Styrning               | Galactic Senate med 256 galaxer röstar om uppgraderingar av Azimuth                                    | Ingen auktoritet på protokollnivå över identiteter eller communityer                                                  |
| Privata meddelanden    | Krypterade direktmeddelanden och grupper endast för inbjudna                                           | Offentliga communityer; ännu inga inbyggda direktmeddelanden                                                          |
| Viktigaste avvägningen | En hel personlig dator med privata grupper, men varje användare behöver ett ständigt påslaget skepp    | Gratis identiteter och åtkomst via webbläsaren, men inga privata meddelanden och bara det senaste tillståndet behålls |
