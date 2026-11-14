---
title: Bitsocial Chain
description: Třetí fáze hlavního plánu popisující navrhovanou ekonomickou vrstvu pro aplikace Bitsocial postavenou jako appchain na Ethereum L2.
---

# Bitsocial Chain

Bitsocial Chain je navrhovaná ekonomická vrstva pro aplikace Bitsocial, postavená jako appchain na
Ethereum L2. Samostatný web věnovaný chainu najdete na
[chain.bitsocial.net](https://chain.bitsocial.net).

Sociální vrstva peer-to-peer umožňuje komunitám, identitám i obsahu existovat mimo centrální
databázi jedné platformy. Bitsocial Chain k tomu má přidat sdílená primitiva pro pojmenování,
monetizaci a platby, díky nimž půjde takové aplikace hůř finančně vyhladovět.

## Co má pohánět

- decentralizované domény Bitsocial, například `.bso`
- ocenění a spropitné
- odolné monetizační kanály
- sdílenou likviditu napříč aplikacemi
- finanční struktury, které banky nebo platformy hůř odstřihnou
- síťové efekty, které nezávisejí na jedné firmě vlastnící celý stack

Cílem není stavět do popředí mechaniku tokenů. Cílem je, aby užitečné sociální aplikace byly
odolnější, snáz financovatelné a méně závislé na centralizovaných poskytovatelích plateb
a pojmenování.

## Současný proof of concept

První proof of concept Bitsocial Chain se soustředí na nativní jména `.bso`. Ukazuje, že registr
jmen lze odvodit z historie Ethereum L1, aniž by se sociální obsah dostal on-chain:

- uživatelé posílají záměry registrovat, aktualizovat, převést a zrušit jméno běžnými transakcemi na
  Ethereum L1
- odvozovací uzel může provozovat kdokoli a zrekonstruovat tentýž stav registru `.bso`
- resolver mapuje jméno `.bso` na veřejný klíč Bitsocial, který klienti už používají v protokolu
  peer-to-peer
- příspěvky, hlasy, moderace, feedy i obsah komunit zůstávají mimo chain a peer-to-peer

Tento proof of concept není produkčním spuštěním na úrovni Stage 2. Zatím nemá důkazní systém,
challenge game, auditovaný kód, živé nasazení, konečné ceny ani konečnou podobu governance.
Dlouhodobě má být ve výchozím stavu transparentní a zároveň navržený tak, aby byl slučitelný se
soukromím: samotný chain je veřejný, zatímco budoucí spropitné, platby, ocenění a likvidita by
neměly vynucovat trvalé propojení mezi sociální identitou a historií peněženky.

## Proč na tom záleží

Decentralizovat komunity a identity je nutné, ale k decentralizaci všech sociálních médií to
nestačí.

Pokud sociální aplikace stále závisejí na několika centralizovaných ekonomických kanálech, je i
nadále snadné na ně tlačit, odstavit je nebo je finančně vyhladovět. Bitsocial Chain je navrhovanou
odpovědí na tuto druhou vrstvu závislosti.

## Vztah k aplikacím

Bitsocial Chain by měl sedět pod aplikacemi Bitsocial, ne je nahrazovat.

Navenek viditelný výsledek by měl být takový, že:

- komunity zůstávají peer-to-peer
- aplikace zůstávají odlišené
- uživatelé dostanou praktické funkce pro pojmenování a monetizaci
- tvůrci a komunity mohou dostávat podporu napříč klienty
- hodnota se může pohybovat napříč ekosystémem, aniž by znovu vznikl centralizovaný vlastník
  platformy

## Proč přichází až po alternativě k Twitteru/X

Současný hlavní plán řadí Bitsocial Chain až za alternativu k Twitteru/X, protože tato aplikace chain nepotřebuje. Profily běží jako profilové uzly přes nekustodiální RPC a jména `.bso` mohou začít v dočasném registru na hlavní síti Etherea ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) a později se přesunout na chain.

Bitsocial Chain by neměl obětovat decentralizaci kvůli dřívějšímu spuštění. Neměl by přidávat žádné předpoklady důvěry nad rámec samotného Etherea: žádné klíče pro upgrade, žádnou bezpečnostní radu a žádného operátora, který by ho mohl cenzurovat nebo zastavit. Hlavní návrh, který to umožňuje, nativní rollup, závisí na upgradu Etherea, který zatím není naplánovaný. Dokud chain tuto laťku nesplní, alternativa k Twitteru/X rozšiřuje uživatelskou základnu, které bude sloužit.

## Principy návrhu

Protože je Bitsocial Chain stále navrhovanou infrastrukturou, a ne spuštěným produktem, měl by plán
zůstat disciplinovaný:

- Nejdřív aplikace a komunity. Síťová vrstva má posilovat skutečné sociální produkty.
- Nejdřív praktické funkce. Jména, ocenění, spropitné a platby se vysvětlují snáz než abstraktní
  finanční architektura.
- Skutečný přínos má přednost před humbukem. Ekonomická primitiva by měla odměňovat účast, budování
  a podporu komunit.
- Kurátorství je v pořádku. Aplikace mohou tvarovat žebříčky, výchozí volby i objevování tak, aby
  zvýhodňovaly trvanlivé komunity.
- Přesné mechanismy zůstávají otevřené. Tato stránka vysvětluje roli Bitsocial Chain, ne pevný slib
  o konečné ekonomice.
