---
title: Bitsocial dhe ActivityPub
description: Si krahasohet Fediverse, me Mastodon për mikrobloggim dhe Lemmy për komunitete në stilin e Reddit, me komunitetet peer-to-peer të Bitsocial.
---

# Bitsocial dhe ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) është standardi i W3C që qëndron pas Fediverse.
Përdoruesit zgjedhin një server, të quajtur instancë, që strehon llogarinë e tyre, dhe serverët
shkëmbejnë postime me njëri-tjetrin. [Mastodon](https://joinmastodon.org/) është softueri i tij më i
njohur për mikrobloggim; [Lemmy](https://join-lemmy.org/) është një agregator lidhjesh dhe forum në
stilin e Reddit, i ndërtuar nga komunitete tematike, gjë që e bën atë përputhjen më të afërt në
Fediverse për aplikacionet Bitsocial si [Seedit](/apps/seedit/).

## Si funksionon ActivityPub

- **Kutitë hyrëse dhe dalëse.** Çdo llogari ka një kuti hyrëse (inbox) dhe një kuti dalëse (outbox).
  Serverët i dorëzojnë aktivitetet në kutitë hyrëse në serverë të tjerë, dhe çdo server marrës ruan
  kopjen e vet të asaj që ndjekin përdoruesit e tij.
- **Identitet në pronësi të serverit.** ID-të e llogarive dhe të postimeve janë adresa HTTPS në
  domenin e serverit të origjinës. Një emër përdoruesi në Mastodon është `@user@domain`, që zgjidhet
  me WebFinger, dhe serveri i nënshkruan mesazhet e federimit në emër të përdoruesit.
- **Klientët.** Aplikacionet dhe shfletuesit komunikojnë vetëm me serverin e vetë përdoruesit,
  përmes API-së së atij serveri.
- **Komunitetet e Lemmy.** Një komunitet është një aktor grupi i strehuar në një instancë të vetme.
  Përdoruesit i dërgojnë postimet te komuniteti, i cili ua ritransmeton ndjekësve të vet; sipas
  standardit të përbashkët për forumet
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)), një
  komunitet mund t'i verifikojë fillimisht postimet, deri në miratim manual nga moderatorët.
- **Moderimi.** Moderimi është lokal për çdo server. Administratorët mund të pezullojnë llogari, të
  bllokojnë serverë të tërë ose të federohen vetëm me një listë të lejuarish; Lemmy ka gjithashtu
  moderatorë për çdo komunitet.
- **Kontrolli i spamit.** ActivityPub nuk përcakton asnjë mekanizëm kundër spamit. Mastodon dhe
  Lemmy e kufizojnë regjistrimin me miratim, ftesa, pyetje aplikimi, captcha dhe kontrolle emaili,
  dhe më pas mbështeten te kufizimet e shpejtësisë, raportimet dhe moderimi.

## Ku ndryshojnë

### Identiteti i përket një domeni

Një llogari në Fediverse i përket domenit të serverit të saj. Mastodon mund t'i ridrejtojë ndjekësit
te një llogari e re, por [postimet nuk zhvendosen](https://docs.joinmastodon.org/user/moving/),
zhvendosja duhet të nisë nga serveri i vjetër, dhe ka një periudhë pritjeje prej 30 ditësh. Te
Bitsocial, profilet dhe komunitetet janë çifte çelësash, kështu që ndryshimi i strehuesit ose i
aplikacionit nuk e ndryshon identitetin. Shihni
[Identiteti dhe Pronësia e Komunitetit](/identity-and-ownership/).

### Ku ndodhet një komunitet

Një komunitet Lemmy është strukturalisht i afërt me një komunitet Bitsocial: postimet shkojnë te
komuniteti, i cili mund t'i kontrollojë përpara se t'i ritransmetojë. Dallimi është se ku ndodhet.
Një komunitet Lemmy mund të krijohet vetëm në instancën shtëpi të krijuesit të tij, administratori i
instancës ka [kontroll të plotë](https://join-lemmy.org/docs/users/05-censorship-resistance.html)
mbi të, dhe nuk ka mënyrë të dokumentuar për ta zhvendosur në një instancë tjetër. Një komunitet
Bitsocial është çifti i vet i çelësave: pronari mund ta ekzekutojë nyjen e tij kudo, dhe mbi të nuk
qëndron asnjë administrator serveri.

### Kontrolli i spamit

Serverët e Fediverse e ndalin spamin kryesisht gjatë regjistrimit dhe moderojnë më pas. Një
komunitet Bitsocial ekzekuton një sfidë për çdo postim përpara se ta pranojë, dhe çdo komunitet
zgjedh sfidën e vet: captcha, listë të lejuarish, pagesë ose çfarëdo kodi tjetër. Shihni
[Sfidat e personalizuara kundër spamit](/custom-challenges/).

### Operimi i infrastrukturës

Mbajtja e një instance do të thotë një server gjithmonë në punë me domen, TLS dhe email. Mastodon ka
nevojë gjithashtu për PostgreSQL, Redis dhe procese pune në sfond; Lemmy është më i lehtë, rreth 150
MB RAM sipas të dhënave të veta. Çdo instancë ruan kopje të përmbajtjes së largët që ndjekin
përdoruesit e saj. Një nyje komuniteti Bitsocial nuk ka nevojë për domen apo certifikatë dhe
funksionon nga aplikacioni desktop ose nga `bitsocial-cli`.

### Çfarë japin serverët në këmbim

Serverët e Fediverse ruajnë historikun e plotë dhe e shërbejnë atë në mënyrë të besueshme, dhe
Mastodon ka mjete të pjekura moderimi të ndërtuara ndër vite. Bitsocial nuk e garanton përgjithmonë
përmbajtjen e vjetër, dhe mjetet e tij të moderimit ndodhen në secilin aplikacion.

## Krahasimi

| Pyetja               | ActivityPub (Mastodon, Lemmy)                                                                    | Bitsocial                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Kategoria            | Serverë të federuar                                                                              | Rrjet komunitetesh peer-to-peer                                                           |
| Identiteti           | Llogari në domenin e një serveri, e nënshkruar nga serveri                                       | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                    |
| Ku ruhen postimet    | Serveri i origjinës, plus kopje në çdo server që ndjek                                           | Nyja e pronarit të komunitetit dhe homologët që e lexojnë dhe e shpërndajnë               |
| Kush e mban në linjë | Administratorët e instancave                                                                     | Nyja e pronarit të komunitetit plus seeder-a ndihmës                                      |
| Komunitetet          | Komunitete Lemmy të strehuara në një instancë të vetme                                           | Objekte të klasit të parë, nyja e të cilave i pranon ose i refuzon postimet               |
| Kontrolli i spamit   | Porta në regjistrim, kufizime shpejtësie, raportime dhe moderim                                  | Sfida e secilit komunitet përpara se një postim të pranohet                               |
| Moderimi             | Administratorët e serverëve dhe moderatorët e komuniteteve, lokalisht në çdo server              | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin |
| Emrat                | Emra `@user@domain` dhe `!community@domain`                                                      | Emra `.bso` dhe `.eth` që zgjidhen në çelësa                                              |
| Shfletuesi           | Klient i serverit të vetë përdoruesit                                                            | Nyje peer-to-peer brenda një skede të zakonshme shfletuesi                                |
| Kompromisi kryesor   | Historik i besueshëm dhe moderim i pjekur, por identiteti dhe komunitetet i përkasin një serveri | Nuk nevojitet server apo domen, por përmbajtja e vjetër nuk garantohet përgjithmonë       |
