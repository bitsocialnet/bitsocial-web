---
title: Drejtoritë
description: Si u lejojnë aplikacionet Bitsocial komuniteteve të konkurrojnë për një emër teme, në vend që ai t'i mbetet kujt e pretendoi i pari.
---

# Drejtoritë

Në Reddit, një emër si `r/opensource` mund t'i përkasë vetëm një komuniteti, dhe kushdo që e kontrollon e mban. Nëse moderatorët marrin vendime që nuk u pëlqejnë përdoruesve, alternativa e vetme është të nisësh `r/opensource2`. Komuniteti i ri nis me zero abonentë, edhe pse shumica e njerëzve që ishin abonuar te `r/opensource` interesoheshin për burimin e hapur, jo për atë ekip të caktuar moderimi.

Aplikacionet Bitsocial e shmangin këtë me **drejtori**. Një drejtori është një emër teme, si `opensource`, për të cilin konkurrojnë komunitetet. Rruga e shkurtër për atë emër hap komunitetin që aktualisht renditet i pari, kështu që një komunitet më i mirë mund ta marrë emrin pa lejen e askujt.

## Si funksionon

1. **Një kod drejtorie është një emër teme.** Seedit përdor rrugë si `/s/funny`. 5chan përdor shtigje imageboard-i si `/g/`.
2. **Komunitetet konkurrojnë si kandidatë.** Çdo drejtori ka një listë komunitetesh kandidate, secili me adresën e vet të saktë, si `funny-posting.bso`.
3. **Kandidati me renditjen më të lartë fiton rrugën.** Hapja e `/s/funny` shfaq fituesin aktual.
4. **Humbja nuk fshin asgjë.** Një komunitet që nuk është fitues ruan adresën, postimet dhe abonentët e vet, dhe kushdo mund ta hapë ende drejtpërdrejt.

## Emri është derë hyrëse, jo identitet

Një kod drejtorie është vetëm një rrugë zbulimi. Çdo gjë e qëndrueshme tregon drejt një komuniteti të saktë:

- Abonimi nga `/s/funny` të abonon te adresa e saktë e fituesit aktual. Vetë kodi i drejtorisë nuk ruhet kurrë si abonim.
- Lidhjet e postimeve përdorin gjithmonë adresën e saktë të komunitetit, kështu që një lidhje e vjetër nuk mund të fillojë të tregojë drejt një komuniteti tjetër pasi ndryshon fituesi.
- Kur ndryshon fituesi, Seedit i lë të paprekura abonimet ekzistuese dhe e pyet çdo abonent nëse do të kalojë te fituesi i ri, t'i mbajë të dy, apo të mbajë komunitetin aktual. Kalimi automatik është një cilësim për çdo drejtori që duhet aktivizuar vetë, dhe një kalim automatik shfaq një njoftim me mundësi zhbërjeje.

Pra, një komunitet konkurrues nuk ia merr askujt abonimet. Ai fiton emrin: vizitorët e rinj mbërrijnë te ai, dhe abonentët ekzistues marrin një zgjedhje me një klikim. Ata që preferonin komunitetin e vjetër e mbajnë atë.

## Pse jo emra sipas radhës së ardhjes

- **Pa zënie emrash për spekulim.** Të mbash një emër të mirë nuk mjafton. Një komunitet duhet të mbetet kandidati më i mirë për të.
- **Asnjë administrator nuk cakton emra.** Ndarja nga një administrator do të rikrijonte të drejtën qendrore të vetos që Bitsocial është ndërtuar ta heqë.
- **Konkurrentët ruajnë një rrugë drejt publikut.** Një komunitet rival synon të njëjtin emër në vend që të nisë nga e para me një emër më të keq.
- **Klientët bien dakord për fituesin.** Seedit i rendit kandidatët në mënyrë deterministe, kështu që çdo klient që lexon të njëjtën pamje përfundimtare (snapshot) të drejtorisë shfaq të njëjtin fitues. Seedit nuk vendos një kandidat tjetër në vend të fituesit vetëm pse fituesi është përkohësisht i paarritshëm në lidhjen e një përdoruesi.

## Si zgjidhen fituesit sot

Kandidatët publikohen si skedarë JSON në depon [bitsocialnet/lists](https://github.com/bitsocialnet/lists), një skedar për çdo drejtori, dhe një komunitet hyn në një drejtori përmes një pull request-i te skedari i saj. Ky është një hap fillestar i përkohshëm. Synimi është që votimi të zëvendësojë pull request-et si mënyra e vendosjes së fituesve.

- **Seedit** i rendit kandidatët e një drejtorie sipas pikëve, pastaj sipas kohës kur u shtuan, pastaj sipas adresës. Çdo skedar drejtorie ka një numër rishikimi, dhe çdo ndryshim në kandidatët ose në fitues publikon një rishikim të ri.
- **5chan** zhvillon një garë votimi për çdo drejtori me [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Klientët shkëmbejnë fletëvotime të nënshkruara përmes libp2p gossipsub dhe e llogarisin vetë numërimin, pa asnjë server që numëron votat. Për të votuar duhet të kesh një 5chan Pass, një token të patransferueshëm, dhe çdo mbajtës ka një votë. Votimi për një bord që ende nuk është në listë e nominon atë. Garat aktualisht zhvillohen në testnet-in Base Sepolia, dhe derisa të largohen nga testnet-i, rezultatet shfaqen, por nuk e rirendisin listën.

## Protokoll apo aplikacion?

Drejtoritë nuk janë pjesë e PKC, shtresës peer-to-peer që ruan dhe transmeton komunitetet. Ato janë një konventë që klientët e zbatojnë mbi të, krahas listave të paracaktuara dhe kërkimit; shih [Zbulimi i përmbajtjes](./content-discovery.md). Një klient mund të lexojë të njëjtët skedarë drejtorish, të publikojë të vetët, ose t'i anashkalojë fare drejtoritë, dhe përdoruesit mund ta hapin ende çdo komunitet me adresën e tij.
