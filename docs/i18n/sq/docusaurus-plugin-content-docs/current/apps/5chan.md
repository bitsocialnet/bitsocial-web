---
title: 5chan
description: Një imageboard pa server dhe i decentralizuar, i ndërtuar mbi protokollin Bitsocial, ku kushdo mund të krijojë dhe të zotërojë borde.
sidebar_position: 1
---

# 5chan

5chan është një imageboard pa server, pa administrator dhe plotësisht i decentralizuar, që funksionon mbi protokollin Bitsocial. Ai ndjek strukturën e njohur të drejtorive të imageboard-eve, duke sjellë njëkohësisht pronësi të decentralizuar — kushdo mund të krijojë një bord dhe disa borde mund të konkurrojnë për të njëjtin vend drejtorie përmes një mekanizmi votimi.

## Shkarkimet

| Platforma | Lidhja                                    |
| --------- | ----------------------------------------- |
| Web       | [5chan.app](https://5chan.app)            |
| Desktop   | Në dispozicion për Mac, Windows dhe Linux |
| Celular   | Në dispozicion për Android                |

## Si funksionojnë bordet

5chan e organizon përmbajtjen në borde duke përdorur një strukturë klasike drejtorish (p.sh. `/b/`, `/g/`). Ndryshe nga imageboard-et tradicionale, ku një administrator qendror kontrollon çdo bord, 5chan i lejon çdo përdoruesi të krijojë dhe të zotërojë plotësisht bordin e vet. Kur disa borde synojnë të njëjtin vend drejtorie, ato konkurrojnë për atë pozicion; shih [Drejtoritë](/directories/).

### Krijimi i një bordi

Për të krijuar një bord të ri, duhet të ekzekutoni `bitsocial-cli` si nyje peer-to-peer. Kjo siguron që bordi juaj të strehohet në mënyrë të decentralizuar, pa u mbështetur në asnjë server qendror.

### Caktimet e drejtorive

Bordet kandidate të çdo drejtorie renditen në një skedar `5chan-directories/5chan-<code>-directory.json` në depon [bitsocialnet/lists](https://github.com/bitsocialnet/lists), dhe një bord hyn në një drejtori përmes një pull request-i te ai skedar. 5chan zhvillon gjithashtu një garë votimi për çdo drejtori me [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting): çdo mbajtës i një 5chan Pass ka një votë, dhe votimi për një bord që nuk është në listë e nominon atë. Garat aktualisht zhvillohen në testnet-in Base Sepolia, ku rezultatet shfaqen, por nuk e rirendisin listën.

## Nga brenda

Nën kapak, 5chan përdor shtresën e përbashkët të klientit të protokollit Bitsocial për ndërveprimet e
tij në rrjet. Aplikacioni web në 5chan.app niset si parazgjedhje me një nyje Helia në shfletues, kështu
që një skedë e zakonshme bashkohet me rrjetin si nyje e barabartë: ngarkon borde nga nyje të tjera dhe
publikon përmes pubsub, pa asnjë portë të centralizuar IPFS në rrugën e përmbajtjes. Shihni
[Peer-to-Peer në shfletues](/browser-p2p/) për të parë se çfarë përfshin kjo dhe çfarë ende nuk mund
të bëjë një nyje në shfletues.

## Lidhjet

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licenca**: GPL-2.0-only
