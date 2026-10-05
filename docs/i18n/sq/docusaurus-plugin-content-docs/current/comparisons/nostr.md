---
title: Bitsocial dhe Nostr
description: Si krahasohet modeli i Nostr, i bazuar në rele, me komunitetet peer-to-peer të Bitsocial, nga rruga e të dhënave dhe identiteti deri te grupet, kontrolli i spamit dhe moderimi.
---

# Bitsocial dhe Nostr

Nostr nuk hyn pastër as te kategoria e federuar, as te ajo e blockchain-it. Përdoruesve nuk u jepen
llogari nga instancat, dhe nuk ka zinxhir, konsensus, gaz apo renditje globale. Nostr përshkruhet më
mirë si **media sociale e bazuar në rele**: përdoruesit mbajnë çifte çelësash, nënshkruajnë ngjarje
dhe i publikojnë ato te relet, të cilat janë serverë të zakonshëm që i ruajnë dhe i shërbejnë
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Vetë
[README](https://github.com/nostr-protocol/nostr) i Nostr thotë se ai nuk mbështetet në teknika
peer-to-peer.

Kjo e vendos Nostr më afër Bitsocial sesa sistemet e federuara ose ato mbi blockchain në një pikë të
rëndësishme: identiteti është kriptografik dhe i transportueshëm. Dallimet janë te shtresa e të
dhënave dhe te pyetja se kush e kontrollon hyrjen.

## Si funksionon Nostr

- **Ngjarjet dhe relet.** Çdo postim, profil ose reagim është një ngjarje JSON e nënshkruar.
  Klientët i publikojnë ngjarjet te relet përmes WebSockets dhe abonohen me filtra; relet i ruajnë
  ngjarjet dhe ua kthejnë klientëve. Relet nuk komunikojnë me njëra-tjetrën.
- **Replikimi.** Zakonisht përdoruesit publikojnë te disa rele. Një studim i 712 releve në vitin
  2023 zbuloi se postimi mesatar gjendej në 34,6 prej tyre
  ([Wei and Tyson](https://arxiv.org/abs/2402.05709)).
- **Gjetja e postimeve të dikujt.** Përdoruesit publikojnë një listë të releve ku shkruajnë dhe nga
  të cilat lexojnë ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), dhe
  klientët i marrin postimet e një përdoruesi nga relet e shkrimit të atij përdoruesi.
- **Identiteti.** Çdo përdorues është një çelës secp256k1 që nënshkruan me nënshkrime Schnorr.
  Specifikimet nuk përcaktojnë rrotullim ose rikuperim çelësi, kështu që një çelës i humbur do të
  thotë një llogari e humbur. Identifikuesit opsionalë `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) kontrollohen kundrejt një
  skedari në serverin web të atij domeni.
- **Grupet.** Mekanizmi i rekomanduar për komunitetet janë grupet e bazuara në rele
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): një rele e strehon grupin,
  zbaton rregullat e tij të anëtarësimit dhe të postimit përpara se të pranojë një postim, dhe
  nënshkruan meta të dhënat e tij. Komunitetet më të vjetra të miratuara nga moderatorët
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) tani shënohen si të
  parekomanduara në favor të NIP-29.
- **Kontrolli i spamit.** Çdo rele zgjedh vetë portën e saj: provë pune
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autentikim dhe lista të
  lejuarish ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), pagesë ose
  kufizime shpejtësie. Klientët shtojnë lista heshtjeje dhe vlerësime besimi.
- **Media.** Imazhet dhe videot ngarkohen në serverë të veçantë skedarësh HTTP.

## Ku ndryshojnë

### Kush i ruan dhe i shërben postimet

Te Nostr, relet janë shtresa e ruajtjes dhe e shpërndarjes: një server duhet ta mbajë online çdo
postim. Te Bitsocial, ruterët HTTP vetëm i ndihmojnë klientët të gjejnë homologë. Ata nuk ruajnë
postime, profile, meta të dhëna komunitetesh apo gjendje moderimi; klientët e marrin përmbajtjen nga
nyja e komunitetit dhe nga homologët që e shpërndajnë. Shihni
[Protokolli Peer-to-Peer](/peer-to-peer-protocol/).

### Kush e kontrollon hyrjen

Portat e shkrimit te Nostr u përkasin operatorëve të releve. Jashtë grupeve NIP-29, një çelës i
refuzuar nga një rele mund ta publikojë të njëjtën ngjarje te çdo rele që e pranon, dhe ajo që
shohin lexuesit varet nga relet që lexon klienti i tyre. Një grup NIP-29 është më afër një
komuniteti Bitsocial: releja që e strehon i pranon ose i refuzon postimet. Megjithatë releja vazhdon
të përcaktojë çfarë mund të bëjnë rolet e grupit, dhe historiku i grupit mbetet i lidhur me atë
rele, përveç nëse një rele tjetër pranon ta marrë përsipër.

Te Bitsocial, një komunitet është një objekt kriptografik me çiftin e vet të çelësave. Nyja e
komunitetit ekzekuton cilëndo sfidë që zgjedh pronari dhe publikon gjendjen e pranuar në rrjetin
peer-to-peer. Shihni [Sfidat e personalizuara kundër spamit](/custom-challenges/).

### Operimi i infrastrukturës

Një rele është një server me domen dhe një pikë fundore WebSocket, dhe relet e popullarizuara e
mbajnë vetë koston e ruajtjes dhe të gjerësisë së brezit për atë që shërbejnë. Studimi i vitit 2023
vlerësoi se rreth 95% e releve falas nuk mund t'i mbulonin kostot e tyre me dhurime. Një nyje
komuniteti Bitsocial funksionon në pajisje të zakonshme konsumatori, dhe homologët që lexojnë një
komunitet mund të ndihmojnë në shpërndarjen e tij.

### Shfletuesi

Një klient web i Nostr hap lidhje WebSocket drejtpërdrejt me relet, kështu që nuk nevojitet server
aplikacioni. Një aplikacion web i Bitsocial ekzekuton një nyje peer-to-peer në skedë dhe e merr
përmbajtjen nga homologët. Shihni [Peer-to-Peer në shfletues](/browser-p2p/).

### Përmbajtja e vjetër

Postimet e Nostr replikohen gjerësisht nëpër rele, gjë që i ndihmon postimet e vjetra të mbijetojnë.
Bitsocial mban gjendjen më të fundit të komunitetit dhe nuk e garanton përgjithmonë përmbajtjen e
vjetër.

## Krahasimi

| Pyetja               | Nostr                                                                                                | Bitsocial                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Kategoria            | Protokoll i bazuar në rele                                                                           | Rrjet komunitetesh peer-to-peer                                                           |
| Identiteti           | Çelës përdoruesi secp256k1, pa rrotullim në specifikime                                              | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                    |
| Ku ruhen postimet    | Rele të zgjedhura nga autori, shpesh shumë                                                           | Nyja e pronarit të komunitetit dhe homologët që e lexojnë dhe e shpërndajnë               |
| Kush e mban në linjë | Operatorët e releve                                                                                  | Nyja e pronarit të komunitetit plus seeder-a ndihmës                                      |
| Komunitetet          | Grupe të strehuara te relet (NIP-29)                                                                 | Objekte të klasit të parë, nyja e të cilave i pranon ose i refuzon postimet               |
| Kontrolli i spamit   | Politika e secilës rele: provë pune, autentikim, pagesë, lista të lejuarish, kufizime shpejtësie     | Sfida e secilit komunitet përpara se një postim të pranohet                               |
| Moderimi             | Politikat e releve, lista heshtjeje në klientë, etiketa dhe raportime                                | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin |
| Emrat                | Identifikues opsionalë `name@domain` të kontrolluar përmes HTTPS                                     | Emra `.bso` dhe `.eth` që zgjidhen në çelësa                                              |
| Shfletuesi           | Klient WebSocket i releve                                                                            | Nyje peer-to-peer brenda një skede të zakonshme shfletuesi                                |
| Kompromisi kryesor   | Identitet i transportueshëm dhe replikim i gjerë, por disponueshmëri dhe politika që varen nga relet | Më pak varësi nga relet, por përmbajtja e vjetër nuk garantohet përgjithmonë              |
