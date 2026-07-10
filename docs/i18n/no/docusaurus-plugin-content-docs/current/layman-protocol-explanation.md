---
title: En fullstendig lekmannsforklaring av Bitsocial-protokollen
description: En enkel engelsk gjennomgang av Bitsocial-fellesskap, peer-oppslag, publisering, anti-spam-utfordringer, moderering og apper.
---

# En fullstendig lekmannsforklaring av Bitsocial-protokollen

Denne siden forklarer Bitsocial uten å anta at du allerede forstår peer-to-peer-nettverk, kryptografiske nøkler, IPFS eller pubsub.

Noen detaljer er forenklet med vilje. For den mer tekniske versjonen, les siden [Peer-to-Peer-protokoll](./peer-to-peer-protocol.md).

## Kortversjonen

Bitsocial er en protokoll for sosiale apper der fellesskap eies av nøkler i stedet for av en firmadatabase.

Et Bitsocial-samfunn har en adresse. Apper bruker den adressen til å finne jevnaldrende som betjener fellesskapet, hente de siste innleggene fra disse jevnaldrende og publisere nye innlegg via en peer-to-peer meldingskanal. Før et innlegg godtas, kan fellesskapet kreve en anti-spam-utfordring som en captcha, invitasjonskode, betaling, token-sjekk, AI-moderasjonssjekk, godkjenningsliste eller en hvilken som helst annen regel som kan kodes.

Det er kjerneideen:

1. Et fellesskap styres av en privat nøkkel.
2. Den offentlige nøkkelen gir samfunnet en stabil adresse.
3. Peers hjelper leserne med å finne og hente fellesskapet.
4. En fellesskapsnode godtar eller avviser nye innlegg.
5. Antispampolicy tilhører hvert fellesskap, ikke én global plattform.

## Hvorfor hasjer betyr noe

En hash er et kort fingeravtrykk for data.

Hvis to personer hash nøyaktig samme fil, får de samme fingeravtrykk. Hvis filen endres, endres fingeravtrykket. Det gjør hashes nyttige for å finne og sjekke data uten å stole på at et selskap forteller deg hva filen er.

Peer-to-peer-systemer bruker denne ideen konstant. I stedet for å be ett nettsted om "filen som heter photo.png", kan en peer be nettverket om dataene med et spesifikt fingeravtrykk. Hvis en annen peer returnerer feil data, mislykkes hash-kontrollen.

Bitsocial bruker hasher og innholdsidentifikatorer for postdata og andre deler av fellesskapstilstanden. Det viktige poenget er enkelt: data kan adresseres etter hva de er, ikke bare etter hvor et selskap var vert for dem.

## Hvorfor offentlige nøkler betyr noe

En offentlig nøkkel og en privat nøkkel er et matchet par.

Den private nøkkelen er hemmelig. Det er det som gir kontroll. Den offentlige nøkkelen er trygg å dele. Den lar alle andre sjekke at en melding, oppdatering eller modereringshandling virkelig kom fra den samsvarende private nøkkelen.

Slik unngår Bitsocial vanlige plattformkontoer. Et selskap trenger ikke å utstede identiteten. En databaserad trenger ikke å definere eieren. Nøkkelparet er autoriteten.

I enkle ord:

- den private nøkkelen er eierens kontrollhåndtak
- den offentlige nøkkelen er den offentlige identiteten eller adressen
- signaturer beviser at en handling kom fra eieren

## Hva et Bitsocial-samfunn er

Et Bitsocial-fellesskap er ikke bare en side i én app.

Den har sitt eget nøkkelpar. Den offentlige nøkkelen gir fellesskapet en stabil nettverksadresse. Den private nøkkelen kontrollerer oppdateringer til fellesskapets tilstand, for eksempel metadata, regler, moderatorliste, utfordringskonfigurasjon og pekere til det siste aksepterte innholdet.

Det betyr at et fellesskap kan overleve ett grensesnitt. Én app kan vise den som en tavle. En annen app kan vise den som et forum. En fremtidig app kan vise den i en profilbasert feed. Appen kan endres, men fellesskapsadressen peker fortsatt til samme fellesskap som eies.

## Hvordan lesing fungerer

Når en bruker åpner et Bitsocial-fellesskap, spør ikke appen én sentral database om siden.

Flyten er nærmere dette:

1. Appen kjenner allerede fellesskapsadressen, eller henter den fra en liste, lenke, søkeflate eller
   menneskelest navn.
2. Appen spør lette rutere hvilke jevnaldrende som for øyeblikket oppgir den fellesskapsadressen.
3. Ruterne returnerer bare peer-adresser. De returnerer ikke innlegg, regler, profiler eller fellesskap
   metadata.
4. Appen kobles til jevnaldrende og henter den nyeste fellesskapstilstanden.
5. Denne tilstanden inneholder tips til å legge ut innhold.
6. Appen henter innleggsinnholdet fra jevnaldrende og gjengir det i et normalt sosialt grensesnitt.

Ruteren er kun en oppslagshjelp. Det er nærmere å spørre "hvem har dette?" enn å spørre "vær så snill å server meg hele nettstedet."

For mer detaljer om denne splittelsen, les [Oppdagelse av innhold](./content-discovery.md).

## Hvordan posting fungerer

Posting er forskjellig fra lesing fordi åpne peer-to-peer-nettverk kan spammes.

Bitsocial håndterer publisering gjennom en utfordring-svar-flyt:

1. Brukeren skriver et innlegg eller svar.
2. Appen blir med i fellesskapets peer-to-peer meldingsemne.
3. Appen ber fellesskapsnoden om en utfordring.
4. Fellesskapsnoden sender tilbake utfordringen.
5. Brukeren eller appen fullfører utfordringen.
6. Appen sender innlegget pluss utfordringssvaret.
7. Fellesskapsnoden sjekker svaret og innlegget.
8. Hvis den går gjennom, godtar fellesskapsnoden innlegget i fellesskapets neste oppdatering.
9. Andre lesere henter den oppdaterte fellesskapsstatusen fra jevnaldrende.

Utfordringen skjer før stillingen blir en del av den aksepterte fellesskapsstaten. Det er den viktige forskjellen fra systemer der spam blir akseptert først og gjemt senere.

## Hvorfor anti-spam-utfordringer er viktige

De fleste sosiale plattformer gjør anti-spam til plattformpolitikk. Ett selskap bestemmer hva som teller som en gyldig konto, gyldig innlegg, gyldig rekkevidde eller gyldig bruker.

Bitsocial skiller disse tingene. Protokollen gir fellesskap en måte å kreve en utfordring før de godtar et innlegg, men den tvinger ikke alle fellesskap til å bruke den samme utfordringen.

Ett fellesskap kan bruke en captcha. En annen kan bruke invitasjonskoder. En annen kan kreve en SMS-sjekk, en betaling, en NFT, en token-saldo, en AI-moderasjonspoengsum, et bevis på omdømme, en fellesskapsspesifikk godkjenningsliste eller en tilpasset regel.

Den fleksibiliteten er viktig fordi spam endres. En spamregel på protokollnivå blir gammel. En utfordring på fellesskapsnivå kan utvikle seg uten å migrere hele nettverket.

For den fokuserte forklaringen, les [Tilpassede utfordringer mot spam](./custom-challenges.md).

## Hvordan moderering fungerer

Bitsocial er ikke moderasjonsfri. Det er moderering uten en global superadmin.

Et fellesskap kan ha eiere og moderatorer. Moderatoradresser er en del av fellesskapsstaten. Når en moderator utfører en handling, kan denne handlingen signeres. Fellesskapsnoden og klientene kan sjekke signaturen mot moderatorlisten.

Det gir moderering et lokalt omfang:

- en fellesskapseier kontrollerer dette fellesskapet
- moderatorer handler gjennom nøkler som fellesskapet gjenkjenner
- apper kan fortsatt velge hva de indekserer, rangerer, skjuler eller fremhever
- ingen firmakonto på protokollnivå kan slette enhver identitet eller beslaglegge alle fellesskap

I praksis betyr dette at et fellesskap kan fjerne spam eller håndheve regler i sitt eget område uten å gjøre reglene om til lov for hele nettverket.

For policyvisningen, les [Lokal moderering, ikke globalt forbud](./local-moderation.md).

## Hvilke apper legger til

Protokollen bestemmer ikke hvordan hele produktet skal se ut.

En app legger til den menneskelige opplevelsen rundt protokollen:

- standard fellesskapslister
- søk og oppdagelse
- feeds og rangering
- layout og postingsgrensesnitt
- mediehåndtering
- moderasjonsverktøy
- mobil-, desktop- eller nettleserpakke
- forretningsmodell og standarder

Derfor kan Bitsocial støtte forskjellige appstiler. 5chan kan føles som et bildebrett. Seedit kan føles som diskusjon i forumstil. Andre klienter kan bygge forskjellige oppdagelsesflater, rangeringssystemer, moderasjonsvisninger eller fellesskapsstandarder mens de fortsatt bruker kompatible Bitsocial-fellesskap under.

Protokollen holder eierskap og publisering bærbart. Apper konkurrerer på produktkvalitet.

## Hva offentlig RPC legger til

Å kjøre en node-til-node fellesskapsnode direkte er kraftig, men ikke alle ønsker å administrere en alltid-på-maskin.

Offentlig RPC er tjenestelaget som kan gjøre Bitsocial mer praktisk. En offentlig RPC-leverandør kan hjelpe brukere med å administrere fellesskap fra en telefon eller en lettvektsklient, mens den langsiktige eierskapsmodellen fortsatt bør la brukere flytte bort, være vert for seg selv eller velge en konkurrerende leverandør.

Skillet er viktig:

- RPC kan hjelpe med oppetid og bekvemmelighet
- RPC skal ikke bli permanent varetekt
- eierforholdet skal forbli knyttet til nøkler, ikke til én leverandørs database

## Hva Bitsocial ikke er

Bitsocial er ikke et sosialt blokkjedenettverk. Sosiale medier trenger ikke hvert innlegg for å bli en transaksjon i én global hovedbok.

Bitsocial er ikke føderasjon i ActivityPub-forstand. Et fellesskap trenger ikke å være en konto på én server med ett domene, én admin og én serverdatabase.

Bitsocial er heller ikke én app. Det er et delt protokolllag for apper, fellesskap, noder, rutere, RPC-leverandører, oppdagelsestjenester, anti-spam-moduler og modereringsverktøy.

Poenget er ikke at alle brukere trenger å forstå alt dette før de poster. Poenget er at produktet kan føles normalt mens eierskapsmodellen under er annerledes.

## Hvor du skal dra videre

- [Peer-to-Peer-protokoll](./peer-to-peer-protocol.md) forklarer den tekniske flyten.
- [Oppdagelse av innhold](./content-discovery.md) forklarer nettverksoppslag versus appkurering.
- [Tilpassede utfordringer mot spam](./custom-challenges.md) forklarer utfordringssystemet.
- [Identitet og fellesskapseierskap](./identity-and-ownership.md) forklarer nøkkelkontrollert
  eierskap.
- [Bygg din egen klient](/build-your-own-client/) forklarer hvordan uavhengige apper kan bygge på
  samme nettverk.
