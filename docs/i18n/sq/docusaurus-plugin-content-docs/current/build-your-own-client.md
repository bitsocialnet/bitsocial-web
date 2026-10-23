---
title: Ndërtoni klientin tuaj Bitsocial
description: Udhëzues për ndërtuesit që duan të nxjerrin klientë Bitsocial të pavarur, nga imageboard-et dhe forumet te aplikacionet sociale të specializuara.
---

# Ndërtoni klientin tuaj Bitsocial

Bitsocial nuk fiton duke pasur një aplikacion zyrtar për çdo rast përdorimi. Fiton kur shumë klientë
mund të ndajnë të njëjtin protokoll, ndërsa konkurrojnë me ndërfaqen, kulturën, zbulimin,
parazgjedhjet dhe modelin e biznesit.

5chan dhe Seedit janë prova të hershme, jo një tavan. Një ndërtues duhet të jetë në gjendje të nxjerrë
një imageboard të ri, një forum, një klient profilesh, një aplikacion social që vë celularin në radhë
të parë, një mjet për një komunitet të ngushtë ose një klient të centralizuar që përdor Bitsocial nën
kapak, pa i kërkuar leje asnjë pronari platforme.

## Çfarë mund të ndryshojnë ndërtuesit

Një klient Bitsocial mund të konkurrojë me vendime produkti pa e degëzuar të gjithë rrjetin:

- ndërfaqen dhe gjuhën vizuale
- rrjedhën e hyrjes së përdoruesve të rinj
- parazgjedhjet e komunitetit
- sipërfaqet e moderimit
- modelin e zbulimit
- përvojën me median
- kufizimet për celular, desktop ose lidhje me brez të ngushtë
- monetizimin dhe modelin e biznesit

Shtresa e përbashkët është protokolli. Shtresa e produktit është e hapur për konkurrencë.

## Mënyra më e shpejtë për të mësuar

Nisni nga aplikacionet që ekzistojnë tashmë:

- Provoni [5chan](https://5chan.app) për komunitete anonime të tipit imageboard.
- Provoni [Seedit](https://seedit.app) për diskutime në stilin e Reddit.
- Lexoni dokumentacionin e [React hooks të Bitsocial](https://hooks.bitsocial.net/docs/quickstart/) për integrimin nga ana e klientit.
- Lexoni dokumentacionin e [Bitsocial CLI](/developer-tools/cli/) për veprimet me nyjet dhe komunitetet.

Nëse doni të ecni shpejt, kontribuoni fillimisht në një aplikacion ekzistues. Nëse ndërfaqja, kultura
ose modeli i komunitetit që kërkoni nuk përshtaten, ndërtoni një klient më vete.

## Zgjidhni një version të parë të ngushtë

Versioni i parë më i mirë nuk është një aplikacion social universal. Është një klient me një publik të
qartë dhe një arsye të fortë për të ekzistuar.

Pika të mira nisjeje janë:

- një klient imageboard më i pastër për një kulturë të caktuar
- një klient forumi që vë celularin në radhë të parë
- një aplikacion për një komunitet të vetëm me parazgjedhje të rrepta
- një klient për komunitete krijuesish
- një klient zbulimi vetëm për lexim
- një konsolë moderimi ose operatori
- një klient i optimizuar për një gjuhë, rajon ose klasë pajisjesh

Klientët e vegjël janë të dobishëm sepse Bitsocial i lejon të rriten brenda të njëjtit rrjet, në vend
që t'i mbyllin përdoruesit e tyre në një bazë të dhënash private.

## Rrugë zbatimi

Ka tri rrugë praktike:

1. Degëzoni një klient ekzistues kur ideja juaj është afër 5chan ose Seedit.
2. Ndërtoni një klient të ri React me [React hooks të Bitsocial](https://hooks.bitsocial.net/).
3. Ndërtoni integrimin tuaj mbi API-të e nyjeve dhe infrastrukturën publike RPC.

RPC-ja publike duhet ta bëjë rrugën e tretë shumë më praktike. Një përdorues mund të nisë nëpërmjet
një ofruesi RPC të strehuar dhe jo-kujdestar, e më pas të kalojë te vetëstrehimi ose te një ofrues
konkurrues.

## Parim projektimi

Ndërtoni klientin që duhet të ekzistojë për komunitetin tuaj, pastaj lini klientët e pajtueshëm të
konkurrojnë hapur.
