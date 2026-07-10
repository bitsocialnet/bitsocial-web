---
title: Një shpjegim i plotë laik i protokollit Bitsocial
description: Një përshkrim i thjeshtë në anglisht i komuniteteve Bitsocial, kërkimi i kolegëve, publikimi, sfidat kundër spamit, moderimi dhe aplikacionet.
---

# Një shpjegim i plotë laik i protokollit Bitsocial

Kjo faqe shpjegon Bitsocial pa supozuar se tashmë e kuptoni rrjetin peer-to-peer, çelësat kriptografikë, IPFS ose pubsub.

Disa detaje janë thjeshtuar me qëllim. Për versionin më teknik, lexoni faqen [Protokolli Peer-to-Peer](./peer-to-peer-protocol.md).

## Versioni i shkurtër

Bitsocial është një protokoll për aplikacionet sociale ku komunitetet janë në pronësi të çelësave në vend të bazës së të dhënave të kompanisë.

Një komunitet Bitsocial ka një adresë. Aplikacionet e përdorin atë adresë për të gjetur kolegë që i shërbejnë komunitetit, për të marrë postimet më të fundit nga ata kolegë dhe për të publikuar postime të reja përmes një kanali mesazhesh nga kolegët. Përpara se një postim të pranohet, komuniteti mund të kërkojë një sfidë anti-spam, si për shembull një captcha, kod ftese, pagesë, kontroll token, kontroll për moderimin e AI, listën e lejeve ose çdo rregull tjetër që mund të kodohet.

Kjo është ideja kryesore:

1. Një komunitet kontrollohet nga një çelës privat.
2. Çelësi publik i jep komunitetit një adresë të qëndrueshme.
3. Kolegët i ndihmojnë lexuesit të gjejnë dhe të marrin komunitetin.
4. Një nyje e komunitetit pranon ose refuzon postimet e reja.
5. Politika anti-spam i përket çdo komuniteti, jo një platforme globale.

## Pse kanë rëndësi hashet

Një hash është një gjurmë gishti e shkurtër për të dhënat.

Nëse dy persona hasin saktësisht të njëjtin skedar, ata marrin të njëjtën gjurmë gishti. Nëse skedari ndryshon, gjurma e gishtit ndryshon. Kjo i bën hash-et të dobishme për gjetjen dhe kontrollimin e të dhënave pa i besuar një kompanie për t'ju treguar se çfarë është skedari.

Sistemet “peer-to-peer” e përdorin këtë ide vazhdimisht. Në vend që të kërkojë një faqe interneti për "skedarin e quajtur photo.png", një koleg mund t'i kërkojë rrjetit të dhënat me një gjurmë gishtash specifike. Nëse një koleg tjetër kthen të dhëna të gabuara, kontrolli i hash-it dështon.

Bitsocial përdor hash dhe identifikues të përmbajtjes për të dhënat e postimit dhe pjesë të tjera të gjendjes së komunitetit. Pika e rëndësishme është e thjeshtë: të dhënat mund të adresohen nga ajo që janë, jo vetëm nga vendi ku i ka pritur një kompani.

## Pse kanë rëndësi çelësat publikë

Një çelës publik dhe një çelës privat janë një çift i përputhur.

Çelësi privat është sekret. Është gjëja që jep kontroll. Çelësi publik është i sigurt për t'u ndarë. Ai i lejon të gjithë të tjerët të kontrollojnë nëse një mesazh, përditësim ose veprim i moderimit ka ardhur vërtet nga çelësi privat që përputhet.

Kjo është mënyra se si Bitsocial shmang llogaritë normale të platformës. Një kompani nuk ka nevojë të lëshojë identitetin. Një rresht i bazës së të dhënave nuk ka nevojë të përcaktojë pronarin. Çifti i çelësave është autoriteti.

Në terma të thjeshtë:

- çelësi privat është doreza e kontrollit të pronarit
- çelësi publik është identiteti ose adresa publike
- nënshkrimet vërtetojnë se një veprim ka ardhur nga pronari

## Çfarë është një komunitet Bitsocial

Një komunitet Bitsocial nuk është vetëm një faqe në një aplikacion.

Ajo ka çiftin e vet të çelësave. Çelësi publik i jep komunitetit një adresë të qëndrueshme rrjeti. Çelësi privat kontrollon përditësimet në gjendjen e komunitetit, të tilla si meta të dhënat, rregullat, listën e moderatorëve, konfigurimin e sfidave dhe treguesit për përmbajtjen më të fundit të pranuar.

Kjo do të thotë që një komunitet mund të jetë më i gjatë se një ndërfaqe. Një aplikacion mund ta shfaqë atë si një tabelë. Një aplikacion tjetër mund ta shfaqë atë si një forum. Një aplikacion i ardhshëm mund ta shfaqë atë në një furnizim të bazuar në profil. Aplikacioni mund të ndryshojë, por adresa e komunitetit ende tregon për të njëjtin komunitet në pronësi.

## Si funksionon leximi

Kur një përdorues hap një komunitet Bitsocial, aplikacioni nuk kërkon një bazë të dhënash qendrore për faqen.

Rrjedha është më afër kësaj:

1. Aplikacioni tashmë e njeh adresën e komunitetit ose e merr atë nga një listë, lidhje, sipërfaqe kërkimi ose
   emër i lexueshëm nga njeriu.
2. Aplikacioni kërkon ruterë të lehtë se cilët kolegë ofrojnë aktualisht atë adresë komuniteti.
3. Ruterët kthejnë vetëm adresat e kolegëve. Ata nuk kthejnë postime, rregulla, profile ose komunitet
   meta të dhënat.
4. Aplikacioni lidhet me kolegët dhe merr gjendjen më të fundit të komunitetit.
5. Kjo gjendje përmban tregues për të postuar përmbajtje.
6. Aplikacioni merr përmbajtjen e postimit nga kolegët dhe e jep atë në një ndërfaqe normale sociale.

Ruteri është vetëm një ndihmës kërkimi. Është më afër pyetjes "kush e ka këtë?" sesa të pyesni "ju lutem më shërbeni të gjithë faqen e internetit."

Për më shumë detaje mbi këtë ndarje, lexoni [Zbulimi i përmbajtjes](./content-discovery.md).

## Si funksionon postimi

Postimi është i ndryshëm nga leximi sepse rrjetet e hapura "peer-to-peer" mund të postohen me spam.

Bitsocial trajton publikimin përmes një fluksi sfidash-përgjigje:

1. Përdoruesi shkruan një postim ose përgjigje.
2. Aplikacioni bashkohet me temën e mesazheve bashkëmoshatare të komunitetit.
3. Aplikacioni kërkon një sfidë nga nyja e komunitetit.
4. Nyja e komunitetit e kthen përsëri sfidën.
5. Përdoruesi ose aplikacioni plotëson sfidën.
6. Aplikacioni dërgon postimin plus përgjigjen e sfidës.
7. Nyja e komunitetit kontrollon përgjigjen dhe postimin.
8. Nëse kalon, nyja e komunitetit e pranon postimin në përditësimin e radhës të komunitetit.
9. Lexues të tjerë marrin gjendjen e përditësuar të komunitetit nga kolegët.

Sfida ndodh përpara se posti të bëhet pjesë e shtetit komunitar të pranuar. Ky është ndryshimi i rëndësishëm nga sistemet ku spam-i pranohet fillimisht dhe fshihet më vonë.

## Pse kanë rëndësi sfidat anti-spam

Shumica e platformave sociale e kthejnë anti-spam-in në politikë të platformës. Një kompani vendos se çfarë llogaritet si një llogari e vlefshme, postim i vlefshëm, shtrirje e vlefshme ose përdorues i vlefshëm.

Bitsocial i ndan ato gjëra. Protokolli u jep komuniteteve një mënyrë për të kërkuar një sfidë përpara se të pranojnë një post, por nuk e detyron çdo komunitet të përdorë të njëjtën sfidë.

Një komunitet mund të përdorë një captcha. Një tjetër mund të përdorë kodet e ftesës. Një tjetër mund të kërkojë një kontroll SMS, një pagesë, një NFT, një bilanc simbolik, një rezultat moderimi të AI, një dëshmi reputacioni, një listë lejesh specifike për komunitetin ose një rregull me porosi.

Ky fleksibilitet ka rëndësi sepse mesazhet e padëshiruara ndryshojnë. Një rregull i postës së padëshiruar në nivel protokolli bëhet bajat. Një sfidë në nivel komuniteti mund të zhvillohet pa migruar të gjithë rrjetin.

Për shpjegimin e fokusuar, lexoni [Sfidat e personalizuara kundër spamit](./custom-challenges.md).

## Si funksionon moderimi

Bitsocial nuk është pa moderim. Është moderim pa një super-administrator global.

Një komunitet mund të ketë pronarë dhe moderatorë. Adresat e moderatorëve janë pjesë e shtetit komunitar. Kur një moderator ndërmerr një veprim, ai veprim mund të nënshkruhet. Nyja e komunitetit dhe klientët mund të kontrollojnë nënshkrimin kundrejt listës së moderatorëve.

Kjo i jep moderimit një shtrirje lokale:

- një pronar i komunitetit kontrollon atë komunitet
- moderatorët veprojnë përmes çelësave që komuniteti njeh
- aplikacionet ende mund të zgjedhin atë që indeksojnë, renditin, fshehin ose theksojnë
- asnjë llogari kompanie në nivel protokolli nuk mund të fshijë çdo identitet ose të kapë çdo komunitet

Në praktikë, kjo do të thotë që një komunitet mund të heqë mesazhet e padëshiruara ose të zbatojë rregullat brenda hapësirës së tij pa i kthyer rregullat e tij në ligj për të gjithë rrjetin.

Për pamjen e politikave, lexoni [Moderimi lokal, jo ndalimet globale](./local-moderation.md).

## Çfarë aplikacionesh shtojnë

Protokolli nuk vendos se si duhet të duket i gjithë produkti.

Një aplikacion shton përvojën njerëzore rreth protokollit:

- listat e paracaktuara të komuniteteve
- kërkimi dhe zbulimi
- prurjet dhe renditja
- faqosja dhe ndërfaqja e postimit
- trajtimin e mediave
- mjetet e moderimit
- paketim celular, desktop ose shfletues
- modeli i biznesit dhe standardet

Kjo është arsyeja pse Bitsocial mund të mbështesë stile të ndryshme aplikacionesh. 5chan mund të ndihet si një tabelë imazhi. Seedit mund të duket si diskutim i stilit të forumit. Klientë të tjerë mund të ndërtojnë sipërfaqe të ndryshme zbulimi, sisteme renditjeje, pamje moderimi ose parazgjedhje të komunitetit, ndërkohë që ende përdorin bashkësi të pajtueshme Bitsocial poshtë.

Protokolli mban pronësinë dhe publikimin të lëvizshëm. Aplikacionet konkurrojnë për cilësinë e produktit.

## Çfarë shton RPC publike

Drejtimi i drejtpërdrejtë i një nyje të komunitetit peer-to-peer është i fuqishëm, por jo të gjithë duan të menaxhojnë një makinë gjithmonë ndezur.

RPC publike është shtresa e shërbimit që mund ta bëjë Bitsocial më të përshtatshëm. Një ofrues publik RPC mund t'i ndihmojë përdoruesit të menaxhojnë komunitetet nga një telefon ose klient i lehtë, ndërsa modeli afatgjatë i pronësisë duhet t'i lejojë përdoruesit të largohen, të vetë-strehojnë ose të zgjedhin një ofrues konkurrues.

Dallimi ka rëndësi:

- RPC mund të ndihmojë me kohën dhe komoditetin
- RPC nuk duhet të bëhet kujdestari i përhershëm
- marrëdhënia e pronarit duhet të mbetet e lidhur me çelësat, jo me bazën e të dhënave të një ofruesi

## Çfarë nuk është Bitsocial

Bitsocial nuk është një rrjet social blockchain. Mediat sociale nuk kanë nevojë për çdo postim për t'u bërë një transaksion në një libër global.

Bitsocial nuk është federatë në kuptimin ActivityPub. Një komunitet nuk ka nevojë të jetë një llogari në një server me një domen, një administrator dhe një bazë të dhënash serveri.

Bitsocial gjithashtu nuk është një aplikacion i vetëm. Është një shtresë e përbashkët protokolli për aplikacionet, komunitetet, nyjet, ruterat, ofruesit e RPC, shërbimet e zbulimit, modulet anti-spam dhe mjetet e moderimit.

Çështja nuk është se çdo përdorues duhet t'i kuptojë të gjitha këto përpara se të postojë. Çështja është se produkti mund të ndihet normal ndërsa modeli i pronësisë poshtë është i ndryshëm.

## Ku të shkoni më pas

- [Protokolli Peer-to-Peer](./peer-to-peer-protocol.md) shpjegon rrjedhën teknike.
- [Zbulimi i përmbajtjes](./content-discovery.md) shpjegon kërkimin e rrjetit kundrejt kurimit të aplikacionit.
- [Sfidat e personalizuara kundër spamit](./custom-challenges.md) shpjegon sistemin e sfidës.
- [Identiteti dhe Pronësia e Komunitetit](./identity-and-ownership.md) shpjegon key-controlled
  pronësinë.
- [Ndërtoni klientin tuaj](/build-your-own-client/) shpjegon se si aplikacionet e pavarura mund të ndërtohen në
  të njëjtin rrjet.
