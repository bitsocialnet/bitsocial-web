---
title: Zbulimi i përmbajtjes
description: Si e ndan Bitsocial zbulimin e kolegëve nga kurimi në nivel aplikacioni.
---

# Zbulimi i përmbajtjes

Bitsocial nuk vendos një furnizim global, indeks kërkimi ose algoritëm renditjeje në protokoll. Ai ndan zbulimin e përmbajtjes në dy shtresa:

1. **Kërkimi i rrjetit** gjen kolegët që aktualisht i shërbejnë një komuniteti të njohur.
2. **Kurimi i aplikacionit** vendos se cilat komunitete, tabela, lista ose postime do të shfaqen së pari një produkt.

Kjo e mban protokollin të vogël duke lënë hapësirë ​​për shumë eksperienca zbulimi për të konkurruar.

## Kërkimi i rrjetit

Çdo komunitet ka një adresë të qëndrueshme që rrjedh nga çelësi i tij publik. Kur një klient e di tashmë atë adresë, ai kërkon ruterë të lehtë HTTP për të gjetur kolegë që e shpallën veten si ofrues për të.

Ruterët kthejnë vetëm adresat e ofruesit të kolegëve. Ata nuk ruajnë postime, meta të dhëna, lista përdoruesish ose një drejtori të komuniteteve të lexueshme nga njeriu. Pasi klienti të marrë adresat e kolegëve, ai lidhet me ata kolegë dhe merr meta të dhënat më të fundit të komunitetit plus treguesit e përmbajtjes, më pas merr të dhënat aktuale të postimit me hash.

Kjo i përgjigjet pyetjes së protokollit: "Ku mund të marr gjendjen më të fundit për këtë komunitet?"

## Kurimi i aplikacionit

Pyetja e veçantë e produktit është: "Cilat komunitete duhet të shohë së pari një përdorues?"

Bitsocial ua lë këtë aplikacioneve, listave dhe përdoruesve në vend që të vendosë një përgjigje në rrjet. Shembujt përfshijnë:

- një klient që tregon komunitetet që përdoruesi tashmë ndjek
- një listë e paracaktuar e kuruar për një aplikacion të stilit Reddit
- lojëra elektronike të drejtorisë për një aplikacion të stilit të imazhit
- indekset e kërkimit ose të renditjes të mbajtura nga një aplikacion specifik
- lidhje direkte të ndara nga përdoruesit

Aplikacionet mund të indeksojnë, renditin, filtrojnë ose nxjerrin në pah gjëra të ndryshme pa i kthyer ato zgjedhje në ligjin e protokollit. Nëse sipërfaqja e zbulimit të një aplikacioni nuk është e dobishme, një aplikacion tjetër mund të ndërtojë një tjetër në të njëjtat komunitete themelore.

## Aplikacionet aktuale

5chan aktualisht përdor shtigje të njohura të drejtorive si `/b/` ose `/g/`. Detyrat e drejtorive menaxhohen përmes një liste publike sot, me versionet e ardhshme që pritet të mbështesin krijimin e bordit brenda aplikacionit dhe votimin për lojëra elektronike të drejtorive.

Seedit përdor listat e paracaktuara të komuniteteve për faqen e saj të parë. Komunitetet ende mund të krijohen dhe ndahen jashtë asaj liste të paracaktuar.

Në të dyja rastet, lista e nivelit të aplikacionit i ndihmon përdoruesit të gjejnë diçka për të hapur dhe kërkimi i nivelit të protokollit më pas zgjidh komunitetin e zgjedhur tek kolegët.

## Pse ka rëndësi kjo ndarje

Një rrjet i vetëm i decentralizuar ende ka nevojë për zbulim të mirë, por shtresa e zbulimit duhet të jetë e zëvendësueshme. Protokolli kryesor i Bitsocial fokusohet në adresueshmërinë, kërkimin e kolegëve, publikimin dhe anti-spam. Kurimi jeton mbi atë shtresë, ku aplikacionet mund të eksperimentojnë me drejtoritë, listat e paracaktuara, furnizimet, politikat e kërkimit, votimit dhe moderimit pa kërkuar një migrim në të gjithë rrjetin.
