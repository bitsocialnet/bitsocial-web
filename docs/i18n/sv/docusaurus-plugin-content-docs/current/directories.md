---
title: Kataloger
description: Hur Bitsocial-appar låter gemenskaper konkurrera om ett ämnesnamn i stället för att namnet stannar hos den som tog det först.
---

# Kataloger

På Reddit kan ett namn som `r/opensource` bara tillhöra en enda gemenskap, och den som kontrollerar gemenskapen behåller namnet. Om moderatorerna fattar beslut som användarna ogillar är det enda alternativet att starta `r/opensource2`. Den nya gemenskapen börjar med noll prenumeranter, trots att de flesta som prenumererade på `r/opensource` brydde sig om öppen källkod och inte om just det moderatorteamet.

Bitsocial-appar undviker detta med **kataloger**. En katalog är ett ämnesnamn, till exempel `opensource`, som gemenskaper konkurrerar om. Den korta sökvägen för namnet öppnar den gemenskap som för närvarande rankas högst, så en bättre gemenskap kan ta över namnet utan att be någon om lov.

## Så fungerar det

1. **En katalogkod är ett ämnesnamn.** Seedit använder sökvägar som `/s/funny`. 5chan använder imageboard-sökvägar som `/g/`.
2. **Gemenskaper tävlar som kandidater.** Varje katalog har en lista med kandidatgemenskaper, var och en med sin egen exakta adress, till exempel `funny-posting.bso`.
3. **Den högst rankade kandidaten vinner sökvägen.** Om du öppnar `/s/funny` visas den nuvarande vinnaren.
4. **Att förlora raderar ingenting.** En gemenskap som inte vinner behåller sin adress, sina inlägg och sina prenumeranter, och vem som helst kan fortfarande öppna den direkt.

## Namnet är en ytterdörr, inte en identitet

En katalogkod är bara en väg för att hitta innehåll. Allt som ska bestå pekar på en specifik gemenskap:

- En prenumeration från `/s/funny` gäller den nuvarande vinnarens exakta adress. Själva katalogkoden sparas aldrig som en prenumeration.
- Inläggslänkar använder alltid gemenskapens exakta adress, så en gammal länk kan inte börja peka på en annan gemenskap när vinnaren byts.
- När vinnaren byts låter Seedit befintliga prenumerationer vara och frågar varje prenumerant om hen vill byta till den nya vinnaren, behålla båda eller behålla den nuvarande gemenskapen. Automatiskt byte är en inställning som du själv aktiverar per katalog, och ett automatiskt byte visar ett meddelande med möjlighet att ångra.

En konkurrerande gemenskap tar alltså inte någons prenumerationer. Den vinner namnet: nya besökare hamnar där, och befintliga prenumeranter får välja med ett klick. De som föredrog den gamla gemenskapen behåller den.

## Varför inte först till kvarn

- **Ingen namnockupation.** Det räcker inte att inneha ett bra namn. En gemenskap måste fortsätta vara den bästa kandidaten för det.
- **Ingen administratör delar ut namn.** Om en administratör fördelade namnen skulle det återskapa det centrala veto som Bitsocial är byggt för att ta bort.
- **Konkurrenter behåller en väg till publiken.** En rivaliserande gemenskap siktar på samma namn i stället för att börja om under ett sämre.
- **Klienter är överens om vinnaren.** Seedit rankar kandidater deterministiskt, så varje klient som läser samma fastställda ögonblicksbild av katalogen visar samma vinnare. Seedit byter inte till en annan kandidat bara för att vinnaren tillfälligt inte går att nå över en enskild användares anslutning.

## Hur vinnare utses i dag

Kandidaterna publiceras som JSON-filer i repositoriet [bitsocialnet/lists](https://github.com/bitsocialnet/lists), en fil per katalog, och en gemenskap går med i en katalog genom en pull request till katalogens fil. Detta är ett tillfälligt startsteg. Målet är att röstning ska ersätta pull requests som sättet att avgöra vinnare.

- **Seedit** rankar en katalogs kandidater efter poäng, sedan efter när de lades till och sist efter adress. Varje katalogfil har ett revisionsnummer, och varje ändring av dess kandidater eller vinnare publicerar en ny revision.
- **5chan** kör en omröstning per katalog med [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Klienterna utbyter signerade röstsedlar över libp2p gossipsub och räknar själva ihop resultatet, utan någon server som räknar rösterna. För att rösta krävs ett 5chan Pass, en token som inte kan överlåtas, och varje innehavare får en röst. En röst på en board som ännu inte finns på listan nominerar den. Omröstningarna körs för närvarande på testnätet Base Sepolia, och tills de flyttas från testnätet visas resultaten men ändrar inte listans ordning.

## Protokoll eller app?

Kataloger är inte en del av PKC, peer-to-peer-lagret som lagrar och förmedlar gemenskaper. De är en konvention som klienter tillämpar ovanpå det lagret, tillsammans med standardlistor och sökning; se [Innehållsupptäckt](./content-discovery.md). En klient kan läsa samma katalogfiler, publicera egna eller hoppa över kataloger helt, och användare kan fortfarande öppna vilken gemenskap som helst via dess adress.
